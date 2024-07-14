import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaCardService } from 'src/mediacard/mediacard.service';
import { MediaPath } from 'src/models/media-path.model';
import { MediaCard } from 'src/models/mediacard.model';
import { Permission } from 'src/models/permission.model';
import { Role } from 'src/models/role.model';
import { User } from 'src/models/user.model';
import { UserService } from 'src/users/users.service';
import { MediaPathService } from '../media-path/media-path.service';
import { Media } from '../models/media.model';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Media,
      MediaPath,
      MediaCard,
      Permission,
      User,
      Role,
    ]),
  ],
  controllers: [MediaController],
  providers: [MediaService, MediaPathService, MediaCardService, UserService],
})
export class MediaModule {}
