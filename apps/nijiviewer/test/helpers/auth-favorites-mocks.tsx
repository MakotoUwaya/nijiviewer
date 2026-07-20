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
  signInWithPasskey: () => Promise<void>;
  registerPasskey: () => Promise<{
    id: string;
    friendly_name: string;
    created_at: string;
  }>;
  listPasskeys: () => Promise<
    Array<{ id: string; friendly_name: string; created_at: string }>
  >;
  updatePasskey: () => Promise<void>;
  deletePasskey: () => Promise<void>;
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
    signInWithPasskey: vi.fn(),
    registerPasskey: vi
      .fn()
      .mockResolvedValue({ id: '', friendly_name: '', created_at: '' }),
    listPasskeys: vi.fn().mockResolvedValue([]),
    updatePasskey: vi.fn(),
    deletePasskey: vi.fn(),
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
