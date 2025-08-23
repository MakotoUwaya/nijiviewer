import clsx from 'clsx';
import type { Metadata, Viewport } from 'next';
import type { JSX } from 'react';
import { LayoutComponent } from '@/components/layout-component';
import { Navbar } from '@/components/navbar';
import { fontSans } from '@/config/fonts';
import { siteConfig } from '@/config/site';
import { SidebarProvider } from '@/context/sidebar-context';
import { YouTubePlayerProvider } from '@/hooks/useYouTubePlayerContext';
import Metrics from '@/metrics';
import '@/styles/globals.css';

import { Providers } from './providers';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,

  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={clsx(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
          <SidebarProvider>
            <YouTubePlayerProvider>
              <div className="relative flex flex-col min-h-screen">
                <Navbar />
                <LayoutComponent>{children}</LayoutComponent>
              </div>
            </YouTubePlayerProvider>
          </SidebarProvider>
        </Providers>
        <Metrics />
      </body>
    </html>
  );
}
