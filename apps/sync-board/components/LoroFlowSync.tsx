'use client';

import type { Edge, Node } from '@xyflow/react';
import type { LoroDoc, LoroList } from 'loro-crdt';
import { useCallback, useEffect, useRef, useState } from 'react';

function hasExportSnapshot(
  doc: unknown,
): doc is { exportSnapshot: () => Uint8Array } {
  return (
    typeof doc === 'object' &&
    doc !== null &&
    'exportSnapshot' in doc &&
    // biome-ignore lint/suspicious/noExplicitAny: <>
    typeof (doc as any).exportSnapshot === 'function'
  );
}
function hasExport(doc: unknown): doc is { export: () => Uint8Array } {
  return (
    typeof doc === 'object' &&
    doc !== null &&
    'export' in doc &&
    // biome-ignore lint/suspicious/noExplicitAny: <>
    typeof (doc as any).export === 'function'
  );
}
const getDocData = (doc: unknown): Uint8Array | null => {
  if (hasExportSnapshot(doc)) return doc.exportSnapshot();
  if (hasExport(doc)) return doc.export();
  return null;
};

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
  const peerMapRef = useRef(new Map<string, number>());
  const peerIdRef = useRef<string>('');

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
            localStorage.removeItem(`loro-flow-${roomId}`);
          }
        }

        // 初期データを設定（ドキュメントが空の場合のみ）
        const existingNodes = nodesContainer.toJSON() as Node[];
        if (existingNodes.length === 0 && initialNodes.length > 0) {
          isUpdatingFromLoroRef.current = true;
          for (const node of initialNodes) {
            nodesContainer.push(node);
          }
          doc.commit();
          isUpdatingFromLoroRef.current = false;
        }

        const existingEdges = edgesContainer.toJSON() as Edge[];
        if (existingEdges.length === 0 && initialEdges.length > 0) {
          isUpdatingFromLoroRef.current = true;
          for (const edge of initialEdges) {
            edgesContainer.push(edge);
          }
          doc.commit();
          isUpdatingFromLoroRef.current = false;
        }

        // 初期状態を通知
        setIsConnected(true);
        const currentNodes = nodesContainer.toJSON() as Node[];
        const currentEdges = edgesContainer.toJSON() as Edge[];
        onNodesChange(currentNodes);
        onEdgesChange(currentEdges);

        // Loro からの変更を監視
        const unsubscribe = doc.subscribe((_event) => {
          if (isUpdatingFromLoroRef.current) return;

          const updatedNodes = nodesContainer.toJSON() as Node[];
          const updatedEdges = edgesContainer.toJSON() as Edge[];

          onNodesChange(updatedNodes);
          onEdgesChange(updatedEdges);

          // 自動保存
          try {
            const data = getDocData(doc);
            if (!data) throw new Error('No snapshot available');
            const dataString = JSON.stringify(Array.from(data));

            // 現在のlocalStorageの値と比較
            const currentSavedData = localStorage.getItem(
              `loro-flow-${roomId}`,
            );
            if (currentSavedData !== dataString) {
              localStorage.setItem(`loro-flow-${roomId}`, dataString);

              // Broadcast to other tabs
              if (broadcastChannelRef.current) {
                broadcastChannelRef.current.postMessage({
                  type: 'loro-update',
                  data: Array.from(data),
                });
              }
            }
          } catch (error) {
            console.error('Failed to save data:', error);
          }
        });

        unsubscribeRef.current = unsubscribe;

        // ピアカウント管理
        const peerId = `${window.location.href}-${Date.now()}-${Math.random()}`;
        peerIdRef.current = peerId;
        const peerMap = peerMapRef.current;
        let peerCleanupInterval: NodeJS.Timeout;

        const updatePeerCount = () => {
          const now = Date.now();
          // 自分のピア情報を更新
          peerMap.set(peerId, now);

          // 古いピア情報をクリーンアップ
          for (const [id, timestamp] of Array.from(peerMap.entries())) {
            if (now - timestamp > 10000) {
              peerMap.delete(id);
            }
          }

          setPeerCount(peerMap.size);
        };

        // BroadcastChannel for better cross-tab communication
        const broadcastChannel = new BroadcastChannel(`loro-flow-${roomId}`);
        broadcastChannelRef.current = broadcastChannel;

        // ピア管理用のメッセージハンドラ
        const handlePeerMessage = (event: MessageEvent) => {
          const { type, peerId: messagePeerId, timestamp } = event.data;
          const peerMap = peerMapRef.current;

          if (type === 'peer-join') {
            peerMap.set(messagePeerId, timestamp);
            updatePeerCount();
          } else if (type === 'peer-leave') {
            peerMap.delete(messagePeerId);
            updatePeerCount();
          } else if (
            type === 'loro-update' &&
            event.data.data &&
            docRef.current
          ) {
            try {
              const data = new Uint8Array(event.data.data);
              // localStorage経由の更新と重複しないようにチェック
              const currentData = docRef.current
                ? getDocData(docRef.current)
                : null;
              if (!currentData || data.toString() !== currentData.toString()) {
                isUpdatingFromLoroRef.current = true;
                docRef.current.import(data);
                isUpdatingFromLoroRef.current = false;
                setLastSyncTime(new Date());
              }
            } catch (error) {
              console.error('Failed to sync from broadcast:', error);
            }
          }
        };

        broadcastChannel.addEventListener('message', handlePeerMessage);

        // ピア参加を通知
        broadcastChannel.postMessage({
          type: 'peer-join',
          peerId,
          timestamp: Date.now(),
        });

        // ピアカウントの定期更新
        updatePeerCount();
        peerCleanupInterval = setInterval(updatePeerCount, 2000);

        storageCleanup = () => {
          // ピア退出を通知
          if (broadcastChannelRef.current) {
            broadcastChannelRef.current.postMessage({
              type: 'peer-leave',
              peerId: peerIdRef.current,
              timestamp: Date.now(),
            });
          }
          broadcastChannel.close();
          clearInterval(peerCleanupInterval);
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
      docRef.current.commit();
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
      docRef.current.commit();
    } catch (error) {
      console.error('Failed to update edges:', error);
    } finally {
      isUpdatingFromLoroRef.current = false;
    }
  }, []);

  // ドキュメントをエクスポート
  const exportDocument = useCallback(() => {
    if (!docRef.current) return null;
    return getDocData(docRef.current);
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
