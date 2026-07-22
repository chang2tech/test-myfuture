import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';

@Injectable()
export class CacheService {
  constructor(private readonly redis: RedisService) {}

  async getOrSet<T>(
    key: string,
    ttlSeconds: number,
    factory: () => Promise<T>,
  ): Promise<T> {
    const client = this.redis.getClient();
    const cached = await client.get(key);

    if (cached) {
      return JSON.parse(cached) as T;
    }

    const value = await factory();
    await client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    return value;
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const client = this.redis.getClient();
    let cursor = '0';

    do {
      const [nextCursor, keys] = await client.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        100,
      );
      cursor = nextCursor;

      if (keys.length > 0) {
        await client.del(...keys);
      }
    } while (cursor !== '0');
  }

  async invalidateNewsCache(): Promise<void> {
    await this.invalidatePattern('news:*');
    await this.invalidatePattern('search:popular*');
  }
}
