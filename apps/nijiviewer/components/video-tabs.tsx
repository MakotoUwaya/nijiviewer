'use client';

import { Tab, Tabs } from '@heroui/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { Key, ReactNode } from 'react';
import VideoGrid from '@/components/video-grid';
import type { VideoType } from '@/lib/holodex';

interface VideoTabsProps {
  channelId: string;
  initialCategory?: VideoCategory;
}

type VideoCategory = 'videos' | 'clips' | 'collabs';

const categories = [
  {
    key: 'videos',
    label: 'Videos',
    description: '公式チャンネル',
    type: 'past',
  },
  {
    key: 'clips',
    label: 'Clips',
    description: '切り抜き',
    type: 'clips',
  },
  {
    key: 'collabs',
    label: 'Collabs',
    description: 'コラボ出演',
    type: 'collabs',
  },
] as const satisfies {
  key: VideoCategory;
  label: string;
  description: string;
  type: VideoType;
}[];

function isVideoCategory(value: string | null): value is VideoCategory {
  return categories.some((category) => category.key === value);
}

function renderTitle(label: string, description: string): ReactNode {
  return (
    <span className="flex flex-col text-left leading-tight">
      <span>{label}</span>
      <span className="text-xs font-normal text-default-500">
        {description}
      </span>
    </span>
  );
}

export default function VideoTabs({
  channelId,
  initialCategory = 'videos',
}: VideoTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requestedCategory = searchParams.get('category');
  const selectedCategory = isVideoCategory(requestedCategory)
    ? requestedCategory
    : initialCategory;

  const onSelectionChange = (key: Key) => {
    const nextCategory = String(key);

    if (!isVideoCategory(nextCategory)) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set('category', nextCategory);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <section className="w-full">
      <Tabs
        aria-label="Video types"
        classNames={{
          base: 'w-full',
          tabList:
            'w-full gap-1 rounded-md border border-default-200 bg-default-50 p-1',
          cursor: 'rounded-sm',
          tab: 'h-auto flex-1 px-3 py-2',
          tabContent: 'group-data-[selected=true]:text-primary',
          panel: 'px-0 pt-4',
        }}
        selectedKey={selectedCategory}
        onSelectionChange={onSelectionChange}
        className="w-full"
      >
        {categories.map((category) => (
          <Tab
            key={category.key}
            title={renderTitle(category.label, category.description)}
          >
            <VideoGrid channelId={channelId} type={category.type} />
          </Tab>
        ))}
      </Tabs>
    </section>
  );
}
