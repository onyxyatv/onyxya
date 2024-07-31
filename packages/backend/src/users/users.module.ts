import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/models/user.model';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { PermissionsService } from 'src/permissions/permissions.service';
import { Permission } from 'src/models/permission.model';
import { Role } from 'src/models/role.model';
import { PermissionsGuard } from 'src/middlewares/permissions.guard';
import { MediaService } from 'src/media/media.service';
import { Media } from 'src/models/media.model';
import { MediaPathService } from 'src/media-path/media-path.service';
import { MediaCardService } from 'src/mediacard/mediacard.service';
import { MediaPath } from 'src/models/media-path.model';
import { MediaCard } from 'src/models/mediacard.model';
import { UserGateway } from './users.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Permission,
      Role,
      Media,
      MediaPath,
      MediaCard,
    ]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    AuthGuard,
    PermissionsService,
    PermissionsGuard,
    MediaService,
    MediaPathService,
    MediaCardService,
    UserGateway,
  ],
})
export class UsersModule {}
