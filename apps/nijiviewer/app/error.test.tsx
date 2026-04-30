import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ErrorPage from './error';

describe('Error page', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the fallback UI and logs the error on mount', () => {
    const error = new Error('boom');
    render(<ErrorPage error={error} reset={vi.fn()} />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Something went wrong!' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
    expect(console.error).toHaveBeenCalledWith(error);
  });

  it('invokes reset when the Try again button is clicked', () => {
    const reset = vi.fn();
    render(<ErrorPage error={new Error('boom')} reset={reset} />);

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));

    expect(reset).toHaveBeenCalledTimes(1);
  });
});
