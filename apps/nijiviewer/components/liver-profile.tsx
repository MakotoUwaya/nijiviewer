'use client';

import {
  ArrowTopRightOnSquareIcon,
  CalendarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { Card, CardBody, Image, Link } from '@heroui/react';
import { useId } from 'react';
import { FavoriteButton } from '@/components/favorite-button';
import { getElapsedTime } from '@/components/search-result';
import type { Channel } from '@/lib/holodex';

interface LiverProfileProps {
  channel: Channel;
}

export default function LiverProfile({ channel }: LiverProfileProps) {
  const twitterIconId = useId();

  return (
    <Card>
      <CardBody>
        <div className="flex flex-col md:flex-row gap-6">
          {/* プロフィール画像 */}
          <div className="flex-shrink-0">
            <Image
              alt={channel.name}
              className="object-cover rounded-lg"
              height={200}
              src={channel.photo}
              width={200}
            />
          </div>

          {/* プロフィール情報 */}
          <div className="flex-1">
            <div className="mb-4 flex items-center gap-4">
              <h2 className="text-3xl font-bold mb-0">{channel.name}</h2>
              <FavoriteButton liverId={channel.id} />
            </div>

            {channel.description && (
              <details className="mt-4 group">
                <summary className="font-medium cursor-pointer hover:text-primary transition-colors mb-2 list-none">
                  <div className="flex items-center gap-2">
                    <span>Details</span>
                    <svg
                      className="w-4 h-4 transition-transform duration-200 group-open:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      role="img"
                      aria-label="展開/折りたたみアイコン"
                    >
                      <title>展開/折りたたみアイコン</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </summary>
                {/* 統計情報 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <UserGroupIcon className="w-4 h-4" />
                      <span className="text-sm text-default-500">
                        Subscribers
                      </span>
                    </div>
                    <div className="font-semibold">
                      {channel.subscriber_count
                        ? Number(channel.subscriber_count).toLocaleString(
                            'ja-JP',
                          )
                        : 'N/A'}
                    </div>
                  </div>

                  {channel.view_count && (
                    <div className="text-center">
                      <div className="text-sm text-default-500 mb-1">Views</div>
                      <div className="font-semibold">
                        {Number(channel.view_count).toLocaleString('ja-JP')}
                      </div>
                    </div>
                  )}

                  {channel.video_count && (
                    <div className="text-center">
                      <div className="text-sm text-default-500 mb-1">
                        Videos
                      </div>
                      <div className="font-semibold">
                        {Number(channel.video_count).toLocaleString('ja-JP')}
                      </div>
                    </div>
                  )}

                  {channel.clip_count && (
                    <div className="text-center">
                      <div className="text-sm text-default-500 mb-1">Clips</div>
                      <div className="font-semibold">
                        {Number(channel.clip_count).toLocaleString('ja-JP')}
                      </div>
                    </div>
                  )}
                </div>

                {/* 詳細情報 */}
                <div className="space-y-2 text-sm">
                  {channel.english_name && (
                    <div>
                      <span className="font-medium">English Name:</span>{' '}
                      {channel.english_name}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Organization:</span>{' '}
                    {channel.org || 'Independent'}
                    {channel.suborg ? ` / ${channel.suborg.substring(2)}` : ''}
                  </div>

                  {channel.published_at && (
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span className="font-medium">Started:</span>
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

                  <div className="flex items-center gap-1">
                    <Link
                      href={`https://youtube.com/channel/${channel.id}`}
                      isExternal
                      className="text-red-500 hover:text-red-600 flex items-center gap-1"
                    >
                      YouTube Channel
                      <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
                {/* 説明文 */}
                <p className="text-sm text-default-600 whitespace-pre-wrap mt-2">
                  {channel.description}
                </p>
              </details>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
