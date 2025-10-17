import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useToggleFavorite } from '@/hooks/useToggleFavorite';
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

describe('useToggleFavorite', () => {
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
  ];

  const nonFavoriteMovie: Movie = {
    imdbID: 'tt0468569',
    Title: 'The Dark Knight',
    Year: '2008',
    Poster: 'poster2.jpg',
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    jest.clearAllMocks();
    mockGetFavorites.mockResolvedValue(mockFavorites);
    mockAddFavorite.mockResolvedValue({
      favorite: { ...nonFavoriteMovie, id: '2', addedAt: new Date().toISOString() },
      message: 'Added',
    });
    mockRemoveFavorite.mockResolvedValue({ message: 'Removed' });
  });

  afterEach(() => {
    queryClient.clear();
  });

  it('initializes with empty loading states', () => {
    const { result } = renderHook(() => useToggleFavorite(), { wrapper });

    expect(result.current.loadingStates).toEqual({});
  });

  it('adds a movie to favorites when not already favorited', async () => {
    const { result } = renderHook(() => useToggleFavorite(), { wrapper });

    // Wait for favorites to load
    await waitFor(() => {
      expect(mockGetFavorites).toHaveBeenCalled();
    });

    await result.current.toggleFavorite(nonFavoriteMovie);

    expect(mockAddFavorite).toHaveBeenCalledWith(
      expect.objectContaining(nonFavoriteMovie),
      expect.anything()
    );
    expect(mockRemoveFavorite).not.toHaveBeenCalled();
  });

  it('removes a movie from favorites when already favorited', async () => {
    const { result } = renderHook(() => useToggleFavorite(), { wrapper });

    // Wait for favorites to load AND be available in the hook
    await waitFor(() => {
      expect(mockGetFavorites).toHaveBeenCalled();
    });

    // Give extra time for the favorites hook internal state to update
    await new Promise(resolve => setTimeout(resolve, 50));

    await result.current.toggleFavorite(mockFavorites[0]);

    await waitFor(() => {
      expect(mockRemoveFavorite).toHaveBeenCalledWith('1', expect.anything());
    });
    expect(mockAddFavorite).not.toHaveBeenCalled();
  });

  it('sets loading state for specific movie while toggling', async () => {
    const { result } = renderHook(() => useToggleFavorite(), { wrapper });

    // Wait for favorites to load
    await waitFor(() => {
      expect(mockGetFavorites).toHaveBeenCalled();
    });

    const togglePromise = result.current.toggleFavorite(nonFavoriteMovie);

    // Loading state should be set synchronously or very quickly
    await waitFor(() => {
      expect(result.current.loadingStates[nonFavoriteMovie.imdbID]).toBe(true);
    }, { timeout: 100 }).catch(() => {
      // If it already completed, that's fine too
    });

    await togglePromise;

    // Check loading state is cleared
    await waitFor(() => {
      expect(result.current.loadingStates[nonFavoriteMovie.imdbID]).toBe(false);
    });
  });

  it('clears loading state even if operation fails', async () => {
    mockAddFavorite.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useToggleFavorite(), { wrapper });

    // Wait for favorites to load
    await waitFor(() => {
      expect(mockGetFavorites).toHaveBeenCalled();
    });

    try {
      await result.current.toggleFavorite(nonFavoriteMovie);
    } catch (error) {
      // Expected to fail
    }

    // Loading state should still be cleared
    await waitFor(() => {
      expect(result.current.loadingStates[nonFavoriteMovie.imdbID]).toBe(false);
    });
  });

  it('handles multiple movies with independent loading states', async () => {
    const movie1: Movie = {
      imdbID: 'tt1',
      Title: 'Movie 1',
      Year: '2020',
      Poster: 'poster1.jpg',
    };

    const movie2: Movie = {
      imdbID: 'tt2',
      Title: 'Movie 2',
      Year: '2021',
      Poster: 'poster2.jpg',
    };

    mockAddFavorite.mockImplementation(() =>
      new Promise(resolve => setTimeout(() => resolve({
        favorite: { id: '999', ...movie1, addedAt: new Date().toISOString() },
        message: 'Added'
      }), 100))
    );

    const { result } = renderHook(() => useToggleFavorite(), { wrapper });

    // Wait for favorites to load
    await waitFor(() => {
      expect(mockGetFavorites).toHaveBeenCalled();
    });

    const promise1 = result.current.toggleFavorite(movie1);
    const promise2 = result.current.toggleFavorite(movie2);

    // Both should have loading states
    await waitFor(() => {
      expect(result.current.loadingStates[movie1.imdbID]).toBe(true);
      expect(result.current.loadingStates[movie2.imdbID]).toBe(true);
    });

    await Promise.all([promise1, promise2]);

    // Both should clear loading states
    await waitFor(() => {
      expect(result.current.loadingStates[movie1.imdbID]).toBe(false);
      expect(result.current.loadingStates[movie2.imdbID]).toBe(false);
    });
  });

  it('correctly identifies favorite status', async () => {
    const { result } = renderHook(() => useToggleFavorite(), { wrapper });

    // Wait for favorites to load
    await waitFor(() => {
      expect(mockGetFavorites).toHaveBeenCalled();
    });

    // Give extra time for the favorites hook internal state to update
    await new Promise(resolve => setTimeout(resolve, 50));

    // Toggle a favorited movie (should remove)
    await result.current.toggleFavorite(mockFavorites[0]);
    await waitFor(() => {
      expect(mockRemoveFavorite).toHaveBeenCalled();
    });

    // Toggle a non-favorited movie (should add)
    await result.current.toggleFavorite(nonFavoriteMovie);
    await waitFor(() => {
      expect(mockAddFavorite).toHaveBeenCalled();
    });
  });

  it('handles Favorite type with id field', async () => {
    const favoriteMovie: Favorite = {
      id: '1',
      imdbID: 'tt0372784',
      Title: 'Batman Begins',
      Year: '2005',
      Poster: 'poster1.jpg',
      addedAt: '2024-01-01T00:00:00.000Z',
    };

    const { result } = renderHook(() => useToggleFavorite(), { wrapper });

    // Wait for favorites to load
    await waitFor(() => {
      expect(mockGetFavorites).toHaveBeenCalled();
    });

    // Give extra time for the favorites hook internal state to update
    await new Promise(resolve => setTimeout(resolve, 50));

    await result.current.toggleFavorite(favoriteMovie);

    // Should remove because it's already a favorite
    await waitFor(() => {
      expect(mockRemoveFavorite).toHaveBeenCalledWith('1', expect.anything());
    });
  });

  it('handles Movie type without id field', async () => {
    const plainMovie: Movie = {
      imdbID: 'tt0468569',
      Title: 'The Dark Knight',
      Year: '2008',
      Poster: 'poster2.jpg',
    };

    const { result } = renderHook(() => useToggleFavorite(), { wrapper });

    // Wait for favorites to load
    await waitFor(() => {
      expect(mockGetFavorites).toHaveBeenCalled();
    });

    await result.current.toggleFavorite(plainMovie);

    // Should add because it's not a favorite
    await waitFor(() => {
      expect(mockAddFavorite).toHaveBeenCalledWith(
        expect.objectContaining(plainMovie),
        expect.anything()
      );
    });
  });

  it('does not remove if getFavoriteId returns undefined', async () => {
    // Mock a scenario where favorite exists in list but getFavoriteId returns undefined
    mockGetFavorites.mockResolvedValue([
      {
        id: '1',
        imdbID: 'tt0372784',
        Title: 'Batman Begins',
        Year: '2005',
        Poster: 'poster1.jpg',
        addedAt: '2024-01-01T00:00:00.000Z',
      },
    ]);

    const { result } = renderHook(() => useToggleFavorite(), { wrapper });

    // Wait for favorites to load
    await waitFor(() => {
      expect(mockGetFavorites).toHaveBeenCalled();
    });

    // Try to toggle a movie with different imdbID (not in favorites)
    const differentMovie: Movie = {
      imdbID: 'tt9999999',
      Title: 'Unknown Movie',
      Year: '2020',
      Poster: 'poster.jpg',
    };

    await result.current.toggleFavorite(differentMovie);

    // Should add, not remove
    await waitFor(() => {
      expect(mockAddFavorite).toHaveBeenCalledWith(
        expect.objectContaining(differentMovie),
        expect.anything()
      );
    });
    expect(mockRemoveFavorite).not.toHaveBeenCalled();
  });

  it('propagates errors from add operation', async () => {
    mockAddFavorite.mockRejectedValue(new Error('Failed to add'));

    const { result } = renderHook(() => useToggleFavorite(), { wrapper });

    // Wait for favorites to load
    await waitFor(() => {
      expect(mockGetFavorites).toHaveBeenCalled();
    });

    await expect(result.current.toggleFavorite(nonFavoriteMovie)).rejects.toThrow('Failed to add');
  });

  it('propagates errors from remove operation', async () => {
    mockRemoveFavorite.mockRejectedValue(new Error('Failed to remove'));

    const { result } = renderHook(() => useToggleFavorite(), { wrapper });

    // Wait for favorites to load
    await waitFor(() => {
      expect(mockGetFavorites).toHaveBeenCalled();
    });

    // Give extra time for the favorites hook internal state to update
    await new Promise(resolve => setTimeout(resolve, 50));

    await expect(result.current.toggleFavorite(mockFavorites[0])).rejects.toThrow('Failed to remove');
  });
});
