"use client";

import { NextUIProvider } from "@nextui-org/react";
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
    <NextUIProvider>
      <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
    </NextUIProvider>
  );
}
