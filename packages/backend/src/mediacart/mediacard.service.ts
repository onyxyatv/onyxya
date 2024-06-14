import { BadRequestError, InternalServerError, NotFoundError } from '@common/errors/CustomError';
import { SearchMediaName } from '@common/validation/media/searchMediaName.schema';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaCard } from 'src/models/mediacard.model';
import { Repository } from 'typeorm';

@Injectable()
export class MediaCardService {
  constructor(
    @InjectRepository(MediaCard)
    private mediaCardRepository: Repository<MediaCard>,
  ) { };

  searchNewMedia(body: SearchMediaName): Promise<object> {
    try {
        console.log(body);
        return ;
    } catch (error) {
      console.log('Error at @searchNewMedia : ', error);
      return null;
    }
  }
}
