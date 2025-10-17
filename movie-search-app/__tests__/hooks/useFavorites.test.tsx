import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFavorites } from '@/hooks/useFavorites';
import { movieApi } from '@/lib/api';
import { ReactNode } from 'react';
import { Favorite, Movie } from '@/types/movie';

// Mock the API
jest.mock('@/lib/api', () => ({
  movieApi: {
    getFavorites: jest.fn(),
    addFavorite: jest.fn(),
    removeFavorite: jest.fn(),
  },
}));

const mockGetFavorites = movieApi.getFavorites as jest.MockedFunction<typeof movieApi.getFavorites>;
const mockAddFavorite = movieApi.addFavorite as jest.MockedFunction<typeof movieApi.addFavorite>;
const mockRemoveFavorite = movieApi.removeFavorite as jest.MockedFunction<typeof movieApi.removeFavorite>;

describe('useFavorites', () => {
  let queryClient: QueryClient;

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const mockFavorites: Favorite[] = [
    {
      id: '1',
      imdbID: 'tt0372784',
      Title: 'Batman Begins',
      Year: '2005',
      Poster: 'poster1.jpg',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: '2',
      imdbID: 'tt0468569',
      Title: 'The Dark Knight',
      Year: '2008',
      Poster: 'poster2.jpg',
      addedAt: '2024-01-02T00:00:00.000Z',
    },
  ];

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    jest.clearAllMocks();
    mockGetFavorites.mockResolvedValue(mockFavorites);
  });

  afterEach(() => {
    queryClient.clear();
  });

  it('fetches favorites on mount', async () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockGetFavorites).toHaveBeenCalledTimes(1);
    expect(result.current.favorites).toEqual(mockFavorites);
  });

  it('returns empty array when no favorites exist', async () => {
    mockGetFavorites.mockResolvedValue([]);

    const { result } = renderHook(() => useFavorites(), { wrapper });

    await waitFor(() => {
      expect(result.current.favorites).toEqual([]);
    });
  });

  it('checks if movie is a favorite', async () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });

    await waitFor(() => {
      expect(result.current.favorites).toHaveLength(2);
    });

    expect(result.current.isFavorite('tt0372784')).toBe(true);
    expect(result.current.isFavorite('tt0468569')).toBe(true);
    expect(result.current.isFavorite('tt1234567')).toBe(false);
  });

  it('gets favorite ID by imdbID', async () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });

    await waitFor(() => {
      expect(result.current.favorites).toHaveLength(2);
    });

    expect(result.current.getFavoriteId('tt0372784')).toBe('1');
    expect(result.current.getFavoriteId('tt0468569')).toBe('2');
    expect(result.current.getFavoriteId('tt1234567')).toBeUndefined();
  });

  it('adds a favorite', async () => {
    const newMovie: Movie = {
      imdbID: 'tt1345836',
      Title: 'The Dark Knight Rises',
      Year: '2012',
      Poster: 'poster3.jpg',
    };

    const newFavorite: Favorite = {
      id: '3',
      ...newMovie,
      addedAt: '2024-01-03T00:00:00.000Z',
    };

    mockAddFavorite.mockResolvedValue({
      favorite: newFavorite,
      message: 'Added to favorites',
    });

    const { result } = renderHook(() => useFavorites(), { wrapper });

    await waitFor(() => {
      expect(result.current.favorites).toHaveLength(2);
    });

    // Update mock to return new favorite list after mutation
    mockGetFavorites.mockResolvedValue([...mockFavorites, newFavorite]);

    await result.current.addFavorite(newMovie);

    await waitFor(() => {
      expect(result.current.favorites).toHaveLength(3);
    });

    expect(mockAddFavorite).toHaveBeenCalledWith(
      expect.objectContaining(newMovie),
      expect.anything()
    );
  });

  it('removes a favorite', async () => {
    mockRemoveFavorite.mockResolvedValue({ message: 'Removed from favorites' });

    const { result } = renderHook(() => useFavorites(), { wrapper });

    await waitFor(() => {
      expect(result.current.favorites).toHaveLength(2);
    });

    // Update mock to return filtered list after mutation
    mockGetFavorites.mockResolvedValue(mockFavorites.slice(1));

    await result.current.removeFavorite('1');

    await waitFor(() => {
      expect(result.current.favorites).toHaveLength(1);
    });

    expect(mockRemoveFavorite).toHaveBeenCalledWith('1', expect.anything());
  });

  it('indicates isAdding while adding favorite', async () => {
    const newMovie: Movie = {
      imdbID: 'tt1345836',
      Title: 'The Dark Knight Rises',
      Year: '2012',
      Poster: 'poster3.jpg',
    };

    mockAddFavorite.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({
        favorite: { id: '3', ...newMovie, addedAt: new Date().toISOString() },
        message: 'Added',
      }), 100))
    );

    const { result } = renderHook(() => useFavorites(), { wrapper });

    await waitFor(() => {
      expect(result.current.favorites).toHaveLength(2);
    });

    const addPromise = result.current.addFavorite(newMovie);

    await waitFor(() => {
      expect(result.current.isAdding).toBe(true);
    });

    await addPromise;

    await waitFor(() => {
      expect(result.current.isAdding).toBe(false);
    });
  });

  it('indicates isRemoving while removing favorite', async () => {
    mockRemoveFavorite.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ message: 'Removed' }), 100))
    );

    const { result } = renderHook(() => useFavorites(), { wrapper });

    await waitFor(() => {
      expect(result.current.favorites).toHaveLength(2);
    });

    const removePromise = result.current.removeFavorite('1');

    await waitFor(() => {
      expect(result.current.isRemoving).toBe(true);
    });

    await removePromise;

    await waitFor(() => {
      expect(result.current.isRemoving).toBe(false);
    });
  });

  it('invalidates favorites query after adding', async () => {
    const newMovie: Movie = {
      imdbID: 'tt1345836',
      Title: 'The Dark Knight Rises',
      Year: '2012',
      Poster: 'poster3.jpg',
    };

    mockAddFavorite.mockResolvedValue({
      favorite: { id: '3', ...newMovie, addedAt: new Date().toISOString() },
      message: 'Added',
    });

    const { result } = renderHook(() => useFavorites(), { wrapper });

    await waitFor(() => {
      expect(result.current.favorites).toHaveLength(2);
    });

    const getFavoritesCallsBefore = mockGetFavorites.mock.calls.length;

    await result.current.addFavorite(newMovie);

    await waitFor(() => {
      expect(mockGetFavorites.mock.calls.length).toBeGreaterThan(getFavoritesCallsBefore);
    });
  });

  it('invalidates favorites query after removing', async () => {
    mockRemoveFavorite.mockResolvedValue({ message: 'Removed' });

    const { result } = renderHook(() => useFavorites(), { wrapper });

    await waitFor(() => {
      expect(result.current.favorites).toHaveLength(2);
    });

    const getFavoritesCallsBefore = mockGetFavorites.mock.calls.length;

    await result.current.removeFavorite('1');

    await waitFor(() => {
      expect(mockGetFavorites.mock.calls.length).toBeGreaterThan(getFavoritesCallsBefore);
    });
  });

  it('handles add favorite error gracefully', async () => {
    const newMovie: Movie = {
      imdbID: 'tt1345836',
      Title: 'The Dark Knight Rises',
      Year: '2012',
      Poster: 'poster3.jpg',
    };

    mockAddFavorite.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useFavorites(), { wrapper });

    await waitFor(() => {
      expect(result.current.favorites).toHaveLength(2);
    });

    await expect(result.current.addFavorite(newMovie)).rejects.toThrow('Network error');
  });

  it('handles remove favorite error gracefully', async () => {
    mockRemoveFavorite.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useFavorites(), { wrapper });

    await waitFor(() => {
      expect(result.current.favorites).toHaveLength(2);
    });

    await expect(result.current.removeFavorite('1')).rejects.toThrow('Network error');
  });
});
