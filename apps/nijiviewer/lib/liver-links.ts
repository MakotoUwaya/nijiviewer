import type { Channel } from '@/lib/holodex';

export type LiverExternalLink = {
  label: string;
  url: string;
  kind: 'official-store';
};

type OrganizationLiverLinkResolver = (channel: Channel) => LiverExternalLink[];

const nijisanjiStoreIdsByChannelId: Record<string, string> = {
  'UC_4QF0dL-9XI9VajsNkMtmQ': '1186',
};

const organizationLinkResolvers: Record<string, OrganizationLiverLinkResolver> =
  {
    Nijisanji: (channel) => {
      const storeId = nijisanjiStoreIdsByChannelId[channel.id];

      if (!storeId) {
        return [];
      }

      return [
        {
          label: 'にじさんじオフィシャルストア',
          url: `https://shop.nijisanji.jp/${storeId}`,
          kind: 'official-store',
        },
      ];
    },
  };

export function getLiverExternalLinks(channel: Channel): LiverExternalLink[] {
  if (!channel.org) {
    return [];
  }

  return organizationLinkResolvers[channel.org]?.(channel) ?? [];
}
