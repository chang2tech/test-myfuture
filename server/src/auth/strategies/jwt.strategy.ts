import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { AuthUser, JwtPayload } from '../auth.types';
import { UsersRepository } from '../../users/users.repository';

function extractToken(req: Request): string | null {
  const cookieToken = req.cookies?.access_token as string | undefined;
  if (cookieToken) return cookieToken;

  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    return header.slice(7);
  }

  return null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly usersRepository: UsersRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([extractToken]),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<AuthUser> {
    const user = await this.usersRepository.findById(payload.sub);
    if (!user) {
      return Promise.reject(new Error('User not found'));
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
