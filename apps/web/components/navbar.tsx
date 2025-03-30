'use client';

import OrgSelector from '@/components/org-selector';
import { siteConfig } from '@/config/site';
import { organizationMap } from '@/const/organizations';
import { useYouTubePlayer } from '@/hooks/useYouTubePlayerContext';
import type { Organization } from '@/lib/holodex';
import {
  Link,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Navbar as NextUINavbar,
  link as linkStyles,
} from '@heroui/react';
import clsx from 'clsx';
import NextLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { type JSX, Suspense, useState } from 'react';
import { GithubIcon, Logo } from './icons';
import { Search } from './search';
import { ThemeSwitch } from './theme-switch';
import VideoPlayerToggle from './video-player-toggle';

const getSegmentName = (path: string): string => {
  if (path === '/') {
    return path;
  }
  return path.split('/')[1];
};
const getLeafSegmentName = (path: string): string => {
  if (path === '/') {
    return '';
  }
  return decodeURIComponent(path.split('/')[2]?.trim() || '');
};

export function Navbar(): JSX.Element {
  const router = useRouter();
  const pathName = usePathname();
  const segmentName = getSegmentName(pathName);
  const leafSegmentName = getLeafSegmentName(pathName);
  const linkColor = (href: string): 'primary' | 'danger' | 'foreground' => {
    return href === `${segmentName}` || href.startsWith(`/${segmentName}/`)
      ? 'primary'
      : 'foreground';
  };
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isYouTubePlayer, toggleYouTubePlayer } = useYouTubePlayer();
  const handleSearch = () => {
    setIsMenuOpen(false);
  };
  const onChangeOrganization = (organization: Organization) => {
    setIsMenuOpen(false);
    router.push(`/live-videos/${organization.id}`);
  };

  return (
    <NextUINavbar
      isMenuOpen={isMenuOpen}
      maxWidth="xl"
      onMenuOpenChange={setIsMenuOpen}
      position="sticky"
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit mr-4">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">NijiViewer</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: 'foreground' }),
                  'data-[active=true]:text-primary data-[active=true]:font-medium',
                )}
                color="foreground"
                href={{
                  pathname: item.href,
                }}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <div className="hidden sm:flex">
          <Suspense fallback={<div>Loading search...</div>}>
            <Search onSearch={handleSearch} />
          </Suspense>
        </div>
        <div className="hidden sm:flex">
          <OrgSelector
            items={organizationMap}
            selectedKey={leafSegmentName}
            onChange={onChangeOrganization}
          />
        </div>
        <NavbarItem className="hidden sm:flex gap-2">
          <Link aria-label="Github" href={siteConfig.links.github} isExternal>
            <GithubIcon className="text-default-500" />
          </Link>
          <VideoPlayerToggle
            isYouTubePlayer={isYouTubePlayer}
            onChange={toggleYouTubePlayer}
          />
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <NavbarItem className="flex gap-2">
          <Link aria-label="Github" href={siteConfig.links.github} isExternal>
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="sm:hidden">
          <Suspense fallback={<div>Loading search...</div>}>
            <Search onSearch={handleSearch} />
          </Suspense>
        </div>
        <OrgSelector
          items={organizationMap}
          selectedKey={leafSegmentName}
          onChange={onChangeOrganization}
        />
        <div className="mx-4 mt-4 flex flex-col gap-2">
          <VideoPlayerToggle
            isYouTubePlayer={isYouTubePlayer}
            onChange={toggleYouTubePlayer}
          />
          {siteConfig.navMenuItems.map((item) => (
            <NavbarMenuItem key={item.href}>
              <Link color={linkColor(item.href)} href={item.href} size="lg">
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
}
