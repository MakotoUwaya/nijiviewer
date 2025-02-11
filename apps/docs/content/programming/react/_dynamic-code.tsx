'use client';

import { Button } from 'nextra/components';
import type { FC, ReactNode } from 'react';
import { useEffect, useRef } from 'react';

export const DynamicCode: FC<{ children: ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const tokenRef = useRef<HTMLSpanElement>(undefined);
  // Find the corresponding token from the DOM
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    tokenRef.current = [
      ...ref.current.querySelectorAll<HTMLSpanElement>('code > span > span')
    ].find(el => el.textContent === '1')
  }, []);
  return (
    <>
      <div ref={ref} className="mt-6">
        {children}
      </div>
      <div className="mt-3 flex justify-center gap-3 text-sm">
        <Button
          variant="outline"
          onClick={() => {
            const token = tokenRef?.current;
            if (!token) {
              return;
            }
            const prev = token?.textContent || '0';
            token.textContent = String((+prev || 0) + 1)
          }}
        >
          Increase the number
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            if (!tokenRef.current) {
              return;
            }
            tokenRef.current.textContent = '1 + 1'
          }}
        >
          Change to `1 + 1`
        </Button>
      </div>
    </>
  );
};
