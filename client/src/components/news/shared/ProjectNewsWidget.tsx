'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ComingSoonLink } from '@/components/shared/ComingSoonLink';
import { ImageWithSkeleton } from '@/components/ui/image-with-skeleton';
import { ASSETS } from '@/constants/layout/assets';
import type { Project } from '@/lib/api/news';

interface ProjectNewsWidgetProps {
  projects: Project[];
  className?: string;
}

interface ScrollThumbState {
  height: number;
  top: number;
  visible: boolean;
}

const SCROLLBAR_HIDE_DELAY_MS = 700;
const MIN_THUMB_HEIGHT = 24;

export function ProjectNewsWidget({
  projects,
  className = '',
}: ProjectNewsWidgetProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [thumb, setThumb] = useState<ScrollThumbState>({
    height: 0,
    top: 0,
    visible: false,
  });

  const updateThumb = useCallback((showBar = false) => {
    const element = listRef.current;
    if (!element) return;

    const { scrollTop, scrollHeight, clientHeight } = element;
    const canScroll = scrollHeight > clientHeight + 1;

    if (!canScroll) {
      setThumb({ height: 0, top: 0, visible: false });
      return;
    }

    const thumbHeight = Math.max(
      (clientHeight / scrollHeight) * clientHeight,
      MIN_THUMB_HEIGHT,
    );
    const maxTop = clientHeight - thumbHeight;
    const top =
      maxTop <= 0
        ? 0
        : (scrollTop / (scrollHeight - clientHeight)) * maxTop;

    setThumb((current) => ({
      height: thumbHeight,
      top,
      visible: showBar ? true : current.visible,
    }));
  }, []);

  const handleScroll = useCallback(() => {
    updateThumb(true);

    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }

    hideTimerRef.current = setTimeout(() => {
      setThumb((current) => ({ ...current, visible: false }));
      hideTimerRef.current = null;
    }, SCROLLBAR_HIDE_DELAY_MS);
  }, [updateThumb]);

  useEffect(() => {
    const element = listRef.current;
    if (!element) return;

    updateThumb();

    const resizeObserver = new ResizeObserver(() => {
      updateThumb();
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, [projects, updateThumb]);

  return (
    <div
      className={`sidebar-widget position-relative overflow-hidden h-100 ${className}`.trim()}
    >
      <div className="widget-header">
        <h3 className="widget-title">Tin tức dự án</h3>
      </div>
      <div className="mf-project-news-scroll">
        <div
          ref={listRef}
          className="project-list mf-project-news-list overflow-y-auto"
          onScroll={handleScroll}
        >
          {projects.map((project) => (
            <ComingSoonLink
              key={project.id}
              className="project-item"
              title={project.name}
              feature="Tin tức dự án đang được cập nhật"
            >
              <div className="project-thumb mf-project-news-thumb position-relative flex-shrink-0">
                <ImageWithSkeleton
                  layout="fill"
                  src={project.coverImage ?? ASSETS.noImage}
                  alt={project.name}
                  sizes="72px"
                  imageClassName="object-cover"
                />
              </div>
              <div className="project-details">
                <div className="project-title">{project.name}</div>
                <div className="project-location limit_2line">
                  {project.address}
                </div>
              </div>
            </ComingSoonLink>
          ))}
        </div>
        {thumb.height > 0 && (
          <div
            className={`mf-project-news-scrollbar${thumb.visible ? ' is-visible' : ''}`}
            aria-hidden
          >
            <div
              className="mf-project-news-scrollbar__thumb"
              style={{
                height: thumb.height,
                transform: `translateY(${thumb.top}px)`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
