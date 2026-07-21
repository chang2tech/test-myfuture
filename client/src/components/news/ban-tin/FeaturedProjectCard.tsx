'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ASSETS } from '@/constants/layout/assets';
import type { FeaturedProjectDisplay } from '@/constants/news/featured-projects';

interface FeaturedProjectCardProps {
  project: FeaturedProjectDisplay;
}

export function FeaturedProjectCard({ project }: FeaturedProjectCardProps) {
  const projectHref = `/project/${project.slug}.html`;

  return (
    <div className="project-card">
      <Link href={projectHref} className="d-block">
        <div className="card-img-wrap">
          <Image
            src={project.coverImage}
            alt={project.name}
            width={600}
            height={400}
            className="w-100 h-auto"
            style={{ objectFit: 'cover' }}
          />
          <span className="card-badge">{project.badgeText ?? 'Mở bán'}</span>
          <button
            type="button"
            className="card-fav pc-card__heart"
            title="Thêm vào yêu thích"
            style={{ color: 'var(--gray)' }}
            onClick={(e) => e.preventDefault()}
          >
            <i className="bx bx-cart" />
          </button>
        </div>
        <div className="card-body-custom">
          <div className="card-title-custom limit_1line">{project.name}</div>
          <div className="card-location d-flex gap-1">
            <i className="bx bx-home-alt text-main fs-16" />
            <span className="limit_1line">{project.investor}</span>
          </div>
          <div className="card-location limit_2line d-flex gap-1">
            <i className="bx bx-map text-main fs-16" />
            <span className="limit_1line">{project.address}</span>
          </div>
          <div className="card-location limit_2line d-flex gap-1">
            <i className="bx bx-area text-main fs-16" />
            {project.area}
          </div>
          <div className="card-location limit_2line d-flex gap-1">
            <i className="bx bx-building-house text-main fs-16" />
            {project.apartments}
          </div>
        </div>
      </Link>
      <div className="card-body-custom d-flex justify-content-between gap-2 pt-0">
        {project.hasVr && (
          <Link
            href={`${projectHref}#VR360`}
            className="btn btn-icon btn-sm btn-outline-default"
          >
            <Image
              src={ASSETS.vr360}
              alt="VR360"
              width={22}
              height={22}
              className="h-auto"
              style={{ width: 22 }}
            />
          </Link>
        )}
        <Link
          href={`/bang-hang/?id=${project.externalId}`}
          className="pc-card__btn border btn-sm btn btn-main text-dark flex-flow"
        >
          Bảng hàng
        </Link>
        <Link
          href={projectHref}
          className="btn btn-default btn-sm flex-flow"
        >
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
}
