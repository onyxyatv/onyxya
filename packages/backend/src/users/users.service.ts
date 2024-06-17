import {
  ConflictError,
  InternalServerError,
  NotFoundError,
} from '@common/errors/CustomError';
import { LoginUser } from '@common/validation/auth/login.schema';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { sha512 } from 'js-sha512';
import { User } from 'src/models/user.model';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { CreateUser } from '@common/validation/auth/createUser.schema';
import UtilService from 'src/services/util.service';
import { Permission } from 'src/models/permission.model';
import { Role } from 'src/models/role.model';
const secret: string = process.env.JWT_SECRET_KEY;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
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
      const user: User = await this.usersRepository.findOneBy({
        username: loginData.username,
        password: hashedPassword,
      });

      if (user !== null) {
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

  async getProfile(userId: number): Promise<object> {
    if (userId) {
      const user: User = await this.usersRepository.findOne({
        where: { id: userId },
        relations: { role: true },
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

  async getUserPermissions(userId: number): Promise<Permission[]> {
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
}
