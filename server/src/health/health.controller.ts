import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  @Get()
  async check() {
    const [dbResult, redisResult] = await Promise.all([
      this.prisma.$queryRaw`SELECT 1`,
      this.redis.ping(),
    ]);

    return {
      status: 'ok',
      db: Boolean(dbResult),
      redis: redisResult === 'PONG',
      timestamp: new Date().toISOString(),
    };
  }
}
