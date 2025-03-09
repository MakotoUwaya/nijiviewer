type CommonVideo = {
  id: string;
  title: string;
  topic_id: string;
  published_at: string;
  available_at: string;
  duration: number;
  status: string;
  start_scheduled: string;
  start_actual?: string;
  channel: Channel;
};

export type StreamVideo = CommonVideo & {
  type: "stream";
  live_viewers: number;
};

export type PlaceholderVideo = CommonVideo & {
  type: "placeholder";
  link: string;
  credits: {
    bot?: {
      link: string;
      name: string;
      user: string;
    };
    editor?: {
      name: string;
      user: number;
    };
  };
  jp_name?: string;
  certainty: string;
  thumbnail: string;
  placeholderType: string;
};

export type Video = StreamVideo | PlaceholderVideo;

export interface Channel {
  id: string;
  name: string;
  org: string;
  suborg: string;
  type: string;
  photo: string;
  english_name: string;
}

export interface Organization {
  id: string;
  name: string;
  channelId: string;
}
