import {
  ForbiddenError,
  InternalServerError,
  UnauthorizedError,
} from '@common/errors/CustomError';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Permission } from 'src/models/permission.model';
import { UserService } from 'src/users/users.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private usersService: UserService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const req: any = context.switchToHttp().getRequest();
      const user: any = req.user;

      const needPermissions = Reflect.getMetadata(
        'permissions',
        context.getHandler(),
      );

      // const hasPermissions = Reflect.getMetadata(
      //     'hasPermissions',
      //     context.getHandler(),
      // );

      const fetchUserPerms = async (): Promise<boolean> => {
        if (needPermissions === undefined) {
          throw new InternalServerError(
            'Server Error : Permission needed not found',
          );
        }

        const userPermissions: Permission[] =
          await this.usersService.getUserOwnedPermissions(user.id);
        const permissionsNamesList = userPermissions.map((perm) => perm.name);
        for (const needed of needPermissions) {
          if (!permissionsNamesList.includes(needed))
            throw new ForbiddenError('Missing permission to do this action');
        }
        return true;
      };

      return Promise.resolve(fetchUserPerms());
    } catch (error) {
      throw new UnauthorizedError(
        'User not found or permission needed missing',
      );
    }
  }
}
