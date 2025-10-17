import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as movieRepositoryPort from '@domain/ports/movie-repository.port';

@Injectable()
export class RemoveFavoriteUseCase {
  constructor(
    @Inject(movieRepositoryPort.MOVIE_REPOSITORY_PORT)
    private readonly movieRepository: movieRepositoryPort.MovieRepositoryPort,
  ) {}

  async execute(id: string): Promise<void> {
    const removed = await this.movieRepository.removeFavorite(id);

    if (!removed) {
      throw new NotFoundException('Favorite not found');
    }
  }
}
