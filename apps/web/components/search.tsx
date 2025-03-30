import { SearchIcon } from '@/components/icons';
import { useAuth } from '@/context/auth-context';
import { supabase } from '@/lib/supabase';
import { Input } from '@heroui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

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
  useEffect(() => {
    const fetchSearchHistories = async () => {
      if (!user) return;
      
      try {
        // 検索履歴をmodified_atの降順で取得し、search_wordの重複を除去して10件に制限
        const { data, error } = await supabase
          .from('liver_search_history')
          .select('search_word')
          .eq('creator_id', user.id)
          .order('modified_at', { ascending: false })
          .limit(10);
        
        if (error) {
          console.error('検索履歴の取得中にエラーが発生しました:', error);
          return;
        }

        // 重複を除去
        const uniqueHistories: SearchHistory[] = [];
        const uniqueWords = new Set<string>();
        
        data.forEach((item) => {
          if (!uniqueWords.has(item.search_word)) {
            uniqueWords.add(item.search_word);
            uniqueHistories.push(item);
          }
        });
        
        setSearchHistories(uniqueHistories);
      } catch (err) {
        console.error('検索履歴の取得中にエラーが発生しました:', err);
      }
    };

    fetchSearchHistories();
  }, [user]);

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
      const { data, error } = await supabase
        .from('liver_search_history')
        .select('search_word')
        .eq('creator_id', user.id)
        .order('modified_at', { ascending: false })
        .limit(10);
      
      if (!error && data) {
        // 重複を除去
        const uniqueHistories: SearchHistory[] = [];
        const uniqueWords = new Set<string>();
        
        data.forEach((item) => {
          if (!uniqueWords.has(item.search_word)) {
            uniqueWords.add(item.search_word);
            uniqueHistories.push(item);
          }
        });
        
        setSearchHistories(uniqueHistories);
      }
    } catch (err) {
      console.error('検索履歴の保存中にエラーが発生しました:', err);
    }
  };

  // 検索を実行する関数
  const executeSearch = (searchValue: string) => {
    const trimmedValue = searchValue.trim();
    if (!trimmedValue) return;
    
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
    <div className="relative w-full md:w-80 sm:max-w-[20rem]">
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
          <SearchIcon className="text-xl text-default-400 pointer-events-none flex-shrink-0" />
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
          <ul className="py-1">
            {searchHistories.map((history) => (
              <li
                key={history.search_word}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => handleSuggestionClick(history.search_word)}
              >
                {history.search_word}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
