import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { isQualityContent } from './news-content-utils';

const HOME_ARTICLE_HREFS = [
  '/ban-tin/MTE3NUZI.html',
  '/ban-tin/MTE3NEZI.html',
  '/ban-tin/MTE3M0ZI.html',
  '/ban-tin/MTE3MkZI.html',
] as const;

interface HomeArticleDetail {
  externalHref: string;
  externalSlug: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string;
  viewCount: number;
  isFeatured: boolean;
  homeSortOrder: number;
  contentHtml: string;
  keywords: string[];
  readTimeMinutes: number;
  isHot: boolean;
  source: string | null;
  sourceUrl: string | null;
  categorySlug: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function parseDate(value: string): string {
  const parts = value.trim().split('/');
  if (parts.length !== 3) return new Date().toISOString();
  const [day, month, year] = parts;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00.000Z`;
}

function extractArticleContent(html: string): string {
  const startIndex = html.indexOf('id="article-content"');
  if (startIndex === -1) return '';

  const contentStart = html.indexOf('>', startIndex) + 1;
  const endIndex = html.indexOf('<div class="article-share-bottom"', contentStart);
  if (endIndex === -1) return '';

  return html.slice(contentStart, endIndex).replace(/<\/div>\s*$/i, '').trim();
}

function parseTitle(html: string): string {
  const match = html.match(/class="article-title">([^<]+)</);
  return match ? decodeHtmlEntities(match[1].trim()) : '';
}

function parseExcerpt(contentHtml: string): string {
  const text = contentHtml
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.slice(0, 320);
}

function parseCoverImage(html: string): string {
  const ogImage = html.match(/property="og:image" content="([^"]+)"/)?.[1];
  if (ogImage) return ogImage;

  const contentImage = extractArticleContent(html).match(/<img[^>]*src="([^"]+)"/)?.[1];
  return contentImage ?? '';
}

function parseMeta(html: string) {
  const dateMatch = html.match(/fa-clock-o"><\/i>\s*(\d{2}\/\d{2}\/\d{4})/);
  const viewMatch = html.match(/fa-eye"><\/i>\s*(\d+)/);
  const readTimeMatch = html.match(/js-read-time[\s\S]*?<span>(\d+)<\/span>/);

  return {
    publishedAt: dateMatch ? parseDate(dateMatch[1]) : new Date().toISOString(),
    viewCount: viewMatch ? Number(viewMatch[1]) : 0,
    readTimeMinutes: readTimeMatch ? Number(readTimeMatch[1]) : 5,
  };
}

function parseCategorySlug(html: string): string {
  const categoryHref = html.match(
    /fh-breadcrumb[\s\S]*?href="\/ban-tin\/([^"]+\.html)"/,
  )?.[1];

  const routeMap: Record<string, string> = {
    'phap-ly-du-an-c11726': 'phap-ly-du-an',
    'quy-hoach-ha-tang-c11727': 'quy-hoach-ha-tang',
    'lai-suat-tai-chinh-c11728': 'lai-suat-tai-chinh',
    'thi-truong-gia-ca-c11729': 'thi-truong-gia-ca',
    'dau-tu-dong-tien-c11730': 'dau-tu-dong-tien',
    'cho-thue-c11731': 'cho-thue',
  };

  if (!categoryHref) return 'quy-hoach-ha-tang';
  const routeId = categoryHref.replace('.html', '');
  return routeMap[routeId] ?? 'quy-hoach-ha-tang';
}

async function fetchHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MyFutureClone/1.0)' },
  });
  if (!response.ok) {
    throw new Error(`Failed ${url}: ${response.status}`);
  }
  return response.text();
}

async function main() {
  const details: HomeArticleDetail[] = [];

  for (let index = 0; index < HOME_ARTICLE_HREFS.length; index += 1) {
    const externalHref = HOME_ARTICLE_HREFS[index];
    const url = `https://myfuture.vn${externalHref}`;
    const html = await fetchHtml(url);
    const contentHtml = extractArticleContent(html);

    if (!isQualityContent(contentHtml)) {
      console.log(`Skipped low content: ${externalHref}`);
      continue;
    }

    const title = parseTitle(html);
    const externalSlug = externalHref.replace('/ban-tin/', '').replace('.html', '');
    const meta = parseMeta(html);

    details.push({
      externalHref,
      externalSlug,
      slug: `${slugify(title)}-${externalSlug.toLowerCase()}`.slice(0, 120),
      title,
      excerpt: parseExcerpt(contentHtml),
      coverImage: parseCoverImage(html),
      publishedAt: meta.publishedAt,
      viewCount: meta.viewCount,
      isFeatured: index === 0,
      homeSortOrder: index,
      contentHtml,
      keywords: [],
      readTimeMinutes: meta.readTimeMinutes,
      isHot: html.includes('article-cat-pill'),
      source: null,
      sourceUrl: null,
      categorySlug: parseCategorySlug(html),
    });

    console.log(`Scraped home article: ${title.slice(0, 50)}...`);
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 200));
  }

  const outputPath = resolve(__dirname, '../prisma/data/scraped-ban-tin-home.json');
  writeFileSync(outputPath, JSON.stringify(details, null, 2), 'utf-8');
  console.log(`Saved ${details.length} home articles to ${outputPath}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
