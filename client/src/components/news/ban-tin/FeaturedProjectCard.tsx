'use client';

import { SmartLink } from '@/components/shared/SmartLink';
import { ComingSoonButton } from '@/components/shared/ComingSoonButton';
import { ImageWithSkeleton } from '@/components/ui/image-with-skeleton';
import { ASSETS } from '@/constants/layout/assets';
import type { FeaturedProjectDisplay } from '@/constants/news/featured-projects';

interface FeaturedProjectCardProps {
  project: FeaturedProjectDisplay;
}

export function FeaturedProjectCard({ project }: FeaturedProjectCardProps) {
  const projectHref = `/project/${project.slug}.html`;

  return (
    <div className="project-card h-100 d-flex flex-column">
      <SmartLink href={projectHref} className="d-block flex-grow-1">
        <div className="card-img-wrap">
          <ImageWithSkeleton
            layout="fill"
            src={project.coverImage}
            alt={project.name}
            sizes="270px"
          />
          <span className="card-badge">{project.badgeText ?? 'Mở bán'}</span>
          <ComingSoonButton
            className="card-fav pc-card__heart"
            title="Thêm vào yêu thích"
            style={{ color: 'var(--gray)' }}
            feature="Yêu thích đang được cập nhật"
          >
            <i className="bx bx-cart" />
          </ComingSoonButton>
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
      </SmartLink>
      <div className="card-body-custom d-flex justify-content-between gap-2 pt-0 mt-auto">
        {project.hasVr && (
          <SmartLink
            href={`${projectHref}#VR360`}
            className="btn btn-icon btn-sm btn-outline-default"
          >
            <ImageWithSkeleton
              layout="intrinsic"
              src={ASSETS.vr360}
              alt="VR360"
              width={154}
              height={77}
              style={{ width: 22, height: 'auto' }}
            />
          </SmartLink>
        )}
        <SmartLink
          href={`/bang-hang/?id=${project.externalId}`}
          className="pc-card__btn border btn-sm btn btn-main text-dark flex-flow"
        >
          Bảng hàng
        </SmartLink>
        <SmartLink
          href={projectHref}
          className="btn btn-default btn-sm flex-flow"
        >
          Xem chi tiết
        </SmartLink>
      </div>
    </div>
  );
}
