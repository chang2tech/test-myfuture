export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export const ADMIN_NOTIFICATIONS: AdminNotification[] = [
  {
    id: '1',
    title: 'Bài viết mới chờ duyệt',
    message: 'Có 2 bài viết ở trạng thái nháp cần xem xét.',
    time: '5 phút trước',
    read: false,
  },
  {
    id: '2',
    title: 'Cập nhật hệ thống',
    message: 'CMS admin đã được nâng cấp giao diện mới.',
    time: '1 giờ trước',
    read: false,
  },
  {
    id: '3',
    title: 'Sao lưu dữ liệu',
    message: 'Sao lưu tự động hoàn tất thành công.',
    time: 'Hôm qua',
    read: true,
  },
];
