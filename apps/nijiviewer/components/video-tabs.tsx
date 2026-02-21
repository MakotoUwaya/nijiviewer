'use client';

import { Tab, Tabs } from '@heroui/react';
import { useState } from 'react';
import VideoGrid from '@/components/video-grid';

interface VideoTabsProps {
  channelId: string;
}

export default function VideoTabs({ channelId }: VideoTabsProps) {
  const [selectedTab, setSelectedTab] = useState('live');

  return (
    <div className="w-full">
      <Tabs
        aria-label="Video types"
        selectedKey={selectedTab}
        onSelectionChange={(key) => setSelectedTab(key as string)}
        className="w-full"
      >
        <Tab key="videos" title="Videos">
          <VideoGrid channelId={channelId} type="past" />
        </Tab>
        <Tab key="clips" title="Clips">
          <VideoGrid channelId={channelId} type="clips" />
        </Tab>
        <Tab key="collabs" title="Collabs">
          <VideoGrid channelId={channelId} type="collabs" />
        </Tab>
      </Tabs>
    </div>
  );
}
