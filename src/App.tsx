import { useState } from "react";
import type { SupportedChainName, SerdeRankBy } from "./types/test-task-types";
import { TRENDING_TOKENS_FILTERS, NEW_TOKENS_FILTERS } from "./types/test-task-types";
import { useScanner } from "./hooks/useScanner";
import Header from "./components/Header";
import ChainTabs from "./components/ChainTabs";
import FilterBar from "./components/FilterBar";

import TokenTable from "./components/tokenTable/TokenTable";

import './App.css'

export function ScannerPage() {
  const [activeTab, setActiveTab] = useState<"trending" | "new">("trending");
  const [selectedChain, setSelectedChain] = useState<SupportedChainName | null>(null);

  // Get base filters for the current tab
  const baseFilters = activeTab === "trending" ? TRENDING_TOKENS_FILTERS : NEW_TOKENS_FILTERS;

  const {
    tokens,
    filters,
    updateFilters,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    totalRows
  } = useScanner({
    // @ts-ignore
    initialFilters: {
      ...baseFilters,
      chain: selectedChain,
    }
  });

  const handleTabChange = (tab: "trending" | "new") => {
    setActiveTab(tab);

    const newBaseFilters = tab === "trending" ? TRENDING_TOKENS_FILTERS : NEW_TOKENS_FILTERS;

    updateFilters({
      ...newBaseFilters,
      chain: selectedChain,
      page: 1
    });
  };

  const handleFilterChange = (values: any) => {
    updateFilters({
      ...values,
      chain: selectedChain,
    });
  };

  const handleChainSelect = (chain: SupportedChainName | null) => {
    setSelectedChain(chain);
    updateFilters({ chain, page: 1 });
  };

  const handleSort = (sortKey: string, direction: 'asc' | 'desc') => {
    updateFilters({
      rankBy: sortKey as SerdeRankBy,
      orderBy: direction,
      page: 1
    });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-dex-dark text-white flex items-center justify-center">
        <div className="text-center" data-testid="error-state">
          <h2 className="text-xl font-bold text-dex-danger mb-2">Connection Error</h2>
          <p className="text-dex-text mb-4">
            {typeof error === 'string' ? error : 'Failed to connect to the scanner API'}
          </p>
          <p className="text-sm text-dex-text">
            Please try refreshing the page or check your connection.
          </p>
        </div>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-dex-dark text-white font-inter" data-testid="scanner-page">
        <Header
            activeTab={activeTab}
            onTabChange={handleTabChange}
        />
        <ChainTabs
            selectedChain={selectedChain}
            onChainSelect={handleChainSelect}
        />
        <FilterBar
          onFilterChange={handleFilterChange}
          currentFilters={filters}
        />
        <TokenTable 
          tokens={tokens} 
          isLoading={isLoading} 
          isLoadingMore={isLoadingMore}
          hasMore={hasMore}
          onLoadMore={loadMore}
          sort={{ key: filters.rankBy, direction: filters.orderBy || "desc" }}
          onSort={handleSort}
          totalRows={totalRows}
        />
      </div>
  );
}

function App() {
  return (
    <>
      <ScannerPage />
    </>
  )
}

export default App
