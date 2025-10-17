'use client';

import MovieGrid from '@/components/MovieGrid';
import EmptyState from '@/components/EmptyState';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useFavorites } from '@/hooks/useFavorites';
import { useToggleFavorite } from '@/hooks/useToggleFavorite';
import { formatFavoriteCount } from '@/lib/utils';
import { MESSAGES } from '@/lib/constants';

export default function FavoritesPage() {
  const { favorites, isLoading } = useFavorites();
  const { toggleFavorite, loadingStates } = useToggleFavorite();

  const heartIcon = (
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
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          My Favorites
        </h1>
        <p className="text-secondary">
          {favorites.length === 0
            ? MESSAGES.NO_FAVORITES
            : formatFavoriteCount(favorites.length)}
        </p>
      </header>

      {isLoading ? (
        <LoadingSpinner message={MESSAGES.LOADING_FAVORITES} />
      ) : favorites.length === 0 ? (
        <EmptyState
          icon={heartIcon}
          message="No favorites yet"
          action={{ label: 'Search Movies', href: '/' }}
        />
      ) : (
        <MovieGrid
          movies={favorites}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          loadingStates={loadingStates}
        />
      )}
    </div>
  );
}
