'use client';

import type { FC, ReactNode } from 'react';
import { useEffect, useRef } from 'react';

const buttonClass =
  'inline-flex items-center justify-center rounded-md border border-neutral-300 bg-white px-3 py-1.5 font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 transition-colors';

export const DynamicCode: FC<{ children: ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const tokenRef = useRef<HTMLSpanElement>(undefined);
  // Find the corresponding token from the DOM
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    tokenRef.current = [
      ...ref.current.querySelectorAll<HTMLSpanElement>('code > span > span'),
    ].find((el) => el.textContent === '1');
  }, []);
  return (
    <>
      <div ref={ref} className="mt-6">
        {children}
      </div>
      <div className="mt-3 flex justify-center gap-3 text-sm">
        <button
          type="button"
          className={buttonClass}
          onClick={() => {
            const token = tokenRef?.current;
            if (!token) {
              return;
            }
            const prev = token?.textContent || '0';
            token.textContent = String((+prev || 0) + 1);
          }}
        >
          Increase the number
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={() => {
            if (!tokenRef.current) {
              return;
            }
            tokenRef.current.textContent = '1 + 1';
          }}
        >
          Change to `1 + 1`
        </button>
      </div>
    </>
  );
};
