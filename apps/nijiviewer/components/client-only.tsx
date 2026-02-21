'use client';

import { type JSX, type ReactNode, useEffect, useState } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ClientOnly({
  children,
  fallback = null,
}: ClientOnlyProps): JSX.Element | null {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return fallback as JSX.Element | null;
  }

  return <>{children}</>;
}
