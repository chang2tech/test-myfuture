export interface ReportItem {
  title: string;
  description: string;
  variant: 'pink' | 'blue' | 'green' | 'yellow';
  href: string;
}

export const REPORT_ITEMS: ReportItem[] = [
  {
    title: 'Báo cáo thị trường BĐS Tháng 04/2026',
    description: 'Tổng quan diễn biến thị trường bất động sản tháng 04/2026.',
    variant: 'pink',
    href: '#',
  },
  {
    title: 'Xu hướng giá căn hộ Q2/2026',
    description: 'Phân tích xu hướng giá theo khu vực và phân khúc.',
    variant: 'blue',
    href: '#',
  },
  {
    title: 'Dòng tiền đầu tư BĐS 05/2026',
    description: 'Báo cáo dòng tiền và tâm lý nhà đầu tư tháng 05/2026.',
    variant: 'green',
    href: '#',
  },
  {
    title: 'Tổng hợp chính sách mới 05/2026',
    description: 'Cập nhật các chính sách mới và quy định mới nhất.',
    variant: 'yellow',
    href: '#',
  },
];
