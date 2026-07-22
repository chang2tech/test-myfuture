export const NEWS_QUEUE = 'news';

export enum NewsJobName {
  INCREMENT_VIEW = 'increment-view',
  INVALIDATE_CACHE = 'invalidate-cache',
}

export interface IncrementViewJobData {
  articleId: string;
}

export type NewsJobData = IncrementViewJobData | Record<string, never>;
