import { fromPromise } from 'neverthrow';
import { unstable_noStore as noStore } from 'next/cache';
import { supabase } from './supabase';

import type { AutocompleteResponse, Channel, Video } from './holodex';

const apiVersion = 'v2';
const baseUrl = `https://holodex.net/api/${apiVersion}`;

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

// 検索履歴をSupabaseに保存する関数
export const saveSearchHistory = async (
  searchWord: string,
  resultCount: number,
  userId?: string,
): Promise<void> => {
  // 検索結果が0件の場合は保存しない
  if (resultCount <= 0) {
    return;
  }

  // ユーザーIDがない場合（未ログイン）は保存しない
  if (!userId) {
    return;
  }

  try {
    const now = new Date().toISOString();
    const { error } = await supabase.from('liver_search_history').insert({
      created_at: now,
      creator_id: userId,
      modified_at: now,
      modifier_id: userId,
      search_word: searchWord,
      result_count: resultCount,
    });

    if (error) {
      console.error('検索履歴の保存に失敗しました:', error);
      return;
    }
  } catch (err) {
    console.error('検索履歴の保存中にエラーが発生しました:', err);
  }
};
