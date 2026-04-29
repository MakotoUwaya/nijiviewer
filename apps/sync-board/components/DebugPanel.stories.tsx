import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DebugPanel } from './DebugPanel';

const meta = {
  component: DebugPanel,
  title: 'Components/DebugPanel',
} satisfies Meta<typeof DebugPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Connected: Story = {
  args: {
    nodes: [
      { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
      { id: 'n2', position: { x: 100, y: 100 }, data: { label: 'Node 2' } },
    ],
    edges: [{ id: 'e1', source: 'n1', target: 'n2' }],
    isConnected: true,
    peerCount: 3,
    lastSyncTime: new Date('2025-01-01T00:00:00Z'),
  },
};

export const Disconnected: Story = {
  args: {
    nodes: [],
    edges: [],
    isConnected: false,
    peerCount: 0,
    lastSyncTime: null,
  },
};
