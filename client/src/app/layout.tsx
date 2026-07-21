import type { Metadata } from 'next';
import { ThemeStyles, beVietnamPro } from '@/components/layout/ThemeStyles';
import { ASSETS } from '@/constants/layout/assets';
import { env } from '@/lib/core/env';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'MyFuture.vn – Nền tảng bất động sản toàn quốc',
    template: '%s',
  },
  description:
    'MyFuture.vn – Nền tảng bất động sản toàn quốc',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
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
    <html
      lang="vi"
      className={`light-style layout-menu-fixed layout-navbar-fixed layout-menu-100vh ${beVietnamPro.variable}`}
    >
      <head>
        <ThemeStyles />
      </head>
      <body className="desktop page page-template news-page">{children}</body>
    </html>
  );
}
