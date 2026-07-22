'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { ASSETS } from '@/constants/layout/assets';
import { login } from '@/lib/api/admin';

export function LoginPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('admin@myfuture.vn');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Đăng nhập thành công');
      const redirect = searchParams.get('redirect') ?? '/admin/dashboard';
      router.push(redirect);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Đăng nhập thất bại',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-login-page admin-root">
      <div className="auth-login-card">
        <Image
          src={ASSETS.logo}
          alt="myFuture"
          width={160}
          height={40}
          className="auth-login-card__logo"
          priority
        />
        <h1 className="auth-login-card__title">Đăng nhập quản trị</h1>
        <p className="auth-login-card__desc">
          Quản lý bài viết và nội dung myFuture
        </p>

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <div>
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="Nhập email đăng nhập"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="form-label">
              Mật khẩu
            </label>
            <div className="auth-password-field position-relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-control pe-5"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="auth-password-toggle btn btn-link p-0"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                tabIndex={-1}
              >
                <i className={`bx ${showPassword ? 'bx-hide' : 'bx-show'}`} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="admin-btn admin-btn--primary w-100 mt-2"
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  );
}
