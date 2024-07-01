import { Media } from "./media";
import { User } from "./user";

export type Playlist = {
  id: number;
  name: string;
  desription: string;
  isActive: boolean;
  user: User;
  medias: Media[];
};