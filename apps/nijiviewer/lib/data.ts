import { fromPromise } from 'neverthrow';
import { unstable_noStore as noStore } from 'next/cache';

import type { AutocompleteResponse, Channel, Video } from './holodex';
import { baseUrl } from './holodex';

export const fetchLiveVideos = async (org: string): Promise<Video[]> => {
  noStore();
  const params = new URLSearchParams({
    type: 'placeholder,stream',
    include: 'mentions',
    org,
  });
  const response = await fromPromise(
    fetch(`${baseUrl}/live?${params.toString()}`, {
      headers: {
        'x-apikey': process.env.HOLODEX_APIKEY || '',
      },
    }),
    (e: Error) => e,
  );
  if (response.isErr()) {
    return [];
  }
  const videos = await fromPromise<Video[], Error>(
    response.value.json(),
    (e: Error) => e,
  );
  return videos.isOk() ? videos.value : [];
};

export const searchChannels = async (query: string): Promise<Channel[]> => {
  if (!query) {
    return [];
  }
  noStore();
  const params = new URLSearchParams({
    q: query,
    include: 'description',
  });
  const response = await fromPromise(
    fetch(`${baseUrl}/search/autocomplete?${params.toString()}`, {
      headers: {
        'x-apikey': process.env.HOLODEX_APIKEY || '',
      },
    }),
    (e: Error) => e,
  );
  if (response.isErr()) {
    return [];
  }
  const autoCompleteResponses = await fromPromise<
    AutocompleteResponse[],
    Error
  >(response.value.json(), (e: Error) => e);
  if (autoCompleteResponses.isErr()) {
    return [];
  }

  const channelPromises = autoCompleteResponses.value
    .filter((res) => res.type === 'channel')
    .map(async (res) => {
      const response = await fromPromise(
        fetch(`${baseUrl}/channels/${res.value}`, {
          headers: {
            'x-apikey': process.env.HOLODEX_APIKEY || '',
          },
        }),
        (e: Error) => e,
      );
      if (response.isErr()) {
        return undefined;
      }
      const channels = await fromPromise<Channel, Error>(
        response.value.json(),
        (e: Error) => e,
      );
      return channels.isOk() ? channels.value : undefined;
    });

  const results = await Promise.all(channelPromises);
  return results.filter((channel): channel is Channel => channel !== undefined);
};

export const fetchChannelInfo = async (
  channelId: string,
): Promise<Channel | null> => {
  noStore();
  const response = await fromPromise(
    fetch(`${baseUrl}/channels/${channelId}`, {
      headers: {
        'x-apikey': process.env.HOLODEX_APIKEY || '',
      },
    }),
    (e: Error) => e,
  );
  if (response.isErr()) {
    return null;
  }
  const channel = await fromPromise<Channel, Error>(
    response.value.json(),
    (e: Error) => e,
  );
  return channel.isOk() ? channel.value : null;
};

export const fetchChannels = async (
  channelIds: string[],
): Promise<Channel[]> => {
  if (channelIds.length === 0) {
    return [];
  }
  noStore();

  const channelPromises = channelIds.map(async (id) => {
    const response = await fromPromise(
      fetch(`${baseUrl}/channels/${id}`, {
        headers: {
          'x-apikey': process.env.HOLODEX_APIKEY || '',
        },
      }),
      (e: Error) => e,
    );

    if (response.isErr()) {
      return undefined;
    }

    const channel = await fromPromise<Channel, Error>(
      response.value.json(),
      (e: Error) => e,
    );

    return channel.isOk() ? channel.value : undefined;
  });

  const results = await Promise.all(channelPromises);
  return results.filter((channel): channel is Channel => channel !== undefined);
};

/**
 * 指定組織（org）のチャンネル一覧を一括取得する（1+N問題回避用）
 */
export const fetchChannelsByOrg = async (
  org: string,
  options: { limit?: number; offset?: number; type?: string } = {},
): Promise<Channel[]> => {
  const { limit = 100, offset = 0, type = 'vtuber' } = options;
  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
    type,
    org,
    sort: 'suborg',
    order: 'asc',
  });

  const response = await fromPromise(
    fetch(`${baseUrl}/channels?${params.toString()}`, {
      headers: {
        'x-apikey': process.env.HOLODEX_APIKEY || '',
      },
      next: { revalidate: 3600 },
    }),
    (e: Error) => e,
  );

  if (response.isErr()) {
    return [];
  }

  const channels = await fromPromise<Channel[], Error>(
    response.value.json(),
    (e: Error) => e,
  );

  return channels.isOk() && Array.isArray(channels.value) ? channels.value : [];
};

/**
 * 指定組織（org）の全チャンネル一覧を取得する（ページネーションを全件巡回）
 */
export const fetchAllChannelsByOrg = async (
  org: string,
  type = 'vtuber',
): Promise<Channel[]> => {
  const limit = 100;
  let offset = 0;
  const allChannels: Channel[] = [];
  const maxPages = 20;

  for (let page = 0; page < maxPages; page++) {
    const channels = await fetchChannelsByOrg(org, {
      limit,
      offset,
      type,
    });
    if (channels.length === 0) {
      break;
    }
    allChannels.push(...channels);
    if (channels.length < limit) {
      break;
    }
    offset += limit;
  }

  return allChannels;
};

export const fetchUserLiveVideos = async (
  channelIds: string[],
): Promise<Video[]> => {
  if (channelIds.length === 0) {
    return [];
  }
  noStore();
  const params = new URLSearchParams({
    channels: channelIds.join(','),
    includePlaceholder: 'true',
  });

  const url = `${baseUrl}/users/live?${params.toString()}`;

  const response = await fromPromise(
    fetch(url, {
      headers: {
        'x-apikey': process.env.HOLODEX_APIKEY || '',
      },
    }),
    (e: Error) => e,
  );

  if (response.isErr()) {
    return [];
  }

  const videos = await fromPromise<Video[], Error>(
    response.value.json(),
    (e: Error) => e,
  );

  return videos.isOk() && Array.isArray(videos.value) ? videos.value : [];
};
