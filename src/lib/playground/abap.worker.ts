/// <reference lib="webworker" />
import { runAbap } from "./abap-runner";

// One program per worker; the page terminates the worker afterwards, so no state
// (and no runaway loop) survives a run.
self.onmessage = async (event: MessageEvent<{ source: string }>) => {
  const result = await runAbap(String(event.data?.source ?? ""));
  (self as unknown as Worker).postMessage(result);
};

export {};
