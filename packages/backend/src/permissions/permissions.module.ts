import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { Permission } from 'src/models/permission.model';
import { User } from 'src/models/user.model';
import { Role } from 'src/models/role.model';
import { PermissionsGuard } from 'src/middlewares/permissions.guard';
import { UserService } from 'src/users/users.service';
import { MediaService } from 'src/media/media.service';
import { Media } from 'src/models/media.model';
import { MediaPath } from 'src/models/media-path.model';
import { MediaPathService } from 'src/media-path/media-path.service';
import { MediaCardService } from 'src/mediacard/mediacard.service';
import { MediaCard } from 'src/models/mediacard.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Permission,
      User,
      Role,
      Media,
      MediaPath,
      MediaCard,
    ]),
  ],
  controllers: [PermissionsController],
  providers: [
    PermissionsService,
    AuthGuard,
    PermissionsGuard,
    UserService,
    MediaService,
    MediaPathService,
    MediaCardService,
  ],
})
export class PermissionsModule {}
