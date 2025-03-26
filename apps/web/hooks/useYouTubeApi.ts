"use client";

export interface YouTubePlayer {
  playVideo(): void;
  pauseVideo(): void;
  stopVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getPlayerState(): number;
  getCurrentTime(): number;
  getDuration(): number;
  getVideoLoadedFraction(): number;
  setVolume(volume: number): void;
  getVolume(): number;
  mute(): void;
  unMute(): void;
  isMuted(): boolean;
  destroy(): void;
}

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        options: {
          videoId?: string;
          width?: number | string;
          height?: number | string;
          playerVars?: {
            autoplay?: 0 | 1;
            controls?: 0 | 1;
            modestbranding?: 0 | 1;
            rel?: 0 | 1;
            fs?: 0 | 1;
          };
          events?: {
            onReady?: (event: { target: YouTubePlayer }) => void;
            onStateChange?: (event: { data: number }) => void;
            onError?: (event: { data: number }) => void;
          };
        }
      ) => YouTubePlayer;
      PlayerState: {
        UNSTARTED: -1;
        ENDED: 0;
        PLAYING: 1;
        PAUSED: 2;
        BUFFERING: 3;
        CUED: 5;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

export const useYouTubeApi = () => {
  const loadYouTubeApi = (): Promise<void> => {
    return new Promise((resolve) => {
      if (window.YT) {
        resolve();
        return;
      }

      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";

      window.onYouTubeIframeAPIReady = () => {
        resolve();
      };

      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    });
  };

  return { loadYouTubeApi };
};
