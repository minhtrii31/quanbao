'use client';

import { useCallback, useState, useEffect, useMemo } from 'react';
import { News, NewsParams } from '@/types/api';
import { getNews } from '@/lib/api/news';

export const useNews = (params?: NewsParams) => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const serializedParams = useMemo(() => JSON.stringify(params ?? {}), [params]);
  const requestParams = useMemo(
    () => JSON.parse(serializedParams) as NewsParams,
    [serializedParams],
  );

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getNews(requestParams);
      setNews(response.news);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch news');
    } finally {
      setLoading(false);
    }
  }, [requestParams]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return {
    news,
    loading,
    error,
    refetch: fetchNews,
  };
};
