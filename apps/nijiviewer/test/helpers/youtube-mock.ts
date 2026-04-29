import { type Mock, vi } from 'vitest';
import type { YouTubePlayer } from '@/hooks/useYouTubeApi';

export type YouTubePlayerMock = {
  [K in keyof YouTubePlayer]: Mock;
};

export function createYouTubePlayerMock(
  overrides: Partial<YouTubePlayerMock> = {},
): YouTubePlayerMock {
  return {
    playVideo: vi.fn(),
    pauseVideo: vi.fn(),
    stopVideo: vi.fn(),
    seekTo: vi.fn(),
    getPlayerState: vi.fn(() => 1),
    getCurrentTime: vi.fn(() => 0),
    getDuration: vi.fn(() => 0),
    getVideoLoadedFraction: vi.fn(() => 0),
    setVolume: vi.fn(),
    getVolume: vi.fn(() => 100),
    mute: vi.fn(),
    unMute: vi.fn(),
    isMuted: vi.fn(() => false),
    destroy: vi.fn(),
    ...overrides,
  };
}

export interface YouTubeApiMock {
  player: YouTubePlayerMock;
  Player: Mock;
  PlayerState: Window['YT']['PlayerState'];
}

/**
 * Sets up `window.YT` with a controllable Player constructor mock.
 * The constructor invokes `events.onReady` after a microtask to simulate
 * the IFrame API's lifecycle.
 */
export function setupYouTubeApi(
  overrides: Partial<YouTubePlayerMock> = {},
): YouTubeApiMock {
  const player = createYouTubePlayerMock(overrides);
  const Player = vi.fn(
    (
      _el: unknown,
      options?: {
        events?: { onReady?: (e: { target: YouTubePlayer }) => void };
      },
    ) => {
      queueMicrotask(() => {
        options?.events?.onReady?.({ target: player as unknown as YouTubePlayer });
      });
      return player;
    },
  );
  const PlayerState = {
    UNSTARTED: -1,
    ENDED: 0,
    PLAYING: 1,
    PAUSED: 2,
    BUFFERING: 3,
    CUED: 5,
  } as const;

  (window as Window).YT = {
    Player: Player as unknown as Window['YT']['Player'],
    PlayerState,
  };

  return { player, Player, PlayerState };
}

/** Removes `window.YT` and `window.onYouTubeIframeAPIReady` between tests. */
export function teardownYouTubeApi(): void {
  delete (window as Partial<Window>).YT;
  delete (window as Partial<Window>).onYouTubeIframeAPIReady;
}

/** Manually trigger the IFrame API "ready" callback set by `useYouTubeApi`. */
export function fireYouTubeApiReady(): void {
  window.onYouTubeIframeAPIReady?.();
}
