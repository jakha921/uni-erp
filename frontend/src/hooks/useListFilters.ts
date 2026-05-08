import { useState, useCallback } from 'react';

interface UseListFiltersOptions<F> {
  initialFilters: F;
  initialPage?: number;
  initialPageSize?: number;
}

export function useListFilters<F extends Record<string, unknown>>({
  initialFilters,
  initialPage = 1,
  initialPageSize = 20,
}: UseListFiltersOptions<F>) {
  const [filters, setFilters] = useState<F>(initialFilters);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [search, setSearchState] = useState('');

  const updateFilter = useCallback(<K extends keyof F>(key: K, value: F[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }, []);

  const setSearch = useCallback((value: string) => {
    setSearchState(value);
    setPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setSearchState('');
    setPage(1);
  }, [initialFilters]);

  const params = { ...filters, page, pageSize, search: search || undefined };

  return {
    filters,
    page,
    pageSize,
    search,
    params,
    setPage,
    setPageSize,
    setSearch,
    updateFilter,
    resetFilters,
  };
}
