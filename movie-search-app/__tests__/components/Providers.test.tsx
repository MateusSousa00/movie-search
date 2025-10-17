import { render, screen } from '@testing-library/react';
import { Providers } from '@/components/Providers';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '@/components/ThemeProvider';

// Test component that uses both providers
function TestComponent() {
  const { theme } = useTheme();
  const { data, isLoading } = useQuery({
    queryKey: ['test'],
    queryFn: async () => 'test-data',
  });

  return (
    <div>
      <div data-testid="theme">{theme}</div>
      <div data-testid="query-status">{isLoading ? 'loading' : 'loaded'}</div>
      <div data-testid="query-data">{data}</div>
    </div>
  );
}

describe('Providers', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('renders children', () => {
    render(
      <Providers>
        <div data-testid="child">Test Child</div>
      </Providers>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('provides ThemeProvider context', async () => {
    render(
      <Providers>
        <TestComponent />
      </Providers>
    );

    const themeElement = await screen.findByTestId('theme');
    expect(themeElement).toBeInTheDocument();
    expect(themeElement).toHaveTextContent(/light|dark/);
  });

  it('provides QueryClientProvider context', async () => {
    render(
      <Providers>
        <TestComponent />
      </Providers>
    );

    const statusElement = await screen.findByTestId('query-status');
    expect(statusElement).toBeInTheDocument();

    // Should eventually load the data
    const dataElement = await screen.findByTestId('query-data');
    expect(dataElement).toHaveTextContent('test-data');
  });

  it('wraps children with both providers', async () => {
    render(
      <Providers>
        <TestComponent />
      </Providers>
    );

    // Both providers should work
    const themeElement = await screen.findByTestId('theme');
    const dataElement = await screen.findByTestId('query-data');

    expect(themeElement).toBeInTheDocument();
    expect(dataElement).toHaveTextContent('test-data');
  });

  it('handles multiple children', () => {
    render(
      <Providers>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <div data-testid="child-3">Child 3</div>
      </Providers>
    );

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
    expect(screen.getByTestId('child-3')).toBeInTheDocument();
  });

  it('initializes with default theme', async () => {
    render(
      <Providers>
        <TestComponent />
      </Providers>
    );

    const themeElement = await screen.findByTestId('theme');
    expect(themeElement).toHaveTextContent('light');
  });

  it('preserves nested component structure', () => {
    render(
      <Providers>
        <div data-testid="parent">
          <div data-testid="child">
            <span data-testid="grandchild">Nested Content</span>
          </div>
        </div>
      </Providers>
    );

    expect(screen.getByTestId('parent')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByTestId('grandchild')).toBeInTheDocument();
    expect(screen.getByText('Nested Content')).toBeInTheDocument();
  });
});
