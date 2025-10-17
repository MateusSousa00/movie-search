import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesController } from '@presentation/controllers/favorites.controller';
import { AddFavoriteUseCase } from '@application/use-cases/add-favorite.use-case';
import { RemoveFavoriteUseCase } from '@application/use-cases/remove-favorite.use-case';
import { GetFavoritesUseCase } from '@application/use-cases/get-favorites.use-case';
import { HttpException, ConflictException } from '@nestjs/common';
import { Favorite } from '@domain/entities/movie.entity';

describe('FavoritesController', () => {
  let controller: FavoritesController;
  let addFavoriteUseCase: jest.Mocked<AddFavoriteUseCase>;
  let removeFavoriteUseCase: jest.Mocked<RemoveFavoriteUseCase>;
  let getFavoritesUseCase: jest.Mocked<GetFavoritesUseCase>;

  beforeEach(async () => {
    addFavoriteUseCase = { execute: jest.fn() } as any;
    removeFavoriteUseCase = { execute: jest.fn() } as any;
    getFavoritesUseCase = { execute: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoritesController],
      providers: [
        { provide: AddFavoriteUseCase, useValue: addFavoriteUseCase },
        { provide: RemoveFavoriteUseCase, useValue: removeFavoriteUseCase },
        { provide: GetFavoritesUseCase, useValue: getFavoritesUseCase },
      ],
    }).compile();

    controller = module.get<FavoritesController>(FavoritesController);
  });

  describe('getFavorites', () => {
    it('should return favorites list', async () => {
      const mockFavorites = [
        new Favorite('1', 'tt1', 'Movie 1', '2020', 'poster1.jpg', new Date()),
      ];

      getFavoritesUseCase.execute.mockResolvedValue(mockFavorites);

      const result = await controller.getFavorites();

      expect(result).toEqual({
        favorites: mockFavorites,
        total: 1,
      });
    });

    it('should throw error when use case fails', async () => {
      getFavoritesUseCase.execute.mockRejectedValue(new Error('DB error'));

      await expect(controller.getFavorites()).rejects.toThrow(HttpException);
    });
  });

  describe('addFavorite', () => {
    it('should add a favorite successfully', async () => {
      const dto = {
        imdbID: 'tt1',
        Title: 'Test Movie',
        Year: '2020',
        Poster: 'poster.jpg',
      };

      const mockFavorite = new Favorite(
        '1',
        dto.imdbID,
        dto.Title,
        dto.Year,
        dto.Poster,
        new Date(),
      );

      addFavoriteUseCase.execute.mockResolvedValue(mockFavorite);

      const result = await controller.addFavorite(dto);

      expect(result).toEqual({
        favorite: mockFavorite,
        message: 'Movie added to favorites',
      });
    });

    it('should propagate ConflictException', async () => {
      const dto = {
        imdbID: 'tt1',
        Title: 'Test Movie',
        Year: '2020',
        Poster: 'poster.jpg',
      };

      addFavoriteUseCase.execute.mockRejectedValue(
        new ConflictException('Already exists'),
      );

      await expect(controller.addFavorite(dto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('removeFavorite', () => {
    it('should remove a favorite successfully', async () => {
      removeFavoriteUseCase.execute.mockResolvedValue();

      const result = await controller.removeFavorite('favorite-id');

      expect(result).toEqual({
        success: true,
        message: 'Favorite removed successfully',
      });
    });

    it('should throw error when use case fails', async () => {
      removeFavoriteUseCase.execute.mockRejectedValue(
        new Error('Not found'),
      );

      await expect(controller.removeFavorite('invalid-id')).rejects.toThrow(
        HttpException,
      );
    });
  });
});
