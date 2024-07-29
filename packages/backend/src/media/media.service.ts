import {
  CustomError,
  InternalServerError,
  NotFoundError,
} from '@common/errors/CustomError';
import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { promises as fs } from 'fs';
import * as path from 'path';
import { MediaCardService } from 'src/mediacard/mediacard.service';
import { Like, Repository } from 'typeorm';
import { MediaPathService } from '../media-path/media-path.service';
import { Media } from '../models/media.model';
import FfmepgService from 'src/services/ffmpeg.service';
import {
  CustomResponse,
  SuccessResponse,
} from '@common/errors/customResponses';

@Injectable()
export class MediaService implements OnModuleInit {
  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
    private readonly mediaPathService: MediaPathService,
    private readonly mediaCardService: MediaCardService,
  ) {}

  async onModuleInit() {
    await this.syncMedia();
    await this.cleanAllMediaStreams();
  }

  /**
   * This function get all media path in db and use it to sync media .
   * @returns success if all media path are synced.
   */
  async syncMedia() {
    const mediaPaths = await this.mediaPathService.findAll();
    if (mediaPaths.length === 0) return { success: false };

    for (const mediaPath of mediaPaths) {
      const sync = await this.syncFolder(mediaPath.path);
      if (sync.success) {
        console.log(`Synced ${sync.files} in ${mediaPath.path}`);
      }
    }

    return { success: true };
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
      return { success: false };
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
    const filePath: string = path.join(folder, file);
    const stats = await fs.stat(filePath);
    const mediaType: string = filePath.split('/')[4];
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
            mediaType,
          );
          const finalMedia: Media = await this.mediaRepository.save(media);
          await this.mediaCardService.createDefaultMediaCard(finalMedia);
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
    if (media) await this.mediaRepository.remove(media);
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

  async findAll() {
    return this.mediaRepository.find();
  }

  async getFileById(
    fileId: number,
  ): Promise<{ statusCode: number; file: string }> {
    const fileMedia: Media = await this.mediaRepository.findOneBy({
      id: fileId,
    });
    if (fileMedia) {
      // If a stream already exists for this file,
      // then there's no need to duplicate the file, just use the existing stream.
      let outputFileStream: string | null = fileMedia.streamFile;
      if (!fileMedia.streamFile) {
        const file = path.join('/home/node/media/music', fileMedia.name);
        outputFileStream = await FfmepgService.createStream(file);
        fileMedia.streamFile = outputFileStream;
        fileMedia.streamQueue += 1;
        await this.mediaRepository.save(fileMedia);
      }
      return { file: '/media_hls/' + outputFileStream, statusCode: 200 };
    }
    return { file: null, statusCode: HttpStatus.NOT_FOUND };
  }

  /**
   * Returns all media of a type by mediacard category
   * @param userId | the ID of the user who made the request
   * @param mediaType | music or serie or movies
   * @returns medias by category
   */
  async getMediasByCategories(userId: number, mediaType: string) {
    const medias: Array<Media> = await this.mediaRepository.find({
      where: { type: mediaType },
      relations: { mediaCard: true, user: true },
    });

    const musicsByCategories = {};
    medias.forEach((media) => {
      // Returns only public or user-owned media
      if (
        media.mediaCard.visibility === 'public' ||
        media.user.id === userId ||
        !media.user
      ) {
        // If the category has not yet been defined
        if (musicsByCategories[media.mediaCard.category] === undefined)
          musicsByCategories[media.mediaCard.category] = [];

        const tempMedia: object = {
          id: media.id,
          mediaCard: media.mediaCard,
        };
        musicsByCategories[media.mediaCard.category].push(tempMedia);
      }
    });
    return musicsByCategories;
  }

  async deleteMedia(id: string) {
    try {
      const media = await this.mediaRepository.findOne({
        where: { id: parseInt(id) },
      });
      if (!media) {
        throw new NotFoundError('Media not found');
      }

      await fs.unlink(media.path);
      await this.mediaRepository.remove(media);

      return { statusCode: HttpStatus.OK, message: 'Media deleted' };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      console.log('Error at deleteMedia : ', error);
      throw new InternalServerError('Error at deleteMedia');
    }
  }

  async deleteMediaStreamFiles(
    mediaId: number,
  ): Promise<CustomResponse | CustomError> {
    try {
      const media: Media = await this.mediaRepository.findOneBy({
        id: mediaId,
      });

      if (media) {
        // To keep track of how many people are currently listening
        media.streamQueue = media.streamQueue > 0 ? media.streamQueue - 1 : 0;
        // If someone is still listening, then there's no need to delete the stream.
        if (media.streamQueue > 0) return new SuccessResponse();

        let streamName = media.streamFile;
        if (!streamName)
          throw new NotFoundError('Stream does not exist on this media');
        if (streamName.includes('.'))
          streamName = media.streamFile.split('.')[0];

        if (media.streamQueue === 0) media.streamFile = null;
        await this.mediaRepository.save(media);

        const tmp = await fs.readdir(`/home/node/media/output/`);
        const streamFilesToDelete = tmp.filter((file) =>
          file.includes(streamName),
        );

        for (const file of streamFilesToDelete) {
          await fs.unlink('/home/node/media/output/' + file);
        }
        return new SuccessResponse();
      }

      throw new NotFoundError('Media or stream not fund');
    } catch (error) {
      console.log(error);
      throw new NotFoundError('Stream file to delete not found');
    }
  }

  async cleanAllMediaStreams(): Promise<void> {
    try {
      // Reset all streams medias
      await this.mediaRepository.query(
        'UPDATE media SET streamQueue = 0, streamFile = NULL',
      );

      const files = await fs.readdir(`/home/node/media/output/`);
      for (const file of files) {
        await fs.unlink('/home/node/media/output/' + file);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
