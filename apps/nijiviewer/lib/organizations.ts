import { organizationMap } from '@/const/organizations';
import type { Organization } from '@/lib/holodex';
import { supabase } from '@/lib/supabase';

export async function getOrganizations(): Promise<Organization[]> {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .order('created_at', { ascending: true }); // Keep consistent order

    if (error) {
      console.error('Error fetching organizations from Supabase:', error);
      throw error;
    }

    if (!data) return organizationMap;

    return data.map((org) => ({
      id: org.id,
      name: org.name,
      channelId: org.channel_id,
    }));
  } catch (error) {
    console.error('Fallback to hardcoded organizations due to error:', error);
    return organizationMap;
  }
}

export async function getUserFavoriteOrganizationIds(
  userId: string,
): Promise<string[]> {
  const { data, error } = await supabase
    .from('user_favorite_organizations')
    .select('organization_id')
    .eq('user_id', userId)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching user favorites:', error);
    return []; // Return empty on error, fallback mechanism could be handled by caller or assumed empty
  }

  return data.map((item) => item.organization_id);
}

export async function toggleUserFavoriteOrganization(
  userId: string,
  orgId: string,
  isFavorite: boolean,
): Promise<void> {
  if (isFavorite) {
    // Get current max sort_order to append to end
    const { data: maxOrderData } = await supabase
      .from('user_favorite_organizations')
      .select('sort_order')
      .eq('user_id', userId)
      .order('sort_order', { ascending: false })
      .limit(1)
      .single();

    const nextOrder = (maxOrderData?.sort_order ?? -1) + 1;

    const { error } = await supabase
      .from('user_favorite_organizations')
      .insert({
        user_id: userId,
        organization_id: orgId,
        sort_order: nextOrder,
      });
    if (error && error.code !== '23505') {
      // Ignore unique violation
      throw error;
    }
  } else {
    const { error } = await supabase
      .from('user_favorite_organizations')
      .delete()
      .eq('user_id', userId)
      .eq('organization_id', orgId);
    if (error) throw error;
  }
}

export async function initializeUserFavorites(
  userId: string,
  orgIds: string[],
): Promise<void> {
  if (orgIds.length === 0) return;

  const rows = orgIds.map((orgId, index) => ({
    user_id: userId,
    organization_id: orgId,
    sort_order: index,
  }));

  const { error } = await supabase
    .from('user_favorite_organizations')
    .insert(rows);

  if (error) {
    if (error.code !== '23505') {
      throw error;
    }
  }
}

export async function updateUserFavoriteOrder(
  userId: string,
  orgIds: string[],
): Promise<void> {
  // Upsert is efficient but sort_order is part of update.
  // We need to update each row.
  // Supabase upsert requires primary key or unique constraint.
  // user_id + organization_id is likely unique.

  const updates = orgIds.map((orgId, index) => ({
    user_id: userId,
    organization_id: orgId,
    sort_order: index,
  }));

  const { error } = await supabase
    .from('user_favorite_organizations')
    .upsert(updates, { onConflict: 'user_id, organization_id' });

  if (error) throw error;
}
