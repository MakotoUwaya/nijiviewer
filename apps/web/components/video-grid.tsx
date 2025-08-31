'use client';

import { Spinner } from '@heroui/react';
import { useCallback, useEffect, useState } from 'react';
import type { Video, VideoType } from '@/lib/holodex';
import ScrollToTopButton from './scroll-to-top-button';
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
  offset = 0,
): Promise<Video[]> => {
  const params = new URLSearchParams({
    channel_id: channelId,
    limit: limit.toString(),
    offset: offset.toString(),
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        setOffset(0);
        setHasMore(true);

        const fetchedVideos = await fetchVideosFromAPI(channelId, type, 50, 0);
        setVideos(fetchedVideos);
        setOffset(50);

        // 取得した動画数が50未満の場合、これ以上データがないと判断
        if (fetchedVideos.length < 50) {
          setHasMore(false);
        }
      } catch (err) {
        setError('動画の取得に失敗しました');
        console.error('Error fetching videos:', err);
        setVideos([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [channelId, type]);

  const loadMoreVideos = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      setError(null);

      const newVideos = await fetchVideosFromAPI(channelId, type, 50, offset);

      if (newVideos.length === 0) {
        setHasMore(false);
      } else {
        // 重複する動画を除外して追加
        setVideos((prevVideos) => {
          const existingIds = new Set(prevVideos.map((v) => v.id));
          const uniqueNewVideos = newVideos.filter(
            (v) => !existingIds.has(v.id),
          );
          return [...prevVideos, ...uniqueNewVideos];
        });
        setOffset((prevOffset) => prevOffset + newVideos.length);

        // 取得した動画数が50未満の場合、これ以上データがないと判断
        if (newVideos.length < 50) {
          setHasMore(false);
        }
      }
    } catch (err) {
      setError('追加の動画取得に失敗しました');
      console.error('Error loading more videos:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, channelId, type, offset]);

  useEffect(() => {
    const handleScroll = () => {
      // スクロール位置が最下部近くに達したときに追加読み込み
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // 最下部から200px以内に達した場合に追加読み込み
      if (
        scrollTop + windowHeight >= documentHeight - 200 &&
        hasMore &&
        !loadingMore &&
        !loading
      ) {
        loadMoreVideos();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loadingMore, loading, loadMoreVideos]);

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
    <>
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

        {/* 追加読み込み中のインジケーター */}
        {loadingMore && (
          <div className="flex justify-center items-center py-8">
            <Spinner size="md" />
            <span className="ml-2 text-default-500">動画を読み込み中...</span>
          </div>
        )}

        {/* 読み込み完了のメッセージ */}
        {!hasMore && videos.length > 0 && (
          <div className="text-center py-8">
            <p className="text-default-500">すべての動画を表示しました</p>
          </div>
        )}
      </div>

      <ScrollToTopButton />
    </>
  );
}
