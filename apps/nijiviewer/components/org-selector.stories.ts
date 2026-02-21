import type { Meta, StoryObj } from '@storybook/nextjs';

import { ThemeSwitch } from './theme-switch';

const meta = {
  title: 'Components/ThemeSwitch',
  component: ThemeSwitch,
  tags: ['autodocs'],
} satisfies Meta<typeof ThemeSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    className: undefined,
    classNames: undefined,
  },
};
