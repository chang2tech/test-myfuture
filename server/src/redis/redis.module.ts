import { Global, Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { RateLimitService } from './rate-limit.service';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [RedisService, CacheService, RateLimitService],
  exports: [RedisService, CacheService, RateLimitService],
})
export class RedisModule {}
