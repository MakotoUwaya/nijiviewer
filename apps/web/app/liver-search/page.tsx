import { SearchResultList } from '@/components/search-result';
import { saveSearchHistory, searchChannels } from '@/lib/data';
import { createCustomServerClient } from '@/lib/supabase-server';

type Props = {
  searchParams: Promise<{ q: string }>;
};

export default async function LiverSearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const channels = await searchChannels(q);

  // ログインユーザーの情報を取得
  const supabase = await createCustomServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const userId = session?.user?.id;

  // 検索結果が1件以上あれば履歴を保存
  if (q && channels.length > 0 && userId) {
    await saveSearchHistory(q, channels.length, userId);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Liver List</h1>

      {!!q && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Search Results for "{q}"</h2>

          {channels.length === 0 ? (
            <div className="text-center text-default-500">No livers found</div>
          ) : (
            <SearchResultList channels={channels} />
          )}
        </div>
      )}
    </div>
  );
}
