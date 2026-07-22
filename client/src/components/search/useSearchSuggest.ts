'use client';

import { useCallback, useEffect, useState } from 'react';
import { useDebouncedValue } from '@/hooks/shared/useDebouncedValue';
import {
  getAdminSearchSuggestions,
  getPublicSearch,
  type AdminSearchResponse,
  type PublicSearchResponse,
} from '@/lib/api/search';

type SearchPane = 'articles' | 'projects';

interface UseSearchSuggestOptions {
  variant: 'public' | 'admin';
  enabled: boolean;
  query: string;
  limit?: number;
}

interface UseSearchSuggestResult {
  loading: boolean;
  activePane: SearchPane;
  setActivePane: (pane: SearchPane) => void;
  popular: string[];
  articles: PublicSearchResponse['articles'];
  projects: PublicSearchResponse['projects'];
}

const EMPTY_ARTICLES: PublicSearchResponse['articles'] = { total: 0, items: [] };
const EMPTY_PROJECTS: PublicSearchResponse['projects'] = { total: 0, items: [] };

export function useSearchSuggest({
  variant,
  enabled,
  query,
  limit = 10,
}: UseSearchSuggestOptions): UseSearchSuggestResult {
  const debouncedQuery = useDebouncedValue(query, 280);
  const [loading, setLoading] = useState(false);
  const [activePane, setActivePane] = useState<SearchPane>('articles');
  const [popular, setPopular] = useState<string[]>([]);
  const [articles, setArticles] = useState(EMPTY_ARTICLES);
  const [projects, setProjects] = useState(EMPTY_PROJECTS);

  const loadSuggestions = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    try {
      if (variant === 'admin') {
        const data: AdminSearchResponse = await getAdminSearchSuggestions(
          debouncedQuery,
          limit,
        );
        setPopular(data.popular);
        setArticles(data.articles);
        setProjects(EMPTY_PROJECTS);
        return;
      }

      const data: PublicSearchResponse = await getPublicSearch(
        debouncedQuery,
        limit,
      );
      setPopular(data.popular);
      setArticles(data.articles);
      setProjects(data.projects);

      if (debouncedQuery.trim()) {
        setActivePane(
          data.articles.total >= data.projects.total ? 'articles' : 'projects',
        );
      }
    } catch {
      setArticles(EMPTY_ARTICLES);
      setProjects(EMPTY_PROJECTS);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, enabled, limit, variant]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async search fetch
    void loadSuggestions();
  }, [loadSuggestions]);

  return {
    loading,
    activePane,
    setActivePane,
    popular,
    articles,
    projects,
  };
}
