import type { Meta, StoryObj } from "@storybook/react";
import { EmptyImage } from "./empty";

const meta = {
  title: "Components/Images",
  component: EmptyImage,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof EmptyImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    message: "Empty",
    width: 257,
    height: 247,
  },
};
