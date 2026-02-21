import type { JSX } from 'react';

export default function LiveVideosLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <section className="flex flex-wrap items-start justify-center gap-4 p-4">
      {children}
    </section>
  );
}
