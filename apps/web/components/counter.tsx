'use client';

import { Button } from '@nextui-org/react';
import { useState } from 'react';

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
  }

  return (
    <Button
      onPress={onPress}
      radius='full'
    >
      Count is {count}
    </Button>
  );
}
