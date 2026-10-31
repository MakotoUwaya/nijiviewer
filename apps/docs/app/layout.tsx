import type { ReactNode } from 'react';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { GoogleAnalytics } from '@next/third-parties/google';
import MicrosoftClarity from '@/component/Clarity';
import { source } from '@/lib/source';
import { baseOptions } from '@/app/layout.config';
import './globals.css';

export const metadata = {
  metadataBase: new URL('https://docs.oichan.me'),
  title: {
    template: '%s | OiChan Docs',
    default: 'OiChan Docs',
  },
  description: 'OiChan Docs',
  applicationName: 'OiChan Docs',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <GoogleAnalytics gaId="G-KH3DDQCG6B" />
      <MicrosoftClarity />
      <body className="flex flex-col min-h-screen">
        <RootProvider>
          <DocsLayout tree={source.pageTree} {...baseOptions}>
            {children}
          </DocsLayout>
        </RootProvider>
      </body>
    </html>
  );
}
