import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaPath } from 'src/models/media-path.model';
import { MediaPathService } from '../media-path/media-path.service';
import { Media } from '../models/media.model';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { MediaCardService } from 'src/mediacart/mediacard.service';
import { MediaCard } from 'src/models/mediacard.model';

@Module({
  imports: [TypeOrmModule.forFeature([Media, MediaPath, MediaCard])],
  controllers: [MediaController],
  providers: [MediaService, MediaPathService, MediaCardService],
})
export class MediaModule {}
