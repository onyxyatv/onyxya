import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/models/permission.model';
import { User } from 'src/models/user.model';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permsRepository: Repository<Permission>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAllPermissions(): Promise<Permission[]> {
    return this.permsRepository.find();
  }

  getById(id: number): Promise<Permission> {
    return this.permsRepository.findOneBy({ id: id });
  }

  async givePermToUser(userId: number, permId: number): Promise<any> {
    const permission: Permission = await this.permsRepository.findOneBy({ id: permId });
    const user: User = await this.userRepository.findOneBy({ id: userId });

    if (permission === null || user === null)
      throw new Error(`User or Permission not found!`);

    user.permissions.push(permission);
    await this.userRepository.save(user);

    return { success: true, statusCode: HttpStatus.OK };
  }
}
