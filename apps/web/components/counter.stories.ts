import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Counter } from "./counter";

const meta = {
  title: "Components/Counter",
  component: Counter,
  tags: ["autodocs"],
} satisfies Meta<typeof Counter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    onClick: fn(),
  },
};
