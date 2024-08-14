import { composeStories } from '@storybook/react';
import { render, waitFor, within } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import * as stories from './counter.stories';

const composedStories = composeStories(stories);

describe('Counter', () => {
  describe('カウンターボタンをクリックしたとき', () => {
    const { Primary } = composedStories;
    test('ボタンのラベルがカウントアップすること', async () => {
      const { container, getByRole } = render(<Primary />);
      await waitFor(async () => {
        await Primary.play?.({ canvasElement: container });
      });
      const buttonText = getByRole('button', { name: 'Count is 1' });
      await waitFor(() => {
        expect(buttonText).toBeDefined();
      });
    });
  });
});