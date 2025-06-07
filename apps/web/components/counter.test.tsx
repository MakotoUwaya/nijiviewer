import { HeroUIProvider } from '@heroui/react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { Counter } from './counter';

// HeroUI コンポーネントをテストするためのラッパー
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <HeroUIProvider>{children}</HeroUIProvider>
);

describe('Counter', () => {
  describe('カウンターボタンをクリックしたとき', () => {
    test('ボタンのラベルがカウントアップすること', async () => {
      const mockOnClick = vi.fn();
      const user = userEvent.setup();
      
      const { getByRole, rerender } = render(
        <TestWrapper>
          <Counter onClick={mockOnClick} />
        </TestWrapper>
      );
      
      // 初期状態を確認
      const initialButton = getByRole('button');
      expect(initialButton).toHaveTextContent('Count is 0');
      
      // ボタンをクリック
      await user.click(initialButton);
      
      // コールバックが呼ばれたことを確認
      expect(mockOnClick).toHaveBeenCalledTimes(1);
      
      // 状態の更新を待つ
      expect(initialButton).toHaveTextContent('Count is 1');
    });
  });
});
