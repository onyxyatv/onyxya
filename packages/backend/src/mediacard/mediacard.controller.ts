import { mediaCardSchema } from '@common/validation/media/mediaCard.schema';
import {
  SearchMediaName,
  searchMediaNameSchema,
} from '@common/validation/media/searchMediaName.schema';
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { MediaCard } from 'src/models/mediacard.model';
import { ZodValidationPipe } from 'src/pipes/zod.pipe';
import { MediaCardService } from './mediacard.service';

@Controller('/mediacard')
export class MediaCardController {
  constructor(private readonly mediaCardService: MediaCardService) {}

  /**
   * This route is used to search for media on an API in search of media information, such as music, for example.
   * @param res
   * @param body
   * @returns a list of found medias
   */
  @UseGuards(AuthGuard)
  @Post('/new/search')
  @UsePipes(new ZodValidationPipe(searchMediaNameSchema))
  async searchNewMedia(
    @Res() res: Response,
    @Body() body: SearchMediaName,
  ): Promise<object> {
    console.log(body);
    const foundMedias: any = await this.mediaCardService.searchNewMedia(body);
    return res.status(200).json({
      count: foundMedias.length,
      medias: foundMedias,
    });
  }

  /**
   * This route is used to list all media cards.
   * @returns a list of media cards
   */
  @Get()
  async getMediaCards(@Res() res: Response): Promise<Response> {
    const mediaCards: MediaCard[] = await this.mediaCardService.getMediaCards();
    return res.status(200).json(mediaCards);
  }

  /**
   * This route is used to get a media card by its id.
   * @param id the id of the media card
   * @returns a media card
   */
  @Get('/media/:id')
  async getMediaCard(@Res() res: Response, @Req() req: any): Promise<Response> {
    const id = req.params.id;
    const mediaCard: MediaCard =
      await this.mediaCardService.getMediaCardByMedia(id);
    return res.status(200).json(mediaCard);
  }

  /**
   * This route is used patch a media card by its id.
   * @param id
   * @body the updated values
   * @returns the updated media card
   */
  @Patch('/:id')
  @UsePipes(new ZodValidationPipe(mediaCardSchema))
  async updateMediaCard(
    @Req() req: any,
    @Res() res: Response,
    @Body() body: any,
  ): Promise<Response> {
    const id = req.params.id;
    const updatedMediaCard: MediaCard =
      await this.mediaCardService.updateMediaCard(id, body);
    return res.status(200).json(updatedMediaCard);
  }
}
