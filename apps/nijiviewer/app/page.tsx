import type { JSX } from 'react';

import { HomeContent } from '@/components/home-content';
import { fetchLiveVideos } from '@/lib/data';

export default async function Home(): Promise<JSX.Element> {
  const allVideos = await fetchLiveVideos('Nijisanji');
  const liveVideos = allVideos
    .filter((video) => video.status === 'live')
    .sort(
      (a, b) =>
        ('live_viewers' in b ? b.live_viewers : 0) -
        ('live_viewers' in a ? a.live_viewers : 0),
    )
    .slice(0, 3);

  return <HomeContent liveVideos={liveVideos} />;
}
