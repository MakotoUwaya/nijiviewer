import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { mockStreamVideo } from '@/test/fixtures/holodex';
import {
  useYouTubePlayer,
  YouTubePlayerProvider,
} from './useYouTubePlayerContext';

const wrapper = ({ children }: { children: ReactNode }) => (
  <YouTubePlayerProvider>{children}</YouTubePlayerProvider>
);

describe('useYouTubePlayer', () => {
  it('throws when used outside the provider', () => {
    expect(() => renderHook(() => useYouTubePlayer())).toThrow(
      /must be used within a YouTubePlayerProvider/,
    );
  });

  it('starts with no current video', () => {
    const { result } = renderHook(() => useYouTubePlayer(), { wrapper });
    expect(result.current.currentVideo).toBeNull();
  });

  it('playVideo sets the current video', () => {
    const { result } = renderHook(() => useYouTubePlayer(), { wrapper });
    const video = mockStreamVideo({ id: 'video-42' });

    act(() => {
      result.current.playVideo(video);
    });

    expect(result.current.currentVideo).toEqual(video);
  });

  it('closePlayer clears the current video', () => {
    const { result } = renderHook(() => useYouTubePlayer(), { wrapper });

    act(() => {
      result.current.playVideo(mockStreamVideo({ id: 'video-42' }));
    });
    expect(result.current.currentVideo).not.toBeNull();

    act(() => {
      result.current.closePlayer();
    });
    expect(result.current.currentVideo).toBeNull();
  });
});
