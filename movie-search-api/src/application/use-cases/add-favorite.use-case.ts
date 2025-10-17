import { Inject, Injectable, ConflictException } from '@nestjs/common';
import * as movieRepositoryPort from '@domain/ports/movie-repository.port';
import { Favorite } from '@domain/entities/movie.entity';
import { AddFavoriteDto } from '../dto/movie.dto';

@Injectable()
export class AddFavoriteUseCase {
  constructor(
    @Inject(movieRepositoryPort.MOVIE_REPOSITORY_PORT)
    private readonly movieRepository: movieRepositoryPort.MovieRepositoryPort,
  ) {}

  async execute(dto: AddFavoriteDto): Promise<Favorite> {
    const existing = await this.movieRepository.findByImdbId(dto.imdbID);

    if (existing) {
      throw new ConflictException('Movie is already in favorites');
    }

    return this.movieRepository.addFavorite({
      imdbID: dto.imdbID,
      Title: dto.Title,
      Year: dto.Year,
      Poster: dto.Poster,
    });
  }
}
