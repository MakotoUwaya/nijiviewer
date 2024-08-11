import type { Meta, StoryObj } from "@storybook/react";
import { HeartFilledIcon } from "./heart-filled";

const meta = {
  title: "Components/Icons",
  component: HeartFilledIcon,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof HeartFilledIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HeartFilled: Story = {
  args: {
    size: 24,
  },
};
