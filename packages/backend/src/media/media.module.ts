import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaPath } from 'src/models/media-path.model';
import { MediaPathService } from '../media-path/media-path.service';
import { Media } from '../models/media.model';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [TypeOrmModule.forFeature([Media, MediaPath])],
  controllers: [MediaController],
  providers: [MediaService, MediaPathService],
})
export class MediaModule {}
