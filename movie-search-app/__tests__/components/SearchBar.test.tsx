import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '@/components/SearchBar';

describe('SearchBar', () => {
  it('renders search input', () => {
    render(<SearchBar onSearch={jest.fn()} />);

    const input = screen.getByPlaceholderText('Search for movies...');
    expect(input).toBeInTheDocument();
  });

  it('debounces search input by 500ms', async () => {
    const onSearch = jest.fn();
    const user = userEvent.setup();

    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByPlaceholderText('Search for movies...');

    // Type "batman"
    await user.type(input, 'batman');

    // Should not call immediately
    expect(onSearch).not.toHaveBeenCalled();

    // Should call after 500ms
    await waitFor(() => expect(onSearch).toHaveBeenCalledWith('batman'), {
      timeout: 600,
    });

    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it('does not trigger search for empty query', async () => {
    const onSearch = jest.fn();

    render(<SearchBar onSearch={onSearch} />);

    await waitFor(() => {}, { timeout: 600 });

    expect(onSearch).not.toHaveBeenCalled();
  });

  it('updates input value correctly', async () => {
    const user = userEvent.setup();

    render(<SearchBar onSearch={jest.fn()} />);

    const input = screen.getByPlaceholderText('Search for movies...') as HTMLInputElement;

    await user.type(input, 'interstellar');

    expect(input.value).toBe('interstellar');
  });

  it('can be reset via ref', async () => {
    const ref = React.createRef<any>();
    const user = userEvent.setup();

    render(<SearchBar ref={ref} onSearch={jest.fn()} />);

    const input = screen.getByPlaceholderText('Search for movies...') as HTMLInputElement;

    // Type into input
    await user.type(input, 'test');
    expect(input.value).toBe('test');

    // Reset via ref
    await act(async () => {
      ref.current?.reset();
    });

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  it('shows loading spinner when isLoading is true', () => {
    const { container } = render(<SearchBar onSearch={jest.fn()} isLoading={true} />);

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('does not show spinner when isLoading is false', () => {
    const { container } = render(<SearchBar onSearch={jest.fn()} isLoading={false} />);

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).not.toBeInTheDocument();
  });
});

// Add React import for ref test
import React from 'react';
