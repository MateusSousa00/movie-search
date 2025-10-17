import { render, screen } from '@testing-library/react';
import LoadingSpinner from '@/components/LoadingSpinner';
import '@testing-library/jest-dom';

describe('LoadingSpinner', () => {
  it('renders spinner with default size', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveClass('h-12 w-12', 'animate-spin', 'rounded-full', 'border-b-2', 'border-primary');
  });

  it('renders spinner with custom size', () => {
    render(<LoadingSpinner size="lg" />);
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveClass('h-16 w-16');
  });

  it('renders message when provided', () => {
    render(<LoadingSpinner message="Loading data..." />);
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('does not render message if not provided', () => {
    render(<LoadingSpinner />);
    const message = screen.queryByText(/.+/); // any text
    expect(message).not.toBeInTheDocument();
  });
});
