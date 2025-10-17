import { GetFavoritesUseCase } from '@application/use-cases/get-favorites.use-case';
import { MovieRepositoryPort } from '@domain/ports/movie-repository.port';
import { Favorite } from '@domain/entities/movie.entity';

describe('GetFavoritesUseCase', () => {
  let useCase: GetFavoritesUseCase;
  let mockRepository: jest.Mocked<MovieRepositoryPort>;

  beforeEach(() => {
    mockRepository = {
      addFavorite: jest.fn(),
      removeFavorite: jest.fn(),
      getFavorites: jest.fn(),
      findByImdbId: jest.fn(),
    };

    useCase = new GetFavoritesUseCase(mockRepository);
  });

  it('should return all favorites', async () => {
    const mockFavorites = [
      new Favorite('uuid-1', 'tt1234567', 'Movie 1', '2020', 'poster1.jpg', new Date()),
      new Favorite('uuid-2', 'tt7654321', 'Movie 2', '2021', 'poster2.jpg', new Date()),
    ];

    mockRepository.getFavorites.mockResolvedValue(mockFavorites);

    const result = await useCase.execute();

    expect(result).toEqual(mockFavorites);
    expect(mockRepository.getFavorites).toHaveBeenCalledTimes(1);
  });

  it('should return empty array when no favorites exist', async () => {
    mockRepository.getFavorites.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
    expect(mockRepository.getFavorites).toHaveBeenCalledTimes(1);
  });
});
