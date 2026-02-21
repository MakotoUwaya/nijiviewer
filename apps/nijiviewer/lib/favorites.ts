import { supabase } from '@/lib/supabase';

export interface FavoriteLiver {
  id: number;
  created_at: string;
  user_id: string;
  liver_id: string;
}

export async function getFavoriteLivers(
  userId: string,
): Promise<FavoriteLiver[]> {
  const { data, error } = await supabase
    .from('favorite_livers')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }

  return data as FavoriteLiver[];
}

export async function addFavoriteLiver(
  userId: string,
  liverId: string,
): Promise<FavoriteLiver | null> {
  const { data, error } = await supabase
    .from('favorite_livers')
    .insert([{ user_id: userId, liver_id: liverId }])
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      // Unique violation, already exists
      return null;
    }
    console.error('Error adding favorite:', error);
    throw error;
  }

  return data as FavoriteLiver;
}

export async function removeFavoriteLiver(
  userId: string,
  liverId: string,
): Promise<void> {
  const { error } = await supabase
    .from('favorite_livers')
    .delete()
    .eq('user_id', userId)
    .eq('liver_id', liverId);

  if (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
}

export async function checkIsFavorite(
  userId: string,
  liverId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from('favorite_livers')
    .select('id')
    .eq('user_id', userId)
    .eq('liver_id', liverId)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 is "The result contains 0 rows"
    console.error('Error checking favorite:', error);
  }

  return !!data;
}
