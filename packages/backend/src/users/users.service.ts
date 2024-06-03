import { BadRequestError, InternalServerError, NotFoundError } from '@common/errors/CustomError';
import { LoginUser } from '@common/validation/auth/login.schema';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { sha512 } from 'js-sha512';
import { User } from 'src/models/user.model';
import { Repository } from 'typeorm';
import jwt, { sign } from "jsonwebtoken";
import { CreateUser } from '@common/validation/auth/createUser.schema';
import UtilService from 'src/utils/util.service';
const secret: string = process.env.JWT_SECRET_KEY;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { };

  getAllUsers(): Promise<Array<User> | null> {
    try {
      return this.usersRepository.find({
        select: {
          id: true,
          username: true,
          role: true,
          isActive: true,
          password: false,
          salt: false
        }
      });
    } catch (error) {
      console.log('Error at @getAllUsers : ', error);
      return null; // Will generate automatically a 500 internal server error 
    }
  }

  async login(loginData: LoginUser): Promise<object> {
    const checkUser = await this.usersRepository.findOneBy({ username: loginData.username });
    if (checkUser !== null) {
      const hashedPassword: string = sha512(checkUser.salt + loginData.password + checkUser.salt);
      const user: User = await this.usersRepository.findOneBy({
        username: loginData.username, password: hashedPassword
      });

      if (user !== null) {
        const userJwt: string = this.generateUserJwt(user);
        return { jwt: userJwt, statusCode: HttpStatus.OK };
      }
    }

    throw new NotFoundError("User with that credentials not found");
  }

  generateUserJwt(user: User): string {
    const userJwt: string = sign(
      {
        id: user.id,
        username: user.username,
        role: user.role
      },
      secret, { expiresIn: "168h" }
    );

    return userJwt;
  }

  async createUser(createUser: CreateUser): Promise<object> {
    const checkUser = await this.usersRepository.findOneBy({ username: createUser.username });
    if (checkUser !== null) throw new BadRequestError("User with that username already exists!");

    const salt: string = UtilService.generateSalt();
    const hashedPassword: string = sha512(salt + createUser.password + salt);
    const user = new User(createUser.username, hashedPassword, createUser.role, salt);
    const resDb = await this.usersRepository.save(user);
    if (resDb !== null && resDb.isActive === true) return { success: true, statusCode: HttpStatus.CREATED };

    throw new InternalServerError("Error received from server during user creation!");
  }

  async getMyProfile(userId: number): Promise<object> {
    if (userId) {
      const user: User = await this.usersRepository.findOneBy({ id: userId });

      if (user !== null) {
        let returnedData = {
          id: user.id, username: user.username,
          role: user.role, isActive: user.isActive,
          statusCode: HttpStatus.OK
        };
        return returnedData;
      }
    }
    throw new NotFoundError("User with that id does not exists!");
  }
}
