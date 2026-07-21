import Link from 'next/link';
import {
  OwlCarouselItem,
  OwlCarouselRow,
} from '@/components/shared/OwlCarouselRow';
import { QUICK_ACCESS_ITEMS } from '@/constants/news/quick-access';

const QUICK_ACCESS_ITEM_WIDTH = 182.25;

export function QuickAccessSection() {
  return (
    <div className="mb-4 box_quick_access_news">
      <h2 className="section-heading">Truy cập nhanh</h2>
      <OwlCarouselRow
        showNav
        xsSlide={2}
        smSlide={3}
        mdSlide={5}
        lgSlide={6}
        loop={false}
        fixedItemWidth={QUICK_ACCESS_ITEM_WIDTH}
      >
        {QUICK_ACCESS_ITEMS.map((item) => (
          <OwlCarouselItem key={item.title} width={QUICK_ACCESS_ITEM_WIDTH}>
            <Link
              href={item.href}
              className={`quick-access-card${item.positionRelative ? ' position-relative' : ''}`}
            >
              <div
                className={`qa-icon-wrapper ${item.colorClass}`}
                style={item.iconColor ? { color: item.iconColor } : undefined}
              >
                <i className={`bx ${item.icon}`} />
              </div>
              <div className="qa-content">
                <div className="qa-title">{item.title}</div>
                <div className="qa-desc">{item.description}</div>
              </div>
              {item.isPro && (
                <span className="tool-badge tool-badge_pro">Pro</span>
              )}
            </Link>
          </OwlCarouselItem>
        ))}
      </OwlCarouselRow>
    </div>
  );
}
