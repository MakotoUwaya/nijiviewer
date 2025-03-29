import { SearchIcon } from '@/components/icons';
import { Input } from '@heroui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { ChangeEvent, KeyboardEvent } from 'react';
import { useMemo, useState } from 'react';

interface SearchProps {
  onSearch?: (value: string) => void;
}

export function Search({ onSearch }: SearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get('q') || '');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    debouncedSearch(e.target.value);
  };

  const debouncedSearch = useMemo(() => {
    const search = (query: string) => {
      if (!query.trim()) {
        return;
      }
      onSearch?.(query);
      router.push(`/liver-search?q=${encodeURIComponent(query)}`);
    };

    let timeoutId: NodeJS.Timeout;
    return (query: string) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => search(query), 500);
    };
  }, [onSearch, router]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const trimmedValue = value.trim();
    if (e.key !== 'Enter' || !trimmedValue) {
      return;
    }
    onSearch?.(trimmedValue);
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
      placeholder="配信者を検索..."
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
