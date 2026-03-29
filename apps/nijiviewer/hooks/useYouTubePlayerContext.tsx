'use client';

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';
import type { Video } from '@/lib/holodex';

interface YouTubePlayerContextType {
  currentVideo: Video | null;
  playVideo: (video: Video) => void;
  closePlayer: () => void;
}

const YouTubePlayerContext = createContext<
  YouTubePlayerContextType | undefined
>(undefined);

export function YouTubePlayerProvider({ children }: { children: ReactNode }) {
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);

  const playVideo = useCallback((video: Video) => {
    setCurrentVideo(video);
  }, []);

  const closePlayer = useCallback(() => {
    setCurrentVideo(null);
  }, []);

  return (
    <YouTubePlayerContext.Provider
      value={{
        currentVideo,
        playVideo,
        closePlayer,
      }}
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
