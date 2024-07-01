import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { PermissionsService } from 'src/permissions/permissions.service';
import { PermissionsGuard } from 'src/middlewares/permissions.guard';
import { Playlist } from 'src/models/playlist.model';
import { PlaylistsController } from './playlists.controller';
import { PlaylistsService } from './playlists.service';

@Module({
  imports: [TypeOrmModule.forFeature([Playlist])],
  controllers: [PlaylistsController],
  providers: [
    PlaylistsService,
    AuthGuard,
    PermissionsService,
    PermissionsGuard,
  ],
})
export class PLaylistsModule {}
