import { Movie } from '../entities/movie.entity';

export interface MovieSearchPort {
  searchMovies(query: string, page?: number): Promise<Movie[]>;
}

export const MOVIE_SEARCH_PORT = Symbol('MOVIE_SEARCH_PORT');
