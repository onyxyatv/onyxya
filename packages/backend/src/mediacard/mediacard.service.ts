import {
  BadRequestError,
  InternalServerError,
} from '@common/errors/CustomError';
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

  /**
   * This method is used to create a default media card.
   * @param media
   * @returns a boolean value
   */
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

  /**
   * This method is used to get all media cards.
   * @returns a list of media cards
   * @throws InternalServerError if an error occurs
   */
  async getMediaCards(): Promise<MediaCard[]> {
    try {
      return await this.mediaCardRepository.find();
    } catch (error) {
      console.log('Error at getMediaCards : ', error);
      throw new InternalServerError('Error at getMediaCards');
    }
  }

  /**
   * This medthod is used to get a media card by the id of the media.
   * @param id the id of the media
   * @returns the mediacard
   * @throws BadRequestError if the media card is not found
   * @throws InternalServerError if an error occurs
   */
  async getMediaCardByMedia(
    id: string,
    withMedia: boolean,
  ): Promise<MediaCard> {
    try {
      const mediaRelation = withMedia ? { media: true } : null;
      const card = await this.mediaCardRepository.findOne({
        where: { media: { id: parseInt(id) } },
        relations: mediaRelation,
      });
      if (!card) {
        throw new BadRequestError('MediaCard not found');
      }
      return card;
    } catch (error) {
      console.log('Error at getMediaCardByMedia : ', error);
      if (error instanceof BadRequestError) {
        throw error;
      }
      throw new InternalServerError('Error at getMediaCardByMedia');
    }
  }
  /**
   * This method is used to update a media card.
   * @param id the id of the media card
   * @param body the updated values
   * @returns the updated media card
   * @throws BadRequestError if the media card is not found
   * @throws InternalServerError if an error occurs
   */
  async updateMediaCard(id, body): Promise<MediaCard> {
    try {
      const mediaCard: MediaCard = await this.mediaCardRepository.findOne({
        where: { id: id },
      });

      if (!mediaCard) {
        throw new BadRequestError('MediaCard not found');
      }

      mediaCard.name = body.name;
      mediaCard.description = body.description;
      mediaCard.type = body.type;
      mediaCard.category = body.category;
      mediaCard.isActive = body.isActive;
      mediaCard.releaseDate = body.releaseDate;
      return await this.mediaCardRepository.save(mediaCard);
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error;
      }
      console.log('Error at updateMediaCard : ', error);
      throw new InternalServerError('Error at updateMediaCard');
    }
  }
}
