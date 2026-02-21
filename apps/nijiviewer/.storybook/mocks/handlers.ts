import { HttpResponse, http } from 'msw';

// Supabaseの認証APIをモックする
export const handlers = [
  // セッション取得のモック
  http.post('https://example.supabase.co/auth/v1/token', () => {
    return HttpResponse.json({
      access_token: 'dummy-access-token',
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: 'dummy-refresh-token',
      user: {
        id: 'mock-user-id',
        email: 'user@example.com',
      },
    });
  }),

  // セッション検証のモック
  http.get('https://example.supabase.co/auth/v1/user', () => {
    return HttpResponse.json({
      id: 'mock-user-id',
      email: 'user@example.com',
    });
  }),

  // ログインのモック
  http.post('https://example.supabase.co/auth/v1/token', () => {
    return HttpResponse.json({
      access_token: 'dummy-access-token',
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: 'dummy-refresh-token',
      user: {
        id: 'mock-user-id',
        email: 'user@example.com',
      },
    });
  }),
];
