import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MediaCard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  image: string;
}
