import { YouTubePlayerProvider } from '@/hooks/useYouTubePlayerContext';
import type { Meta, StoryObj } from '@storybook/nextjs';
import Video from './videos';

const meta = {
  title: 'Components/Video',
  component: Video,
  tags: ['autodocs'],
  parameters: {
    chromatic: {
      delay: 3000,
    },
  },
  decorators: [
    (Story) => {
      return (
        <YouTubePlayerProvider>
          <Story />
        </YouTubePlayerProvider>
      );
    },
  ],
} satisfies Meta<typeof Video>;

export default meta;
type Story = StoryObj<typeof meta>;

const commonVideo = {
  id: 'B2D3lGOrdVQ',
  title: 'videoTitle',
  topic_id: 'videoTopicId',
  published_at: '2025-01-01T00:00:00.000+0900',
  available_at: '2025-01-01T00:00:00.000+0900',
  duration: 120,
  status: 'live',
  start_actual: '2025-01-01T00:00:00.000+0900',
  start_scheduled: '2025-01-01T00:00:00.000+0900',
  channel: {
    id: 'channelId',
    name: 'channelName',
    org: 'channelOrg',
    suborg: 'channelOrg',
    type: 'channelType',
    photo: 'channelPhoto',
    english_name: 'channelEnglishName',
    subscriber_count: '123456',
    published_at: '2025-01-01T00:00:00.000+0900',
  },
};

export const Stream: Story = {
  args: {
    videos: [
      {
        ...commonVideo,
        type: 'stream',
        live_viewers: 5,
      },
    ],
  },
};

export const Placeholder: Story = {
  args: {
    videos: [
      {
        ...commonVideo,
        type: 'placeholder',
        link: 'https://www.twitch.tv',
        credits: {},
        certainty: 'PlaceholderCertainty',
        thumbnail: 'PlaceholderThumbnail',
        placeholderType: 'PlaceholderType',
        start_actual: '2024-12-31T23:59:59.000+0900',
        start_scheduled: '2024-12-31T23:59:59.000+0900',
        jp_name: 'videoTitle',
      },
    ],
  },
};

export const Skelton: Story = {
  args: {
    videos: [
      {
        ...commonVideo,
        type: 'other' as 'stream',
        live_viewers: 5,
      },
    ],
  },
};

export const Empty: Story = {
  args: {
    videos: [],
  },
};
