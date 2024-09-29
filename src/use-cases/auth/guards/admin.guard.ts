import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

interface JwtPayload {
  sub: string;
  role: string;
}

@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
  handleRequest<User>(err: any, user: JwtPayload, info: any, context: ExecutionContext, status?: any): User {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    if (user.role !== 'admin') {
      throw new UnauthorizedException('You dont have the required admin rights.');
    }

    return user as unknown as User;
  }
}
