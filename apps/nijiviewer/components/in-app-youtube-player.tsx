'use client';

import { type MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import { usePlayerHistory } from '@/hooks/usePlayerHistory';
import { useYouTubeApi, type YouTubePlayer } from '@/hooks/useYouTubeApi';
import { useYouTubePlayer } from '@/hooks/useYouTubePlayerContext';

export default function InAppYouTubePlayer() {
  const { currentVideo, closePlayer } = useYouTubePlayer();
  const isOpen = currentVideo !== null;

  // モバイルブラウザでの戻るボタン操作をハンドリング
  usePlayerHistory(isOpen, closePlayer);

  const playerRef = useRef<YouTubePlayer | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const playerContainerId = 'youtube-player-container-in-app';
  const { loadYouTubeApi } = useYouTubeApi();
  const [isApiReady, setIsApiReady] = useState(false);

  // モーダルが開いたらすぐにYouTube APIを読み込む
  useEffect(() => {
    if (!isOpen || isApiReady) return;
    loadYouTubeApi().then(() => setIsApiReady(true));
  }, [isOpen, isApiReady, loadYouTubeApi]);

  // IFrame の初期化 (autoplay なしでロード)
  useEffect(() => {
    if (
      !isOpen ||
      !isApiReady ||
      playerRef.current ||
      !currentVideo ||
      !iframeRef.current
    )
      return;

    playerRef.current = new window.YT.Player(iframeRef.current, {
      events: {
        onError: (event) => console.error('YouTube Player Error:', event.data),
      },
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [isOpen, isApiReady, currentVideo]);

  // 背景クリック時のみプレーヤーを閉じる（内側コンテンツのクリックは無視）
  const handleBackdropClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (e.target === backdropRef.current) closePlayer();
    },
    [closePlayer],
  );

  if (!currentVideo) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[100] flex items-start md:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4"
      onClick={handleBackdropClick}
      onKeyDown={(e) => {
        if (e.key === 'Escape') closePlayer();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full h-auto max-h-screen md:max-h-[calc(100vh-2rem)] max-w-[1280px] bg-black rounded-none md:rounded-large overflow-hidden flex flex-col m-0 shadow-2xl">
        <div className="w-full aspect-video relative flex-shrink-0 group">
          <iframe
            ref={iframeRef}
            title="YouTube Player"
            id={playerContainerId}
            src={`https://www.youtube.com/embed/${currentVideo.id}?enablejsapi=1&autoplay=0&controls=1&fs=1&modestbranding=1&rel=0`}
            className="w-full h-full absolute inset-0 border-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          />
        </div>
      </div>
    </div>
  );
}
