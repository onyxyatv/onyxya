import { Controller } from '@nestjs/common';
import { PermissionsService } from './permissions.service';

@Controller('acl')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}
}
