import type { Meta, StoryObj } from "@storybook/react";
import { MoonFilledIcon } from "./moon-filled";

const meta = {
  title: "Components/Icons",
  component: MoonFilledIcon,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MoonFilledIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MoonFilled: Story = {
  args: {
    size: 24,
  },
};
