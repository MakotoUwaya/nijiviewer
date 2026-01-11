'use client';

import { Spinner } from '@heroui/react';
import { useEffect, useState } from 'react';
import { getChannelsAction } from '@/app/actions';
import ScrollToTopButton from '@/components/scroll-to-top-button';
import { SearchResultList } from '@/components/search-result';
import { useAuth } from '@/context/auth-context';
import { useFavoriteLiversList } from '@/hooks/use-favorites';
import type { Channel } from '@/lib/holodex';

export default function FavoritesPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { favorites, isLoading: isFavLoading } = useFavoriteLiversList();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isChannelsLoading, setIsChannelsLoading] = useState(false);

  useEffect(() => {
    const fetchChannels = async () => {
      if (favorites.length === 0) {
        setChannels([]);
        return;
      }
      setIsChannelsLoading(true);
      try {
        const ids = favorites.map((f) => f.liver_id);
        const data = await getChannelsAction(ids);
        setChannels(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsChannelsLoading(false);
      }
    };

    if (!isFavLoading) {
      fetchChannels();
    }
  }, [favorites, isFavLoading]);

  if (isAuthLoading || isFavLoading || isChannelsLoading) {
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
      <div className="p-8 text-center">お気に入りのライバーがいません。</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Favorite Livers</h1>
      <SearchResultList channels={channels} />
      <ScrollToTopButton />
    </div>
  );
}
