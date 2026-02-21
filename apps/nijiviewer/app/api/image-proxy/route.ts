import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return NextResponse.json(
      { error: 'URL parameter is required' },
      { status: 400 },
    );
  }

  try {
    const url = new URL(imageUrl);

    // セキュリティ上の理由から、http/https 以外は拒否
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return NextResponse.json(
        { error: 'Invalid protocol' },
        { status: 400 },
      );
    }

    const fetchHeaders: Record<string, string> = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
      Accept:
        'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    };

    // Referer が必要なドメイン（例: Bilibili）は引き続き個別対応
    if (
      url.hostname.endsWith('hdslb.com') ||
      url.hostname.endsWith('bilibili.com')
    ) {
      fetchHeaders.Referer = 'https://www.bilibili.com/';
    }

    const response = await fetch(imageUrl, {
      headers: fetchHeaders,
      // タイムアウト設定（必要に応じて）
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch image' },
        { status: response.status },
      );
    }

    const contentType = response.headers.get('Content-Type') || '';
    
    // 取得したコンテンツが画像でない場合はエラーを返す（SSRF対策の一環）
    if (!contentType.startsWith('image/') && contentType !== 'application/octet-stream') {
      return NextResponse.json(
        { error: 'URL did not return an image' },
        { status: 400 },
      );
    }

    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType || 'image/jpeg',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
