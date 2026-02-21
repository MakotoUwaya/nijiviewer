'use client';

import { HeroUIProvider } from '@heroui/react';
import type { ThemeProvider } from 'next-themes';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { JSX, ReactNode } from 'react';
import { AuthProvider } from '@/context/auth-context';

export interface ProvidersProps {
  children: ReactNode;
  themeProps?: Parameters<typeof ThemeProvider>[0];
}

export function Providers({
  children,
  themeProps,
}: ProvidersProps): JSX.Element {
  return (
    <HeroUIProvider>
      <NextThemesProvider {...themeProps}>
        <AuthProvider>{children}</AuthProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
