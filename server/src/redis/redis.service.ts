import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client!: Redis;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    this.client = new Redis({
      host: this.config.get<string>('REDIS_HOST', 'localhost'),
      port: this.config.get<number>('REDIS_PORT', 6380),
      password: this.config.get<string>('REDIS_PASSWORD') || undefined,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    this.client.on('error', (error: Error) => {
      this.logger.error(`Redis error: ${error.message}`);
    });

    await this.client.connect();
    this.logger.log('Redis connected');
  }

  async onModuleDestroy() {
    if (this.client?.status === 'ready') {
      await this.client.quit();
    }
  }

  getClient(): Redis {
    return this.client;
  }

  ping(): Promise<string> {
    return this.client.ping();
  }
}
