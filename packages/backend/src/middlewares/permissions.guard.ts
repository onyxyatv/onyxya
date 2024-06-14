import { UnauthorizedError } from '@common/errors/CustomError';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Permission } from 'src/models/permission.model';
import { UserService } from 'src/users/users.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private usersService: UserService) {}

  // eslint-disable-next-line prettier/prettier
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const req: any = context.switchToHttp().getRequest();
      const user: any = req.user;

      const fetchUserPerms = async () => {
        const userPermissions: Permission[] = await this.usersService.getUserPermissions(user.id);
        console.log(userPermissions);
      };
      fetchUserPerms();
      return true;
    } catch (error) {
      throw new UnauthorizedError('User not found or permission missing');
    }
  }
}
