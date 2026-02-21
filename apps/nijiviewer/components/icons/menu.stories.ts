import type { Meta, StoryObj } from '@storybook/nextjs';

import { MenuIcon } from './menu';

const meta: Meta<typeof MenuIcon> = {
  title: 'Icons/MenuIcon',
  component: MenuIcon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    className: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Large: Story = {
  args: {
    className: 'w-8 h-8',
  },
};

export const Colored: Story = {
  args: {
    className: 'text-primary',
  },
};
