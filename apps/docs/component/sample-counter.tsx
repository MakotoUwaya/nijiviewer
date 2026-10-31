'use client';

import type { FC, ReactNode } from 'react';
import { useState } from 'react';

const buttonClass =
  'inline-flex items-center justify-center rounded-md border border-neutral-300 bg-white px-3 py-1.5 font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 transition-colors';

export const SampleCounter: FC<{ children: ReactNode }> = ({ children }) => {
  const [count, setCount] = useState(0);
  const handleClick = (): void => {
    setCount(count + 1);
  };
  return (
    <>
      <div className="mt-6">{children}</div>
      <div className="mt-3 flex justify-center gap-3 text-sm">
        <button type="button" onClick={handleClick} className={buttonClass}>
          Clicked {count} times
        </button>
      </div>
    </>
  );
};
