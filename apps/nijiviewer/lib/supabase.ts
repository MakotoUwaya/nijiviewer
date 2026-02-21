import { createClient } from '@supabase/supabase-js';

const getValidUrl = (url: string | undefined): string => {
  if (!url || url === '') return 'https://placeholder.supabase.co';
  try {
    new URL(url);
    return url;
  } catch {
    return 'https://placeholder.supabase.co';
  }
};

const supabaseUrl = getValidUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MjAwMDAwMDAwMH0.placeholder';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
    console.warn('Supabase environment variables are missing during build. Using dummy values.');
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
