import { unstable_noStore as noStore } from "next/cache";

export async function GET(
  _req: Request,
  { params }: { params: { organization: string } }
) {
  noStore();
  const response = await fetch(
    `https://holodex.net/api/v2/live?status=live&org=${params.organization}`,
    {
      headers: {
        "x-apikey": process.env.HOLODEX_APIKEY || "",
      },
    }
  );
  return Response.json(await response.json());
}
