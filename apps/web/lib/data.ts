import { unstable_noStore as noStore } from "next/cache";
import type { Video } from "./holodex";

export const fetchLiveVideos = async (): Promise<Video[]> => {
  noStore();

  const response = await fetch(
    "https://holodex.net/api/v2/live?status=live&org=Nijisanji",
    {
      headers: {
        "x-apikey": process.env.HOLODEX_APIKEY || "",
      },
    }
  );
  return (await response.json()) as Video[];
};
