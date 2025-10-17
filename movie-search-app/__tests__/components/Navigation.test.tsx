import { render, screen } from '@testing-library/react';
import Navigation from '@/components/Navigation';

// Mock ThemeToggle component
jest.mock('@/components/ThemeToggle', () => ({
  __esModule: true,
  default: () => <button data-testid="theme-toggle">Toggle Theme</button>,
}));

// Mock Link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('Navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders navigation with logo', () => {
    render(<Navigation />);

    expect(screen.getByText('Movie Favorites')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Navigation />);

    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Favorites')).toBeInTheDocument();
  });

  it('renders theme toggle', () => {
    render(<Navigation />);

    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
  });

  it('logo has cursor-pointer class', () => {
    render(<Navigation />);

    const logo = screen.getByText('Movie Favorites');
    expect(logo).toHaveClass('cursor-pointer');
  });

  it('navigation links have cursor-pointer class', () => {
    render(<Navigation />);

    const searchLink = screen.getByText('Search');
    const favoritesLink = screen.getByText('Favorites');

    expect(searchLink).toHaveClass('cursor-pointer');
    expect(favoritesLink).toHaveClass('cursor-pointer');
  });

  it('logo links to home page', () => {
    render(<Navigation />);

    const logo = screen.getByText('Movie Favorites');
    expect(logo).toHaveAttribute('href', '/');
  });

  it('search link points to home route', () => {
    render(<Navigation />);

    const searchLink = screen.getByText('Search');
    expect(searchLink).toHaveAttribute('href', '/');
  });

  it('favorites link points to favorites route', () => {
    render(<Navigation />);

    const favoritesLink = screen.getByText('Favorites');
    expect(favoritesLink).toHaveAttribute('href', '/favorites');
  });

  it('applies responsive layout classes', () => {
    const { container } = render(<Navigation />);

    const nav = container.querySelector('nav');
    const innerContainer = nav?.querySelector('.container');
    const flexContainer = innerContainer?.querySelector('.flex');

    expect(innerContainer).toHaveClass('container', 'mx-auto', 'px-4');
    expect(flexContainer).toHaveClass('flex', 'items-center', 'justify-between', 'h-16');
  });

  it('applies hover styles to logo', () => {
    render(<Navigation />);

    const logo = screen.getByText('Movie Favorites');
    expect(logo).toHaveClass('hover:text-primary-hover');
  });

  it('applies hover styles to navigation links', () => {
    render(<Navigation />);

    const searchLink = screen.getByText('Search');
    const favoritesLink = screen.getByText('Favorites');

    expect(searchLink).toHaveClass('hover:text-primary', 'hover:bg-muted');
    expect(favoritesLink).toHaveClass('hover:text-primary', 'hover:bg-muted');
  });
});
