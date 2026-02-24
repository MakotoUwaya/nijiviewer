'use client';

import { type Node, ReactFlowProvider } from '@xyflow/react';
import { useEffect, useId, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { DebugPanel } from '@/components/DebugPanel';
import { FlowPanel } from '@/components/FlowPanel';
import { type SyncedDoc, createSyncedDoc } from '@/lib/loro-sync';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:3001';

const initialNodes: Node[] = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Node_1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: 'Node_2' } },
  { id: '3', position: { x: 200, y: 50 }, data: { label: 'Node_3' } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
];

type ConnectionState = 'connecting' | 'connected' | 'disconnected';

export default function FlowSamplePage() {
  const [syncedDoc, setSyncedDoc] = useState<SyncedDoc | null>(null);
  const [connectionState, setConnectionState] =
    useState<ConnectionState>('connecting');
  const peerCount = 0;
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const { theme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const importFileId = useId();
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    setIsMounted(true);
    setIsDarkMode(theme === 'dark');
  }, [theme]);

  useEffect(() => {
    if (!isMounted) return;

    let cancelled = false;

    const connect = async () => {
      setConnectionState('connecting');
      try {
        const doc = await createSyncedDoc(WS_URL, initialNodes, initialEdges);
        if (cancelled) {
          doc.cleanup();
          return;
        }

        cleanupRef.current = doc.cleanup;
        setSyncedDoc(doc);
        setConnectionState('connected');

        doc.subscribe(() => {
          setLastSyncTime(new Date());
        });

        doc.ws.onclose = () => {
          if (!cancelled) {
            setConnectionState('disconnected');
            setSyncedDoc(null);
          }
        };
      } catch {
        if (!cancelled) {
          setConnectionState('disconnected');
        }
      }
    };

    connect();

    return () => {
      cancelled = true;
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [isMounted]);

  if (!isMounted || connectionState === 'connecting') {
    return (
      <div className="w-full h-screen">
        <h1 className="text-2xl font-bold mb-4 p-4">
          Sync Board (Loro + React Flow)
        </h1>
        <div className="w-full h-[80vh] flex items-center justify-center">
          <p>{connectionState === 'connecting' ? 'サーバーに接続中...' : '読み込み中...'}</p>
        </div>
      </div>
    );
  }

  if (connectionState === 'disconnected' || !syncedDoc) {
    return (
      <div className="w-full h-screen">
        <h1 className="text-2xl font-bold mb-4 p-4">
          Sync Board (Loro + React Flow)
        </h1>
        <div className="w-full h-[80vh] flex items-center justify-center flex-col gap-4">
          <p>WebSocket サーバーに接続できません</p>
          <p className="text-sm text-gray-500">
            {WS_URL} に接続を試みています。サーバーが起動しているか確認してください。
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
          >
            再接続
          </button>
        </div>
      </div>
    );
  }

  return (
    <ReactFlowProvider>
      <div className="w-full h-full flex flex-col">
        <div className="flex justify-between items-center p-4 border-b shrink-0">
          <h1 className="text-2xl font-bold">Sync Board</h1>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                const data = syncedDoc.exportDocument();
                const blob = new Blob([new Uint8Array(data)], {
                  type: 'application/octet-stream',
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'flow-document.bin';
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
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
                    syncedDoc.importDocument(data);
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
                const [rx, ry] = crypto.getRandomValues(new Uint32Array(2));
                const newNode: Node = {
                  id: `node-${Date.now()}`,
                  position: {
                    x: (rx / 0xffffffff) * 300,
                    y: (ry / 0xffffffff) * 300,
                  },
                  data: { label: `Node ${Date.now()}` },
                };
                syncedDoc.addNode(newNode);
              }}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
            >
              Add Node
            </button>
            <button
              type="button"
              onClick={() =>
                syncedDoc.resetDocument(initialNodes, initialEdges)
              }
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
            >
              Reset
            </button>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  connectionState === 'connected'
                    ? 'bg-green-500'
                    : 'bg-red-500'
                }`}
              />
              <span className="text-sm">
                {connectionState === 'connected'
                  ? 'Connected'
                  : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex-1 w-full relative">
          <FlowPanel syncedDoc={syncedDoc} isDarkMode={isDarkMode} />
        </div>
        <DebugPanel
          nodes={syncedDoc.getNodes()}
          edges={syncedDoc.getEdges()}
          isConnected={connectionState === 'connected'}
          peerCount={peerCount}
          lastSyncTime={lastSyncTime}
        />
      </div>
    </ReactFlowProvider>
  );
}
