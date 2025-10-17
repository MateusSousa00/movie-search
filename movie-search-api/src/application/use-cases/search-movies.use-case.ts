import { Inject, Injectable } from '@nestjs/common';
import * as movieSearchPort_1 from '@domain/ports/movie-search.port';
import { Movie } from '@domain/entities/movie.entity';

@Injectable()
export class SearchMoviesUseCase {
  constructor(
    @Inject(movieSearchPort_1.MOVIE_SEARCH_PORT)
    private readonly movieSearchPort: movieSearchPort_1.MovieSearchPort,
  ) {}

  async execute(query: string, page: number = 1): Promise<Movie[]> {
    if (!query || query.trim().length === 0) {
      throw new Error('Search query cannot be empty');
    }

    return this.movieSearchPort.searchMovies(query, page);
  }
}
