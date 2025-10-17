import { render, screen, fireEvent } from '@testing-library/react';
import MovieCard from '@/components/MovieCard';
import { Movie } from '@/types/movie';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { fill, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...rest} data-fill={fill ? 'true' : 'false'} />;
  },
}));

describe('MovieCard', () => {
  const mockMovie: Movie = {
    imdbID: 'tt0372784',
    Title: 'Batman Begins',
    Year: '2005',
    Poster: 'https://example.com/poster.jpg',
  };

  const mockOnToggleFavorite = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders movie title and year', () => {
    render(
      <MovieCard
        movie={mockMovie}
        onToggleFavorite={mockOnToggleFavorite}
        isFavorite={false}
      />
    );

    expect(screen.getByText('Batman Begins')).toBeInTheDocument();
    expect(screen.getByText('2005')).toBeInTheDocument();
  });

  it('renders poster image when poster URL is valid', () => {
    render(
      <MovieCard
        movie={mockMovie}
        onToggleFavorite={mockOnToggleFavorite}
        isFavorite={false}
      />
    );

    const image = screen.getByAltText('Batman Begins');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/poster.jpg');
  });

  it('shows placeholder when poster is N/A', () => {
    const movieWithoutPoster = { ...mockMovie, Poster: 'N/A' };

    const { container } = render(
      <MovieCard
        movie={movieWithoutPoster}
        onToggleFavorite={mockOnToggleFavorite}
        isFavorite={false}
      />
    );

    const image = screen.queryByAltText('Batman Begins');
    expect(image).not.toBeInTheDocument();

    // Check for placeholder SVG
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('shows placeholder when poster is empty string', () => {
    const movieWithEmptyPoster = { ...mockMovie, Poster: '' };

    render(
      <MovieCard
        movie={movieWithEmptyPoster}
        onToggleFavorite={mockOnToggleFavorite}
        isFavorite={false}
      />
    );

    const image = screen.queryByAltText('Batman Begins');
    expect(image).not.toBeInTheDocument();
  });

  it('shows placeholder when image fails to load', () => {
    render(
      <MovieCard
        movie={mockMovie}
        onToggleFavorite={mockOnToggleFavorite}
        isFavorite={false}
      />
    );

    const image = screen.getByAltText('Batman Begins');

    // Trigger image error
    fireEvent.error(image);

    // After error, image should not be displayed and placeholder should appear
    expect(screen.queryByAltText('Batman Begins')).not.toBeInTheDocument();
  });

  it('shows "Add to Favorites" button when not favorited', () => {
    render(
      <MovieCard
        movie={mockMovie}
        onToggleFavorite={mockOnToggleFavorite}
        isFavorite={false}
      />
    );

    const button = screen.getByRole('button', { name: /add to favorites/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary');
  });

  it('shows "Remove from Favorites" button when favorited', () => {
    render(
      <MovieCard
        movie={mockMovie}
        onToggleFavorite={mockOnToggleFavorite}
        isFavorite={true}
      />
    );

    const button = screen.getByRole('button', { name: /remove from favorites/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-error');
  });

  it('calls onToggleFavorite when button is clicked', () => {
    render(
      <MovieCard
        movie={mockMovie}
        onToggleFavorite={mockOnToggleFavorite}
        isFavorite={false}
      />
    );

    const button = screen.getByRole('button', { name: /add to favorites/i });
    fireEvent.click(button);

    expect(mockOnToggleFavorite).toHaveBeenCalledTimes(1);
  });

  it('shows loading spinner when isLoading is true', () => {
    render(
      <MovieCard
        movie={mockMovie}
        onToggleFavorite={mockOnToggleFavorite}
        isFavorite={false}
        isLoading={true}
      />
    );

    const spinner = screen.getByRole('button').querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('disables button when isLoading is true', () => {
    render(
      <MovieCard
        movie={mockMovie}
        onToggleFavorite={mockOnToggleFavorite}
        isFavorite={false}
        isLoading={true}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:cursor-not-allowed');
  });

  it('does not call onToggleFavorite when button is disabled', () => {
    render(
      <MovieCard
        movie={mockMovie}
        onToggleFavorite={mockOnToggleFavorite}
        isFavorite={false}
        isLoading={true}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnToggleFavorite).not.toHaveBeenCalled();
  });

  it('has cursor-pointer class on button', () => {
    render(
      <MovieCard
        movie={mockMovie}
        onToggleFavorite={mockOnToggleFavorite}
        isFavorite={false}
      />
    );

    const button = screen.getByRole('button', { name: /add to favorites/i });
    expect(button).toHaveClass('cursor-pointer');
  });
});
