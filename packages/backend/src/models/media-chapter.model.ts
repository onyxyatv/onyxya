import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Media } from './media.model';

@Entity()
export class MediaChapter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: false })
  startTime: number;

  @Column({ nullable: false })
  endTime: number;

  @ManyToOne(() => Media, (media) => media.chapters)
  media: Media;
}
