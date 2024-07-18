import { Module } from '@nestjs/common';
import { MediaCardController } from './mediacard.controller';
import { MediaCardService } from './mediacard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { MediaCard } from 'src/models/mediacard.model';
import { Media } from 'src/models/media.model';
import { MediaService } from 'src/media/media.service';

@Module({
  imports: [TypeOrmModule.forFeature([MediaCard, Media])],
  controllers: [MediaCardController],
  providers: [MediaCardService, MediaService, AuthGuard],
})
export class MediaCardModule {}
