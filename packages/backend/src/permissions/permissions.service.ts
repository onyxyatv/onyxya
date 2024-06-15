import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/models/permission.model';
import { User } from 'src/models/user.model';
import { Repository } from 'typeorm';
import { permissions, rolesPermissions } from 'src/db/permissions';
import { Role } from 'src/models/role.model';
import { CreateRoleDb } from 'src/db/migrations/createRoles.db';
import { NotFoundError } from '@common/errors/CustomError';
import { CreateRolesPermissionsDb } from 'src/db/migrations/createRolesPermissions.db';

@Injectable()
export class PermissionsService implements OnModuleInit {
  constructor(
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async onModuleInit(): Promise<void> {
    // eslint-disable-next-line prettier/prettier
    const permissionsDb: Array<Permission> = await this.permissionsRepository.find();
    // eslint-disable-next-line prettier/prettier
    const permissionsConfig: Array<{ name: string; description: string }> = permissions;
    const rolesDb: Array<Role> = await this.rolesRepository.find();

    if (rolesDb.length === 0) {
      // If roles 'admin' and 'user' does not already exists
      await CreateRoleDb.initRoles(
        this.rolesRepository.manager.connection.createQueryRunner(),
      );
    }

    const permsNameList = permissionsDb.map((permission) => permission.name);
    for (const perm of permissionsConfig) {
      if (!permsNameList.includes(perm.name)) {
        // If the permission does not exist, it is then created
        const permission = new Permission();
        permission.name = perm.name;
        permission.description = perm.description;
        await this.permissionsRepository.save(permission);
      }
    }

    await this.synchronizeRolesPermisisons();
  }

  /**
   * Method for synchronizing role permissions if a role has received a new permission
   */
  private async synchronizeRolesPermisisons(): Promise<void> {
    try {
      const rolesPermissionsDb: Array<Role> = await this.rolesRepository.find({
        relations: ['permissions'],
      });
      const rolesPermissionsConfig: any = rolesPermissions;
      for (const role of rolesPermissionsDb) {
        // Get an array of permissions names already owned by the role
        const permissionsNamesList = role.permissions.map((perm) => perm.name);

        // Browse the config list to find any missing values
        for (const permConfig of rolesPermissionsConfig[role.name]) {
          if (!permissionsNamesList.includes(permConfig)) {
            await CreateRolesPermissionsDb.addRolePermission(
              this.rolesRepository.manager.connection.createQueryRunner(),
              role.name,
              permConfig,
            );
          }
        }
      }
    } catch (error) {
      console.log('Error at @synchronizeRolesPermisisons :', error);
    }
  }

  async getAllPermissions(): Promise<Permission[]> {
    return this.permissionsRepository.find();
  }

  getById(id: number): Promise<Permission> {
    return this.permissionsRepository.findOneBy({ id: id });
  }

  async givePermToUser(userId: number, permId: number): Promise<any> {
    const permission: Permission = await this.permissionsRepository.findOneBy({
      id: permId,
    });
    const user: User = await this.userRepository.findOneBy({ id: userId });

    if (permission === null || user === null)
      throw new Error(`User or Permission not found!`);

    user.permissions.push(permission);
    await this.userRepository.save(user);

    return { success: true, statusCode: HttpStatus.OK };
  }

  async getRolePermissions(roleName: string | undefined): Promise<any> {
    if (roleName !== undefined) {
      const role: Role = await this.rolesRepository.findOne({
        where: { name: roleName },
        relations: ['permissions'],
      });
      if (role !== null) return role.permissions;
    }

    throw new NotFoundError('Role with that name not found');
  }
}
