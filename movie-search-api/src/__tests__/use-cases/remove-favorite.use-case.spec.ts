import { RemoveFavoriteUseCase } from '@application/use-cases/remove-favorite.use-case';
import { MovieRepositoryPort } from '@domain/ports/movie-repository.port';
import { NotFoundException } from '@nestjs/common';

describe('RemoveFavoriteUseCase', () => {
  let useCase: RemoveFavoriteUseCase;
  let mockRepository: jest.Mocked<MovieRepositoryPort>;

  beforeEach(() => {
    mockRepository = {
      addFavorite: jest.fn(),
      removeFavorite: jest.fn(),
      getFavorites: jest.fn(),
      findByImdbId: jest.fn(),
    };

    useCase = new RemoveFavoriteUseCase(mockRepository);
  });

  it('should remove a favorite when it exists', async () => {
    const favoriteId = 'favorite-uuid-123';
    mockRepository.removeFavorite.mockResolvedValue(true);

    await useCase.execute(favoriteId);

    expect(mockRepository.removeFavorite).toHaveBeenCalledWith(favoriteId);
  });

  it('should throw NotFoundException when favorite does not exist', async () => {
    const favoriteId = 'non-existent-id';
    mockRepository.removeFavorite.mockResolvedValue(false);

    await expect(useCase.execute(favoriteId)).rejects.toThrow(
      NotFoundException,
    );
    expect(mockRepository.removeFavorite).toHaveBeenCalledWith(favoriteId);
  });
});
