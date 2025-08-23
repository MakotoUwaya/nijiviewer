'use client';

import { Spinner } from '@heroui/react';
import { useEffect, useState } from 'react';
import type { Video, VideoType } from '@/lib/holodex';
import VideoCardClip from './video-card-clip';
import VideoCardPlaceholder from './video-card-placeholder';
import VideoCardSkeleton from './video-card-skeleton';
import VideoCardStream from './video-card-stream';

type VideoGridProps = {
  channelId: string;
  type: VideoType;
};

const fetchVideosFromAPI = async (
  channelId: string,
  type: VideoType,
  limit = 50,
): Promise<Video[]> => {
  const params = new URLSearchParams({
    channel_id: channelId,
    limit: limit.toString(),
  });

  const response = await fetch(`/api/videos/${type}?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

export default function VideoGrid({ channelId, type }: VideoGridProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);

        const fetchedVideos = await fetchVideosFromAPI(channelId, type);
        setVideos(fetchedVideos);
      } catch (err) {
        setError('動画の取得に失敗しました');
        console.error('Error fetching videos:', err);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [channelId, type]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (videos.length === 0) {
    const getEmptyMessage = () => {
      switch (type) {
        case 'live':
          return '現在ライブ配信はありません';
        case 'clips':
          return '切り抜き動画がありません';
        default:
          return '動画がありません';
      }
    };

    return (
      <div className="text-center py-12">
        <p className="text-default-500">{getEmptyMessage()}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row flex-wrap">
        {videos.map((v) => {
          switch (v.type) {
            case 'stream':
              return <VideoCardStream key={v.id} {...v} started />;
            case 'clip':
              return <VideoCardClip key={v.id} {...v} started />;
            case 'placeholder':
              return <VideoCardPlaceholder key={v.id} {...v} started />;
            default:
              return (
                <VideoCardSkeleton key={`skeleton-${crypto.randomUUID()}`} />
              );
          }
        })}
      </div>
    </div>
  );
}
