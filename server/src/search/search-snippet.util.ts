import { decode } from 'he';

const TAG_REGEX = /<[^>]+>/g;
const WHITESPACE_REGEX = /\s+/g;

export function stripArticleHtml(value: string): string {
  return decode(value.replace(TAG_REGEX, ' '))
    .replace(WHITESPACE_REGEX, ' ')
    .trim();
}

export function buildArticleSnippet(
  excerpt: string | null,
  content: string,
  query: string,
  maxLength = 96,
): string | null {
  const source = excerpt?.trim() || stripArticleHtml(content);
  if (!source) return null;

  const normalizedQuery = query.trim();
  if (!normalizedQuery) {
    return source.length > maxLength
      ? `${source.slice(0, maxLength).trim()}…`
      : source;
  }

  const lowerSource = source.toLowerCase();
  const lowerQuery = normalizedQuery.toLowerCase();
  const matchIndex = lowerSource.indexOf(lowerQuery);

  if (matchIndex < 0) {
    return source.length > maxLength
      ? `${source.slice(0, maxLength).trim()}…`
      : source;
  }

  const start = Math.max(0, matchIndex - 24);
  const end = Math.min(source.length, start + maxLength);
  const prefix = start > 0 ? '…' : '';
  const suffix = end < source.length ? '…' : '';

  return `${prefix}${source.slice(start, end).trim()}${suffix}`;
}
