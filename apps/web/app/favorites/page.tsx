'use client';

import { Button, Link, Spinner } from '@heroui/react';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import { getFavoritesLiveVideosAction } from '@/app/actions';
import ScrollToTopButton from '@/components/scroll-to-top-button';
import Videos from '@/components/videos';
import { useAuth } from '@/context/auth-context';
import { useFavoriteLiversList } from '@/hooks/use-favorites';
import type { Video } from '@/lib/holodex';

export default function FavoritesPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { favorites, isLoading: isFavLoading } = useFavoriteLiversList();
  const [videos, setVideos] = useState<Video[]>([]);
  const [isVideosLoading, setIsVideosLoading] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      if (favorites.length === 0) {
        setVideos([]);
        return;
      }
      setIsVideosLoading(true);
      try {
        const ids = favorites.map((f) => f.liver_id);
        const data = await getFavoritesLiveVideosAction(ids);
        setVideos(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsVideosLoading(false);
      }
    };

    if (!isFavLoading) {
      fetchVideos();
    }
  }, [favorites, isFavLoading]);

  if (isAuthLoading || isFavLoading || isVideosLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 text-center">
        ログインしてお気に入り機能を利用しましょう。
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Favorite Live Videos</h1>
          <Button
            as={NextLink}
            href="/favorites/edit"
            color="primary"
            variant="flat"
          >
            Manage Favorites
          </Button>
        </div>
        <div className="p-8 text-center">
          お気に入りのライバーがいません。
          <br />
          <Link as={NextLink} href="/favorites/edit" className="mt-2 text-primary">
            Manage Favorites
          </Link>
          から追加してください。
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Favorite Live Videos</h1>
        <Button as={NextLink} href="/favorites/edit" color="primary" variant="flat">
          Manage Favorites
        </Button>
      </div>
      <Videos videos={videos} />
      <ScrollToTopButton />
    </div>
  );
}
