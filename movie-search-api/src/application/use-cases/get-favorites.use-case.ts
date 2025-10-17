import { Inject, Injectable } from '@nestjs/common';
import * as movieRepositoryPort from '@domain/ports/movie-repository.port';
import { Favorite } from '@domain/entities/movie.entity';

@Injectable()
export class GetFavoritesUseCase {
  constructor(
    @Inject(movieRepositoryPort.MOVIE_REPOSITORY_PORT)
    private readonly movieRepository: movieRepositoryPort.MovieRepositoryPort,
  ) {}

  async execute(): Promise<Favorite[]> {
    return this.movieRepository.getFavorites();
  }
}
