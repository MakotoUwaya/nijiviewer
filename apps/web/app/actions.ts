'use server';

import { fetchChannels } from '@/lib/data';
import type { Channel } from '@/lib/holodex';

export async function getChannelsAction(ids: string[]): Promise<Channel[]> {
  if (!ids || ids.length === 0) return [];
  return await fetchChannels(ids);
}
