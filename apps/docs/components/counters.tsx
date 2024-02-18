import type { FC } from 'react';
import { useState } from 'react';
import styles from './counters.module.css';

const MyButton: FC = () => {
  const [count, setCount] = useState(0);
  const handleClick = (): void => {
    setCount(count + 1);
  };
  return (
    <div>
      <button className={styles.counter} onClick={handleClick} type='button'>
        Clicked {count} times
      </button>
    </div>
  );
};

export default MyButton;
