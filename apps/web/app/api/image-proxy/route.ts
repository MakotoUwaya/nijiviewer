import { type NextRequest, NextResponse } from 'next/server';

/**
 * CORS制限のある画像をプロキシするためのAPIルート
 * 使用例: /api/image-proxy?url=https://example.com/image.jpg
 */
export async function GET(request: NextRequest) {
  // URLパラメータから画像のURLを取得
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  // URLが提供されていない場合はエラー
  if (!imageUrl) {
    return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
  }

  try {
    // 指定されたURLから画像を取得
    const response = await fetch(imageUrl);

    // 取得に失敗した場合はエラー
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.statusText}` },
        { status: response.status },
      );
    }

    // 画像データを取得
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // レスポンスを作成して返す
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 },
    );
  }
}
