import {
  BadRequestError,
  CustomError,
  NotFoundError,
} from '@common/errors/CustomError';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreatedResponse,
  CustomResponse,
  SuccessResponse,
} from '@common/errors/customResponses';
import { Playlist } from 'src/models/playlist.model';
import { CreatePlaylist } from '@common/validation/playlist/createPlaylist.schema';
import { Repository } from 'typeorm';
import { User } from 'src/models/user.model';
import { GetPlaylistBy } from '@common/validation/playlist/getPlaylistBy.schema';
import { AddMediaPlaylist } from '@common/validation/playlist/addMediaPlaylist.schema';
import { Media } from 'src/models/media.model';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private playlistsRepository: Repository<Playlist>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
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
    userId: number,
  ): Promise<CustomResponse | CustomError> {
    const user: User = await this.userRepository.findOneBy({ id: userId });
    const checkPlaylist = await this.playlistsRepository.findOneBy({
      name: playlistData.name,
      user: user,
    });
    if (checkPlaylist === null) {
      const playlist: Playlist = new Playlist(playlistData.name);
      playlist.user = user;
      const resDb: Playlist = await this.playlistsRepository.save(playlist);
      if (resDb) return new CreatedResponse();
    }

    throw new NotFoundError(
      'Playlist data incorect or Playlist already exists',
    );
  }

  async getPlaylistsBy(
    query: GetPlaylistBy,
  ): Promise<Array<Playlist> | CustomError> {
    const finalSearch = {};
    if (query.userId) {
      const user: User = await this.userRepository.findOneBy({
        id: query.userId,
      });
      if (user) finalSearch['user'] = user;
      else throw new NotFoundError('User not found or permission missing');
    }

    const playlists: Array<Playlist> =
      await this.playlistsRepository.findBy(finalSearch);
    return playlists;
  }

  async getPlaylistById(playlistId: number): Promise<Playlist> {
    if (playlistId !== 0) {
      const playlist: Playlist = await this.playlistsRepository.findOne({
        where: { id: playlistId },
        relations: { medias: true },
      });
      if (playlist) return playlist;
    }

    throw new NotFoundError('Playlist not found or missing permissions');
  }

  async addMusicToPlaylist(
    addMediaPlaylist: AddMediaPlaylist,
  ): Promise<CustomResponse | CustomError> {
    const music: Media = await this.mediaRepository.findOneBy({
      id: addMediaPlaylist.mediaId,
    });
    const playlist: Playlist = await this.playlistsRepository.findOne({
      where: { id: addMediaPlaylist.playlistId },
      relations: { medias: true },
    });

    if (playlist && music) {
      const playlistsMusicsNames: Array<number> = playlist.medias.map(
        (music) => music.id,
      );
      if (playlistsMusicsNames.includes(music.id))
        throw new BadRequestError('Playlist already have this music');
      playlist.medias.push(music);
      await this.playlistsRepository.save(playlist);
      return new SuccessResponse();
    }

    throw new NotFoundError('Playlist or Music not found');
  }
}
