import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { Permission } from 'src/models/permission.model';
import { Request, Response } from 'express';

@UseGuards(AuthGuard)
@Controller('/permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  async getAll(@Res() res: Response): Promise<object> {
    // eslint-disable-next-line prettier/prettier
    const permissions: Array<Permission> = await this.permissionsService.getAllPermissions();
    return res.status(200).json({
      count: permissions.length,
      permissions: permissions,
    });
  }

  @Get('/roles')
  // eslint-disable-next-line prettier/prettier
  async getPermissionsOfRole(@Req() req: Request, @Res() res: Response): Promise<object> {
    const query = req.query;
    // eslint-disable-next-line prettier/prettier
    const role: string | undefined = query.role ? String(query.role) : undefined;
    const permissions: Array<Permission> =
      await this.permissionsService.getRolePermissions(role);
    return res.status(200).json({
      count: permissions.length,
      permissions: permissions,
    });
  }
}
