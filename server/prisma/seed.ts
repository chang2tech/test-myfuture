import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { decode } from 'he';

const MIN_CONTENT_LENGTH = 200;
const MIN_ARTICLES_PER_CATEGORY = 15;

function decodeHtmlEntities(value: string): string {
  return decode(value);
}

function cleanContentHtml(html: string): string {
  return html
    .replace(/\s*<\/div>[\s\S]*$/, '')
    .replace(/\s*<div[^>]*$/, '')
    .trim();
}

function isQualityContent(html: string | null | undefined): boolean {
  if (!html) return false;
  const cleaned = cleanContentHtml(html);
  return cleaned.length >= MIN_CONTENT_LENGTH && cleaned.includes('<p');
}

const prisma = new PrismaClient();

interface ScrapedArticle {
  title: string;
  excerpt: string;
  coverImage: string;
  source: string | null;
  publishedAt: string;
  viewCount: number;
  slug: string;
  externalHref: string;
  categorySortOrder: number;
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
}

interface CategoryScrapeResult {
  categorySlug: string;
  articles: ScrapedArticle[];
}

const categories = [
  { slug: 'phap-ly-du-an', name: 'Pháp lý dự án', sortOrder: 1 },
  { slug: 'quy-hoach-ha-tang', name: 'Quy hoạch - Hạ tầng', sortOrder: 2 },
  { slug: 'lai-suat-tai-chinh', name: 'Lãi suất - Tài chính', sortOrder: 3 },
  { slug: 'thi-truong-gia-ca', name: 'Thị trường - Giá cả', sortOrder: 4 },
  { slug: 'dau-tu-dong-tien', name: 'Đầu tư - Dòng tiền', sortOrder: 5 },
  { slug: 'cho-thue', name: 'Cho thuê', sortOrder: 6 },
];

const projects = [
  {
    slug: 'sunshine-river-park',
    name: 'Sunshine River Park',
    address:
      'Đường Lạc Long Quân, Phường Xuân La – Phú Thượng, Quận Tây Hồ, Hà Nội',
    investor: 'Sunshine Group',
    coverImage:
      'https://ca.futurehomes.vn/images/tienich/vkr5CRmiRInotjU-gbE79ft5g0rWRU6At0OV6_SjhzuDRbJZWhxyJBDHI3TwNtGuZiGcw_cq1EdHcijHxqPlY0pAUR2HhJ6daJoAhnuAF4gxH2bLf190IjHaSPM9dXZ-am1l9NfOgcYf0Fjb-7IH92gpbkivJ4AwiIADZMcfFKM.jpg',
    sortOrder: 1,
  },
  {
    slug: 'noble-palace-tay-thang-long',
    name: 'Noble Palace Tây Thăng Long',
    address: 'Xã Tân Lập, huyện Đan Phượng, Hà Nội',
    investor: 'Noble Group',
    coverImage:
      'https://ca.futurehomes.vn/images/tienich/_W_hFzg-jhBybR3zhPMP7Whr1jlvYHMbZwR1JFiWkV429KjNfuF0KjJvWJXvDO349iiepTNnI0i6XNP4oJHQzSEVts1pFDXuAFo8swUMUMNFDq0n0hbw17uMlG0Vtwv84dWVF61ofgvp08c71XF5E8MIJhYtCeMlzPzVrVsjjTA.jpg',
    sortOrder: 2,
  },
  {
    slug: 'sunshine-legend-city',
    name: 'Sunshine Legend City',
    address: 'Xã Long Hưng, huyện Văn Giang, tỉnh Hưng Yên',
    investor: 'Sunshine Group',
    coverImage:
      'https://ca.futurehomes.vn/images/543378414_1232619775547023_8736317169078602834_n1.jpg',
    sortOrder: 3,
  },
  {
    slug: 'vinhomes-ocean-park-2',
    name: 'Vinhomes Ocean Park 2',
    address: 'Nghĩa Trụ – Long Hưng, Văn Giang, Hưng Yên',
    investor: 'Vinhomes',
    coverImage: 'https://ca.futurehomes.vn/images/Vinhomes-Ocean-Park-2_10.jpg',
    sortOrder: 4,
  },
  {
    slug: 'lumiere-hanoi-seasons-garden',
    name: 'Lumière Hanoi Seasons Garden',
    address: '233 – 233B – 235 Nguyễn Trãi, Thanh Xuân, Hà Nội',
    investor: 'Masterise Homes',
    coverImage:
      'https://ca.futurehomes.vn/images/BDS/lumiere-hanoi-seasons-garden-1.jpg',
    sortOrder: 5,
  },
];

interface HomeArticleDetail {
  slug: string;
  externalSlug: string;
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

async function upsertArticle(
  data: {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    coverImage: string;
    source: string | null;
    sourceUrl: string | null;
    keywords: string[];
    readTimeMinutes: number;
    isHot: boolean;
    isFeatured: boolean;
    externalSlug: string;
    viewCount: number;
    categorySortOrder: number;
    publishedAt: Date;
    categoryId: string;
  },
) {
  const existing = await prisma.newsArticle.findFirst({
    where: {
      OR: [{ slug: data.slug }, { externalSlug: data.externalSlug }],
    },
  });

  if (existing) {
    await prisma.newsArticle.update({
      where: { id: existing.id },
      data: { ...data, slug: data.slug },
    });
    return data.slug;
  }

  await prisma.newsArticle.create({ data });
  return data.slug;
}

async function seedAdminUser() {
  const email = (process.env.DEV_ADMIN_EMAIL ?? 'admin@myfuture.vn').toLowerCase();
  const password = process.env.DEV_ADMIN_PASSWORD ?? 'Admin@2026';
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: 'ADMIN', name: 'Administrator' },
    create: {
      email,
      passwordHash,
      role: 'ADMIN',
      name: 'Administrator',
    },
  });

  console.log(`Seeded admin user: ${email}`);
}

async function main() {
  await seedAdminUser();

  for (const category of categories) {
    await prisma.newsCategory.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: { ...project, isFeatured: true },
      create: { ...project, isFeatured: true },
    });
  }

  const scrapedPath = resolve(__dirname, 'data/scraped-category-articles.json');
  const detailsPath = resolve(__dirname, 'data/scraped-article-details.json');
  const homePath = resolve(__dirname, 'data/scraped-ban-tin-home.json');

  const hasScrapedData =
    existsSync(scrapedPath) &&
    existsSync(detailsPath) &&
    existsSync(homePath);

  if (!hasScrapedData) {
    console.log(
      'Scraped article data not found — seeded admin, categories, and projects only.',
    );
    return;
  }

  const scrapedData = JSON.parse(
    readFileSync(scrapedPath, 'utf-8'),
  ) as CategoryScrapeResult[];
  const scrapedDetails = JSON.parse(
    readFileSync(detailsPath, 'utf-8'),
  ) as ScrapedArticleDetail[];
  const homeArticles = JSON.parse(
    readFileSync(homePath, 'utf-8'),
  ) as HomeArticleDetail[];
  const detailMap = new Map(
    scrapedDetails.map((detail) => [detail.slug, detail]),
  );

  const seededSlugs: string[] = [];
  const seededExternalSlugs = new Set<string>();

  await prisma.newsArticle.updateMany({ data: { isFeatured: false } });

  for (const article of homeArticles) {
    const category = await prisma.newsCategory.findUnique({
      where: { slug: article.categorySlug },
    });
    if (!category || !isQualityContent(article.contentHtml) || !article.title) continue;

    const slug = await upsertArticle({
      slug: article.slug,
      title: decodeHtmlEntities(article.title),
      excerpt: decodeHtmlEntities(article.excerpt),
      content: cleanContentHtml(article.contentHtml),
      coverImage: article.coverImage,
      source: article.source,
      sourceUrl: article.sourceUrl,
      keywords: article.keywords,
      readTimeMinutes: article.readTimeMinutes,
      isHot: article.isHot,
      isFeatured: article.isFeatured,
      externalSlug: article.externalSlug,
      viewCount: article.viewCount,
      categorySortOrder: article.homeSortOrder,
      publishedAt: new Date(article.publishedAt),
      categoryId: category.id,
    });

    seededSlugs.push(slug);
    seededExternalSlugs.add(article.externalSlug);
  }

  console.log(`Seeded ${homeArticles.length} home featured articles`);

  for (const categoryData of scrapedData) {
    const category = await prisma.newsCategory.findUnique({
      where: { slug: categoryData.categorySlug },
    });
    if (!category) continue;

    const seenExternal = new Set<string>();
    const qualityArticles: Array<{
      article: ScrapedArticle;
      detail: ScrapedArticleDetail;
    }> = [];

    const sortedArticles = [...categoryData.articles].sort(
      (a, b) => a.categorySortOrder - b.categorySortOrder,
    );

    for (const article of sortedArticles) {
      const detail = detailMap.get(article.slug);
      if (!detail || !isQualityContent(detail.contentHtml)) continue;
      if (seenExternal.has(detail.externalSlug)) continue;
      if (seededExternalSlugs.has(detail.externalSlug)) continue;

      seenExternal.add(detail.externalSlug);
      qualityArticles.push({ article, detail });
    }

    if (qualityArticles.length < MIN_ARTICLES_PER_CATEGORY) {
      console.warn(
        `Warning: ${categoryData.categorySlug} only has ${qualityArticles.length} quality articles (min ${MIN_ARTICLES_PER_CATEGORY})`,
      );
    }

    for (let index = 0; index < qualityArticles.length; index += 1) {
      const { article, detail } = qualityArticles[index];
      const content = cleanContentHtml(detail.contentHtml);

      const slug = await upsertArticle({
        slug: article.slug,
        title: decodeHtmlEntities(article.title),
        excerpt: decodeHtmlEntities(article.excerpt),
        content,
        coverImage: article.coverImage,
        source: detail.source ?? article.source,
        sourceUrl: detail.sourceUrl ?? null,
        keywords: detail.keywords,
        readTimeMinutes: detail.readTimeMinutes,
        isHot: detail.isHot,
        isFeatured: false,
        externalSlug: detail.externalSlug,
        viewCount: article.viewCount,
        categorySortOrder: index,
        publishedAt: new Date(article.publishedAt),
        categoryId: category.id,
      });

      seededSlugs.push(slug);
      seededExternalSlugs.add(detail.externalSlug);
    }

    console.log(
      `Seeded ${qualityArticles.length} articles for ${categoryData.categorySlug}`,
    );
  }

  const deleted = await prisma.newsArticle.deleteMany({
    where: { slug: { notIn: seededSlugs } },
  });

  console.log(`Removed ${deleted.count} old/duplicate articles`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
