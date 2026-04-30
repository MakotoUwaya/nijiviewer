import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  mockPlaceholderVideo,
  mockStreamVideo,
} from '@/test/fixtures/holodex';

const { fetchLiveVideosMock, homeContentMock } = vi.hoisted(() => ({
  fetchLiveVideosMock: vi.fn(),
  homeContentMock: vi.fn(() => null),
}));

vi.mock('@/lib/data', () => ({
  fetchLiveVideos: fetchLiveVideosMock,
}));

vi.mock('@/components/home-content', () => ({
  HomeContent: homeContentMock,
}));

import Home from './page';

describe('Home page (app/page.tsx)', () => {
  beforeEach(() => {
    fetchLiveVideosMock.mockReset();
    homeContentMock.mockClear();
  });

  it('fetches live videos for Nijisanji, keeps only top 3 live by viewers', async () => {
    const live1 = mockStreamVideo({ id: 'v1', status: 'live', live_viewers: 100 });
    const live2 = mockStreamVideo({ id: 'v2', status: 'live', live_viewers: 500 });
    const live3 = mockStreamVideo({ id: 'v3', status: 'live', live_viewers: 300 });
    const live4 = mockStreamVideo({ id: 'v4', status: 'live', live_viewers: 50 });
    const upcoming = mockPlaceholderVideo({ id: 'u1' });

    fetchLiveVideosMock.mockResolvedValue([upcoming, live1, live2, live3, live4]);

    const tree = await Home();
    const { render } = await import('@testing-library/react');
    render(tree);

    expect(fetchLiveVideosMock).toHaveBeenCalledWith('Nijisanji');
    expect(homeContentMock).toHaveBeenCalled();
    const [propsArg] = homeContentMock.mock.calls[0];
    expect(propsArg.liveVideos).toEqual([live2, live3, live1]);
  });

  it('treats videos without live_viewers as 0 when sorting', async () => {
    // Three videos, two missing live_viewers, force sort to compare both branches.
    const live1 = mockStreamVideo({ id: 'v1', status: 'live' });
    delete (live1 as { live_viewers?: number }).live_viewers;
    const live2 = mockStreamVideo({ id: 'v2', status: 'live', live_viewers: 10 });
    const live3 = mockStreamVideo({ id: 'v3', status: 'live' });
    delete (live3 as { live_viewers?: number }).live_viewers;

    fetchLiveVideosMock.mockResolvedValue([live1, live2, live3]);

    const tree = await Home();
    const { render } = await import('@testing-library/react');
    render(tree);

    const [propsArg] = homeContentMock.mock.calls[0];
    // v2 (10) ranks first; the two zero-viewer entries follow.
    expect(propsArg.liveVideos[0].id).toBe('v2');
    expect(propsArg.liveVideos.map((v: { id: string }) => v.id).slice(1).sort()).toEqual([
      'v1',
      'v3',
    ]);
  });

  it('passes an empty array when there are no live videos', async () => {
    fetchLiveVideosMock.mockResolvedValue([mockPlaceholderVideo()]);

    const tree = await Home();
    const { render } = await import('@testing-library/react');
    render(tree);

    const [propsArg] = homeContentMock.mock.calls[0];
    expect(propsArg.liveVideos).toEqual([]);
  });
});
