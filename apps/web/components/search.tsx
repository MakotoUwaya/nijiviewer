import { SearchIcon } from '@/components/icons';
import { useAuth } from '@/context/auth-context';
import { supabase } from '@/lib/supabase';
import { Input } from '@heroui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { ChangeEvent, KeyboardEvent } from 'react';
import { useState } from 'react';

interface SearchProps {
  onSearch?: (value: string) => void;
}

export function Search({ onSearch }: SearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get('q') || '');
  const { user } = useAuth(); // 認証情報を取得

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
    } catch (err) {
      console.error('検索履歴の保存中にエラーが発生しました:', err);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const trimmedValue = value.trim();
    if (e.key !== 'Enter' || !trimmedValue) {
      return;
    }
    onSearch?.(trimmedValue);
    
    // 検索が実行されたときに履歴を保存
    saveSearchHistory(trimmedValue);
    
    router.push(`/liver-search?q=${encodeURIComponent(trimmedValue)}`);
  };

  return (
    <Input
      classNames={{
        base: 'w-full md:w-80 sm:max-w-[20rem] h-10',
        mainWrapper: 'h-full',
        input: 'text-medium',
        inputWrapper: 'h-full font-normal bg-default-100 dark:bg-default-50',
      }}
      placeholder="Search Liver Name..."
      size="sm"
      startContent={
        <SearchIcon className="text-xl text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  );
}
