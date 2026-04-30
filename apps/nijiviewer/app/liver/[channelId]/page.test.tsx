import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockChannel } from '@/test/fixtures/holodex';

const { fetchChannelInfoMock, notFoundMock, liverProfileMock, videoTabsMock } =
  vi.hoisted(() => ({
    fetchChannelInfoMock: vi.fn(),
    notFoundMock: vi.fn(() => {
      throw new Error('NEXT_NOT_FOUND');
    }),
    liverProfileMock: vi.fn(() => null),
    videoTabsMock: vi.fn(() => null),
  }));

vi.mock('@/lib/data', () => ({
  fetchChannelInfo: fetchChannelInfoMock,
}));

vi.mock('next/navigation', async () => {
  const actual = await vi.importActual<typeof import('next/navigation')>(
    'next/navigation',
  );
  return {
    ...actual,
    notFound: notFoundMock,
  };
});

vi.mock('@/components/liver-profile', () => ({
  default: liverProfileMock,
}));

vi.mock('@/components/video-tabs', () => ({
  default: videoTabsMock,
}));

import LiverPage from './page';

const ctx = (channelId: string) => ({
  params: Promise.resolve({ channelId }),
});

describe('LiverPage', () => {
  beforeEach(() => {
    fetchChannelInfoMock.mockReset();
    notFoundMock.mockClear();
    liverProfileMock.mockClear();
    videoTabsMock.mockClear();
  });

  it('renders profile and tabs when the channel is found', async () => {
    const channel = mockChannel({ id: 'C-1' });
    fetchChannelInfoMock.mockResolvedValue(channel);

    const tree = await LiverPage(ctx('C-1'));
    render(tree);

    expect(fetchChannelInfoMock).toHaveBeenCalledWith('C-1');
    expect(liverProfileMock).toHaveBeenCalled();
    expect(liverProfileMock.mock.calls[0][0]).toEqual({ channel });
    expect(videoTabsMock).toHaveBeenCalled();
    expect(videoTabsMock.mock.calls[0][0]).toEqual({ channelId: 'C-1' });
    expect(notFoundMock).not.toHaveBeenCalled();
  });

  it('calls notFound when channelId is empty', async () => {
    await expect(LiverPage(ctx(''))).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFoundMock).toHaveBeenCalled();
    expect(fetchChannelInfoMock).not.toHaveBeenCalled();
  });

  it('calls notFound when fetchChannelInfo returns null', async () => {
    fetchChannelInfoMock.mockResolvedValue(null);

    await expect(LiverPage(ctx('missing'))).rejects.toThrow('NEXT_NOT_FOUND');
    expect(fetchChannelInfoMock).toHaveBeenCalledWith('missing');
    expect(notFoundMock).toHaveBeenCalled();
  });
});
