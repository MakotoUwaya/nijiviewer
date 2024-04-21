'use client';

import OrgSelector from '@/components/org-selector';
import Videos from '@/components/videos';
import { Suspense, useEffect, useState } from 'react';

import { organizations } from '@/consts/organizations';
import type { Organization, Video } from '@/lib/holodex';

export default function LiveVideosPage(): JSX.Element {
  const [organization, setOrganization] = useState(organizations[0]);
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    fetch(`/api/video/${organization.id}`)
      .then(data => data.json())
      .then((data) => {
        setVideos(data)
      })
      .catch(e => {
        console.error(e);
      })
  }, [organization]);

  const onChangeOrganization = (organization: Organization) => {
    setOrganization(organization);
  };
  return (
    <div className='flex-col'>
      <div className='flex justify-center'>
        <OrgSelector items={organizations} defaultSelectedKeys={[organization.id]} onChange={onChangeOrganization} />
      </div>
      <Suspense fallback={<div>loading...</div>}>
        <Videos videos={videos} />
      </Suspense>
    </div>
  );
}
