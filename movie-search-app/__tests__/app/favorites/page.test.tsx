import { render, screen } from '@testing-library/react';
import FavoritesPage from '@/app/favorites/page';
import '@testing-library/jest-dom';

// Mocks
jest.mock('@/hooks/useFavorites', () => ({
  useFavorites: jest.fn(),
}));
jest.mock('@/hooks/useToggleFavorite', () => ({
  useToggleFavorite: jest.fn(),
}));

// Mocked components that display their important props
jest.mock('@/components/LoadingSpinner', () => ({
  __esModule: true,
  default: ({ message }: { message: string }) => (
    <div data-testid="loading-spinner">{message}</div>
  ),
}));

jest.mock('@/components/EmptyState', () => ({
  __esModule: true,
  default: ({
    message,
    action,
  }: {
    message: string;
    action?: { label: string; href: string };
  }) => (
    <div data-testid="empty-state">
      <p>{message}</p>
      {action && <a href={action.href}>{action.label}</a>}
    </div>
  ),
}));

jest.mock('@/components/MovieGrid', () => ({
  __esModule: true,
  default: ({ movies }: { movies: any[] }) => (
    <div data-testid="movie-grid">{`Movies: ${movies.length}`}</div>
  ),
}));

const mockUseFavorites = require('@/hooks/useFavorites').useFavorites as jest.Mock;
const mockUseToggleFavorite = require('@/hooks/useToggleFavorite').useToggleFavorite as jest.Mock;

describe('FavoritesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseToggleFavorite.mockReturnValue({
      toggleFavorite: jest.fn(),
      loadingStates: {},
    });
  });

  it('renders loading state', () => {
    mockUseFavorites.mockReturnValue({ favorites: [], isLoading: true });

    render(<FavoritesPage />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.getByText('Loading favorites...')).toBeInTheDocument();
  });

  it('renders empty state when there are no favorites', () => {
    mockUseFavorites.mockReturnValue({ favorites: [], isLoading: false });

    render(<FavoritesPage />);

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText('No favorites yet')).toBeInTheDocument();
  });

  it('renders favorites grid when favorites exist', () => {
    const favorites = [{ id: 1, title: 'Inception' }];
    mockUseFavorites.mockReturnValue({ favorites, isLoading: false });

    render(<FavoritesPage />);

    expect(screen.getByTestId('movie-grid')).toBeInTheDocument();
    // match the real text returned by formatFavoriteCount
    expect(screen.getByText('You have 1 favorite movie')).toBeInTheDocument();
  });
});
