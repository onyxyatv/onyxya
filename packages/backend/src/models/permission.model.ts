import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.model';
import { Role } from './role.model';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => User, (user) => user.permissions)
  users: User[];

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
