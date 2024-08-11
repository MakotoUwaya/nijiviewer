import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { organizations } from "@/consts/organizations";

import OrgSelector from "./org-selector";

const meta = {
  title: "Components/OrgSelector",
  component: OrgSelector,
  tags: ["autodocs"],
} satisfies Meta<typeof OrgSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    items: organizations,
    selectedKey: "Nijisanji",
    onChange: fn(),
  },
};
