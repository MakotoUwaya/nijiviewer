import { unstable_noStore as noStore } from 'next/cache';

type LiveRequestParams = {
  organization: string;
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<LiveRequestParams> },
) {
  noStore();
  const { organization } = await params;
  const response = await fetch(
    `https://holodex.net/api/v2/live?status=live&org=${organization}`,
    {
      headers: {
        'x-apikey': process.env.HOLODEX_APIKEY || '',
      },
    },
  );
  const videos = await response.json();
  return Response.json(videos || []);
}
