import type { Meta, StoryObj } from "@storybook/react";
import { YouTubePlayerProvider } from "../hooks/useYouTubePlayerContext";
import { Navbar } from "./navbar";

const meta = {
  title: "Components/Navbar",
  component: Navbar,
  tags: ["autodocs"],
  decorators: [(Story) => {
    return (
      <YouTubePlayerProvider>
        <Story />
      </YouTubePlayerProvider>
    );
  }]
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
