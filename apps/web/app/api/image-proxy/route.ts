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
    // URL validation
    const url = new URL(imageUrl);

    // 許可されたドメインのみをホワイトリストに追加
    const allowedDomains = [
      'i.ytimg.com',
      'yt3.ggpht.com',
      'yt3.googleusercontent.com',
      'public-web.spwn.jp',
      'img.youtube.com',
    ];

    if (!allowedDomains.some((domain) => url.hostname.endsWith(domain))) {
      return NextResponse.json(
        { error: 'Domain not allowed' },
        { status: 403 },
      );
    }

    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
        Accept:
          'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch image' },
        { status: response.status },
      );
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('Content-Type') || 'image/jpeg';

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
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
