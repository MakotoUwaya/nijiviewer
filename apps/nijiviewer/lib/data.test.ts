import { http, HttpResponse } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  mockAutocompleteChannel,
  mockChannel,
  mockStreamVideo,
} from '@/test/fixtures/holodex';
import {
  HOLODEX_AUTOCOMPLETE,
  HOLODEX_LIVE,
  HOLODEX_USERS_LIVE,
  holodexChannelUrl,
} from '@/test/msw/factories';
import { server } from '@/test/msw/server';
import {
  fetchChannelInfo,
  fetchChannels,
  fetchLiveVideos,
  fetchUserLiveVideos,
  searchChannels,
} from './data';

describe('lib/data', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('fetchLiveVideos', () => {
    it('returns videos for the requested org', async () => {
      const video = mockStreamVideo({ id: 'live-1' });
      let capturedQuery: URLSearchParams | undefined;
      server.use(
        http.get(HOLODEX_LIVE, ({ request }) => {
          capturedQuery = new URL(request.url).searchParams;
          return HttpResponse.json([video]);
        }),
      );

      const result = await fetchLiveVideos('Nijisanji');
      expect(result).toEqual([video]);
      expect(capturedQuery?.get('org')).toBe('Nijisanji');
      expect(capturedQuery?.get('type')).toBe('placeholder,stream');
    });

    it('returns empty array on network error', async () => {
      server.use(http.get(HOLODEX_LIVE, () => HttpResponse.error()));

      const result = await fetchLiveVideos('Nijisanji');
      expect(result).toEqual([]);
    });

    it('returns empty array on invalid JSON response', async () => {
      server.use(
        http.get(HOLODEX_LIVE, () =>
          HttpResponse.text('not-json', { status: 200 }),
        ),
      );

      const result = await fetchLiveVideos('Nijisanji');
      expect(result).toEqual([]);
    });
  });

  describe('searchChannels', () => {
    it('returns empty array when query is empty', async () => {
      const result = await searchChannels('');
      expect(result).toEqual([]);
    });

    it('returns channels matched by autocomplete', async () => {
      const channelA = mockChannel({ id: 'A' });
      const channelB = mockChannel({ id: 'B' });
      server.use(
        http.get(HOLODEX_AUTOCOMPLETE, () =>
          HttpResponse.json([
            mockAutocompleteChannel({ value: 'A' }),
            mockAutocompleteChannel({ value: 'B' }),
            { type: 'topic', value: 'singing', text: 'Singing' },
          ]),
        ),
        http.get(holodexChannelUrl('A'), () => HttpResponse.json(channelA)),
        http.get(holodexChannelUrl('B'), () => HttpResponse.json(channelB)),
      );

      const result = await searchChannels('hello');
      expect(result).toEqual([channelA, channelB]);
    });

    it('returns empty array on autocomplete network error', async () => {
      server.use(
        http.get(HOLODEX_AUTOCOMPLETE, () => HttpResponse.error()),
      );
      expect(await searchChannels('q')).toEqual([]);
    });

    it('returns empty array on autocomplete invalid JSON', async () => {
      server.use(
        http.get(HOLODEX_AUTOCOMPLETE, () =>
          HttpResponse.text('garbage', { status: 200 }),
        ),
      );
      expect(await searchChannels('q')).toEqual([]);
    });

    it('skips channels whose detail fetch fails', async () => {
      const channelB = mockChannel({ id: 'B' });
      server.use(
        http.get(HOLODEX_AUTOCOMPLETE, () =>
          HttpResponse.json([
            mockAutocompleteChannel({ value: 'A' }),
            mockAutocompleteChannel({ value: 'B' }),
          ]),
        ),
        http.get(holodexChannelUrl('A'), () => HttpResponse.error()),
        http.get(holodexChannelUrl('B'), () => HttpResponse.json(channelB)),
      );

      const result = await searchChannels('hello');
      expect(result).toEqual([channelB]);
    });

    it('skips channels with invalid JSON detail response', async () => {
      const channelA = mockChannel({ id: 'A' });
      server.use(
        http.get(HOLODEX_AUTOCOMPLETE, () =>
          HttpResponse.json([
            mockAutocompleteChannel({ value: 'A' }),
            mockAutocompleteChannel({ value: 'B' }),
          ]),
        ),
        http.get(holodexChannelUrl('A'), () => HttpResponse.json(channelA)),
        http.get(holodexChannelUrl('B'), () =>
          HttpResponse.text('not json', { status: 200 }),
        ),
      );

      const result = await searchChannels('hello');
      expect(result).toEqual([channelA]);
    });
  });

  describe('fetchChannelInfo', () => {
    it('returns the channel on success', async () => {
      const channel = mockChannel({ id: 'C' });
      server.use(
        http.get(holodexChannelUrl('C'), () => HttpResponse.json(channel)),
      );
      expect(await fetchChannelInfo('C')).toEqual(channel);
    });

    it('returns null on network error', async () => {
      server.use(
        http.get(holodexChannelUrl('C'), () => HttpResponse.error()),
      );
      expect(await fetchChannelInfo('C')).toBeNull();
    });

    it('returns null on invalid JSON', async () => {
      server.use(
        http.get(holodexChannelUrl('C'), () =>
          HttpResponse.text('garbage', { status: 200 }),
        ),
      );
      expect(await fetchChannelInfo('C')).toBeNull();
    });
  });

  describe('fetchChannels', () => {
    it('returns empty array when channelIds is empty', async () => {
      expect(await fetchChannels([])).toEqual([]);
    });

    it('fetches multiple channels in parallel and filters out failures', async () => {
      const channelA = mockChannel({ id: 'A' });
      server.use(
        http.get(holodexChannelUrl('A'), () => HttpResponse.json(channelA)),
        http.get(holodexChannelUrl('B'), () => HttpResponse.error()),
      );

      const result = await fetchChannels(['A', 'B']);
      expect(result).toEqual([channelA]);
    });

    it('filters out channels with invalid JSON', async () => {
      const channelA = mockChannel({ id: 'A' });
      server.use(
        http.get(holodexChannelUrl('A'), () => HttpResponse.json(channelA)),
        http.get(holodexChannelUrl('B'), () =>
          HttpResponse.text('garbage', { status: 200 }),
        ),
      );

      const result = await fetchChannels(['A', 'B']);
      expect(result).toEqual([channelA]);
    });
  });

  describe('fetchUserLiveVideos', () => {
    it('returns empty array when channelIds is empty', async () => {
      expect(await fetchUserLiveVideos([])).toEqual([]);
    });

    it('returns videos for the requested channels', async () => {
      const video = mockStreamVideo({ id: 'live-99' });
      let capturedQuery: URLSearchParams | undefined;
      server.use(
        http.get(HOLODEX_USERS_LIVE, ({ request }) => {
          capturedQuery = new URL(request.url).searchParams;
          return HttpResponse.json([video]);
        }),
      );

      const result = await fetchUserLiveVideos(['A', 'B']);
      expect(result).toEqual([video]);
      expect(capturedQuery?.get('channels')).toBe('A,B');
      expect(capturedQuery?.get('includePlaceholder')).toBe('true');
    });

    it('returns empty array on network error', async () => {
      server.use(http.get(HOLODEX_USERS_LIVE, () => HttpResponse.error()));

      expect(await fetchUserLiveVideos(['A'])).toEqual([]);
    });

    it('returns empty array on invalid JSON', async () => {
      server.use(
        http.get(HOLODEX_USERS_LIVE, () =>
          HttpResponse.text('not-json', { status: 200 }),
        ),
      );
      expect(await fetchUserLiveVideos(['A'])).toEqual([]);
    });

    it('returns empty array when response is not an array', async () => {
      server.use(
        http.get(HOLODEX_USERS_LIVE, () => HttpResponse.json({ message: 'ok' })),
      );
      expect(await fetchUserLiveVideos(['A'])).toEqual([]);
    });
  });
});
