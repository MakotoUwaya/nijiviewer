'use client';

// WebAssemblyを使用するため動的レンダリングを強制
export const dynamic = 'force-dynamic';
// Loro CRDT uses WebAssembly, so we need Node.js runtime
export const runtime = 'nodejs';

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
import { useCallback, useEffect, useId, useState } from 'react';
import '@xyflow/react/dist/style.css';
import { useTheme } from 'next-themes';
import { DebugPanel } from '@/components/DebugPanel';
import { LoroFlowSync } from '@/components/LoroFlowSync';

const initialNodes: Node[] = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Node_1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: 'Node_2' } },
  { id: '3', position: { x: 200, y: 50 }, data: { label: 'Node_3' } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
];

export default function FlowSamplePage() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const { theme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const importFileId = useId();

  // Loro 同期機能
  const loroSync = LoroFlowSync({
    roomId: 'flow-sample-room',
    onNodesChange: setNodes,
    onEdgesChange: setEdges,
    initialNodes,
    initialEdges,
  });

  // クライアントサイドでのみテーマを適用
  useEffect(() => {
    setIsMounted(true);
    setIsDarkMode(theme === 'dark');
  }, [theme]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const updatedNodes = applyNodeChanges(changes, nodes);
      setNodes(updatedNodes);
      loroSync.updateNodes(updatedNodes);
    },
    [nodes, loroSync],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const updatedEdges = applyEdgeChanges(changes, edges);
      setEdges(updatedEdges);
      loroSync.updateEdges(updatedEdges);
    },
    [edges, loroSync],
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      const updatedEdges = addEdge(connection, edges);
      setEdges(updatedEdges);
      loroSync.updateEdges(updatedEdges);
    },
    [edges, loroSync],
  );

  // SSRの場合やマウント前は何もレンダリングしない安全策
  if (!isMounted || !loroSync.isConnected) {
    return (
      <div className="w-full h-screen">
        <h1 className="text-2xl font-bold mb-4 p-4">
          Sync Board (Loro + React Flow)
        </h1>
        <div className="w-full h-[80vh] flex items-center justify-center">
          <p>読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen">
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-2xl font-bold">Sync Board</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              const data = loroSync.exportDocument();
              if (data) {
                // ファイルとしてダウンロード
                const arrayBuffer = new ArrayBuffer(data.length);
                const view = new Uint8Array(arrayBuffer);
                view.set(data);
                const blob = new Blob([arrayBuffer], {
                  type: 'application/octet-stream',
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'flow-document.bin';
                a.click();
                URL.revokeObjectURL(url);
              }
            }}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Export
          </button>
          <input
            type="file"
            accept=".bin,.loro"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  const data = new Uint8Array(
                    event.target?.result as ArrayBuffer,
                  );
                  loroSync.importDocument(data);
                };
                reader.readAsArrayBuffer(file);
              }
            }}
            className="hidden"
            id={importFileId}
          />
          <label
            htmlFor={importFileId}
            className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 cursor-pointer"
          >
            Import
          </label>
          <button
            type="button"
            onClick={() => {
              // デモ用: 新しいノードを追加
              const newNode: Node = {
                id: `node-${Date.now()}`,
                position: { x: Math.random() * 300, y: Math.random() * 300 },
                data: { label: `Node ${Date.now()}` },
              };

              const updatedNodes = [...nodes, newNode];
              setNodes(updatedNodes);
              loroSync.updateNodes(updatedNodes);
            }}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add Node
          </button>
          <button
            type="button"
            onClick={loroSync.resetDocument}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Reset
          </button>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${loroSync.isConnected ? 'bg-green-500' : 'bg-red-500'}`}
            />
            <span className="text-sm">
              {loroSync.isConnected
                ? `Connected (${loroSync.peerCount})`
                : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>
      <div className="w-full h-[calc(100vh-80px)]">
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
      </div>
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
      <DebugPanel
        nodes={nodes}
        edges={edges}
        isConnected={loroSync.isConnected}
        peerCount={loroSync.peerCount}
        lastSyncTime={loroSync.lastSyncTime}
      />
    </div>
  );
}
