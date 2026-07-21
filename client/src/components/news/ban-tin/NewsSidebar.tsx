import Image from 'next/image';
import Link from 'next/link';
import { ASSETS } from '@/constants/layout/assets';
import { ProUpgradeOverlay } from '@/components/news/shared/ProUpgradeOverlay';
import type { NewsCategory, Project } from '@/lib/api/news';

interface NewsSidebarProps {
  categories: NewsCategory[];
  projects: Project[];
}

const FILTER_COMPANIES = [
  {
    name: 'Vinhomes',
    logo: 'https://ca.futurehomes.vn/files/thumb/100/40//images/BDS/download.jpg',
    count: '16 tin mới',
  },
  {
    name: 'Masterise Homes',
    logo: 'https://ca.futurehomes.vn/files/thumb/100/40//images/MyoceanCity/masterise-homes.png',
    count: '4 tin mới',
  },
  {
    name: 'MIK Group',
    logo: 'https://ca.futurehomes.vn/files/thumb/100/40//images/BDS/Artboard-19anh.png',
    count: '8 tin mới',
  },
  {
    name: 'Sun Group',
    logo: 'https://ca.futurehomes.vn/files/thumb/100/40//images/BDS/640px-Sun-group-logo.png',
    count: '9 tin mới',
  },
] as const;

export function NewsSidebar({ categories, projects }: NewsSidebarProps) {
  return (
    <div className="sticky sidebar_news">
      <div className="sidebar-widget position-relative overflow-hidden">
        <div className="widget-header">
          <h3 className="widget-title">Bản tin bộ lọc</h3>
          <Link href="#" className="widget-link-muted">
            Tùy chỉnh <i className="fa-solid fa-gear" />
          </Link>
        </div>

        <div className="filter-tabs">
          {['CĐT', 'Vĩ mô', 'Chính sách', 'Xu hướng'].map((tab, i) => (
            <span
              key={tab}
              className={`filter-tab flex-fill${i === 0 ? ' active' : ''}`}
            >
              {tab}
            </span>
          ))}
        </div>

        <div className="filter-list">
          {FILTER_COMPANIES.map((company) => (
            <div key={company.name} className="filter-list-item">
              <div className="company-info">
                <Image
                  src={company.logo}
                  alt={company.name}
                  width={40}
                  height={20}
                  className="company-logo"
                />
                <span className="company-name">{company.name}</span>
              </div>
              <span className="news-count">{company.count}</span>
            </div>
          ))}
        </div>

        <div className="text-end mt-3">
          <Link
            href="/mf/chu-dau-tu"
            className="view-all justify-content-end"
            style={{ fontSize: 12 }}
          >
            Xem tất cả CĐT <i className="fa fa-arrow-right" />
          </Link>
        </div>
        <ProUpgradeOverlay />
      </div>

      <div className="sidebar-widget position-relative overflow-hidden h-100 mt-3">
        <div className="widget-header">
          <h3 className="widget-title">Tin tức dự án</h3>
        </div>
        <div className="project-list overflow-y-auto" style={{ maxHeight: 345 }}>
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

      {categories.length > 0 && (
        <div className="sidebar-widget mt-3 d-none">
          <div className="widget-header">
            <h3 className="widget-title">Chủ đề</h3>
          </div>
        </div>
      )}
    </div>
  );
}
