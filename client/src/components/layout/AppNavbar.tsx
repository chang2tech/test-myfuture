import Image from 'next/image';
import Link from 'next/link';
import { SearchHeader } from '@/components/layout/SearchHeader';
import { ASSETS } from '@/constants/layout/assets';

export function AppNavbar() {
  return (
    <div
      id="layout-navbar"
      className="top_header border-bottom w-100 layout-navbar layout-navbar-full navbar-detached px-0"
    >
      <nav className="navbar-custom" id="desktopNav">
        <div className="container-fluid">
          <div className="d-flex w-100 align-items-center justify-content-between">
            <Link className="brand" href="/">
              <Image
                src={ASSETS.logo}
                width={180}
                height={45}
                alt="My Future"
                className="w-auto"
                priority
              />
            </Link>
            <div className="d-flex align-items-center gap-2">
              <SearchHeader />
            </div>
            <div className="nav-actions">
              <Link href="/dang-nhap" className="btn-login">
                Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <header className="mobile-header">
        <div className="mobile-header-inner">
          <div className="d-flex gap-2 align-items-center">
            <div className="layout-menu-toggle navbar-nav align-items-xl-center me-2 me-xl-0 d-xl-none">
              <a
                className="nav-item nav-link px-0 me-xl-4 hamburger"
                id="openMenu"
                href="#layout-menu"
              >
                <i className="bx bx-menu bx-sm" />
              </a>
            </div>
            <Link className="mobile-brand" href="/">
              <Image
                src={ASSETS.logo}
                width={155}
                height={30}
                alt="My Future"
                className="w-auto"
                priority
              />
            </Link>
          </div>
          <div className="mobile-header-actions">
            <div className="position-relative d-flex align-items-center box_search_header">
              <SearchHeader id="mobile-search-header" />
              <button className="nav-icon-btn btn_search" type="button">
                <i className="bx bx-search" style={{ pointerEvents: 'none' }} />
              </button>
            </div>
            <Link
              className="btn btn-sm bg-main rounded-3 text-white fw-bold py-2"
              href="/dang-nhap"
              title="Đăng nhập"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
}
