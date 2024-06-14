import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { Permission } from 'src/models/permission.model';
import { Response } from 'express';

@Controller()
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @UseGuards(AuthGuard)
  @Get('/permissions')
  async getAll(@Res() res: Response): Promise<object> {
    const permissions: Array<Permission> = await this.permissionsService.getAllPermissions();
    return res.status(200).json({
      count: permissions.length,
      permissions: permissions,
    });
  }
}
