import { SearchIcon } from '@/components/icons';
import { useAuth } from '@/context/auth-context';
import { supabase } from '@/lib/supabase';
import { Input } from '@heroui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

interface SearchProps {
  onSearch?: (value: string) => void;
}

// 検索履歴の型定義
interface SearchHistory {
  search_word: string;
}

export function Search({ onSearch }: SearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get('q') || '');
  const { user } = useAuth(); // 認証情報を取得
  const [searchHistories, setSearchHistories] = useState<SearchHistory[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // 検索履歴を取得する
  const fetchSearchHistories = useCallback(async () => {
    if (!user) return;

    try {
      // 検索履歴をmodified_atの降順で取得
      const { data, error } = await supabase
        .from('liver_search_history')
        .select('search_word')
        .eq('creator_id', user.id)
        .order('modified_at', { ascending: false });

      if (error) {
        console.error('検索履歴の取得中にエラーが発生しました:', error);
        return;
      }

      // クライアントサイドで重複を除去して10件に制限
      const uniqueHistories: SearchHistory[] = [];
      const uniqueWords = new Set<string>();

      // 最大10件まで一意の検索ワードを抽出
      for (const item of data) {
        if (!uniqueWords.has(item.search_word) && uniqueHistories.length < 10) {
          uniqueWords.add(item.search_word);
          uniqueHistories.push(item);
        }
      }

      setSearchHistories(uniqueHistories);
    } catch (err) {
      console.error('検索履歴の取得中にエラーが発生しました:', err);
    }
  }, [user]);

  // 初回ロード時と認証状態変更時に検索履歴を取得
  useEffect(() => {
    fetchSearchHistories();
  }, [fetchSearchHistories]);

  // 検索履歴を保存する関数
  const saveSearchHistory = async (searchWord: string) => {
    // ユーザーIDがない場合（未ログイン）は何もしない
    if (!user) return;

    try {
      const now = new Date().toISOString();
      await supabase.from('liver_search_history').insert({
        created_at: now,
        creator_id: user.id,
        modified_at: now,
        modifier_id: user.id,
        search_word: searchWord,
      });

      // 検索履歴を再取得（UI更新のため）
      fetchSearchHistories();
    } catch (err) {
      console.error('検索履歴の保存中にエラーが発生しました:', err);
    }
  };

  // 検索履歴を削除する関数
  const deleteSearchHistory = async (
    searchWord: string,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation(); // 親要素のクリックイベントが発火するのを防止

    if (!user) return;

    try {
      // 同じsearch_wordを持つ履歴をすべて削除
      const { error } = await supabase
        .from('liver_search_history')
        .delete()
        .eq('creator_id', user.id)
        .eq('search_word', searchWord);

      if (error) {
        console.error('検索履歴の削除中にエラーが発生しました:', error);
        return;
      }

      // 検索履歴を再取得（UI更新のため）
      fetchSearchHistories();
    } catch (err) {
      console.error('検索履歴の削除中にエラーが発生しました:', err);
    }
  };

  // 検索を実行する関数
  const executeSearch = (searchValue: string) => {
    const trimmedValue = searchValue.trim();
    if (!trimmedValue) {
      return;
    }

    onSearch?.(trimmedValue);
    saveSearchHistory(trimmedValue);
    router.push(`/liver-search?q=${encodeURIComponent(trimmedValue)}`);
    setShowSuggestions(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (e.target.value.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeSearch(value);
    }
  };

  // 候補をクリックしたとき
  const handleSuggestionClick = (suggestion: string) => {
    setValue(suggestion);
    executeSearch(suggestion);
  };

  return (
    <div className="relative w-full max-w-full">
      <Input
        classNames={{
          base: 'w-full h-10',
          mainWrapper: 'h-full',
          input: 'text-medium',
          inputWrapper: 'h-full font-normal bg-default-100 dark:bg-default-50',
        }}
        placeholder="Search Liver Name..."
        size="sm"
        startContent={
          <SearchIcon
            className="text-xl text-default-400 pointer-events-none flex-shrink-0"
            role="img"
            aria-labelledby="search-icon-title"
            aria-hidden="false"
          >
            <title id="search-icon-title">検索</title>
          </SearchIcon>
        }
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => value && setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
      />

      {/* サジェスト候補 */}
      {showSuggestions && searchHistories.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
          <ul className="py-1" aria-label="検索履歴">
            {searchHistories.map((history) => (
              <li
                key={history.search_word}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex justify-between items-center"
                onClick={() => handleSuggestionClick(history.search_word)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSuggestionClick(history.search_word);
                  }
                }}
                aria-selected={false}
                aria-label={`検索履歴: ${history.search_word}`}
              >
                <span>{history.search_word}</span>
                <button
                  type="button"
                  className="text-gray-500 hover:text-red-500 focus:outline-none ml-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                  onClick={(e) => deleteSearchHistory(history.search_word, e)}
                  aria-label={`${history.search_word} を削除`}
                >
                  <svg
                    role="img"
                    aria-labelledby={`delete-history-${history.search_word.replace(/\s+/g, '-')}`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <title
                      id={`delete-history-${history.search_word.replace(/\s+/g, '-')}`}
                    >
                      {`${history.search_word} を削除`}
                    </title>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
