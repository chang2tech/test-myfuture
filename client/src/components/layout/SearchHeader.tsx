interface SearchHeaderProps {
  id?: string;
  className?: string;
}

export function SearchHeader({ id, className = '' }: SearchHeaderProps) {
  return (
    <div
      className={`search_header input-group flex-nowrap py-1 rounded-pill px-3 search_header_pc ${className}`.trim()}
      id={id}
    >
      <div className="d-flex align-items-center pl-2 flex-fill gap-1 position-relative">
        <input
          type="text"
          className="form-control form-control-sm border-0 p-0"
          name="keyword"
          defaultValue=""
          autoComplete="off"
          placeholder="Tìm bất cứ thứ gì..."
        />
        <button className="btn btn-xs btn-icon" type="button">
          <i className="bx bx-search fs-20 text-main" />
        </button>
      </div>
      <div className="search_suggest" style={{ display: 'none' }}>
        <div className="ss-tabs">
          <button type="button" className="ss-tab active" data-pane="stock">
            Căn hộ <span className="ss-count ss-count--stock">0</span>
          </button>
          <button type="button" className="ss-tab" data-pane="info">
            Dự án <span className="ss-count ss-count--info">0</span>
          </button>
        </div>
        <div className="ss-body">
          <ul className="ss-pane ss-pane--stock active overflow-y-auto" />
          <ul className="ss-pane ss-pane--info overflow-y-auto" />
        </div>
        <div className="ss-empty">Đang tải gợi ý...</div>
      </div>
    </div>
  );
}
