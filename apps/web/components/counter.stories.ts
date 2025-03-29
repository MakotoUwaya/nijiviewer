import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';
import { Counter } from './counter';

const meta = {
  title: 'Components/Counter',
  component: Counter,
  tags: ['autodocs'],
} satisfies Meta<typeof Counter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    onClick: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const count0Button = canvas.getByRole('button', { name: /Count is 0/i });
    await expect(count0Button).toBeInTheDocument();
    await userEvent.click(count0Button);
    const count1Button = canvas.getByRole('button', { name: /Count is 1/i });
    await expect(count1Button).toBeInTheDocument();
  },
};
