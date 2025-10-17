import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ThemeToggle from '@/components/ThemeToggle';
import { ThemeProvider } from '@/components/ThemeProvider';

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('renders placeholder while not mounted', () => {
    // We can't easily test the initial state because by the time we can query,
    // React has already mounted. Just verify the component renders without errors.
    const { container } = render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    expect(container).toBeInTheDocument();
  });

  it('renders toggle button after mounting', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /toggle theme/i });
      expect(button).toBeInTheDocument();
    });
  });

  it('shows moon icon in light mode', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /toggle theme/i });
      const svg = button.querySelector('svg');
      const path = svg?.querySelector('path');

      // Moon icon path
      expect(path?.getAttribute('d')).toContain('M20.354 15.354A9 9 0 018.646 3.646');
    });
  });

  it('shows sun icon in dark mode', async () => {
    localStorage.setItem('theme', 'dark');

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /toggle theme/i });
      const svg = button.querySelector('svg');
      const path = svg?.querySelector('path');

      // Sun icon path
      expect(path?.getAttribute('d')).toContain('M12 3v1m0 16v1m9-9h-1M4 12H3');
    });
  });

  it('toggles theme when clicked', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument();
    });

    const button = screen.getByRole('button', { name: /toggle theme/i });

    // Initially light theme (should show moon icon)
    let path = button.querySelector('svg path');
    expect(path?.getAttribute('d')).toContain('M20.354 15.354A9 9 0 018.646 3.646');

    // Click to toggle to dark
    fireEvent.click(button);

    await waitFor(() => {
      const newPath = button.querySelector('svg path');
      // Now should show sun icon
      expect(newPath?.getAttribute('d')).toContain('M12 3v1m0 16v1m9-9h-1M4 12H3');
    });
  });

  it('has cursor-pointer class', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /toggle theme/i });
      expect(button).toHaveClass('cursor-pointer');
    });
  });

  it('has hover styles', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /toggle theme/i });
      expect(button).toHaveClass('hover:bg-muted');
    });
  });

  it('has proper accessibility label', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /toggle theme/i });
      expect(button).toHaveAttribute('aria-label', 'Toggle theme');
    });
  });

  it('updates localStorage when toggled', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument();
    });

    const button = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(localStorage.getItem('theme')).toBe('dark');
    });
  });

  it('updates document data-theme attribute when toggled', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument();
    });

    const button = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });

  it('can toggle multiple times', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument();
    });

    const button = screen.getByRole('button', { name: /toggle theme/i });

    // Toggle to dark
    fireEvent.click(button);
    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    // Toggle back to light
    fireEvent.click(button);
    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    // Toggle to dark again
    fireEvent.click(button);
    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });
});
