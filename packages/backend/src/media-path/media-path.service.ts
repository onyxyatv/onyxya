import {
  BadRequestError,
  InternalServerError,
  NoContentError,
} from '@common/errors/CustomError';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaPath } from '../models/media-path.model';

@Injectable()
export class MediaPathService implements OnModuleInit {
  constructor(
    @InjectRepository(MediaPath)
    private mediaPathRepository: Repository<MediaPath>,
  ) {}

  onModuleInit() {
    this.insertInitialData();
  }

  /**
   * This function insert initial data in the database.
   * @throws InternalServerError if there is an error inserting data.
   */
  async insertInitialData() {
    try {
      let path = await this.mediaPathRepository.findOne({
        where: {
          path: '/home/node/app/media/music',
        },
      });

      if (!path) {
        await this.mediaPathRepository.save({
          path: '/home/node/app/media/music',
        });
      }

      path = await this.mediaPathRepository.findOne({
        where: {
          path: '/home/node/app/media/movie',
        },
      });

      if (!path) {
        await this.mediaPathRepository.save({
          path: '/home/node/app/media/movie',
        });
      }
    } catch (error) {
      throw new InternalServerError('Error inserting initial data');
    }
  }

  /**
   * This function get all media path in db.
   * @returns list of media path.
   * @throws NoContentError if there is no path found.
   */
  async findAll(): Promise<MediaPath[]> {
    const path = await this.mediaPathRepository.find();
    if (!path) {
      throw new NoContentError('No paths found');
    }
    return path;
  }

  /**
   * This function get one media path in db.
   * @param id id of the path to be found.
   * @returns media path.
   * @throws NoContentError if there is no path found.
   */
  async findOne(id: number): Promise<MediaPath> {
    const path = await this.mediaPathRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!path) {
      throw new NoContentError('There is no path with this id');
    }

    return path;
  }

  /**
   * This function create a new media path in db.
   * @param path path of the media to be created.
   * @returns success if the path is created.
   * @throws InternalServerError if there is an error creating path.
   */
  async create(path: string): Promise<object> {
    try {
      await this.mediaPathRepository.save({ path });
      return {
        success: true,
      };
    } catch (error) {
      throw new InternalServerError('Error creating path');
    }
  }

  /**
   * This function delete a media path in db.
   * @param id id of the path to be deleted.
   * @returns success if the path is deleted.
   * @throws InternalServerError if there is an error deleting path.
   */
  async delete(id: number): Promise<object> {
    // On check si le path est un des path par défaut (qu'on souhaite ne pas pouvoir supprimer)
    const path = await this.mediaPathRepository.findOne({
      where: {
        id: id,
      },
    });
    if (
      path.path === '/home/node/app/media/music' ||
      path.path === '/home/node/app/media/movie'
    ) {
      throw new BadRequestError('You cannot delete this path');
    }

    try {
      await this.mediaPathRepository.delete(id);
      return {
        success: true,
      };
    } catch (error) {
      throw new InternalServerError('Error deleting path');
    }
  }

  /**
   * This function update a media path in db.
   * @param id id of the path to be updated.
   * @param path new path of the media.
   * @returns success if the path is updated.
   * @throws InternalServerError if there is an error updating path.
   */
  async update(id: number, path: string): Promise<object> {
    try {
      await this.mediaPathRepository.update(id, { path });
      return {
        success: true,
      };
    } catch (error) {
      throw new InternalServerError('Error updating path');
    }
  }
}
