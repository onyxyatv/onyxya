import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { promises as fs } from 'fs';
import * as path from 'path';
import { Repository } from 'typeorm';
import { music_folder } from '../../config.json';
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
    // await this.syncMedia();
  }

  /**
   * This function get all media path in db and use it to sync media .
   * @returns a message with the number of files synchronized.
   */
  async syncMedia() {
    const mediaPaths = await this.mediaPathService.findAll();
    if (mediaPaths.length === 0) {
      return {
        message: 'No media path found',
      };
    }

    for (const mediaPath of mediaPaths) {
      const sync = await this.syncFolder(mediaPath.path);
      if (sync.files) {
        console.log(`Synced ${sync.files} in ${mediaPath.path}`);
      } else {
        console.log(sync.error);
      }
    }

    return {
      message: 'Media synchronized',
    };
  }

  /**
   * Synchronizes the media folder with the database.
   * @returns a message with the number of files synchronized.
   * @returns a list of files synchronized.
   */
  async syncFolder(folder: string) {
    let files: string[];
    try {
      files = await fs.readdir(folder);
    } catch (error) {
      console.log(`Folder not found: ${folder}`);
      return {
        error: 'Folder not found',
      };
    }

    let existingMedia = await this.mediaRepository.find();

    // New file
    for (const file of files) {
      const filePath = path.join(folder, file);
      const stats = await fs.stat(filePath);
      if (stats.isFile()) {
        const mediaExists = await this.mediaRepository.findOne({
          where: { inode: stats.ino },
        });
        if (!mediaExists) {
          await this.addMedia(file);
          existingMedia = await this.mediaRepository.find();
        }
      }
    }

    // File renamed
    for (const file of files) {
      const filePath = path.join(folder, file);
      const stats = await fs.stat(filePath);
      for (const media of existingMedia) {
        if (stats.ino === media.inode && file !== media.name) {
          await this.updateMediaName(stats.ino, file);
          existingMedia = await this.mediaRepository.find();
        }
      }
    }

    // File deleted
    for (const media of existingMedia) {
      const filePath = path.join(folder, media.name);
      try {
        const stats = await fs.stat(filePath);
        if (stats.ino !== media.inode) {
          await this.removeMedia(media.inode);
          existingMedia = await this.mediaRepository.find();
        }
      } catch (error) {
        await this.removeMedia(media.inode);
        existingMedia = await this.mediaRepository.find();
      }
    }

    // Return the number of file synchronized
    return {
      files,
    };
  }

  /**
   * This function adds a media file to the database.
   * @param file name of the file to be added.
   */
  async addMedia(file: string) {
    const filePath = path.join(music_folder, file);
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
      console.log(`Media with inode ${inode} has been renamed to ${newName}`);
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
