'use client';

import OrgSelector from '@/components/org-selector';
import { siteConfig } from '@/config/site';
import { organizationMap } from '@/const/organizations';
import { useSidebar } from '@/context/sidebar-context';
import { useYouTubePlayer } from '@/hooks/useYouTubePlayerContext';
import type { Organization } from '@/lib/holodex';
import { Button, Divider } from '@heroui/react';
import clsx from 'clsx';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { type JSX, Suspense } from 'react';
import { Search } from './search';
import VideoPlayerToggle from './video-player-toggle';

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  onChangeOrganization: (organization: Organization) => void;
  leafSegmentName: string;
  isMobile?: boolean;
};

const getSegmentName = (path: string): string => {
  if (path === '/') {
    return path;
  }
  return path.split('/')[1];
};

export function Sidebar({
  isOpen,
  onClose,
  onChangeOrganization,
  leafSegmentName,
  isMobile = false,
}: SidebarProps): JSX.Element {
  const pathName = usePathname();
  const segmentName = getSegmentName(pathName);
  const { sidebarWidth } = useSidebar();
  const { isYouTubePlayer, toggleYouTubePlayer } = useYouTubePlayer();

  const linkColor = (href: string): 'primary' | 'danger' | 'foreground' => {
    return href === `${segmentName}` || href.startsWith(`/${segmentName}/`)
      ? 'primary'
      : 'foreground';
  };

  const handleLinkClick = () => {
    if (isMobile) {
      onClose();
    }
  };

  const handleSearch = () => {
    if (isMobile) {
      onClose();
    }
  };

  const handleOrgChange = (organization: Organization) => {
    onChangeOrganization(organization);
    if (isMobile) {
      onClose();
    }
  };

  const SidebarContent = (
    <div className="flex flex-col h-full px-3 py-4 overflow-hidden">
      {/* 検索セクション */}
      <div className="mb-6 min-w-0">
        <h3 className="text-sm font-semibold text-default-600 mb-3">Search</h3>
        <div className="w-full min-w-0">
          <Suspense fallback={<div>Loading search...</div>}>
            <Search onSearch={handleSearch} />
          </Suspense>
        </div>
      </div>
      <Divider className="mb-6" />
      {/* Organization セレクター */}
      <div className="mb-6 min-w-0">
        <h3 className="text-sm font-semibold text-default-600 mb-3">
          Organization
        </h3>
        <div className="w-full min-w-0">
          <OrgSelector
            items={organizationMap}
            selectedKey={leafSegmentName}
            onChange={handleOrgChange}
            className="w-full"
          />
        </div>
      </div>
      <Divider className="mb-6" /> {/* ナビゲーションメニュー */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-default-600 mb-3">
          Navigation
        </h3>
        <nav className="space-y-2">
          {siteConfig.navItems.map((item) => (
            <NextLink
              key={item.href}
              href={{
                pathname: item.href,
              }}
              onClick={handleLinkClick}
              className={clsx(
                'block px-3 py-2 rounded-md text-sm font-medium transition-colors truncate',
                linkColor(item.href) === 'primary'
                  ? 'bg-primary/10 text-primary'
                  : 'text-default-700 hover:bg-default-100',
              )}
            >
              {item.label}
            </NextLink>
          ))}
        </nav>
      </div>
      <Divider className="my-4" />
      {/* 設定セクション */}
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-default-600 mb-3">
          Settings
        </h3>
        <div className="px-3 py-2">
          <VideoPlayerToggle
            isYouTubePlayer={isYouTubePlayer}
            onChange={toggleYouTubePlayer}
          />
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {isOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={onClose}
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose();
            }}
            role="button"
            tabIndex={0}
            aria-label="Close sidebar"
          />
        )}
        <div
          className={clsx(
            'fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] transform bg-background transition-transform duration-200 ease-in-out lg:hidden overflow-hidden flex flex-col',
            isOpen ? 'translate-x-0' : '-translate-x-full',
          )}
          style={{ width: `${sidebarWidth}px` }}
        >
          <div className="flex justify-between items-center p-4 flex-shrink-0">
            <h2 className="text-lg font-semibold">Menu</h2>
            <Button variant="light" onPress={onClose} className="min-w-fit p-2">
              ×
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto">{SidebarContent}</div>
        </div>
      </>
    );
  }

  // デスクトップ用のサイドバー
  return (
    <aside
      className={clsx(
        'fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] transform bg-background transition-transform duration-200 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full',
      )}
      style={{ width: `${sidebarWidth}px` }}
    >
      {SidebarContent}
    </aside>
  );
}
