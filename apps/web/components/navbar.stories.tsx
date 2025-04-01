import { AuthContext, type AuthContextType } from '@/context/auth-context';
import { YouTubePlayerProvider } from '@/hooks/useYouTubePlayerContext';
import type { Meta, StoryObj } from '@storybook/react';
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
          <YouTubePlayerProvider>
            <Story />
          </YouTubePlayerProvider>
        </AuthContext.Provider>
      );
    },
  ],
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
