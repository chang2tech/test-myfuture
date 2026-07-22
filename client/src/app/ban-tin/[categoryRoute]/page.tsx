import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { CategoryBanTinContent } from '@/components/news/category/CategoryBanTinContent';
import { ASSETS } from '@/constants/layout/assets';
import { getCategoryRouteById } from '@/constants/news/category-routes';
import { env } from '@/lib/core/env';
import { getNewsArticleDetail } from '@/lib/api/news';
import { getArticleHref } from '@/lib/news/article-url';

interface CategoryPageProps {
  params: Promise<{ categoryRoute: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { categoryRoute } = await params;
  const config = getCategoryRouteById(categoryRoute);
  if (!config) {
    return { title: 'Bản tin' };
  }

  const title = `Bản tin - ${config.name}`;
  const description =
    'Cập nhật thông tin, phân tích chuyên sâu và xu hướng mới nhất về thị trường bất động sản';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${env.NEXT_PUBLIC_SITE_URL}/ban-tin/${config.routeId}`,
      siteName: 'My Future',
      locale: 'vi_VN',
      type: 'website',
      images: [{ url: ASSETS.imageSeo, width: 1200, height: 630 }],
    },
  };
}

export default async function CategoryBanTinPage({ params }: CategoryPageProps) {
  const { categoryRoute } = await params;
  const config = getCategoryRouteById(categoryRoute);

  if (!config) {
    try {
      const article = await getNewsArticleDetail(categoryRoute, {
        trackView: false,
      });
      redirect(getArticleHref(article.category.slug, article.slug));
    } catch {
      notFound();
    }
  }

  return (
    <AppShell>
      <CategoryBanTinContent categoryRoute={categoryRoute} page={1} />
    </AppShell>
  );
}
