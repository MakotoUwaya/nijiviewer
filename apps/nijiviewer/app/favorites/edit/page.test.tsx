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
import { mockChannel } from '@/test/fixtures/holodex';
import {
  stubAuth,
  stubFavorites,
  wrapWithHeroUI,
} from '@/test/helpers/auth-favorites-mocks';

const {
  useAuthMock,
  useFavoriteLiversListMock,
  getChannelsActionMock,
  searchResultListMock,
  scrollToTopMock,
} = vi.hoisted(() => ({
  useAuthMock: vi.fn(),
  useFavoriteLiversListMock: vi.fn(),
  getChannelsActionMock: vi.fn(),
  searchResultListMock: vi.fn(() => null),
  scrollToTopMock: vi.fn(() => null),
}));

vi.mock('@/context/auth-context', () => ({ useAuth: useAuthMock }));
vi.mock('@/hooks/use-favorites', () => ({
  useFavoriteLiversList: useFavoriteLiversListMock,
}));
vi.mock('@/app/actions', () => ({
  getChannelsAction: getChannelsActionMock,
}));
vi.mock('@/components/search-result', () => ({
  SearchResultList: searchResultListMock,
}));
vi.mock('@/components/scroll-to-top-button', () => ({
  default: scrollToTopMock,
}));

import FavoritesEditPage from './page';

describe('FavoritesEditPage', () => {
  beforeEach(() => {
    useAuthMock.mockReset();
    useFavoriteLiversListMock.mockReset();
    getChannelsActionMock.mockReset();
    searchResultListMock.mockClear();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders only the spinner while auth is loading', () => {
    stubAuth(useAuthMock, { isLoading: true });
    stubFavorites(useFavoriteLiversListMock);

    render(wrapWithHeroUI(<FavoritesEditPage />));
    expect(
      screen.queryByText('ログインしてお気に入り機能を利用しましょう。'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Manage Favorite Livers' }),
    ).not.toBeInTheDocument();
  });

  it('renders only the spinner while favorites are loading', () => {
    stubAuth(useAuthMock);
    stubFavorites(useFavoriteLiversListMock, { isLoading: true });

    render(wrapWithHeroUI(<FavoritesEditPage />));
    expect(
      screen.queryByText('ログインしてお気に入り機能を利用しましょう。'),
    ).not.toBeInTheDocument();
    expect(searchResultListMock).not.toHaveBeenCalled();
  });

  it('shows the sign-in prompt for unauthenticated users', async () => {
    stubAuth(useAuthMock, { user: null });
    stubFavorites(useFavoriteLiversListMock);

    render(wrapWithHeroUI(<FavoritesEditPage />));

    await waitFor(() => {
      expect(
        screen.getByText('ログインしてお気に入り機能を利用しましょう。'),
      ).toBeInTheDocument();
    });
  });

  it('shows the empty message when user has no favorites', async () => {
    const user = mockUser();
    stubAuth(useAuthMock, { user });
    stubFavorites(useFavoriteLiversListMock, { favorites: [] });

    render(wrapWithHeroUI(<FavoritesEditPage />));

    await waitFor(() => {
      expect(
        screen.getByText('お気に入りのライバーがいません。'),
      ).toBeInTheDocument();
    });
    expect(getChannelsActionMock).not.toHaveBeenCalled();
  });

  it('renders SearchResultList with fetched channels when favorites exist', async () => {
    const user = mockUser();
    const fav = mockFavoriteLiver({ liver_id: 'C-1' });
    const channel = mockChannel({ id: 'C-1' });
    stubAuth(useAuthMock, { user });
    stubFavorites(useFavoriteLiversListMock, { favorites: [fav] });
    getChannelsActionMock.mockResolvedValue([channel]);

    render(wrapWithHeroUI(<FavoritesEditPage />));

    await waitFor(() => {
      expect(getChannelsActionMock).toHaveBeenCalledWith(['C-1']);
    });
    await waitFor(() => {
      expect(searchResultListMock).toHaveBeenCalled();
    });
    expect(searchResultListMock.mock.calls.at(-1)?.[0]).toEqual({
      channels: [channel],
    });
  });

  it('logs an error when getChannelsAction rejects', async () => {
    const user = mockUser();
    const fav = mockFavoriteLiver({ liver_id: 'C-1' });
    stubAuth(useAuthMock, { user });
    stubFavorites(useFavoriteLiversListMock, { favorites: [fav] });
    const err = new Error('boom');
    getChannelsActionMock.mockRejectedValue(err);

    render(wrapWithHeroUI(<FavoritesEditPage />));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(err);
    });
  });
});
