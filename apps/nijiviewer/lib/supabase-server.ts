import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createCustomServerClient = async () => {
  const cookieStore = await cookies();

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_url_here'
      ? process.env.NEXT_PUBLIC_SUPABASE_URL
      : 'https://placeholder.supabase.co';

  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your_supabase_anon_key_here'
      ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      : 'placeholder';

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: cookieStore,
  });
};
