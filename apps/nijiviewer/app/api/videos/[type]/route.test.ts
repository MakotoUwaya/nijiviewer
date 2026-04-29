import { http, HttpResponse } from 'msw';
import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockStreamVideo } from '@/test/fixtures/holodex';
import { HOLODEX_BASE } from '@/test/msw/factories';
import { server } from '@/test/msw/server';
import { GET } from './route';

type RouteContext = { params: Promise<{ type: string }> };

const buildRequest = (params?: Record<string, string>): NextRequest => {
  const url = new URL('http://localhost/api/videos/test');
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, v);
    }
  }
  return new NextRequest(url);
};

const ctx = (type: string): RouteContext => ({
  params: Promise.resolve({ type }),
});

describe('GET /api/videos/[type]', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 400 when channel_id is missing', async () => {
    const res = await GET(buildRequest(), ctx('past'));
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({
      error: 'missing parameters',
    });
  });

  it('returns 400 when type does not match a known route', async () => {
    const res = await GET(
      buildRequest({ channel_id: 'C' }),
      ctx('upcoming'),
    );
    expect(res.status).toBe(400);
  });

  it('proxies past videos for the channel', async () => {
    const video = mockStreamVideo({ id: 'p1' });
    let receivedUrl: URL | undefined;
    server.use(
      http.get(`${HOLODEX_BASE}/channels/:channelId/videos`, ({ request }) => {
        receivedUrl = new URL(request.url);
        return HttpResponse.json([video]);
      }),
    );

    const res = await GET(
      buildRequest({ channel_id: 'C-1', limit: '10' }),
      ctx('past'),
    );
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual([video]);
    expect(receivedUrl?.pathname).toBe('/api/v2/channels/C-1/videos');
    expect(receivedUrl?.searchParams.get('lang')).toBe('en,ja');
    expect(receivedUrl?.searchParams.get('type')).toBe('stream,placeholder');
    expect(receivedUrl?.searchParams.get('include')).toBe('clips,live_info');
    expect(receivedUrl?.searchParams.get('limit')).toBe('10');
  });

  it('proxies clips with status=past', async () => {
    let receivedUrl: URL | undefined;
    server.use(
      http.get(`${HOLODEX_BASE}/channels/:channelId/clips`, ({ request }) => {
        receivedUrl = new URL(request.url);
        return HttpResponse.json([]);
      }),
    );

    const res = await GET(
      buildRequest({ channel_id: 'C-2' }),
      ctx('clips'),
    );
    expect(res.status).toBe(200);
    expect(receivedUrl?.pathname).toBe('/api/v2/channels/C-2/clips');
    expect(receivedUrl?.searchParams.get('status')).toBe('past');
  });

  it('proxies collabs with status=past', async () => {
    let receivedUrl: URL | undefined;
    server.use(
      http.get(`${HOLODEX_BASE}/channels/:channelId/collabs`, ({ request }) => {
        receivedUrl = new URL(request.url);
        return HttpResponse.json([]);
      }),
    );

    const res = await GET(
      buildRequest({ channel_id: 'C-3' }),
      ctx('collabs'),
    );
    expect(res.status).toBe(200);
    expect(receivedUrl?.pathname).toBe('/api/v2/channels/C-3/collabs');
    expect(receivedUrl?.searchParams.get('status')).toBe('past');
  });

  it('returns 500 when the upstream fetch fails', async () => {
    server.use(
      http.get(`${HOLODEX_BASE}/channels/:channelId/videos`, () =>
        HttpResponse.error(),
      ),
    );

    const res = await GET(
      buildRequest({ channel_id: 'C' }),
      ctx('past'),
    );
    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({
      error: 'Failed to fetch from Holodex API',
    });
    expect(console.error).toHaveBeenCalled();
  });

  it('returns 500 when the upstream returns invalid JSON', async () => {
    server.use(
      http.get(`${HOLODEX_BASE}/channels/:channelId/videos`, () =>
        HttpResponse.text('not-json', { status: 200 }),
      ),
    );

    const res = await GET(
      buildRequest({ channel_id: 'C' }),
      ctx('past'),
    );
    expect(res.status).toBe(500);
    const body = (await res.json()) as { error: string };
    expect(body.error).toBe('Failed to parse Holodex API response');
    expect(console.error).toHaveBeenCalled();
  });

  it('returns 500 from the catch block when fetch throws synchronously', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockImplementation(() => {
        throw new Error('sync boom');
      });

    const res = await GET(
      buildRequest({ channel_id: 'C' }),
      ctx('past'),
    );
    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({
      error: 'Internal server error',
    });
    expect(console.error).toHaveBeenCalledWith(
      'Unexpected error:',
      expect.any(Error),
    );
    fetchSpy.mockRestore();
  });
});
