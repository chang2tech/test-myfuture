import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RateLimitService } from '../redis/rate-limit.service';
import type { AuthUser, JwtPayload } from './auth.types';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly rateLimit: RateLimitService,
  ) {}

  async login(email: string, password: string, clientIp: string) {
    const normalizedEmail = email.toLowerCase();
    const rateLimitKey = `ratelimit:login:${clientIp}:${normalizedEmail}`;
    const allowed = await this.rateLimit.consume(rateLimitKey, 10, 900);

    if (!allowed) {
      throw new HttpException(
        'Quá nhiều lần đăng nhập. Vui lòng thử lại sau.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const user = await this.usersRepository.findByEmail(normalizedEmail);
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      } satisfies JwtPayload,
      {
        secret: this.config.getOrThrow<string>('JWT_SECRET'),
        expiresIn: this.config.get<string>(
          'JWT_EXPIRES_IN',
          '7d',
        ) as `${number}d`,
      },
    );

    return { user: authUser, token };
  }

  async getProfile(userId: string): Promise<AuthUser> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Phiên đăng nhập không hợp lệ');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
