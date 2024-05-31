import { Body, Controller, Get, HttpStatus, Post, Res, UsePipes } from '@nestjs/common';
import { LoginSchema, LoginSchemaDto } from '@common/validation/auth/login.schema';
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
    @UsePipes(new ZodValidationPipe(LoginSchema))
    async login(@Body() body: LoginSchemaDto, @Res() res: Response): Promise<object> {
        const check = LoginSchema.safeParse(body);
        if (!check.success) return res.status(HttpStatus.BAD_REQUEST).json(check.error);

        const resLogin: any = await this.userService.login(body);
        return res.status(resLogin.statusCode).json(resLogin);
    }
}
