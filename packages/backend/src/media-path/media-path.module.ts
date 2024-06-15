import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaPath } from '../models/media-path.model';
import { MediaPathController } from './media-path.controller';
import { MediaPathService } from './media-path.service';

@Module({
  imports: [TypeOrmModule.forFeature([MediaPath])],
  controllers: [MediaPathController],
  providers: [MediaPathService],
})
export class MediaPathModule {}
