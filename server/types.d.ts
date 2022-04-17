/// <reference no-default-lib="true" />
/// <reference lib="esnext" />
/// <reference lib="dom" />

/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

// deno-lint-ignore-file no-explicit-any no-var
interface AbortSignal extends EventTarget {
  readonly reason?: unknown;
  throwIfAborted(): void;
}

// @ts-ignore like https://github.com/denoland/deno/issues/12558
declare var AbortSignal: {
  prototype: AbortSignal;
  new (): AbortSignal;
  abort(reason?: any): AbortSignal;
  timeout(milliseconds: number): AbortSignal;
};
