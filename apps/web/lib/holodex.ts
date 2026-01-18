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

// import { DateTime } from 'luxon'; // Need to add import at top of file, so using multi-replace or separate replace
import { DateTime } from 'luxon';

/**
 * 指定されたDateTimeが、現在の日付よりも前の日付かどうかを判定
 */
const isPreviousDay = (targetDateTime: DateTime): boolean => {
  const startOfToday = DateTime.now().startOf('day');
  const startOfTargetDay = targetDateTime.startOf('day');
  return startOfTargetDay < startOfToday;
};

export const getStarted = (target: string | undefined): string => {
  if (!target) {
    return '';
  }
  const targetDateTime = DateTime.fromISO(target);
  return isPreviousDay(targetDateTime)
    ? targetDateTime.toFormat('yyyy-MM-dd HH:mm') || ''
    : targetDateTime.toRelative() || '';
};

export const getVideoStatusText = (
  start_scheduled: string | undefined,
): string => {
  if (!start_scheduled) return 'Will probably start soon';
  const start = DateTime.fromISO(start_scheduled);
  const diffMap = start.diffNow(['minutes']).toObject();
  const diffMinutes = diffMap.minutes || 0;
  const fmt = start.toFormat('yyyy-MM-dd HH:mm');

  if (diffMinutes <= 1 && diffMinutes > -60) {
    return `Start at ${fmt} (will start soon)`;
  }
  if (diffMinutes <= 60 && diffMinutes > 1) {
    return `Start at ${fmt} (starts in ${Math.floor(diffMinutes)} minutes)`;
  }
  const diffHours = diffMinutes / 60;
  if (diffHours <= 24 && diffHours > 1) {
    return `Start at ${fmt} (starts in ${Math.floor(diffHours)} hours)`;
  }
  return `Start at ${fmt}`;
};

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
