import { notFound } from 'next/navigation';
import type { JSX } from 'react';
import LiverProfile from '@/components/liver-profile';
import VideoTabs from '@/components/video-tabs';
import { fetchChannelInfo } from '@/lib/data';

type Props = {
  params: Promise<{ channelId: string }>;
  searchParams?: Promise<{ category?: string | string[] }>;
};

const videoCategories = ['videos', 'clips', 'collabs'] as const;

type VideoCategory = (typeof videoCategories)[number];

function parseVideoCategory(category?: string | string[]): VideoCategory {
  const value = Array.isArray(category) ? category[0] : category;

  return videoCategories.find((item) => item === value) ?? 'videos';
}

export default async function LiverPage({
  params,
  searchParams,
}: Props): Promise<JSX.Element> {
  const { channelId } = await params;
  const { category } = (await searchParams) ?? {};

  if (!channelId) {
    notFound();
  }

  const channel = await fetchChannelInfo(channelId);

  if (!channel) {
    notFound();
  }

  return (
    <section className="flex flex-col w-full gap-4 p-4">
      <LiverProfile channel={channel} />
      <div className="mt-4">
        <VideoTabs
          channelId={channelId}
          initialCategory={parseVideoCategory(category)}
        />
      </div>
    </section>
  );
}
