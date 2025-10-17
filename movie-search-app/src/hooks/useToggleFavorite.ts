import { useState, useCallback } from 'react';
import { Movie, Favorite } from '@/types/movie';
import { useFavorites } from './useFavorites';

export function useToggleFavorite() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const { isFavorite, getFavoriteId, addFavorite, removeFavorite } = useFavorites();

  const toggleFavorite = useCallback(
    async (movie: Movie | Favorite) => {
      const isCurrentlyFavorite = isFavorite(movie.imdbID);

      setLoadingStates((prev) => ({ ...prev, [movie.imdbID]: true }));

      try {
        if (isCurrentlyFavorite) {
          const favoriteId = getFavoriteId(movie.imdbID);
          if (favoriteId) {
            await removeFavorite(favoriteId);
          }
        } else {
          await addFavorite(movie as Movie);
        }
      } finally {
        setLoadingStates((prev) => ({ ...prev, [movie.imdbID]: false }));
      }
    },
    [isFavorite, getFavoriteId, addFavorite, removeFavorite]
  );

  return {
    toggleFavorite,
    loadingStates,
  };
}
