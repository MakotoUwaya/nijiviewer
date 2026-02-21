import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const apiToken = process.env.AIVIS_API_TOKEN;

    if (!apiToken) {
      return Response.json(
        { error: 'AIVIS API token is not configured' },
        { status: 500 },
      );
    }

    const body = await req.json();

    const response = await fetch(
      'https://api.aivis-project.com/v1/tts/synthesize',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      return Response.json(
        { error: `AIVIS API error: ${response.status}` },
        { status: response.status },
      );
    }

    // ストリーミングレスポンスをそのまま返す
    return new Response(response.body, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('TTS API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
