'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { Organization } from '@/lib/holodex';
import {
  getOrganizations,
  getUserFavoriteOrganizationIds,
  initializeUserFavorites,
  toggleUserFavoriteOrganization,
  updateUserFavoriteOrder,
} from '@/lib/organizations';
import { useAuth } from './auth-context';

type PreferencesContextType = {
  favoriteOrgIds: string[];
  organizations: Organization[];
  isLoading: boolean;
  toggleFavorite: (orgId: string, isFavorite: boolean) => Promise<void>;
  initializeFavorites: (orgIds: string[]) => Promise<void>;
  updateOrder: (orgIds: string[]) => Promise<void>; // Added
};

export const PreferencesContext = createContext<PreferencesContextType | undefined>(
  undefined,
);

export function PreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [favoriteOrgIds, setFavoriteOrgIds] = useState<string[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const orgs = await getOrganizations();
        if (isMounted) setOrganizations(orgs);

        if (user) {
          const favs = await getUserFavoriteOrganizationIds(user.id);
          if (isMounted) {
            // If 0 favorites, we might need to handle initialization here or in Settings page.
            // But context should reflect DB state.
            // If DB has 0, context has 0.
            // Sidebar logic handles 0 as "show all" usually, but that logic is component specific.
            // Settings page handles 0 as "init to all".
            setFavoriteOrgIds(favs);
          }
        } else {
          if (isMounted) setFavoriteOrgIds([]);
        }
      } catch (error) {
        console.error('Failed to load preferences data:', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const toggleFavorite = async (orgId: string, isFavorite: boolean) => {
    if (!user) return;

    // Optimistic update
    const previousFavs = [...favoriteOrgIds];
    if (isFavorite) {
      setFavoriteOrgIds((prev) => [...prev, orgId]);
    } else {
      setFavoriteOrgIds((prev) => prev.filter((id) => id !== orgId));
    }

    try {
      await toggleUserFavoriteOrganization(user.id, orgId, isFavorite);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      // Revert on error
      setFavoriteOrgIds(previousFavs);
      throw error;
    }
  };

  const initializeFavorites = async (orgIds: string[]) => {
    if (!user) return;

    // Optimistic
    setFavoriteOrgIds(orgIds);

    try {
      await initializeUserFavorites(user.id, orgIds);
    } catch (error) {
      console.error('Failed to initialize favorites', error);
      // Revert? Hard to revert init.
      // Reloading data might be safer.
      const favs = await getUserFavoriteOrganizationIds(user.id);
      setFavoriteOrgIds(favs);
      throw error;
    }
  };

  const updateOrder = async (orgIds: string[]) => {
    if (!user) return;

    // Optimistic
    setFavoriteOrgIds(orgIds);

    try {
      await updateUserFavoriteOrder(user.id, orgIds);
    } catch (error) {
      console.error('Failed to update order', error);
      // Revert? simpler to reload
      const favs = await getUserFavoriteOrganizationIds(user.id);
      setFavoriteOrgIds(favs);
      throw error;
    }
  };

  return (
    <PreferencesContext.Provider
      value={{
        favoriteOrgIds,
        organizations,
        isLoading,
        toggleFavorite,
        initializeFavorites,
        updateOrder, // Added
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}
