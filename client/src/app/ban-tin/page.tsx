import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import { BanTinPageContent } from '@/components/news/ban-tin/BanTinPageContent';
import { ASSETS } from '@/constants/layout/assets';
import { env } from '@/lib/core/env';

export const metadata: Metadata = {
  title: 'Bản tin - MyFuture.vn – Nền tảng bất động sản toàn quốc',
  description:
    'Bản tin - MyFuture.vn – Nền tảng bất động sản toàn quốc',
  openGraph: {
    title: 'Bản tin - MyFuture.vn – Nền tảng bất động sản toàn quốc',
    description:
      'Bản tin - MyFuture.vn – Nền tảng bất động sản toàn quốc',
    url: `${env.NEXT_PUBLIC_SITE_URL}/ban-tin`,
    siteName: 'My Future',
    locale: 'vi_VN',
    type: 'website',
    images: [{ url: ASSETS.imageSeo, width: 1200, height: 630 }],
  },
};

interface BanTinPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function BanTinPage({ searchParams }: BanTinPageProps) {
  const { category } = await searchParams;

  return (
    <AppShell>
      <BanTinPageContent category={category} />
    </AppShell>
  );
}
