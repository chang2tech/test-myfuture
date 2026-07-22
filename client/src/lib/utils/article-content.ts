function normalizeImageSrc(src: string): string {
  const trimmed = src.trim();
  if (!trimmed) return '';

  try {
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return new URL(trimmed).pathname;
    }
  } catch {
    // ignore invalid URL
  }

  return trimmed.split('?')[0] ?? trimmed;
}

const FIRST_IMG_PATTERN =
  /<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*\/?>/i;

export function stripDuplicateCoverImage(
  content: string,
  coverImage: string | null | undefined,
): string {
  if (!coverImage?.trim()) return content;

  const normalizedCover = normalizeImageSrc(coverImage);
  const match = content.match(FIRST_IMG_PATTERN);
  if (!match?.[1]) return content;

  if (normalizeImageSrc(match[1]) !== normalizedCover) return content;

  let result = content.replace(FIRST_IMG_PATTERN, '').trim();

  result = result
    .replace(/^\s*<p[^>]*>\s*<\/p>\s*/i, '')
    .replace(/^\s*<figure[^>]*>\s*<\/figure>\s*/i, '')
    .replace(/^\s*<div[^>]*>\s*<\/div>\s*/i, '');

  return result;
}
