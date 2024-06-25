import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoleDb } from 'src/db/migrations/createRoles.db';
import { CreateRolesPermissionsDb } from 'src/db/migrations/createRolesPermissions.db';
import { permissions, rolesPermissions } from 'src/db/permissions';
import { Permission } from 'src/models/permission.model';
import { Role } from 'src/models/role.model';
import { User } from 'src/models/user.model';
import { QueryRunner, Repository } from 'typeorm';
import { permissions, rolesPermissions } from 'src/db/permissions';
import { Role } from 'src/models/role.model';
import { CreateRoleDb } from 'src/db/migrations/createRoles.db';
import {
  BadRequestError,
  CustomError,
  NotFoundError,
} from '@common/errors/CustomError';
import { CreateRolesPermissionsDb } from 'src/db/migrations/createRolesPermissions.db';
import { AddUserPerm } from '@common/validation/permissions/addUserPerm.schema';
import {
  CustomResponse,
  SuccessResponse,
} from '@common/errors/customResponses';
import { UserService } from 'src/users/users.service';
import { SetUserPermissions } from '@common/validation/permissions/setUserPermissions.schema';

@Injectable()
export class PermissionsService implements OnModuleInit {
  constructor(
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    private readonly userService: UserService,
  ) {}

  async onModuleInit(): Promise<void> {
    // eslint-disable-next-line prettier/prettier
    const permissionsDb: Array<Permission> =
      await this.permissionsRepository.find();
    // eslint-disable-next-line prettier/prettier
    const permissionsConfig: Array<{ name: string; description: string }> =
      permissions;
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

    const permsConfigList = permissionsConfig.map(
      (permission) => permission.name,
    );
    for (const permDb of permissionsDb) {
      if (!permsConfigList.includes(permDb.name)) {
        // If the permission does not exist in the config it is then deleted from db
        await this.permissionsRepository.delete(permDb);
      }
    }

    await this.synchronizeRolesPermisisons();
  }

  /**
   * Method for synchronizing role permissions if a role has received a new permission
   */
  private async synchronizeRolesPermisisons(): Promise<void> {
    try {
      const queryRunner: QueryRunner =
        this.rolesRepository.manager.connection.createQueryRunner();
      const rolesPermissionsDb: Array<Role> = await this.rolesRepository.find({
        relations: ['permissions'],
      });
      const rolesPermissionsConfig: any = rolesPermissions;

      for (const roleDb of rolesPermissionsDb) {
        // Get an array of permissions names already owned by the role
        const permissionsNamesListDb = roleDb.permissions.map(
          (perm) => perm.name,
        );

        // Browse the config list to find any missing values
        for (const permConfig of rolesPermissionsConfig[roleDb.name]) {
          if (!permissionsNamesListDb.includes(permConfig)) {
            await CreateRolesPermissionsDb.addRolePermission(
              queryRunner,
              roleDb.name,
              permConfig,
            );
          }
        }

        // Go to each role's perm in db
        for (const rolePermDb of roleDb.permissions) {
          if (!rolesPermissionsConfig[roleDb.name].includes(rolePermDb.name)) {
            // If the permission does not exist in the config, then we delete it from db
            await CreateRolesPermissionsDb.removeRolePermission(
              queryRunner,
              roleDb.name,
              rolePermDb.id,
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

  /**
   * Get a permission by its Id
   * @param id | permissionId
   * @returns Permission
   */
  getById(id: number): Promise<Permission> {
    return this.permissionsRepository.findOneBy({ id: id });
  }

  async getRolePermissions(roleName: string | undefined): Promise<any> {
    if (roleName !== undefined) {
      const role: Role = await this.rolesRepository.findOne({
        where: { name: roleName },
        relations: ['permissions'],
      });

      if (role !== null) {
        // eslint-disable-next-line prettier/prettier
        const permissions: Array<Permission> = await this.permissionsRepository.find();
        const ownedPermsNames = role.permissions.map((perm) => perm.name);
        const missingPermissions = permissions.filter(
          (perm) => !ownedPermsNames.includes(perm.name),
        );

        return {
          owned: {
            count: role.permissions.length,
            permissions: role.permissions,
          },
          missing: {
            count: missingPermissions.length,
            permissions: missingPermissions,
          },
        };
      }
    }

    throw new NotFoundError('Role with that name not found');
  }

  async userHasPermission(
    user: User,
    permission: Permission,
  ): Promise<boolean> {
    const userPerms = await this.userService.getUserOwnedPermissions(user.id);
    for (const userPerm of userPerms) {
      if (userPerm['isUser'] && userPerm.id === permission.id) return true;
    }
    return false;
  }

  async addUserPermission(
    addUserPerm: AddUserPerm,
  ): Promise<CustomResponse | CustomError> {
    const user = await this.userRepository.findOne({
      where: { id: addUserPerm.userId },
      relations: { permissions: true },
    });
    const permission = await this.permissionsRepository.findOne({
      where: { id: addUserPerm.permissionId },
    });
    if (user && permission) {
      const checkUserHasPerm = await this.userHasPermission(user, permission);
      if (!checkUserHasPerm) {
        user.permissions.push(permission);
        await this.userRepository.save(user);
        return new SuccessResponse();
      } else {
        throw new BadRequestError('User have already this permission');
      }
    }
    throw new NotFoundError('User or permission not found');
  }

  async removeUserPermission(
    removeUserPerm: AddUserPerm,
  ): Promise<CustomResponse | CustomError> {
    const user = await this.userRepository.findOne({
      where: { id: removeUserPerm.userId },
      relations: { permissions: true },
    });
    const permission = await this.permissionsRepository.findOne({
      where: { id: removeUserPerm.permissionId },
    });
    if (user && permission) {
      const checkNames = user.permissions.map((perm) => perm.name);
      // eslint-disable-next-line prettier/prettier
      if (user.permissions.length === 0 || !checkNames.includes(permission.name))
        throw new BadRequestError("User don't have this permission");
      user.permissions = user.permissions.filter((userPerm) => {
        if (userPerm.id !== permission.id) return userPerm;
      });
      await this.userRepository.save(user);
      return new SuccessResponse();
    }

    throw new NotFoundError('User or permission not found');
  }

  /**
   * This method sets a user's permissions
   * @param setUserPermissions | { userId: number, permissions: number[] }
   * @returns a CustomResponse or a CustomError
   */
  async setUserPermissions(
    setUserPermissions: SetUserPermissions,
  ): Promise<CustomResponse | CustomError> {
    const user: User = await this.userRepository.findOne({
      where: { id: setUserPermissions.userId },
      relations: { permissions: true },
    });
    if (user) {
      user.permissions = [];
      await this.userRepository.save(user);
      for (const permId of setUserPermissions.permissions) {
        const permission: Permission = await this.permissionsRepository.findOne(
          { where: { id: permId } },
        );
        if (permission) user.permissions.push(permission);
      }
      await this.userRepository.save(user);
      return new SuccessResponse();
    }
    throw new NotFoundError('User or one permission not found!');
  }
}
