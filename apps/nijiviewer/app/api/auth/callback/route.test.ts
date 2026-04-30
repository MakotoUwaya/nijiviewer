import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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

import { GET } from './route';

const buildRequest = (params?: Record<string, string>): NextRequest => {
  const url = new URL('http://localhost/api/auth/callback');
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, v);
    }
  }
  return new NextRequest(url);
};

describe('GET /api/auth/callback', () => {
  beforeEach(() => {
    createServerClientMock.mockReset();
    cookiesMock.mockReset();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('redirects to origin without exchanging when code is missing', async () => {
    const res = await GET(buildRequest());
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('http://localhost/');
    expect(createServerClientMock).not.toHaveBeenCalled();
    expect(cookiesMock).not.toHaveBeenCalled();
  });

  it('exchanges the code for a session and redirects to origin', async () => {
    const cookieStore = {
      getAll: vi.fn(() => [{ name: 'sb-access', value: 'v', options: {} }]),
      set: vi.fn(),
    };
    cookiesMock.mockResolvedValue(cookieStore);
    const exchange = vi.fn().mockResolvedValue({});
    createServerClientMock.mockReturnValue({
      auth: { exchangeCodeForSession: exchange },
    });

    const res = await GET(buildRequest({ code: 'abc' }));

    expect(exchange).toHaveBeenCalledWith('abc');
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('http://localhost/');
  });

  it('writes cookies via setAll and tolerates Server Component throws', async () => {
    const cookieStore = {
      getAll: vi.fn(() => []),
      set: vi
        .fn()
        // First write succeeds, second throws to simulate Server Component restriction.
        .mockImplementationOnce(() => undefined)
        .mockImplementationOnce(() => {
          throw new Error('cannot set cookies in Server Component');
        }),
    };
    cookiesMock.mockResolvedValue(cookieStore);

    const cookieAdapters: Array<{
      getAll: () => unknown;
      setAll: (
        cookies: Array<{
          name: string;
          value: string;
          options?: Record<string, unknown>;
        }>,
      ) => void;
    }> = [];

    createServerClientMock.mockImplementation((_url, _key, opts) => {
      cookieAdapters.push(opts.cookies);
      return {
        auth: { exchangeCodeForSession: vi.fn().mockResolvedValue({}) },
      };
    });

    await GET(buildRequest({ code: 'xyz' }));

    expect(cookieAdapters).toHaveLength(1);
    const adapter = cookieAdapters[0];

    // Verify the getAll forwarder.
    expect(adapter.getAll()).toEqual([]);
    expect(cookieStore.getAll).toHaveBeenCalled();

    // Calling setAll with two cookies — the second throws and should be swallowed.
    expect(() =>
      adapter.setAll([
        { name: 'a', value: '1', options: { path: '/' } },
        { name: 'b', value: '2', options: { path: '/' } },
      ]),
    ).not.toThrow();

    expect(cookieStore.set).toHaveBeenCalledWith('a', '1', { path: '/' });
    expect(cookieStore.set).toHaveBeenCalledWith('b', '2', { path: '/' });
  });
});
