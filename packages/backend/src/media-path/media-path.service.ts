import {
  InternalServerError,
  NoContentError,
} from '@common/errors/CustomError';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaPath } from '../models/media-path.model';

@Injectable()
export class MediaPathService {
  constructor(
    @InjectRepository(MediaPath)
    private mediaPathRepository: Repository<MediaPath>,
  ) {}

  async findAll(): Promise<MediaPath[]> {
    const path = await this.mediaPathRepository.find();
    if (!path) {
      throw new NoContentError('No paths found');
    }
    return path;
  }

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

  async delete(id: number): Promise<object> {
    try {
      await this.mediaPathRepository.delete(id);
      return {
        success: true,
      };
    } catch (error) {
      throw new InternalServerError('Error deleting path');
    }
  }

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
