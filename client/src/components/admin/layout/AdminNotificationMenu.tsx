'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ADMIN_NOTIFICATIONS,
  type AdminNotification,
} from '@/constants/admin/notifications';

export function AdminNotificationMenu() {
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>(
    ADMIN_NOTIFICATIONS,
  );

  const unreadCount = notifications.filter((item) => !item.read).length;

  useEffect(() => {
    if (!open) return;
    function handleClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  function handleOpen() {
    setOpen((prev) => !prev);
  }

  function handleMarkAllRead() {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  }

  function handleMarkRead(id: string) {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );
  }

  return (
    <div className="admin-notify-menu" ref={menuRef}>
      <button
        type="button"
        className="admin-navbar__icon-btn"
        onClick={handleOpen}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Thông báo${unreadCount > 0 ? `, ${unreadCount} chưa đọc` : ''}`}
      >
        <i className="bx bx-bell" aria-hidden />
        {unreadCount > 0 && (
          <span className="admin-navbar__badge" aria-hidden>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="admin-notify-menu__dropdown" role="menu">
          <div className="admin-notify-menu__header">
            <h2 className="admin-notify-menu__title">Thông báo</h2>
            {unreadCount > 0 && (
              <button
                type="button"
                className="admin-notify-menu__mark-all"
                onClick={handleMarkAllRead}
              >
                Đánh dấu đã đọc
              </button>
            )}
          </div>

          <div className="admin-notify-menu__list">
            {notifications.length === 0 && (
              <p className="admin-notify-menu__empty">Không có thông báo mới</p>
            )}

            {notifications.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`admin-notify-menu__item${item.read ? '' : ' is-unread'}`}
                role="menuitem"
                onClick={() => handleMarkRead(item.id)}
              >
                <span className="admin-notify-menu__item-title">{item.title}</span>
                <span className="admin-notify-menu__item-message">{item.message}</span>
                <span className="admin-notify-menu__item-time">{item.time}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
