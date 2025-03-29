'use client';

import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

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
  const [isYouTubePlayer, setIsYouTubePlayer] = useState(true);

  const toggleYouTubePlayer = useCallback((value: boolean) => {
    setIsYouTubePlayer(value);
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
