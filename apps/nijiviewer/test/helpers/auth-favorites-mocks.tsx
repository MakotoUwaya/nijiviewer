import { HeroUIProvider } from '@heroui/react';
import type { Session, User } from '@supabase/supabase-js';
import type { ReactNode } from 'react';
import { type Mock, vi } from 'vitest';
import type { FavoriteLiver } from '@/lib/favorites';

type AuthValue = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signUp: () => Promise<void>;
  signOut: () => Promise<void>;
};

type FavoritesValue = {
  favorites: FavoriteLiver[];
  isLoading: boolean;
  refetch: () => Promise<void>;
};

export const wrapWithHeroUI = (ui: ReactNode) => (
  <HeroUIProvider>{ui}</HeroUIProvider>
);

export const stubAuth = (
  mock: Mock,
  overrides: Partial<AuthValue> = {},
): void => {
  mock.mockReturnValue({
    user: null,
    session: null,
    isLoading: false,
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    ...overrides,
  });
};

export const stubFavorites = (
  mock: Mock,
  overrides: Partial<FavoritesValue> = {},
): void => {
  mock.mockReturnValue({
    favorites: [],
    isLoading: false,
    refetch: vi.fn(),
    ...overrides,
  });
};
