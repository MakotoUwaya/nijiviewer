'use client';

import { useState } from 'react';
import { Button } from '@nextui-org/react';

export function Counter(): JSX.Element {
  const [count, setCount] = useState(0);

  return (
    <Button
      onPress={() => {
        setCount(count + 1);
      }}
      radius='full'
    >
      Count is {count}
    </Button>
  );
}
