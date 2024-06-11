import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
  inode: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  modifiedAt: Date;

  constructor(
    name: string,
    link: string,
    extension: string,
    size: number,
    mimeType: string,
    inode: number,
  ) {
    this.name = name;
    this.link = link;
    this.extension = extension;
    this.size = size;
    this.mimeType = mimeType;
    this.inode = inode;
  }
}
