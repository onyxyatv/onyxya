import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { Permission } from 'src/models/permission.model';
import { Request, Response } from 'express';
import { NeedPermissions } from './permissions.decorator';
import { Permissions } from 'src/db/permissions';
import { PermissionsGuard } from 'src/middlewares/permissions.guard';
import {
  AddUserPerm,
  addUserPermSchema,
} from '@common/validation/permissions/addUserPerm.schema';
import { ZodValidationPipe } from 'src/pipes/zod.pipe';
import {
  setUserPermissionsSchema,
  SetUserPermissions,
} from '@common/validation/permissions/setUserPermissions.schema';

@UseGuards(AuthGuard, PermissionsGuard)
@Controller('/permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @NeedPermissions(Permissions.ReadPermissions)
  @Get()
  async getAll(@Res() res: Response): Promise<object> {
    // eslint-disable-next-line prettier/prettier
    const permissions: Array<Permission> = await this.permissionsService.getAllPermissions();
    return res.status(200).json({
      count: permissions.length,
      permissions: permissions,
    });
  }

  @NeedPermissions(Permissions.ReadRolePermissions)
  @Get('/roles')
  // eslint-disable-next-line prettier/prettier
  async getPermissionsOfRole(@Req() req: Request, @Res() res: Response): Promise<object> {
    const query = req.query;
    // eslint-disable-next-line prettier/prettier
    const role: string | undefined = query.role ? String(query.role) : undefined;
    const permissions: object =
      await this.permissionsService.getRolePermissions(role);
    return res.status(200).json(permissions);
  }

  @NeedPermissions(Permissions.AdminUserPermissions)
  @UsePipes(new ZodValidationPipe(addUserPermSchema))
  @Post('/give')
  async addUserPermission(
    @Res() res: Response,
    @Body() addUserPerm: AddUserPerm,
  ): Promise<object> {
    // eslint-disable-next-line prettier/prettier
    const resService: { statusCode: number } = await this.permissionsService.addUserPermission(addUserPerm);
    return res.status(resService.statusCode).json(resService);
  }

  @NeedPermissions(Permissions.AdminUserPermissions)
  @UsePipes(new ZodValidationPipe(addUserPermSchema))
  @Post('/remove')
  async removeUserPermission(
    @Res() res: Response,
    @Body() removeUserPerm: AddUserPerm,
  ): Promise<object> {
    // eslint-disable-next-line prettier/prettier
    const resService: { statusCode: number } = await this.permissionsService.removeUserPermission(removeUserPerm);
    return res.status(resService.statusCode).json(resService);
  }

  @NeedPermissions(Permissions.AdminUserPermissions)
  @UsePipes(new ZodValidationPipe(setUserPermissionsSchema))
  @Post('/setUserPermissions')
  async setUserPermissions(
    @Res() res: Response,
    @Body() setUserPermissions: SetUserPermissions,
  ): Promise<object> {
    // eslint-disable-next-line prettier/prettier
    const resService: { statusCode: number } = await this.permissionsService.setUserPermissions(setUserPermissions);
    return res.status(resService.statusCode).json(resService);
  }
}
