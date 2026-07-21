import { notFound } from 'next/navigation';
import { CategoryArticleList } from '@/components/news/category/CategoryArticleList';
import { CategoryBreadcrumb } from '@/components/news/category/CategoryBreadcrumb';
import { CategoryNewsTabs } from '@/components/news/category/CategoryNewsTabs';
import { NewsPagination } from '@/components/news/category/NewsPagination';
import { NewsSidebar } from '@/components/news/ban-tin/NewsSidebar';
import {
  CATEGORY_PAGE_SIZE,
  getCategoryRouteById,
} from '@/constants/news/category-routes';
import {
  getFeaturedProjects,
  getNewsArticles,
  getNewsCategories,
} from '@/lib/api/news';

interface CategoryBanTinContentProps {
  categoryRoute: string;
  page?: number;
}

export async function CategoryBanTinContent({
  categoryRoute,
  page = 1,
}: CategoryBanTinContentProps) {
  const config = getCategoryRouteById(categoryRoute);
  if (!config) notFound();

  const [categories, articlesData, projects] = await Promise.all([
    getNewsCategories(),
    getNewsArticles({
      category: config.slug,
      page,
      limit: CATEGORY_PAGE_SIZE,
    }),
    getFeaturedProjects(14),
  ]);

  if (page > articlesData.meta.totalPages) {
    notFound();
  }

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <main className="main-content">
        <div className="content-body">
          <div className="row">
            <div className="col-12 col-xl-9 mb-4">
              <CategoryBreadcrumb categoryName={config.name} />
              <h1 className="article-title">{config.name}</h1>
              <p className="article-meta">
                Cập nhật thông tin, phân tích chuyển sâu và xu hướng mới nhất về
                thị trường bất động sản
              </p>
              <CategoryNewsTabs activeSlug={config.slug} />
              <CategoryArticleList articles={articlesData.items} />
              <NewsPagination
                routeId={config.routeId}
                currentPage={page}
                totalPages={articlesData.meta.totalPages}
              />
            </div>
            <div className="col-12 col-xl-3">
              <NewsSidebar categories={categories} projects={projects} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
