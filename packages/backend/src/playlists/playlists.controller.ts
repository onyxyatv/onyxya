import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Request, Response } from 'express';
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
import {
  GetPlaylistBy,
  getPlaylistBySchema,
} from '@common/validation/playlist/getPlaylistBy.schema';
import { CustomError } from '@common/errors/CustomError';

@UseGuards(AuthGuard) // AuthGuard for all routes of this module
@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

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
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: CreatePlaylist,
  ): Promise<object> {
    const userId: number = req['user'].id;
    const resLogin: any = await this.playlistsService.createNewPlaylist(
      body,
      userId,
    );
    return res.status(resLogin.statusCode).json(resLogin);
  }

  @Get('/by')
  @UsePipes(new ZodValidationPipe(getPlaylistBySchema))
  async getPlaylistBy(@Query() query: GetPlaylistBy, @Res() res: Response) {
    const data: Array<Playlist> | CustomError =
      await this.playlistsService.getPlaylistBy(query);

    // Check that data is not an error
    if (data instanceof Array) {
      return res.status(200).json({
        count: data.length,
        playlists: data,
      });
    }
  }
}
