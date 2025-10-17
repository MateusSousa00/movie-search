'use client';

import { Movie, Favorite } from '@/types/movie';
import MovieCard from './MovieCard';

interface MovieGridProps {
  movies: (Movie | Favorite)[];
  favorites: Favorite[];
  onToggleFavorite: (movie: Movie | Favorite) => void;
  loadingStates?: Record<string, boolean>;
}

export default function MovieGrid({
  movies,
  favorites,
  onToggleFavorite,
  loadingStates = {},
}: MovieGridProps) {
  if (movies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No movies found</p>
      </div>
    );
  }

  const isFavorite = (movie: Movie | Favorite) =>
    favorites.some((fav) => fav.imdbID === movie.imdbID);

  // Deduplicate movies by imdbID (keep first occurrence)
  const uniqueMovies = Array.from(
    new Map(movies.map((movie) => [movie.imdbID, movie])).values()
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {uniqueMovies.map((movie) => (
        <MovieCard
          key={movie.imdbID}
          movie={movie}
          onToggleFavorite={() => onToggleFavorite(movie)}
          isFavorite={isFavorite(movie)}
          isLoading={loadingStates[movie.imdbID]}
        />
      ))}
    </div>
  );
}
