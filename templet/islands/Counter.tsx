/** @jsx h */
import { h } from "https://esm.sh/preact@10.x.x";
import { useState } from "https://esm.sh/preact@10.x.x/hooks";
const IS_BROWSER = typeof document !== "undefined";


interface CounterProps {
  start: number;
}

export default function Counter(props: CounterProps) {
  const [count, setCount] = useState(props.start);
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count - 1)} disabled={!IS_BROWSER}>
        -1
      </button>
      <button onClick={() => setCount(count + 1)} disabled={!IS_BROWSER}>
        +1
      </button>
    </div>
  );
}
