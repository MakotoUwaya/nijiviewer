'use client';

import type { Video } from '@/lib/holodex';
import { DateTime } from 'luxon';
import type { JSX } from 'react';
import { EmptyImage } from './images';
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

const Videos = (props: VideoProps): JSX.Element => {
  const liveVideos = props.videos
    .filter((v) => hasPast(v.start_actual) || hasPast(v.start_scheduled))
    .map((v) => ({ ...v, started: hasPast(v.start_actual) }));
  if (liveVideos.length === 0) {
    return (
      <div className="flex justify-center p-10">
        <EmptyImage message="Not found live video" />
      </div>
    );
  }
  return (
    <div className="flex flex-col md:flex-row flex-wrap">
      {liveVideos.map((v) => {
        switch (v.type) {
          case 'stream':
            return <VideoCardStream key={v.id} {...v} />;
          case 'placeholder':
            return <VideoCardPlaceholder key={v.id} {...v} />;
          default:
            return <VideoCardSkeleton />;
        }
      })}
    </div>
  );
};
export default Videos;
