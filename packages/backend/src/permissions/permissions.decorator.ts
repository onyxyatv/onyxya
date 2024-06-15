import { SetMetadata } from '@nestjs/common';

export const NeedPermissions = (...permissions: string[]) =>
  SetMetadata('permissions', permissions);
