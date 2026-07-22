import { SmartLink } from '@/components/shared/SmartLink';
import {
  OwlCarouselItem,
  OwlCarouselRow,
} from '@/components/shared/OwlCarouselRow';
import { getCategoryRouteHref } from '@/constants/news/category-routes';
import { POPULAR_TOPICS } from '@/constants/news/popular-topics';

export function PopularTopicsSection() {
  return (
    <section className="block popular_topics d-none">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h2 className="section-heading mb-0">Chủ đề được quan tâm</h2>
      </div>
      <OwlCarouselRow
        className="topic-grid"
        xsSlide={1.5}
        smSlide={3}
        lgSlide={5}
      >
        {POPULAR_TOPICS.map((topic) => (
          <OwlCarouselItem key={topic.slug}>
            <SmartLink
              href={getCategoryRouteHref(topic.slug)}
              className="topic-item"
            >
              <div
                className="topic-icon"
                style={{ background: topic.bgColor, color: topic.color }}
              >
                <i className={`bx ${topic.icon}`} />
              </div>
              <div>
                <div className="topic-name limit_1line">{topic.name}</div>
                <div className="topic-count">{topic.count} bài viết</div>
              </div>
            </SmartLink>
          </OwlCarouselItem>
        ))}
      </OwlCarouselRow>
    </section>
  );
}
