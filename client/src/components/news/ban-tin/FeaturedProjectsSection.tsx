'use client';

import { SmartLink } from '@/components/shared/SmartLink';
import { useMemo, useState } from 'react';
import { FeaturedProjectCard } from '@/components/news/ban-tin/FeaturedProjectCard';
import {
  OwlCarouselItem,
  OwlCarouselRow,
} from '@/components/shared/OwlCarouselRow';
import {
  mergeFeaturedProjects,
  PROJECT_REGION_TABS,
  type FeaturedProjectDisplay,
  type ProjectRegionTab,
} from '@/constants/news/featured-projects';
import type { Project } from '@/lib/api/news';

const PROJECT_ITEM_WIDTH = 269.667;

interface FeaturedProjectsSectionProps {
  projects: Project[];
}

function filterByRegion(
  projects: FeaturedProjectDisplay[],
  tab: ProjectRegionTab,
): FeaturedProjectDisplay[] {
  if (tab === 'all') return projects;
  return projects.filter((p) => p.region === tab);
}

export function FeaturedProjectsSection({
  projects,
}: FeaturedProjectsSectionProps) {
  const [activeTab, setActiveTab] = useState<ProjectRegionTab>('all');
  const allProjects = useMemo(() => mergeFeaturedProjects(projects), [projects]);
  const filteredProjects = useMemo(
    () => filterByRegion(allProjects, activeTab),
    [allProjects, activeTab],
  );

  return (
    <div className="animate-on-scroll featured_project mb-2">
      <div className="section-header">
        <div className="section-title">Dự án nổi bật</div>
        <div className="filter-tabs">
          {PROJECT_REGION_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`filter-tab${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <SmartLink
          href="/thong-tin-du-an/"
          className="view-all w-px-150 justify-content-end"
        >
          Xem tất cả dự án <i className="fa fa-arrow-right" />
        </SmartLink>
      </div>

      <div className="position-relative">
        <OwlCarouselRow
          id="projectCarousel"
          carouselClass="owl-carousel owl_flex owl_angular"
          showNav
          xsSlide={1.2}
          smSlide={2}
          mdSlide={3}
          lgSlide={4}
        >
          {filteredProjects.map((project) => (
            <OwlCarouselItem key={project.id} width={PROJECT_ITEM_WIDTH}>
              <FeaturedProjectCard project={project} />
            </OwlCarouselItem>
          ))}
        </OwlCarouselRow>
      </div>
    </div>
  );
}
