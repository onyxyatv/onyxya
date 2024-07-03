import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MediaCard } from './mediacard.model';
import { MediasPlaylist } from './playlistmedia.model';

@Entity()
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  path: string;

  @Column()
  extension: string;

  @Column('bigint')
  size: number;

  @Column({ nullable: true })
  mimeType: string;

  @Column()
  inode: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  modifiedAt: Date;

  @Column({ default: 'default' })
  type: string;

  @OneToOne(() => MediaCard, (mediaCard) => mediaCard.media)
  mediaCard: MediaCard;

  @OneToMany(() => MediasPlaylist, (mediasPlaylist) => mediasPlaylist.media)
  mediasPlaylist: MediasPlaylist[];

  constructor(
    name: string,
    path: string,
    extension: string,
    size: number,
    mimeType: string,
    inode: number,
    type: string,
  ) {
    this.name = name;
    this.path = path;
    this.extension = extension;
    this.size = size;
    this.mimeType = mimeType;
    this.inode = inode;
    this.type = type;
  }
}
