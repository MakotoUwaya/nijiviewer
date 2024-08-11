import type { Meta, StoryObj } from "@storybook/react";
import { TwitterIcon } from "./twitter";

const meta = {
  title: "Components/Icons",
  component: TwitterIcon,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TwitterIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Twitter: Story = {
  args: {
    size: 24,
  },
};
