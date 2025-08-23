import { fromPromise } from 'neverthrow';
import { type NextRequest, NextResponse } from 'next/server';
import { baseUrl, type VideoType } from '@/lib/holodex';

type VideoRequestParams = {
  type: VideoType;
};

const getUrl = (
  type: VideoRequestParams['type'],
  searchParams: URLSearchParams,
) => {
  const channelId = searchParams.get('channel_id');
  if (!channelId) {
    return undefined;
  }
  searchParams.delete('channel_id');
  searchParams.append('lang', 'en,ja');
  searchParams.append('type', 'stream,placeholder');
  searchParams.append('include', 'clips,live_info');

  switch (type) {
    case 'past':
      return new URL(
        `${baseUrl}/channels/${channelId}/videos?${searchParams.toString()}`,
      );
    case 'clips':
    case 'collabs':
      searchParams.append('status', 'past');
      return new URL(
        `${baseUrl}/channels/${channelId}/${type}?${searchParams.toString()}`,
      );
    default:
      break;
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<VideoRequestParams> },
) {
  const { type } = await params;
  const searchParams = request.nextUrl.searchParams;
  const url = getUrl(type, searchParams);

  if (!url) {
    return NextResponse.json({ error: 'missing parameters' }, { status: 400 });
  }

  try {
    const response = await fromPromise(
      fetch(url, {
        headers: {
          'x-apikey': process.env.HOLODEX_APIKEY || '',
        },
      }),
      (e: Error) => e,
    );

    if (response.isErr()) {
      console.error('Holodex API fetch error:', response.error);
      return NextResponse.json(
        { error: 'Failed to fetch from Holodex API' },
        { status: 500 },
      );
    }

    const videos = await fromPromise(response.value.json(), (e: Error) => e);

    if (videos.isErr()) {
      console.error('Holodex API JSON parse error:', videos.error);
      return NextResponse.json(
        {
          error: 'Failed to parse Holodex API response',
          errorBody: response.value,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(videos.value);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
