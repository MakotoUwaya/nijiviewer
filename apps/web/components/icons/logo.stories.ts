import type { Meta, StoryObj } from '@storybook/react';
import { Logo as LogoIcon } from './logo';

const meta = {
  title: 'Components/Icons',
  component: LogoIcon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LogoIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Logo: Story = {
  args: {
    size: 36,
  },
};
