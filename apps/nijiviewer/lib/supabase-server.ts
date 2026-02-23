import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createCustomServerClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    // biome-ignore lint/style/noNonNullAssertion: exists
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // biome-ignore lint/style/noNonNullAssertion: exists
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: cookieStore,
    },
  );
};
