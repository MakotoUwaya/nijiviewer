'use client';

import { useEffect, useRef } from 'react';

/**
 * モーダル等の開閉状態をブラウザのHistory APIと連携させるフック。
 * 開いた時に history.pushState を呼び返し、戻るボタンで閉じるようにする。
 */
export function usePlayerHistory(isOpen: boolean, onClose: () => void) {
  const isPushedRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      if (!isPushedRef.current) {
        window.history.pushState({ inAppPlayer: true }, '');
        isPushedRef.current = true;
      }
    } else {
      if (isPushedRef.current) {
        // プログラムから閉じた場合は、history stateを1つ戻る
        if (window.history.state?.inAppPlayer) {
          window.history.back();
        }
        isPushedRef.current = false;
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      // 戻るボタンが押されたとき、stateに inAppPlayer が無ければプレイヤーを閉じる
      if (isOpen && !e.state?.inAppPlayer) {
        isPushedRef.current = false;
        onClose();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isOpen, onClose]);
}
