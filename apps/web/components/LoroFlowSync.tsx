'use client';

import type { Edge, Node } from '@xyflow/react';
import { LoroDoc, type LoroList } from 'loro-crdt';
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

  const docRef = useRef<LoroDoc | null>(null);
  const nodesContainerRef = useRef<LoroList | null>(null);
  const edgesContainerRef = useRef<LoroList | null>(null);
  const isUpdatingFromLoroRef = useRef(false);

  // Loro document の初期化
  useEffect(() => {
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
        initialNodes.forEach((node) => nodesContainer.push(node));
        initialEdges.forEach((edge) => edgesContainer.push(edge));
      }
    } else {
      // 初期データを設定
      initialNodes.forEach((node) => nodesContainer.push(node));
      initialEdges.forEach((edge) => edgesContainer.push(edge));
    }

    // Loro からの変更を監視
    const unsubscribe = doc.subscribe(() => {
      if (isUpdatingFromLoroRef.current) return;

      const updatedNodes = nodesContainer.toJSON() as Node[];
      const updatedEdges = edgesContainer.toJSON() as Edge[];

      onNodesChange(updatedNodes);
      onEdgesChange(updatedEdges);

      // 自動保存
      const data = doc.exportSnapshot();
      localStorage.setItem(
        `loro-flow-${roomId}`,
        JSON.stringify(Array.from(data)),
      );
    });

    // 初期状態を通知
    onNodesChange(nodesContainer.toJSON() as Node[]);
    onEdgesChange(edgesContainer.toJSON() as Edge[]);
    setIsConnected(true);

    // 他のタブとの同期を監視
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `loro-flow-${roomId}` && e.newValue) {
        try {
          const data = new Uint8Array(JSON.parse(e.newValue));
          doc.import(data);
        } catch (error) {
          console.error('Failed to sync from other tab:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
      docRef.current = null;
      nodesContainerRef.current = null;
      edgesContainerRef.current = null;
    };
  }, [roomId, onNodesChange, onEdgesChange, initialNodes, initialEdges]);

  // ノードを更新
  const updateNodes = useCallback((nodes: Node[]) => {
    if (!nodesContainerRef.current) return;

    isUpdatingFromLoroRef.current = true;
    nodesContainerRef.current.clear();
    nodes.forEach((node) => {
      nodesContainerRef.current?.push(node);
    });
    isUpdatingFromLoroRef.current = false;
  }, []);

  // エッジを更新
  const updateEdges = useCallback((edges: Edge[]) => {
    if (!edgesContainerRef.current) return;

    isUpdatingFromLoroRef.current = true;
    edgesContainerRef.current.clear();
    edges.forEach((edge) => {
      edgesContainerRef.current?.push(edge);
    });
    isUpdatingFromLoroRef.current = false;
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
    if (!nodesContainerRef.current || !edgesContainerRef.current) return;

    isUpdatingFromLoroRef.current = true;
    nodesContainerRef.current.clear();
    edgesContainerRef.current.clear();

    initialNodes.forEach((node) => {
      nodesContainerRef.current?.push(node);
    });
    initialEdges.forEach((edge) => {
      edgesContainerRef.current?.push(edge);
    });

    isUpdatingFromLoroRef.current = false;
    localStorage.removeItem(`loro-flow-${roomId}`);
  }, [roomId, initialNodes, initialEdges]);

  return {
    isConnected,
    peerCount,
    updateNodes,
    updateEdges,
    exportDocument,
    importDocument,
    resetDocument,
  };
}
