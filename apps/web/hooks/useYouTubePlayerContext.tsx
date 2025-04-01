'use client';

import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

// LocalStorageのキー
const YOUTUBE_PLAYER_KEY = 'nijiviewer-youtube-player';

interface YouTubePlayerContextType {
  isYouTubePlayer: boolean;
  toggleYouTubePlayer: (value: boolean) => void;
}

const YouTubePlayerContext = createContext<
  YouTubePlayerContextType | undefined
>(undefined);

export function YouTubePlayerProvider({
  children,
}: {
  children: ReactNode;
}) {
  // サーバーサイドレンダリング時は常にデフォルト値（true）を使用
  const [isYouTubePlayer, setIsYouTubePlayer] = useState<boolean>(true);

  // クライアントサイドでのみLocalStorageから値を読み込む
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedValue = localStorage.getItem(YOUTUBE_PLAYER_KEY);
      if (savedValue !== null) {
        setIsYouTubePlayer(savedValue === 'true');
      }
    }
  }, []);

  const toggleYouTubePlayer = useCallback((value: boolean) => {
    // 値を更新
    setIsYouTubePlayer(value);

    // LocalStorageに保存
    if (typeof window !== 'undefined') {
      localStorage.setItem(YOUTUBE_PLAYER_KEY, String(value));
    }
  }, []);

  return (
    <YouTubePlayerContext.Provider
      value={{ isYouTubePlayer, toggleYouTubePlayer }}
    >
      {children}
    </YouTubePlayerContext.Provider>
  );
}

export function useYouTubePlayer(): YouTubePlayerContextType {
  const context = useContext(YouTubePlayerContext);
  if (context === undefined) {
    throw new Error(
      'useYouTubePlayer must be used within a YouTubePlayerProvider',
    );
  }
  return context;
}
