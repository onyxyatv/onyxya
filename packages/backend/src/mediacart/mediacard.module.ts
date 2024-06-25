import { Module } from '@nestjs/common';
import { MediaCardController } from './mediacard.controller';
import { MediaCardService } from './mediacard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { MediaCard } from 'src/models/mediacard.model';

@Module({
  imports: [TypeOrmModule.forFeature([MediaCard])],
  controllers: [MediaCardController],
  providers: [MediaCardService, AuthGuard],
})
export class MediaCardModule {}
