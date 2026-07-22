import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import type { UserRole } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';
import type { AuthUser } from '../auth.types';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = AuthUser>(
    err: Error | null,
    user: TUser | false,
  ): TUser {
    if (err || !user) {
      throw err ?? new UnauthorizedException('Bạn cần đăng nhập');
    }
    return user;
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles?.length) return true;

    const request = context.switchToHttp().getRequest<{ user: AuthUser }>();
    return roles.includes(request.user.role);
  }
}
