import { render, screen, fireEvent } from '@testing-library/react';
import BackToTop from '@/components/BackToTop';

describe('BackToTop', () => {
  beforeEach(() => {
    // Reset window.scrollY
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    });
  });

  it('does not show button initially when scrollY is 0', () => {
    render(<BackToTop />);

    const button = screen.queryByRole('button', { name: /back to top/i });
    expect(button).not.toBeInTheDocument();
  });

  it('shows button when scrolled past 300px', () => {
    render(<BackToTop />);

    // Simulate scroll past 300px
    Object.defineProperty(window, 'scrollY', { value: 400, writable: true });
    fireEvent.scroll(window);

    const button = screen.getByRole('button', { name: /back to top/i });
    expect(button).toBeInTheDocument();
  });

  it('hides button when scrolled back to top', () => {
    render(<BackToTop />);

    // Scroll down
    Object.defineProperty(window, 'scrollY', { value: 400, writable: true });
    fireEvent.scroll(window);

    expect(screen.getByRole('button', { name: /back to top/i })).toBeInTheDocument();

    // Scroll back up
    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    fireEvent.scroll(window);

    expect(screen.queryByRole('button', { name: /back to top/i })).not.toBeInTheDocument();
  });

  it('does not show button at exactly 300px', () => {
    render(<BackToTop />);

    Object.defineProperty(window, 'scrollY', { value: 300, writable: true });
    fireEvent.scroll(window);

    const button = screen.queryByRole('button', { name: /back to top/i });
    expect(button).not.toBeInTheDocument();
  });

  it('shows button at 301px', () => {
    render(<BackToTop />);

    Object.defineProperty(window, 'scrollY', { value: 301, writable: true });
    fireEvent.scroll(window);

    const button = screen.getByRole('button', { name: /back to top/i });
    expect(button).toBeInTheDocument();
  });

  it('calls window.scrollTo when button is clicked', () => {
    const scrollToMock = jest.fn();
    window.scrollTo = scrollToMock;

    render(<BackToTop />);

    // Make button visible
    Object.defineProperty(window, 'scrollY', { value: 400, writable: true });
    fireEvent.scroll(window);

    const button = screen.getByRole('button', { name: /back to top/i });
    fireEvent.click(button);

    expect(scrollToMock).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });

  it('has cursor-pointer class', () => {
    render(<BackToTop />);

    Object.defineProperty(window, 'scrollY', { value: 400, writable: true });
    fireEvent.scroll(window);

    const button = screen.getByRole('button', { name: /back to top/i });
    expect(button).toHaveClass('cursor-pointer');
  });

  it('has fixed positioning and z-50', () => {
    render(<BackToTop />);

    Object.defineProperty(window, 'scrollY', { value: 400, writable: true });
    fireEvent.scroll(window);

    const button = screen.getByRole('button', { name: /back to top/i });
    expect(button).toHaveClass('fixed', 'bottom-8', 'right-8', 'z-50');
  });

  it('has hover scale effect', () => {
    render(<BackToTop />);

    Object.defineProperty(window, 'scrollY', { value: 400, writable: true });
    fireEvent.scroll(window);

    const button = screen.getByRole('button', { name: /back to top/i });
    expect(button).toHaveClass('hover:scale-110');
  });

  it('renders arrow SVG icon', () => {
    render(<BackToTop />);

    Object.defineProperty(window, 'scrollY', { value: 400, writable: true });
    fireEvent.scroll(window);

    const button = screen.getByRole('button', { name: /back to top/i });
    const svg = button.querySelector('svg');

    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('w-6', 'h-6');
  });

  it('cleans up scroll event listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = render(<BackToTop />);

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('adds scroll event listener on mount', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

    render(<BackToTop />);

    expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });
});
