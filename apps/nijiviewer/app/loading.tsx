'use client';

import { Spinner } from '@heroui/react';

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Spinner label="Loading..." size="lg" />
    </div>
  );
}
