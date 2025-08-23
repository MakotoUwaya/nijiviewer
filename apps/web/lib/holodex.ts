type CommonVideo = {
  id: string;
  title: string;
  published_at: string;
  available_at: string;
  duration: number;
  status: string;
  channel: Channel;
};

export type VideoType =
  | 'live'
  | 'past'
  | 'upcoming'
  | 'clips'
  | 'stream'
  | 'placeholder'
  | 'collabs';

export type StreamVideo = CommonVideo & {
  type: 'stream';
  topic_id: string;
  start_scheduled: string;
  start_actual?: string;
  live_viewers: number;
};

export type PlaceholderVideo = CommonVideo & {
  type: 'placeholder';
  topic_id: string;
  start_scheduled: string;
  start_actual?: string;
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

export type ClipVideo = CommonVideo & {
  type: 'clip';
  lang: string;
};

export type Video = StreamVideo | PlaceholderVideo | ClipVideo;

export interface Channel {
  id: string;
  name: string;
  org?: string;
  suborg?: string;
  type: string;
  photo: string;
  english_name?: string;
  subscriber_count?: string;
  published_at?: string;
  view_count?: string;
  video_count?: string;
  clip_count?: string;
  twitter?: string;
  description?: string;
}

export interface Organization {
  id: string;
  name: string;
  channelId: string;
}

export interface AutocompleteResponse {
  type: 'channel' | 'topic';
  value: string;
  text: string | null;
}

const apiVersion = 'v2';
export const baseUrl = `https://holodex.net/api/${apiVersion}`;
