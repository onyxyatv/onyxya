import { Controller } from '@nestjs/common';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  // @Get('map/music')
  // async mapMusic(): Promise<object> {
  //   return this.mediaService.mapMusic();
  // }
}
