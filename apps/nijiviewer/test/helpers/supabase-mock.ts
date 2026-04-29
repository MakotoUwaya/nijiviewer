import { type Mock, vi } from 'vitest';

export interface SupabaseAuthMock {
  getUser: Mock;
  signInWithPassword: Mock;
  signUp: Mock;
  signOut: Mock;
  getSession: Mock;
  onAuthStateChange: Mock;
  exchangeCodeForSession: Mock;
}

export interface SupabaseClientMock {
  from: Mock;
  auth: SupabaseAuthMock;
}

export const supabaseMock: SupabaseClientMock = {
  from: vi.fn(),
  auth: {
    getUser: vi.fn(),
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(),
    exchangeCodeForSession: vi.fn(),
  },
};

export interface MockResult<T = unknown> {
  data: T | null;
  error: { code?: string; message?: string } | null;
}

export function createMockChain<T = unknown>(result: MockResult<T>): unknown {
  const proxy: unknown = new Proxy(
    {},
    {
      get(_, prop) {
        if (prop === 'then') {
          return (resolve: (v: MockResult<T>) => void) => resolve(result);
        }
        return () => proxy;
      },
    },
  );
  return proxy;
}

export function resetSupabaseMock(): void {
  supabaseMock.from.mockReset();
  supabaseMock.from.mockImplementation(() =>
    createMockChain({ data: [], error: null }),
  );

  supabaseMock.auth.getUser.mockReset();
  supabaseMock.auth.getUser.mockResolvedValue({
    data: { user: null },
    error: null,
  });

  supabaseMock.auth.signInWithPassword.mockReset();
  supabaseMock.auth.signInWithPassword.mockResolvedValue({
    data: null,
    error: null,
  });

  supabaseMock.auth.signUp.mockReset();
  supabaseMock.auth.signUp.mockResolvedValue({ data: null, error: null });

  supabaseMock.auth.signOut.mockReset();
  supabaseMock.auth.signOut.mockResolvedValue({ error: null });

  supabaseMock.auth.getSession.mockReset();
  supabaseMock.auth.getSession.mockResolvedValue({
    data: { session: null },
    error: null,
  });

  supabaseMock.auth.onAuthStateChange.mockReset();
  supabaseMock.auth.onAuthStateChange.mockReturnValue({
    data: { subscription: { unsubscribe: vi.fn() } },
  });

  supabaseMock.auth.exchangeCodeForSession.mockReset();
  supabaseMock.auth.exchangeCodeForSession.mockResolvedValue({
    data: { session: null, user: null },
    error: null,
  });
}

export function mockSupabaseFromOnce<T = unknown>(
  result: MockResult<T>,
): void {
  supabaseMock.from.mockReturnValueOnce(createMockChain(result));
}

export function mockSupabaseFrom<T = unknown>(result: MockResult<T>): void {
  supabaseMock.from.mockReturnValue(createMockChain(result));
}

export function queueSupabaseFrom<T = unknown>(
  results: ReadonlyArray<MockResult<T>>,
): void {
  for (const result of results) {
    supabaseMock.from.mockReturnValueOnce(createMockChain(result));
  }
}
