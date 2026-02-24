'use client';

import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  type Connection,
  Controls,
  type Edge,
  type EdgeChange,
  MiniMap,
  type Node,
  type NodeChange,
  ReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useEffect, useState } from 'react';
import type { SyncedDoc } from '@/lib/loro-sync';

interface FlowPanelProps {
  syncedDoc: SyncedDoc;
  isDarkMode: boolean;
}

export function FlowPanel({ syncedDoc, isDarkMode }: FlowPanelProps) {
  const [nodes, setNodes] = useState<Node[]>(() => syncedDoc.getNodes());
  const [edges, setEdges] = useState<Edge[]>(() => syncedDoc.getEdges());

  useEffect(() => {
    const unsub = syncedDoc.subscribe(() => {
      setNodes(syncedDoc.getNodes());
      setEdges(syncedDoc.getEdges());
    });
    return unsub;
  }, [syncedDoc]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const updated = applyNodeChanges(changes, nodes);
      setNodes(updated);

      for (const change of changes) {
        if (change.type === 'position' && change.position) {
          syncedDoc.updateNodePosition(
            change.id,
            change.position.x,
            change.position.y,
          );
        }
        if (change.type === 'remove') {
          syncedDoc.removeNodes([change.id]);
        }
      }
    },
    [nodes, syncedDoc],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const updated = applyEdgeChanges(changes, edges);
      setEdges(updated);

      const removedIds = changes
        .filter((c) => c.type === 'remove')
        .map((c) => c.id);
      if (removedIds.length > 0) {
        syncedDoc.removeEdges(removedIds);
      }
    },
    [edges, syncedDoc],
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge: Edge = {
        id: `e${connection.source}-${connection.target}`,
        source: connection.source,
        target: connection.target,
      };
      setEdges((eds) => addEdge(connection, eds));
      syncedDoc.addEdge(newEdge);
    },
    [syncedDoc],
  );

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        className={isDarkMode ? 'dark-flow' : ''}
      >
        <Controls className={isDarkMode ? 'dark-flow-controls' : ''} />
        <MiniMap className={isDarkMode ? 'dark-flow-minimap' : ''} />
        <Background gap={12} size={1} color={isDarkMode ? '#555' : '#ccc'} />
      </ReactFlow>
      <style jsx global>{`
        .dark-flow .react-flow__node {
          background-color: #333;
          color: #fff;
          border-color: #555;
        }
        .dark-flow .react-flow__handle {
          background-color: #666;
          border-color: #888;
        }
        .dark-flow .react-flow__edge-path {
          stroke: #888;
        }
        .dark-flow-controls {
          background-color: #333 !important;
          border-color: #555 !important;
        }
        .dark-flow-controls button {
          background-color: #444 !important;
          color: #fff !important;
          border-color: #666 !important;
        }
        .dark-flow-controls button:hover {
          background-color: #555 !important;
        }
        .dark-flow-minimap {
          background-color: #333 !important;
          border-color: #555 !important;
        }
      `}</style>
    </>
  );
}
