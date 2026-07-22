'use client';

import { SmartLink } from '@/components/shared/SmartLink';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { NEWS_CATEGORY_TABS } from '@/constants/news/categories';
import { getCategoryRouteHref } from '@/constants/news/category-routes';
import { useHorizontalDragScroll } from '@/hooks/shared/useHorizontalDragScroll';

interface NewsCategoryTabsProps {
  activeCategory: string;
}

export function NewsCategoryTabs({ activeCategory }: NewsCategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { dragScrollProps, stopMomentum } = useHorizontalDragScroll();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;

    const maxScroll = element.scrollWidth - element.clientWidth;
    setCanScrollLeft(element.scrollLeft > 2);
    setCanScrollRight(element.scrollLeft < maxScroll - 2);
  }, []);

  useLayoutEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    updateScrollState();
    element.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      element.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState]);

  return (
    <div className="news-category-tabs bg-white rounded-3 shadow-sm mb-4 mf-horizontal-scroll-wrap">
      <div
        className={`mf-horizontal-scroll-fade mf-horizontal-scroll-fade--left${canScrollLeft ? ' is-visible' : ''}`}
        aria-hidden
      />
      <div
        className={`mf-horizontal-scroll-fade mf-horizontal-scroll-fade--right${canScrollRight ? ' is-visible' : ''}`}
        aria-hidden
      />

      <div
        ref={scrollRef}
        className="mf-horizontal-scroll news-category-tabs__track"
        {...dragScrollProps}
        onPointerDown={(event) => {
          stopMomentum();
          dragScrollProps.onPointerDown(event);
        }}
      >
        {NEWS_CATEGORY_TABS.map((tab) => {
          const isActive = activeCategory === tab.slug;

          return (
            <SmartLink
              key={tab.slug}
              href={getCategoryRouteHref(tab.slug)}
              className={`tab-link nav-link d-flex align-items-center gap-2 px-3 py-2 rounded-2 text-secondary small${
                isActive ? ' active' : ''
              }`}
            >
              <i className={`bx ${tab.icon}`} />
              {tab.name}
            </SmartLink>
          );
        })}
      </div>
    </div>
  );
}
