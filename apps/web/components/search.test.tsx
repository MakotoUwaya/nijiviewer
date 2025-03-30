import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Search } from './search';

describe('Search', () => {
  it('displays the search box', () => {
    render(<Search onSearch={() => {}} />);
    // Use getAllByPlaceholderText and check that at least one exists
    expect(
      screen.getAllByPlaceholderText('Search Liver Name...').length,
    ).toBeGreaterThan(0);
  });

  // TODO: Fix this test
  // it("calls onSearch when input value changes", async () => {
  //   const onSearch = vi.fn((text: string) => console.log(text));
  //   render(<Search onSearch={onSearch} />);

  //   const input = screen.getAllByPlaceholderText("Search Liver Name...")[0];
  //   await userEvent.type(input, "test");

  //   expect(onSearch).toHaveBeenCalledWith("test");
  // });

  it('calls onSearch when Enter key is pressed', async () => {
    const onSearch = vi.fn((text: string) => console.log(text));
    render(<Search onSearch={onSearch} />);

    const input = screen.getAllByPlaceholderText('Search Liver Name...')[0];
    await userEvent.type(input, 'test');
    await userEvent.type(input, '{Enter}');

    expect(onSearch).toHaveBeenCalledWith('test');
  });
});
