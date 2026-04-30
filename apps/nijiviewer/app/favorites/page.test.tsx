import { render, screen, waitFor } from '@testing-library/react';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { mockUser } from '@/test/fixtures/auth';
import { mockFavoriteLiver } from '@/test/fixtures/favorites';
import { mockStreamVideo } from '@/test/fixtures/holodex';
import {
  stubAuth,
  stubFavorites,
  wrapWithHeroUI,
} from '@/test/helpers/auth-favorites-mocks';

const {
  useAuthMock,
  useFavoriteLiversListMock,
  getFavoritesLiveVideosActionMock,
  videosMock,
  scrollToTopMock,
} = vi.hoisted(() => ({
  useAuthMock: vi.fn(),
  useFavoriteLiversListMock: vi.fn(),
  getFavoritesLiveVideosActionMock: vi.fn(),
  videosMock: vi.fn(() => null),
  scrollToTopMock: vi.fn(() => null),
}));

vi.mock('@/context/auth-context', () => ({ useAuth: useAuthMock }));
vi.mock('@/hooks/use-favorites', () => ({
  useFavoriteLiversList: useFavoriteLiversListMock,
}));
vi.mock('@/app/actions', () => ({
  getFavoritesLiveVideosAction: getFavoritesLiveVideosActionMock,
}));
vi.mock('@/components/videos', () => ({ default: videosMock }));
vi.mock('@/components/scroll-to-top-button', () => ({
  default: scrollToTopMock,
}));

import FavoritesPage from './page';

describe('FavoritesPage', () => {
  beforeEach(() => {
    useAuthMock.mockReset();
    useFavoriteLiversListMock.mockReset();
    getFavoritesLiveVideosActionMock.mockReset();
    videosMock.mockClear();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows the spinner (and nothing else) while auth is loading', () => {
    stubAuth(useAuthMock, { isLoading: true });
    stubFavorites(useFavoriteLiversListMock);

    render(wrapWithHeroUI(<FavoritesPage />));
    expect(
      screen.queryByText('ログインしてお気に入り機能を利用しましょう。'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Favorite Live Videos' }),
    ).not.toBeInTheDocument();
  });

  it('shows the spinner (and nothing else) while favorites are loading', () => {
    stubAuth(useAuthMock);
    stubFavorites(useFavoriteLiversListMock, { isLoading: true });

    render(wrapWithHeroUI(<FavoritesPage />));
    expect(
      screen.queryByText('ログインしてお気に入り機能を利用しましょう。'),
    ).not.toBeInTheDocument();
    expect(videosMock).not.toHaveBeenCalled();
  });

  it('shows the sign-in prompt when user is null', async () => {
    stubAuth(useAuthMock, { user: null });
    stubFavorites(useFavoriteLiversListMock);

    render(wrapWithHeroUI(<FavoritesPage />));

    await waitFor(() => {
      expect(
        screen.getByText('ログインしてお気に入り機能を利用しましょう。'),
      ).toBeInTheDocument();
    });
  });

  it('shows the empty state when the user has no favorites', async () => {
    const user = mockUser();
    stubAuth(useAuthMock, { user });
    stubFavorites(useFavoriteLiversListMock, { favorites: [] });

    render(wrapWithHeroUI(<FavoritesPage />));

    await waitFor(() => {
      expect(
        screen.getByText(/お気に入りのライバーがいません/),
      ).toBeInTheDocument();
    });
    expect(getFavoritesLiveVideosActionMock).not.toHaveBeenCalled();
  });

  it('renders Videos with the action result when favorites exist', async () => {
    const user = mockUser();
    const fav = mockFavoriteLiver({ liver_id: 'liver-1' });
    const video = mockStreamVideo({ id: 'v-1' });
    stubAuth(useAuthMock, { user });
    stubFavorites(useFavoriteLiversListMock, { favorites: [fav] });
    getFavoritesLiveVideosActionMock.mockResolvedValue([video]);

    render(wrapWithHeroUI(<FavoritesPage />));

    await waitFor(() => {
      expect(getFavoritesLiveVideosActionMock).toHaveBeenCalledWith(['liver-1']);
    });
    await waitFor(() => {
      expect(videosMock).toHaveBeenCalled();
    });
    expect(videosMock.mock.calls.at(-1)?.[0]).toEqual({ videos: [video] });
  });

  it('logs the error and stops the spinner when the action fails', async () => {
    const user = mockUser();
    const fav = mockFavoriteLiver({ liver_id: 'liver-1' });
    stubAuth(useAuthMock, { user });
    stubFavorites(useFavoriteLiversListMock, { favorites: [fav] });
    const err = new Error('boom');
    getFavoritesLiveVideosActionMock.mockRejectedValue(err);

    render(wrapWithHeroUI(<FavoritesPage />));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(err);
    });
  });
});
