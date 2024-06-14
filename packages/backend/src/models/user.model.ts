import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Permission } from './permission.model';

@Entity()
export class User {
  constructor(username: string, password: string, role: string, salt: string) {
    this.username = username;
    this.password = password;
    this.role = role;
    this.salt = salt;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @Column()
  salt: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => Permission, (permission) => permission.users, {
    cascade: true,
  })
  @JoinTable({
    name: 'user_permissions',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
  })
  permissions: Permission[];
}
