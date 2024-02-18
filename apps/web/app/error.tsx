'use client';

import { useEffect } from 'react';

// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}): JSX.Element {
  useEffect(() => {
    // Log the error to an error reporting service
    // eslint-disable-next-line no-console -- Display error
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => {
            reset();
          }
        }
        type='button'
      >
        Try again
      </button>
    </div>
  );
}
