import { SetMetadata } from '@nestjs/common';

export const NeedPermissions = (...permissions: string[]) =>
  SetMetadata('permissions', permissions);

export const HasPermission = (...permissions: string[]) =>
  SetMetadata('hasPermissions', permissions);
