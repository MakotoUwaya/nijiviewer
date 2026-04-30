import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockChannel } from '@/test/fixtures/holodex';

const { searchChannelsMock, searchResultListMock } = vi.hoisted(() => ({
  searchChannelsMock: vi.fn(),
  searchResultListMock: vi.fn(() => null),
}));

vi.mock('@/lib/data', () => ({
  searchChannels: searchChannelsMock,
}));

vi.mock('@/components/search-result', () => ({
  SearchResultList: searchResultListMock,
}));

import LiverSearchPage from './page';

const ctx = (q?: string) => ({
  searchParams: Promise.resolve(q === undefined ? {} : { q }),
});

describe('LiverSearchPage', () => {
  beforeEach(() => {
    searchChannelsMock.mockReset();
    searchResultListMock.mockClear();
  });

  it('renders only the title when q is empty', async () => {
    searchChannelsMock.mockResolvedValue([]);

    const tree = await LiverSearchPage(ctx() as Parameters<typeof LiverSearchPage>[0]);
    render(tree);

    expect(screen.getByRole('heading', { name: 'Liver List' })).toBeInTheDocument();
    expect(screen.queryByText(/Search Results for/)).not.toBeInTheDocument();
    expect(searchResultListMock).not.toHaveBeenCalled();
  });

  it('renders "No livers found" when search returns empty', async () => {
    searchChannelsMock.mockResolvedValue([]);

    const tree = await LiverSearchPage(ctx('foo'));
    render(tree);

    expect(searchChannelsMock).toHaveBeenCalledWith('foo');
    expect(screen.getByText('Search Results for "foo"')).toBeInTheDocument();
    expect(screen.getByText('No livers found')).toBeInTheDocument();
    expect(searchResultListMock).not.toHaveBeenCalled();
  });

  it('renders SearchResultList when channels are returned', async () => {
    const channel = mockChannel();
    searchChannelsMock.mockResolvedValue([channel]);

    const tree = await LiverSearchPage(ctx('foo'));
    render(tree);

    expect(searchResultListMock).toHaveBeenCalled();
    expect(searchResultListMock.mock.calls[0][0]).toEqual({ channels: [channel] });
  });
});
