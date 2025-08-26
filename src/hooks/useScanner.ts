import { useState, useEffect, useCallback, useRef } from "react";
import type { ScannerResult, OrderBy, SerdeRankBy, TimeFrame } from "../types/test-task-types";
import type { TokenData, ScannerFilters } from "../types/scanner";
import { convertScannerResultToTokenData } from "../types/scanner";
import { useRealtimeUpdate } from "./useRealtimeUpdates.ts";

const ITEMS_PER_PAGE = 100;

const API_BASE_URL = "https://api-rs.dexcelerate.com";

interface UseScannerProps {
  initialFilters?: ScannerFilters;
}

export function useScanner({ initialFilters }: UseScannerProps = {}) {
  const [ filters, setFilters] = useState<ScannerFilters>({
    chain: null,
    rankBy: "volume",
    orderBy: "desc",
    isNotHP: true,
    minVol24H: null,
    maxAge: null,
    page: 1,
    ...initialFilters,
  });
  const { page } = filters;

  const prevPage = useRef(filters.page || 1);

  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { wsError } = useRealtimeUpdate({ tokens, setTokens, filters });

  // Fetch tokens from API
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async (isLoadMore = false) => {
    if (isLoadMore) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }
    setError(null);
    
    try {
      const searchParams = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          searchParams.append(key, String(value));
        }
      });

      const response = await fetch(`${API_BASE_URL}/scanner?${searchParams.toString()}`);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      const newTokens = data.pairs.map((pair: ScannerResult, index: number) => {
          const globalIndex = (filters.page || 1 - 1) * ITEMS_PER_PAGE + index;

          return convertScannerResultToTokenData(pair, globalIndex);
      });

      if (page && page > 1) {
        setTokens(prev => [...prev, ...newTokens]);
      } else {
        setTokens(newTokens);
      }

      const currentPage = filters.page || 1;
      const totalPages = Math.ceil(data.totalRows / ITEMS_PER_PAGE);
      setHasMore(currentPage < totalPages);
      setTotalRows(data.totalRows);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingMore) return;
    
    const nextPage = (filters.page || 1) + 1;
    setFilters(prev => ({ ...prev, page: nextPage }));
  }, [hasMore, isLoadingMore, filters.page]);

  useEffect(() => {
    fetchData();
  }, []);

  // Separate effect for page changes to append data instead of replacing
  useEffect(() => {
    const { page } = filters;

    const pageHasChanged = prevPage.current !== filters.page;

    if (pageHasChanged && page && page > 1) {
      prevPage.current = page

      fetchData(true);
    }
    else {
      fetchData();
    }
  }, [ filters ]);

  const updateFilters = useCallback((newFilters: {
    chain?: "ETH" | "SOL" | "BASE" | "BSC" | null;
    orderBy?: OrderBy;
    rankBy?: SerdeRankBy;
    timeFrame?: TimeFrame;
    page?: number;
    isNotHP?: boolean | null;
    minVol24H?: number | null;
    maxAge?: number | null;
  }) => {
    // Reset to page 1 when filters change (except for page changes)
    const shouldResetPage = Object.keys(newFilters).some(key => key !== 'page');
    setFilters(prev => ({ 
      ...prev, 
      ...newFilters,
      page: shouldResetPage ? 1 : (newFilters.page || prev.page)
    }));

    if (shouldResetPage) {
      setTokens([]);
      setHasMore(true);
    }
  }, []);

  return {
    tokens,
    filters,
    updateFilters,
    isLoading,
    isLoadingMore,
    error: error || wsError,
    hasMore,
    loadMore,
    totalRows,
  };
}
