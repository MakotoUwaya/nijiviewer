import { useState } from "react";
import styles from "./counters.module.css";

const MyButton = () => {
  const [count, setCount] = useState(0);
  const handleClick = () => {
    setCount(count + 1);
  };
  return (
    <div>
      <button onClick={handleClick} className={styles.counter}>
        Clicked {count} times
      </button>
    </div>
  );
};

const MyApp = () => {
  return <MyButton />;
};

export default MyApp;
