'use client';

import { useRouter } from 'next/navigation';
import {
  useCallback,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import {
  getPublicArticlePath,
  getPublicProjectPath,
  SearchSuggestPanel,
  useSearchSuggestDismiss,
} from '@/components/search/SearchSuggestPanel';
import { useSearchSuggest } from '@/components/search/useSearchSuggest';
import type { SearchArticleItem, SearchProjectItem } from '@/lib/api/search';

interface SearchHeaderProps {
  id?: string;
  className?: string;
}

export function SearchHeader({ id, className = '' }: SearchHeaderProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const {
    loading,
    activePane,
    setActivePane,
    popular,
    articles,
    projects,
  } = useSearchSuggest({
    variant: 'public',
    enabled: open,
    query,
  });

  const close = useCallback(() => setOpen(false), []);

  useSearchSuggestDismiss(open, close, containerRef);

  const navigateToSearch = useCallback(
    (term: string) => {
      const trimmed = term.trim();
      if (!trimmed) return;
      setOpen(false);
      router.push(`/ban-tin/tim-kiem?q=${encodeURIComponent(trimmed)}`);
    },
    [router],
  );

  const handleArticleSelect = useCallback(
    (article: SearchArticleItem) => {
      setOpen(false);
      router.push(getPublicArticlePath(article));
    },
    [router],
  );

  const handleProjectSelect = useCallback(
    (project: SearchProjectItem) => {
      setOpen(false);
      router.push(getPublicProjectPath(project));
    },
    [router],
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    navigateToSearch(query);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`search_header input-group flex-nowrap py-1 rounded-pill px-3 search_header_pc ${className}`.trim()}
      id={id}
    >
      <form
        className="d-flex align-items-center pl-2 flex-fill gap-1 position-relative"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="form-control form-control-sm border-0 p-0"
          name="keyword"
          value={query}
          autoComplete="off"
          placeholder="Tìm bất cứ thứ gì..."
          aria-label="Tìm kiếm"
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onKeyDown={handleKeyDown}
        />
        <button
          className="btn btn-xs btn-icon"
          type="submit"
          aria-label="Tìm kiếm"
        >
          <i className="bx bx-search fs-20 text-main" />
        </button>
      </form>

      <div id={id ? `${id}-suggest` : 'search-suggest'}>
        <SearchSuggestPanel
          open={open}
          query={query}
          loading={loading}
          variant="public"
          activePane={activePane}
          popular={popular}
          articles={articles}
          projects={projects}
          onPaneChange={setActivePane}
          onPopularSelect={(term) => {
            setQuery(term);
            setOpen(true);
          }}
          onArticleSelect={handleArticleSelect}
          onProjectSelect={handleProjectSelect}
        />
      </div>
    </div>
  );
}
