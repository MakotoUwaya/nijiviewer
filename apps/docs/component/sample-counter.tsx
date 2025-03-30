'use client';

import { Button } from 'nextra/components';
import type { FC, ReactNode } from 'react';
import { useState } from 'react';

export const SampleCounter: FC<{ children: ReactNode }> = ({ children }) => {
  const [count, setCount] = useState(0);
  const handleClick = (): void => {
    setCount(count + 1);
  };
  return (
    <>
      <div className="mt-6">{children}</div>
      <div className="mt-3 flex justify-center gap-3 text-sm">
        <Button onClick={handleClick} variant="outline">
          Clicked {count} times
        </Button>
      </div>
    </>
  );
};
