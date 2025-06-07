import type { Meta, StoryObj } from '@storybook/nextjs';
import { SearchIcon } from './search';

const meta = {
  title: 'Components/Icons',
  component: SearchIcon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SearchIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Search: Story = {
  args: {
    height: '1em',
    width: '1em',
  },
};
