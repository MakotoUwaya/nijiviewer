'use client';

import { useYouTubePlayer } from '@/hooks/useYouTubePlayerContext';
import type { StreamVideo } from '@/lib/holodex';
import { getImageUrl } from '@/lib/image-utils';
import {
  Card,
  CardFooter,
  CardHeader,
  Chip,
  Image,
  Tooltip,
  User,
} from '@heroui/react';
import { DateTime } from 'luxon';
import { useState } from 'react';
import type { JSX, MouseEvent } from 'react';
import YouTubePlayerModal from './youtube-player-modal';

const getStarted = (target: string | undefined): string => {
  if (!target) {
    return '';
  }
  const targetDateTime = DateTime.fromISO(target);
  return targetDateTime.toRelative() || '';
};

export default function VideoCardStream(
  video: StreamVideo & { started: boolean },
): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isYouTubePlayer } = useYouTubePlayer();
  // YouTubeの動画IDの形式であれば、YouTubeの動画として扱う
  const isYouTubeVideo = /^[a-zA-Z0-9_-]{11}$/.test(video.id || '');

  const channelDescription = `${video.channel.org}${
    video.channel.suborg ? ` / ${video.channel.suborg.substring(2)}` : ''
  }`;
  const canShowViewer = video.topic_id !== 'membersonly';
  const viewersCount = canShowViewer
    ? `${video.live_viewers?.toLocaleString() || ''} watching now `
    : '';
  const videoStatusText = video.started
    ? `${viewersCount}Started streaming ${getStarted(video.start_actual || '')}`
    : 'Will probably start soon';

  const handleVideoClick = (e: MouseEvent) => {
    e.preventDefault();
    if (!isYouTubeVideo || isYouTubePlayer) {
      window.open(
        `https://www.youtube.com/watch?v=${video.id}`,
        '_blank',
        'noopener,noreferrer',
      );
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="p-2 w-full md:w-[33%] xl:w-[20%]">
      <Card>
        <CardHeader className="absolute z-10 p-1 flex-col items-start">
          <Chip color="default" radius="sm" size="sm" variant="faded">
            {video.topic_id || video.type}
          </Chip>
        </CardHeader>
        <button
          type="button"
          onClick={handleVideoClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleVideoClick(e as unknown as MouseEvent);
            }
          }}
          className="cursor-pointer w-full bg-transparent border-none p-0"
        >
          <div className="relative w-full aspect-video">
            <Image
              alt={video.title}
              className="absolute top-0 left-0 w-full h-full object-cover"
              removeWrapper
              radius="none"
              src={getImageUrl(
                `https://i.ytimg.com/vi/${video.id}/sddefault.jpg`,
              )}
              crossOrigin="anonymous"
            />
          </div>
        </button>
        <CardFooter className="bottom-0 p-0 z-10">
          <div className="flex flex-col w-full px-1">
            <p className="text-tiny break-words line-clamp-2 h-[32px] my-1">
              {video.title}
            </p>
            <User
              avatarProps={{
                src: video.channel.photo,
                className: 'min-w-10',
              }}
              classNames={{
                base: 'self-start',
                name: 'line-clamp-1',
                description: 'line-clamp-1',
              }}
              description={channelDescription}
              name={video.channel.name}
            />
            <Tooltip
              content={videoStatusText}
              delay={1000}
              placement="bottom-start"
              size="sm"
            >
              <p className="text-tiny p-1 truncate">{videoStatusText}</p>
            </Tooltip>
          </div>
        </CardFooter>
      </Card>
      {isYouTubeVideo && (
        <YouTubePlayerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          videoId={video.id}
        />
      )}
    </div>
  );
}
