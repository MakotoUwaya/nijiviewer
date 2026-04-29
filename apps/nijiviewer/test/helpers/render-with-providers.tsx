import { HeroUIProvider } from '@heroui/react';
import {
  render,
  type RenderHookOptions,
  type RenderOptions,
  renderHook,
} from '@testing-library/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ReactElement, ReactNode } from 'react';
import { vi } from 'vitest';
import { AuthContext, type AuthContextType } from '@/context/auth-context';
import {
  PreferencesContext,
} from '@/context/preferences-context';
import type { Organization } from '@/lib/holodex';

type PreferencesValue = {
  favoriteOrgIds: string[];
  organizations: Organization[];
  isLoading: boolean;
  toggleFavorite: (orgId: string, isFavorite: boolean) => Promise<void>;
  initializeFavorites: (orgIds: string[]) => Promise<void>;
  updateOrder: (orgIds: string[]) => Promise<void>;
};

export interface ProviderOptions {
  /** Wraps with AuthContext.Provider when provided. Default keys fill missing fields. */
  authState?: Partial<AuthContextType>;
  /** Wraps with PreferencesContext.Provider when provided. */
  preferencesState?: Partial<PreferencesValue>;
}

const defaultAuth: AuthContextType = {
  user: null,
  session: null,
  isLoading: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
};

const defaultPreferences: PreferencesValue = {
  favoriteOrgIds: [],
  organizations: [],
  isLoading: false,
  toggleFavorite: async () => {},
  initializeFavorites: async () => {},
  updateOrder: async () => {},
};

export function buildWrapper(options: ProviderOptions = {}) {
  return function Wrapper({ children }: { children: ReactNode }) {
    let tree: ReactNode = children;

    if (options.preferencesState) {
      const value: PreferencesValue = {
        ...defaultPreferences,
        toggleFavorite: vi.fn(defaultPreferences.toggleFavorite),
        initializeFavorites: vi.fn(defaultPreferences.initializeFavorites),
        updateOrder: vi.fn(defaultPreferences.updateOrder),
        ...options.preferencesState,
      };
      tree = (
        <PreferencesContext.Provider value={value}>
          {tree}
        </PreferencesContext.Provider>
      );
    }

    if (options.authState) {
      const value: AuthContextType = {
        ...defaultAuth,
        signIn: vi.fn(defaultAuth.signIn),
        signUp: vi.fn(defaultAuth.signUp),
        signOut: vi.fn(defaultAuth.signOut),
        ...options.authState,
      };
      tree = (
        <AuthContext.Provider value={value}>{tree}</AuthContext.Provider>
      );
    }

    return (
      <HeroUIProvider>
        <NextThemesProvider>{tree}</NextThemesProvider>
      </HeroUIProvider>
    );
  };
}

export function renderWithProviders(
  ui: ReactElement,
  options: ProviderOptions & Omit<RenderOptions, 'wrapper'> = {},
): ReturnType<typeof render> {
  const { authState, preferencesState, ...rest } = options;
  return render(ui, {
    wrapper: buildWrapper({ authState, preferencesState }),
    ...rest,
  });
}

export function renderHookWithProviders<TProps, TResult>(
  callback: (props: TProps) => TResult,
  options: ProviderOptions & Omit<RenderHookOptions<TProps>, 'wrapper'> = {},
): ReturnType<typeof renderHook<TResult, TProps>> {
  const { authState, preferencesState, ...rest } = options;
  return renderHook(callback, {
    wrapper: buildWrapper({ authState, preferencesState }),
    ...rest,
  });
}
