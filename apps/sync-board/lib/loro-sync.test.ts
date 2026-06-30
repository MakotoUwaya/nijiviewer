import type { Edge, Node } from '@xyflow/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createSyncedDoc, type SyncedDoc } from './loro-sync';

const WS_OPEN = 1;
const WS_CLOSED = 3;

class MockWebSocket {
  static OPEN = WS_OPEN;
  static instances: MockWebSocket[] = [];

  readyState = WS_OPEN;
  binaryType = '';
  url: string;
  sent: Uint8Array[] = [];
  onopen: ((e: Event) => void) | null = null;
  onclose: ((e: Event) => void) | null = null;
  onerror: ((e: Event) => void) | null = null;
  onmessage: ((e: MessageEvent) => void) | null = null;

  constructor(url: string) {
    this.url = url;
    MockWebSocket.instances.push(this);
  }

  send(data: ArrayBuffer | ArrayBufferView): void {
    const view =
      data instanceof Uint8Array
        ? data
        : new Uint8Array(data instanceof ArrayBuffer ? data : data.buffer);
    this.sent.push(view.slice());
  }

  close(): void {
    this.readyState = WS_CLOSED;
  }

  emit(data: Uint8Array): void {
    this.onmessage?.({ data: data.buffer } as MessageEvent);
  }
}

const makeNode = (id: string, x = 0, y = 0, label?: string): Node => ({
  id,
  position: { x, y },
  data: { label: label ?? id },
});

const makeEdge = (id: string, source: string, target: string): Edge => ({
  id,
  source,
  target,
});

async function waitForWebSocket(index: number): Promise<MockWebSocket> {
  const deadline = Date.now() + 3000;
  while (Date.now() < deadline) {
    if (MockWebSocket.instances.length > index) {
      const ws = MockWebSocket.instances[index];
      // Handlers are attached after the dynamic `await import('loro-crdt')`
      // resolves; wait one extra microtask so onmessage is wired up before we
      // emit anything.
      await Promise.resolve();
      if (ws.onmessage || ws.onerror || ws.onclose) {
        return ws;
      }
    }
    await new Promise((r) => setTimeout(r, 10));
  }
  throw new Error('Timed out waiting for WebSocket constructor');
}

async function initialize(
  initialNodes: Node[],
  initialEdges: Edge[],
  initialSnapshot: Uint8Array = new Uint8Array(0),
): Promise<{ synced: SyncedDoc; ws: MockWebSocket }> {
  const wsIndex = MockWebSocket.instances.length;
  const promise = createSyncedDoc('ws://test', initialNodes, initialEdges);
  const ws = await waitForWebSocket(wsIndex);
  ws.emit(initialSnapshot);
  const synced = await promise;
  return { synced, ws };
}

describe('createSyncedDoc', () => {
  beforeEach(() => {
    MockWebSocket.instances = [];
    vi.stubGlobal('WebSocket', MockWebSocket);
  });

  afterEach(() => {
    for (const ws of MockWebSocket.instances) {
      if (ws.readyState !== WS_CLOSED) ws.close();
    }
    vi.unstubAllGlobals();
  });

  it('initializes the doc with the provided initial nodes and edges', async () => {
    const { synced } = await initialize(
      [makeNode('a', 10, 20, 'NodeA'), makeNode('b', 30, 40, 'NodeB')],
      [makeEdge('e1', 'a', 'b')],
    );

    const nodes = synced.getNodes().sort((x, y) => x.id.localeCompare(y.id));
    expect(nodes).toEqual([
      { id: 'a', position: { x: 10, y: 20 }, data: { label: 'NodeA' } },
      { id: 'b', position: { x: 30, y: 40 }, data: { label: 'NodeB' } },
    ]);
    expect(synced.getEdges()).toEqual([{ id: 'e1', source: 'a', target: 'b' }]);
  });

  it('skips populating the doc when an existing snapshot is received', async () => {
    const seedWsIndex = MockWebSocket.instances.length;
    const seedPromise = createSyncedDoc('ws://seed', [makeNode('seed')], []);
    const seedWs = await waitForWebSocket(seedWsIndex);
    seedWs.emit(new Uint8Array(0));
    const seedDoc = await seedPromise;
    const snapshot = seedDoc.exportDocument();
    seedDoc.cleanup();

    // New doc reuses the snapshot — initialNodes should be ignored.
    const { synced } = await initialize(
      [makeNode('should-be-ignored')],
      [],
      snapshot,
    );

    expect(synced.getNodes().map((n) => n.id)).toEqual(['seed']);
  });

  it('addNode appends a node and broadcasts the local update over ws', async () => {
    const { synced, ws } = await initialize([], []);

    synced.addNode(makeNode('x', 5, 6, 'X'));

    expect(synced.getNodes()).toEqual([
      { id: 'x', position: { x: 5, y: 6 }, data: { label: 'X' } },
    ]);
    expect(ws.sent.length).toBeGreaterThanOrEqual(1);
  });

  it('removeNodes deletes nodes from the doc', async () => {
    const { synced } = await initialize([makeNode('a'), makeNode('b')], []);

    synced.removeNodes(['a']);

    expect(synced.getNodes().map((n) => n.id)).toEqual(['b']);
  });

  it('updateNodePosition mutates only the targeted node', async () => {
    const { synced } = await initialize(
      [makeNode('a', 0, 0), makeNode('b', 100, 100)],
      [],
    );

    synced.updateNodePosition('a', 50, 75);

    const byId = Object.fromEntries(
      synced.getNodes().map((n) => [n.id, n.position]),
    );
    expect(byId.a).toEqual({ x: 50, y: 75 });
    expect(byId.b).toEqual({ x: 100, y: 100 });
  });

  it('updateNodePosition is a no-op when the node does not exist', async () => {
    const { synced } = await initialize([makeNode('a')], []);

    expect(() => synced.updateNodePosition('missing', 1, 2)).not.toThrow();
    expect(synced.getNodes()).toHaveLength(1);
  });

  it('addEdge / removeEdges mutate the edge collection', async () => {
    const { synced } = await initialize(
      [makeNode('a'), makeNode('b'), makeNode('c')],
      [],
    );

    synced.addEdge(makeEdge('e1', 'a', 'b'));
    synced.addEdge(makeEdge('e2', 'b', 'c'));
    expect(
      synced
        .getEdges()
        .map((e) => e.id)
        .sort(),
    ).toEqual(['e1', 'e2']);

    synced.removeEdges(['e1']);
    expect(synced.getEdges().map((e) => e.id)).toEqual(['e2']);
  });

  it('exportDocument + importDocument round-trips the state', async () => {
    const { synced: source } = await initialize(
      [makeNode('a', 1, 2, 'AA')],
      [makeEdge('e1', 'a', 'a')],
    );
    const snapshot = source.exportDocument();
    expect(snapshot).toBeInstanceOf(Uint8Array);
    expect(snapshot.length).toBeGreaterThan(0);

    const { synced: target } = await initialize([], []);
    target.importDocument(snapshot);

    expect(target.getNodes()).toEqual([
      { id: 'a', position: { x: 1, y: 2 }, data: { label: 'AA' } },
    ]);
    expect(target.getEdges()).toEqual([{ id: 'e1', source: 'a', target: 'a' }]);
  });

  it('resetDocument clears existing entries and replaces them', async () => {
    const { synced } = await initialize(
      [makeNode('old1'), makeNode('old2')],
      [makeEdge('old-edge', 'old1', 'old2')],
    );

    synced.resetDocument(
      [makeNode('new1', 9, 9, 'New')],
      [makeEdge('new-edge', 'new1', 'new1')],
    );

    expect(synced.getNodes()).toEqual([
      { id: 'new1', position: { x: 9, y: 9 }, data: { label: 'New' } },
    ]);
    expect(synced.getEdges()).toEqual([
      { id: 'new-edge', source: 'new1', target: 'new1' },
    ]);
  });

  it('subscribe fires the callback when the doc changes', async () => {
    const { synced } = await initialize([], []);
    const cb = vi.fn();
    const unsub = synced.subscribe(cb);

    synced.addNode(makeNode('a'));
    await new Promise((r) => setTimeout(r, 0));
    expect(cb).toHaveBeenCalled();

    unsub();
    cb.mockClear();
    synced.addNode(makeNode('b'));
    await new Promise((r) => setTimeout(r, 0));
    expect(cb).not.toHaveBeenCalled();
  });

  it('cleanup closes the open WebSocket', async () => {
    const { synced, ws } = await initialize([], []);

    synced.cleanup();

    expect(ws.readyState).toBe(WS_CLOSED);
  });

  it('cleanup leaves an already-closed WebSocket alone', async () => {
    const { synced, ws } = await initialize([], []);
    ws.readyState = WS_CLOSED;

    expect(() => synced.cleanup()).not.toThrow();
    expect(ws.readyState).toBe(WS_CLOSED);
  });

  it('does not forward remote updates back over the WebSocket', async () => {
    const { synced: source } = await initialize([makeNode('remote', 7, 8)], []);
    const remoteUpdate = source.exportDocument();

    const { synced: target, ws: targetWs } = await initialize([], []);
    const sentBefore = targetWs.sent.length;

    targetWs.emit(remoteUpdate);

    expect(target.getNodes()).toEqual([
      { id: 'remote', position: { x: 7, y: 8 }, data: { label: 'remote' } },
    ]);
    expect(targetWs.sent.length).toBe(sentBefore);
  });

  it('logs an error when a remote update cannot be imported', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { ws } = await initialize([], []);

    ws.emit(new Uint8Array([0xff, 0xff, 0xff, 0xff]));
    await new Promise((r) => setTimeout(r, 0));

    expect(errorSpy).toHaveBeenCalledWith(
      'Failed to import remote update:',
      expect.anything(),
    );
    errorSpy.mockRestore();
  });

  it('rejects when the WebSocket closes before initialization', async () => {
    const wsIndex = MockWebSocket.instances.length;
    const promise = createSyncedDoc('ws://failing', [], []);
    const ws = await waitForWebSocket(wsIndex);
    ws.onclose?.({} as Event);

    await expect(promise).rejects.toThrow(/closed before init/);
  });

  it('rejects when the WebSocket errors before initialization', async () => {
    const wsIndex = MockWebSocket.instances.length;
    const promise = createSyncedDoc('ws://failing', [], []);
    const ws = await waitForWebSocket(wsIndex);
    const err = new Event('error');
    ws.onerror?.(err);

    await expect(promise).rejects.toBe(err);
  });
});
