import {
  MediaPath,
  mediaPathSchema,
} from '@common/validation/auth/mediaPath.schema';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/pipes/zod.pipe';
import { AuthGuard } from '../middlewares/auth.guard';
import { MediaPathService } from './media-path.service';

@UseGuards(AuthGuard)
@Controller('media-path')
export class MediaPathController {
  constructor(private readonly mediapathService: MediaPathService) {}

  @Get()
  findAll(): Promise<MediaPath[]> {
    return this.mediapathService.findAll();
  }

  @Get(':id')
  findOne(@Param() param: any): Promise<MediaPath> {
    return this.mediapathService.findOne(param.id);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(mediaPathSchema))
  create(@Body() path: MediaPath): Promise<object> {
    return this.mediapathService.create(path.path);
  }

  @Delete(':id')
  delete(@Param() param: any): Promise<object> {
    return this.mediapathService.delete(param.id);
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(mediaPathSchema))
  update(@Body() path: MediaPath, @Req() req: any): Promise<object> {
    const id = req.params.id;
    return this.mediapathService.update(id, path.path);
  }
}
