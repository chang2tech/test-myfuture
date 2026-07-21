import { FeaturedNewsSection } from '@/components/news/ban-tin/FeaturedNewsSection';
import { FeaturedProjectsSection } from '@/components/news/ban-tin/FeaturedProjectsSection';
import { NewsCategoryTabs } from '@/components/news/ban-tin/NewsCategoryTabs';
import { NewsSidebar } from '@/components/news/ban-tin/NewsSidebar';
import { NewsStatsCards } from '@/components/news/ban-tin/NewsStatsCards';
import { PopularTopicsSection } from '@/components/news/ban-tin/PopularTopicsSection';
import { QuickAccessSection } from '@/components/news/ban-tin/QuickAccessSection';
import { ReportInsightSection } from '@/components/news/ban-tin/ReportInsightSection';
import { TopicNewsSection } from '@/components/news/ban-tin/TopicNewsSection';
import { VideoPodcastSection } from '@/components/news/ban-tin/VideoPodcastSection';
import {
  getFeaturedProjects,
  getHomeNewsSection,
  getMarketStats,
  getNewsCategories,
} from '@/lib/api/news';

interface BanTinPageContentProps {
  category?: string;
}

export async function BanTinPageContent({ category }: BanTinPageContentProps) {
  const activeCategory = category ?? 'toan-canh';
  const filterCategory =
    activeCategory === 'toan-canh' ? undefined : activeCategory;

  const [stats, categories, homeNews, projects] = await Promise.all([
    getMarketStats(),
    getNewsCategories(),
    getHomeNewsSection(),
    getFeaturedProjects(12),
  ]);

  const { featured, sideArticles } = homeNews;

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <main className="main-content">
        <div className="content-body">
          <div className="row">
            <div className="col-12 col-lg-8 col-xl-9 mb-4">
              <div className="sticky top-0">
                <div className="mb-3">
                  <h2 className="font-weight-bold fs-24 mb-2 text-dark">
                    Tin tức thị trường
                  </h2>
                  <p className="text-secondary mb-0">
                    Cập nhật thông tin mới nhất về thị trường bất động sản
                  </p>
                </div>

                <NewsStatsCards stats={stats} />
                <NewsCategoryTabs activeCategory={activeCategory} />
                <FeaturedNewsSection
                  featured={featured}
                  sideArticles={sideArticles}
                />
                <QuickAccessSection />
                <TopicNewsSection categories={categories} />

                <div className="mt-4">
                  <FeaturedProjectsSection projects={projects} />
                  <PopularTopicsSection />
                  <ReportInsightSection />
                  <VideoPodcastSection />
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-4 col-xl-3">
              <NewsSidebar categories={categories} projects={projects} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
