import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
