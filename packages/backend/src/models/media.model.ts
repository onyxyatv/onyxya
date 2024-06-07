import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Media {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  link: string;
  @Column()
  extension: string;
  @Column('bigint')
  size: number;
  @Column({ nullable: true })
  mimeType: string;
  @Column()
  createdAt: Date;
  @Column()
  modifiedAt: Date;

  constructor(
    name: string,
    link: string,
    extension: string,
    size: number,
    mimeType: string,
    createdAt: Date,
    modifiedAt: Date,
  ) {
    this.name = name;
    this.link = link;
    this.extension = extension;
    this.size = size;
    this.mimeType = mimeType;
    this.createdAt = createdAt;
    this.modifiedAt = modifiedAt;
  }
}
