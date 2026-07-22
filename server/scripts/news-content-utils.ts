export {
  cleanContentHtml,
  decodeHtmlEntities,
  isQualityContent,
  MIN_ARTICLES_PER_CATEGORY,
  MIN_CONTENT_LENGTH,
} from '../prisma/seed-utils';

export const LIST_PAGES_TO_SCRAPE = 2;

export const HOME_ARTICLE_EXTERNAL_SLUGS = [
  'MTE3NUZI',
  'MTE3NEZI',
  'MTE3M0ZI',
  'MTE3MkZI',
] as const;
