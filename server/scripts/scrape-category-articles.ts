import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  LIST_PAGES_TO_SCRAPE,
  MIN_ARTICLES_PER_CATEGORY,
} from './news-content-utils';

interface ScrapedArticle {
  title: string;
  excerpt: string;
  coverImage: string;
  source: string | null;
  publishedAt: string;
  viewCount: number;
  externalHref: string;
  slug: string;
  categorySortOrder: number;
}

interface CategoryScrapeResult {
  categorySlug: string;
  routeId: string;
  articles: ScrapedArticle[];
}

const CATEGORY_PAGES = [
  {
    categorySlug: 'phap-ly-du-an',
    routeId: 'phap-ly-du-an-c11726',
    url: 'https://myfuture.vn/ban-tin/phap-ly-du-an-c11726.html',
  },
  {
    categorySlug: 'quy-hoach-ha-tang',
    routeId: 'quy-hoach-ha-tang-c11727',
    url: 'https://myfuture.vn/ban-tin/quy-hoach-ha-tang-c11727.html',
  },
  {
    categorySlug: 'lai-suat-tai-chinh',
    routeId: 'lai-suat-tai-chinh-c11728',
    url: 'https://myfuture.vn/ban-tin/lai-suat-tai-chinh-c11728.html',
  },
  {
    categorySlug: 'thi-truong-gia-ca',
    routeId: 'thi-truong-gia-ca-c11729',
    url: 'https://myfuture.vn/ban-tin/thi-truong-gia-ca-c11729.html',
  },
  {
    categorySlug: 'dau-tu-dong-tien',
    routeId: 'dau-tu-dong-tien-c11730',
    url: 'https://myfuture.vn/ban-tin/dau-tu-dong-tien-c11730.html',
  },
  {
    categorySlug: 'cho-thue',
    routeId: 'cho-thue-c11731',
    url: 'https://myfuture.vn/ban-tin/cho-thue-c11731.html',
  },
] as const;

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

function parseDate(value: string): string {
  const [day, month, year] = value.trim().split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00.000Z`;
}

function parseMaxPage(html: string): number {
  const matches = [...html.matchAll(/trang-(\d+)/g)];
  if (matches.length === 0) return 1;
  return Math.max(...matches.map((match) => Number(match[1])));
}

function parseArticles(html: string, sortOrderOffset = 0): ScrapedArticle[] {
  const articles: ScrapedArticle[] = [];
  const chunks = html.split('scale_img_hover');

  chunks.slice(1).forEach((chunk, index) => {
    const row = `scale_img_hover${chunk}`;

    const hrefMatch = row.match(/class="news-thumb[^"]*"[^>]*href="([^"]+)"/);
    const imgMatch = row.match(/<img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"/);
    const titleMatch = row.match(
      /class="text-dark fw-bold active-single fs-5">([^<]+)</,
    );
    const excerptMatch = row.match(
      /<div class="limit_1line mt-1">([\s\S]*?)<\/div>/,
    );
    const dateMatch = row.match(/bx-time-five"><\/i>\s*([0-9/]+)/);
    const viewMatch = row.match(/(\d+)\s+lượt xem/);

    if (!titleMatch || !hrefMatch) return;

    const title = titleMatch[1].trim();
    const externalHref = hrefMatch[1];
    const baseSlug = slugify(title);
    const uniqueSuffix = externalHref
      .replace('/ban-tin/', '')
      .replace('.html', '')
      .toLowerCase();

    articles.push({
      title,
      excerpt: excerptMatch?.[1]?.replace(/\s+/g, ' ').trim() ?? '',
      coverImage: imgMatch?.[1] ?? '',
      source: null,
      publishedAt: dateMatch
        ? parseDate(dateMatch[1])
        : new Date().toISOString(),
      viewCount: viewMatch ? Number(viewMatch[1]) : 0,
      externalHref,
      slug: `${baseSlug}-${uniqueSuffix}`.slice(0, 120),
      categorySortOrder: sortOrderOffset + index,
    });
  });

  return articles;
}

async function fetchHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; MyFutureClone/1.0)',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return response.text();
}

async function scrapeCategory(
  categorySlug: string,
  routeId: string,
  url: string,
): Promise<CategoryScrapeResult> {
  const firstHtml = await fetchHtml(url);
  const maxPage = parseMaxPage(firstHtml);
  const articles: ScrapedArticle[] = [];
  const seenHrefs = new Set<string>();

  const targetListSize = Math.max(
    MIN_ARTICLES_PER_CATEGORY,
    LIST_PAGES_TO_SCRAPE * 10,
  );
  const pagesToScrape = Math.min(
    maxPage,
    Math.max(
      LIST_PAGES_TO_SCRAPE,
      Math.ceil(MIN_ARTICLES_PER_CATEGORY / 10),
    ),
  );

  for (let page = 1; page <= pagesToScrape; page += 1) {
    const pageUrl =
      page === 1
        ? url
        : `https://myfuture.vn/ban-tin/${routeId}/trang-${page}/`;
    const html = page === 1 ? firstHtml : await fetchHtml(pageUrl);
    const pageArticles = parseArticles(html, articles.length);

    for (const article of pageArticles) {
      if (seenHrefs.has(article.externalHref)) continue;
      seenHrefs.add(article.externalHref);
      articles.push({
        ...article,
        categorySortOrder: articles.length,
      });
    }

    console.log(
      `  page ${page}/${pagesToScrape}: +${pageArticles.length} articles`,
    );

    if (articles.length >= targetListSize) break;
  }

  console.log(
    `Scraped ${articles.length} articles from ${categorySlug} (${pagesToScrape} page(s))`,
  );
  return { categorySlug, routeId, articles };
}

async function main() {
  const results: CategoryScrapeResult[] = [];

  for (const page of CATEGORY_PAGES) {
    const result = await scrapeCategory(
      page.categorySlug,
      page.routeId,
      page.url,
    );
    results.push(result);
  }

  const total = results.reduce(
    (sum, category) => sum + category.articles.length,
    0,
  );

  const outputPath = resolve(
    __dirname,
    '../prisma/data/scraped-category-articles.json',
  );

  writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`Saved ${total} articles to ${outputPath}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
