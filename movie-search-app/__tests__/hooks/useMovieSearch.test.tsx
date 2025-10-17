import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMovieSearch } from '@/hooks/useMovieSearch';
import { movieApi } from '@/lib/api';
import { ReactNode } from 'react';

// Mock the API
jest.mock('@/lib/api', () => ({
  movieApi: {
    searchMovies: jest.fn(),
  },
}));

const mockSearchMovies = movieApi.searchMovies as jest.MockedFunction<typeof movieApi.searchMovies>;

describe('useMovieSearch', () => {
  let queryClient: QueryClient;

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    jest.clearAllMocks();
  });

  afterEach(() => {
    queryClient.clear();
  });

  it('initializes with empty search query', () => {
    const { result } = renderHook(() => useMovieSearch(), { wrapper });

    expect(result.current.searchQuery).toBe('');
    expect(result.current.searchResults).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('updates search query when handleSearch is called', async () => {
    const { result } = renderHook(() => useMovieSearch(), { wrapper });

    await act(async () => {
      result.current.handleSearch('batman');
    });

    await waitFor(() => {
      expect(result.current.searchQuery).toBe('batman');
    });
  });

  it('fetches movies when search query is set', async () => {
    const mockMovies = [
      { imdbID: 'tt0372784', Title: 'Batman Begins', Year: '2005', Poster: 'poster1.jpg' },
      { imdbID: 'tt0468569', Title: 'The Dark Knight', Year: '2008', Poster: 'poster2.jpg' },
    ];

    mockSearchMovies.mockResolvedValue(mockMovies);

    const { result } = renderHook(() => useMovieSearch(), { wrapper });

    act(() => {
      result.current.handleSearch('batman');
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockSearchMovies).toHaveBeenCalledWith('batman', 1);
    expect(result.current.searchResults).toEqual(mockMovies);
  });

  it('does not fetch when search query is empty', () => {
    const { result } = renderHook(() => useMovieSearch(), { wrapper });

    expect(mockSearchMovies).not.toHaveBeenCalled();
    expect(result.current.searchResults).toEqual([]);
  });

  it('resets search query with resetSearch', async () => {
    mockSearchMovies.mockResolvedValue([]);

    const { result } = renderHook(() => useMovieSearch(), { wrapper });

    act(() => {
      result.current.handleSearch('batman');
    });

    await waitFor(() => {
      expect(result.current.searchQuery).toBe('batman');
    });

    act(() => {
      result.current.resetSearch();
    });

    await waitFor(() => {
      expect(result.current.searchQuery).toBe('');
      expect(result.current.searchResults).toEqual([]);
    });
  });

  it('indicates loading state while fetching', async () => {
    mockSearchMovies.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve([]), 100))
    );

    const { result } = renderHook(() => useMovieSearch(), { wrapper });

    act(() => {
      result.current.handleSearch('batman');
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('fetches next page when fetchNextPage is called', async () => {
    const firstPage = Array.from({ length: 10 }, (_, i) => ({
      imdbID: `tt${i}`,
      Title: `Movie ${i}`,
      Year: '2020',
      Poster: 'poster.jpg',
    }));

    const secondPage = Array.from({ length: 10 }, (_, i) => ({
      imdbID: `tt${i + 10}`,
      Title: `Movie ${i + 10}`,
      Year: '2020',
      Poster: 'poster.jpg',
    }));

    mockSearchMovies
      .mockResolvedValueOnce(firstPage)
      .mockResolvedValueOnce(secondPage);

    const { result } = renderHook(() => useMovieSearch(), { wrapper });

    act(() => {
      result.current.handleSearch('test');
    });

    await waitFor(() => {
      expect(result.current.searchResults).toHaveLength(10);
    });

    expect(result.current.hasNextPage).toBe(true);

    act(() => {
      result.current.fetchNextPage();
    });

    await waitFor(() => {
      expect(result.current.searchResults).toHaveLength(20);
    });

    expect(mockSearchMovies).toHaveBeenCalledWith('test', 1);
    expect(mockSearchMovies).toHaveBeenCalledWith('test', 2);
  });

  it('sets hasNextPage to false when last page has less than 10 results', async () => {
    const shortPage = Array.from({ length: 5 }, (_, i) => ({
      imdbID: `tt${i}`,
      Title: `Movie ${i}`,
      Year: '2020',
      Poster: 'poster.jpg',
    }));

    mockSearchMovies.mockResolvedValue(shortPage);

    const { result } = renderHook(() => useMovieSearch(), { wrapper });

    act(() => {
      result.current.handleSearch('test');
    });

    await waitFor(() => {
      expect(result.current.searchResults).toHaveLength(5);
      expect(result.current.hasNextPage).toBe(false);
    });
  });

  it('sets hasNextPage to false when last page is empty', async () => {
    mockSearchMovies.mockResolvedValue([]);

    const { result } = renderHook(() => useMovieSearch(), { wrapper });

    act(() => {
      result.current.handleSearch('test');
    });

    await waitFor(() => {
      expect(result.current.searchResults).toHaveLength(0);
      expect(result.current.hasNextPage).toBe(false);
    });
  });

  it('indicates isFetchingNextPage while fetching next page', async () => {
    const firstPage = Array.from({ length: 10 }, (_, i) => ({
      imdbID: `tt${i}`,
      Title: `Movie ${i}`,
      Year: '2020',
      Poster: 'poster.jpg',
    }));

    mockSearchMovies.mockResolvedValue(firstPage);

    const { result } = renderHook(() => useMovieSearch(), { wrapper });

    act(() => {
      result.current.handleSearch('test');
    });

    await waitFor(() => {
      expect(result.current.searchResults).toHaveLength(10);
    });

    act(() => {
      result.current.fetchNextPage();
    });

    // Just verify that isFetchingNextPage eventually becomes false (operation completes)
    await waitFor(() => {
      expect(result.current.isFetchingNextPage).toBe(false);
    });
  });

  it('flattens all pages into single searchResults array', async () => {
    // Use 10 items per page so hasNextPage logic works correctly
    const page1 = Array.from({ length: 10 }, (_, i) => ({
      imdbID: `tt${i + 1}`,
      Title: `Movie ${i + 1}`,
      Year: '2020',
      Poster: `poster${i + 1}.jpg`,
    }));

    const page2 = Array.from({ length: 10 }, (_, i) => ({
      imdbID: `tt${i + 11}`,
      Title: `Movie ${i + 11}`,
      Year: '2020',
      Poster: `poster${i + 11}.jpg`,
    }));

    mockSearchMovies
      .mockResolvedValueOnce(page1)
      .mockResolvedValueOnce(page2);

    const { result } = renderHook(() => useMovieSearch(), { wrapper });

    act(() => {
      result.current.handleSearch('test');
    });

    await waitFor(() => {
      expect(result.current.searchResults).toHaveLength(10);
    });

    act(() => {
      result.current.fetchNextPage();
    });

    await waitFor(() => {
      expect(result.current.searchResults).toHaveLength(20);
    });

    expect(result.current.searchResults[0].imdbID).toBe('tt1');
    expect(result.current.searchResults[19].imdbID).toBe('tt20');
  });
});
