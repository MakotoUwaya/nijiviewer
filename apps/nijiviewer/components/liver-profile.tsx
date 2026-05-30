'use client';

import {
  ArrowTopRightOnSquareIcon,
  CalendarIcon,
  ChevronDownIcon,
  LinkIcon,
  ShoppingBagIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { Card, CardBody, Chip, Divider, Image, Link } from '@heroui/react';
import type { ReactNode } from 'react';
import { FavoriteButton } from '@/components/favorite-button';
import { getElapsedTime } from '@/components/search-result';
import type { Channel } from '@/lib/holodex';
import { getLiverExternalLinks } from '@/lib/liver-links';

interface LiverProfileProps {
  channel: Channel;
}

const urlPattern = /(https?:\/\/[^\s<>"']+)/g;

function formatCount(value?: string): string {
  return value ? Number(value).toLocaleString('ja-JP') : 'N/A';
}

function renderLinkedText(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(urlPattern)) {
    const url = match[0];
    const start = match.index ?? 0;

    if (start > lastIndex) {
      nodes.push(text.slice(lastIndex, start));
    }

    nodes.push(
      <Link
        key={`${url}-${start}`}
        className="break-all"
        href={url}
        isExternal
        size="sm"
      >
        {url}
      </Link>,
    );
    lastIndex = start + url.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

export default function LiverProfile({ channel }: LiverProfileProps) {
  const externalLinks = getLiverExternalLinks(channel);

  return (
    <Card className="border border-default-100 shadow-sm">
      <CardBody className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          <div className="flex justify-center md:block md:flex-shrink-0">
            <Image
              alt={channel.name}
              className="aspect-square object-cover"
              height={176}
              src={channel.photo}
              width={176}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="relative pr-12 sm:flex sm:items-start sm:justify-between sm:gap-3 sm:pr-0">
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Chip size="sm" variant="flat">
                    {channel.org || 'Independent'}
                  </Chip>
                  {channel.suborg && (
                    <Chip size="sm" variant="flat">
                      {channel.suborg.substring(2)}
                    </Chip>
                  )}
                </div>
                <h2 className="text-2xl font-semibold leading-tight sm:text-3xl">
                  {channel.name}
                </h2>
                {channel.english_name && (
                  <p className="mt-1 text-sm text-default-500">
                    {channel.english_name}
                  </p>
                )}
              </div>
              <FavoriteButton
                liverId={channel.id}
                className="absolute right-0 top-0 sm:static sm:flex-shrink-0"
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <div className="rounded-md bg-default-100 px-3 py-2">
                <div className="flex items-center gap-1 text-xs text-default-500">
                  <UserGroupIcon className="h-4 w-4" />
                  Subscribers
                </div>
                <div className="mt-1 font-semibold">
                  {formatCount(channel.subscriber_count)}
                </div>
              </div>

              {channel.view_count && (
                <div className="rounded-md bg-default-100 px-3 py-2">
                  <div className="text-xs text-default-500">Views</div>
                  <div className="mt-1 font-semibold">
                    {formatCount(channel.view_count)}
                  </div>
                </div>
              )}

              {channel.video_count && (
                <div className="rounded-md bg-default-100 px-3 py-2">
                  <div className="text-xs text-default-500">Videos</div>
                  <div className="mt-1 font-semibold">
                    {formatCount(channel.video_count)}
                  </div>
                </div>
              )}

              {channel.clip_count && (
                <div className="rounded-md bg-default-100 px-3 py-2">
                  <div className="text-xs text-default-500">Clips</div>
                  <div className="mt-1 font-semibold">
                    {formatCount(channel.clip_count)}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                className="inline-flex items-center gap-1 rounded-md bg-danger-50 px-3 py-2 text-sm text-danger"
                href={`https://youtube.com/channel/${channel.id}`}
                isExternal
              >
                YouTube Channel
                <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
              </Link>

              {channel.twitter && (
                <Link
                  className="inline-flex items-center gap-1 rounded-md bg-default-100 px-3 py-2 text-sm text-foreground"
                  href={`https://x.com/${channel.twitter}`}
                  isExternal
                >
                  @{channel.twitter}
                  <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
                </Link>
              )}

              {externalLinks.map((externalLink) => (
                <Link
                  key={externalLink.url}
                  className="inline-flex items-center gap-1 rounded-md bg-warning-50 px-3 py-2 text-sm text-warning-700"
                  href={externalLink.url}
                  isExternal
                >
                  <ShoppingBagIcon className="h-4 w-4" />
                  {externalLink.label}
                  <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>

            {(channel.description || channel.published_at) && (
              <details className="group mt-4 rounded-md border border-default-200">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2 text-sm font-medium transition-colors hover:text-primary">
                  <span>Details</span>
                  <ChevronDownIcon className="h-4 w-4 transition-transform duration-200 group-open:rotate-180" />
                </summary>

                <Divider />

                <div className="space-y-3 px-3 py-3 text-sm">
                  {channel.published_at && (
                    <div className="flex flex-wrap items-center gap-1.5 text-default-600">
                      <CalendarIcon className="h-4 w-4" />
                      <span className="font-medium text-foreground">
                        Started:
                      </span>
                      <span>
                        {new Date(channel.published_at).toLocaleDateString(
                          'ja-JP',
                          {
                            year: 'numeric',
                            month: 'long',
                          },
                        )}
                        {getElapsedTime(channel.published_at)}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-1.5 text-default-600">
                    <LinkIcon className="h-4 w-4" />
                    <span className="font-medium text-foreground">
                      Channel ID:
                    </span>
                    <span className="break-all">{channel.id}</span>
                  </div>

                  {channel.description && (
                    <p className="whitespace-pre-wrap break-words leading-relaxed text-default-600">
                      {renderLinkedText(channel.description)}
                    </p>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
