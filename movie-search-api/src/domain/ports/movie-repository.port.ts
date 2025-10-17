import { Favorite } from '../entities/movie.entity';

export interface MovieRepositoryPort {
  addFavorite(favorite: Omit<Favorite, 'id' | 'addedAt'>): Promise<Favorite>;
  removeFavorite(id: string): Promise<boolean>;
  getFavorites(): Promise<Favorite[]>;
  findByImdbId(imdbID: string): Promise<Favorite | null>;
}

export const MOVIE_REPOSITORY_PORT = Symbol('MOVIE_REPOSITORY_PORT');
