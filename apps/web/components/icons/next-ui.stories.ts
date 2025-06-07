import type { Meta, StoryObj } from '@storybook/nextjs';
import { NextUILogo } from './next-ui';

const meta = {
  title: 'Components/Icons',
  component: NextUILogo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NextUILogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NextUI: Story = {
  args: {
    width: 120,
    height: 40,
  },
};
