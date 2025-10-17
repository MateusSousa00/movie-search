import { SearchMoviesUseCase } from '@application/use-cases/search-movies.use-case';
import { MovieSearchPort } from '@domain/ports/movie-search.port';
import { Movie } from '@domain/entities/movie.entity';

describe('SearchMoviesUseCase', () => {
  let useCase: SearchMoviesUseCase;
  let mockMovieSearchPort: jest.Mocked<MovieSearchPort>;

  beforeEach(() => {
    mockMovieSearchPort = {
      searchMovies: jest.fn(),
    };

    useCase = new SearchMoviesUseCase(mockMovieSearchPort);
  });

  it('should return movies when search is successful', async () => {
    const mockMovies = [
      new Movie('tt1234567', 'Test Movie', '2020', 'https://example.com/poster.jpg'),
      new Movie('tt7654321', 'Another Movie', '2021', 'https://example.com/poster2.jpg'),
    ];

    mockMovieSearchPort.searchMovies.mockResolvedValue(mockMovies);

    const result = await useCase.execute('test');

    expect(result).toEqual(mockMovies);
    expect(mockMovieSearchPort.searchMovies).toHaveBeenCalledWith('test', 1);
    expect(mockMovieSearchPort.searchMovies).toHaveBeenCalledTimes(1);
  });

  it('should throw error when query is empty', async () => {
    await expect(useCase.execute('')).rejects.toThrow('Search query cannot be empty');
    expect(mockMovieSearchPort.searchMovies).not.toHaveBeenCalled();
  });

  it('should throw error when query is only whitespace', async () => {
    await expect(useCase.execute('   ')).rejects.toThrow('Search query cannot be empty');
    expect(mockMovieSearchPort.searchMovies).not.toHaveBeenCalled();
  });

  it('should propagate errors from movie search port', async () => {
    mockMovieSearchPort.searchMovies.mockRejectedValue(new Error('API Error'));

    await expect(useCase.execute('test')).rejects.toThrow('API Error');
  });
});
