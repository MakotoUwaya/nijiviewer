'use client';

import {
  HeartIcon,
  SignalIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { button as buttonStyles, Link, Snippet } from '@heroui/react';
import NextLink from 'next/link';
import type { JSX } from 'react';
import { GithubIcon } from '@/components/icons';
import { subtitle, title } from '@/components/primitives';
import { siteConfig } from '@/config/site';

export function HomeContent(): JSX.Element {
  return (
    <div className="flex flex-col items-center w-full">
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 min-h-[60vh]">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Discover&nbsp;</h1>
          <h1 className={title({ color: 'violet' })}>VTuber&nbsp;</h1>
          <br />
          <h1 className={title()}>streams with ease and convenience.</h1>
          <h2 className={subtitle({ class: 'mt-4' })}>
            Track and explore your favorite NijiSanji streamers in one place.
          </h2>
        </div>

        <div className="flex gap-3">
          <Link
            as={NextLink}
            className={buttonStyles({
              color: 'primary',
              radius: 'full',
              variant: 'shadow',
            })}
            href={siteConfig.links.docs}
            isExternal
          >
            Documentation
          </Link>
          <Link
            as={NextLink}
            className={buttonStyles({ variant: 'bordered', radius: 'full' })}
            href={siteConfig.links.github}
            isExternal
          >
            <GithubIcon size={20} />
            GitHub
          </Link>
        </div>

        <div className="mt-8">
          <Snippet hideCopyButton hideSymbol variant="flat">
            <span>Live streams • Streamer search</span>
          </Snippet>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-20 max-w-6xl px-6 w-full">
        <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-default-200 dark:border-default-100 bg-content1/50 backdrop-blur-sm">
          <div className="p-4 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-500 mb-4">
            <SignalIcon className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">Catch Every Moment</h3>
          <p className="text-default-500">
            Real-time tracking of live streams. Never miss your oshi&apos;s
            broadcast with instant updates.
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-default-200 dark:border-default-100 bg-content1/50 backdrop-blur-sm">
          <div className="p-4 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-500 mb-4">
            <SparklesIcon className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">Discover New Talents</h3>
          <p className="text-default-500">
            Explore a vast library of streamers and clips. Find your next
            favorite VTuber with advanced search.
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-default-200 dark:border-default-100 bg-content1/50 backdrop-blur-sm">
          <div className="p-4 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-500 mb-4">
            <HeartIcon className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">Your Personal Feed</h3>
          <p className="text-default-500">
            Mark your favorites and build a customized timeline. Focus on the
            content that matters to you.
          </p>
        </div>
      </section>
    </div>
  );
}
