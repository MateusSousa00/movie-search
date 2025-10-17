import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from '@presentation/controllers/movies.controller';
import { SearchMoviesUseCase } from '@application/use-cases/search-movies.use-case';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Movie } from '@domain/entities/movie.entity';

describe('MoviesController', () => {
  let controller: MoviesController;
  let searchMoviesUseCase: jest.Mocked<SearchMoviesUseCase>;

  beforeEach(async () => {
    searchMoviesUseCase = {
      execute: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: SearchMoviesUseCase,
          useValue: searchMoviesUseCase,
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
  });

  describe('search', () => {
    it('should return movies when search is successful', async () => {
      const mockMovies = [
        new Movie('tt1', 'Movie 1', '2020', 'poster1.jpg'),
        new Movie('tt2', 'Movie 2', '2021', 'poster2.jpg'),
      ];

      searchMoviesUseCase.execute.mockResolvedValue(mockMovies);

      const result = await controller.search('batman');

      expect(result).toEqual({
        movies: mockMovies,
        total: 2,
        page: 1,
      });
      expect(searchMoviesUseCase.execute).toHaveBeenCalledWith('batman', 1);
    });

    it('should throw BadRequest when query is empty', async () => {
      await expect(controller.search('')).rejects.toThrow(HttpException);
      await expect(controller.search('')).rejects.toThrow(
        'Query parameter "q" is required',
      );
    });

    it('should throw InternalServerError when use case fails', async () => {
      searchMoviesUseCase.execute.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(controller.search('batman')).rejects.toThrow(HttpException);
    });
  });
});
