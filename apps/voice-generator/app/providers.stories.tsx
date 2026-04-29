import type { Meta, StoryObj } from '@storybook/react';
import { Providers } from './providers';

const meta = {
  component: Providers,
  title: 'App/Providers',
} satisfies Meta<typeof Providers>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithChildren: Story = {
  args: {
    children: (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold">Voice Generator</h1>
        <p className="mt-2 text-gray-400">HeroUI + next-themes provider</p>
      </div>
    ),
  },
};
