import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import Video from "./videos";

const meta = {
  title: "Components/Video",
  component: Video,
  tags: ["autodocs"],
} satisfies Meta<typeof Video>;

export default meta;
type Story = StoryObj<typeof meta>;

const commonVideo = {
  id: "B2D3lGOrdVQ",
  title: "videoTitle",
  topic_id: "videoTopicId",
  published_at: "videoPublishedAt",
  available_at: "videoAvailableAt",
  duration: 120,
  status: "videoStatus",
  start_actual: "1970-01-01T00:00:00.000",
  start_scheduled: "videoStartScheduled",
  channel: {
    id: "channelId",
    name: "channelName",
    org: "channelOrg",
    suborg: "channelOrg",
    type: "channelType",
    photo: "channelPhoto",
    english_name: "channelEnglishName",
  },
};

export const Stream: Story = {
  args: {
    videos: [
      {
        ...commonVideo,
        type: "stream",
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
        type: "placeholder",
        link: "https://www.twitch.tv",
        credits: {},
        certainty: "PlaceholderCertainty",
        thumbnail: "PlaceholderThumbnail",
        placeholderType: "PlaceholderType",
      },
    ],
  },
};

export const Skelton: Story = {
  args: {
    videos: [
      {
        ...commonVideo,
        type: "other" as "stream",
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
