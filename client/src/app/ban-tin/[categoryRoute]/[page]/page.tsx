import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { ArticleBanTinContent } from '@/components/news/category/ArticleBanTinContent';
import { CategoryBanTinContent } from '@/components/news/category/CategoryBanTinContent';
import { ASSETS } from '@/constants/layout/assets';
import { getCategoryRouteById } from '@/constants/news/category-routes';
import { env } from '@/lib/core/env';

interface CategoryPagedRouteProps {
  params: Promise<{ categoryRoute: string; page: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPagedRouteProps): Promise<Metadata> {
  const { categoryRoute, page } = await params;
  const config = getCategoryRouteById(categoryRoute);
  const pageMatch = page.match(/^trang-(\d+)$/i);

  if (config && pageMatch) {
    const pageNumber = Number(pageMatch[1]);
    if (pageNumber >= 2) {
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
  }

  return { title: 'Bản tin' };
}

export default async function CategoryBanTinPagedRoute({
  params,
}: CategoryPagedRouteProps) {
  const { categoryRoute, page } = await params;
  const config = getCategoryRouteById(categoryRoute);
  const pageMatch = page.match(/^trang-(\d+)$/i);

  if (config && pageMatch) {
    const pageNumber = Number(pageMatch[1]);
    if (pageNumber >= 2) {
      return (
        <AppShell>
          <CategoryBanTinContent categoryRoute={categoryRoute} page={pageNumber} />
        </AppShell>
      );
    }
  }

  if (!config && pageMatch) {
    notFound();
  }

  return (
    <AppShell>
      <ArticleBanTinContent slug={page} categoryRoute={categoryRoute} />
    </AppShell>
  );
}
