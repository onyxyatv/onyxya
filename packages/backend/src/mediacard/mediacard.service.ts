import { SearchMediaName } from '@common/validation/media/searchMediaName.schema';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from 'src/models/media.model';
import { MediaCard } from 'src/models/mediacard.model';
import { Repository } from 'typeorm';

@Injectable()
export class MediaCardService {
  constructor(
    @InjectRepository(MediaCard)
    private mediaCardRepository: Repository<MediaCard>,
  ) {}

  searchNewMedia(body: SearchMediaName): Promise<object> {
    try {
      console.log(body);
      return;
    } catch (error) {
      console.log('Error at @searchNewMedia : ', error);
      return null;
    }
  }

  async createDefaultMediaCard(media: Media): Promise<boolean> {
    try {
      if (media) {
        const mediaCard: MediaCard = new MediaCard();
        mediaCard.name = media.name.replace(media.extension, '');
        mediaCard.media = media;
        const resDb: MediaCard = await this.mediaCardRepository.save(mediaCard);
        if (resDb) return true;
      }
      return false;
    } catch (error) {
      console.log('Error at createDefaultMediaCard :', error);
      return false;
    }
  }
}
