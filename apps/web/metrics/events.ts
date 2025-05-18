import type { Organization } from '@/lib/holodex';
import type { StreamVideo } from '@/lib/holodex';

declare global {
  interface Window {
    gtag: (
      command: 'event',
      eventName: string,
      eventParameters: Record<string, unknown>,
    ) => void;
  }
}

export const sendOrganizationChangeEvent = (organization: Organization) => {
  window.gtag?.('event', 'select_organization', {
    organization_id: organization.id,
    organization_name: organization.name,
  });
};

export const sendVideoPlayEvent = (
  video: StreamVideo,
  playLocation: 'youtube' | 'in-app',
) => {
  window.gtag?.('event', 'play_video', {
    video_id: video.id,
    video_title: video.title,
    channel_id: video.channel.id,
    channel_name: video.channel.name,
    organization: video.channel.org,
    play_location: playLocation,
  });
};
