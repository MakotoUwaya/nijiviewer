import { notFound } from 'next/navigation';
import type { JSX } from 'react';
import LiverProfile from '@/components/liver-profile';
import VideoTabs from '@/components/video-tabs';
import { fetchChannelInfo } from '@/lib/data';

type Props = {
  params: Promise<{ channelId: string }>;
};

export default async function LiverPage({
  params,
}: Props): Promise<JSX.Element> {
  const { channelId } = await params;

  if (!channelId) {
    notFound();
  }

  const channel = await fetchChannelInfo(channelId);

  if (!channel) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <LiverProfile channel={channel} />
      <div className="mt-8">
        <VideoTabs channelId={channelId} />
      </div>
    </div>
  );
}
