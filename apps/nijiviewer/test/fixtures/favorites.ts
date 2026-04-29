import type { FavoriteLiver } from '@/lib/favorites';

export function mockFavoriteLiver(
  overrides: Partial<FavoriteLiver> = {},
): FavoriteLiver {
  return {
    id: 1,
    created_at: '2024-01-01T00:00:00.000Z',
    user_id: 'user-1',
    liver_id: 'liver-1',
    ...overrides,
  };
}
