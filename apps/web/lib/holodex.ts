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

/**
 * 動画の再生時間を適切なフォーマットで表示する関数
 * 1時間以上: HH:MM:SS
 * 1時間未満: MM:SS
 */
export function formatVideoDuration(durationInSeconds: number): string {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  const seconds = Math.floor(durationInSeconds % 60);

  // 1時間以上の場合: HH:MM:SS
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  // 1時間未満の場合: MM:SS
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

const apiVersion = 'v2';
export const baseUrl = `https://holodex.net/api/${apiVersion}`;
