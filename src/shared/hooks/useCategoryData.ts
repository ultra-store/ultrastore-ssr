import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { getCategoryData } from '../api/getCategoryData';
import type { CategoryData, CategorySearchParams } from '../types/types';

interface UseCategoryData {
  category?: CategoryData['category']
  products?: CategoryData['products']
  page?: number
  per_page?: number
  total?: number
  total_pages?: number
  has_more?: boolean
  filters?: CategoryData['filters']
  sorting?: CategoryData['sorting']
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => Promise<void>
}

const stableKey = (obj: unknown) => {
  try {
    return JSON.stringify(obj);
  } catch {
    return String(obj);
  }
};

export const useCategoryData = (
  category: string,
  search: CategorySearchParams,
): UseCategoryData => {
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const searchKey = useMemo(() => stableKey(search), [search]);

  const fetchOnce = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();

    abortRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      // парсим ключ обратно, чтобы передать актуальные параметры
      const parsedSearch = JSON.parse(searchKey) as CategorySearchParams;
      const data = await getCategoryData(category, parsedSearch, { signal: controller.signal });

      setCategoryData(data);
    } catch (e: unknown) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        return;
      }
      setCategoryData(null);
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [category, searchKey]);

  useEffect(() => {
    fetchOnce();

    return () => abortRef.current?.abort();
  }, [fetchOnce]);

  const refetch = useCallback(fetchOnce, [fetchOnce]);

  return {
    category: categoryData?.category,
    products: categoryData?.products,
    page: categoryData?.page,
    per_page: categoryData?.per_page,
    total: categoryData?.total,
    total_pages: categoryData?.total_pages,
    has_more: categoryData?.has_more,
    filters: categoryData?.filters,
    sorting: categoryData?.sorting,
    isLoading,
    isError: !!error,
    error,
    refetch,
  };
};
