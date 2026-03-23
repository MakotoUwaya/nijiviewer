'use client';

import {
  ArrowRightIcon,
  HeartIcon,
  SignalIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { button as buttonStyles, Link, Snippet, Image } from '@heroui/react';
import NextLink from 'next/link';
import { type JSX, useEffect, useMemo, useState } from 'react';
import { getChannelsAction } from '@/app/actions';
import { GithubIcon } from '@/components/icons';
import { siteConfig } from '@/config/site';
import { useFavoriteLiversList } from '@/hooks/use-favorites';
import type { Channel, StreamVideo, Video } from '@/lib/holodex';
import { getImageUrl } from '@/lib/image-utils';
import VideoCardStream from './video-card-stream';

export function HomeContent({
  liveVideos = [],
}: Readonly<{
  liveVideos?: Video[];
}>): JSX.Element {
  const { favorites, isLoading: isFavLoading } = useFavoriteLiversList();
  const [featuredChannels, setFeaturedChannels] = useState<Channel[]>([]);
  const [isFeaturedLoading, setIsFeaturedLoading] = useState(true);

  const randomFavIds = useMemo(() => {
    if (!favorites || favorites.length === 0) return [];
    const shuffled = [...favorites].sort(
      () => 0.5 - crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296,
    );
    return shuffled.slice(0, 4).map((f) => f.liver_id);
  }, [favorites]);

  useEffect(() => {
    let active = true;
    const fetchFeatured = async () => {
      if (randomFavIds.length === 0) {
        if (active) {
          setFeaturedChannels([]);
          setIsFeaturedLoading(false);
        }
        return;
      }
      if (active) setIsFeaturedLoading(true);
      try {
        const channels = await getChannelsAction(randomFavIds);
        if (active) setFeaturedChannels(channels);
      } catch (error) {
        console.error('Failed to fetch featured channels', error);
      } finally {
        if (active) setIsFeaturedLoading(false);
      }
    };

    if (!isFavLoading) {
      fetchFeatured();
    }
    return () => {
      active = false;
    };
  }, [randomFavIds, isFavLoading]);

  return (
    <div className="flex flex-col items-center w-full overflow-hidden pb-32 md:pb-0">
      {/* Background Grid Overlay (Mobile & Desktop) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(100,110,130,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,110,130,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] md:min-h-[85vh] w-full px-6 py-12 md:py-20 text-center">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[60vw] h-[50vh] min-w-[300px] min-h-[300px] bg-primary/20 dark:bg-primary/10 blur-[100px] md:blur-[140px] rounded-full pointer-events-none" />

        {/* Mobile App-like Card wrapper for Hero on mobile, transparent on desktop */}
        <div className="relative w-full max-w-5xl md:bg-transparent rounded-[2.5rem] md:rounded-none overflow-hidden flex flex-col items-center justify-end md:justify-center p-8 md:p-0 md:border-none border border-default-200/50 dark:border-default-100/20 bg-content1/50 backdrop-blur-md md:backdrop-blur-none aspect-[4/5] md:aspect-auto">
          {/* Mobile Background Image / Gradient Placeholder */}
          <div className="absolute inset-0 z-0 md:hidden bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center md:items-center">
            <span className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold tracking-[0.2em] uppercase mb-6 md:mb-8 backdrop-blur-md">
              The Celestial Observer
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.05] md:leading-[1.0] mb-6 md:mb-8 text-foreground drop-shadow-md">
              Discover{' '}
              <span className="text-primary italic drop-shadow-[0_0_12px_rgba(0,229,255,0.4)]">
                VTubers
              </span>{' '}
              <br className="hidden sm:block" />
              with ease.
            </h1>
            <p className="hidden md:block text-lg md:text-xl text-default-600 max-w-2xl mb-12 font-medium leading-relaxed">
              Track and explore your favorite NijiSanji streamers in one place.
              A sophisticated hub for the digital age.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center w-full justify-center mt-auto md:mt-0">
              <Link
                as={NextLink}
                className={buttonStyles({
                  color: 'primary',
                  radius: 'full',
                  variant: 'shadow',
                  class:
                    'px-8 py-6 font-bold tracking-widest text-sm shadow-xl shadow-primary/20 uppercase w-full sm:w-auto hover:brightness-110 transition-all flex items-center gap-2 group',
                })}
                href={siteConfig.links.docs}
                isExternal
              >
                <span>Get Started</span>
                <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1 hidden md:inline-block ml-1" />
              </Link>
              <Link
                as={NextLink}
                className={buttonStyles({
                  variant: 'bordered',
                  radius: 'full',
                  class:
                    'px-8 py-6 font-bold tracking-widest text-sm border-default-200 hover:bg-default-100 uppercase w-full sm:w-auto bg-content1/30 backdrop-blur-md hover:scale-[1.02] transition-transform hidden md:flex',
                })}
                href={siteConfig.links.github}
                isExternal
              >
                <GithubIcon size={20} />
                GitHub
              </Link>
            </div>

            <div className="hidden md:block mt-12 backdrop-blur-md bg-content1/30 rounded-xl p-1 border border-default-200/50 shadow-sm relative z-20">
              <Snippet
                hideCopyButton
                hideSymbol
                variant="flat"
                className="bg-transparent text-default-600 font-medium"
              >
                <span>Live streams • Streamer search • Personal Feed</span>
              </Snippet>
            </div>
          </div>
        </div>
      </section>

      {/* Live Now Carousel */}
      <section className="relative z-10 w-full max-w-screen-xl mx-auto px-6 mb-16 md:mb-24">
        <div className="flex justify-between items-end mb-6">
          <div>
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-default-500 mb-1 block">
              Real-time
            </span>
            <h3 className="text-2xl md:text-3xl font-black tracking-tight">
              Live Now
            </h3>
          </div>
          <Link
            as={NextLink}
            href="/live-videos/Nijisanji"
            className="text-primary text-xs font-bold tracking-widest uppercase hover:text-primary-400 transition-colors bg-transparent border-none cursor-pointer"
          >
            View All
          </Link>
        </div>
        <div className="flex flex-col md:flex-row md:overflow-x-auto gap-4 md:pb-4 snap-none md:snap-x items-stretch md:[&::-webkit-scrollbar]:hidden md:[-ms-overflow-style:none] md:[scrollbar-width:none] -mx-4 px-4 md:mx-0 md:px-0">
          {liveVideos.length > 0 ? (
            liveVideos.map((video) => (
              <VideoCardStream
                key={video.id}
                {...(video as StreamVideo)}
                started={true}
                className="w-full md:w-[340px] md:min-w-[340px] lg:w-[380px] lg:min-w-[380px] md:snap-start shrink-0 p-0 h-full max-w-full"
              />
            ))
          ) : (
            <p className="text-default-500 text-sm">
              No live videos available at the moment.
            </p>
          )}
        </div>
      </section>

      {/* Featured Talents Spotlight (New Mobile Addition) */}
      <section className="relative z-10 w-full max-w-screen-xl mx-auto px-6 mb-16 md:mb-24 md:hidden">
        <div className="flex justify-between items-end mb-6">
          <div>
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-default-500 mb-1 block">
              Spotlight
            </span>
            <h3 className="text-2xl font-black tracking-tight">
              Featured Talents
            </h3>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {(() => {
            if (isFeaturedLoading || isFavLoading) {
              return (
                <div className="col-span-2 flex justify-center py-12">
                  <span className="text-default-400 text-sm animate-pulse">
                    Loading favorites...
                  </span>
                </div>
              );
            }
            if (featuredChannels.length > 0) {
              return featuredChannels.map((channel, idx) => {
                const bgColors = [
                  'bg-primary/20',
                  'bg-secondary/20',
                  'bg-pink-500/20',
                  'bg-violet-500/20',
                ];
                const gradColors = [
                  'from-primary to-secondary',
                  'from-secondary to-pink-500',
                  'from-pink-500 to-violet-500',
                  'from-violet-500 to-primary',
                ];
                const textColors = [
                  'text-primary-500',
                  'text-secondary-500',
                  'text-pink-500',
                  'text-violet-500',
                ];
                const colorIdx = idx % 4;

                return (
                  <Link
                    as={NextLink}
                    href={`/liver/${channel.id}`}
                    key={channel.id}
                    className="bg-content1/50 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center border border-default-200/50 hover:border-primary/50 transition-all group shadow-sm"
                  >
                    <div className="relative mb-3 w-16 h-16">
                      <div
                        className={`absolute inset-0 ${bgColors[colorIdx]} rounded-full blur-md scale-90 group-hover:scale-110 transition-transform`}
                      />
                      <div
                        className={`relative w-full h-full rounded-full p-0.5 bg-gradient-to-tr ${gradColors[colorIdx]}`}
                      >
                        <Image
                          src={getImageUrl(channel.photo)}
                          alt={channel.name}
                          className="w-full h-full rounded-full object-cover"
                          radius="full"
                          removeWrapper
                          crossOrigin="anonymous"
                        />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-foreground line-clamp-1 w-full text-center">
                      {channel.name}
                    </span>
                    <span
                      className={`text-[10px] uppercase tracking-widest ${textColors[colorIdx]} font-bold mt-1 line-clamp-1`}
                    >
                      {channel.org}
                    </span>
                  </Link>
                );
              });
            }
            return (
              <>
                {/* Talent A */}
                <div className="bg-content1/50 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center border border-default-200/50 hover:border-primary/50 transition-all group shadow-sm">
                  <div className="relative mb-3">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-md scale-90 group-hover:scale-110 transition-transform" />
                    <div className="relative w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-primary to-secondary">
                      <div className="w-full h-full rounded-full bg-background" />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-foreground">
                    Streamer A
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-primary-500 font-bold mt-1">
                    V-Singer
                  </span>
                </div>
                {/* Talent B */}
                <div className="bg-content1/50 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center border border-default-200/50 hover:border-primary/50 transition-all group shadow-sm">
                  <div className="relative mb-3">
                    <div className="absolute inset-0 bg-secondary/20 rounded-full blur-md scale-90 group-hover:scale-110 transition-transform" />
                    <div className="relative w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-secondary to-pink-500">
                      <div className="w-full h-full rounded-full bg-background" />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-foreground">
                    Streamer B
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-secondary-500 font-bold mt-1">
                    Gamer
                  </span>
                </div>
                {/* Talent C */}
                <div className="bg-content1/50 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center border border-default-200/50 hover:border-primary/50 transition-all group shadow-sm">
                  <div className="relative mb-3">
                    <div className="absolute inset-0 bg-pink-500/20 rounded-full blur-md scale-90 group-hover:scale-110 transition-transform" />
                    <div className="relative w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-pink-500 to-violet-500">
                      <div className="w-full h-full rounded-full bg-background" />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-foreground">
                    Streamer C
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-pink-500 font-bold mt-1">
                    Chatting
                  </span>
                </div>
                {/* Talent D */}
                <div className="bg-content1/50 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center border border-default-200/50 hover:border-primary/50 transition-all group shadow-sm">
                  <div className="relative mb-3">
                    <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-md scale-90 group-hover:scale-110 transition-transform" />
                    <div className="relative w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-violet-500 to-primary">
                      <div className="w-full h-full rounded-full bg-background" />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-foreground">
                    Streamer D
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-violet-500 font-bold mt-1">
                    ASMR
                  </span>
                </div>
              </>
            );
          })()}
        </div>
      </section>

      {/* Platform Perks Section (Bento Layout) */}
      <section className="relative z-10 w-full max-w-screen-xl mx-auto px-6 mb-16 md:mb-32">
        <div className="mb-8 text-left md:text-center">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-default-500 mb-1 block md:hidden">
            Experience
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-2 md:mb-4 uppercase">
            Platform Perks
          </h2>
          <p className="text-default-500 text-sm md:text-lg max-w-xl md:mx-auto font-medium">
            Engineered for the ultimate viewing experience.
          </p>
        </div>

        <div className="grid grid-cols-6 md:grid-cols-3 gap-4 md:gap-8">
          {/* Card 1 */}
          <div className="col-span-6 md:col-span-1 group relative overflow-hidden rounded-[2rem] p-6 md:p-8 border border-default-200/50 bg-content1/60 backdrop-blur-xl hover:bg-content2 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 flex flex-col justify-between min-h-[160px]">
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center text-primary-500 shrink-0 mb-4 md:mb-6">
              <SignalIcon className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div>
              <h3 className="font-bold text-base md:text-xl mb-1 md:mb-3 tracking-wide uppercase text-foreground">
                Catch Every Moment
              </h3>
              <p className="text-[11px] md:text-sm text-default-500 leading-relaxed font-medium">
                Real-time tracking and instant highlights.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="col-span-6 md:col-span-1 group relative overflow-hidden rounded-[2rem] p-6 md:p-8 border border-default-200/50 bg-content2/50 backdrop-blur-xl hover:bg-content2 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 flex flex-col justify-between min-h-[160px]">
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-500 shrink-0 mb-4 md:mb-6">
              <SparklesIcon className="w-6 h-6 md:w-8 md:h-8 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h3 className="font-bold text-base md:text-xl mb-1 md:mb-3 tracking-wide uppercase text-foreground">
                Discover Talents
              </h3>
              <p className="text-[11px] md:text-sm text-default-500 leading-relaxed font-medium">
                Explore a vast library of streamers.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="col-span-6 md:col-span-1 group relative overflow-hidden rounded-[2rem] p-6 md:p-8 border border-default-200/50 bg-gradient-to-br from-content2/80 to-background backdrop-blur-xl hover:brightness-110 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 flex flex-col justify-between min-h-[160px]">
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary-500 shrink-0 mb-4 md:mb-6">
              <HeartIcon className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div>
              <h3 className="font-bold text-base md:text-xl mb-1 md:mb-3 tracking-wide uppercase text-foreground">
                Your Personal Feed
              </h3>
              <p className="text-[11px] md:text-sm text-default-500 leading-relaxed font-medium">
                Tailored notifications based on your viewing history and
                favorites.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section (Desktop/Tablet mainly, simple on mobile) */}
      <section className="py-24 md:py-32 relative text-center w-full px-6 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 pointer-events-none mix-blend-overlay" />
        <div className="relative z-10 max-w-screen-xl mx-auto flex flex-col items-center">
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-8 md:mb-12 leading-none uppercase">
            Ready to <br className="hidden md:block" />{' '}
            <span className="text-primary italic drop-shadow-[0_0_8px_rgba(0,229,255,0.3)]">
              Evolve
            </span>{' '}
            Your Feed?
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full">
            <Link
              as={NextLink}
              className={buttonStyles({
                color: 'primary',
                radius: 'full',
                variant: 'shadow',
                class:
                  'w-full sm:w-auto px-12 py-8 font-bold text-lg hover:scale-[1.03] transition-transform duration-300 uppercase tracking-widest shadow-2xl shadow-primary/30',
              })}
              href={siteConfig.links.docs}
              isExternal
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
