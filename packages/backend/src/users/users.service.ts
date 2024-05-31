import { NotFoundError } from '@common/errors/CustomError';
import { LoginSchemaDto } from '@common/validation/auth/login.schema';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { sha512 } from 'js-sha512';
import { User } from 'src/models/user.model';
import { Repository } from 'typeorm';
import jwt, { JsonWebTokenError, sign } from "jsonwebtoken";
const secret: string = process.env.JWT_SECRET_KEY;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { };

  getAllUsers(): Promise<Array<User> | null> {
    try {
      return this.usersRepository.find();
    } catch (error) {
      console.log('Error at @getAllUsers : ', error);
      return null; // Will generate automatically a 500 internal server error 
    }
  }

  async login(loginData: LoginSchemaDto): Promise<object> {
    const checkUser = await this.usersRepository.findOneBy({ username: loginData.username });
    if (checkUser !== null) {
      const hashedPassword: string = sha512(checkUser.salt + loginData.password + checkUser.salt);
      const user: User = await this.usersRepository.findOneBy({
        username: loginData.username, password: hashedPassword
      });

      if (user !== null) {  
        const userJwt: string = this.generateUserJwt(user.username, user.role);
        return { jwt: userJwt, statusCode: HttpStatus.OK };
      }
    }

    throw new NotFoundError("User with that credentials not found");
  }

  generateUserJwt(username: string, role: string): string {
    const userJwt: string = sign(
      { 
        username: username, 
        role: role 
      },
      secret, { expiresIn: "168h" }
    );

    return userJwt;
  }
}
