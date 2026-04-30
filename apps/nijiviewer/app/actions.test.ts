import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockChannel, mockStreamVideo } from '@/test/fixtures/holodex';

const { fetchChannelsMock, fetchUserLiveVideosMock } = vi.hoisted(() => ({
  fetchChannelsMock: vi.fn(),
  fetchUserLiveVideosMock: vi.fn(),
}));

vi.mock('@/lib/data', () => ({
  fetchChannels: fetchChannelsMock,
  fetchUserLiveVideos: fetchUserLiveVideosMock,
}));

import { getChannelsAction, getFavoritesLiveVideosAction } from './actions';

describe('app/actions', () => {
  beforeEach(() => {
    fetchChannelsMock.mockReset();
    fetchUserLiveVideosMock.mockReset();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getChannelsAction', () => {
    it('returns [] for empty input without calling fetchChannels', async () => {
      await expect(getChannelsAction([])).resolves.toEqual([]);
      expect(fetchChannelsMock).not.toHaveBeenCalled();
    });

    it('returns [] when ids is null/undefined-like', async () => {
      await expect(
        getChannelsAction(undefined as unknown as string[]),
      ).resolves.toEqual([]);
      expect(fetchChannelsMock).not.toHaveBeenCalled();
    });

    it('forwards non-empty ids to fetchChannels', async () => {
      const channel = mockChannel({ id: 'c-1' });
      fetchChannelsMock.mockResolvedValue([channel]);

      await expect(getChannelsAction(['c-1'])).resolves.toEqual([channel]);
      expect(fetchChannelsMock).toHaveBeenCalledWith(['c-1']);
    });
  });

  describe('getFavoritesLiveVideosAction', () => {
    it('returns [] for empty input without calling fetchUserLiveVideos', async () => {
      await expect(getFavoritesLiveVideosAction([])).resolves.toEqual([]);
      expect(fetchUserLiveVideosMock).not.toHaveBeenCalled();
    });

    it('returns [] when ids is null/undefined-like', async () => {
      await expect(
        getFavoritesLiveVideosAction(undefined as unknown as string[]),
      ).resolves.toEqual([]);
      expect(fetchUserLiveVideosMock).not.toHaveBeenCalled();
    });

    it('forwards non-empty ids to fetchUserLiveVideos', async () => {
      const video = mockStreamVideo({ id: 'v-1' });
      fetchUserLiveVideosMock.mockResolvedValue([video]);

      await expect(getFavoritesLiveVideosAction(['c-1'])).resolves.toEqual([
        video,
      ]);
      expect(fetchUserLiveVideosMock).toHaveBeenCalledWith(['c-1']);
    });
  });
});
