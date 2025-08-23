import {
  ArrowTopRightOnSquareIcon,
  CalendarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { Card, CardBody, Image, Link } from '@heroui/react';
import { useId } from 'react';
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
            <div className="mb-4">
              <h1 className="text-3xl font-bold mb-2">{channel.name}</h1>
              {channel.english_name && (
                <p className="text-xl text-default-500">
                  {channel.english_name}
                </p>
              )}
            </div>

            {/* 統計情報 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <UserGroupIcon className="w-4 h-4" />
                  <span className="text-sm text-default-500">Subscribers</span>
                </div>
                <div className="font-semibold">
                  {channel.subscriber_count
                    ? Number(channel.subscriber_count).toLocaleString('ja-JP')
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
                  <div className="text-sm text-default-500 mb-1">Videos</div>
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
            {channel.description && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-sm text-default-600 whitespace-pre-wrap">
                  {channel.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
