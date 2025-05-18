'use client';

import type { PlaceholderVideo } from '@/lib/holodex';
import { getImageUrl } from '@/lib/image-utils';
import { Card, CardFooter, CardHeader, Chip, Image, User } from '@heroui/react';
import { DateTime } from 'luxon';
import type { JSX } from 'react';

const getDomain = (url: string): string => {
  return new URL(url).hostname;
};

const getStarted = (target: string | undefined): string => {
  if (!target) {
    return '';
  }
  const targetDateTime = DateTime.fromISO(target);
  return targetDateTime.toRelative() || '';
};

export default function VideoCardPlaceholder(
  video: PlaceholderVideo & { started: boolean },
): JSX.Element {
  const channelDescription = `${video.channel.org}${
    video.channel.suborg ? ` / ${video.channel.suborg.substring(2)}` : ''
  }`;
  const videoStatusText = video.started
    ? `Live - ${getDomain(video.link)} Started streaming ${getStarted(video.start_actual)}`
    : 'Will probably start soon';
  return (
    <div className="p-2 w-full md:w-[33%] xl:w-[20%]">
      <Card>
        <CardHeader className="absolute z-10 p-1 flex-col items-start">
          <Chip color="default" radius="sm" size="sm" variant="faded">
            {video.topic_id || video.type}
          </Chip>
        </CardHeader>
        <a href={video.link} rel="noopener noreferrer" target="_blank">
          <div className="relative w-full aspect-video">
            <Image
              alt={video.jp_name || video.title}
              className="absolute top-0 left-0 w-full h-full object-cover"
              removeWrapper
              radius="none"
              src={getImageUrl(video.thumbnail)}
              crossOrigin="anonymous"
            />
          </div>
        </a>
        <CardFooter className="bottom-0 p-0 z-10">
          <div className="flex flex-col w-full px-1">
            <p className="text-tiny break-words line-clamp-2 h-[32px] my-1">
              {video.jp_name || video.title}
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
            <p className="text-tiny p-1 truncate">{videoStatusText}</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
