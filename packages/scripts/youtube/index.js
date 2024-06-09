import dotenv from 'dotenv';
dotenv.config({ path: '.env.local', override: true });

const getLatestVideoByChannelId = async (channelId, maxResults = 10) => {
  // biome-ignore lint/style/useTemplate: <explanation>
  const url = 'https://www.googleapis.com/youtube/v3/search' +
    `?key=${process.env.YOUTUBE_API_KEY}` +
    `&channelId=${channelId}` +
    '&part=snippet,id' +
    '&order=viewCount' +
    `&maxResults=${maxResults}`;
  const response = await fetch(url);
  const data = await response.json();
  // url: `https://www.youtube.com/watch?v=${video.id.videoId}`
  return data?.items;
}

const main = async () => {
  console.log("Hello World");

  const list = await getLatestVideoByChannelId('UC0t_U2BgpK5LcSB9_ccuH4g', 10);
  console.log(list);
};

await main();
