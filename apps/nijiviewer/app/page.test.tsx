import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { HomeContent } from '@/components/home-content';

test('heading 要素が想定通りに存在すること', () => {
  render(<HomeContent />);
  expect(
    screen.getByRole('heading', { level: 1, name: /Discover/ }),
  ).toBeDefined();
  expect(
    screen.getByText(
      /Track and explore your favorite NijiSanji streamers in one place/,
    ),
  ).toBeDefined();
});
