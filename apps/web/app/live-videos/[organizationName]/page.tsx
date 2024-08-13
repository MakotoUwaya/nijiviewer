import Videos from '@/components/videos';
import { organizationMap } from '@/const/organizations';
import { fetchLiveVideos } from '@/lib/data';
import type { Video } from '@/lib/holodex';

type Props = {
  params: { organizationName: string };
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
  const organizationName = params.organizationName;
  if (!isValidOrganizationName(organizationName)) {
    return <>Request Error</>;
  }
  const videos: Video[] = await fetchLiveVideos(organizationName);
  return (
    <div className='flex-col w-full'>
      <Videos videos={videos} />
    </div>
  );
}
