'use client';

// NOTE: 下記の記事に従って React Flow を使ったサンプルページを作成
// https://reactflow.dev/learn
// https://zenn.dev/b13o/articles/tutorial-react-flow

import {
  Background,
  type Connection,
  Controls,
  type Edge,
  type EdgeChange,
  MiniMap,
  type Node,
  type NodeChange,
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from '@xyflow/react';
import { useCallback, useEffect, useState } from 'react';
import '@xyflow/react/dist/style.css';
import { useTheme } from 'next-themes';

const initialNodes: Node[] = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'ノード1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: 'ノード2' } },
  { id: '3', position: { x: 200, y: 50 }, data: { label: 'ノード3' } },
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

  // クライアントサイドでのみテーマを適用
  useEffect(() => {
    setIsMounted(true);
    setIsDarkMode(theme === 'dark');
  }, [theme]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((ns) => applyNodeChanges(changes, ns)),
    [],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((es) => applyEdgeChanges(changes, es)),
    [],
  );

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [],
  );

  // SSRの場合やマウント前は何もレンダリングしない安全策
  if (!isMounted) {
    return (
      <div className="w-full h-screen">
        <h1 className="text-2xl font-bold mb-4 p-4">React Flow サンプル</h1>
        <div className="w-full h-[80vh] flex items-center justify-center">
          <p>読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen">
      <h1 className="text-2xl font-bold mb-4 p-4">React Flow サンプル</h1>
      <div className="w-full h-[80vh]">
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
    </div>
  );
}
