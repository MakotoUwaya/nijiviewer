import { unstable_noStore as noStore } from "next/cache";
import type { Video } from "./holodex";

export const fetchLiveVideos = async (org: string): Promise<Video[]> => {
  noStore();
  const query = new URLSearchParams({
    type: "placeholder,stream",
    include: "mentions",
    org,
  });
  const response = await fetch(
    `https://holodex.net/api/v2/live?${query.toString()}`,
    {
      headers: {
        "x-apikey": process.env.HOLODEX_APIKEY || "",
      },
    }
  );
  return (await response.json()) as Video[];
};
