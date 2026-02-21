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
