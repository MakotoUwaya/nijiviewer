import type { Meta, StoryObj } from "@storybook/react";
import { GithubIcon } from "./github";

const meta = {
  title: "Components/Icons",
  component: GithubIcon,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GithubIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Github: Story = {
  args: {
    size: 24,
  },
};
