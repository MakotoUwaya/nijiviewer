import type { Meta, StoryObj } from "@storybook/react";
import { DiscordIcon } from "./discord";

const meta = {
  title: "Components/Icons",
  component: DiscordIcon,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DiscordIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Discord: Story = {
  args: {
    size: 24,
  },
};
