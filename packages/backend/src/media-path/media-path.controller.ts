import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MediaPathService } from './media-path.service';
import { MediaPath } from '../models/media-path.model';
import { AuthGuard } from '../middlewares/auth.guard';

@UseGuards(AuthGuard)
@Controller('media-path')
export class MediaPathController {
  constructor(private readonly mediapathService: MediaPathService) {}
  @Get()
  findAll(): Promise<MediaPath[]> {
    return this.mediapathService.findAll();
  }

  @Get('/:id')
  findOne(@Param() param: any): Promise<MediaPath> {
    return this.mediapathService.findOne(param.id);
  }
}
