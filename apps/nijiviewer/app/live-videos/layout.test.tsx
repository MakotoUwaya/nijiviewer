import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import LiveVideosLayout from './layout';

describe('LiveVideosLayout', () => {
  it('renders the children inside the section wrapper', () => {
    render(
      <LiveVideosLayout>
        <p data-testid="child">child</p>
      </LiveVideosLayout>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
