import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ChannelList from '@/components/channel-list';
import { organizationMap } from '@/const/organizations';
import { fetchAllChannelsByOrg } from '@/lib/data';

type Props = {
  params: Promise<{ organizationName: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { organizationName } = await params;
  const decodedOrg = decodeURIComponent(organizationName);
  const org = organizationMap.find((o) => o.id === decodedOrg);
  const title = org ? `${org.name} チャンネル一覧` : 'チャンネル一覧';
  return {
    title: `${title} | NijiViewer`,
    description: `${org?.name ?? decodedOrg} の所属ライバー・チャンネル一覧`,
  };
}

export default async function ChannelsPage({ params }: Props) {
  const { organizationName } = await params;
  const decodedOrg = decodeURIComponent(organizationName);
  const currentOrg = organizationMap.find((o) => o.id === decodedOrg);

  if (!currentOrg) {
    notFound();
  }

  const channels = await fetchAllChannelsByOrg(decodedOrg);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <ChannelList organization={currentOrg} channels={channels} />
    </div>
  );
}
