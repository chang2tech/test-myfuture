import { notFound } from 'next/navigation';
import { ArticleBreadcrumb } from '@/components/news/article/ArticleBreadcrumb';
import { ArticleDetailBody } from '@/components/news/article/ArticleDetailBody';
import { ArticleDetailHeader } from '@/components/news/article/ArticleDetailHeader';
import { ArticleDetailSidebar } from '@/components/news/article/ArticleDetailSidebar';
import { ArticleNavigation } from '@/components/news/article/ArticleNavigation';
import { ArticleRecommendedSection } from '@/components/news/article/ArticleRecommendedSection';
import { env } from '@/lib/core/env';
import {
  getFeaturedProjects,
  getNewsArticleDetail,
  getNewsCategories,
} from '@/lib/api/news';

interface ArticleBanTinContentProps {
  slug: string;
}

export async function ArticleBanTinContent({ slug }: ArticleBanTinContentProps) {
  let detail;
  try {
    [detail] = await Promise.all([getNewsArticleDetail(slug)]);
  } catch {
    notFound();
  }

  const [categories, projects] = await Promise.all([
    getNewsCategories(),
    getFeaturedProjects(14),
  ]);

  const shareUrl = `${env.NEXT_PUBLIC_SITE_URL}/ban-tin/${detail.slug}`;

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <main className="main-content">
        <div className="content-body">
          <ArticleBreadcrumb
            categoryName={detail.category.name}
            categorySlug={detail.category.slug}
          />
          {detail.isHot && (
            <span className="article-cat-pill">
              <i className="fa fa-tag" /> Tin nổi bật
            </span>
          )}
          <div className="row">
            <div className="col-12 col-lg-7 col-xl-7 mb-4">
              <ArticleDetailHeader article={detail} />
              <ArticleDetailBody content={detail.content} shareUrl={shareUrl} />
              <ArticleNavigation prev={detail.prev} next={detail.next} />
              <ArticleRecommendedSection articles={detail.recommended} />
            </div>
            <div className="col-12 col-lg-5 col-xl-5">
              <ArticleDetailSidebar
                categories={categories}
                activeCategorySlug={detail.category.slug}
                featuredArticles={detail.sidebarFeatured}
                projects={projects}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
