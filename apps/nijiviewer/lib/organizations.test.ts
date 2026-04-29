import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { organizationMap } from '@/const/organizations';
import { mockOrganizationRow } from '@/test/fixtures/organizations';
import {
  mockSupabaseFromOnce,
  queueSupabaseFrom,
} from '@/test/helpers/supabase-mock';
import {
  getOrganizations,
  getUserFavoriteOrganizationIds,
  initializeUserFavorites,
  toggleUserFavoriteOrganization,
  updateUserFavoriteOrder,
} from './organizations';

describe('organizations', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getOrganizations', () => {
    it('maps DB rows to Organization objects', async () => {
      const rows = [
        mockOrganizationRow({
          id: 'Nijisanji',
          name: 'にじさんじ',
          channel_id: 'UCNiji',
        }),
        mockOrganizationRow({
          id: 'Hololive',
          name: 'ホロライブ',
          channel_id: 'UCHolo',
        }),
      ];
      mockSupabaseFromOnce({ data: rows, error: null });

      const result = await getOrganizations();
      expect(result).toEqual([
        { id: 'Nijisanji', name: 'にじさんじ', channelId: 'UCNiji' },
        { id: 'Hololive', name: 'ホロライブ', channelId: 'UCHolo' },
      ]);
    });

    it('falls back to organizationMap when data is null', async () => {
      mockSupabaseFromOnce({ data: null, error: null });

      const result = await getOrganizations();
      expect(result).toEqual(organizationMap);
    });

    it('falls back to organizationMap when supabase returns error', async () => {
      mockSupabaseFromOnce({
        data: null,
        error: { message: 'db down' },
      });

      const result = await getOrganizations();
      expect(result).toEqual(organizationMap);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('getUserFavoriteOrganizationIds', () => {
    it('returns ordered organization_id array', async () => {
      mockSupabaseFromOnce({
        data: [
          { organization_id: 'Nijisanji' },
          { organization_id: 'Hololive' },
        ],
        error: null,
      });

      const result = await getUserFavoriteOrganizationIds('u1');
      expect(result).toEqual(['Nijisanji', 'Hololive']);
    });

    it('returns empty array on error and logs', async () => {
      mockSupabaseFromOnce({
        data: null,
        error: { message: 'oops' },
      });

      const result = await getUserFavoriteOrganizationIds('u1');
      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('toggleUserFavoriteOrganization', () => {
    it('inserts at next sort_order on favorite=true', async () => {
      // First .from() = max sort_order query, second = insert
      queueSupabaseFrom([
        { data: { sort_order: 4 }, error: null },
        { data: null, error: null },
      ]);

      await expect(
        toggleUserFavoriteOrganization('u1', 'Nijisanji', true),
      ).resolves.toBeUndefined();
    });

    it('uses sort_order 0 when no rows exist (favorite=true)', async () => {
      queueSupabaseFrom([
        { data: null, error: null },
        { data: null, error: null },
      ]);

      await expect(
        toggleUserFavoriteOrganization('u1', 'Hololive', true),
      ).resolves.toBeUndefined();
    });

    it('ignores 23505 unique violation on insert', async () => {
      queueSupabaseFrom([
        { data: { sort_order: 0 }, error: null },
        { data: null, error: { code: '23505', message: 'dup' } },
      ]);

      await expect(
        toggleUserFavoriteOrganization('u1', 'Nijisanji', true),
      ).resolves.toBeUndefined();
    });

    it('throws on non-23505 insert error', async () => {
      queueSupabaseFrom([
        { data: { sort_order: 0 }, error: null },
        { data: null, error: { code: '99', message: 'real error' } },
      ]);

      await expect(
        toggleUserFavoriteOrganization('u1', 'Nijisanji', true),
      ).rejects.toMatchObject({ code: '99' });
    });

    it('deletes the row on favorite=false', async () => {
      mockSupabaseFromOnce({ data: null, error: null });

      await expect(
        toggleUserFavoriteOrganization('u1', 'Nijisanji', false),
      ).resolves.toBeUndefined();
    });

    it('throws when delete fails', async () => {
      mockSupabaseFromOnce({
        data: null,
        error: { message: 'delete failed' },
      });

      await expect(
        toggleUserFavoriteOrganization('u1', 'Nijisanji', false),
      ).rejects.toMatchObject({ message: 'delete failed' });
    });
  });

  describe('initializeUserFavorites', () => {
    it('returns early when orgIds is empty', async () => {
      await expect(
        initializeUserFavorites('u1', []),
      ).resolves.toBeUndefined();
    });

    it('inserts rows on success', async () => {
      mockSupabaseFromOnce({ data: null, error: null });

      await expect(
        initializeUserFavorites('u1', ['Nijisanji', 'Hololive']),
      ).resolves.toBeUndefined();
    });

    it('ignores 23505 unique violation', async () => {
      mockSupabaseFromOnce({
        data: null,
        error: { code: '23505', message: 'dup' },
      });

      await expect(
        initializeUserFavorites('u1', ['Nijisanji']),
      ).resolves.toBeUndefined();
    });

    it('throws on non-23505 errors', async () => {
      mockSupabaseFromOnce({
        data: null,
        error: { code: '11', message: 'fail' },
      });

      await expect(
        initializeUserFavorites('u1', ['Nijisanji']),
      ).rejects.toMatchObject({ code: '11' });
    });
  });

  describe('updateUserFavoriteOrder', () => {
    it('upserts rows with index as sort_order', async () => {
      mockSupabaseFromOnce({ data: null, error: null });

      await expect(
        updateUserFavoriteOrder('u1', ['Nijisanji', 'Hololive']),
      ).resolves.toBeUndefined();
    });

    it('throws on error', async () => {
      mockSupabaseFromOnce({
        data: null,
        error: { message: 'fail' },
      });

      await expect(
        updateUserFavoriteOrder('u1', ['Nijisanji']),
      ).rejects.toMatchObject({ message: 'fail' });
    });
  });
});
