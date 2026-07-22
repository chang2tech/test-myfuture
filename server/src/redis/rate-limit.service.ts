import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';

@Injectable()
export class RateLimitService {
  constructor(private readonly redis: RedisService) {}

  async consume(
    key: string,
    limit: number,
    windowSeconds: number,
  ): Promise<boolean> {
    const client = this.redis.getClient();
    const count = await client.incr(key);

    if (count === 1) {
      await client.expire(key, windowSeconds);
    }

    return count <= limit;
  }
}
