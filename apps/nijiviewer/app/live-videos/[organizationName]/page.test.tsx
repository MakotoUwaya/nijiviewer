import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockStreamVideo } from '@/test/fixtures/holodex';

const { fetchLiveVideosMock, videosMock } = vi.hoisted(() => ({
  fetchLiveVideosMock: vi.fn(),
  videosMock: vi.fn(() => null),
}));

vi.mock('@/lib/data', () => ({
  fetchLiveVideos: fetchLiveVideosMock,
}));

vi.mock('@/components/videos', () => ({
  default: videosMock,
}));

import LiveVideosPage from './page';

const ctx = (organizationName: string) => ({
  params: Promise.resolve({ organizationName }),
});

describe('LiveVideos [organizationName] page', () => {
  beforeEach(() => {
    fetchLiveVideosMock.mockReset();
    videosMock.mockClear();
  });

  it('renders Videos with fetched data for a valid organization', async () => {
    const video = mockStreamVideo({ id: 'v1' });
    fetchLiveVideosMock.mockResolvedValue([video]);

    const tree = await LiveVideosPage(ctx('Nijisanji'));
    render(tree);

    expect(fetchLiveVideosMock).toHaveBeenCalledWith('Nijisanji');
    expect(videosMock).toHaveBeenCalled();
    expect(videosMock.mock.calls[0][0]).toEqual({ videos: [video] });
  });

  it('returns "Request Error" when organizationName is unknown', async () => {
    const tree = await LiveVideosPage(ctx('Unknown'));
    render(tree);

    expect(screen.getByText('Request Error')).toBeInTheDocument();
    expect(fetchLiveVideosMock).not.toHaveBeenCalled();
  });

  it('returns "Request Error" when organizationName is empty', async () => {
    const tree = await LiveVideosPage(ctx(''));
    render(tree);

    expect(screen.getByText('Request Error')).toBeInTheDocument();
    expect(fetchLiveVideosMock).not.toHaveBeenCalled();
  });
});
