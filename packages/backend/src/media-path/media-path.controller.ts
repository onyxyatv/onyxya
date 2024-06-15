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

  @Get('/:id')
  findOne(@Param() param: any): Promise<MediaPath> {
    return this.mediapathService.findOne(param.id);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(mediaPathSchema))
  create(@Body() path: MediaPath): Promise<object> {
    return this.mediapathService.create(path.path);
  }

  @Delete('/:id')
  delete(@Param() param: any): Promise<object> {
    return this.mediapathService.delete(param.id);
  }

  // TODO: Add validation for path
  @Put('/:id')
  update(
    @Body() path: MediaPath,
    @Param() param: { id: number },
  ): Promise<object> {
    return this.mediapathService.update(param.id, path.path);
  }
}
