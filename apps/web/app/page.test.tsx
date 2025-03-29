import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import Page from './page';

test('heading 要素が想定通りに存在すること', () => {
  render(<Page />);
  expect(screen.getByRole('heading', { level: 1, name: 'Make' })).toBeDefined();
  expect(
    screen.getByRole('heading', { level: 1, name: 'beautiful' }),
  ).toBeDefined();
  expect(
    screen.getByRole('heading', {
      level: 1,
      name: 'websites regardless of your design experience.',
    }),
  ).toBeDefined();
  expect(
    screen.getByRole('heading', {
      level: 2,
      name: 'Beautiful, fast and modern React UI library.',
    }),
  ).toBeDefined();
});
