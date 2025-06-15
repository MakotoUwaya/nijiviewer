import { AuthContext, type AuthContextType } from '@/context/auth-context';
import { SidebarProvider } from '@/context/sidebar-context';
import { YouTubePlayerProvider } from '@/hooks/useYouTubePlayerContext';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { Navbar } from './navbar';

// モックのAuthContextの値
const mockAuthContext: AuthContextType = {
  session: null,
  user: null,
  isLoading: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
};

const meta = {
  title: 'Components/Navbar',
  component: Navbar,
  tags: ['autodocs'],
  decorators: [
    (Story) => {
      return (
        <AuthContext.Provider value={mockAuthContext}>
          <SidebarProvider>
            <YouTubePlayerProvider>
              <Story />
            </YouTubePlayerProvider>
          </SidebarProvider>
        </AuthContext.Provider>
      );
    },
  ],
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
