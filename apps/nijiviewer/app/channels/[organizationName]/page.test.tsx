import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockChannel } from '@/test/fixtures/holodex';

const { fetchAllChannelsByOrgMock, channelListMock, notFoundMock } = vi.hoisted(
  () => ({
    fetchAllChannelsByOrgMock: vi.fn(),
    channelListMock: vi.fn((..._args: unknown[]) => null),
    notFoundMock: vi.fn(() => {
      throw new Error('NEXT_NOT_FOUND');
    }),
  }),
);

vi.mock('next/navigation', () => ({
  notFound: notFoundMock,
}));

vi.mock('@/lib/data', () => ({
  fetchAllChannelsByOrg: fetchAllChannelsByOrgMock,
}));

vi.mock('@/components/channel-list', () => ({
  default: channelListMock,
}));

import ChannelsPage, { generateMetadata } from './page';

const ctx = (organizationName: string) => ({
  params: Promise.resolve({ organizationName }),
});

describe('Channels [organizationName] page', () => {
  beforeEach(() => {
    fetchAllChannelsByOrgMock.mockReset();
    channelListMock.mockClear();
    notFoundMock.mockClear();
  });

  it('renders ChannelList with fetched data for a valid organization', async () => {
    const channel = mockChannel({ id: 'c1', org: 'Nijisanji' });
    fetchAllChannelsByOrgMock.mockResolvedValue([channel]);

    const tree = await ChannelsPage(ctx('Nijisanji'));
    render(tree);

    expect(fetchAllChannelsByOrgMock).toHaveBeenCalledWith('Nijisanji');
    expect(channelListMock).toHaveBeenCalled();
    expect(channelListMock.mock.calls[0][0]).toMatchObject({
      organization: { id: 'Nijisanji', name: 'にじさんじ' },
      channels: [channel],
    });
  });

  it('handles URL-encoded organizationName correctly', async () => {
    const channel = mockChannel({ id: 'u1', org: 'Uniraid!' });
    fetchAllChannelsByOrgMock.mockResolvedValue([channel]);

    const tree = await ChannelsPage(ctx('Uniraid%21'));
    render(tree);

    expect(fetchAllChannelsByOrgMock).toHaveBeenCalledWith('Uniraid!');
    expect(channelListMock).toHaveBeenCalled();
    expect(channelListMock.mock.calls[0][0]).toMatchObject({
      organization: { id: 'Uniraid!', name: 'ゆにれいど' },
      channels: [channel],
    });
  });

  it('calls notFound when organizationName is unknown', async () => {
    await expect(ChannelsPage(ctx('Unknown'))).rejects.toThrow(
      'NEXT_NOT_FOUND',
    );
    expect(notFoundMock).toHaveBeenCalled();
    expect(fetchAllChannelsByOrgMock).not.toHaveBeenCalled();
  });

  it('generates metadata with organization name', async () => {
    const meta = await generateMetadata(ctx('Nijisanji'));
    expect(meta.title).toBe('にじさんじ チャンネル一覧 | NijiViewer');
    expect(meta.description).toContain('にじさんじ');
  });

  it('generates fallback metadata for unknown organization', async () => {
    const meta = await generateMetadata(ctx('UnknownOrg'));
    expect(meta.title).toBe('チャンネル一覧 | NijiViewer');
  });
});
