/** @jsx h */
import { h } from "https://esm.sh/preact@10.x.x";
import Counter from "../islands/Counter.tsx";

export default function Home() {
  return (
    <div>
      <p>
        Welcome to `fresh`. Try update this message in the ./routes/index.tsx
        file, and refresh .
      </p>
      <Counter start={3} />
    </div>
  );
}
