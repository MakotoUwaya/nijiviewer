"use client";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProvider } from "next-themes";
import type { JSX, ReactNode } from "react";

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
      <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
    </HeroUIProvider>
  );
}
