import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createCustomServerClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: cookieStore,
    },
  );
};
