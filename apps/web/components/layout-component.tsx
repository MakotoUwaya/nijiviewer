'use client';

import { Link } from '@heroui/link';
import type { ReactNode } from 'react';
import { useSidebar } from '@/context/sidebar-context';

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
        <Link isExternal href="https://www.heroui.com/">
          NextUI
        </Link>
      </footer>
    </div>
  );
}
