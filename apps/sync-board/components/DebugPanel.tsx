'use client';

import type { Edge, Node } from '@xyflow/react';

interface DebugPanelProps {
  nodes: Node[];
  edges: Edge[];
  isConnected: boolean;
  peerCount: number;
  lastSyncTime?: Date | null;
}

export function DebugPanel({
  nodes,
  edges,
  isConnected,
  peerCount,
  lastSyncTime,
}: DebugPanelProps) {
  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4 shadow-lg max-w-sm">
      <h3 className="text-sm font-semibold mb-2">Debug Info</h3>
      <div className="text-xs space-y-1">
        <div>
          Status:
          <span
            className={`ml-1 ${isConnected ? 'text-green-600' : 'text-red-600'}`}
          >
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        <div>Peers: {peerCount}</div>
        <div>Nodes: {nodes.length}</div>
        <div>Edges: {edges.length}</div>
        <div>Last Update: {new Date().toLocaleTimeString()}</div>
        {lastSyncTime && (
          <div>Last Sync: {lastSyncTime.toLocaleTimeString()}</div>
        )}
        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
          <div className="text-xs text-gray-500">
            <div>• Open in multiple browsers/devices</div>
            <div>• Add/move nodes in one browser</div>
            <div>• Watch changes sync via WebSocket</div>
          </div>
        </div>
      </div>
    </div>
  );
}
