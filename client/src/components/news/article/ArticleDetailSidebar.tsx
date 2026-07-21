import Link from 'next/link';
import Image from 'next/image';
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
                <Link
                  key={category.slug}
                  href={getCategoryRouteHref(category.slug)}
                  className={`category-item${
                    category.slug === activeCategorySlug ? ' active' : ''
                  }`}
                >
                  {category.name}
                </Link>
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
                <Link
                  key={item.id}
                  href={`/ban-tin/${item.slug}`}
                  className="news-item image-scale"
                >
                  <div className="news-img overflow-hidden">
                    <Image
                      src={item.coverImage ?? ASSETS.noImage}
                      alt={item.title}
                      width={80}
                      height={60}
                      className="w-100 h-100"
                    />
                  </div>
                  <div className="news-body">
                    <div className="news-tag">{item.category.name}</div>
                    <div className="news-title-text limit_2line">{item.title}</div>
                    <div className="news-date">
                      {formatArticleDateSlash(item.publishedAt)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <Link
              href="/ban-tin"
              className="view-all justify-content-end"
              style={{ fontSize: 12 }}
            >
              Xem tất cả <i className="fa fa-arrow-right" />
            </Link>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-12 col-xxl-6 mb-2">
          <div className="sidebar-widget position-relative overflow-hidden h-100">
            <div className="widget-header">
              <h3 className="widget-title">Tin tức dự án</h3>
            </div>
            <div
              className="project-list overflow-y-auto"
              style={{ maxHeight: 345 }}
            >
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/ban-tin/${project.slug}`}
                  className="project-item"
                  title={project.name}
                >
                  <Image
                    src={project.coverImage ?? ASSETS.noImage}
                    alt={project.name}
                    width={48}
                    height={48}
                    className="project-thumb"
                  />
                  <div className="project-details">
                    <div className="project-title">{project.name}</div>
                    <div className="project-location limit_2line">
                      {project.address}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
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
              <Link key={developer.name} href="#" className="list-item">
                <Image
                  src={developer.logo}
                  alt={developer.name}
                  width={56}
                  height={56}
                  className="developer-logo"
                />
                <div>
                  <div className="item-title">{developer.name}</div>
                  <div className="item-subtitle">{developer.projectCount}</div>
                </div>
              </Link>
            ))}
          </div>
          <Link
            href="#"
            className="view-all justify-content-end"
            style={{ fontSize: 12 }}
          >
            Xem tất cả <i className="fa fa-arrow-right" />
          </Link>
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
                  <Link key={doc.title} href="#" className="report-item">
                    <div className="report-icon-wrapper">
                      <div className="pdf-icon" />
                    </div>
                    <div className="report-details">
                      <div className="report-title">{doc.title}</div>
                      <div className="report-size">{doc.size}</div>
                    </div>
                  </Link>
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
