import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Request,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { loginSchema, LoginUser } from '@common/validation/auth/login.schema';
import {
  createUserSchema,
  CreateUser,
} from '@common/validation/auth/createUser.schema';
import { Response } from 'express';
import { ZodValidationPipe } from 'src/pipes/zod.pipe';
import { UserService } from './users.service';
import { User } from 'src/models/user.model';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { PermissionsGuard } from 'src/middlewares/permissions.guard';
import { PermissionsService } from 'src/permissions/permissions.service';
import { NeedPermissions } from 'src/permissions/permissions.decorator';
import { Permissions } from 'src/db/permissions';
import { Permission } from 'src/models/permission.model';
import { CustomResponse } from '@common/errors/customResponses';
import {
  editUserSchema,
  EditUser,
} from '@common/validation/auth/editUser.schema';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly permissionsService: PermissionsService,
  ) {}

  @NeedPermissions(Permissions.AdminUsers)
  @UseGuards(AuthGuard, PermissionsGuard)
  @Get('/users')
  async getAll(@Res() res: Response): Promise<object> {
    const users: Array<User> = await this.userService.getAllUsers();
    return res.status(200).json({
      count: users.length,
      users: users,
    }); // Example -> { count: 0, users: [] }
  }

  @Post('/login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(@Res() res: Response, @Body() body: LoginUser): Promise<object> {
    const resLogin: any = await this.userService.login(body);
    return res.status(resLogin.statusCode).json(resLogin);
  }

  @Post('/users/new')
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async createUser(
    @Res() res: Response,
    @Body() createUser: CreateUser,
  ): Promise<object> {
    const resCreatedUser: any = await this.userService.createUser(createUser);
    return res.status(resCreatedUser.statusCode).json(resCreatedUser);
  }

  @UseGuards(AuthGuard)
  @Get('/me')
  async getMyProfile(
    @Request() req: any,
    @Res() res: Response,
  ): Promise<object> {
    const userId: number = req.user.id;
    const myProfileData: any = await this.userService.getUser(userId);
    return res.status(myProfileData.statusCode).json(myProfileData);
  }

  @NeedPermissions(Permissions.AdminUsers)
  @UseGuards(AuthGuard, PermissionsGuard)
  @Get('/users/user/:id')
  async getById(@Request() req: any, @Res() res: Response): Promise<object> {
    const userId: number = req.params.id;
    const user: any = await this.userService.getUser(userId);
    return res.status(200).json(user);
  }

  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(editUserSchema))
  @Patch('/users/user/:id')
  async editUser(
    @Request() req: any,
    @Res() res: Response,
    editedUser: EditUser,
  ): Promise<object> {
    const userIdEdited: number = req.params.id;
    const user: User = req.user;
    // eslint-disable-next-line prettier/prettier
    const resService: CustomResponse = await this.userService.editUser(userIdEdited, user, editedUser);
    return res.status(resService.statusCode).json(resService);
  }

  @UseGuards(AuthGuard)
  @Get('/users/user/:id/permissions')
  async getUserFullPermissions(
    @Request() req: any,
    @Res() res: Response,
  ): Promise<object> {
    const userId: number = req.params.id;
    // eslint-disable-next-line prettier/prettier
    const userPermissions: Array<Permission> = await this.userService.getUserPermissions(userId);
    return res.status(200).json({
      count: userPermissions.length,
      permissions: userPermissions,
    });
  }

  @UseGuards(AuthGuard)
  @Get('/users/user/:id/permissions/owned')
  async getUserOwnedPermissions(
    @Request() req: any,
    @Res() res: Response,
  ): Promise<object> {
    const userId: number = req.params.id;
    const userPermissions: Array<Permission> =
      await this.userService.getUserOwnedPermissions(userId);
    return res
      .status(200)
      .json({ count: userPermissions.length, permissions: userPermissions });
  }
}
