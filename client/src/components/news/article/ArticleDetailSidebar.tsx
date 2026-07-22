import { SmartLink } from '@/components/shared/SmartLink';
import { ProjectNewsWidget } from '@/components/news/shared/ProjectNewsWidget';
import { ImageWithSkeleton } from '@/components/ui/image-with-skeleton';
import { ProUpgradeOverlay } from '@/components/news/shared/ProUpgradeOverlay';
import {
  ARTICLE_DEVELOPERS,
  ARTICLE_RELATED_DOCS,
} from '@/constants/news/article-sidebar';
import {
  CATEGORY_ROUTE_CONFIGS,
  getCategoryRouteHref,
} from '@/constants/news/category-routes';
import { ASSETS } from '@/constants/layout/assets';
import { formatArticleDateSlash } from '@/lib/utils/article-date';
import { getArticleHref } from '@/lib/news/article-url';
import type { NewsArticle, NewsCategory, Project } from '@/lib/api/news';

interface ArticleDetailSidebarProps {
  categories: NewsCategory[];
  activeCategorySlug: string;
  featuredArticles: NewsArticle[];
  projects: Project[];
}

export function ArticleDetailSidebar({
  categories,
  activeCategorySlug,
  featuredArticles,
  projects,
}: ArticleDetailSidebarProps) {
  const categoryItems =
    categories.length > 0
      ? categories.filter((item) => item.slug !== 'toan-canh')
      : CATEGORY_ROUTE_CONFIGS.map((item) => ({
          id: item.slug,
          slug: item.slug,
          name: item.name,
          sortOrder: 0,
        }));

  return (
    <div className="sticky sidebar_news">
      <div className="form-row g-2">
        <div className="col-12 col-md-6 col-lg-12 col-xxl-6 mb-2">
          <div className="custom-widget">
            <div className="widget-header">
              <h3 className="widget-title">Danh mục tin tức</h3>
            </div>
            <div className="category-list">
              {categoryItems.map((category) => (
                <SmartLink
                  key={category.slug}
                  href={getCategoryRouteHref(category.slug)}
                  className={`category-item${
                    category.slug === activeCategorySlug ? ' active' : ''
                  }`}
                >
                  {category.name}
                </SmartLink>
              ))}
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-12 col-xxl-6 mb-2">
          <div className="custom-widget d-flex flex-column">
            <div className="widget-header">
              <h3 className="widget-title">Tin nổi bật</h3>
            </div>
            <div className="flex-grow-1">
              {featuredArticles.map((item) => (
                <SmartLink
                  key={item.id}
                  href={getArticleHref(item.category.slug, item.slug)}
                  className="news-item image-scale"
                >
                  <div
                    className="news-img overflow-hidden position-relative"
                    style={{ width: 80, height: 60, flexShrink: 0 }}
                  >
                    <ImageWithSkeleton
                      layout="fill"
                      src={item.coverImage ?? ASSETS.noImage}
                      alt={item.title}
                      sizes="80px"
                    />
                  </div>
                  <div className="news-body">
                    <div className="news-tag">{item.category.name}</div>
                    <div className="news-title-text limit_2line">{item.title}</div>
                    <div className="news-date">
                      {formatArticleDateSlash(item.publishedAt)}
                    </div>
                  </div>
                </SmartLink>
              ))}
            </div>
            <SmartLink
              href="/ban-tin"
              className="view-all justify-content-end"
              style={{ fontSize: 12 }}
            >
              Xem tất cả <i className="fa fa-arrow-right" />
            </SmartLink>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-12 col-xxl-6 mb-2">
          <ProjectNewsWidget projects={projects} />
        </div>

        <SidebarDevelopers />
        <SidebarRelatedDocs />
      </div>
    </div>
  );
}

function SidebarDevelopers() {
  return (
    <div className="col-12 col-md-6 col-lg-12 col-xxl-6 mb-2">
      <div className="custom-widget d-flex flex-column">
        <div className="widget-header">
          <h3 className="widget-title">Chủ đầu tư tiêu biểu</h3>
        </div>
        <div className="position-relative overflow-hidden rounded-3 h-100 p-2">
          <div className="flex-grow-1">
            {ARTICLE_DEVELOPERS.map((developer) => (
              <SmartLink key={developer.name} href="#" className="list-item">
                <div
                  className="developer-logo position-relative flex-shrink-0"
                  style={{ width: 56, height: 56 }}
                >
                  <ImageWithSkeleton
                    layout="fill"
                    src={developer.logo}
                    alt={developer.name}
                    sizes="56px"
                    imageClassName="object-contain"
                    rounded="rounded"
                  />
                </div>
                <div>
                  <div className="item-title">{developer.name}</div>
                  <div className="item-subtitle">{developer.projectCount}</div>
                </div>
              </SmartLink>
            ))}
          </div>
          <SmartLink
            href="#"
            className="view-all justify-content-end"
            style={{ fontSize: 12 }}
          >
            Xem tất cả <i className="fa fa-arrow-right" />
          </SmartLink>
          <ProUpgradeOverlay />
        </div>
      </div>
    </div>
  );
}

function SidebarRelatedDocs() {
  return (
    <div className="col-12">
      <div className="custom-widget">
        <div className="row g-4 align-items-center">
          <div className="col-12 col-md-7">
            <div className="widget-header">
              <h3 className="widget-title">
                <i className="fa fa-download me-2" /> TÀI LIỆU LIÊN QUAN
              </h3>
            </div>
            <div className="position-relative overflow-hidden rounded-3 p-2">
              <div className="report-list">
                {ARTICLE_RELATED_DOCS.map((doc) => (
                  <SmartLink key={doc.title} href="#" className="report-item">
                    <div className="report-icon-wrapper">
                      <div className="pdf-icon" />
                    </div>
                    <div className="report-details">
                      <div className="report-title">{doc.title}</div>
                      <div className="report-size">{doc.size}</div>
                    </div>
                  </SmartLink>
                ))}
              </div>
              <ProUpgradeOverlay />
            </div>
          </div>
          <div className="col-12 col-md-5">
            <div className="cta-box">
              <div className="cta-title">Cần thông tin chi tiết?</div>
              <div className="cta-text">
                Đội ngũ tư vấn luôn sẵn sàng hỗ trợ bạn 24/7
              </div>
              <a href="tel:0966-541-145" className="btn-cta">
                <i className="fa-solid fa-phone-volume me-2" /> Liên hệ ngay
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
