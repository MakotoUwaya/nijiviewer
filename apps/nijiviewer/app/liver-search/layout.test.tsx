import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import LiverSearchLayout from './layout';

describe('LiverSearchLayout', () => {
  it('renders the children inside the section wrapper', () => {
    render(
      <LiverSearchLayout>
        <p data-testid="child">child</p>
      </LiverSearchLayout>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
