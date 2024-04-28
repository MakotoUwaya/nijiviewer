'use client';

import OrgSelector from '@/components/org-selector';
import { siteConfig } from '@/config/site';
import { organizations } from '@/consts/organizations';
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
} from '@nextui-org/react';
import clsx from 'clsx';
import NextLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import {
  GithubIcon,
  Logo,
} from './icons';
import { ThemeSwitch } from './theme-switch';

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
  return decodeURIComponent(path.split("/")[2].trim());
};

export function Navbar(): JSX.Element {
  const router = useRouter();
  const pathName = usePathname();
  const segmentName = getSegmentName(pathName);
  const leafSegmentName = getLeafSegmentName(pathName);
  const linkColor = (href: string): 'primary' | 'danger' | 'foreground' => {
    return (href === `${segmentName}` || href.startsWith(`/${segmentName}/`)) ? 'primary' : 'foreground';
  };
  const onChangeOrganization = (organization: Organization) => {
    router.push(`/live-videos/${organization.id}`);
  };

  return (
    <NextUINavbar maxWidth='xl' position='sticky'>
      <NavbarContent className='basis-1/5 sm:basis-full' justify='start'>
        <NavbarBrand as='li' className='gap-3 max-w-fit'>
          <NextLink className='flex justify-start items-center gap-1' href='/'>
            <Logo />
            <p className='font-bold text-inherit'>NijiViewer</p>
          </NextLink>
        </NavbarBrand>
        <ul className='hidden lg:flex gap-4 justify-start ml-2'>
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: 'foreground' }),
                  'data-[active=true]:text-primary data-[active=true]:font-medium',
                )}
                color='foreground'
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className='hidden sm:flex basis-1/5 sm:basis-full'
        justify='end'
      >
        <div className='hidden md:flex'>
          <OrgSelector items={organizations} selectedKey={leafSegmentName} onChange={onChangeOrganization} />
        </div>
        <NavbarItem className='hidden sm:flex gap-2'>
          <Link aria-label='Github' href={siteConfig.links.github} isExternal>
            <GithubIcon className='text-default-500' />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className='sm:hidden basis-1 pl-4' justify='end'>
        <Link aria-label='Github' href={siteConfig.links.github} isExternal>
          <GithubIcon className='text-default-500' />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <OrgSelector items={organizations} selectedKey={leafSegmentName} onChange={onChangeOrganization} />
        <div className='mx-4 mt-2 flex flex-col gap-2'>
          {siteConfig.navMenuItems.map((item) => (
            <NavbarMenuItem key={item.href}>
              <Link color={linkColor(item.href)} href={item.href} size='lg'>
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
}
