import { UnauthorizedError } from '@common/errors/CustomError';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  private jwtSecret: string = process.env.JWT_SECRET_KEY;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const req: any = context.switchToHttp().getRequest();
      const headers: any = req.headers;

      const authorization = headers.authorization?.split(' ');
      if (!authorization)
        throw new UnauthorizedError('Missing Authorization token');

      if (authorization.length > 1 && authorization[0] !== 'Bearer')
        throw new Error();
      // eslint-disable-next-line prettier/prettier
      const token = authorization.length > 1 ? authorization[1] : authorization[0];

      const payload = verify(token, this.jwtSecret);
      req['user'] = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedError('invalid Or Missing Authorization token');
    }
  }
}
