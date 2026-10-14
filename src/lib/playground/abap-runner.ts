/**
 * Runs ABAP with the open-source open-abap toolchain (abaplint transpiler +
 * runtime): the ABAP is checked and transpiled to JavaScript, then executed.
 * No SAP system is involved, so this is a LIMITED SUBSET of ABAP - plain
 * REPORT programs with local classes, internal tables, structures, string
 * templates and control flow. Database access, SAP UI, function modules and
 * the standard exception classes are not available.
 *
 * This module is DOM-free so it runs inside a Web Worker (see abap.worker.ts)
 * and can be exercised from Node.
 */
import { Transpiler } from "@abaplint/transpiler";
import * as runtime from "@abaplint/runtime";

export interface AbapRunResult {
  status: "ok" | "compile_error" | "runtime_error";
  output: string;
  error?: string;
  timeMs: number;
}

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor as new (
  ...args: string[]
) => (...a: unknown[]) => Promise<unknown>;

/** "check_syntax, Database table \"mara\" not found, zprog.prog.abap:2" -> "Line 2: ..." */
export function formatCompileError(raw: string): string {
  return raw
    .split(/\r?\n/)
    .map((line) => {
      const m = line.match(/^(?:[a-z_]+,\s*)?(.*?),?\s*zprog\.prog\.abap:(\d+)\s*$/i);
      return m ? `Line ${m[2]}: ${m[1].trim()}` : line;
    })
    .filter(Boolean)
    .join("\n");
}

export function describeRuntimeError(message: string): string {
  if (/CX_SY_ZERODIVIDE/i.test(message)) return "Runtime error: division by zero (CX_SY_ZERODIVIDE).";
  if (/Global class (\S+) not found/i.test(message)) {
    return `${message}. Only local classes defined in your program are available in this environment.`;
  }
  return `Runtime error: ${message}`;
}

export async function runAbap(source: string): Promise<AbapRunResult> {
  const started = Date.now();
  const elapsed = () => Date.now() - started;

  let code: string;
  try {
    const result = await new Transpiler().runRaw([{ filename: "zprog.prog.abap", contents: source }]);
    code = result.objects.map((o) => o.chunk.getCode()).join("\n");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { status: "compile_error", output: "", error: formatCompileError(message), timeMs: elapsed() };
  }

  const abap = new runtime.ABAP({ console: new runtime.MemoryConsole() });
  // The generated code (and the runtime itself) reach the instance through a global.
  (globalThis as unknown as { abap: unknown }).abap = abap;

  try {
    await new AsyncFunction("abap", code)(abap);
    return { status: "ok", output: String(abap.console.get()), timeMs: elapsed() };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      status: "runtime_error",
      output: String(abap.console.get()),
      error: describeRuntimeError(message),
      timeMs: elapsed(),
    };
  }
}
