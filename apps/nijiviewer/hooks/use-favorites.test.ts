import { act, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockUser } from '@/test/fixtures/auth';
import { mockFavoriteLiver } from '@/test/fixtures/favorites';
import { renderHookWithProviders } from '@/test/helpers/render-with-providers';
import {
  mockSupabaseFrom,
  mockSupabaseFromOnce,
  queueSupabaseFrom,
} from '@/test/helpers/supabase-mock';
import { useFavoriteLiver, useFavoriteLiversList } from './use-favorites';

describe('useFavoriteLiver', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('starts as not favorite when user is missing', () => {
    const { result } = renderHookWithProviders(() =>
      useFavoriteLiver('liver-1'),
    );
    expect(result.current.isFavorite).toBe(false);
  });

  it('checks favorite status when user is signed in', async () => {
    mockSupabaseFromOnce({ data: { id: 1 }, error: null });

    const { result } = renderHookWithProviders(
      () => useFavoriteLiver('liver-1'),
      { authState: { user: mockUser({ id: 'u1' }) } },
    );

    await waitFor(() => {
      expect(result.current.isFavorite).toBe(true);
    });
  });

  it('catches errors during check and keeps state unchanged', async () => {
    mockSupabaseFrom({ data: null, error: null });
    // Override checkIsFavorite call to throw via failing chain
    const failingFrom = vi.fn(() => {
      throw new Error('boom');
    });
    const { supabaseMock } = await import('@/test/helpers/supabase-mock');
    supabaseMock.from.mockImplementationOnce(failingFrom);

    const { result } = renderHookWithProviders(
      () => useFavoriteLiver('liver-1'),
      { authState: { user: mockUser({ id: 'u1' }) } },
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });
    expect(result.current.isFavorite).toBe(false);
  });

  it('adds favorite when toggleFavorite is called and user is logged in', async () => {
    queueSupabaseFrom([
      // initial check: not favorite
      { data: null, error: { code: 'PGRST116', message: 'no rows' } },
      // add: success
      { data: mockFavoriteLiver(), error: null },
    ]);

    const { result } = renderHookWithProviders(
      () => useFavoriteLiver('liver-1'),
      { authState: { user: mockUser({ id: 'u1' }) } },
    );

    await waitFor(() => {
      expect(result.current.isFavorite).toBe(false);
    });

    await act(async () => {
      await result.current.toggleFavorite();
    });

    expect(result.current.isFavorite).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it('removes favorite when toggleFavorite is called while currently a favorite', async () => {
    queueSupabaseFrom([
      // initial check: is favorite
      { data: { id: 1 }, error: null },
      // remove: success
      { data: null, error: null },
    ]);

    const { result } = renderHookWithProviders(
      () => useFavoriteLiver('liver-1'),
      { authState: { user: mockUser({ id: 'u1' }) } },
    );

    await waitFor(() => {
      expect(result.current.isFavorite).toBe(true);
    });

    await act(async () => {
      await result.current.toggleFavorite();
    });

    expect(result.current.isFavorite).toBe(false);
  });

  it('toggleFavorite is a no-op when user is missing', async () => {
    const { result } = renderHookWithProviders(() =>
      useFavoriteLiver('liver-1'),
    );

    await act(async () => {
      await result.current.toggleFavorite();
    });

    expect(result.current.isFavorite).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('logs error when toggleFavorite fails', async () => {
    queueSupabaseFrom([
      { data: null, error: { code: 'PGRST116', message: 'no rows' } },
      { data: null, error: { code: '500', message: 'boom' } },
    ]);

    const { result } = renderHookWithProviders(
      () => useFavoriteLiver('liver-1'),
      { authState: { user: mockUser({ id: 'u1' }) } },
    );

    await waitFor(() => {
      expect(result.current.isFavorite).toBe(false);
    });

    await act(async () => {
      await result.current.toggleFavorite();
    });

    expect(console.error).toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
  });

  it('clears favorite state when liverId becomes empty', async () => {
    mockSupabaseFromOnce({ data: { id: 1 }, error: null });

    const { result, rerender } = renderHookWithProviders(
      ({ id }: { id: string }) => useFavoriteLiver(id),
      {
        authState: { user: mockUser({ id: 'u1' }) },
        initialProps: { id: 'liver-1' },
      },
    );

    await waitFor(() => {
      expect(result.current.isFavorite).toBe(true);
    });

    rerender({ id: '' });

    await waitFor(() => {
      expect(result.current.isFavorite).toBe(false);
    });
  });
});

describe('useFavoriteLiversList', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns empty list and stops loading when user is missing', async () => {
    const { result } = renderHookWithProviders(() =>
      useFavoriteLiversList(),
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.favorites).toEqual([]);
  });

  it('loads favorites for the current user', async () => {
    const rows = [
      mockFavoriteLiver({ id: 1, liver_id: 'l1' }),
      mockFavoriteLiver({ id: 2, liver_id: 'l2' }),
    ];
    mockSupabaseFromOnce({ data: rows, error: null });

    const { result } = renderHookWithProviders(
      () => useFavoriteLiversList(),
      { authState: { user: mockUser({ id: 'u1' }) } },
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.favorites).toEqual(rows);
  });

  it('logs and continues when fetch throws', async () => {
    const { supabaseMock } = await import('@/test/helpers/supabase-mock');
    supabaseMock.from.mockImplementationOnce(() => {
      throw new Error('db error');
    });

    const { result } = renderHookWithProviders(
      () => useFavoriteLiversList(),
      { authState: { user: mockUser({ id: 'u1' }) } },
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(console.error).toHaveBeenCalled();
  });

  it('refetch reloads the list', async () => {
    const initial = [mockFavoriteLiver({ id: 1, liver_id: 'l1' })];
    const refreshed = [
      mockFavoriteLiver({ id: 1, liver_id: 'l1' }),
      mockFavoriteLiver({ id: 2, liver_id: 'l2' }),
    ];
    queueSupabaseFrom([
      { data: initial, error: null },
      { data: refreshed, error: null },
    ]);

    const { result } = renderHookWithProviders(
      () => useFavoriteLiversList(),
      { authState: { user: mockUser({ id: 'u1' }) } },
    );

    await waitFor(() => {
      expect(result.current.favorites).toEqual(initial);
    });

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.favorites).toEqual(refreshed);
  });
});
