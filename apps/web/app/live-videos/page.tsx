import OrgSelector from '@/components/org-selector';
import Videos from '@/components/videos';
import { Suspense, useState } from 'react';
import { fetchLiveVideos } from '../../lib/data';

export default async function LiveVideosPage(): Promise<JSX.Element> {
  const liveVideos = await fetchLiveVideos('Nijisanji');
  console.log(liveVideos);
  return (
    <div className='flex-col'>
      <div className='flex justify-center'>
        <OrgSelector />
      </div>
      <Suspense fallback={<div>loading...</div>}>
        <Videos videos={liveVideos} />
      </Suspense>
    </div>
  );
}
