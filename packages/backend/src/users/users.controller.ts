import { Body, Controller, Get, Post, Res, UsePipes } from '@nestjs/common';
import { loginSchema, LoginUser } from '@common/validation/auth/login.schema';
import { createUserSchema, CreateUser } from '@common/validation/auth/createUser.schema';
import { Response } from 'express';
import { ZodValidationPipe } from 'src/pipes/zod.pipe';
import { UserService } from './users.service';
import { User } from 'src/models/user.model';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async getAll(@Res() res: Response): Promise<object> {
        const users: Array<User> = await this.userService.getAllUsers();
        return res.status(200).json({
            count: users.length,
            users: users
        }); // Example -> { count: 0, users: [] }
    }

    @Post('login')
    @UsePipes(new ZodValidationPipe(loginSchema))
    async login(@Res() res: Response, @Body() body: LoginUser): Promise<object> {
        const resLogin: any = await this.userService.login(body);
        return res.status(resLogin.statusCode).json(resLogin);
    }

    @Post('new')
    @UsePipes(new ZodValidationPipe(createUserSchema))
    async createUser(@Res() res: Response, @Body() createUser: CreateUser): Promise<object> {
        const resCreatedUser: any = await this.userService.createUser(createUser);
        return res.status(resCreatedUser.statusCode).json(resCreatedUser);
    }
}
