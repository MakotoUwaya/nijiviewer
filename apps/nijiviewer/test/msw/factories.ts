import { baseUrl } from '@/lib/holodex';

export const HOLODEX_BASE = baseUrl;

export const HOLODEX_LIVE = `${HOLODEX_BASE}/live`;
export const HOLODEX_USERS_LIVE = `${HOLODEX_BASE}/users/live`;
export const HOLODEX_AUTOCOMPLETE = `${HOLODEX_BASE}/search/autocomplete`;
export const holodexChannelUrl = (channelId: string) =>
  `${HOLODEX_BASE}/channels/${channelId}`;
