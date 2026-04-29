import type { Session, User } from '@supabase/supabase-js';

export function mockUser(overrides: Partial<User> = {}): User {
  return {
    id: 'user-1',
    aud: 'authenticated',
    role: 'authenticated',
    email: 'user@example.com',
    email_confirmed_at: '2024-01-01T00:00:00.000Z',
    phone: '',
    confirmed_at: '2024-01-01T00:00:00.000Z',
    last_sign_in_at: '2024-01-01T00:00:00.000Z',
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: {},
    identities: [],
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
    is_anonymous: false,
    ...overrides,
  } as User;
}

export function mockSession(overrides: Partial<Session> = {}): Session {
  const user = overrides.user ?? mockUser();
  return {
    access_token: 'access-token',
    refresh_token: 'refresh-token',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    token_type: 'bearer',
    user,
    ...overrides,
  } as Session;
}
