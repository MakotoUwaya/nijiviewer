import { Suspense } from "react";
import Videos from "@/components/videos";
import { fetchLiveVideos } from "../../lib/data";

export default async function LiveVideosPage(): Promise<JSX.Element> {
  const liveVideos = await fetchLiveVideos();
  return (
    <Suspense fallback={<div>loading...</div>}>
      <Videos videos={liveVideos} />
    </Suspense>
  );
}
