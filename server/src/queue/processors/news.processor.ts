import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../../redis/cache.service';
import {
  NEWS_QUEUE,
  NewsJobName,
  type IncrementViewJobData,
} from '../news-queue.types';

@Processor(NEWS_QUEUE)
export class NewsProcessor extends WorkerHost {
  private readonly logger = new Logger(NewsProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: CacheService,
  ) {
    super();
  }

  async process(job: Job<IncrementViewJobData | Record<string, never>>) {
    const jobName = job.name as NewsJobName;

    if (jobName === NewsJobName.INCREMENT_VIEW) {
      await this.handleIncrementView(job as Job<IncrementViewJobData>);
      return;
    }

    if (jobName === NewsJobName.INVALIDATE_CACHE) {
      await this.handleInvalidateCache(job.id);
      return;
    }

    this.logger.warn(`Unknown job name: ${job.name}`);
  }

  private async handleIncrementView(job: Job<IncrementViewJobData>) {
    await this.prisma.newsArticle.update({
      where: { id: job.data.articleId },
      data: { viewCount: { increment: 1 } },
    });
    this.logger.debug(
      `Incremented view count for article ${job.data.articleId}`,
    );
  }

  private async handleInvalidateCache(jobId: string | undefined) {
    await this.cacheService.invalidateNewsCache();
    this.logger.log(`Invalidated news cache (job ${jobId ?? 'n/a'})`);
  }
}
