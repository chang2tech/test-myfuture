import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { CategoryBanTinContent } from '@/components/news/category/CategoryBanTinContent';
import { ASSETS } from '@/constants/layout/assets';
import { getCategoryRouteById } from '@/constants/news/category-routes';
import { parseCategoryPageParam } from '@/constants/news/parse-category-page';
import { env } from '@/lib/core/env';

interface CategoryPagedRouteProps {
  params: Promise<{ categoryRoute: string; page: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPagedRouteProps): Promise<Metadata> {
  const { categoryRoute, page } = await params;
  const config = getCategoryRouteById(categoryRoute);
  const pageNumber = parseCategoryPageParam(page);
  if (!config || Number.isNaN(pageNumber)) return { title: 'Bản tin' };

  const title = `Bản tin - ${config.name} - Trang ${pageNumber}`;
  const description =
    'Cập nhật thông tin, phân tích chuyên sâu và xu hướng mới nhất về thị trường bất động sản';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${env.NEXT_PUBLIC_SITE_URL}/ban-tin/${config.routeId}/trang-${pageNumber}`,
      siteName: 'My Future',
      locale: 'vi_VN',
      type: 'website',
      images: [{ url: ASSETS.imageSeo, width: 1200, height: 630 }],
    },
  };
}

export default async function CategoryBanTinPagedRoute({
  params,
}: CategoryPagedRouteProps) {
  const { categoryRoute, page } = await params;
  const config = getCategoryRouteById(categoryRoute);
  const pageNumber = parseCategoryPageParam(page);

  if (!config || Number.isNaN(pageNumber) || pageNumber < 2) {
    notFound();
  }

  return (
    <AppShell>
      <CategoryBanTinContent
        categoryRoute={categoryRoute}
        page={pageNumber}
      />
    </AppShell>
  );
}
