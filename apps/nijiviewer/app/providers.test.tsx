import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Providers } from './providers';

describe('Providers', () => {
  it('renders children inside HeroUI / theme / auth providers', () => {
    render(
      <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
        <span data-testid="child">hello</span>
      </Providers>,
    );

    expect(screen.getByTestId('child')).toHaveTextContent('hello');
  });

  it('renders without theme props', () => {
    render(
      <Providers>
        <span data-testid="child">no-theme</span>
      </Providers>,
    );

    expect(screen.getByTestId('child')).toHaveTextContent('no-theme');
  });
});
