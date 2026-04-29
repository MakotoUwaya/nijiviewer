import type {
  AutocompleteResponse,
  Channel,
  ClipVideo,
  PlaceholderVideo,
  StreamVideo,
} from '@/lib/holodex';

export function mockChannel(overrides: Partial<Channel> = {}): Channel {
  return {
    id: 'channel-1',
    name: 'Channel One',
    org: 'Nijisanji',
    type: 'vtuber',
    photo: 'https://example.com/channel-1.png',
    english_name: 'Channel One',
    ...overrides,
  };
}

export function mockStreamVideo(
  overrides: Partial<StreamVideo> = {},
): StreamVideo {
  return {
    id: 'video-1',
    title: 'Live Stream Title',
    type: 'stream',
    topic_id: 'singing',
    published_at: '2024-08-15T08:00:00.000Z',
    available_at: '2024-08-15T09:00:00.000Z',
    start_scheduled: '2024-08-15T09:00:00.000Z',
    duration: 0,
    status: 'live',
    live_viewers: 1000,
    channel: mockChannel(),
    ...overrides,
  } as StreamVideo;
}

export function mockClipVideo(overrides: Partial<ClipVideo> = {}): ClipVideo {
  return {
    id: 'clip-1',
    title: 'Funny clip',
    type: 'clip',
    lang: 'ja',
    published_at: '2024-08-10T00:00:00.000Z',
    available_at: '2024-08-10T00:00:00.000Z',
    duration: 120,
    status: 'past',
    channel: mockChannel(),
    ...overrides,
  } as ClipVideo;
}

export function mockPlaceholderVideo(
  overrides: Partial<PlaceholderVideo> = {},
): PlaceholderVideo {
  return {
    id: 'placeholder-1',
    title: 'Upcoming event',
    type: 'placeholder',
    topic_id: 'event',
    start_scheduled: '2024-08-20T10:00:00.000Z',
    link: 'https://example.com/event',
    published_at: '2024-08-15T00:00:00.000Z',
    available_at: '2024-08-20T10:00:00.000Z',
    duration: 0,
    status: 'upcoming',
    channel: mockChannel(),
    credits: {},
    certainty: 'certain',
    thumbnail: 'https://example.com/thumb.png',
    placeholderType: 'external-stream',
    ...overrides,
  } as PlaceholderVideo;
}

export function mockAutocompleteChannel(
  overrides: Partial<AutocompleteResponse> = {},
): AutocompleteResponse {
  return {
    type: 'channel',
    value: 'channel-1',
    text: 'Channel One',
    ...overrides,
  };
}
