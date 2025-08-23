'use client';

import {
  Button,
  Link,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Navbar as NextUINavbar,
  Spinner,
  useDisclosure,
} from '@heroui/react';
import NextLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { JSX } from 'react';
import { siteConfig } from '@/config/site';
import { useAuth } from '@/context/auth-context';
import { useSidebar } from '@/context/sidebar-context';
import type { Organization } from '@/lib/holodex';
import { AuthModal } from './auth-modal';
import { GithubIcon, Logo, MenuIcon } from './icons';
import { Sidebar } from './sidebar';
import { ThemeSwitch } from './theme-switch';

const getLeafSegmentName = (path: string): string => {
  if (path === '/') {
    return '';
  }
  return decodeURIComponent(path.split('/')[2]?.trim() || '');
};

export function Navbar(): JSX.Element {
  const router = useRouter();
  const pathName = usePathname();
  const leafSegmentName = getLeafSegmentName(pathName);
  const { isSidebarOpen, setIsSidebarOpen, isMobile, toggleSidebar } =
    useSidebar();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { user, signOut, isLoading } = useAuth();

  const onChangeOrganization = (organization: Organization) => {
    router.push(`/live-videos/${organization.id}`);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed', error);
    }
  };

  return (
    <>
      <NextUINavbar
        maxWidth="full"
        position="sticky"
        className="px-1 sm:px-6"
        classNames={{
          wrapper: 'px-0',
        }}
      >
        <NavbarContent justify="start">
          <NavbarItem>
            <Button
              variant="light"
              isIconOnly
              onPress={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <MenuIcon className="w-6 h-6 text-default-500" />
            </Button>
          </NavbarItem>

          <NavbarBrand className="gap-3 max-w-fit">
            <NextLink
              className="flex justify-start items-center gap-1"
              href="/"
            >
              <Logo />
              <p className="font-bold text-inherit ml-2">NijiViewer</p>
            </NextLink>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem>
            <Link aria-label="Github" href={siteConfig.links.github} isExternal>
              <GithubIcon className="text-default-500" />
            </Link>
          </NavbarItem>

          <NavbarItem>
            <ThemeSwitch />
          </NavbarItem>

          <NavbarItem>
            {isLoading ? (
              <Button
                color="primary"
                size="sm"
                variant="flat"
                isLoading
                spinner={<Spinner size="sm" color="current" />}
              />
            ) : user ? (
              <Button
                color="danger"
                size="sm"
                variant="light"
                onPress={handleSignOut}
              >
                Sign Out
              </Button>
            ) : (
              <Button color="primary" size="sm" variant="flat" onPress={onOpen}>
                Sign In
              </Button>
            )}
          </NavbarItem>
        </NavbarContent>
      </NextUINavbar>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onChangeOrganization={onChangeOrganization}
        leafSegmentName={leafSegmentName}
        isMobile={isMobile}
      />

      <AuthModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
}
