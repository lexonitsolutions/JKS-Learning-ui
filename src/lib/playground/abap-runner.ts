/**
 * Runs ABAP with the open-source open-abap toolchain (abaplint transpiler +
 * runtime): the ABAP is checked and transpiled to JavaScript, then executed.
 * No SAP system is involved, so this is a LIMITED SUBSET of ABAP - plain
 * REPORT programs with local classes, internal tables, structures, string
 * templates and control flow. Each run gets an empty in-memory SQLite database
 * (COMMIT/ROLLBACK work), but no SAP tables exist. SAP UI, function modules and
 * the standard exception classes are not available.
 *
 * This module is DOM-free so it runs inside a Web Worker (see abap.worker.ts)
 * and can be exercised from Node.
 */
import { Transpiler } from "@abaplint/transpiler";
import * as runtime from "@abaplint/runtime";
import { SQLiteDatabaseClient } from "@abaplint/database-sqlite";

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

/**
 * "MODIFY itab FROM wa." (inside a LOOP, no INDEX) is valid ABAP, but the transpiler
 * compiles it as a database MODIFY. For standard tables declared in the program,
 * make the index explicit so it stays an internal-table statement.
 */
export function fixInternalTableModify(raw: string): string {
  const tables = new Set<string>();
  for (const m of raw.matchAll(/([a-zA-Z0-9_]+)\s+TYPE\s+(?:STANDARD\s+)?TABLE\b/gi)) {
    tables.add(m[1].toLowerCase());
  }
  if (tables.size === 0) return raw;
  return raw.replace(/\bMODIFY\s+([a-zA-Z0-9_]+)\s+FROM\s+([a-zA-Z0-9_\-<>]+)\s*\./gi, (whole, table, wa) =>
    tables.has(String(table).toLowerCase()) ? `MODIFY ${table} FROM ${wa} INDEX sy-tabix.` : whole,
  );
}

export function prepareAbapSource(input: string): string {
  const raw = fixInternalTableModify(input);
  if (!/if_oo_adt_classrun/i.test(raw)) return raw;

  const shim = `
INTERFACE if_oo_adt_classrun_out.
  METHODS write IMPORTING data TYPE any.
ENDINTERFACE.

INTERFACE if_oo_adt_classrun.
  METHODS main IMPORTING out TYPE REF TO if_oo_adt_classrun_out.
ENDINTERFACE.

CLASS lcl_adt_out DEFINITION.
  PUBLIC SECTION.
    INTERFACES if_oo_adt_classrun_out.
ENDCLASS.

CLASS lcl_adt_out IMPLEMENTATION.
  METHOD if_oo_adt_classrun_out~write.
    WRITE: / data.
  ENDMETHOD.
ENDCLASS.
`;

  // Convert global cloud classes "CLASS ... DEFINITION PUBLIC [FINAL] [CREATE PUBLIC]." into local classes
  let prepared = raw.replace(
    /CLASS\s+([a-zA-Z0-9_]+)\s+DEFINITION\s+PUBLIC(?:\s+FINAL)?(?:\s+CREATE\s+PUBLIC)?\s*\./gi,
    "CLASS $1 DEFINITION.",
  );

  // Detect the class that implements if_oo_adt_classrun~main and auto-instantiate it
  const match = prepared.match(/CLASS\s+([a-zA-Z0-9_]+)\s+IMPLEMENTATION[\s\S]*?if_oo_adt_classrun~main/i);
  if (match && !/START-OF-SELECTION/i.test(prepared)) {
    const className = match[1];
    prepared += `
START-OF-SELECTION.
  DATA _lo_app TYPE REF TO ${className}.
  DATA _lo_out TYPE REF TO lcl_adt_out.
  CREATE OBJECT _lo_out.
  CREATE OBJECT _lo_app.
  _lo_app->if_oo_adt_classrun~main( _lo_out ).
`;
  }

  return shim + "\n" + prepared;
}

export async function runAbap(source: string): Promise<AbapRunResult> {
  const started = Date.now();
  const elapsed = () => Date.now() - started;

  let code: string;
  let dbSetup: { schemas: { sqlite: string[] }; insert: string[] };
  try {
    const preparedSource = prepareAbapSource(source);
    const result = await new Transpiler().runRaw([{ filename: "zprog.prog.abap", contents: preparedSource }]);
    code = result.objects.map((o) => o.chunk.getCode()).join("\n");
    dbSetup = result.databaseSetup;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { status: "compile_error", output: "", error: formatCompileError(message), timeMs: elapsed() };
  }

  const abap = new runtime.ABAP({ console: new runtime.MemoryConsole() });
  // The generated code (and the runtime itself) reach the instance through a global.
  (globalThis as unknown as { abap: unknown }).abap = abap;

  // Every run gets its own in-memory SQLite database, so COMMIT WORK, ROLLBACK and
  // Open SQL statements find a DEFAULT connection instead of "database not initialized".
  const db = new SQLiteDatabaseClient();
  try {
    await db.connect();
    abap.context.databaseConnections["DEFAULT"] = db;
    await db.execute(dbSetup.schemas.sqlite);
    await db.execute(dbSetup.insert);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      status: "runtime_error",
      output: "",
      error: `Could not start the in-memory database: ${message}`,
      timeMs: elapsed(),
    };
  }

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
