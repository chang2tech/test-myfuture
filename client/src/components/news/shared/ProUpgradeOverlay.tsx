import Link from 'next/link';

export function ProUpgradeOverlay() {
  return (
    <div className="upgrade_pro">
      <div className="content_upgrade">
        <span className="icon">
          <i className="bx bx-lock" />
        </span>
        <h4 className="text-reset fs-16 fw-bold mb-2">Tính năng Pro</h4>
        <div className="mb-3 fs-12">Mở khóa để xem chi tiết</div>
        <Link className="btn-register" href="/nang-cap-pro/">
          Nâng cấp lên Pro
        </Link>
      </div>
    </div>
  );
}
