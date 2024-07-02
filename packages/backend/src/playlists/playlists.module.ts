import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { PermissionsService } from 'src/permissions/permissions.service';
import { PermissionsGuard } from 'src/middlewares/permissions.guard';
import { Playlist } from 'src/models/playlist.model';
import { PlaylistsController } from './playlists.controller';
import { PlaylistsService } from './playlists.service';
import { Permission } from 'src/models/permission.model';
import { User } from 'src/models/user.model';
import { Role } from 'src/models/role.model';
import { UserService } from 'src/users/users.service';
import { Media } from 'src/models/media.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([Playlist, Permission, User, Role, Media]),
  ],
  controllers: [PlaylistsController],
  providers: [
    PlaylistsService,
    AuthGuard,
    PermissionsService,
    UserService,
    PermissionsGuard,
  ],
})
export class PLaylistsModule {}
