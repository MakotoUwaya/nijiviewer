import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import Page from './page';

test('heading 要素が想定通りに存在すること', () => {
  render(<Page />);
  expect(
    screen.getByRole('heading', { level: 1, name: 'Discover' }),
  ).toBeDefined();
  expect(
    screen.getByRole('heading', { level: 1, name: 'VTuber' }),
  ).toBeDefined();
  expect(
    screen.getByRole('heading', {
      level: 1,
      name: 'streams with ease and convenience.',
    }),
  ).toBeDefined();
  expect(
    screen.getByRole('heading', {
      level: 2,
      name: 'Track and explore your favorite NijiSanji streamers in one place.',
    }),
  ).toBeDefined();
});
