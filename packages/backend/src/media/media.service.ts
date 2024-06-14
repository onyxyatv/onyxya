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
    // this.watchMediaFolder();
  }

  /**
   * Synchronizes the media folder with the database.
   */
  async syncMedia() {
    const files = await fs.readdir(music_folder);
    const existingMedia = await this.mediaRepository.find();

    // Fichier ajouté
    for (const file of files) {
      const filePath = path.join(music_folder, file);
      const stats = await fs.stat(filePath);
      if (stats.isFile()) {
        const mediaExists = await this.mediaRepository.findOne({
          where: { inode: stats.ino },
        });
        if (!mediaExists) {
          await this.addMedia(file);
        }
      }
    }

    // Fichier renommé
    for (const file of files) {
      const filePath = path.join(music_folder, file);
      const stats = await fs.stat(filePath);
      for (const media of existingMedia) {
        if (stats.ino === media.inode && file !== media.name) {
          await this.updateMediaName(stats.ino, file);
        }
      }
    }

    return {
      message: 'Music synchronized',
      number: files.length,
      files: files,
    };
  }
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

  async removeMedia(inode: number) {
    const media = await this.mediaRepository.findOne({
      where: { inode: inode },
    });
    if (media) {
      await this.mediaRepository.remove(media);
    }
  }

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
