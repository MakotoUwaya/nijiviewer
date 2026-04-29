import { describe, expect, it, vi } from 'vitest';

const { cookiesMock, createServerClientMock } = vi.hoisted(() => ({
  cookiesMock: vi.fn(),
  createServerClientMock: vi.fn(),
}));

vi.mock('next/headers', () => ({
  cookies: cookiesMock,
}));

vi.mock('@supabase/ssr', () => ({
  createServerClient: createServerClientMock,
}));

import { createCustomServerClient } from './supabase-server';

describe('createCustomServerClient', () => {
  it('uses configured env vars when present', async () => {
    const cookieStore = { get: vi.fn(), set: vi.fn() };
    cookiesMock.mockResolvedValueOnce(cookieStore);
    createServerClientMock.mockReturnValueOnce({ id: 'client' });

    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://real.supabase.co');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'real-anon-key');

    const client = await createCustomServerClient();
    expect(client).toEqual({ id: 'client' });
    expect(createServerClientMock).toHaveBeenCalledWith(
      'https://real.supabase.co',
      'real-anon-key',
      { cookies: cookieStore },
    );

    vi.unstubAllEnvs();
  });

  it('falls back to placeholders when env vars are missing', async () => {
    const cookieStore = { get: vi.fn(), set: vi.fn() };
    cookiesMock.mockResolvedValueOnce(cookieStore);
    createServerClientMock.mockReturnValueOnce({ id: 'placeholder' });

    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', '');

    await createCustomServerClient();
    expect(createServerClientMock).toHaveBeenCalledWith(
      'https://placeholder.supabase.co',
      'placeholder',
      { cookies: cookieStore },
    );

    vi.unstubAllEnvs();
  });

  it('falls back to placeholders when env vars are the literal placeholder values', async () => {
    const cookieStore = { get: vi.fn(), set: vi.fn() };
    cookiesMock.mockResolvedValueOnce(cookieStore);
    createServerClientMock.mockReturnValueOnce({ id: 'placeholder' });

    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'your_supabase_url_here');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'your_supabase_anon_key_here');

    await createCustomServerClient();
    expect(createServerClientMock).toHaveBeenCalledWith(
      'https://placeholder.supabase.co',
      'placeholder',
      { cookies: cookieStore },
    );

    vi.unstubAllEnvs();
  });
});
