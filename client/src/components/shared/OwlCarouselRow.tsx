'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';

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
  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(true);
  const [itemWidth, setItemWidth] = useState<number | null>(null);

  const updateLayout = useCallback(() => {
    const el = outerRef.current;
    if (!el) return;

    if (fixedItemWidth) {
      setItemWidth(fixedItemWidth);
    } else {
      const slides = getVisibleSlides(
        el.clientWidth,
        xsSlide,
        resolvedSmSlide,
        mdSlide,
        lgSlide,
      );
      const gaps = Math.max(0, Math.ceil(slides) - 1);
      setItemWidth((el.clientWidth - gaps * MARGIN) / slides);
    }

    const maxScroll = el.scrollWidth - el.clientWidth;
    const items = el.querySelectorAll<HTMLElement>('.owl-item');
    const lastItem = items[items.length - 1];

    if (!lastItem || maxScroll <= 1) {
      setShowPrev(false);
      setShowNext(false);
      return;
    }

    const containerRight = el.getBoundingClientRect().right;
    const lastCardRight = lastItem.getBoundingClientRect().right;
    const isLastCardAtRight = lastCardRight <= containerRight + 2;

    setShowPrev(isLastCardAtRight);
    setShowNext(!isLastCardAtRight);
  }, [fixedItemWidth, lgSlide, mdSlide, resolvedSmSlide, xsSlide]);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;

    updateLayout();
    el.addEventListener('scroll', updateLayout, { passive: true });
    window.addEventListener('resize', updateLayout);

    return () => {
      el.removeEventListener('scroll', updateLayout);
      window.removeEventListener('resize', updateLayout);
    };
  }, [updateLayout, children]);

  const scroll = (direction: -1 | 1) => {
    const el = outerRef.current;
    if (!el || itemWidth === null) return;

    el.scrollBy({
      left: direction * (itemWidth + MARGIN),
      behavior: 'smooth',
    });
  };

  const carouselStyle: CSSProperties | undefined =
    itemWidth !== null && !fixedItemWidth
      ? ({ '--mf-owl-item-width': `${itemWidth}px` } as CSSProperties)
      : undefined;

  return (
    <div
      id={id}
      className={`${carouselClass} owl-loaded owl-drag ${className}`.trim()}
      data-xs-slide={xsSlide}
      data-sm-slide={resolvedSmSlide}
      data-md-slide={mdSlide}
      data-lg-slide={lgSlide}
      data-nav={showNav ? 'true' : 'false'}
      data-loop={loop ? 'true' : 'false'}
      data-margin={MARGIN}
      style={carouselStyle}
    >
      <div ref={outerRef} className="owl-stage-outer mf-owl-scroll">
        <div className="owl-stage mf-owl-stage">{children}</div>
      </div>

      {showNav && (
        <div className="owl-nav">
          <button
            type="button"
            role="presentation"
            className={`owl-prev${showPrev ? '' : ' disabled'}`}
            onClick={() => scroll(-1)}
            aria-label="Trước"
          >
            <i className="bx bx-chevron-left" />
          </button>
          <button
            type="button"
            role="presentation"
            className={`owl-next${showNext ? '' : ' disabled'}`}
            onClick={() => scroll(1)}
            aria-label="Sau"
          >
            <i className="bx bx-chevron-right" />
          </button>
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
    : {
        width: 'var(--mf-owl-item-width, 255px)',
        minWidth: 'var(--mf-owl-item-width, 255px)',
        marginRight: MARGIN,
      };

  return (
    <div className="owl-item" style={style}>
      {children}
    </div>
  );
}
