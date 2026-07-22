import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import {
  NEWS_QUEUE,
  NewsJobName,
  type IncrementViewJobData,
} from './news-queue.types';

@Injectable()
export class NewsQueueService {
  constructor(@InjectQueue(NEWS_QUEUE) private readonly queue: Queue) {}

  incrementViewCount(articleId: string) {
    return this.queue.add(
      NewsJobName.INCREMENT_VIEW,
      { articleId } satisfies IncrementViewJobData,
      {
        removeOnComplete: 200,
        removeOnFail: 100,
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
      },
    );
  }

  invalidateNewsCache() {
    return this.queue.add(
      NewsJobName.INVALIDATE_CACHE,
      {},
      {
        removeOnComplete: 50,
        removeOnFail: 50,
        attempts: 2,
      },
    );
  }
}
