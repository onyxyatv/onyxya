import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../middlewares/auth.guard';
import { MediaService } from './media.service';
@UseGuards(AuthGuard)
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get('sync/music')
  async syncMedia(): Promise<object> {
    return this.mediaService.syncMedia();
  }

  @Get()
  async findAll() {
    return this.mediaService.findAll();
  }
}
