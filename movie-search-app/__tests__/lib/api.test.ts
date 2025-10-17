import { movieApi } from '@/lib/api';
import { Movie, Favorite } from '@/types/movie';
import axios from 'axios';

// Step 1: mock axios.create
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  })),
}));

// Step 2: extract the mocks AFTER movieApi imports
const apiClient = (axios.create as jest.Mock).mock.results[0].value;
const getMock = apiClient.get as jest.Mock;
const postMock = apiClient.post as jest.Mock;
const deleteMock = apiClient.delete as jest.Mock;

describe('movieApi', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('searchMovies calls /movies/search and returns movies', async () => {
    const movies: Movie[] = [{ id: '1', title: 'Inception' }];
    getMock.mockResolvedValue({ data: { movies } });

    const result = await movieApi.searchMovies('Inception', 1);

    expect(getMock).toHaveBeenCalledWith('/movies/search', { params: { q: 'Inception', page: 1 } });
    expect(result).toEqual(movies);
  });

  it('getFavorites calls /favorites and returns favorites', async () => {
    const favorites: Favorite[] = [{ id: '1', title: 'Inception' }];
    getMock.mockResolvedValue({ data: { favorites } });

    const result = await movieApi.getFavorites();

    expect(getMock).toHaveBeenCalledWith('/favorites');
    expect(result).toEqual(favorites);
  });

  it('addFavorite posts movie and returns favorite', async () => {
    const movie: Movie = { id: '1', title: 'Inception' };
    const favorite: Favorite = { id: '1', title: 'Inception' };
    postMock.mockResolvedValue({ data: { favorite } });

    const result = await movieApi.addFavorite(movie);

    expect(postMock).toHaveBeenCalledWith('/favorites', movie);
    expect(result).toEqual(favorite);
  });

  it('removeFavorite deletes the favorite by id', async () => {
    deleteMock.mockResolvedValue({});

    await movieApi.removeFavorite('1');

    expect(deleteMock).toHaveBeenCalledWith('/favorites/1');
  });
});
