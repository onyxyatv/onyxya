import { Body, Controller, Get, HttpStatus, Post, Request, Res, UseGuards, UsePipes } from '@nestjs/common';
import { loginSchema, LoginUser } from '@common/validation/auth/login.schema';
import { createUserSchema, CreateUser } from '@common/validation/auth/createUser.schema';
import { Response } from 'express';
import { ZodValidationPipe } from 'src/pipes/zod.pipe';
import { UserService } from './users.service';
import { User } from 'src/models/user.model';
import { AuthGuard } from 'src/middlewares/auth.guard';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('/users')
  async getAll(@Res() res: Response): Promise<object> {
    const users: Array<User> = await this.userService.getAllUsers();
    return res.status(200).json({
      count: users.length,
      users: users
    }); // Example -> { count: 0, users: [] }
  }

  @Post('/login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(@Res() res: Response, @Body() body: LoginUser): Promise<object> {
    const resLogin: any = await this.userService.login(body);
    /*if (resLogin.statusCode === HttpStatus.OK) {
      res.cookie("onyxyaToken", resLogin.jwt, {
        httpOnly: false,
        maxAge: (10000*360*128),
        path: "/"
      });
    }*/
    return res.status(resLogin.statusCode).json(resLogin);
  }

  @Post('/users/new')
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async createUser(@Res() res: Response, @Body() createUser: CreateUser): Promise<object> {
    const resCreatedUser: any = await this.userService.createUser(createUser);
    return res.status(resCreatedUser.statusCode).json(resCreatedUser);
  }

  @UseGuards(AuthGuard)
  @Get('/me')
  async getMyProfile(@Request() req: any, @Res() res: Response): Promise<object> {
    const userId: number = req.user.id;
    const myProfileData: any = await this.userService.getMyProfile(userId);
    return res.status(myProfileData.statusCode).json(myProfileData);
  }
}
