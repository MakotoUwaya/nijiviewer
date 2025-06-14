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
      pauseAnimationAtEnd: true,
      diffThreshold: 0.1,
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
  published_at: '2020-01-01T00:00:00.000Z',
  available_at: '2020-01-01T00:00:00.000Z',
  duration: 120,
  status: 'live',
  start_actual: '2020-01-01T00:00:00.000Z',
  start_scheduled: '2020-01-01T00:00:00.000Z',
  channel: {
    id: 'channelId',
    name: 'channelName',
    org: 'channelOrg',
    suborg: 'channelOrg',
    type: 'channelType',
    photo: 'channelPhoto',
    english_name: 'channelEnglishName',
    subscriber_count: '123456',
    published_at: '2020-01-01T00:00:00.000',
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
  play: async ({ canvasElement }) => {
    const canvas = canvasElement;
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const timeElements = canvas.querySelectorAll('p');
    for (const el of timeElements) {
      if (el.textContent?.includes('Started streaming')) {
        el.textContent = '5 watching now Started streaming 5 minutes ago';
      }
    }
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
        start_actual: '2019-12-31T23:59:59.000Z',
        start_scheduled: '2019-12-31T23:59:59.000Z',
        jp_name: 'videoTitle',
      },
    ],
  },
  parameters: {
    chromatic: {
      delay: 3000,
      pauseAnimationAtEnd: true,
      diffThreshold: 0.1,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = canvasElement;
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const timeElements = canvas.querySelectorAll('p');
    for (const el of timeElements) {
      if (el.textContent?.includes('Started streaming')) {
        el.textContent = 'Live - www.twitch.tv Started streaming 5 minutes ago';
      }
    }
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
