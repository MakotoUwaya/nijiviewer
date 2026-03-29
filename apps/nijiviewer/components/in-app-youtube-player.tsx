'use client';

import { Modal, ModalBody, ModalContent } from '@heroui/react';
import { useEffect, useRef, useState } from 'react';
import { usePlayerHistory } from '@/hooks/usePlayerHistory';
import { useYouTubeApi, type YouTubePlayer } from '@/hooks/useYouTubeApi';
import { useYouTubePlayer } from '@/hooks/useYouTubePlayerContext';

export default function InAppYouTubePlayer() {
  const { currentVideo, closePlayer } = useYouTubePlayer();
  const isOpen = currentVideo !== null;

  // モバイルブラウザでの戻るボタン操作をハンドリング
  usePlayerHistory(isOpen, closePlayer);

  const playerRef = useRef<YouTubePlayer | null>(null);
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
    if (!isOpen || !isApiReady || playerRef.current || !currentVideo) return;

    playerRef.current = new window.YT.Player(playerContainerId, {
      videoId: currentVideo.id,
      width: '100%',
      height: '100%',
      playerVars: {
        autoplay: 0,
        modestbranding: 1,
        rel: 0,
        controls: 1,
      },
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

  if (!currentVideo) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={closePlayer}
      hideCloseButton
      // モバイルでは上部配置、MD以上ではダイアログ
      size="5xl"
      classNames={{
        base: 'm-0 sm:m-4 max-h-screen md:max-h-[calc(100vh-2rem)] h-auto md:h-auto rounded-none md:rounded-large overflow-hidden bg-black',
        wrapper: 'items-start md:items-center',
      }}
    >
      <ModalContent className="flex-col !m-0 h-auto w-full max-w-[1280px] bg-black">
        <ModalBody className="p-0 flex-col overflow-hidden">
          <div className="w-full aspect-video relative flex-shrink-0 group">
            <div
              id={playerContainerId}
              className="w-full h-full absolute inset-0"
            />
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
