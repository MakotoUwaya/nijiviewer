'use client';

import { Divider } from '@heroui/react';
import { DateTime } from 'luxon';
import type { JSX } from 'react';
import type { Video } from '@/lib/holodex';
import { EmptyImage } from './images';
import ScrollToTopButton from './scroll-to-top-button';
import VideoCardPlaceholder from './video-card-placeholder';
import VideoCardSkeleton from './video-card-skeleton';
import VideoCardStream from './video-card-stream';

interface VideoProps {
  videos: Video[];
}

/**
 * @private
 * Is the current time past the streaming start time?
 * @param target streaming start time
 * @returns true if it is past
 */
export const hasPast = (target: string | undefined): boolean => {
  if (!target) {
    return false;
  }
  const targetDateTime = DateTime.fromISO(target);
  return targetDateTime.diffNow().milliseconds < 0;
};

/**
 * @private
 * Is the scheduled start time stale? (more than 1 hour ago)
 * @param target streaming start time
 * @returns true if it is stale
 */
export const isStale = (target: string | undefined): boolean => {
  if (!target) {
    return false;
  }
  const targetDateTime = DateTime.fromISO(target);
  return targetDateTime.diffNow().as('hours') < -1;
};

const Videos = (props: VideoProps): JSX.Element => {
  const liveVideos = props.videos
    .filter((v) => v.type !== 'clip')
    .filter((v) => v.status === 'live')
    .filter((v) => {
      // If it has technically started (start_actual exists) or if the scheduled start time passed but it's not "stale" (not more than 1h ago)
      if (v.start_actual) return true;
      return hasPast(v.start_scheduled) && !isStale(v.start_scheduled);
    })
    .map((v) => ({ ...v, started: hasPast(v.start_actual) }));
  const upCommingVideos = props.videos
    .filter((v) => v.type !== 'clip')
    .filter((v) => v.status === 'upcoming')
    .map((v) => ({ ...v, started: hasPast(v.start_actual) }));
  if (liveVideos.length === 0 && upCommingVideos.length === 0) {
    return (
      <div className="flex justify-center p-10">
        <EmptyImage message="Not found live video" />
      </div>
    );
  }
  return (
    <>
      <div className="flex flex-col md:flex-row flex-wrap w-full">
        {liveVideos.map((v) => {
          switch (v.type) {
            case 'stream':
              return <VideoCardStream key={v.id} {...v} />;
            case 'placeholder':
              return <VideoCardPlaceholder key={v.id} {...v} />;
            default:
              return (
                <VideoCardSkeleton key={`skeleton-${crypto.randomUUID()}`} />
              );
          }
        })}
      </div>
      {liveVideos.length > 0 && upCommingVideos.length > 0 && (
        <Divider className="my-4" />
      )}
      {upCommingVideos.length > 0 && (
        <div className="flex flex-col md:flex-row flex-wrap w-full">
          {upCommingVideos.map((v) => {
            switch (v.type) {
              case 'stream':
                return <VideoCardStream key={v.id} {...v} />;
              case 'placeholder':
                return <VideoCardPlaceholder key={v.id} {...v} />;
              default:
                return (
                  <VideoCardSkeleton key={`skeleton-${crypto.randomUUID()}`} />
                );
            }
          })}
        </div>
      )}
      <ScrollToTopButton />
    </>
  );
};
export default Videos;
