import { unstable_noStore as noStore } from 'next/cache';
import type { Video } from './holodex';

const apiVersion = 'v2';
const baseUrl = `https://holodex.net/api/${apiVersion}`;

export const fetchLiveVideos = async (org: string): Promise<Video[]> => {
  noStore();
  const query = new URLSearchParams({
    type: 'placeholder,stream',
    include: 'mentions',
    org,
  });
  const response = await fetch(`${baseUrl}/live?${query.toString()}`, {
    headers: {
      'x-apikey': process.env.HOLODEX_APIKEY || '',
    },
  });
  return (await response.json()) as Video[];
};
