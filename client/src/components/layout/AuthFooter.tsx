import { SmartLink } from '@/components/shared/SmartLink';

export function AuthFooter() {
  return (
    <footer className="auth-footer">
      <div className="auth-footer-inner">
        <div className="auth-footer-left">
          <p>© 2026 bởi MyFuture. Mọi quyền được bảo lưu.</p>
          <div className="auth-footer-links">
            <SmartLink
              href="/thong-tin/chinh-sach-bao-mat"
              title="Chính sách bảo mật"
            >
              Chính sách bảo mật
            </SmartLink>
            <span>|</span>
            <SmartLink href="/thong-tin/dieu-khoan-su-dung" title="Điều khoản sử dụng">
              Điều khoản sử dụng
            </SmartLink>
          </div>
        </div>
        <div className="auth-footer-right">
          <span>Kết nối với chúng tôi</span>
          <div className="auth-footer-socials">
            <a
              href="https://www.facebook.com/share/1GgfZUWgTN/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              title="Facebook"
            >
              <i className="bx bxl-facebook" />
            </a>
            <a
              href="https://youtube.com/@myfuture.vn68?si=lyWxb9pB_sOX81z6"
              target="_blank"
              rel="noopener noreferrer"
              title="Youtube"
            >
              <i className="bx bxl-youtube" />
            </a>
            <a
              href="https://www.tiktok.com/@myfuture957"
              className="social-btn"
              title="TikTok"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                style={{ fill: 'var(--bs-gray-600)', width: 16 }}
              >
                <path d="M448.5 209.9c-44 .1-87-13.6-122.8-39.2l0 178.7c0 33.1-10.1 65.4-29 92.6s-45.6 48-76.6 59.6-64.8 13.5-96.9 5.3-60.9-25.9-82.7-50.8-35.3-56-39-88.9 2.9-66.1 18.6-95.2 40-52.7 69.6-67.7 62.9-20.5 95.7-16l0 89.9c-15-4.7-31.1-4.6-46 .4s-27.9 14.6-37 27.3-14 28.1-13.9 43.9 5.2 31 14.5 43.7 22.4 22.1 37.4 26.9 31.1 4.8 46-.1 28-14.4 37.2-27.1 14.2-28.1 14.2-43.8l0-349.4 88 0c-.1 7.4 .6 14.9 1.9 22.2 3.1 16.3 9.4 31.9 18.7 45.7s21.3 25.6 35.2 34.6c19.9 13.1 43.2 20.1 67 20.1l0 87.4z" />
              </svg>
            </a>
            <a href="tel:0966-541-145" title="Hotline">
              <i className="bx bx-phone" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
