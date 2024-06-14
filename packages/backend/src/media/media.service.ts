import { Injectable, OnModuleInit } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from '../models/media.model';
import { music_folder } from '../../config.json';

@Injectable()
export class MediaService implements OnModuleInit {
  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
  ) {}

  async onModuleInit() {
    await this.syncMedia();
  }

  /**
   * Synchronizes the media folder with the database.
   */
  async syncMedia() {
    const files = await fs.readdir(music_folder);
    let existingMedia = await this.mediaRepository.find();

    // New file
    for (const file of files) {
      const filePath = path.join(music_folder, file);
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
      const filePath = path.join(music_folder, file);
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
      const filePath = path.join(music_folder, media.name);
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

    return {
      message: 'Media synchronized',
      number: files.length,
      files: files,
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
