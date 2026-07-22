import { ArticleStatus, Prisma } from '@prisma/client';

export function buildArticleSearchFilter(
  search: string,
): Prisma.NewsArticleWhereInput | undefined {
  const trimmed = search.trim();
  if (!trimmed) return undefined;

  const terms = [
    ...new Set(trimmed.split(/\s+/).filter((term) => term.length > 0)),
  ];

  const orConditions: Prisma.NewsArticleWhereInput[] = [
    { title: { contains: trimmed, mode: 'insensitive' } },
    { excerpt: { contains: trimmed, mode: 'insensitive' } },
    { content: { contains: trimmed, mode: 'insensitive' } },
    { slug: { contains: trimmed, mode: 'insensitive' } },
    { externalSlug: { contains: trimmed, mode: 'insensitive' } },
  ];

  for (const term of terms) {
    orConditions.push(
      { title: { contains: term, mode: 'insensitive' } },
      { excerpt: { contains: term, mode: 'insensitive' } },
      { content: { contains: term, mode: 'insensitive' } },
      { keywords: { has: term } },
    );
  }

  return { OR: orConditions };
}

export function mergeArticleSearchWhere(
  base: Prisma.NewsArticleWhereInput,
  search?: string,
): Prisma.NewsArticleWhereInput {
  const searchFilter = search ? buildArticleSearchFilter(search) : undefined;
  if (!searchFilter) return base;

  return { AND: [base, searchFilter] };
}

export function publishedArticleWhere(): Prisma.NewsArticleWhereInput {
  return { status: ArticleStatus.PUBLISHED };
}
