'use client';

import type { Edge, Node } from '@xyflow/react';
import type { LoroDoc, LoroList } from 'loro-crdt';
import { useCallback, useEffect, useRef, useState } from 'react';

interface LoroFlowSyncProps {
  roomId: string;
  onNodesChange: (nodes: Node[]) => void;
  onEdgesChange: (edges: Edge[]) => void;
  initialNodes?: Node[];
  initialEdges?: Edge[];
}

export function LoroFlowSync({
  roomId,
  onNodesChange,
  onEdgesChange,
  initialNodes = [],
  initialEdges = [],
}: LoroFlowSyncProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [peerCount, setPeerCount] = useState(1);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  const docRef = useRef<LoroDoc | null>(null);
  const nodesContainerRef = useRef<LoroList | null>(null);
  const edgesContainerRef = useRef<LoroList | null>(null);
  const isUpdatingFromLoroRef = useRef(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  // Loro document の初期化
  useEffect(() => {
    // Ensure we're running in the browser with WebAssembly support
    if (typeof window === 'undefined' || typeof WebAssembly === 'undefined')
      return;

    let storageCleanup: (() => void) | null = null;

    const initLoro = async () => {
      try {
        // Dynamic import with error handling for edge runtime compatibility
        const loroModule = await import('loro-crdt');
        const { LoroDoc } = loroModule;
        const doc = new LoroDoc();
        const nodesContainer = doc.getList('nodes');
        const edgesContainer = doc.getList('edges');

        docRef.current = doc;
        nodesContainerRef.current = nodesContainer;
        edgesContainerRef.current = edgesContainer;

        // 既存のデータを読み込み
        const savedData = localStorage.getItem(`loro-flow-${roomId}`);
        if (savedData) {
          try {
            const data = new Uint8Array(JSON.parse(savedData));
            doc.import(data);
          } catch (error) {
            console.error('Failed to load saved data:', error);
            // 初期データを設定
            if (initialNodes.length > 0 || initialEdges.length > 0) {
              isUpdatingFromLoroRef.current = true;
              nodesContainer.clear();
              edgesContainer.clear();
              for (const node of initialNodes) {
                nodesContainer.push(node);
              }
              for (const edge of initialEdges) {
                edgesContainer.push(edge);
              }
              isUpdatingFromLoroRef.current = false;
            }
          }
        } else if (initialNodes.length > 0 || initialEdges.length > 0) {
          // 初期データを設定
          isUpdatingFromLoroRef.current = true;
          for (const node of initialNodes) {
            nodesContainer.push(node);
          }
          for (const edge of initialEdges) {
            edgesContainer.push(edge);
          }
          isUpdatingFromLoroRef.current = false;
        }

        // Loro からの変更を監視
        const unsubscribe = doc.subscribe(() => {
          if (isUpdatingFromLoroRef.current) return;

          const updatedNodes = nodesContainer.toJSON() as Node[];
          const updatedEdges = edgesContainer.toJSON() as Edge[];

          onNodesChange(updatedNodes);
          onEdgesChange(updatedEdges);

          // 自動保存
          try {
            const data = doc.exportSnapshot();
            localStorage.setItem(
              `loro-flow-${roomId}`,
              JSON.stringify(Array.from(data)),
            );

            // Broadcast to other tabs
            if (broadcastChannelRef.current) {
              broadcastChannelRef.current.postMessage({
                type: 'loro-update',
                data: Array.from(data),
              });
            }
          } catch (error) {
            console.error('Failed to save data:', error);
          }
        });

        unsubscribeRef.current = unsubscribe;

        // 初期状態を通知
        const currentNodes = nodesContainer.toJSON() as Node[];
        const currentEdges = edgesContainer.toJSON() as Edge[];
        onNodesChange(currentNodes);
        onEdgesChange(currentEdges);
        setIsConnected(true);

        // Simulate peer counting with localStorage
        const updatePeerCount = () => {
          const now = Date.now();
          const peers = JSON.parse(
            localStorage.getItem(`loro-peers-${roomId}`) || '{}',
          );
          peers[`${window.location.href}-${now}`] = now;

          // Clean up old peers (older than 10 seconds)
          for (const key of Object.keys(peers)) {
            if (now - peers[key] > 10000) {
              delete peers[key];
            }
          }

          localStorage.setItem(`loro-peers-${roomId}`, JSON.stringify(peers));
          setPeerCount(Object.keys(peers).length);
        };

        // 他のタブとの同期を監視
        const handleStorageChange = (e: StorageEvent) => {
          if (e.key === `loro-flow-${roomId}` && e.newValue && docRef.current) {
            try {
              const data = new Uint8Array(JSON.parse(e.newValue));
              isUpdatingFromLoroRef.current = true;
              docRef.current.import(data);
              isUpdatingFromLoroRef.current = false;
            } catch (error) {
              console.error('Failed to sync from other tab:', error);
            }
          }
        };

        window.addEventListener('storage', handleStorageChange);

        // BroadcastChannel for better cross-tab communication
        const broadcastChannel = new BroadcastChannel(`loro-flow-${roomId}`);
        broadcastChannelRef.current = broadcastChannel;

        broadcastChannel.addEventListener('message', (event) => {
          if (
            event.data.type === 'loro-update' &&
            event.data.data &&
            docRef.current
          ) {
            try {
              const data = new Uint8Array(event.data.data);
              isUpdatingFromLoroRef.current = true;
              docRef.current.import(data);
              isUpdatingFromLoroRef.current = false;
              setLastSyncTime(new Date());
            } catch (error) {
              console.error('Failed to sync from broadcast:', error);
            }
          }
        });

        updatePeerCount();
        const peerInterval = setInterval(updatePeerCount, 2000);

        storageCleanup = () => {
          window.removeEventListener('storage', handleStorageChange);
          broadcastChannel.close();
          clearInterval(peerInterval);
        };
      } catch (error) {
        console.error('Failed to initialize Loro:', error);
        setIsConnected(false);
        // Fallback: still notify with initial data even if Loro fails
        if (initialNodes.length > 0 || initialEdges.length > 0) {
          onNodesChange(initialNodes);
          onEdgesChange(initialEdges);
        }
      }
    };

    initLoro();

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      if (storageCleanup) {
        storageCleanup();
      }
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close();
        broadcastChannelRef.current = null;
      }
      docRef.current = null;
      nodesContainerRef.current = null;
      edgesContainerRef.current = null;
      setIsConnected(false);
    };
  }, [roomId, onNodesChange, onEdgesChange, initialNodes, initialEdges]);

  // ノードを更新
  const updateNodes = useCallback((nodes: Node[]) => {
    if (!nodesContainerRef.current || !docRef.current) return;

    try {
      isUpdatingFromLoroRef.current = true;
      nodesContainerRef.current.clear();
      for (const node of nodes) {
        nodesContainerRef.current.push(node);
      }
    } catch (error) {
      console.error('Failed to update nodes:', error);
    } finally {
      isUpdatingFromLoroRef.current = false;
    }
  }, []);

  // エッジを更新
  const updateEdges = useCallback((edges: Edge[]) => {
    if (!edgesContainerRef.current || !docRef.current) return;

    try {
      isUpdatingFromLoroRef.current = true;
      edgesContainerRef.current.clear();
      for (const edge of edges) {
        edgesContainerRef.current.push(edge);
      }
    } catch (error) {
      console.error('Failed to update edges:', error);
    } finally {
      isUpdatingFromLoroRef.current = false;
    }
  }, []);

  // ドキュメントをエクスポート
  const exportDocument = useCallback(() => {
    if (!docRef.current) return null;
    return docRef.current.exportSnapshot();
  }, []);

  // ドキュメントをインポート
  const importDocument = useCallback((data: Uint8Array) => {
    if (!docRef.current) return;
    docRef.current.import(data);
  }, []);

  // 状態をリセット
  const resetDocument = useCallback(() => {
    if (
      !nodesContainerRef.current ||
      !edgesContainerRef.current ||
      !docRef.current
    )
      return;

    try {
      isUpdatingFromLoroRef.current = true;
      nodesContainerRef.current.clear();
      edgesContainerRef.current.clear();

      for (const node of initialNodes) {
        nodesContainerRef.current.push(node);
      }
      for (const edge of initialEdges) {
        edgesContainerRef.current.push(edge);
      }

      localStorage.removeItem(`loro-flow-${roomId}`);
    } catch (error) {
      console.error('Failed to reset document:', error);
    } finally {
      isUpdatingFromLoroRef.current = false;
    }
  }, [roomId, initialNodes, initialEdges]);

  return {
    isConnected,
    peerCount,
    lastSyncTime,
    updateNodes,
    updateEdges,
    exportDocument,
    importDocument,
    resetDocument,
  };
}
