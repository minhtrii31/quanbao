'use client';

import { useCallback, useState, useEffect } from 'react';
import { ApiError } from '@/types/api';

interface UseApiOptions<T> {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: unknown;
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
}

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  refetch: () => void;
}

export function useApi<T>({
  url,
  method = 'GET',
  data,
  immediate = true,
  onSuccess,
  onError
}: UseApiOptions<T>): UseApiResult<T> {
  const [apiData, setApiData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'API request failed');
      }

      const result = await response.json();
      setApiData(result);
      onSuccess?.(result);
    } catch (err: unknown) {
      const error: ApiError = {
        message: err instanceof Error ? err.message : 'Unknown error occurred',
      };
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [data, method, onError, onSuccess, url]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [fetchData, immediate]);

  return {
    data: apiData,
    loading,
    error,
    refetch: fetchData,
  };
}
