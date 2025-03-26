import { SearchResultList } from "@/components/search-result";
import { searchChannels } from "@/lib/data";

type Props = {
  searchParams: Promise<{ q: string }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const channels = await searchChannels(q);
  return (
    <div className="container mx-auto py-8 px-6">
      {q && (
        <h1 className="text-2xl font-bold mb-4">
          「{decodeURIComponent(q)}」の検索結果
        </h1>
      )}

      {channels.length === 0 ? (
        <div className="text-center text-default-500">
          {q ? "配信者が見つかりませんでした" : "配信者を検索してください"}
        </div>
      ) : (
        <SearchResultList channels={channels} />
      )}
    </div>
  );
}
