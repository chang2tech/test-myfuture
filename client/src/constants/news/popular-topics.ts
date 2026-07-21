export interface PopularTopicItem {
  slug: string;
  name: string;
  count: number;
  icon: string;
  bgColor: string;
  color: string;
}

export const POPULAR_TOPICS: PopularTopicItem[] = [
  {
    slug: 'phap-ly-du-an',
    name: 'Pháp lý dự án',
    count: 28,
    icon: 'bxs-file-doc',
    bgColor: '#e8f0fe',
    color: '#4a90d9',
  },
  {
    slug: 'quy-hoach-ha-tang',
    name: 'Quy hoạch - Hạ tầng',
    count: 123,
    icon: 'bx-map',
    bgColor: '#e6f9f0',
    color: '#27ae60',
  },
  {
    slug: 'lai-suat-tai-chinh',
    name: 'Lãi suất - Tài chính',
    count: 28,
    icon: 'bx-wallet',
    bgColor: '#fff4e5',
    color: '#f5a623',
  },
  {
    slug: 'thi-truong-gia-ca',
    name: 'Thị trường - Giá cả',
    count: 85,
    icon: 'bx-trending-up',
    bgColor: '#f3e8fd',
    color: '#9b59b6',
  },
  {
    slug: 'dau-tu-dong-tien',
    name: 'Đầu tư - Dòng tiền',
    count: 91,
    icon: 'bx-transfer-alt',
    bgColor: '#e0f7f5',
    color: '#1abc9c',
  },
  {
    slug: 'cho-thue',
    name: 'Cho thuê',
    count: 12,
    icon: 'bx-key',
    bgColor: '#e8f0fe',
    color: '#4a90d9',
  },
];
