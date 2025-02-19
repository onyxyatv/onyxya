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
  description: string;

  @Column({ nullable: true })
  type: string;

  @Column({ default: 'default' })
  category: string;

  @Column({ nullable: true })
  releaseDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 'private' })
  visibility: 'public' | 'private';

  @OneToOne(() => Media, (media) => media.mediaCard, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  media: Media;
}
