'use client';

import { Button } from '@heroui/react';
import { DateTime } from 'luxon';
import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import type { Video } from '@/lib/holodex';
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
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY >= 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const liveVideos = props.videos
    .filter((v) => v.type !== 'clip')
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
    <>
      <div className="flex flex-col md:flex-row flex-wrap">
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

      {/* スクロールトップボタン */}
      {showScrollTop && (
        <Button
          isIconOnly
          size="lg"
          color="primary"
          className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg"
          onPress={scrollToTop}
          aria-label="ページトップへ戻る"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <title>上矢印アイコン</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 15.75l7.5-7.5 7.5 7.5"
            />
          </svg>
        </Button>
      )}
    </>
  );
};
export default Videos;
