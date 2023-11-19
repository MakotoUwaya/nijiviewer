export interface Video {
  id: string;
  title: string;
  type: string;
  topic_id: string;
  published_at: Date;
  available_at: Date;
  duration: number;
  status: string;
  start_scheduled: Date;
  start_actual: Date;
  live_viewers: number;
  channel: Channel;
};

export interface Channel {
  id: string;
  name: string;
  org: string;
  suborg: string;
  type: string;
  photo: string;
  english_name: string;
};
