import type { JSX } from 'react';

export default function LiverSearchLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <section className="flex flex-wrap items-center justify-center gap-4 py-8 md:py-10">
      {children}
    </section>
  );
}
