import { Injectable, OnModuleInit } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from '../models/media.model';
import * as chokidar from 'chokidar';
import { music_folder } from '../../config.json';

@Injectable()
export class MediaService implements OnModuleInit {
  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
  ) {}

  async onModuleInit() {
    await this.syncMedia();
    this.watchMediaFolder();
  }

  /**
   * Synchronizes the media folder with the database.
   */
  async syncMedia() {
    const files = await fs.readdir(music_folder);
    const existingMedia = await this.mediaRepository.find();
    const existingInodes = existingMedia.map((media) => media.inode);

    const newFiles = await Promise.all(
      files.filter(async (file) => {
        const filePath = path.join(music_folder, file);
        const stats = await fs.stat(filePath);
        return !existingInodes.includes(stats.ino);
      }),
    );

    const deletedFiles = existingMedia.filter(
      (media) => !files.includes(path.basename(media.link)),
    );

    for (const file of newFiles) {
      await this.addMedia(file);
    }

    for (const media of deletedFiles) {
      await this.removeMedia(media.inode);
    }

    // Check for renamed files
    for (const file of files) {
      const filePath = path.join(music_folder, file);
      const stats = await fs.stat(filePath);
      const media = existingMedia.find((m) => m.inode === stats.ino);
      if (media && media.name !== file) {
        await this.updateMediaName(media, file);
      }
    }
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

    console.log(media);

    if (media) {
      await this.mediaRepository.remove(media);
    }
  }

  async updateMediaName(media: Media, newName: string) {
    media.name = newName;
    media.link = path.join(music_folder, newName);
    await this.mediaRepository.save(media);
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

  /**
   * Watches the media folder for changes and updates the database accordingly.
   */
  watchMediaFolder() {
    const watcher = chokidar.watch(music_folder, { persistent: true });

    watcher
      .on('add', async (filePath) => {
        const file = path.basename(filePath);
        await this.addMedia(file);
        console.log(`File ${file} has been added`);
      })
      .on('unlink', async (filePath) => {
        const stats = await fs.stat(filePath).catch(() => null);
        console.log(stats);
        if (stats) {
          await this.removeMedia(stats.ino);
        }
        console.log(`File ${filePath} has been removed`);
      })
      .on('rename', async (oldPath, newPath) => {
        const oldStats = await fs.stat(oldPath).catch(() => null);
        if (oldStats) {
          const media = await this.mediaRepository.findOne({
            where: { inode: oldStats.ino },
          });
          if (media) {
            const newName = path.basename(newPath);
            await this.updateMediaName(media, newName);
            console.log(`File ${oldPath} has been renamed to ${newName}`);
          }
        }
      });
  }
}
