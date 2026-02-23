import type { Edge, Node } from '@xyflow/react';
import type { LoroDoc, LoroMap } from 'loro-crdt';

export interface SyncedDoc {
  doc: LoroDoc;
  ws: WebSocket;
  getNodes: () => Node[];
  getEdges: () => Edge[];
  updateNodePosition: (nodeId: string, x: number, y: number) => void;
  addNode: (node: Node) => void;
  removeNodes: (nodeIds: string[]) => void;
  addEdge: (edge: Edge) => void;
  removeEdges: (edgeIds: string[]) => void;
  exportDocument: () => Uint8Array;
  importDocument: (data: Uint8Array) => void;
  resetDocument: (nodes: Node[], edges: Edge[]) => void;
  subscribe: (cb: () => void) => () => void;
  cleanup: () => void;
}

export async function createSyncedDoc(
  wsUrl: string,
  initialNodes: Node[],
  initialEdges: Edge[],
): Promise<SyncedDoc> {
  const loroModule = await import('loro-crdt');
  const { LoroDoc, LoroMap: LoroMapClass } = loroModule;
  const doc = new LoroDoc();

  function writeNode(nodesMap: LoroMap, node: Node) {
    const nodeMap = nodesMap.getOrCreateContainer(
      node.id,
      new LoroMapClass(),
    ) as LoroMap;
    nodeMap.set('id', node.id);
    nodeMap.set('label', (node.data.label as string) ?? node.id);
    nodeMap.set('x', node.position.x);
    nodeMap.set('y', node.position.y);
  }

  function writeEdge(edgesMap: LoroMap, edge: Edge) {
    const edgeMap = edgesMap.getOrCreateContainer(
      edge.id,
      new LoroMapClass(),
    ) as LoroMap;
    edgeMap.set('id', edge.id);
    edgeMap.set('source', edge.source);
    edgeMap.set('target', edge.target);
  }

  function readNodes(): Node[] {
    const nodesMap = doc.getMap('nodes');
    const nodes: Node[] = [];
    for (const [id] of nodesMap.entries()) {
      const nodeMap = nodesMap.get(id);
      if (!nodeMap || typeof (nodeMap as LoroMap).get !== 'function') continue;
      const m = nodeMap as LoroMap;
      nodes.push({
        id: (m.get('id') as string) ?? id,
        position: {
          x: (m.get('x') as number) ?? 0,
          y: (m.get('y') as number) ?? 0,
        },
        data: { label: (m.get('label') as string) ?? id },
      });
    }
    return nodes;
  }

  function readEdges(): Edge[] {
    const edgesMap = doc.getMap('edges');
    const edges: Edge[] = [];
    for (const [id] of edgesMap.entries()) {
      const edgeMap = edgesMap.get(id);
      if (!edgeMap || typeof (edgeMap as LoroMap).get !== 'function') continue;
      const m = edgeMap as LoroMap;
      edges.push({
        id: (m.get('id') as string) ?? id,
        source: (m.get('source') as string) ?? '',
        target: (m.get('target') as string) ?? '',
      });
    }
    return edges;
  }

  const ws = new WebSocket(wsUrl);
  ws.binaryType = 'arraybuffer';

  let unsubLocal: (() => void) | null = null;
  let suppressLocalUpdates = false;

  return new Promise<SyncedDoc>((resolve, reject) => {
    let initialized = false;

    ws.onmessage = (event) => {
      const data = new Uint8Array(event.data as ArrayBuffer);

      if (!initialized) {
        initialized = true;

        try {
          doc.import(data);
        } catch {
          // empty snapshot from fresh server — ignore
        }

        unsubLocal = doc.subscribeLocalUpdates((bytes) => {
          if (!suppressLocalUpdates && ws.readyState === WebSocket.OPEN) {
            ws.send(bytes);
          }
        });

        const nodesMap = doc.getMap('nodes');
        if (nodesMap.size === 0 && initialNodes.length > 0) {
          const edgesMap = doc.getMap('edges');
          for (const node of initialNodes) writeNode(nodesMap, node);
          for (const edge of initialEdges) writeEdge(edgesMap, edge);
          doc.commit();
        }

        resolve(syncedDoc);
        return;
      }

      try {
        suppressLocalUpdates = true;
        doc.import(data);
      } catch (e) {
        console.error('Failed to import remote update:', e);
      } finally {
        suppressLocalUpdates = false;
      }
    };

    ws.onerror = (e) => {
      if (!initialized) reject(e);
    };

    ws.onclose = () => {
      if (!initialized) reject(new Error('WebSocket closed before init'));
    };

    const syncedDoc: SyncedDoc = {
      doc,
      ws,
      getNodes: readNodes,
      getEdges: readEdges,
      updateNodePosition: (nodeId, x, y) => {
        const nodesMap = doc.getMap('nodes');
        const nodeMap = nodesMap.get(nodeId) as LoroMap | undefined;
        if (!nodeMap || typeof nodeMap.set !== 'function') return;
        nodeMap.set('x', x);
        nodeMap.set('y', y);
        doc.commit();
      },
      addNode: (node) => {
        const nodesMap = doc.getMap('nodes');
        writeNode(nodesMap, node);
        doc.commit();
      },
      removeNodes: (nodeIds) => {
        const nodesMap = doc.getMap('nodes');
        for (const id of nodeIds) {
          nodesMap.delete(id);
        }
        doc.commit();
      },
      addEdge: (edge) => {
        const edgesMap = doc.getMap('edges');
        writeEdge(edgesMap, edge);
        doc.commit();
      },
      removeEdges: (edgeIds) => {
        const edgesMap = doc.getMap('edges');
        for (const id of edgeIds) {
          edgesMap.delete(id);
        }
        doc.commit();
      },
      exportDocument: () => {
        return doc.export({ mode: 'snapshot' });
      },
      importDocument: (data) => {
        suppressLocalUpdates = true;
        try {
          doc.import(data);
        } finally {
          suppressLocalUpdates = false;
        }
      },
      resetDocument: (nodes, edges) => {
        const nodesMap = doc.getMap('nodes');
        const edgesMap = doc.getMap('edges');
        for (const [key] of nodesMap.entries()) {
          nodesMap.delete(key);
        }
        for (const [key] of edgesMap.entries()) {
          edgesMap.delete(key);
        }
        for (const node of nodes) writeNode(nodesMap, node);
        for (const edge of edges) writeEdge(edgesMap, edge);
        doc.commit();
      },
      subscribe: (cb) => {
        return doc.subscribe((_event) => {
          cb();
        });
      },
      cleanup: () => {
        unsubLocal?.();
        unsubLocal = null;
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      },
    };
  });
}
