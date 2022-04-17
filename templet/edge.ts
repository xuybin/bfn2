import * as $0 from "./routes/index.tsx";
import * as $$0 from "./islands/Counter.tsx";
import { start } from "../server/mod.ts";
const manifest = {
  routes: {
    "./routes/index.tsx": $0,
  },
  islands: {
    "./islands/Counter.tsx": $$0,
  },
  baseUrl: import.meta.url,
};

export default manifest;

if (import.meta.main) {
  await start(manifest);
}
