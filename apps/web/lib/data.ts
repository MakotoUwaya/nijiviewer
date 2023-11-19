import type { Video } from "./holodex";

export const fetchLiveVideos = async (): Promise<Video[]> => {
  const response = await fetch(
    "https://holodex.net/api/v2/live?status=live&org=Nijisanji",
    {
      headers: {
        "x-apikey": process.env.HOLODEX_APIKEY || '',
      },
    }
  );
  return (await response.json()) as Video[];
};
