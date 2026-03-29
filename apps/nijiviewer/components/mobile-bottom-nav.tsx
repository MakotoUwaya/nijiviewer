'use client';

import {
  Cog8ToothIcon,
  HeartIcon,
  SignalIcon,
} from '@heroicons/react/24/outline';
import {
  Cog8ToothIcon as Cog8ToothIconSolid,
  HeartIcon as HeartIconSolid,
  SignalIcon as SignalIconSolid,
} from '@heroicons/react/24/solid';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function MobileBottomNav() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        globalThis.requestAnimationFrame(() => {
          const currentScrollY = globalThis.scrollY;

          // Always show when near top
          if (currentScrollY < 50) {
            setIsVisible(true);
          } else if (currentScrollY > lastScrollY + 10) {
            // Hide when scrolling down significantly
            setIsVisible(false);
          } else if (currentScrollY < lastScrollY - 10) {
            // Show when scrolling up significantly
            setIsVisible(true);
          }

          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    globalThis.addEventListener('scroll', handleScroll, { passive: true });
    return () => globalThis.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navItems = [
    {
      href: '/live-videos/Nijisanji',
      label: 'LIVE',
      icon: SignalIcon,
      activeIcon: SignalIconSolid,
      isActive:
        pathname === '/' ||
        pathname.startsWith('/live-videos') ||
        pathname.startsWith('/liver/'),
    },
    {
      href: '/favorites',
      label: 'FAVORITE',
      icon: HeartIcon,
      activeIcon: HeartIconSolid,
      isActive: pathname.startsWith('/favorites'),
    },
    {
      href: '/settings',
      label: 'SETTINGS',
      icon: Cog8ToothIcon,
      activeIcon: Cog8ToothIconSolid,
      isActive: pathname.startsWith('/settings'),
    },
  ];

  return (
    <nav
      className={`md:hidden fixed bottom-0 left-0 w-full z-50 bg-background/90 backdrop-blur-2xl rounded-t-[1.5rem] border-t border-default-200/50 flex justify-around items-center px-4 pb-6 pt-4 shadow-[0_-8px_32px_rgba(0,0,0,0.4)] transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      {navItems.map((item) => {
        const Icon = item.isActive ? item.activeIcon : item.icon;
        return (
          <NextLink
            key={item.href}
            href={item.href}
            className={`flex flex-col gap-1 items-center justify-center transition-all cursor-pointer ${
              item.isActive
                ? 'text-primary-500 scale-110'
                : 'text-default-400 hover:text-foreground'
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-[9px] font-bold tracking-wide uppercase">
              {item.label}
            </span>
          </NextLink>
        );
      })}
    </nav>
  );
}
