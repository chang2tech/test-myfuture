import { ASSETS } from '@/constants/layout/assets';
import type { Project } from '@/lib/api/news';

export type ProjectRegion = 'mien-bac' | 'mien-nam' | 'mien-trung';

export interface FeaturedProjectDisplay {
  id: string;
  slug: string;
  name: string;
  address: string;
  coverImage: string;
  investor: string;
  area: string;
  apartments: string;
  region: ProjectRegion;
  externalId: string;
  hasVr?: boolean;
  badgeText?: string;
}

interface ProjectExtras {
  area: string;
  apartments: string;
  region: ProjectRegion;
  externalId: string;
  hasVr?: boolean;
  badgeText?: string;
}

const DEFAULT_EXTRAS: ProjectExtras = {
  area: '—',
  apartments: '—',
  region: 'mien-bac',
  externalId: '0',
  hasVr: true,
  badgeText: 'Mở bán',
};

export const FEATURED_PROJECT_EXTRAS: Record<string, ProjectExtras> = {
  'sunshine-river-park': {
    area: '5,2 ha',
    apartments: '2.500 căn hộ',
    region: 'mien-bac',
    externalId: '1',
    hasVr: true,
  },
  'noble-palace-tay-thang-long': {
    area: '3,8 ha',
    apartments: '1.200 căn hộ',
    region: 'mien-bac',
    externalId: '2',
    hasVr: true,
  },
  'sunshine-legend-city': {
    area: '8,5 ha',
    apartments: '4.000 căn hộ',
    region: 'mien-bac',
    externalId: '3',
    hasVr: true,
  },
  'vinhomes-ocean-park-2': {
    area: '458 ha',
    apartments: '66.000 căn hộ',
    region: 'mien-bac',
    externalId: '4',
    hasVr: true,
  },
  'lumiere-hanoi-seasons-garden': {
    area: '1,2 ha',
    apartments: '800 căn hộ',
    region: 'mien-bac',
    externalId: '5',
    hasVr: true,
  },
};

export const STATIC_FEATURED_PROJECTS: FeaturedProjectDisplay[] = [
  {
    id: 'static-34',
    slug: 'pt34',
    name: 'Sun Solar Residence Đà Nẵng',
    address: '09 Lê Duẩn, Hải Châu, Đà Nẵng',
    investor: 'Sun Property',
    coverImage:
      'https://ca.futurehomes.vn/files/thumb/600/400//images/BDS/wwRErO4vlcPWG8u5LXPzj5j__2AfKtsO5lZXUhX2qbowW9e1huPOI5jhY73GFTHlOYFrj7AkeYB-pAUo7bkDSyKhI2z76GmyS4SE5AAxkUZqFNY5irwhiG5SgMU_NWG0whfgUs915Tww895NrNTY8uszUPRD6w3zqWS-r0A2smw.jpg',
    area: '1,8 ha',
    apartments: '1.800 căn hộ',
    region: 'mien-trung',
    externalId: '34',
    hasVr: true,
    badgeText: 'Mở bán',
  },
  {
    id: 'static-35',
    slug: 'pt35',
    name: 'Sun Spana Tower Đà Nẵng',
    address:
      'Đầu cầu Hòa Xuân, khu đô thị Nam Hòa Xuân, phường Hòa Quý, quận Ngũ Hành Sơn, Đà Nẵng',
    investor: 'Tập đoàn Sun Group',
    coverImage:
      'https://ca.futurehomes.vn/files/thumb/600/400//images/7ab05bc2-sun-spana-tower-da-nang.jpg',
    area: '0,416 ha',
    apartments: '1.281 căn hộ',
    region: 'mien-trung',
    externalId: '35',
    hasVr: true,
    badgeText: 'Mở bán',
  },
  {
    id: 'static-36',
    slug: 'pt36',
    name: 'Masteri Sky Quarter',
    address: 'Vinhomes Wonder City, Đan Phương, Hà Nội',
    investor: 'Masteries Homes',
    coverImage:
      'https://ca.futurehomes.vn/files/thumb/600/400//images/BDS/mat-bang-tong-the-du-an-masteri-sky-quarter.jpg',
    area: '13 ha',
    apartments: '2.500 căn & 69 căn TMDV',
    region: 'mien-bac',
    externalId: '36',
    hasVr: true,
    badgeText: 'Mở bán',
  },
  {
    id: 'static-37',
    slug: 'pt37',
    name: 'BGI Topaz Downtown',
    address: 'KĐT An Vân Dương, đường Hoàng Quốc Việt, Thành phố Huế',
    investor: 'BGI Group',
    coverImage:
      'https://ca.futurehomes.vn/files/thumb/600/400//images/tien-ich-du-an-bgi-topaz-downtown-hue-3.png',
    area: '13,3 ha',
    apartments: '5.000 căn hộ & 150 căn thấp tầng',
    region: 'mien-trung',
    externalId: '37',
    hasVr: true,
    badgeText: 'Mở bán',
  },
  {
    id: 'static-38',
    slug: 'pt38',
    name: 'Vinhomes Grand Park',
    address: 'Nguyễn Xiển, Long Bình, TP. Thủ Đức, TP. HCM',
    investor: 'Vinhomes',
    coverImage:
      'https://ca.futurehomes.vn/files/thumb/600/400//images/Vinhomes-Ocean-Park-2_10.jpg',
    area: '271 ha',
    apartments: '44.000 căn hộ',
    region: 'mien-nam',
    externalId: '38',
    hasVr: true,
    badgeText: 'Mở bán',
  },
  {
    id: 'static-39',
    slug: 'pt39',
    name: 'Eaton Park',
    address: 'Đường Nguyễn Văn Linh, Quận 7, TP. HCM',
    investor: 'Gamuda Land',
    coverImage:
      'https://ca.futurehomes.vn/files/thumb/600/400//images/BDS/lumiere-hanoi-seasons-garden-1.jpg',
    area: '9,6 ha',
    apartments: '1.904 căn hộ',
    region: 'mien-nam',
    externalId: '39',
    hasVr: true,
    badgeText: 'Mở bán',
  },
];

export function toFeaturedProjectDisplay(
  project: Project,
  index: number,
): FeaturedProjectDisplay {
  const extras = FEATURED_PROJECT_EXTRAS[project.slug] ?? {
    ...DEFAULT_EXTRAS,
    externalId: String(index + 1),
  };

  return {
    id: project.id,
    slug: project.slug,
    name: project.name,
    address: project.address,
    coverImage: project.coverImage ?? ASSETS.noImage,
    investor: project.investor ?? '',
    badgeText: extras.badgeText ?? 'Mở bán',
    ...extras,
  };
}

export function mergeFeaturedProjects(
  apiProjects: Project[],
): FeaturedProjectDisplay[] {
  const fromApi = apiProjects.map(toFeaturedProjectDisplay);
  const apiSlugs = new Set(fromApi.map((p) => p.slug));
  const staticOnly = STATIC_FEATURED_PROJECTS.filter(
    (p) => !apiSlugs.has(p.slug),
  );

  return [...fromApi, ...staticOnly];
}

export const PROJECT_REGION_TABS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'mien-bac', label: 'Miền Bắc' },
  { id: 'mien-nam', label: 'Miền Nam' },
  { id: 'mien-trung', label: 'Miền Trung' },
] as const;

export type ProjectRegionTab = (typeof PROJECT_REGION_TABS)[number]['id'];
