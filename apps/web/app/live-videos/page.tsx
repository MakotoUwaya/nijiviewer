'use client';

import OrgSelector from '@/components/org-selector';
import Videos from '@/components/videos';
import { Spinner } from '@nextui-org/react';
import { useEffect, useState } from 'react';

import { organizations } from '@/consts/organizations';
import type { Organization, Video } from '@/lib/holodex';

export default function LiveVideosPage(): JSX.Element {
  const [organization, setOrganization] = useState(organizations[0]);
  const [isLoading, setIsLoadingOrganization] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    setIsLoadingOrganization(true);
    fetch(`/api/video/${organization.id}`)
      .then(data => data.json())
      .then((data) => {
        setVideos(data)
      })
      .catch(e => {
        console.error(e);
      })
      .finally(() => setIsLoadingOrganization(false));
  }, [organization]);

  const onChangeOrganization = (organization: Organization) => {
    setOrganization(organization);
  };
  if (isLoading) {
    return <Spinner label="Loading..." size="lg" />;
  }
  return (
    <div className='flex-col w-full'>
      <div className='flex justify-center'>
        <OrgSelector items={organizations} defaultSelectedKeys={[organization.id]} onChange={onChangeOrganization} />
      </div>
      <Videos videos={videos} />
    </div>
  );
}
