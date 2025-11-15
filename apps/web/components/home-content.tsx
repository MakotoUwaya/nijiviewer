'use client';

import { button as buttonStyles, Link, Snippet } from '@heroui/react';
import NextLink from 'next/link';
import type { JSX } from 'react';
import { GithubIcon } from '@/components/icons';
import { subtitle, title } from '@/components/primitives';
import { siteConfig } from '@/config/site';

export function HomeContent(): JSX.Element {
  return (
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
  );
}
