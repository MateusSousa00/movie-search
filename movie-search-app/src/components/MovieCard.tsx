'use client';

import Image from 'next/image';
import { Movie, Favorite } from '@/types/movie';
import { useState } from 'react';

interface MovieCardProps {
  movie: Movie | Favorite;
  onToggleFavorite: () => void;
  isFavorite: boolean;
  isLoading?: boolean;
}

export default function MovieCard({
  movie,
  onToggleFavorite,
  isFavorite,
  isLoading,
}: MovieCardProps) {
  const [imageError, setImageError] = useState(false);
  const hasPoster = movie.Poster && movie.Poster !== 'N/A' && movie.Poster !== '' && !imageError;

  return (
    <div className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-border">
      <div className="relative aspect-[2/3] bg-muted">
        {hasPoster ? (
          <Image
            src={movie.Poster}
            alt={movie.Title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <svg
              className="w-16 h-16 text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg text-foreground mb-1 line-clamp-2">
          {movie.Title}
        </h3>
        <p className="text-sm text-secondary mb-3">{movie.Year}</p>

        <button
          onClick={onToggleFavorite}
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors duration-200 min-h-[44px] cursor-pointer disabled:cursor-not-allowed ${
            isFavorite
              ? 'bg-error text-white hover:opacity-90 disabled:opacity-50'
              : 'bg-primary text-white hover:bg-primary-hover disabled:opacity-50'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            </span>
          ) : isFavorite ? (
            'Remove from Favorites'
          ) : (
            'Add to Favorites'
          )}
        </button>
      </div>
    </div>
  );
}
