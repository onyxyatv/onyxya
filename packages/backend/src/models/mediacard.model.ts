import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Media } from './media.model';

@Entity()
export class MediaCard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'No Name' })
  name: string;

  @Column({ nullable: true })
  image: string;

  @OneToOne(() => Media, (media) => media.mediaCard, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  media: Media;
}
