import { Media } from "./media";
import { User } from "./user";

export type MediasPlaylist = {
  id: number;
  position: number;
  playlist: Playlist;
  media: Media;
}

export type Playlist = {
  id: number;
  name: string;
  desription: string;
  isActive: boolean;
  user: User;
  mediasPlaylist: MediasPlaylist[];
};