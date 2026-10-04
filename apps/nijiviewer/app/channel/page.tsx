import { redirect } from 'next/navigation';

export default async function ChannelRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ org?: string }>;
}) {
  const { org } = await searchParams;
  if (org) {
    redirect(`/channels/${encodeURIComponent(org)}`);
  }
  redirect('/channels/Nijisanji');
}
