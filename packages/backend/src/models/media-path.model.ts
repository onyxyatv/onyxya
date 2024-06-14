import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MediaPath {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  path: string;
  constructor(path: string) {
    this.path = path;
  }
}
