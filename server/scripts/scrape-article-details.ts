import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  isQualityContent,
} from './news-content-utils';

interface ScrapedListArticle {
  title: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string;
  viewCount: number;
  externalHref: string;
  slug: string;
}

interface CategoryScrapeResult {
  categorySlug: string;
  articles: ScrapedListArticle[];
}

interface ScrapedArticleDetail {
  slug: string;
  externalSlug: string;
  contentHtml: string;
  keywords: string[];
  readTimeMinutes: number;
  isHot: boolean;
  source: string | null;
  sourceUrl: string | null;
  nextExternalSlug: string | null;
  nextTitle: string | null;
  prevExternalSlug: string | null;
  prevTitle: string | null;
  recommended: Array<{
    externalSlug: string;
    title: string;
    coverImage: string;
    categoryName: string;
    publishedAt: string;
    viewCount: number;
  }>;
}

function extractArticleContent(html: string): string {
  const startIndex = html.indexOf('id="article-content"');
  if (startIndex === -1) return '';

  const contentStart = html.indexOf('>', startIndex) + 1;
  const endIndex = html.indexOf('<div class="article-share-bottom"', contentStart);
  if (endIndex === -1) return '';

  return html.slice(contentStart, endIndex).replace(/<\/div>\s*$/i, '').trim();
}

function parseKeywords(html: string): string[] {
  const blockMatch = html.match(/class="hashtag[\s\S]*?<\/div>\s*<\/div>/);
  if (!blockMatch) return [];

  return [...blockMatch[0].matchAll(/#([^<]+)</g)].map((match) =>
    match[1].trim(),
  );
}

function parseReadTime(html: string): number {
  const match = html.match(/js-read-time[\s\S]*?<span>(\d+)<\/span>/);
  return match ? Number(match[1]) : 5;
}

function parseNavigation(html: string) {
  const prevBlock = html.match(/nav-item-prev[\s\S]*?<\/div>\s*<\/div>/);
  const nextBlock = html.match(/nav-item-next[\s\S]*?<\/div>\s*<\/div>/);

  const prevHref = prevBlock?.[0].match(/href="\/ban-tin\/([^"]+)\.html"/);
  const prevTitle = prevBlock?.[0].match(/class="nav-title[^"]*">([^<]+)</);
  const nextHref = nextBlock?.[0].match(/href="\/ban-tin\/([^"]+)\.html"/);
  const nextTitle = nextBlock?.[0].match(/class="nav-title[^"]*">([^<]+)</);

  return {
    prevExternalSlug: prevHref?.[1] ?? null,
    prevTitle: prevTitle?.[1]?.trim() ?? null,
    nextExternalSlug: nextHref?.[1] ?? null,
    nextTitle: nextTitle?.[1]?.trim() ?? null,
  };
}

function parseRecommended(html: string) {
  const section = html.match(/id="new-recommended"[\s\S]*?<\/style>/);
  if (!section) return [];

  const items: ScrapedArticleDetail['recommended'] = [];
  const chunks = section[0].split('class="new-item"').slice(1);

  for (const chunk of chunks) {
    const hrefMatch = chunk.match(/href="\/ban-tin\/([^"]+)\.html"/);
    const titleMatch = chunk.match(/class="card-title[^"]*">([^<]+)</);
    const imageMatch = chunk.match(/<img src="([^"]+)"/);
    const categoryMatch = chunk.match(/class="badge-category[^"]*">([^<]+)</);
    const dateMatch = chunk.match(/fa-clock-o"><\/i>\s*([0-9/]+)/);
    const viewMatch = chunk.match(/fa-eye"><\/i>\s*(\d+)/);

    if (!hrefMatch || !titleMatch) continue;

    items.push({
      externalSlug: hrefMatch[1],
      title: titleMatch[1].trim(),
      coverImage: imageMatch?.[1] ?? '',
      categoryName: categoryMatch?.[1]?.trim() ?? '',
      publishedAt: dateMatch?.[1] ?? '',
      viewCount: viewMatch ? Number(viewMatch[1]) : 0,
    });
  }

  return items;
}

function parseSource(contentHtml: string) {
  const sourceMatch = contentHtml.match(/Nguồn:\s*<a[^>]+href="([^"]+)"[^>]*>([^<]+)</i);
  if (!sourceMatch) {
    const plainMatch = contentHtml.match(/Nguồn:\s*([^<]+)</);
    return {
      sourceUrl: null,
      source: plainMatch?.[1]?.replace(/\.$/, '').trim() ?? null,
    };
  }

  return {
    sourceUrl: sourceMatch[1],
    source: sourceMatch[2].replace(/\.$/, '').trim(),
  };
}

async function fetchDetail(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MyFutureClone/1.0)' },
  });
  if (!response.ok) {
    throw new Error(`Failed ${url}: ${response.status}`);
  }
  return response.text();
}

async function scrapeArticleDetail(
  article: { slug: string; externalHref: string; title: string },
): Promise<ScrapedArticleDetail | null> {
  const url = `https://myfuture.vn${article.externalHref}`;
  const html = await fetchDetail(url);
  const contentHtml = extractArticleContent(html);

  if (!isQualityContent(contentHtml)) {
    return null;
  }

  const { source, sourceUrl } = parseSource(contentHtml);
  const navigation = parseNavigation(html);
  const externalSlug = article.externalHref
    .replace('/ban-tin/', '')
    .replace('.html', '');

  return {
    slug: article.slug,
    externalSlug,
    contentHtml,
    keywords: parseKeywords(html),
    readTimeMinutes: parseReadTime(html),
    isHot: html.includes('article-cat-pill'),
    source,
    sourceUrl,
    ...navigation,
    recommended: parseRecommended(html),
  };
}

async function main() {
  const listPath = resolve(__dirname, '../prisma/data/scraped-category-articles.json');
  const categories = JSON.parse(
    readFileSync(listPath, 'utf-8'),
  ) as CategoryScrapeResult[];

  const articles = categories.flatMap((category) =>
    category.articles.map((article) => ({
      ...article,
      categorySlug: category.categorySlug,
    })),
  );

  const details: ScrapedArticleDetail[] = [];
  const uniqueHrefs = new Set<string>();
  let skipped = 0;

  for (const article of articles) {
    if (uniqueHrefs.has(article.externalHref)) continue;
    uniqueHrefs.add(article.externalHref);

    let detail = await scrapeArticleDetail(article);
    if (!detail) {
      await new Promise((resolveDelay) => setTimeout(resolveDelay, 300));
      detail = await scrapeArticleDetail(article);
    }

    if (!detail) {
      skipped += 1;
      console.log(`Skipped (no content): ${article.title.slice(0, 50)}...`);
      continue;
    }

    details.push(detail);
    console.log(`Scraped detail: ${article.title.slice(0, 50)}...`);
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 200));
  }

  const outputPath = resolve(__dirname, '../prisma/data/scraped-article-details.json');
  writeFileSync(outputPath, JSON.stringify(details, null, 2), 'utf-8');
  console.log(
    `Saved ${details.length} article details (${skipped} skipped) to ${outputPath}`,
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
