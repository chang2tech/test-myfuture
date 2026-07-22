'use client';

import type { ReactNode } from 'react';
import { ImageWithSkeleton } from '@/components/ui/image-with-skeleton';
import { SmartLink } from '@/components/shared/SmartLink';
import { ASSETS } from '@/constants/layout/assets';

type NavItem =
  | {
      label: string;
      href: string;
      match: (path: string) => boolean;
      icon: ReactNode;
      isCenter?: false;
    }
  | {
      label: string;
      href: string;
      isCenter: true;
    };

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Trang chủ',
    href: '/',
    match: (path: string) => path === '/',
    icon: (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ),
  },
  {
    label: 'Dự án',
    href: '/thong-tin-du-an',
    match: (path: string) => path.startsWith('/thong-tin-du-an'),
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path d="M96 512l320 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-66.7c18.6-6.6 32-24.4 32-45.3l0-288c0-26.5-21.5-48-48-48l-48 0 0 169.4c0 12.5-10.1 22.6-22.6 22.6-6 0-11.8-2.4-16-6.6L272 144 230.6 185.4c-4.2 4.2-10 6.6-16 6.6-12.5 0-22.6-10.1-22.6-22.6L192 0 96 0C43 0 0 43 0 96L0 416c0 53 43 96 96 96zM64 416c0-17.7 14.3-32 32-32l256 0 0 64-256 0c-17.7 0-32-14.3-32-32z" />
      </svg>
    ),
  },
  {
    label: 'AI',
    href: 'https://ai.myfuture.vn',
    isCenter: true,
  },
  {
    label: 'Bảng hàng',
    href: '/bang-hang',
    match: (path: string) => path.startsWith('/bang-hang'),
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M4.5 11h5c.83 0 1.5-.67 1.5-1.5v-5c0-.83-.67-1.5-1.5-1.5h-5C3.67 3 3 3.67 3 4.5v5c0 .83.67 1.5 1.5 1.5M5 5h4v4H5zm14.5-2h-5c-.83 0-1.5.67-1.5 1.5v5c0 .83.67 1.5 1.5 1.5h5c.83 0 1.5-.67 1.5-1.5v-5c0-.83-.67-1.5-1.5-1.5M19 9h-4V5h4zM4.5 21h5c.83 0 1.5-.67 1.5-1.5v-5c0-.83-.67-1.5-1.5-1.5h-5c-.83 0-1.5.67-1.5 1.5v5c0 .83.67 1.5 1.5 1.5m.5-6h4v4H5zm14.5-2h-5c-.83 0-1.5.67-1.5 1.5v5c0 .83.67 1.5 1.5 1.5h5c.83 0 1.5-.67 1.5-1.5v-5c0-.83-.67-1.5-1.5-1.5m-.5 6h-4v-4h4z" />
      </svg>
    ),
  },
  {
    label: 'Tra cứu',
    href: '/tool',
    match: (path: string) => path.startsWith('/tool'),
    icon: <i className="bx bx-search fs-30 text-reset" />,
  },
];

export function MobileBottomNav() {
  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map((item) => {
        if (item.isCenter) {
          return (
            <SmartLink
              key={item.label}
              className="nav-item nav-center"
              href={item.href}
            >
              <div className="ai-glow-ring" />
              <div className="ai-rotate-ring" />
              <div className="ai-btn">
                <ImageWithSkeleton
                  layout="intrinsic"
                  className="ai-avatar"
                  src={ASSETS.aiAvatar}
                  width={48}
                  height={48}
                  alt="AI Triệu Lộ Nhi"
                  rounded="rounded-circle"
                />
              </div>
              <span className="ai-label d-none">AI (Triệu Lộ Nhi)</span>
            </SmartLink>
          );
        }

        const className = 'nav-item';

        return (
          <SmartLink key={item.label} className={className} href={item.href}>
            <div className="nav-icon">{item.icon}</div>
            <span className="nav-label">{item.label}</span>
          </SmartLink>
        );
      })}
    </nav>
  );
}
