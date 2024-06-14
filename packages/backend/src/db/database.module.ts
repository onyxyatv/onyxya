import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/models/user.model';
import { Media } from '../models/media.model';
import { MediaPath } from '../models/media-path.model';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'onyxya.sqlite',
      entities: [User, Media, MediaPath],
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
