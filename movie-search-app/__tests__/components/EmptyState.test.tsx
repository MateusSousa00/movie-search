import { render, screen, fireEvent } from '@testing-library/react';
import EmptyState from '@/components/EmptyState';
import '@testing-library/jest-dom';

describe('EmptyState', () => {
  const icon = <svg data-testid="icon" />;

  it('renders icon and message', () => {
    render(<EmptyState icon={icon} message="No data available" />);

    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('renders a button when action with onClick is provided', () => {
    const onClick = jest.fn();
    render(
      <EmptyState
        icon={icon}
        message="No data available"
        action={{ label: 'Click me', onClick }}
      />
    );

    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalled();
  });

  it('renders a link when action with href is provided', () => {
    render(
      <EmptyState
        icon={icon}
        message="No data available"
        action={{ label: 'Go home', href: '/home' }}
      />
    );

    const link = screen.getByRole('link', { name: 'Go home' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/home');
  });
});
