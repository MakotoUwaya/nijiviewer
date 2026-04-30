import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/font/google', () => ({
  Inter: () => ({ variable: '--font-sans', className: 'font-sans' }),
  Fira_Code: () => ({ variable: '--font-mono', className: 'font-mono' }),
}));

vi.mock('@/styles/globals.css', () => ({}));

vi.mock('./providers', () => ({
  Providers: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="providers">{children}</div>
  ),
}));

vi.mock('@/context/preferences-context', () => ({
  PreferencesProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="preferences">{children}</div>
  ),
  usePreferences: () => ({}),
}));

vi.mock('@/context/sidebar-context', () => ({
  SidebarProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar">{children}</div>
  ),
  useSidebar: () => ({}),
}));

vi.mock('@/hooks/useYouTubePlayerContext', () => ({
  YouTubePlayerProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="youtube-provider">{children}</div>
  ),
  useYouTubePlayer: () => ({}),
}));

vi.mock('@/components/navbar', () => ({
  Navbar: () => <nav data-testid="navbar">navbar</nav>,
}));

vi.mock('@/components/layout-component', () => ({
  LayoutComponent: ({ children }: { children: React.ReactNode }) => (
    <main data-testid="layout-component">{children}</main>
  ),
}));

vi.mock('@/components/mobile-bottom-nav', () => ({
  MobileBottomNav: () => <nav data-testid="mobile-bottom-nav" />,
}));

vi.mock('@/components/in-app-youtube-player', () => ({
  default: () => <div data-testid="in-app-yt" />,
}));

vi.mock('@/metrics', () => ({
  default: () => <div data-testid="metrics" />,
}));

import RootLayout, { metadata, viewport } from './layout';

describe('RootLayout', () => {
  it('renders children inside the provider stack', () => {
    render(
      <RootLayout>
        <span data-testid="page">page-body</span>
      </RootLayout>,
    );

    expect(screen.getByTestId('providers')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('preferences')).toBeInTheDocument();
    expect(screen.getByTestId('youtube-provider')).toBeInTheDocument();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('layout-component')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-bottom-nav')).toBeInTheDocument();
    expect(screen.getByTestId('in-app-yt')).toBeInTheDocument();
    expect(screen.getByTestId('metrics')).toBeInTheDocument();
    expect(screen.getByTestId('page')).toHaveTextContent('page-body');
  });

  it('exposes metadata and viewport configuration', () => {
    expect(metadata.title).toBeDefined();
    expect(metadata.icons).toEqual({ icon: '/favicon.ico' });
    expect(Array.isArray(viewport.themeColor)).toBe(true);
  });
});
