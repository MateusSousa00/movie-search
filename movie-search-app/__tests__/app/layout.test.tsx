import { render, screen } from '@testing-library/react';
import RootLayout from '../../src/app/layout';
import '@testing-library/jest-dom';

// Mock the child components used in layout
jest.mock('@/components/Providers', () => ({
  Providers: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="providers">{children}</div>
  ),
}));

jest.mock('@/components/Navigation', () => () => (
  <nav data-testid="navigation">Navigation</nav>
));

jest.mock('@/components/BackToTop', () => () => (
  <button data-testid="back-to-top">BackToTop</button>
));

describe('RootLayout', () => {
  it('renders layout structure correctly', () => {
    render(
      <RootLayout>
        <div data-testid="child">Page Content</div>
      </RootLayout>
    );

    // Assert HTML structure
    expect(document.querySelector('html')).toHaveAttribute('lang', 'en');
    expect(screen.getByTestId('providers')).toBeInTheDocument();
    expect(screen.getByTestId('navigation')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByTestId('back-to-top')).toBeInTheDocument();
  });
});
