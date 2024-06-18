import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { promises as fs } from 'fs';
import * as path from 'path';
import { Like, Repository } from 'typeorm';
import { MediaPathService } from '../media-path/media-path.service';
import { Media } from '../models/media.model';

@Injectable()
export class MediaService implements OnModuleInit {
  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
    private readonly mediaPathService: MediaPathService,
  ) {}

  async onModuleInit() {
    await this.syncMedia();
  }

  /**
   * This function get all media path in db and use it to sync media .
   * @returns success if all media path are synced.
   */
  async syncMedia() {
    const mediaPaths = await this.mediaPathService.findAll();
    if (mediaPaths.length === 0) {
      return {
        success: false,
      };
    }

    for (const mediaPath of mediaPaths) {
      const sync = await this.syncFolder(mediaPath.path);
      if (sync.success) {
        console.log(`Synced ${sync.files} in ${mediaPath.path}`);
      }
    }

    return {
      success: true,
    };
  }

  /**
   * Synchronizes the media folder with the database.
   * @param folder path of the folder to be synchronized.
   * @returns success if the folder is synchronized.
   * @returns files list of files in the folder.
   */
  async syncFolder(folder: string) {
    let files: string[];
    try {
      files = await fs.readdir(folder);
    } catch (error) {
      console.log(`Error reading folder ${folder}`);
      return {
        success: false,
      };
    }

    let existingMedia = await this.mediaRepository.find({
      where: {
        path: Like(`${folder}%`),
      },
    });

    // New file
    for (const file of files) {
      const filePath = path.join(folder, file);
      const stats = await fs.stat(filePath);
      if (stats.isFile()) {
        const mediaExists = await this.mediaRepository.findOne({
          where: { inode: stats.ino },
        });
        if (!mediaExists) {
          await this.addMedia(file, folder);
        }
      }
    }

    // Update existingMedia after adding new files
    existingMedia = await this.mediaRepository.find({
      where: {
        path: Like(`${folder}%`),
      },
    });

    // File renamed
    for (const file of files) {
      const filePath = path.join(folder, file);
      const stats = await fs.stat(filePath);
      for (const media of existingMedia) {
        if (stats.ino === media.inode && file !== media.name) {
          await this.updateMediaName(stats.ino, file);
        }
      }
    }

    // Update existingMedia after renaming files
    existingMedia = await this.mediaRepository.find({
      where: {
        path: Like(`${folder}%`),
      },
    });

    // File deleted
    for (const media of existingMedia) {
      const filePath = path.join(folder, media.name);
      try {
        const stats = await fs.stat(filePath);
        if (stats.ino !== media.inode) {
          await this.removeMedia(media.inode);
        }
      } catch (error) {
        await this.removeMedia(media.inode);
      }
    }

    return {
      success: true,
      files,
    };
  }

  /**
   * This function adds a media file to the database.
   * @param file name of the file to be added.
   * @param folder path of the folder containing the file.
   */
  async addMedia(file: string, folder: string) {
    const filePath = path.join(folder, file);
    const stats = await fs.stat(filePath);
    if (stats.isFile()) {
      const extension = path.extname(file);
      const mimeType = this.getMimeType(extension);
      if (mimeType) {
        const mediaExists = await this.mediaRepository.findOne({
          where: { inode: stats.ino },
        });
        if (!mediaExists) {
          const media = new Media(
            file,
            filePath,
            extension,
            stats.size,
            mimeType,
            stats.ino,
          );
          await this.mediaRepository.save(media);
        }
      }
    }
  }

  /**
   * This function removes a media file from the database.
   * @param inode inode of the file to be removed.
   */
  async removeMedia(inode: number) {
    const media = await this.mediaRepository.findOne({
      where: { inode: inode },
    });
    if (media) {
      await this.mediaRepository.remove(media);
    }
  }

  /**
   * This function updates the name of a media file in the database.
   * @param inode inode of the file to be updated.
   * @param newName new name of the file.
   */
  async updateMediaName(inode: number, newName: string) {
    const media = await this.mediaRepository.findOne({ where: { inode } });
    if (media) {
      media.name = newName;
      await this.mediaRepository.save(media);
    } else {
      console.log(`No media found with inode ${inode}`);
    }
  }

  /**
   * This function returns the MIME type of media file based on its extension.
   * @param extension extension of the media file.
   * @returns MIME type of the media file.
   * @returns null if the MIME type is not supported.
   */
  getMimeType(extension: string): string | null {
    switch (extension) {
      case '.mp4':
        return 'video/mp4';
      case '.mp3':
        return 'audio/mp3';
      case '.wav':
        return 'audio/wav';
      default:
        return null;
    }
  }
}
