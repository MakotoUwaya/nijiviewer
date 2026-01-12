import type { Meta, StoryObj } from '@storybook/nextjs';
import { AuthContext, type AuthContextType } from '@/context/auth-context';
import { SidebarProvider } from '@/context/sidebar-context';
import { YouTubePlayerProvider } from '@/hooks/useYouTubePlayerContext';
import { Navbar } from './navbar';

import { PreferencesContext } from '@/context/preferences-context'; // Added import

// モックのAuthContextの値
const mockAuthContext: AuthContextType = {
  session: null,
  user: null,
  isLoading: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
};

// Mock Preferences Context
const mockPreferencesContext = {
  favoriteOrgIds: [],
  organizations: [],
  isLoading: false,
  toggleFavorite: async () => {},
  initializeFavorites: async () => {},
  updateOrder: async () => {},
};

const meta = {
  title: 'Components/Navbar',
  component: Navbar,
  tags: ['autodocs'],
  decorators: [
    (Story) => {
      return (
        <AuthContext.Provider value={mockAuthContext}>
          <PreferencesContext.Provider value={mockPreferencesContext}>
            <SidebarProvider>
              <YouTubePlayerProvider>
                <Story />
              </YouTubePlayerProvider>
            </SidebarProvider>
          </PreferencesContext.Provider>
        </AuthContext.Provider>
      );
    },
  ],
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
