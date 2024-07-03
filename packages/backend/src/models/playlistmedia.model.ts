import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Media } from './media.model';
import { Playlist } from './playlist.model';

@Entity()
export class MediasPlaylist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  position: number;

  @ManyToOne(() => Playlist, (playlist) => playlist.mediasPlaylist, {
    onDelete: 'CASCADE',
  })
  playlist: Playlist;

  @ManyToOne(() => Media, (media) => media.mediasPlaylist, {
    onDelete: 'CASCADE',
  })
  media: Media;
}
