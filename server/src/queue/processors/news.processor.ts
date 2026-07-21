import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

export const NEWS_QUEUE = 'news';

export interface SyncNewsJobData {
  source: string;
}

@Processor(NEWS_QUEUE)
export class NewsProcessor extends WorkerHost {
  private readonly logger = new Logger(NewsProcessor.name);

  async process(job: Job<SyncNewsJobData>): Promise<void> {
    this.logger.log(
      `Processing news sync job ${job.id} from ${job.data.source}`,
    );
    await new Promise((resolve) => setTimeout(resolve, 100));
    this.logger.log(`News sync job ${job.id} completed`);
  }
}
