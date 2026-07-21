'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MENU_ITEMS } from '@/constants/layout/menu-items';

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside
      id="layout-menu"
      className="layout-menu menu-vertical menu bg-menu-theme"
      data-bg-class="bg-menu-theme"
    >
      <div className="profile-card pt-3 d-flex flex-column overflow-y-auto">
        <ul className="menu-inner mt-3 py-1 ps">
          {MENU_ITEMS.map((item, index) => {
            if (item.isDivider) {
              return <div key={`divider-${index}`} className="menu-divider" />;
            }

            const isActive =
              item.href === '/ban-tin'
                ? pathname.startsWith('/ban-tin')
                : pathname === item.href;

            return (
              <li
                key={item.label}
                className={`menu-item${item.isAi ? ' menu-item-ai' : ''}${isActive ? ' active' : ''}`}
              >
                <Link
                  href={item.href}
                  className="menu-link"
                  data-toggle="ripple"
                  {...(item.href.startsWith('http')
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  {item.isAi ? (
                    <span className="menu-ai-badge">AI</span>
                  ) : item.icon ? (
                    <i className={`menu-icon tf-icons bx ${item.icon}`} />
                  ) : null}
                  <div className="text-truncate">{item.label}</div>
                  {item.badge && (
                    <span
                      className={`badge badge-demo ms-auto ${
                        item.badge.variant === 'new'
                          ? 'bg-label-success'
                          : 'bg-label-danger'
                      }`}
                    >
                      {item.badge.text}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="menu-footer-pin">
          <div className="future-mind-card mt-2">
            <div className="content-left">
              <div className="brand">
                <span className="brand-name">FUTURE MIND</span>
                <span className="badge-pro">Pro</span>
              </div>
              <h2 className="main-title">
                Trợ lý AI phân tích &amp;
                <br />
                định hướng tương lai
              </h2>
              <p className="description">
                Phân tích chuyên sâu <br />– Cập nhật thị trường
                <br />– Gợi ý phương án tối ưu cho bạn.
              </p>
              <Link className="cta-button" href="/mind/">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="white"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
                Trải nghiệm ngay
              </Link>
            </div>
          </div>
          <a href="tel:0966-541-145" className="menu-footer-support mt-2">
            <div className="menu-footer-support-icon">
              <i className="bx bx-phone" style={{ fontSize: 18 }} />
            </div>
            <div className="menu-footer-support-text">
              <div className="menu-footer-support-title">Trung tâm hỗ trợ</div>
              <div className="menu-footer-support-sub">Hotline: 0966-541-145</div>
            </div>
          </a>
        </div>
      </div>
    </aside>
  );
}
