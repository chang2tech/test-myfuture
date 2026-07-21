import { ArticleShareBottom } from '@/components/news/article/ArticleShareBottom';
import { sanitizeArticleHtml } from '@/lib/utils/sanitize-html';

interface ArticleDetailBodyProps {
  content: string;
  shareUrl: string;
}

export function ArticleDetailBody({ content, shareUrl }: ArticleDetailBodyProps) {
  const sanitized = sanitizeArticleHtml(content);

  return (
    <div className="fh-card">
      <div
        className="article-content"
        id="article-content"
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
      <ArticleShareBottom shareUrl={shareUrl} />
    </div>
  );
}
