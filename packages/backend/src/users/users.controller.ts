import { Body, Controller, HttpStatus, Post, Res, UsePipes } from '@nestjs/common';
import { LoginSchema, LoginSchemaDto } from '@common/validation/auth/login.schema';
import { Response } from 'express';

@Controller('users')
export class UserController {
    @Post('login')
    @UsePipes()
    login(@Body() body: LoginSchemaDto, @Res() res: Response): object {
        const check = LoginSchema.safeParse(body);
        if (!check.success) return res.status(HttpStatus.BAD_REQUEST).json(check.error);
        return {};
    }
}
