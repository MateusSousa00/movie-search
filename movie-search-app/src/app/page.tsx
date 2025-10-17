'use client';

import SearchBar, { SearchBarRef } from '@/components/SearchBar';
import MovieGrid from '@/components/MovieGrid';
import EmptyState from '@/components/EmptyState';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useMovieSearch } from '@/hooks/useMovieSearch';
import { useFavorites } from '@/hooks/useFavorites';
import { useToggleFavorite } from '@/hooks/useToggleFavorite';
import { MESSAGES } from '@/lib/constants';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function HomePage() {
  const searchBarRef = useRef<SearchBarRef>(null);
  const pathname = usePathname();

  const {
    searchQuery,
    searchResults,
    isLoading: isSearching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    handleSearch,
    resetSearch,
  } = useMovieSearch();

  const { favorites } = useFavorites();
  const { toggleFavorite, loadingStates } = useToggleFavorite();

  // Reset search when navigating to home page
  useEffect(() => {
    if (pathname === '/') {
      resetSearch();
      searchBarRef.current?.reset();
    }
  }, [pathname, resetSearch]);

  const searchIcon = (
    <svg
      className="mx-auto h-24 w-24 text-muted mb-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Search Movies
        </h1>
        <p className="text-secondary">
          Find your favorite movies and save them to your collection
        </p>
      </header>

      <SearchBar
        ref={searchBarRef}
        onSearch={handleSearch}
        isLoading={isSearching}
      />

      {searchQuery.length === 0 ? (
        <EmptyState icon={searchIcon} message={MESSAGES.START_SEARCHING} />
      ) : isSearching ? (
        <LoadingSpinner message={MESSAGES.SEARCHING} />
      ) : (
        <>
          <MovieGrid
            movies={searchResults}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            loadingStates={loadingStates}
          />

          {hasNextPage && (
            <div className="text-center mt-8">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isFetchingNextPage ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Loading more...
                  </span>
                ) : (
                  'Load More Movies'
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
