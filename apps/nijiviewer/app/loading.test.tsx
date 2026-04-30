import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Loading from './loading';

describe('Loading', () => {
  it('renders the spinner with a label', () => {
    render(<Loading />);
    expect(screen.getByLabelText('Loading...')).toBeInTheDocument();
  });
});
