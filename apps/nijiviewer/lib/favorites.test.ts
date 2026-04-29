import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  mockSupabaseFrom,
  mockSupabaseFromOnce,
  queueSupabaseFrom,
} from '@/test/helpers/supabase-mock';
import {
  addFavoriteLiver,
  checkIsFavorite,
  getFavoriteLivers,
  removeFavoriteLiver,
} from './favorites';

describe('favorites', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getFavoriteLivers', () => {
    it('returns rows on success', async () => {
      const rows = [
        {
          id: 1,
          created_at: '2024-01-01T00:00:00.000Z',
          user_id: 'u1',
          liver_id: 'l1',
        },
      ];
      mockSupabaseFromOnce({ data: rows, error: null });

      const result = await getFavoriteLivers('u1');
      expect(result).toEqual(rows);
    });

    it('returns empty array on error and logs', async () => {
      mockSupabaseFromOnce({
        data: null,
        error: { message: 'boom' },
      });

      const result = await getFavoriteLivers('u1');
      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching favorites:',
        expect.objectContaining({ message: 'boom' }),
      );
    });
  });

  describe('addFavoriteLiver', () => {
    it('returns inserted row on success', async () => {
      const row = {
        id: 2,
        created_at: '2024-01-01T00:00:00.000Z',
        user_id: 'u1',
        liver_id: 'l2',
      };
      mockSupabaseFromOnce({ data: row, error: null });

      const result = await addFavoriteLiver('u1', 'l2');
      expect(result).toEqual(row);
    });

    it('returns null on unique violation (23505)', async () => {
      mockSupabaseFromOnce({
        data: null,
        error: { code: '23505', message: 'duplicate' },
      });

      const result = await addFavoriteLiver('u1', 'l2');
      expect(result).toBeNull();
    });

    it('throws on other errors and logs', async () => {
      mockSupabaseFromOnce({
        data: null,
        error: { code: '99999', message: 'oops' },
      });

      await expect(addFavoriteLiver('u1', 'l2')).rejects.toMatchObject({
        message: 'oops',
      });
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('removeFavoriteLiver', () => {
    it('resolves on success', async () => {
      mockSupabaseFromOnce({ data: null, error: null });

      await expect(removeFavoriteLiver('u1', 'l1')).resolves.toBeUndefined();
    });

    it('throws and logs on error', async () => {
      mockSupabaseFromOnce({
        data: null,
        error: { message: 'fail' },
      });

      await expect(removeFavoriteLiver('u1', 'l1')).rejects.toMatchObject({
        message: 'fail',
      });
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('checkIsFavorite', () => {
    it('returns true when row exists', async () => {
      mockSupabaseFromOnce({ data: { id: 1 }, error: null });

      const result = await checkIsFavorite('u1', 'l1');
      expect(result).toBe(true);
    });

    it('returns false on PGRST116 (zero rows) without logging', async () => {
      mockSupabaseFromOnce({
        data: null,
        error: { code: 'PGRST116', message: 'no rows' },
      });

      const result = await checkIsFavorite('u1', 'l1');
      expect(result).toBe(false);
      expect(console.error).not.toHaveBeenCalled();
    });

    it('returns false and logs on other errors', async () => {
      mockSupabaseFromOnce({
        data: null,
        error: { code: '500', message: 'server error' },
      });

      const result = await checkIsFavorite('u1', 'l1');
      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('chained calls', () => {
    it('does not leak state between consecutive calls', async () => {
      queueSupabaseFrom([
        { data: [{ id: 1 }], error: null },
        { data: [{ id: 2 }], error: null },
      ]);

      const first = await getFavoriteLivers('u1');
      const second = await getFavoriteLivers('u2');
      expect(first).toEqual([{ id: 1 }]);
      expect(second).toEqual([{ id: 2 }]);
    });

    it('mockSupabaseFrom applies a persistent mock', async () => {
      mockSupabaseFrom({ data: [{ id: 99 }], error: null });

      const a = await getFavoriteLivers('u1');
      const b = await getFavoriteLivers('u2');
      expect(a).toEqual(b);
    });
  });
});
