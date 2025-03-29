import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Search } from './search';

describe('Search', () => {
  it('検索ボックスが表示される', () => {
    render(<Search onSearch={() => {}} />);
    // Use getAllByPlaceholderText and check that at least one exists
    expect(
      screen.getAllByPlaceholderText('配信者を検索...').length,
    ).toBeGreaterThan(0);
  });

  // TODO: Fix this test
  // it("入力値が変更された時にonSearchが呼ばれる", async () => {
  //   const onSearch = vi.fn((text: string) => console.log(text));
  //   render(<Search onSearch={onSearch} />);

  //   const input = screen.getAllByPlaceholderText("配信者を検索...")[0];
  //   await userEvent.type(input, "test");

  //   expect(onSearch).toHaveBeenCalledWith("test");
  // });

  it('Enterキーを押した時にonSearchが呼ばれる', async () => {
    const onSearch = vi.fn((text: string) => console.log(text));
    render(<Search onSearch={onSearch} />);

    const input = screen.getAllByPlaceholderText('配信者を検索...')[0];
    await userEvent.type(input, 'test');
    await userEvent.type(input, '{Enter}');

    expect(onSearch).toHaveBeenCalledWith('test');
  });
});
