import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { movieApi } from '@/lib/api';
import { Movie } from '@/types/movie';

export function useFavorites() {
  const queryClient = useQueryClient();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: movieApi.getFavorites,
  });

  const addFavoriteMutation = useMutation({
    mutationFn: movieApi.addFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: movieApi.removeFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  const addFavorite = async (movie: Movie) => {
    await addFavoriteMutation.mutateAsync(movie);
  };

  const removeFavorite = async (id: string) => {
    await removeFavoriteMutation.mutateAsync(id);
  };

  const isFavorite = (imdbID: string) => {
    return favorites.some((fav) => fav.imdbID === imdbID);
  };

  const getFavoriteId = (imdbID: string) => {
    return favorites.find((fav) => fav.imdbID === imdbID)?.id;
  };

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    isFavorite,
    getFavoriteId,
    isAdding: addFavoriteMutation.isPending,
    isRemoving: removeFavoriteMutation.isPending,
  };
}
