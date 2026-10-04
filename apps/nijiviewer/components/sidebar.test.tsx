import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Sidebar } from '@/components/sidebar';
import { PreferencesContext } from '@/context/preferences-context';
import { SidebarProvider } from '@/context/sidebar-context';
import type { Organization } from '@/lib/holodex';

// ClientOnly モック（即時 children レンダリング）
vi.mock('@/components/client-only', () => ({
  ClientOnly: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const mockOrganizations: Organization[] = [
  { id: 'Nijisanji', name: 'にじさんじ', channelId: 'UCNiji' },
  { id: 'Hololive', name: 'ホロライブ', channelId: 'UCHolo' },
];

const mockPreferencesContext = {
  favoriteOrgIds: [],
  organizations: mockOrganizations,
  isLoading: false,
  toggleFavorite: vi.fn(),
  initializeFavorites: vi.fn(),
  updateOrder: vi.fn(),
};

describe('Sidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Channel List button as disabled when no organization is selected', () => {
    render(
      <PreferencesContext.Provider value={mockPreferencesContext}>
        <SidebarProvider>
          <Sidebar
            isOpen={true}
            onClose={vi.fn()}
            onChangeOrganization={vi.fn()}
            leafSegmentName=""
          />
        </SidebarProvider>
      </PreferencesContext.Provider>,
    );

    const channelListButton = screen.getByRole('button', {
      name: /channel list/i,
    });
    expect(channelListButton).toBeDisabled();
  });

  it('renders Channel List button as enabled link when organization is selected', () => {
    render(
      <PreferencesContext.Provider value={mockPreferencesContext}>
        <SidebarProvider>
          <Sidebar
            isOpen={true}
            onClose={vi.fn()}
            onChangeOrganization={vi.fn()}
            leafSegmentName="Nijisanji"
          />
        </SidebarProvider>
      </PreferencesContext.Provider>,
    );

    const channelListLink = screen.getByRole('button', {
      name: /channel list/i,
    });
    expect(channelListLink).not.toBeDisabled();
    expect(channelListLink).toHaveAttribute('href', '/channels/Nijisanji');
  });
});
