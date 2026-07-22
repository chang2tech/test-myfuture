import { decode } from 'he';

export const MIN_CONTENT_LENGTH = 200;
export const MIN_ARTICLES_PER_CATEGORY = 15;

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
