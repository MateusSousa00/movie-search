import { render, screen, fireEvent } from '@testing-library/react';
import HomePage from '../../src/app/page';

// ✅ Mock hooks
jest.mock('@/hooks/useMovieSearch', () => ({
  useMovieSearch: jest.fn(),
}));
jest.mock('@/hooks/useFavorites', () => ({
  useFavorites: jest.fn(),
}));
jest.mock('@/hooks/useToggleFavorite', () => ({
  useToggleFavorite: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// ✅ Mock child components (we don’t need full rendering)
jest.mock('@/components/SearchBar', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="search-bar" />),
}));
jest.mock('@/components/MovieGrid', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="movie-grid" />),
}));
jest.mock('@/components/EmptyState', () => ({
  __esModule: true,
  default: jest.fn(({ message }) => <div data-testid="empty-state">{message}</div>),
}));
jest.mock('@/components/LoadingSpinner', () => ({
  __esModule: true,
  default: jest.fn(({ message }) => <div data-testid="spinner">{message}</div>),
}));

import { useMovieSearch } from '@/hooks/useMovieSearch';
import { useFavorites } from '@/hooks/useFavorites';
import { useToggleFavorite } from '@/hooks/useToggleFavorite';
import { usePathname } from 'next/navigation';
import { MESSAGES } from '@/lib/constants';

describe('<HomePage />', () => {
  const mockUseMovieSearch = useMovieSearch as jest.Mock;
  const mockUseFavorites = useFavorites as jest.Mock;
  const mockUseToggleFavorite = useToggleFavorite as jest.Mock;
  const mockUsePathname = usePathname as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFavorites.mockReturnValue({ favorites: [] });
    mockUseToggleFavorite.mockReturnValue({
      toggleFavorite: jest.fn(),
      loadingStates: {},
    });
    mockUsePathname.mockReturnValue('/');
  });

  it('renders header and EmptyState when no search query', () => {
    mockUseMovieSearch.mockReturnValue({
      searchQuery: '',
      searchResults: [],
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      handleSearch: jest.fn(),
      resetSearch: jest.fn(),
    });

    render(<HomePage />);

    expect(screen.getByText('Search Movies')).toBeInTheDocument();
    expect(screen.getByTestId('empty-state')).toHaveTextContent(MESSAGES.START_SEARCHING);
  });

  it('renders LoadingSpinner when searching', () => {
    mockUseMovieSearch.mockReturnValue({
      searchQuery: 'batman',
      searchResults: [],
      isLoading: true,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      handleSearch: jest.fn(),
      resetSearch: jest.fn(),
    });

    render(<HomePage />);

    expect(screen.getByTestId('spinner')).toHaveTextContent(MESSAGES.SEARCHING);
  });

  it('renders MovieGrid when results exist', () => {
    mockUseMovieSearch.mockReturnValue({
      searchQuery: 'batman',
      searchResults: [{ id: 1, title: 'Batman Begins' }],
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      handleSearch: jest.fn(),
      resetSearch: jest.fn(),
    });

    render(<HomePage />);

    expect(screen.getByTestId('movie-grid')).toBeInTheDocument();
  });

  it('calls fetchNextPage when "Load More Movies" is clicked', () => {
    const fetchNextPage = jest.fn();

    mockUseMovieSearch.mockReturnValue({
      searchQuery: 'batman',
      searchResults: [{ id: 1, title: 'Batman Begins' }],
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: true,
      fetchNextPage,
      handleSearch: jest.fn(),
      resetSearch: jest.fn(),
    });

    render(<HomePage />);

    const button = screen.getByRole('button', { name: /load more movies/i });
    fireEvent.click(button);

    expect(fetchNextPage).toHaveBeenCalledTimes(1);
  });
});
