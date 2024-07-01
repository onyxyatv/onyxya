import { CustomError, NotFoundError } from '@common/errors/CustomError';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CustomResponse,
  SuccessResponse,
} from '@common/errors/customResponses';
import { Playlist } from 'src/models/playlist.model';
import { CreatePlaylist } from '@common/validation/playlist/createPlaylist.schema';
import { Repository } from 'typeorm';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private playlistsRepository: Repository<Playlist>,
  ) {}

  getAllPlaylists(): Promise<Array<Playlist> | null> {
    try {
      return this.playlistsRepository.find();
    } catch (error) {
      console.log('Error at @getAllPlaylists : ', error);
      return null; // Will generate automatically a 500 internal server error
    }
  }

  async createNewPlaylist(
    playlistData: CreatePlaylist,
  ): Promise<CustomResponse | CustomError> {
    const checkPlaylist = await this.playlistsRepository.findOneBy({
      name: playlistData.name,
    });
    if (checkPlaylist === null) {
      const playlist: Playlist = new Playlist(playlistData.name);
      const resDb: Playlist = await this.playlistsRepository.save(playlist);
      if (resDb) return new SuccessResponse();
    }

    throw new NotFoundError(
      'Playlist data incorect or Playlist already exists',
    );
  }
}
