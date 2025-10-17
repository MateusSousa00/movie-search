import { AddFavoriteUseCase } from '@application/use-cases/add-favorite.use-case';
import { MovieRepositoryPort } from '@domain/ports/movie-repository.port';
import { Favorite } from '@domain/entities/movie.entity';
import { ConflictException } from '@nestjs/common';

describe('AddFavoriteUseCase', () => {
  let useCase: AddFavoriteUseCase;
  let mockRepository: jest.Mocked<MovieRepositoryPort>;

  beforeEach(() => {
    mockRepository = {
      addFavorite: jest.fn(),
      removeFavorite: jest.fn(),
      getFavorites: jest.fn(),
      findByImdbId: jest.fn(),
    };

    useCase = new AddFavoriteUseCase(mockRepository);
  });

  it('should add a favorite when movie is not already favorited', async () => {
    const dto = {
      imdbID: 'tt1234567',
      Title: 'Test Movie',
      Year: '2020',
      Poster: 'https://example.com/poster.jpg',
    };

    const expectedFavorite = new Favorite(
      'uuid-1',
      dto.imdbID,
      dto.Title,
      dto.Year,
      dto.Poster,
      new Date(),
    );

    mockRepository.findByImdbId.mockResolvedValue(null);
    mockRepository.addFavorite.mockResolvedValue(expectedFavorite);

    const result = await useCase.execute(dto);

    expect(result).toEqual(expectedFavorite);
    expect(mockRepository.findByImdbId).toHaveBeenCalledWith(dto.imdbID);
    expect(mockRepository.addFavorite).toHaveBeenCalledWith(dto);
  });

  it('should throw ConflictException when movie is already favorited', async () => {
    const dto = {
      imdbID: 'tt1234567',
      Title: 'Test Movie',
      Year: '2020',
      Poster: 'https://example.com/poster.jpg',
    };

    const existingFavorite = new Favorite(
      'uuid-1',
      dto.imdbID,
      dto.Title,
      dto.Year,
      dto.Poster,
      new Date(),
    );

    mockRepository.findByImdbId.mockResolvedValue(existingFavorite);

    await expect(useCase.execute(dto)).rejects.toThrow(ConflictException);
    expect(mockRepository.addFavorite).not.toHaveBeenCalled();
  });
});
