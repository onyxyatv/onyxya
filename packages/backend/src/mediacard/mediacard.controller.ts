import {
  SearchMediaName,
  searchMediaNameSchema,
} from '@common/validation/media/searchMediaName.schema';
import {
  Body,
  Controller,
  Post,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from 'src/middlewares/auth.guard';
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
}
