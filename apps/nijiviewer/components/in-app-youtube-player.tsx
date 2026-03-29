'use client';

import {
  ArrowTopRightOnSquareIcon,
  ClockIcon,
  PlayIcon,
  ShareIcon,
} from '@heroicons/react/24/solid';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  User,
} from '@heroui/react';
import { DateTime } from 'luxon';
import { useEffect, useRef, useState } from 'react';
import { usePlayerHistory } from '@/hooks/usePlayerHistory';
import { useYouTubeApi, type YouTubePlayer } from '@/hooks/useYouTubeApi';
import { useYouTubePlayer } from '@/hooks/useYouTubePlayerContext';
import { getStarted, getVideoStatusText } from '@/lib/holodex';
import { getImageUrl } from '@/lib/image-utils';

export default function InAppYouTubePlayer() {
  const { currentVideo, closePlayer } = useYouTubePlayer();
  const isOpen = currentVideo !== null;
  const [isPlaying, setIsPlaying] = useState(false);

  // プレーヤーが閉じられたら再生状態をリセットする
  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
    }
  }, [isOpen]);

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
        onStateChange: (event) => {
          // 外部（純正のUIなど）で再生開始された場合に isPlaying を true にする
          if (event.data === window.YT.PlayerState.PLAYING) {
            setIsPlaying((prev) => (prev ? true : true));
          }
        }
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

  const channelDescription = `${currentVideo.channel.org}${
    currentVideo.channel.suborg
      ? ` / ${currentVideo.channel.suborg.substring(2)}`
      : ''
  }`;

  const isPast = currentVideo.status === 'past';
  const videoStatusText = isPast
    ? getStarted(currentVideo.available_at || '')
    : currentVideo.type === 'stream' && currentVideo.status === 'live'
      ? `Started streaming ${
          currentVideo.start_actual
            ? DateTime.fromISO(currentVideo.start_actual).toRelative()
            : ''
        }`
      : currentVideo.type === 'stream'
        ? getVideoStatusText(currentVideo.start_scheduled)
        : '';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentVideo.title,
          url: `https://www.youtube.com/watch?v=${currentVideo.id}`,
        });
      } catch (e) {
        console.error('Error sharing:', e);
      }
    } else {
      navigator.clipboard.writeText(
        `https://www.youtube.com/watch?v=${currentVideo.id}`,
      );
      alert('リンクをコピーしました');
    }
  };

  const handleOpenYouTube = () => {
    window.open(
      `https://www.youtube.com/watch?v=${currentVideo.id}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  const handlePlayClick = () => {
    setIsPlaying(true);
    if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
      playerRef.current.playVideo();
    }
  };

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
            {/* 常に背面で YouTube IFrame を描画 */}
            <div id={playerContainerId} className="w-full h-full absolute inset-0" />
            
            {/* 再生前のみオーバーレイを表示する */}
            {!isPlaying && (
              <div className="absolute inset-0 z-10 flex flex-col justify-between bg-black/60 transition-opacity p-2 md:p-4">
                
                {/* チャンネル情報＆動画タイトル (左上) */}
                <div className="flex gap-3 items-start pointer-events-auto">
                  <User
                    avatarProps={{
                      src: getImageUrl(currentVideo.channel.photo),
                      className: 'min-w-10 ring-2 ring-white/20',
                    }}
                    classNames={{
                      base: 'justify-start self-start',
                      name: 'font-semibold text-white drop-shadow-md',
                      description: 'text-xs md:text-sm text-white/80 drop-shadow-md',
                    }}
                    description={channelDescription}
                    name={currentVideo.channel.name}
                  />
                  <div className="text-white mt-1 pr-4">
                    <h2 className="text-sm md:text-lg font-bold line-clamp-2 leading-tight drop-shadow-md">
                      {currentVideo.title}
                    </h2>
                    <p className="text-xs text-white/80 drop-shadow-md mt-1">
                      {videoStatusText}
                    </p>
                  </div>
                </div>

                {/* 中央：大きな再生ボタン */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Button
                    isIconOnly
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)] pointer-events-auto transition-transform hover:scale-105"
                    onClick={handlePlayClick}
                    aria-label="動画を再生"
                  >
                    <PlayIcon className="w-8 h-8 md:w-10 md:h-10 ml-1" />
                  </Button>
                </div>

                {/* アクションボタン群 (右下) */}
                <div className="flex justify-end items-end pointer-events-auto gap-2 flex-wrap">
                  <Button
                    size="sm"
                    className="bg-black/50 text-white border border-white/20 backdrop-blur-sm"
                    startContent={<ClockIcon className="w-4 h-4" />}
                  >
                    後で見る
                  </Button>
                  <Button
                    size="sm"
                    className="bg-black/50 text-white border border-white/20 backdrop-blur-sm"
                    startContent={<ShareIcon className="w-4 h-4" />}
                    onClick={handleShare}
                  >
                    共有
                  </Button>
                  <Button
                    size="sm"
                    className="bg-black/50 text-white border border-white/20 backdrop-blur-sm"
                    startContent={<ArrowTopRightOnSquareIcon className="w-4 h-4" />}
                    onClick={handleOpenYouTube}
                  >
                    見る (YouTube)
                  </Button>
                </div>
              </div>
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
