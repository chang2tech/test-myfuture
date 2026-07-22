import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import { SearchResultsContent } from '@/components/search/SearchResultsContent';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const title = q?.trim()
    ? `Tìm kiếm: ${q.trim()}`
    : 'Tìm kiếm bài viết';

  return {
    title: `${title} - MyFuture.vn`,
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;

  return (
    <AppShell>
      <div className="container-xxl flex-grow-1 container-p-y">
        <SearchResultsContent query={q?.trim() ?? ''} />
      </div>
    </AppShell>
  );
}
