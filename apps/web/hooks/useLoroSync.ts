import type { LoroDoc } from 'loro-crdt';
import { useCallback, useEffect, useRef, useState } from 'react';

interface LoroSyncOptions {
  roomId: string;
  onDocumentUpdate?: (doc: LoroDoc) => void;
}

export function useLoroSync({ roomId, onDocumentUpdate }: LoroSyncOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const docRef = useRef<LoroDoc | null>(null);

  // WebSocket接続の初期化（デモ用のローカル実装）
  const connect = useCallback(() => {
    // 実際の実装では WebSocket サーバーに接続
    // ここではローカルストレージを使った簡易同期をデモ
    setIsConnected(true);

    // ローカルストレージから既存のドキュメントを読み込み
    const savedDoc = localStorage.getItem(`loro-doc-${roomId}`);
    if (savedDoc && docRef.current) {
      try {
        const data = new Uint8Array(JSON.parse(savedDoc));
        docRef.current.import(data);
        onDocumentUpdate?.(docRef.current);
      } catch (error) {
        console.error('Failed to load saved document:', error);
      }
    }
  }, [roomId, onDocumentUpdate]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const sendUpdate = useCallback(
    (doc: LoroDoc) => {
      if (!isConnected) return;

      // 実際の実装では WebSocket でアップデートを送信
      // ここではローカルストレージに保存
      try {
        const data = doc.export({ mode: 'snapshot' });
        localStorage.setItem(
          `loro-doc-${roomId}`,
          JSON.stringify(Array.from(data)),
        );

        // 他のタブ/ウィンドウに変更を通知
        window.dispatchEvent(
          new CustomEvent('loro-update', {
            detail: { roomId, data: Array.from(data) },
          }),
        );
      } catch (error) {
        console.error('Failed to save document:', error);
      }
    },
    [isConnected, roomId],
  );

  const receiveUpdate = useCallback(
    (data: Uint8Array) => {
      if (!docRef.current) return;

      try {
        docRef.current.import(data);
        onDocumentUpdate?.(docRef.current);
      } catch (error) {
        console.error('Failed to import update:', error);
      }
    },
    [onDocumentUpdate],
  );

  // 他のタブからの更新を監視
  useEffect(() => {
    const handleStorageUpdate = (event: CustomEvent) => {
      if (event.detail.roomId === roomId && docRef.current) {
        const data = new Uint8Array(event.detail.data);
        receiveUpdate(data);
      }
    };

    window.addEventListener(
      'loro-update',
      handleStorageUpdate as EventListener,
    );

    return () => {
      window.removeEventListener(
        'loro-update',
        handleStorageUpdate as EventListener,
      );
    };
  }, [roomId, receiveUpdate]);

  const setDocument = useCallback((doc: LoroDoc) => {
    docRef.current = doc;
  }, []);

  return {
    isConnected,
    connect,
    disconnect,
    sendUpdate,
    receiveUpdate,
    setDocument,
  };
}
