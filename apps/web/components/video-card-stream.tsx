'use client';

import {
  Card,
  CardFooter,
  CardHeader,
  Chip,
  Image,
  Spinner,
  Tooltip,
  User,
} from '@heroui/react';
import { SignalIcon } from '@heroicons/react/24/solid';
import { usePathname, useRouter } from 'next/navigation';
import type { JSX, MouseEvent } from 'react';
import { useState, useTransition } from 'react';
import { useYouTubePlayer } from '@/hooks/useYouTubePlayerContext';
import type { StreamVideo } from '@/lib/holodex';
import {
  formatVideoDuration,
  getStarted,
  getVideoStatusText,
} from '@/lib/holodex';
import { getImageUrl } from '@/lib/image-utils';
import { sendVideoPlayEvent } from '@/metrics/events';
import YouTubePlayerModal from './youtube-player-modal';

export default function VideoCardStream(
  video: StreamVideo & { started: boolean },
): JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
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
  const isPast = video.status === 'past';
  const videoStatusText = isPast
    ? getStarted(video.available_at || '')
    : video.started
      ? `${viewersCount}Started streaming ${getStarted(video.start_actual)}`
      : getVideoStatusText(video.start_scheduled);
  const liverChannelPath = `/liver/${video.channel.id}`;

  const handleVideoClick = (e: MouseEvent) => {
    e.preventDefault();
    if (!isYouTubeVideo || isYouTubePlayer) {
      sendVideoPlayEvent(video, 'youtube');
      window.open(
        `https://www.youtube.com/watch?v=${video.id}`,
        '_blank',
        'noopener,noreferrer',
      );
    } else {
      sendVideoPlayEvent(video, 'in-app');
      setIsModalOpen(true);
    }
  };

  const handleChannelClick = () => {
    if (pathname === liverChannelPath) {
      return;
    }
    startTransition(() => {
      router.push(liverChannelPath);
    });
  };

  const handleChannelHover = () => {
    if (pathname === liverChannelPath) {
      return;
    }
    // ホバー時にページをプリフェッチして遷移を高速化
    router.prefetch(liverChannelPath);
  };

  return (
    <div className="p-2 w-full md:w-[33%] xl:w-[20%]">
      <Card>
        <CardHeader className="absolute z-20 p-1 flex-col items-start">
          <Chip color="default" radius="sm" size="sm" variant="faded">
            {video.topic_id ? video.topic_id.replace(/_/g, ' ') : video.type}
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
            {video.status === 'live' ? (
              <div className="absolute bottom-1 right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded z-20 flex items-center gap-1">
                <SignalIcon className="w-3 h-3" />
                <span className="font-bold">LIVE</span>
              </div>
            ) : (
              video.duration > 0 && (
                <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded z-20">
                  {formatVideoDuration(video.duration)}
                </div>
              )
            )}
          </div>
        </button>
        <CardFooter className="bottom-0 p-0 z-10">
          <div className="flex flex-col w-full px-1">
            <p className="text-tiny break-words line-clamp-2 h-[32px] my-1">
              {video.title}
            </p>
            <div className="relative">
              <button
                type="button"
                onMouseEnter={handleChannelHover}
                onClick={handleChannelClick}
                className="cursor-pointer bg-transparent border-none p-0 w-full text-left"
                aria-label={`${video.channel.name}のチャンネルページに移動`}
              >
                <User
                  avatarProps={{
                    src: getImageUrl(video.channel.photo),
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
              </button>
              {isPending && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-medium">
                  <Spinner color="primary" size="sm" />
                </div>
              )}
            </div>
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
