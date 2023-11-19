import { Suspense } from "react";
import { fetchLiveVideos } from "../../lib/data";
import Videos from "@/components/videos";

export default async function LiveVideosPage(): Promise<JSX.Element> {
  const liveVideos = await fetchLiveVideos();
  return (
    <Suspense fallback={<div>loading...</div>}>
      <Videos videos={liveVideos} />
    </Suspense>
  );
}
