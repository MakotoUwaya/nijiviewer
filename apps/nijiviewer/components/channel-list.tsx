'use client';

import {
  ArrowTopRightOnSquareIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline';
import {
  Accordion,
  AccordionItem,
  Avatar,
  Button,
  Card,
  CardBody,
  Chip,
  Input,
  Link,
  type Selection,
} from '@heroui/react';
import NextLink from 'next/link';
import { useMemo, useState } from 'react';
import { FavoriteButton } from '@/components/favorite-button';
import { TwitterIcon, YoutubeIcon } from '@/components/icons';
import type { Channel, Organization } from '@/lib/holodex';
import { getChannelGroup } from '@/lib/holodex';
import { getImageUrl } from '@/lib/image-utils';

interface ChannelListProps {
  organization: Organization;
  channels: Channel[];
}

interface GroupedChannels {
  groupName: string;
  channels: Channel[];
}

function formatSubscriberCount(countStr?: string): string {
  if (!countStr) return '';
  const count = Number.parseInt(countStr, 10);
  if (Number.isNaN(count)) return countStr;
  if (count >= 10000) {
    const man = count / 10000;
    return `${man >= 100 ? Math.floor(man) : Number(man.toFixed(1))}万人`;
  }
  if (count >= 1000) {
    return `${Number((count / 1000).toFixed(1))}千人`;
  }
  return `${count.toLocaleString()}人`;
}

export default function ChannelList({
  organization,
  channels,
}: ChannelListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // チャンネルの検索フィルタリング
  const filteredChannels = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return channels;
    return channels.filter((channel) => {
      const nameMatch = channel.name.toLowerCase().includes(query);
      const enNameMatch =
        channel.english_name?.toLowerCase().includes(query) ?? false;
      const groupMatch = channel.group?.toLowerCase().includes(query) ?? false;
      const suborgMatch =
        channel.suborg?.toLowerCase().includes(query) ?? false;
      return nameMatch || enNameMatch || groupMatch || suborgMatch;
    });
  }, [channels, searchQuery]);

  // Group 単位で集約する。
  // Holodex の一覧 API (/channels) は suborg フィールドを返さないが、
  // sort=suborg 指定によりサーバー側で sub_org 順に並べて返す。
  // そのためクライアント側では再ソートせず、API の並び（グループ初出順）を保持する。
  const groupedList: GroupedChannels[] = useMemo(() => {
    const map = new Map<string, Channel[]>();

    for (const channel of filteredChannels) {
      const groupName =
        channel.group?.trim() || getChannelGroup(channel) || 'Other';
      const existing = map.get(groupName);
      if (existing) {
        existing.push(channel);
      } else {
        map.set(groupName, [channel]);
      }
    }

    return Array.from(map, ([groupName, groupChannels]) => ({
      groupName,
      channels: groupChannels,
    }));
  }, [filteredChannels]);

  // 全グループ名のリスト
  const allGroupKeys = useMemo(
    () => groupedList.map((g) => g.groupName),
    [groupedList],
  );

  // 開閉状態（デフォルトですべて展開）
  const [selectedKeys, setSelectedKeys] = useState<Selection>(
    new Set(allGroupKeys),
  );

  const handleExpandAll = () => {
    setSelectedKeys(new Set(allGroupKeys));
  };

  const handleCollapseAll = () => {
    setSelectedKeys(new Set());
  };

  return (
    <div className="space-y-6">
      {/* 組織ヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-default-50 border border-default-200">
        <div className="flex items-center gap-3">
          <Avatar
            alt={organization.name}
            className="w-12 h-12 flex-shrink-0"
            src={`https://holodex.net/statics/channelImg/${organization.channelId}/100.png`}
          />
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {organization.name}
            </h1>
            <p className="text-sm text-default-500">
              全 {channels.length} チャンネル
              {searchQuery && ` (絞り込み: ${filteredChannels.length} 件)`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="flat"
            startContent={<ChevronDownIcon className="w-4 h-4" />}
            onPress={handleExpandAll}
          >
            すべて展開
          </Button>
          <Button
            size="sm"
            variant="flat"
            startContent={<ChevronUpIcon className="w-4 h-4" />}
            onPress={handleCollapseAll}
          >
            すべて折りたたむ
          </Button>
        </div>
      </div>

      {/* 検索バー */}
      <div className="max-w-md">
        <Input
          placeholder="ライバー名・グループ名で検索..."
          value={searchQuery}
          onValueChange={setSearchQuery}
          isClearable
          onClear={() => setSearchQuery('')}
          startContent={
            <MagnifyingGlassIcon className="w-4 h-4 text-default-400" />
          }
          className="w-full"
        />
      </div>

      {/* チャンネル一覧（Group 単位で折りたたみ） */}
      {groupedList.length === 0 ? (
        <div className="text-center py-12 text-default-400">
          該当するチャンネルが見つかりませんでした
        </div>
      ) : (
        <Accordion
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          variant="splitted"
          className="px-0 gap-4"
        >
          {groupedList.map((group) => (
            <AccordionItem
              key={group.groupName}
              aria-label={group.groupName}
              title={
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-base text-foreground">
                    {group.groupName}
                  </span>
                  <Chip size="sm" variant="flat" color="default">
                    {group.channels.length} 名
                  </Chip>
                </div>
              }
              classNames={{
                base: 'border border-default-200 bg-background shadow-sm rounded-xl',
                title: 'text-foreground',
                trigger: 'py-3 px-4',
                content: 'pt-0 pb-4 px-4',
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
                {group.channels.map((channel) => (
                  <Card
                    key={channel.id}
                    className="border border-default-200 hover:border-primary/50 transition-all hover:shadow-md"
                  >
                    <CardBody className="p-3">
                      <div className="flex items-start gap-3">
                        <Avatar
                          alt={channel.name}
                          src={getImageUrl(channel.photo)}
                          className="w-14 h-14 flex-shrink-0 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <Link
                              as={NextLink}
                              href={`/liver/${channel.id}`}
                              className="font-bold text-sm text-foreground hover:text-primary truncate"
                              title={channel.name}
                            >
                              {channel.name}
                            </Link>
                            <FavoriteButton
                              liverId={channel.id}
                              className="w-6 h-6 min-w-6"
                            />
                          </div>

                          {channel.english_name &&
                            channel.english_name !== channel.name && (
                              <p
                                className="text-xs text-default-400 truncate"
                                title={channel.english_name}
                              >
                                {channel.english_name}
                              </p>
                            )}

                          <div className="mt-2 flex flex-col gap-0.5 text-xs text-default-500">
                            {channel.subscriber_count && (
                              <span>
                                登録者:{' '}
                                {formatSubscriberCount(
                                  channel.subscriber_count,
                                )}
                              </span>
                            )}
                            {channel.video_count != null && (
                              <span className="flex items-center gap-1">
                                <VideoCameraIcon className="w-3.5 h-3.5" />
                                {Number(channel.video_count).toLocaleString()}{' '}
                                本
                              </span>
                            )}
                          </div>

                          {/* 外部リンク & 詳細リンク */}
                          <div className="mt-3 pt-2 border-t border-default-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Link
                                href={`https://www.youtube.com/channel/${channel.id}`}
                                isExternal
                                aria-label={`${channel.name} の YouTube チャンネル`}
                                className="text-default-400 hover:text-red-500 transition-colors"
                              >
                                <YoutubeIcon size={16} />
                              </Link>
                              {channel.twitter && (
                                <Link
                                  href={`https://twitter.com/${channel.twitter}`}
                                  isExternal
                                  aria-label={`${channel.name} の X (Twitter)`}
                                  className="text-default-400 hover:text-sky-500 transition-colors"
                                >
                                  <TwitterIcon size={16} />
                                </Link>
                              )}
                            </div>

                            <Link
                              as={NextLink}
                              href={`/liver/${channel.id}`}
                              className="text-xs text-primary flex items-center gap-0.5 hover:underline"
                            >
                              配信一覧
                              <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
