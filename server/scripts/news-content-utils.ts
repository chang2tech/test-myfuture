export const MIN_CONTENT_LENGTH = 200;
export const MIN_ARTICLES_PER_CATEGORY = 15;
export const LIST_PAGES_TO_SCRAPE = 2;

export const HOME_ARTICLE_EXTERNAL_SLUGS = [
  'MTE3NUZI',
  'MTE3NEZI',
  'MTE3M0ZI',
  'MTE3MkZI',
] as const;

import { decode } from 'he';

export function decodeHtmlEntities(value: string): string {
  return decode(value);
}

export function cleanContentHtml(html: string): string {
  return html
    .replace(/\s*<\/div>[\s\S]*$/, '')
    .replace(/\s*<div[^>]*$/, '')
    .trim();
}

export function isQualityContent(html: string | null | undefined): boolean {
  if (!html) return false;
  const cleaned = cleanContentHtml(html);
  return cleaned.length >= MIN_CONTENT_LENGTH && cleaned.includes('<p');
}
