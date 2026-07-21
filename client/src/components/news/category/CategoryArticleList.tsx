import { CategoryArticleListItem } from '@/components/news/category/CategoryArticleListItem';
import type { NewsArticle } from '@/lib/api/news';

interface CategoryArticleListProps {
  articles: NewsArticle[];
}

export function CategoryArticleList({ articles }: CategoryArticleListProps) {
  return (
    <div className="bg-white rounded-3 shadow-sm mb-4">
      {articles.map((article, index) => (
        <CategoryArticleListItem
          key={article.id}
          article={article}
          index={index + 1}
          isLast={index === articles.length - 1}
        />
      ))}
    </div>
  );
}
