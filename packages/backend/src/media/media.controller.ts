import { Controller, Get } from '@nestjs/common';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get('sync/music')
  async mapMusic(): Promise<object> {
    return this.mediaService.syncMedia();
  }
}
