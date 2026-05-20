import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type Mock,
  vi,
} from 'vitest';
import type { Video } from '@/lib/holodex';
import {
  setupYouTubeApi,
  teardownYouTubeApi,
} from '@/test/helpers/youtube-mock';
import InAppYouTubePlayer from './in-app-youtube-player';

vi.mock('@/hooks/useYouTubePlayerContext', () => ({
  useYouTubePlayer: vi.fn(),
}));
vi.mock('@/hooks/usePlayerHistory', () => ({
  usePlayerHistory: vi.fn(),
}));
vi.mock('@/hooks/useYouTubeApi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/hooks/useYouTubeApi')>();
  return {
    ...actual,
    useYouTubeApi: vi.fn(),
  };
});

import { usePlayerHistory } from '@/hooks/usePlayerHistory';
import { useYouTubeApi } from '@/hooks/useYouTubeApi';
import { useYouTubePlayer } from '@/hooks/useYouTubePlayerContext';

const mockedUseYouTubePlayer = vi.mocked(useYouTubePlayer);
const mockedUsePlayerHistory = vi.mocked(usePlayerHistory) as unknown as Mock;
const mockedUseYouTubeApi = vi.mocked(useYouTubeApi);

const mockVideo = (overrides: Partial<Video> = {}): Video =>
  ({
    id: 'abcdef',
    title: 'Test stream',
    type: 'stream',
    topic_id: null,
    published_at: null,
    available_at: '2026-05-20T10:00:00Z',
    duration: 0,
    status: 'live',
    start_scheduled: null,
    start_actual: null,
    end_actual: null,
    live_viewers: 0,
    description: '',
    songcount: 0,
    channel: {
      id: 'c1',
      name: 'Test',
      english_name: null,
      type: 'vtuber',
      photo: null,
      org: null,
      suborg: null,
      group: null,
      lang: null,
    },
    ...overrides,
  }) as Video;

describe('InAppYouTubePlayer', () => {
  let closePlayer: Mock;
  let loadYouTubeApi: Mock;

  beforeEach(() => {
    closePlayer = vi.fn();
    loadYouTubeApi = vi.fn(() => Promise.resolve());
    mockedUseYouTubeApi.mockReturnValue({ loadYouTubeApi });
    mockedUsePlayerHistory.mockReturnValue(undefined);
    setupYouTubeApi();
  });

  afterEach(() => {
    teardownYouTubeApi();
    vi.clearAllMocks();
  });

  it('renders nothing when there is no current video', () => {
    mockedUseYouTubePlayer.mockReturnValue({
      currentVideo: null,
      playVideo: vi.fn(),
      closePlayer,
    });

    const { container } = render(<InAppYouTubePlayer />);

    expect(container.firstChild).toBeNull();
    expect(loadYouTubeApi).not.toHaveBeenCalled();
  });

  it('renders the dialog and iframe when a video is set', () => {
    mockedUseYouTubePlayer.mockReturnValue({
      currentVideo: mockVideo({ id: 'video-1' }),
      playVideo: vi.fn(),
      closePlayer,
    });

    render(<InAppYouTubePlayer />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    const iframe = screen.getByTitle('YouTube Player') as HTMLIFrameElement;
    expect(iframe.src).toContain('https://www.youtube.com/embed/video-1');
    expect(iframe.src).toContain('enablejsapi=1');
    expect(iframe.src).toContain('autoplay=0');
  });

  it('loads the YouTube API and constructs YT.Player when the dialog opens', async () => {
    const PlayerMock = window.YT.Player as unknown as Mock;
    mockedUseYouTubePlayer.mockReturnValue({
      currentVideo: mockVideo({ id: 'video-x' }),
      playVideo: vi.fn(),
      closePlayer,
    });

    render(<InAppYouTubePlayer />);

    await waitFor(() => {
      expect(loadYouTubeApi).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(PlayerMock).toHaveBeenCalledTimes(1);
    });
  });

  it('calls closePlayer when the backdrop is clicked', () => {
    mockedUseYouTubePlayer.mockReturnValue({
      currentVideo: mockVideo(),
      playVideo: vi.fn(),
      closePlayer,
    });

    render(<InAppYouTubePlayer />);

    const dialog = screen.getByRole('dialog');
    fireEvent.click(dialog);

    expect(closePlayer).toHaveBeenCalledTimes(1);
  });

  it('does not close when clicks bubble from inner content', () => {
    mockedUseYouTubePlayer.mockReturnValue({
      currentVideo: mockVideo(),
      playVideo: vi.fn(),
      closePlayer,
    });

    render(<InAppYouTubePlayer />);

    const iframe = screen.getByTitle('YouTube Player');
    fireEvent.click(iframe);

    expect(closePlayer).not.toHaveBeenCalled();
  });

  it('calls closePlayer when Escape is pressed inside the dialog', () => {
    mockedUseYouTubePlayer.mockReturnValue({
      currentVideo: mockVideo(),
      playVideo: vi.fn(),
      closePlayer,
    });

    render(<InAppYouTubePlayer />);

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });

    expect(closePlayer).toHaveBeenCalledTimes(1);
  });

  it('ignores non-Escape key presses', () => {
    mockedUseYouTubePlayer.mockReturnValue({
      currentVideo: mockVideo(),
      playVideo: vi.fn(),
      closePlayer,
    });

    render(<InAppYouTubePlayer />);

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Enter' });

    expect(closePlayer).not.toHaveBeenCalled();
  });

  it('logs YouTube player errors via the onError callback', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const Player = window.YT.Player as unknown as Mock;
    mockedUseYouTubePlayer.mockReturnValue({
      currentVideo: mockVideo(),
      playVideo: vi.fn(),
      closePlayer,
    });

    render(<InAppYouTubePlayer />);

    await waitFor(() => {
      expect(Player).toHaveBeenCalled();
    });
    const callArgs = Player.mock.calls[0] as [
      unknown,
      { events?: { onError?: (e: { data: number }) => void } } | undefined,
    ];
    callArgs[1]?.events?.onError?.({ data: 150 });

    expect(errorSpy).toHaveBeenCalledWith('YouTube Player Error:', 150);
    errorSpy.mockRestore();
  });

  it('registers and tears down a fullscreenchange listener', () => {
    const addSpy = vi.spyOn(document, 'addEventListener');
    const removeSpy = vi.spyOn(document, 'removeEventListener');

    mockedUseYouTubePlayer.mockReturnValue({
      currentVideo: mockVideo(),
      playVideo: vi.fn(),
      closePlayer,
    });

    const { unmount } = render(<InAppYouTubePlayer />);

    expect(addSpy).toHaveBeenCalledWith(
      'fullscreenchange',
      expect.any(Function),
    );
    const handler = addSpy.mock.calls.find(
      (c) => c[0] === 'fullscreenchange',
    )?.[1] as EventListener | undefined;
    expect(handler).toBeDefined();

    unmount();

    expect(removeSpy).toHaveBeenCalledWith('fullscreenchange', handler);
    addSpy.mockRestore();
    removeSpy.mockRestore();
  });
});
