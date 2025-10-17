import { useState, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { movieApi } from '@/lib/api';

export function useMovieSearch() {
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['movies', searchQuery],
    queryFn: ({ pageParam = 1 }) => movieApi.searchMovies(searchQuery, pageParam),
    enabled: searchQuery.length > 0,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // OMDB returns empty array when no more results
      // Each page has max 10 results
      if (lastPage.length === 0 || lastPage.length < 10) {
        return undefined;
      }
      return allPages.length + 1;
    },
  });

  // Flatten all pages into a single array
  const searchResults = data?.pages.flatMap((page) => page) ?? [];

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const resetSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  return {
    searchQuery,
    searchResults,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    handleSearch,
    resetSearch,
  };
}
