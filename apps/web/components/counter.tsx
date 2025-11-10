'use client';

import { Button } from '@heroui/react';
import { type JSX, useState } from 'react';

type CounterProps = {
  /**
   * Optional click handler
   */
  onClick?: () => void;
};

export function Counter(props: CounterProps): JSX.Element {
  const [count, setCount] = useState(0);
  const onPress = () => {
    setCount(count + 1);
    props.onClick?.();
  };

  return (
      Count is {count}
    </Button>
  );
}
