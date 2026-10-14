"use client";

import { AlertTriangle, CheckCircle2, Loader2, Trash2, XCircle } from "lucide-react";
import type { TestRow } from "@/lib/data/code-api";

export type RunStatus = "running" | "ok" | "compile_error" | "runtime_error" | "timeout" | "unavailable";

export interface RunView {
  status: RunStatus;
  stdout: string;
  stderr: string;
  timeMs?: number;
  where?: string;
  message?: string;
}

export interface TestView {
  heading: string;
  graded: boolean;
  /** "official" results come from the server; "local" are an ungraded browser check. */
  kind: "official" | "local" | "submission";
  passed: number;
  total: number;
  rows: TestRow[];
  note?: string;
}

export type OutputTab = "output" | "tests" | "input" | "preview";

interface Props {
  tab: OutputTab;
  onTab: (t: OutputTab) => void;
  run: RunView | null;
  tests: TestView | null;
  stdin: string;
  onStdin: (v: string) => void;
  showPreview: boolean;
  previewDoc: string;
  previewKey: number;
  hasTests: boolean;
  onClear: () => void;
}

const STATUS: Record<RunStatus, { label: string; cls: string }> = {
  running: { label: "Running…", cls: "text-[#616161]" },
  ok: { label: "Finished", cls: "text-[#16825d]" },
  compile_error: { label: "Compile error", cls: "text-[#c42b1c]" },
  runtime_error: { label: "Runtime error", cls: "text-[#c42b1c]" },
  timeout: { label: "Timed out", cls: "text-[#b86e00]" },
  unavailable: { label: "Cannot run here", cls: "text-[#b86e00]" },
};

export function OutputPanel({
  tab,
  onTab,
  run,
  tests,
  stdin,
  onStdin,
  showPreview,
  previewDoc,
  previewKey,
  hasTests,
  onClear,
}: Props) {
  const tabs: { id: OutputTab; label: string; show: boolean }[] = [
    { id: "output", label: "Output", show: true },
    { id: "tests", label: tests ? `Tests (${tests.passed}/${tests.total})` : "Tests", show: hasTests },
    { id: "input", label: "Input", show: !showPreview },
    { id: "preview", label: "Preview", show: showPreview },
  ];

  return (
    <div className="flex h-full flex-col bg-white text-[#1f1f1f]" aria-label="Output panel">
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-[#d4d4d4] bg-[#f3f3f3] px-2">
        <div role="tablist" className="flex h-full items-end gap-1">
          {tabs
            .filter((t) => t.show)
            .map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => onTab(t.id)}
                className={`h-8 border-b-2 px-3 text-[11px] font-semibold uppercase tracking-wide ${
                  tab === t.id ? "border-[#3b7ddd] text-[#1f1f1f]" : "border-transparent text-[#616161] hover:text-[#1f1f1f]"
                }`}
              >
                {t.label}
              </button>
            ))}
        </div>
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear output"
          title="Clear output"
          className="rounded p-1.5 text-[#616161] hover:bg-[#e2e2e2]"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-3 font-mono text-[12.5px] leading-relaxed">
        {tab === "output" && <OutputBody run={run} />}
        {tab === "tests" && <TestsBody tests={tests} />}
        {tab === "input" && (
          <label className="block font-sans text-xs text-[#616161]">
            Standard input (read by <code>input()</code>, <code>Scanner</code>, <code>cin</code>…)
            <textarea
              value={stdin}
              onChange={(e) => onStdin(e.target.value)}
              rows={6}
              maxLength={10000}
              spellCheck={false}
              className="mt-1.5 w-full rounded border border-[#c8c8c8] bg-white p-2 font-mono text-[12.5px] text-[#1f1f1f] outline-none focus:border-[#3b7ddd]"
            />
          </label>
        )}
        {tab === "preview" && (
          <iframe
            key={previewKey}
            title="Web preview"
            sandbox="allow-scripts allow-forms allow-modals"
            srcDoc={previewDoc}
            className="h-full min-h-[200px] w-full rounded border border-[#d4d4d4] bg-white"
          />
        )}
      </div>
    </div>
  );
}

function OutputBody({ run }: { run: RunView | null }) {
  if (!run) {
    return <p className="font-sans text-xs text-[#6a6a6a]">Run your program to see its output here. (Ctrl + Enter)</p>;
  }
  const s = STATUS[run.status];
  return (
    <div role="log" aria-live="polite">
      <p className={`mb-2 flex items-center gap-1.5 font-sans text-xs font-semibold ${s.cls}`}>
        {run.status === "running" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
        {s.label}
        {run.timeMs !== undefined && run.status !== "running" ? ` · ${run.timeMs} ms` : ""}
        {run.where ? <span className="font-normal text-[#6a6a6a]"> · {run.where}</span> : null}
      </p>
      {run.message && <p className="mb-2 whitespace-pre-wrap font-sans text-xs text-[#6a4a00]">{run.message}</p>}
      {run.stdout && <pre className="whitespace-pre-wrap break-words text-[#1f1f1f]">{run.stdout}</pre>}
      {run.stderr && <pre className="mt-2 whitespace-pre-wrap break-words text-[#c42b1c]">{run.stderr}</pre>}
      {run.status === "ok" && !run.stdout && !run.stderr && (
        <p className="font-sans text-xs text-[#6a6a6a]">The program finished without printing anything.</p>
      )}
    </div>
  );
}

function TestsBody({ tests }: { tests: TestView | null }) {
  if (!tests) {
    return <p className="font-sans text-xs text-[#6a6a6a]">Use “Run tests” to check your code against the example tests.</p>;
  }
  return (
    <div className="font-sans text-xs">
      <p className="mb-1 font-semibold text-[#1f1f1f]">{tests.heading}</p>
      {tests.kind === "local" && (
        <p className="mb-2 flex items-start gap-1.5 text-[#6a4a00]">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> Local check in your browser. This is not graded; your submission is reviewed by your tutor.
        </p>
      )}
      {tests.note && <p className="mb-2 text-[#6a4a00]">{tests.note}</p>}
      {tests.graded && (
        <p className={`mb-2 font-semibold ${tests.passed === tests.total ? "text-[#16825d]" : "text-[#c42b1c]"}`}>
          {tests.passed} of {tests.total} tests passed
        </p>
      )}
      <ul className="space-y-2">
        {tests.rows.map((r) => (
          <li key={r.index} className="rounded border border-[#e0e0e0] bg-[#fafafa] p-2">
            <p className={`flex items-center gap-1.5 font-semibold ${r.passed ? "text-[#16825d]" : "text-[#c42b1c]"}`}>
              {r.passed ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
              {r.hidden ? "Hidden test" : `Test ${r.index + 1}`} — {r.passed ? "passed" : "failed"}
            </p>
            {!r.hidden && (
              <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 font-mono text-[11.5px] text-[#2b2b2b]">
                <dt className="text-[#6a6a6a]">input</dt>
                <dd className="whitespace-pre-wrap break-words">{r.input || "(none)"}</dd>
                <dt className="text-[#6a6a6a]">expected</dt>
                <dd className="whitespace-pre-wrap break-words">{r.expectedOutput}</dd>
                {!r.passed && (
                  <>
                    <dt className="text-[#6a6a6a]">got</dt>
                    <dd className="whitespace-pre-wrap break-words text-[#c42b1c]">{r.actualOutput || r.error || "(no output)"}</dd>
                  </>
                )}
              </dl>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
