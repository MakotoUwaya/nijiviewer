import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import {
  addFavoriteLiver,
  checkIsFavorite,
  type FavoriteLiver,
  getFavoriteLivers,
  removeFavoriteLiver,
} from '@/lib/favorites';

export function useFavoriteLiver(liverId: string) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user || !liverId) {
      setIsFavorite(false);
      return;
    }

    const checkStatus = async () => {
      try {
        const status = await checkIsFavorite(user.id, liverId);
        setIsFavorite(status);
      } catch (error) {
        console.error(error);
      }
    };

    checkStatus();
  }, [user, liverId]);

  const toggleFavorite = async () => {
    if (!user) return; // Should handle auth requirement in UI

    setIsLoading(true);
    try {
      if (isFavorite) {
        await removeFavoriteLiver(user.id, liverId);
        setIsFavorite(false);
      } else {
        await addFavoriteLiver(user.id, liverId);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error(error);
      // Revert state if error? Or just show error
    } finally {
      setIsLoading(false);
    }
  };

  return { isFavorite, toggleFavorite, isLoading };
}

export function useFavoriteLiversList() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteLiver[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const data = await getFavoriteLivers(user.id);
      setFavorites(data);
    } catch (error) {
      console.error('Failed to fetch favorite livers', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return { favorites, isLoading, refetch: fetchFavorites };
}
