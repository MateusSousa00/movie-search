import { Module } from '@nestjs/common';
import { MOVIE_SEARCH_PORT } from '@domain/ports/movie-search.port';
import { MOVIE_REPOSITORY_PORT } from '@domain/ports/movie-repository.port';
import { OmdbApiAdapter } from '../adapters/omdb-api.adapter';
import { InMemoryRepositoryAdapter } from '../adapters/in-memory-repository.adapter';
import { SearchMoviesUseCase } from '@application/use-cases/search-movies.use-case';
import { AddFavoriteUseCase } from '@application/use-cases/add-favorite.use-case';
import { RemoveFavoriteUseCase } from '@application/use-cases/remove-favorite.use-case';
import { GetFavoritesUseCase } from '@application/use-cases/get-favorites.use-case';
import { MoviesController } from '@presentation/controllers/movies.controller';
import { FavoritesController } from '@presentation/controllers/favorites.controller';

@Module({
  controllers: [MoviesController, FavoritesController],
  providers: [
    {
      provide: MOVIE_SEARCH_PORT,
      useClass: OmdbApiAdapter,
    },
    {
      provide: MOVIE_REPOSITORY_PORT,
      useClass: InMemoryRepositoryAdapter,
    },
    SearchMoviesUseCase,
    AddFavoriteUseCase,
    RemoveFavoriteUseCase,
    GetFavoritesUseCase,
  ],
})
export class MoviesModule {}
