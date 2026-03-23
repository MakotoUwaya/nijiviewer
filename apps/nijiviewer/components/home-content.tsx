'use client';

import {
  HeartIcon,
  SignalIcon,
  SparklesIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { button as buttonStyles, Link, Snippet } from '@heroui/react';
import NextLink from 'next/link';
import type { JSX } from 'react';
import { GithubIcon } from '@/components/icons';
import { siteConfig } from '@/config/site';

export function HomeContent(): JSX.Element {
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
              Discover <span className="text-primary italic drop-shadow-[0_0_12px_rgba(0,229,255,0.4)]">VTubers</span> <br className="hidden sm:block" />
              with ease.
            </h1>
            <p className="hidden md:block text-lg md:text-xl text-default-600 max-w-2xl mb-12 font-medium leading-relaxed">
              Track and explore your favorite NijiSanji streamers in one place. A sophisticated hub for the digital age.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center w-full justify-center mt-auto md:mt-0">
              <Link
                as={NextLink}
                className={buttonStyles({
                  color: 'primary',
                  radius: 'full',
                  variant: 'shadow',
                  class: 'px-8 py-6 font-bold tracking-widest text-sm shadow-xl shadow-primary/20 uppercase w-full sm:w-auto hover:brightness-110 transition-all flex items-center gap-2 group',
                })}
                href={siteConfig.links.docs}
                isExternal
              >
                Get Started
                <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1 hidden md:inline-block">arrow_forward</span>
              </Link>
              <Link
                as={NextLink}
                className={buttonStyles({
                  variant: 'bordered',
                  radius: 'full',
                  class: 'px-8 py-6 font-bold tracking-widest text-sm border-default-200 hover:bg-default-100 uppercase w-full sm:w-auto bg-content1/30 backdrop-blur-md hover:scale-[1.02] transition-transform hidden md:flex',
                })}
                href={siteConfig.links.github}
                isExternal
              >
                <GithubIcon size={20} />
                GitHub
              </Link>
            </div>
            
            <div className="hidden md:block mt-12 backdrop-blur-md bg-content1/30 rounded-xl p-1 border border-default-200/50 shadow-sm relative z-20">
              <Snippet hideCopyButton hideSymbol variant="flat" className="bg-transparent text-default-600 font-medium">
                <span>Live streams • Streamer search • Personal Feed</span>
              </Snippet>
            </div>
          </div>
        </div>
      </section>

      {/* Live Now Carousel (Mock) */}
      <section className="relative z-10 w-full max-w-screen-xl mx-auto px-6 mb-16 md:mb-24">
        <div className="flex justify-between items-end mb-6">
          <div>
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-default-500 mb-1 block">Real-time</span>
            <h3 className="text-2xl md:text-3xl font-black tracking-tight">Live Now</h3>
          </div>
          <button className="text-primary text-xs font-bold tracking-widest uppercase hover:text-primary-400 transition-colors">View All</button>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-4 -mx-6 px-6 md:mx-0 md:px-0 no-scrollbar snap-x">
          {/* Mock Card 1 */}
          <div className="min-w-[280px] md:min-w-[320px] snap-start">
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-default-100 border border-default-200/50 mb-3 group cursor-pointer">
              <div className="absolute inset-0 bg-primary/20 group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-3 left-3 flex items-center gap-2 bg-background/60 backdrop-blur-md px-2 py-1 rounded-lg border border-default-200/50">
                <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
                <span className="text-[10px] font-bold text-danger uppercase tracking-tighter">Live</span>
              </div>
              <div className="absolute bottom-3 right-3 bg-primary/20 backdrop-blur-md px-2 py-1 rounded-md">
                <span className="text-[10px] font-bold text-primary-500">1.2k Watching</span>
              </div>
            </div>
            <div className="flex gap-3 px-1">
              <div className="w-10 h-10 rounded-full border-2 border-primary/50 p-0.5 shrink-0 bg-content2" />
              <div>
                <h4 className="text-sm font-bold text-foreground truncate">Ethereal Night Stream</h4>
                <p className="text-xs text-default-500">Streamer Alpha</p>
              </div>
            </div>
          </div>
          {/* Mock Card 2 */}
          <div className="min-w-[280px] md:min-w-[320px] snap-start">
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-default-100 border border-default-200/50 mb-3 group cursor-pointer">
              <div className="absolute inset-0 bg-secondary/20 group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-3 left-3 flex items-center gap-2 bg-background/60 backdrop-blur-md px-2 py-1 rounded-lg border border-default-200/50">
                <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
                <span className="text-[10px] font-bold text-danger uppercase tracking-tighter">Live</span>
              </div>
              <div className="absolute bottom-3 right-3 bg-primary/20 backdrop-blur-md px-2 py-1 rounded-md">
                <span className="text-[10px] font-bold text-primary-500">850 Watching</span>
              </div>
            </div>
            <div className="flex gap-3 px-1">
              <div className="w-10 h-10 rounded-full border-2 border-secondary/50 p-0.5 shrink-0 bg-content2" />
              <div>
                <h4 className="text-sm font-bold text-foreground truncate">Cyberpunk City Walk</h4>
                <p className="text-xs text-default-500">Streamer Beta</p>
              </div>
            </div>
          </div>
          {/* Mock Card 3 */}
          <div className="min-w-[280px] md:min-w-[320px] snap-start">
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-default-100 border border-default-200/50 mb-3 group cursor-pointer">
              <div className="absolute inset-0 bg-pink-500/20 group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-3 left-3 flex items-center gap-2 bg-background/60 backdrop-blur-md px-2 py-1 rounded-lg border border-default-200/50">
                <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
                <span className="text-[10px] font-bold text-danger uppercase tracking-tighter">Live</span>
              </div>
              <div className="absolute bottom-3 right-3 bg-pink-500/20 backdrop-blur-md px-2 py-1 rounded-md">
                <span className="text-[10px] font-bold text-pink-500">420 Watching</span>
              </div>
            </div>
            <div className="flex gap-3 px-1">
              <div className="w-10 h-10 rounded-full border-2 border-pink-500/50 p-0.5 shrink-0 bg-content2" />
              <div>
                <h4 className="text-sm font-bold text-foreground truncate">Morning Chat & Coffee</h4>
                <p className="text-xs text-default-500">Streamer Gamma</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Talents Spotlight (New Mobile Addition) */}
      <section className="relative z-10 w-full max-w-screen-xl mx-auto px-6 mb-16 md:mb-24 md:hidden">
        <div className="flex justify-between items-end mb-6">
          <div>
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-default-500 mb-1 block">Spotlight</span>
            <h3 className="text-2xl font-black tracking-tight">Featured Talents</h3>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {/* Talent A */}
          <div className="bg-content1/50 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center border border-default-200/50 hover:border-primary/50 transition-all group shadow-sm">
            <div className="relative mb-3">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-md scale-90 group-hover:scale-110 transition-transform" />
              <div className="relative w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-primary to-secondary">
                <div className="w-full h-full rounded-full bg-background" />
              </div>
            </div>
            <span className="text-sm font-bold text-foreground">Streamer A</span>
            <span className="text-[10px] uppercase tracking-widest text-primary-500 font-bold mt-1">V-Singer</span>
          </div>
          {/* Talent B */}
          <div className="bg-content1/50 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center border border-default-200/50 hover:border-primary/50 transition-all group shadow-sm">
            <div className="relative mb-3">
              <div className="absolute inset-0 bg-secondary/20 rounded-full blur-md scale-90 group-hover:scale-110 transition-transform" />
              <div className="relative w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-secondary to-pink-500">
                <div className="w-full h-full rounded-full bg-background" />
              </div>
            </div>
            <span className="text-sm font-bold text-foreground">Streamer B</span>
            <span className="text-[10px] uppercase tracking-widest text-secondary-500 font-bold mt-1">Gamer</span>
          </div>
          {/* Talent C */}
          <div className="bg-content1/50 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center border border-default-200/50 hover:border-primary/50 transition-all group shadow-sm">
            <div className="relative mb-3">
              <div className="absolute inset-0 bg-pink-500/20 rounded-full blur-md scale-90 group-hover:scale-110 transition-transform" />
              <div className="relative w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-pink-500 to-violet-500">
                <div className="w-full h-full rounded-full bg-background" />
              </div>
            </div>
            <span className="text-sm font-bold text-foreground">Streamer C</span>
            <span className="text-[10px] uppercase tracking-widest text-pink-500 font-bold mt-1">Chatting</span>
          </div>
          {/* Talent D */}
          <div className="bg-content1/50 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center border border-default-200/50 hover:border-primary/50 transition-all group shadow-sm">
            <div className="relative mb-3">
              <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-md scale-90 group-hover:scale-110 transition-transform" />
              <div className="relative w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-violet-500 to-primary">
                <div className="w-full h-full rounded-full bg-background" />
              </div>
            </div>
            <span className="text-sm font-bold text-foreground">Streamer D</span>
            <span className="text-[10px] uppercase tracking-widest text-violet-500 font-bold mt-1">ASMR</span>
          </div>
        </div>
      </section>

      {/* Platform Perks Section (Bento Layout) */}
      <section className="relative z-10 w-full max-w-screen-xl mx-auto px-6 mb-16 md:mb-32">
        <div className="mb-8 text-left md:text-center">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-default-500 mb-1 block md:hidden">Experience</span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-2 md:mb-4 uppercase">
            Platform Perks
          </h2>
          <p className="text-default-500 text-sm md:text-lg max-w-xl md:mx-auto font-medium">
            Engineered for the ultimate viewing experience.
          </p>
        </div>

        <div className="grid grid-cols-6 md:grid-cols-3 gap-4 md:gap-8">
          {/* Card 1 (Asymmetric on mobile, normal on desktop) */}
          <div className="col-span-4 md:col-span-1 group relative overflow-hidden rounded-[2rem] p-6 md:p-8 border border-default-200/50 bg-content1/60 backdrop-blur-xl hover:bg-content2 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 flex flex-col justify-between min-h-[160px]">
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center text-primary-500 shrink-0 mb-4 md:mb-6">
              <SignalIcon className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div>
              <h3 className="font-bold text-sm md:text-xl mb-1 md:mb-3 tracking-wide uppercase text-foreground">Catch Every Moment</h3>
              <p className="text-[10px] md:text-sm text-default-500 leading-relaxed font-medium">
                Real-time tracking and instant highlights.
              </p>
            </div>
          </div>

          {/* Card 2 (Small box on mobile) */}
          <div className="col-span-2 md:col-span-1 group relative overflow-hidden rounded-[2rem] p-4 md:p-8 border border-default-200/50 bg-content2/50 backdrop-blur-xl hover:bg-content2 transition-all duration-300 flex flex-col items-center justify-center text-center min-h-[160px]">
            <SparklesIcon className="w-8 h-8 md:w-14 md:h-14 text-pink-500 mb-2 md:mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-[10px] md:text-xl uppercase tracking-tighter md:tracking-wide text-foreground leading-tight">Discover <br className="hidden md:block"/> Talents</h3>
            <p className="hidden md:block text-sm text-default-500 mt-3 font-medium">
              Explore a vast library of streamers.
            </p>
          </div>

          {/* Card 3 (Full width asymmetric on mobile) */}
          <div className="col-span-6 md:col-span-1 group relative overflow-hidden rounded-[2rem] p-6 md:p-8 border border-default-200/50 bg-gradient-to-br from-content2/80 to-background backdrop-blur-xl hover:brightness-110 transition-all duration-300 flex items-center md:flex-col md:items-start md:justify-between gap-4 md:gap-0 min-h-[120px] md:min-h-[160px]">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary-500 shrink-0 mb-0 md:mb-6">
              <HeartIcon className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div>
              <h3 className="font-bold text-base md:text-xl mb-1 md:mb-3 tracking-wide uppercase text-foreground">Your Personal Feed</h3>
              <p className="text-[11px] md:text-sm text-default-500 leading-relaxed font-medium">
                Tailored notifications based on your viewing history and favorites.
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
            Ready to <br className="hidden md:block" /> <span className="text-primary italic drop-shadow-[0_0_8px_rgba(0,229,255,0.3)]">Evolve</span> Your Feed?
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full">
            <Link
              as={NextLink}
              className={buttonStyles({
                color: 'primary',
                radius: 'full',
                variant: 'shadow',
                class: 'w-full sm:w-auto px-12 py-8 font-bold text-lg hover:scale-[1.03] transition-transform duration-300 uppercase tracking-widest shadow-2xl shadow-primary/30',
              })}
              href={siteConfig.links.docs}
              isExternal
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

      {/* Mobile Bottom Navigation Mock */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-background/90 backdrop-blur-2xl rounded-t-[1.5rem] border-t border-default-200/50 flex justify-around items-center px-2 pb-6 pt-4 shadow-[0_-8px_32px_rgba(0,0,0,0.4)]">
        <div className="flex flex-col gap-1 items-center justify-center text-primary-500 scale-110 transition-all cursor-pointer">
          <SignalIcon className="w-6 h-6" />
          <span className="text-[9px] font-bold tracking-wide uppercase">Streams</span>
        </div>
        <div className="flex flex-col gap-1 items-center justify-center text-default-400 hover:text-foreground transition-all cursor-pointer">
          <SparklesIcon className="w-6 h-6" />
          <span className="text-[9px] font-bold tracking-wide uppercase">Talents</span>
        </div>
        <div className="flex flex-col gap-1 items-center justify-center text-default-400 hover:text-foreground transition-all cursor-pointer">
          <HeartIcon className="w-6 h-6" />
          <span className="text-[9px] font-bold tracking-wide uppercase">Feed</span>
        </div>
        <div className="flex flex-col gap-1 items-center justify-center text-default-400 hover:text-foreground transition-all cursor-pointer">
          <UserIcon className="w-6 h-6" />
          <span className="text-[9px] font-bold tracking-wide uppercase">Profile</span>
        </div>
      </nav>
    </div>
  );
}
