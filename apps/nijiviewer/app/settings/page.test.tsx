import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { HeroUIProvider } from '@heroui/react';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import type { ReactNode } from 'react';
import { mockUser } from '@/test/fixtures/auth';
import { mockOrganization } from '@/test/fixtures/organizations';

const { useAuthMock, usePreferencesMock } = vi.hoisted(() => ({
  useAuthMock: vi.fn(),
  usePreferencesMock: vi.fn(),
}));

vi.mock('@/context/auth-context', () => ({ useAuth: useAuthMock }));
vi.mock('@/context/preferences-context', () => ({
  usePreferences: usePreferencesMock,
}));

// Reorder.Group from motion/react requires drag/animate; we render a thin shim.
vi.mock('motion/react', () => ({
  Reorder: {
    Group: ({
      children,
      onReorder,
    }: {
      children: ReactNode;
      onReorder?: (next: string[]) => void;
      values?: string[];
    }) => (
      <div data-testid="reorder-group" data-onreorder={typeof onReorder}>
        {children}
        {onReorder ? (
          <button
            type="button"
            data-testid="reorder-trigger"
            onClick={() => onReorder(['Hololive', 'Nijisanji'])}
          >
            reorder
          </button>
        ) : null}
      </div>
    ),
    Item: ({ children }: { children: ReactNode }) => (
      <div data-testid="reorder-item">{children}</div>
    ),
  },
}));

import SettingsPage from './page';

const wrap = (ui: ReactNode) => <HeroUIProvider>{ui}</HeroUIProvider>;

const setAuth = (overrides: Partial<ReturnType<typeof useAuthMock>> = {}) => {
  useAuthMock.mockReturnValue({
    user: null,
    session: null,
    isLoading: false,
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    ...overrides,
  });
};

type PrefValue = {
  organizations: ReturnType<typeof mockOrganization>[];
  favoriteOrgIds: string[];
  isLoading: boolean;
  toggleFavorite: ReturnType<typeof vi.fn>;
  initializeFavorites: ReturnType<typeof vi.fn>;
  updateOrder: ReturnType<typeof vi.fn>;
};

const setPrefs = (overrides: Partial<PrefValue> = {}): PrefValue => {
  const value: PrefValue = {
    organizations: [],
    favoriteOrgIds: [],
    isLoading: false,
    toggleFavorite: vi.fn().mockResolvedValue(undefined),
    initializeFavorites: vi.fn().mockResolvedValue(undefined),
    updateOrder: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
  usePreferencesMock.mockReturnValue(value);
  return value;
};

describe('SettingsPage', () => {
  beforeEach(() => {
    useAuthMock.mockReset();
    usePreferencesMock.mockReset();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders only the spinner while auth is loading', () => {
    setAuth({ isLoading: true });
    setPrefs();

    render(wrap(<SettingsPage />));
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
    expect(
      screen.queryByText('You need to be signed in to manage settings.'),
    ).not.toBeInTheDocument();
  });

  it('renders only the spinner while preferences are loading', () => {
    setAuth();
    setPrefs({ isLoading: true });

    render(wrap(<SettingsPage />));
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
    expect(
      screen.queryByText('You need to be signed in to manage settings.'),
    ).not.toBeInTheDocument();
  });

  it('shows the sign-in card when user is null', () => {
    setAuth({ user: null });
    setPrefs();

    render(wrap(<SettingsPage />));

    expect(
      screen.getByText('You need to be signed in to manage settings.'),
    ).toBeInTheDocument();
  });

  it('initializes favorites with every org id when the user has none yet', async () => {
    const user = mockUser();
    const orgA = mockOrganization({ id: 'Nijisanji', name: 'にじさんじ' });
    const orgB = mockOrganization({ id: 'Hololive', name: 'ホロライブ' });
    setAuth({ user });
    const prefs = setPrefs({
      organizations: [orgA, orgB],
      favoriteOrgIds: [],
    });

    render(wrap(<SettingsPage />));

    await waitFor(() => {
      expect(prefs.initializeFavorites).toHaveBeenCalledWith([
        'Nijisanji',
        'Hololive',
      ]);
    });
  });

  it('does not call initializeFavorites when the user already has favorites', async () => {
    const user = mockUser();
    const orgA = mockOrganization({ id: 'Nijisanji', name: 'にじさんじ' });
    setAuth({ user });
    const prefs = setPrefs({
      organizations: [orgA],
      favoriteOrgIds: ['Nijisanji'],
    });

    render(wrap(<SettingsPage />));

    await waitFor(() => {
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });
    expect(prefs.initializeFavorites).not.toHaveBeenCalled();
  });

  it('renders enabled and disabled organizations from preferences', () => {
    const user = mockUser();
    const orgA = mockOrganization({ id: 'Nijisanji', name: 'にじさんじ' });
    const orgB = mockOrganization({ id: 'Hololive', name: 'ホロライブ' });
    const orgC = mockOrganization({ id: 'VSpo', name: 'ぶいすぽ' });
    setAuth({ user });
    setPrefs({
      organizations: [orgA, orgB, orgC],
      favoriteOrgIds: ['Nijisanji', 'Hololive'],
    });

    render(wrap(<SettingsPage />));

    expect(screen.getByText('Favorite Organizations')).toBeInTheDocument();
    expect(screen.getByText('Available Organizations')).toBeInTheDocument();
    expect(screen.getByText('にじさんじ')).toBeInTheDocument();
    expect(screen.getByText('ホロライブ')).toBeInTheDocument();
    expect(screen.getByText('ぶいすぽ')).toBeInTheDocument();
  });

  it('calls toggleFavorite when an inactive org is selected', async () => {
    const user = mockUser();
    const orgA = mockOrganization({ id: 'Nijisanji', name: 'にじさんじ' });
    const orgB = mockOrganization({ id: 'Hololive', name: 'ホロライブ' });
    setAuth({ user });
    const prefs = setPrefs({
      organizations: [orgA, orgB],
      favoriteOrgIds: ['Nijisanji'],
    });

    render(wrap(<SettingsPage />));

    // Find the disabled-section checkbox by its associated label text.
    const disabledLabel = screen.getByText('ホロライブ');
    const card = disabledLabel.closest('div')?.parentElement;
    const checkbox = card?.querySelector('input[type="checkbox"]');
    expect(checkbox).toBeTruthy();
    if (!checkbox) throw new Error('checkbox not found');
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(prefs.toggleFavorite).toHaveBeenCalledWith('Hololive', true);
    });
  });

  it('opens the constraint modal instead of removing the last favorite', async () => {
    const user = mockUser();
    const orgA = mockOrganization({ id: 'Nijisanji', name: 'にじさんじ' });
    setAuth({ user });
    const prefs = setPrefs({
      organizations: [orgA],
      favoriteOrgIds: ['Nijisanji'],
    });

    render(wrap(<SettingsPage />));

    const enabledLabel = screen.getByText('にじさんじ');
    const card = enabledLabel.closest('div')?.parentElement;
    const checkbox = card?.querySelector('input[type="checkbox"]');
    if (!checkbox) throw new Error('checkbox not found');
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(screen.getByText('Selection Required')).toBeInTheDocument();
    });
    expect(prefs.toggleFavorite).not.toHaveBeenCalled();

    // Close the modal via OK button.
    fireEvent.click(screen.getByRole('button', { name: 'OK' }));
  });

  it('removes a favorite via toggleFavorite when more than one is selected', async () => {
    const user = mockUser();
    const orgA = mockOrganization({ id: 'Nijisanji', name: 'にじさんじ' });
    const orgB = mockOrganization({ id: 'Hololive', name: 'ホロライブ' });
    setAuth({ user });
    const prefs = setPrefs({
      organizations: [orgA, orgB],
      favoriteOrgIds: ['Nijisanji', 'Hololive'],
    });

    render(wrap(<SettingsPage />));

    const enabledLabel = screen.getByText('にじさんじ');
    const card = enabledLabel.closest('div')?.parentElement;
    const checkbox = card?.querySelector('input[type="checkbox"]');
    if (!checkbox) throw new Error('checkbox not found');
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(prefs.toggleFavorite).toHaveBeenCalledWith('Nijisanji', false);
    });
  });

  it('forwards reorder events to updateOrder', () => {
    const user = mockUser();
    const orgA = mockOrganization({ id: 'Nijisanji', name: 'にじさんじ' });
    const orgB = mockOrganization({ id: 'Hololive', name: 'ホロライブ' });
    setAuth({ user });
    const prefs = setPrefs({
      organizations: [orgA, orgB],
      favoriteOrgIds: ['Nijisanji', 'Hololive'],
    });

    render(wrap(<SettingsPage />));

    fireEvent.click(screen.getByTestId('reorder-trigger'));
    expect(prefs.updateOrder).toHaveBeenCalledWith(['Hololive', 'Nijisanji']);
  });
});
