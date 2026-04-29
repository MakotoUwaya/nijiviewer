import { http, HttpResponse } from 'msw';
import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { server } from '@/test/msw/server';
import { GET } from './route';

const buildRequest = (params?: Record<string, string>): NextRequest => {
  const url = new URL('http://localhost/api/image-proxy');
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, v);
    }
  }
  return new NextRequest(url);
};

describe('GET /api/image-proxy', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 400 when url param is missing', async () => {
    const res = await GET(buildRequest());
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({
      error: 'URL parameter is required',
    });
  });

  it('returns 400 for non-http(s) protocols', async () => {
    const res = await GET(
      buildRequest({ url: 'file:///etc/passwd' }),
    );
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: 'Invalid protocol' });
  });

  it('returns 500 when the URL string is malformed', async () => {
    const res = await GET(buildRequest({ url: 'not a url' }));
    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({
      error: 'Internal server error',
    });
    expect(console.error).toHaveBeenCalled();
  });

  it('proxies an image successfully and forwards Content-Type', async () => {
    const upstreamUrl = 'https://example.com/cat.png';
    const bytes = new Uint8Array([1, 2, 3, 4]);
    server.use(
      http.get(upstreamUrl, () =>
        HttpResponse.arrayBuffer(bytes.buffer, {
          headers: { 'Content-Type': 'image/png' },
        }),
      ),
    );

    const res = await GET(buildRequest({ url: upstreamUrl }));
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('image/png');
    expect(res.headers.get('Cache-Control')).toContain('max-age=3600');
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
    const buf = await res.arrayBuffer();
    expect(new Uint8Array(buf)).toEqual(bytes);
  });

  it('falls back to image/jpeg when upstream omits Content-Type', async () => {
    const upstreamUrl = 'https://example.com/no-type.bin';
    server.use(
      http.get(upstreamUrl, () =>
        HttpResponse.arrayBuffer(new Uint8Array([0]).buffer, {
          headers: { 'Content-Type': 'application/octet-stream' },
        }),
      ),
    );

    const res = await GET(buildRequest({ url: upstreamUrl }));
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('application/octet-stream');
  });

  it('rejects responses whose Content-Type is not an image', async () => {
    const upstreamUrl = 'https://example.com/page.html';
    server.use(
      http.get(upstreamUrl, () =>
        HttpResponse.text('<html />', {
          headers: { 'Content-Type': 'text/html' },
        }),
      ),
    );

    const res = await GET(buildRequest({ url: upstreamUrl }));
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({
      error: 'URL did not return an image',
    });
  });

  it('forwards Bilibili Referer for hdslb.com hostnames', async () => {
    const upstreamUrl = 'https://i0.hdslb.com/cat.png';
    let receivedReferer: string | null = null;
    server.use(
      http.get(upstreamUrl, ({ request }) => {
        receivedReferer = request.headers.get('Referer');
        return HttpResponse.arrayBuffer(new Uint8Array([1]).buffer, {
          headers: { 'Content-Type': 'image/png' },
        });
      }),
    );

    await GET(buildRequest({ url: upstreamUrl }));
    expect(receivedReferer).toBe('https://www.bilibili.com/');
  });

  it('forwards Bilibili Referer for bilibili.com hostnames', async () => {
    const upstreamUrl = 'https://www.bilibili.com/cat.png';
    let receivedReferer: string | null = null;
    server.use(
      http.get(upstreamUrl, ({ request }) => {
        receivedReferer = request.headers.get('Referer');
        return HttpResponse.arrayBuffer(new Uint8Array([1]).buffer, {
          headers: { 'Content-Type': 'image/png' },
        });
      }),
    );

    await GET(buildRequest({ url: upstreamUrl }));
    expect(receivedReferer).toBe('https://www.bilibili.com/');
  });

  it('does not forward Bilibili Referer for unrelated hostnames', async () => {
    const upstreamUrl = 'https://example.com/cat.png';
    let receivedReferer: string | null = null;
    server.use(
      http.get(upstreamUrl, ({ request }) => {
        receivedReferer = request.headers.get('Referer');
        return HttpResponse.arrayBuffer(new Uint8Array([1]).buffer, {
          headers: { 'Content-Type': 'image/png' },
        });
      }),
    );

    await GET(buildRequest({ url: upstreamUrl }));
    expect(receivedReferer).toBeNull();
  });

  it('returns the upstream status when fetch responds with a non-OK status', async () => {
    const upstreamUrl = 'https://example.com/missing.png';
    server.use(
      http.get(upstreamUrl, () =>
        HttpResponse.text('not found', { status: 404 }),
      ),
    );

    const res = await GET(buildRequest({ url: upstreamUrl }));
    expect(res.status).toBe(404);
    await expect(res.json()).resolves.toEqual({
      error: 'Failed to fetch image',
    });
  });

  it('returns 500 when the upstream fetch fails', async () => {
    const upstreamUrl = 'https://example.com/error.png';
    server.use(http.get(upstreamUrl, () => HttpResponse.error()));

    const res = await GET(buildRequest({ url: upstreamUrl }));
    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({
      error: 'Internal server error',
    });
    expect(console.error).toHaveBeenCalled();
  });
});
