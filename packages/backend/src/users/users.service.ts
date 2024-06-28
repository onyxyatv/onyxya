import {
  BadRequestError,
  ConflictError,
  CustomError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from '@common/errors/CustomError';
import { CreateUser } from '@common/validation/auth/createUser.schema';
import { LoginUser } from '@common/validation/auth/login.schema';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { sha512 } from 'js-sha512';
import { DeleteResult, Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { Permission } from 'src/models/permission.model';
import { Role } from 'src/models/role.model';
import { User } from 'src/models/user.model';
import UtilService from 'src/services/util.service';
import {
  CustomResponse,
  SuccessResponse,
} from '@common/errors/customResponses';
import { EditUser } from '@common/validation/auth/editUser.schema';
import { Permissions } from 'src/db/permissions';
const secret: string = process.env.JWT_SECRET_KEY;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) {}

  getAllUsers(): Promise<Array<User> | null> {
    try {
      return this.usersRepository.find({
        relations: {
          role: true,
        },
        select: {
          id: true,
          username: true,
          isActive: true,
          password: false,
          salt: false,
        },
      });
    } catch (error) {
      console.log('Error at @getAllUsers : ', error);
      return null; // Will generate automatically a 500 internal server error
    }
  }

  async login(loginData: LoginUser): Promise<object> {
    const checkUser = await this.usersRepository.findOneBy({
      username: loginData.username,
    });
    if (checkUser !== null) {
      const hashedPassword: string = sha512(
        checkUser.salt + loginData.password + checkUser.salt,
      );
      const user: User = await this.usersRepository.findOne({
        where: {
          username: loginData.username,
          password: hashedPassword,
        },
        relations: { role: true },
      });

      // Inactive user cannot login to the application
      if (user !== null && user.isActive) {
        const userJwt: string = this.generateUserJwt(user);
        return { jwt: userJwt, statusCode: HttpStatus.OK };
      }
    }

    throw new NotFoundError('User with that credentials not found');
  }

  generateUserJwt(user: User): string {
    const userJwt: string = sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      secret,
      { expiresIn: '168h' },
    );

    return userJwt;
  }

  async createUser(createUser: CreateUser): Promise<object> {
    const checkUser = await this.usersRepository.findOneBy({
      username: createUser.username,
    });
    if (checkUser !== null)
      throw new ConflictError('User with that username already exists!');

    const role: Role = await this.rolesRepository.findOneBy({
      name: createUser.role,
    });

    const salt: string = UtilService.generateSalt();
    const hashedPassword: string = sha512(salt + createUser.password + salt);
    const user = new User(createUser.username, hashedPassword, role, salt);
    const resDb = await this.usersRepository.save(user);
    if (resDb !== null && resDb.isActive === true)
      return { success: true, statusCode: HttpStatus.CREATED };

    throw new InternalServerError(
      'Error received from server during user creation!',
    );
  }

  async getUser(userId: number): Promise<object> {
    if (userId) {
      const user: User = await this.usersRepository.findOne({
        where: { id: userId },
        relations: { role: true, permissions: true },
      });

      if (user !== null) {
        const returnedData = {
          id: user.id,
          username: user.username,
          role: user.role,
          isActive: user.isActive,
          statusCode: HttpStatus.OK,
        };
        return returnedData;
      }
    }
    throw new NotFoundError('User with that id does not exists!');
  }

  async getUserPermissions(userId: number): Promise<Array<Permission>> {
    if (userId) {
      const user: User = await this.usersRepository.findOne({
        where: { id: userId },
        relations: ['role', 'role.permissions', 'permissions'],
      });

      user.permissions.forEach((userPerm) => (userPerm['isUser'] = true));
      user.role.permissions.forEach((rolePerm) => (rolePerm['isUser'] = false));
      const finalPermissions = [...user.permissions, ...user.role.permissions];

      // eslint-disable-next-line prettier/prettier
      const allPermissions: Array<Permission> =
        await this.permissionsRepository.find({
          relations: ['roles'],
        });
      const ownedPermsNames = finalPermissions.map((perm) => perm.name);
      allPermissions.forEach((permission) => {
        // eslint-disable-next-line prettier/prettier
        permission['owned'] = ownedPermsNames.includes(permission.name)
          ? true
          : false;
        if (permission['owned']) {
          permission['isUser'] = permission.roles
            .map((role) => role.name)
            .includes(user.role.name)
            ? false
            : true;
        }
        delete permission.roles;
      });

      return allPermissions;
    }
    throw new NotFoundError('User with that id does not exists!');
  }

  async getUserOwnedPermissions(userId: number): Promise<Permission[]> {
    if (userId) {
      const user: User = await this.usersRepository.findOne({
        where: { id: userId },
        relations: ['role', 'role.permissions', 'permissions'],
      });
      user.permissions.forEach((userPerm) => (userPerm['isUser'] = true));
      user.role.permissions.forEach((rolePerm) => (rolePerm['isUser'] = false));
      const finalPermissions = [...user.permissions, ...user.role.permissions];
      return finalPermissions;
    }
    throw new NotFoundError('User with that id does not exists!');
  }

  async userHasPermission(
    user: User,
    permission: Permissions,
  ): Promise<boolean> {
    if (user && user.id) {
      const fullUser = await this.usersRepository.findOne({
        where: { id: user.id },
        relations: ['role', 'permissions', 'role.permissions'],
      });
      let userPermissions = [];
      if (userPermissions !== undefined)
        userPermissions = fullUser.permissions.map((perm) => perm.name);
      // eslint-disable-next-line prettier/prettier
      const userRolePermissions = fullUser.role.permissions.map(
        (perm) => perm.name,
      );
      const finalPermissions = [...userPermissions, ...userRolePermissions];
      if (finalPermissions.includes(permission)) return true;
    }
    return false;
  }

  async editUser(
    userIdEdited: number,
    authUser: User,
    editedUser: EditUser,
  ): Promise<CustomResponse> {
    // eslint-disable-next-line prettier/prettier
    const toEditUser: User = await this.usersRepository.findOne({
      where: { id: userIdEdited },
    });
    const checkPerms = this.userHasPermission(authUser, Permissions.AdminUsers);
    if (authUser.id === toEditUser.id || checkPerms) {
      for (const key of Object.keys(editedUser)) {
        if (key === 'role') {
          const newRole: Role = await this.rolesRepository.findOneBy({
            name: editedUser.role,
          });
          toEditUser.role = newRole;
        } else toEditUser[key] = editedUser[key];
      }
      await this.usersRepository.save(toEditUser);
      return new SuccessResponse();
    }
    throw new BadRequestError('Edit user request failed');
  }

  async deleteUser(
    userIdToDelete: number,
    authUser: User,
  ): Promise<CustomResponse | CustomError> {
    const userToDelete: User = await this.usersRepository.findOne({
      where: { id: userIdToDelete },
    });
    if (userToDelete) {
      // eslint-disable-next-line prettier/prettier
      const checkPerms = this.userHasPermission(
        authUser,
        Permissions.AdminUsers,
      );
      if (userToDelete.id !== authUser.id && !checkPerms) {
        throw new UnauthorizedError(
          "You don't have the permission to delete the user",
        );
      }

      // eslint-disable-next-line prettier/prettier
      const resRepo: DeleteResult = await this.usersRepository.delete(
        userToDelete.id,
      );
      return resRepo.affected > 0
        ? new SuccessResponse()
        : new InternalServerError('Error during deletion');
    }
    throw new NotFoundError('User to delete not found');
  }
}
