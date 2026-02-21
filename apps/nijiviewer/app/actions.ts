'use server';

import { fetchChannels, fetchUserLiveVideos } from '@/lib/data';
import type { Channel, Video } from '@/lib/holodex';

export async function getChannelsAction(ids: string[]): Promise<Channel[]> {
  if (!ids || ids.length === 0) return [];
  return await fetchChannels(ids);
}

export async function getFavoritesLiveVideosAction(
  ids: string[],
): Promise<Video[]> {
  if (!ids || ids.length === 0) return [];
  return await fetchUserLiveVideos(ids);
}
