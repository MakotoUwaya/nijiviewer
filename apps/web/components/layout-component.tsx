'use client';

import { useSidebar } from '@/context/sidebar-context';
import type { ReactNode } from 'react';

interface LayoutComponentProps {
  children: ReactNode;
}

export function LayoutComponent({ children }: LayoutComponentProps) {
  const { isSidebarOpen, isMobile, sidebarWidth } = useSidebar();

  return (
    <div
      className="transition-all duration-200 ease-in-out flex flex-col flex-1"
      style={{
        marginLeft: !isMobile && isSidebarOpen ? `${sidebarWidth}px` : '0',
      }}
    >
      <main className="container mx-auto max-w-full md:px-6 flex-1">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3 mt-auto">
        <span className="text-default-600">Powered by</span>
        <p className="text-primary ml-1">NextUI</p>
      </footer>
    </div>
  );
}
