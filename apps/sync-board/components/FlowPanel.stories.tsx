import type { Meta, StoryObj } from '@storybook/react';
import type { Edge, Node } from '@xyflow/react';
import type { SyncedDoc } from '@/lib/loro-sync';
import { FlowPanel } from './FlowPanel';

function createMockSyncedDoc(
  initialNodes: Node[],
  initialEdges: Edge[],
): SyncedDoc {
  let nodes = [...initialNodes];
  let edges = [...initialEdges];
  const subscribers = new Set<() => void>();
  const notify = () => {
    for (const cb of subscribers) cb();
  };

  return {
    doc: {} as SyncedDoc['doc'],
    ws: {} as SyncedDoc['ws'],
    getNodes: () => nodes,
    getEdges: () => edges,
    updateNodePosition: (id, x, y) => {
      nodes = nodes.map((n) =>
        n.id === id ? { ...n, position: { x, y } } : n,
      );
      notify();
    },
    addNode: (node) => {
      nodes = [...nodes, node];
      notify();
    },
    removeNodes: (ids) => {
      nodes = nodes.filter((n) => !ids.includes(n.id));
      notify();
    },
    addEdge: (edge) => {
      edges = [...edges, edge];
      notify();
    },
    removeEdges: (ids) => {
      edges = edges.filter((e) => !ids.includes(e.id));
      notify();
    },
    exportDocument: () => new Uint8Array(),
    importDocument: () => {},
    resetDocument: (n, e) => {
      nodes = [...n];
      edges = [...e];
      notify();
    },
    subscribe: (cb) => {
      subscribers.add(cb);
      return () => {
        subscribers.delete(cb);
      };
    },
    cleanup: () => {
      subscribers.clear();
    },
  };
}

const meta = {
  component: FlowPanel,
  title: 'Components/FlowPanel',
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100vw', height: '100vh' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FlowPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Light: Story = {
  args: {
    syncedDoc: createMockSyncedDoc(
      [
        { id: '1', position: { x: 100, y: 100 }, data: { label: 'Node 1' } },
        { id: '2', position: { x: 300, y: 200 }, data: { label: 'Node 2' } },
      ],
      [{ id: 'e1-2', source: '1', target: '2' }],
    ),
    isDarkMode: false,
  },
};

export const Dark: Story = {
  args: {
    syncedDoc: createMockSyncedDoc(
      [
        { id: '1', position: { x: 100, y: 100 }, data: { label: 'Node 1' } },
        { id: '2', position: { x: 300, y: 200 }, data: { label: 'Node 2' } },
      ],
      [{ id: 'e1-2', source: '1', target: '2' }],
    ),
    isDarkMode: true,
  },
};
