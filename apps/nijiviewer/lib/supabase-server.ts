import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const getValidUrl = (url: string | undefined): string => {
  if (!url || url === '') return 'https://placeholder.supabase.co';
  try {
    new URL(url);
    return url;
  } catch {
    return 'https://placeholder.supabase.co';
  }
};

export const createCustomServerClient = async () => {
  const cookieStore = await cookies();

  const supabaseUrl = getValidUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MjAwMDAwMDAwMH0.placeholder';

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: cookieStore,
    },
  );
};
