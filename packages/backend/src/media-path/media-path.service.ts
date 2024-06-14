import { Injectable } from '@nestjs/common';
import { MediaPath } from '../models/media-path.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NoContentError } from '@common/errors/CustomError';

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
}
