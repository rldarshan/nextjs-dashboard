import { useState, useCallback } from 'react';

type UseFetchReturn<T> = {
  data: T | null;
  error: string | null;
  loading: boolean;
  fetchData: (url?: string, options?: RequestInit) => Promise<void>;
};

export function useFetch<T>(initialUrl: string, initialOptions?: RequestInit): UseFetchReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(
    async (url: string = initialUrl, options: RequestInit = initialOptions || {}) => {
      setLoading(true);
      setError(null);

      const controller = new AbortController();
      const signal = controller.signal;

      try {
        const response = await fetch(url, { ...options, signal });
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();
        setData(json);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    },
    [initialUrl, initialOptions]
  );

  return { data, error, loading, fetchData };
}
