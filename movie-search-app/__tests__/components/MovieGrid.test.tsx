import { render, screen, fireEvent } from '@testing-library/react';
import MovieGrid from '@/components/MovieGrid';
import { Movie, Favorite } from '@/types/movie';

// Mock MovieCard component
jest.mock('@/components/MovieCard', () => ({
  __esModule: true,
  default: ({ movie, onToggleFavorite, isFavorite, isLoading }: any) => (
    <div data-testid={`movie-card-${movie.imdbID}`}>
      <h3>{movie.Title}</h3>
      <button
        onClick={onToggleFavorite}
        disabled={isLoading}
        data-favorite={isFavorite}
      >
        {isFavorite ? 'Remove' : 'Add'}
      </button>
    </div>
  ),
}));

describe('MovieGrid', () => {
  const mockMovies: Movie[] = [
    {
      imdbID: 'tt0372784',
      Title: 'Batman Begins',
      Year: '2005',
      Poster: 'https://example.com/poster1.jpg',
    },
    {
      imdbID: 'tt0468569',
      Title: 'The Dark Knight',
      Year: '2008',
      Poster: 'https://example.com/poster2.jpg',
    },
    {
      imdbID: 'tt1345836',
      Title: 'The Dark Knight Rises',
      Year: '2012',
      Poster: 'https://example.com/poster3.jpg',
    },
  ];

  const mockFavorites: Favorite[] = [
    {
      id: '1',
      imdbID: 'tt0468569',
      Title: 'The Dark Knight',
      Year: '2008',
      Poster: 'https://example.com/poster2.jpg',
      addedAt: '2024-01-01T00:00:00.000Z',
    },
  ];

  const mockOnToggleFavorite = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all movies in grid', () => {
    render(
      <MovieGrid
        movies={mockMovies}
        favorites={[]}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    expect(screen.getByText('Batman Begins')).toBeInTheDocument();
    expect(screen.getByText('The Dark Knight')).toBeInTheDocument();
    expect(screen.getByText('The Dark Knight Rises')).toBeInTheDocument();
  });

  it('shows empty state when no movies', () => {
    render(
      <MovieGrid
        movies={[]}
        favorites={[]}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    expect(screen.getByText('No movies found')).toBeInTheDocument();
  });

  it('marks favorited movies correctly', () => {
    render(
      <MovieGrid
        movies={mockMovies}
        favorites={mockFavorites}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    const darkKnightButton = screen.getByTestId('movie-card-tt0468569').querySelector('button');
    const batmanBeginsButton = screen.getByTestId('movie-card-tt0372784').querySelector('button');

    expect(darkKnightButton).toHaveAttribute('data-favorite', 'true');
    expect(batmanBeginsButton).toHaveAttribute('data-favorite', 'false');
  });

  it('calls onToggleFavorite with correct movie', () => {
    render(
      <MovieGrid
        movies={mockMovies}
        favorites={[]}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    const batmanButton = screen.getByTestId('movie-card-tt0372784').querySelector('button');
    fireEvent.click(batmanButton!);

    expect(mockOnToggleFavorite).toHaveBeenCalledTimes(1);
    expect(mockOnToggleFavorite).toHaveBeenCalledWith(mockMovies[0]);
  });

  it('passes loading states to MovieCard', () => {
    const loadingStates = {
      'tt0372784': true,
      'tt0468569': false,
    };

    render(
      <MovieGrid
        movies={mockMovies}
        favorites={[]}
        onToggleFavorite={mockOnToggleFavorite}
        loadingStates={loadingStates}
      />
    );

    const batmanButton = screen.getByTestId('movie-card-tt0372784').querySelector('button');
    const darkKnightButton = screen.getByTestId('movie-card-tt0468569').querySelector('button');

    expect(batmanButton).toBeDisabled();
    expect(darkKnightButton).not.toBeDisabled();
  });

  it('deduplicates movies with same imdbID', () => {
    const duplicateMovies: Movie[] = [
      {
        imdbID: 'tt0372784',
        Title: 'Batman Begins (First)',
        Year: '2005',
        Poster: 'https://example.com/poster1.jpg',
      },
      {
        imdbID: 'tt0468569',
        Title: 'The Dark Knight',
        Year: '2008',
        Poster: 'https://example.com/poster2.jpg',
      },
      {
        imdbID: 'tt0372784', // Duplicate of Batman Begins
        Title: 'Batman Begins (Duplicate)',
        Year: '2005',
        Poster: 'https://example.com/poster1.jpg',
      },
    ];

    render(
      <MovieGrid
        movies={duplicateMovies}
        favorites={[]}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    // Should only render 2 unique movies, not 3
    const movieCards = screen.getAllByTestId(/^movie-card-/);
    expect(movieCards).toHaveLength(2);

    // Map keeps the last occurrence
    expect(screen.getByText('Batman Begins (Duplicate)')).toBeInTheDocument();
    expect(screen.queryByText('Batman Begins (First)')).not.toBeInTheDocument();
    expect(screen.getByText('The Dark Knight')).toBeInTheDocument();
  });

  it('uses responsive grid layout', () => {
    const { container } = render(
      <MovieGrid
        movies={mockMovies}
        favorites={[]}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-1');
    expect(grid).toHaveClass('sm:grid-cols-2');
    expect(grid).toHaveClass('md:grid-cols-3');
    expect(grid).toHaveClass('lg:grid-cols-4');
  });

  it('handles empty loadingStates object', () => {
    render(
      <MovieGrid
        movies={mockMovies}
        favorites={[]}
        onToggleFavorite={mockOnToggleFavorite}
        loadingStates={{}}
      />
    );

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).not.toBeDisabled();
    });
  });

  it('handles undefined loadingStates', () => {
    render(
      <MovieGrid
        movies={mockMovies}
        favorites={[]}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).not.toBeDisabled();
    });
  });
});
