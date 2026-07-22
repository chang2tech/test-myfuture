'use client';

import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { useHorizontalDragScroll } from '@/hooks/shared/useHorizontalDragScroll';

const MARGIN = 10;

interface OwlCarouselRowProps {
  children: ReactNode;
  className?: string;
  showNav?: boolean;
  xsSlide?: number;
  smSlide?: number;
  mdSlide?: number;
  lgSlide?: number;
  loop?: boolean;
  fixedItemWidth?: number;
  id?: string;
  carouselClass?: string;
}

function getVisibleSlides(
  width: number,
  xsSlide: number,
  smSlide: number,
  mdSlide: number,
  lgSlide: number,
): number {
  if (width < 576) return xsSlide;
  if (width < 768) return smSlide;
  if (width < 1200) return mdSlide;
  return lgSlide;
}

function getActiveItemIndex(
  items: HTMLElement[],
  scrollLeft: number,
): number {
  let activeIndex = 0;

  for (let index = 0; index < items.length; index += 1) {
    if (items[index].offsetLeft <= scrollLeft + 4) {
      activeIndex = index;
    }
  }

  return activeIndex;
}

function getGapPx(slides: number): number {
  return Math.max(0, Math.ceil(slides) - 1) * MARGIN;
}

function buildItemWidthVars(
  xsSlide: number,
  smSlide: number,
  mdSlide: number,
  lgSlide: number,
): CSSProperties {
  const toWidth = (slides: number) =>
    `calc((100cqw - ${getGapPx(slides)}px) / ${slides})`;

  return {
    '--mf-item-width-xs': toWidth(xsSlide),
    '--mf-item-width-sm': toWidth(smSlide),
    '--mf-item-width-md': toWidth(mdSlide),
    '--mf-item-width-lg': toWidth(lgSlide),
  } as CSSProperties;
}

export function OwlCarouselRow({
  children,
  className = 'mb-2',
  showNav = false,
  xsSlide = 1.5,
  smSlide,
  mdSlide = 3,
  lgSlide = 4,
  loop = true,
  fixedItemWidth,
  id,
  carouselClass = 'owl owl-carousel',
}: OwlCarouselRowProps) {
  const resolvedSmSlide = smSlide ?? mdSlide;
  const outerRef = useRef<HTMLDivElement>(null);
  const { dragScrollProps, stopMomentum } = useHorizontalDragScroll();
  const [hasOverflow, setHasOverflow] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateLayout = useCallback(() => {
    const el = outerRef.current;
    if (!el) return;

    const items = el.querySelectorAll<HTMLElement>('.owl-item');
    const itemCount = items.length;
    const visibleSlides = getVisibleSlides(
      el.clientWidth,
      xsSlide,
      resolvedSmSlide,
      mdSlide,
      lgSlide,
    );
    const overflow = itemCount > visibleSlides;

    setHasOverflow(overflow);

    if (!overflow) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }

    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < maxScroll - 2);
  }, [xsSlide, resolvedSmSlide, mdSlide, lgSlide]);

  useLayoutEffect(() => {
    const el = outerRef.current;
    if (!el) return;

    updateLayout();

    const resizeObserver = new ResizeObserver(updateLayout);
    resizeObserver.observe(el);
    const stage = el.querySelector('.mf-owl-stage');
    if (stage) resizeObserver.observe(stage);

    el.addEventListener('scroll', updateLayout, { passive: true });
    window.addEventListener('resize', updateLayout);

    return () => {
      resizeObserver.disconnect();
      el.removeEventListener('scroll', updateLayout);
      window.removeEventListener('resize', updateLayout);
    };
  }, [updateLayout, children]);

  const scroll = (direction: -1 | 1) => {
    const el = outerRef.current;
    if (!el) return;

    const items = Array.from(el.querySelectorAll<HTMLElement>('.owl-item'));
    if (items.length === 0) return;

    const activeIndex = getActiveItemIndex(items, el.scrollLeft);
    const targetIndex = Math.max(
      0,
      Math.min(items.length - 1, activeIndex + direction),
    );

    if (targetIndex === activeIndex) return;

    el.scrollTo({
      left: items[targetIndex].offsetLeft,
      behavior: 'smooth',
    });
  };

  const carouselStyle: CSSProperties = fixedItemWidth
    ? {}
    : buildItemWidthVars(xsSlide, resolvedSmSlide, mdSlide, lgSlide);

  return (
    <div
      id={id}
      className={`${carouselClass} owl-loaded owl-drag mf-owl-wrap position-relative ${className}`.trim()}
      data-xs-slide={xsSlide}
      data-sm-slide={resolvedSmSlide}
      data-md-slide={mdSlide}
      data-lg-slide={lgSlide}
      data-nav={showNav ? 'true' : 'false'}
      data-loop={loop ? 'true' : 'false'}
      data-margin={MARGIN}
      style={carouselStyle}
    >
      <div
        className={`mf-horizontal-scroll-fade mf-horizontal-scroll-fade--left${canScrollLeft ? ' is-visible' : ''}`}
        aria-hidden
      />
      <div
        className={`mf-horizontal-scroll-fade mf-horizontal-scroll-fade--right${canScrollRight ? ' is-visible' : ''}`}
        aria-hidden
      />

      <div
        ref={outerRef}
        className="owl-stage-outer mf-owl-scroll"
        {...dragScrollProps}
        onPointerDown={(event) => {
          stopMomentum();
          dragScrollProps.onPointerDown(event);
        }}
      >
        <div className="owl-stage mf-owl-stage">{children}</div>
      </div>

      {showNav && hasOverflow && (
        <div className="owl-nav">
          {canScrollLeft && (
            <button
              type="button"
              role="presentation"
              className="owl-prev"
              onClick={() => scroll(-1)}
              aria-label="Trước"
            >
              <i className="bx bx-chevron-left" />
            </button>
          )}
          {canScrollRight && (
            <button
              type="button"
              role="presentation"
              className="owl-next"
              onClick={() => scroll(1)}
              aria-label="Sau"
            >
              <i className="bx bx-chevron-right" />
            </button>
          )}
        </div>
      )}

      <div className="owl-dots disabled" />
    </div>
  );
}

interface OwlCarouselItemProps {
  children: ReactNode;
  width?: number;
}

export function OwlCarouselItem({ children, width }: OwlCarouselItemProps) {
  const style: CSSProperties = width
    ? { width, minWidth: width, marginRight: MARGIN }
    : { marginRight: MARGIN };

  return (
    <div
      className={`owl-item mf-owl-item${width ? '' : ' mf-owl-item--fluid'}`}
      style={style}
    >
      {children}
    </div>
  );
}
