// -- preact --
export { renderToString } from "https://esm.sh/preact-render-to-string@5.1.21?deps=preact@10.x.x";

// -- std --
export {
  extname,
  fromFileUrl,
  toFileUrl,
} from "https://deno.land/std/path/mod.ts";
export { walk } from "https://deno.land/std/fs/walk.ts";
export { serve,serveTls } from "https://deno.land/std/http/server.ts";
export type {
  ConnInfo,
  Handler as RequestHandler,
} from "https://deno.land/std/http/server.ts";

// -- esbuild --
// @deno-types="https://deno.land/x/esbuildx@v0.14.29/mod.d.ts"
import * as esbuildWasm from "./esbuild-wasm/browser.js";
import * as esbuildNative from "https://deno.land/x/esbuildx@v0.14.29/mod.js";

// @ts-ignore trust me
const esbuild: typeof esbuildWasm = esbuildWasm;
export { esbuild, esbuildWasm as esbuildTypes };
export { denoPlugin } from "https://deno.land/x/esbuild_deno_loader@0.4.2/mod.ts";
