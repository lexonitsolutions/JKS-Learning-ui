/**
 * Browser-side execution kept apart from the application:
 *  - ABAP runs in a dedicated Web Worker (open-abap, a limited subset).
 *  - JavaScript runs in a throw-away Web Worker with network and storage APIs
 *    removed, so a student's program cannot call our API or read app data.
 * Both are terminated on a timeout, which also stops infinite loops.
 */
import type { AbapRunResult } from "./abap-runner";

export interface IsolatedResult {
  status: "ok" | "compile_error" | "runtime_error" | "timeout";
  stdout: string;
  stderr: string;
  timeMs: number;
}

const DEFAULT_TIMEOUT_MS = 15_000;

export function runAbapIsolated(source: string, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<IsolatedResult> {
  return new Promise((resolve) => {
    const started = Date.now();
    let worker: Worker;
    try {
      worker = new Worker(new URL("./abap.worker.ts", import.meta.url), { type: "module" });
    } catch (err) {
      resolve({
        status: "runtime_error",
        stdout: "",
        stderr: `Could not start the ABAP runtime in this browser: ${err instanceof Error ? err.message : String(err)}`,
        timeMs: 0,
      });
      return;
    }

    const finish = (r: IsolatedResult) => {
      clearTimeout(timer);
      worker.terminate();
      resolve(r);
    };
    const timer = setTimeout(
      () =>
        finish({
          status: "timeout",
          stdout: "",
          stderr: `Stopped: the program ran longer than ${timeoutMs / 1000}s (possible infinite loop).`,
          timeMs: Date.now() - started,
        }),
      timeoutMs,
    );

    worker.onmessage = (e: MessageEvent<AbapRunResult>) => {
      const r = e.data;
      finish({
        status: r.status,
        stdout: r.output,
        stderr: r.error ?? "",
        timeMs: r.timeMs,
      });
    };
    worker.onerror = (e) =>
      finish({
        status: "runtime_error",
        stdout: "",
        stderr: `The ABAP runtime failed to load: ${e.message || "unknown error"}`,
        timeMs: Date.now() - started,
      });
    worker.postMessage({ source });
  });
}

/** Source of the JS worker. Dangerous globals are deleted before user code runs. */
const JS_WORKER_SOURCE = `
const lines = [];
const fmt = (v) => {
  if (typeof v === "string") return v;
  try { return typeof v === "object" ? JSON.stringify(v) : String(v); } catch { return String(v); }
};
const log = (...a) => lines.push(a.map(fmt).join(" "));
const stderr = [];
const console_ = { log, info: log, debug: log, warn: (...a) => stderr.push(a.map(fmt).join(" ")), error: (...a) => stderr.push(a.map(fmt).join(" ")) };
for (const k of ["fetch", "XMLHttpRequest", "WebSocket", "EventSource", "indexedDB", "caches", "importScripts", "Worker", "SharedWorker", "BroadcastChannel"]) {
  try { Object.defineProperty(self, k, { value: undefined, configurable: false }); } catch {}
}
self.onmessage = async (e) => {
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  try {
    await new AsyncFunction("console", e.data.code)(console_);
    self.postMessage({ status: "ok", stdout: lines.join("\\n"), stderr: stderr.join("\\n") });
  } catch (err) {
    stderr.push(String((err && err.stack) || err));
    self.postMessage({ status: "runtime_error", stdout: lines.join("\\n"), stderr: stderr.join("\\n") });
  }
};
`;

export function runJavaScriptIsolated(code: string, timeoutMs = 8_000): Promise<IsolatedResult> {
  return new Promise((resolve) => {
    const started = Date.now();
    const url = URL.createObjectURL(new Blob([JS_WORKER_SOURCE], { type: "text/javascript" }));
    const worker = new Worker(url);
    const finish = (r: IsolatedResult) => {
      clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve(r);
    };
    const timer = setTimeout(
      () =>
        finish({
          status: "timeout",
          stdout: "",
          stderr: `Stopped: the program ran longer than ${timeoutMs / 1000}s (possible infinite loop).`,
          timeMs: Date.now() - started,
        }),
      timeoutMs,
    );
    worker.onmessage = (e: MessageEvent<Omit<IsolatedResult, "timeMs">>) =>
      finish({ ...e.data, timeMs: Date.now() - started });
    worker.onerror = (e) =>
      finish({ status: "runtime_error", stdout: "", stderr: e.message || "Script error", timeMs: Date.now() - started });
    worker.postMessage({ code });
  });
}
