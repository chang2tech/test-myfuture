import type { Metadata } from 'next';
import { AppProviders } from '@/components/providers/AppProviders';
import { ThemeStyles, beVietnamPro } from '@/components/layout/ThemeStyles';
import { ASSETS } from '@/constants/layout/assets';
import { env } from '@/lib/core/env';
import './globals.css';

const HTML_LAYOUT_CLASSES =
  'light-style layout-menu-fixed layout-navbar-fixed layout-menu-100vh';

export const metadata: Metadata = {
  title: {
    default: 'MyFuture.vn – Nền tảng bất động sản toàn quốc',
    template: '%s',
  },
  description:
    'MyFuture.vn – Nền tảng bất động sản toàn quốc',
  icons: {
    icon: [{ url: ASSETS.favicon, type: 'image/png' }],
    shortcut: ASSETS.favicon,
    apple: ASSETS.favicon,
  },
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning className={HTML_LAYOUT_CLASSES}>
      <head>
        <ThemeStyles />
      </head>
      <body
        suppressHydrationWarning
        className={`desktop page page-template news-page ${beVietnamPro.variable}`}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
