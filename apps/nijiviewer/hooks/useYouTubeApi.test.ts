import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  fireYouTubeApiReady,
  setupYouTubeApi,
  teardownYouTubeApi,
} from '@/test/helpers/youtube-mock';
import { useYouTubeApi } from './useYouTubeApi';

describe('useYouTubeApi', () => {
  beforeEach(() => {
    teardownYouTubeApi();
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  afterEach(() => {
    teardownYouTubeApi();
  });

  it('resolves immediately when window.YT is already loaded', async () => {
    setupYouTubeApi();
    const { result } = renderHook(() => useYouTubeApi());

    await expect(result.current.loadYouTubeApi()).resolves.toBeUndefined();
  });

  it('injects the YouTube script tag and resolves after onYouTubeIframeAPIReady fires', async () => {
    // Add a stub script tag so insertBefore has a sibling.
    const stubScript = document.createElement('script');
    stubScript.id = 'stub';
    document.head.appendChild(stubScript);

    const { result } = renderHook(() => useYouTubeApi());
    const promise = result.current.loadYouTubeApi();

    const injected = document.head.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]',
    );
    expect(injected).not.toBeNull();

    fireYouTubeApiReady();

    await expect(promise).resolves.toBeUndefined();
  });
});
