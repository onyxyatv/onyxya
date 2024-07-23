import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaPathService } from 'src/media-path/media-path.service';
import { MediaService } from 'src/media/media.service';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { MediaPath } from 'src/models/media-path.model';
import { Media } from 'src/models/media.model';
import { MediaCard } from 'src/models/mediacard.model';
import { MediaCardController } from './mediacard.controller';
import { MediaCardService } from './mediacard.service';

@Module({
  imports: [TypeOrmModule.forFeature([MediaCard, Media, MediaPath])],
  controllers: [MediaCardController],
  providers: [MediaCardService, MediaService, AuthGuard, MediaPathService],
})
export class MediaCardModule {}
