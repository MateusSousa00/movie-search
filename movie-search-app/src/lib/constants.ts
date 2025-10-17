export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  TIMEOUT: 10000,
} as const;

export const QUERY_KEYS = {
  MOVIES: 'movies',
  FAVORITES: 'favorites',
} as const;

export const MESSAGES = {
  NO_FAVORITES: 'You have not added any favorites yet',
  NO_RESULTS: 'No movies found',
  START_SEARCHING: 'Start searching for movies',
  LOADING_FAVORITES: 'Loading favorites...',
  SEARCHING: 'Searching...',
} as const;
