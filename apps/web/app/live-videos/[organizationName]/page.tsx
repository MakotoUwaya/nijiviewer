import type { JSX } from 'react';

import Videos from '@/components/videos';
import { organizationMap } from '@/const/organizations';
import { fetchLiveVideos } from '@/lib/data';

type Props = {
  params: Promise<{ organizationName: string }>;
};

const isValidOrganizationName = (organizationName: string): boolean => {
  return (
    !!organizationName &&
    !!organizationMap.find((o) => o.id === decodeURIComponent(organizationName))
  );
};

export default async function LiveVideosPage({
  params,
}: Props): Promise<JSX.Element> {
  const { organizationName } = await params;
  if (!isValidOrganizationName(organizationName)) {
    return <>Request Error</>;
  }
  const videos = await fetchLiveVideos(organizationName);
  return (
    <div className="w-full">
      <Videos videos={videos} />
    </div>
  );
}
