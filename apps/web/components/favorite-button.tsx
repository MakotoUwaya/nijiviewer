'use client';

import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { Button } from '@heroui/react';
import { useFavoriteLiver } from '@/hooks/use-favorites';
import { useAuth } from '@/context/auth-context';

interface FavoriteButtonProps {
  liverId: string;
  className?: string;
}

export function FavoriteButton({ liverId, className = '' }: FavoriteButtonProps) {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite, isLoading } = useFavoriteLiver(liverId);

  if (!user) return null;

  return (
    <Button
      isIconOnly
      variant="light"
      color={isFavorite ? "danger" : "default"}
      onPress={toggleFavorite}
      isLoading={isLoading}
      className={className}
      aria-label={isFavorite ? "お気に入り解除" : "お気に入り登録"}
    >
      {isFavorite ? (
        <HeartIconSolid className="w-5 h-5" />
      ) : (
        <HeartIcon className="w-5 h-5" />
      )}
    </Button>
  );
}
