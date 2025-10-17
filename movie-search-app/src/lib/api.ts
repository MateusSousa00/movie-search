import axios from 'axios';
import {
  Movie,
  Favorite,
  SearchResponse,
  FavoritesResponse,
  AddFavoriteResponse,
} from '@/types/movie';
import { API_CONFIG } from './constants';

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const movieApi = {
  searchMovies: async (query: string, page: number = 1): Promise<Movie[]> => {
    const response = await apiClient.get<SearchResponse>('/movies/search', {
      params: { q: query, page },
    });
    return response.data.movies;
  },

  getFavorites: async (): Promise<Favorite[]> => {
    const response = await apiClient.get<FavoritesResponse>('/favorites');
    return response.data.favorites;
  },

  addFavorite: async (movie: Movie): Promise<Favorite> => {
    const response = await apiClient.post<AddFavoriteResponse>('/favorites', movie);
    return response.data.favorite;
  },

  removeFavorite: async (id: string): Promise<void> => {
    await apiClient.delete(`/favorites/${id}`);
  },
};
