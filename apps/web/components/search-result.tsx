import {
  ArrowTopRightOnSquareIcon,
  CalendarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { Card, CardBody, Image, Link } from '@heroui/react';
import { useId } from 'react';
import type { Channel } from '@/lib/holodex';

export function getElapsedTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  let years = now.getFullYear() - date.getFullYear();
  let months = now.getMonth() - date.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  if (years > 0 && months > 0) {
    return `(${years}年${months}ヵ月)`;
  }
  if (years > 0) {
    return `(${years}年)`;
  }
  if (months > 0) {
    return `(${months}ヵ月)`;
  }
  return '';
}

export function SearchResult({ channel }: { channel: Channel }) {
  const twitterIconId = useId();
  return (
    <Card>
      <CardBody>
        <div className="flex gap-4">
          {/* モバイル表示 */}
          <div className="md:hidden w-24 h-24">
            <Image
              alt={channel.name}
              className="object-cover rounded-lg"
              height={96}
              src={channel.photo}
              width={96}
            />
          </div>
          {/* デスクトップ表示 */}
          <div className="hidden md:block w-32 h-32">
            <Image
              alt={channel.name}
              className="object-cover rounded-lg"
              height={128}
              src={channel.photo}
              width={128}
            />
          </div>
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-2">
              <Link
                className="text-lg font-bold line-clamp-2"
                href={`/liver/${channel.id}`}
              >
                {channel.name}
              </Link>
              {channel.english_name && (
                <span className="hidden md:block text-default-500">
                  {channel.english_name}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1 text-default-500 text-sm">
              <div className="flex flex-col md:flex-row md:gap-6">
                <div className="flex items-center gap-1">
                  <UserGroupIcon className="w-4 h-4" />
                  <span>
                    {channel.subscriber_count
                      ? Number(channel.subscriber_count).toLocaleString('ja-JP')
                      : 'N/A'}
                  </span>
                </div>
                {channel.view_count && (
                  <div className="hidden md:flex items-center gap-1">
                    {Number(channel.view_count).toLocaleString('ja-JP')} views
                  </div>
                )}
                {channel.video_count && (
                  <div className="hidden md:flex items-center gap-1">
                    {Number(channel.video_count).toLocaleString('ja-JP')} videos
                  </div>
                )}
                {channel.clip_count && (
                  <div className="hidden md:flex items-center gap-1">
                    {Number(channel.clip_count).toLocaleString('ja-JP')} clips
                  </div>
                )}
              </div>

              <div className="flex flex-col md:flex-row md:gap-6 mt-1">
                <div>
                  {channel.org || 'Independent'}{' '}
                  {channel.suborg ? `/ ${channel.suborg.substring(2)}` : ''}
                </div>
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-4 h-4" />
                  <span>
                    {channel.published_at
                      ? `${new Date(channel.published_at).toLocaleDateString(
                          'ja-JP',
                          { year: 'numeric', month: 'long' },
                        )}${getElapsedTime(channel.published_at)}`
                      : 'Unknown'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:gap-6 mt-1">
                {channel.twitter && (
                  <div className="flex items-center gap-1">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 fill-current"
                      role="img"
                      aria-labelledby={twitterIconId}
                    >
                      <title id={twitterIconId}>Twitter/X アイコン</title>
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <Link
                      href={`https://x.com/${channel.twitter}`}
                      isExternal
                      className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
                    >
                      @{channel.twitter}
                      <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>

              {channel.description && (
                <div
                  className="hidden md:block mt-2 text-sm"
                  title={
                    channel.description.length > 100
                      ? channel.description
                      : undefined
                  }
                >
                  {channel.description.length > 100
                    ? `${channel.description.slice(0, 100)}...`
                    : channel.description}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export function SearchResultList({ channels }: { channels: Channel[] }) {
  return (
    <div className="grid gap-4">
      {channels.map((channel) => (
        <SearchResult key={channel.id} channel={channel} />
      ))}
    </div>
  );
}
