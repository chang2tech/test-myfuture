import { SmartLink } from '@/components/shared/SmartLink';
import { ProUpgradeOverlay } from '@/components/news/shared/ProUpgradeOverlay';
import {
  OwlCarouselItem,
  OwlCarouselRow,
} from '@/components/shared/OwlCarouselRow';
import { REPORT_ITEMS } from '@/constants/news/reports';

export function ReportInsightSection() {
  return (
    <section className="block report_insight position-relative overflow-hidden">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h2 className="section-heading mb-0">Báo cáo &amp; Insight</h2>
        <SmartLink href="#" className="view-all w-px-150 justify-content-end">
          Xem tất cả <i className="fa fa-arrow-right" />
        </SmartLink>
      </div>
      <OwlCarouselRow
        className="report-scroll-wrap"
        showNav
        xsSlide={1.5}
        smSlide={3}
        lgSlide={4}
      >
        {REPORT_ITEMS.map((report) => (
          <OwlCarouselItem key={report.title}>
            <div className="report-col">
              <div className={`report-card ${report.variant}`}>
                <div>
                  <h5>{report.title}</h5>
                  <p>{report.description}</p>
                </div>
                <SmartLink href={report.href} className="btn btn-outline-danger">
                  Xem báo cáo
                </SmartLink>
              </div>
            </div>
          </OwlCarouselItem>
        ))}
      </OwlCarouselRow>
      <ProUpgradeOverlay />
    </section>
  );
}
