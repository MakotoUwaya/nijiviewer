import type { Meta, StoryObj } from '@storybook/react';
import { SunFilledIcon } from './sun-filled';

const meta = {
  title: 'Components/Icons',
  component: SunFilledIcon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SunFilledIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SunFilled: Story = {
  args: {
    size: 24,
  },
};
