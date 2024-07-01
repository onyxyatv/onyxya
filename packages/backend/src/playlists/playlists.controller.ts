import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Response } from 'express';
import { ZodValidationPipe } from 'src/pipes/zod.pipe';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { PermissionsGuard } from 'src/middlewares/permissions.guard';
import { NeedPermissions } from 'src/permissions/permissions.decorator';
import { Permissions } from 'src/db/permissions';
import { PlaylistsService } from './playlists.service';
import {
  CreatePlaylist,
  createPlaylistSchema,
} from '@common/validation/playlist/createPlaylist.schema';
import { Playlist } from 'src/models/playlist.model';

@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getAll(@Res() res: Response): Promise<object> {
    const playlists: Array<Playlist> =
      await this.playlistsService.getAllPlaylists();
    return res.status(200).json({
      count: playlists.length,
      playlists: playlists,
    }); // Example -> { count: 0, users: [] }
  }

  @UseGuards(PermissionsGuard)
  @NeedPermissions(Permissions.CreatePlaylist)
  @Post('/new')
  @UsePipes(new ZodValidationPipe(createPlaylistSchema))
  async login(
    @Res() res: Response,
    @Body() body: CreatePlaylist,
  ): Promise<object> {
    const resLogin: any = await this.playlistsService.createNewPlaylist(body);
    return res.status(resLogin.statusCode).json(resLogin);
  }
}
