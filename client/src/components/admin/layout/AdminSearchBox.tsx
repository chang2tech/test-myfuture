'use client';

import { useRouter } from 'next/navigation';
import {
  useCallback,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import { useAdminLayout } from '@/components/admin/context/AdminLayoutContext';
import {
  SearchSuggestPanel,
  useSearchSuggestDismiss,
} from '@/components/search/SearchSuggestPanel';
import { useSearchSuggest } from '@/components/search/useSearchSuggest';
import type { SearchArticleItem } from '@/lib/api/search';

export function AdminSearchBox() {
  const router = useRouter();
  const { search, setSearch } = useAdminLayout();
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const {
    loading,
    activePane,
    setActivePane,
    popular,
    articles,
    projects,
  } = useSearchSuggest({
    variant: 'admin',
    enabled: open,
    query: search,
    limit: 8,
  });

  const close = useCallback(() => setOpen(false), []);

  useSearchSuggestDismiss(open, close, containerRef);

  const handleArticleSelect = useCallback(
    (article: SearchArticleItem) => {
      setOpen(false);
      setSearch(article.title);
      router.push(`/admin/articles?edit=${article.id}`);
    },
    [router, setSearch],
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setOpen(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="admin-navbar__search-wrap w-100">
      <form className="admin-navbar__search-input w-100" onSubmit={handleSubmit}>
        <i className="bx bx-search" aria-hidden />
        <input
          type="search"
          placeholder="Tìm bài viết..."
          value={search}
          aria-label="Tìm bài viết"
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setSearch(event.target.value);
            setOpen(true);
          }}
          onKeyDown={handleKeyDown}
        />
      </form>

      <div id="admin-search-suggest" className="admin-search-suggest">
        <SearchSuggestPanel
          open={open}
          query={search}
          loading={loading}
          variant="admin"
          activePane={activePane}
          popular={popular}
          articles={articles}
          projects={projects}
          onPaneChange={setActivePane}
          onPopularSelect={(term) => {
            setSearch(term);
            setOpen(true);
          }}
          onArticleSelect={handleArticleSelect}
          onProjectSelect={() => undefined}
        />
      </div>
    </div>
  );
}
