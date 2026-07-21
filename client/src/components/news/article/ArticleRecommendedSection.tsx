import {
  OwlCarouselItem,
  OwlCarouselRow,
} from '@/components/shared/OwlCarouselRow';
import { ArticleRecommendedCard } from '@/components/news/article/ArticleRecommendedCard';
import type { NewsArticle } from '@/lib/api/news';

interface ArticleRecommendedSectionProps {
  articles: NewsArticle[];
}

export function ArticleRecommendedSection({
  articles,
}: ArticleRecommendedSectionProps) {
  if (articles.length === 0) return null;

  return (
    <div className="mt-4" id="new-recommended">
      <h6 className="fw-bold mb-2 text-dark" style={{ fontSize: '0.95rem' }}>
        Có thể bạn quan tâm
      </h6>
      <OwlCarouselRow showNav xsSlide={1.5} mdSlide={3} lgSlide={4}>
        {articles.map((article) => (
          <OwlCarouselItem key={article.id}>
            <ArticleRecommendedCard article={article} />
          </OwlCarouselItem>
        ))}
      </OwlCarouselRow>
    </div>
  );
}
