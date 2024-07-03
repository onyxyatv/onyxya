import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.model';
import { MediasPlaylist } from './mediasplaylist.model';

@Entity()
export class Playlist {
  constructor(name: string) {
    this.name = name;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'No name' })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.playlists)
  user: User;

  @OneToMany(() => MediasPlaylist, (playlistMedia) => playlistMedia.playlist)
  mediasPlaylist: MediasPlaylist[];

  // movies and music playlist
  @Column({ nullable: false })
  type: string;
}
