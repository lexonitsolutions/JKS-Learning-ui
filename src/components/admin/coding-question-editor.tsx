"use client";

import { AlertTriangle, Plus, Trash2 } from "lucide-react";
import { CODING_LANGUAGE_OPTIONS, scaffoldingProblems } from "@/lib/utils/coding-question";
import type { TaskTestCase } from "@/lib/data/tasks-api";

export interface CodingFields {
  language: string;
  starterCode: string;
  instructions: string;
  tests: TaskTestCase[];
  /** Never shown to students; used for grading and by reviewers. */
  reference: string;
}

interface Props {
  value: CodingFields;
  onChange: (patch: Partial<CodingFields>) => void;
}

const LABEL = "block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400";
const AREA =
  "w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 outline-none focus:border-[#2563EB] dark:border-slate-700 dark:bg-input-bg dark:text-white";
const MONO = `${AREA} font-mono`;

/**
 * The one editor for a coding question, used by every authoring screen so a
 * coding task is defined the same way everywhere: language, partly-complete
 * starter code with TODOs, instructions, tests (some hidden) and a reference
 * solution that stays server-side.
 */
export function CodingQuestionEditor({ value, onChange }: Props) {
  const problems = scaffoldingProblems(value.starterCode, value.reference);

  const setTest = (i: number, patch: Partial<TaskTestCase>) =>
    onChange({ tests: value.tests.map((t, idx) => (idx === i ? { ...t, ...patch } : t)) });

  return (
    <div className="space-y-3 pt-1">
      <div className="flex flex-wrap items-center gap-2">
        <label className={LABEL} htmlFor="cq-lang">
          Language
        </label>
        <select
          id="cq-lang"
          value={value.language}
          onChange={(e) => onChange({ language: e.target.value })}
          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-900 outline-none dark:border-slate-700 dark:bg-input-bg dark:text-white"
        >
          {CODING_LANGUAGE_OPTIONS.map((l) => (
            <option key={l.id} value={l.id}>
              {l.label}
            </option>
          ))}
        </select>
        {value.language === "abap" && (
          <span className="text-[10.5px] text-amber-700 dark:text-amber-300">
            ABAP runs in the browser (limited subset) and is reviewed manually.
          </span>
        )}
      </div>

      <div>
        <label className={LABEL}>What the student must complete</label>
        <textarea
          rows={2}
          value={value.instructions}
          onChange={(e) => onChange({ instructions: e.target.value })}
          placeholder="e.g. Finish the loop in total() so it adds every number."
          className={AREA}
        />
      </div>

      <div>
        <label className={LABEL}>Starter code (about 60% scaffolding, TODO where the student writes)</label>
        <textarea
          rows={7}
          value={value.starterCode}
          onChange={(e) => onChange({ starterCode: e.target.value })}
          spellCheck={false}
          placeholder={"def total(nums):\n    result = 0\n    # TODO: add every number to result\n    return result"}
          className={MONO}
        />
        {problems.length > 0 && (
          <ul className="mt-1.5 space-y-0.5" role="status">
            {problems.map((p) => (
              <li key={p} className="flex items-start gap-1.5 text-[11px] text-amber-700 dark:text-amber-300">
                <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" /> {p}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <label className={LABEL}>Reference solution (never shown to students)</label>
        <textarea
          rows={5}
          value={value.reference}
          onChange={(e) => onChange({ reference: e.target.value })}
          spellCheck={false}
          className={MONO}
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className={LABEL}>Test cases (stdin → expected stdout)</label>
          <button
            type="button"
            onClick={() => onChange({ tests: [...value.tests, { input: "", expectedOutput: "", hidden: false }] })}
            className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-1 text-[10.5px] font-bold text-[#2563EB] hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-400"
          >
            <Plus className="h-3 w-3" /> Add test
          </button>
        </div>
        {value.tests.length === 0 ? (
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Without tests, submissions go to a reviewer instead of being graded automatically.
          </p>
        ) : (
          <div className="mt-1.5 space-y-2">
            {value.tests.map((t, i) => (
              <div key={i} className="grid grid-cols-1 items-start gap-2 sm:grid-cols-[1fr_1fr_auto_auto]">
                <textarea
                  rows={2}
                  aria-label={`Test ${i + 1} input`}
                  value={t.input}
                  onChange={(e) => setTest(i, { input: e.target.value })}
                  placeholder="stdin"
                  className={MONO}
                />
                <textarea
                  rows={2}
                  aria-label={`Test ${i + 1} expected output`}
                  value={t.expectedOutput}
                  onChange={(e) => setTest(i, { expectedOutput: e.target.value })}
                  placeholder="expected stdout"
                  className={MONO}
                />
                <label className="flex items-center gap-1.5 pt-2 text-[10.5px] font-semibold text-slate-600 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={!!t.hidden}
                    onChange={(e) => setTest(i, { hidden: e.target.checked })}
                    className="accent-[#2563EB]"
                  />
                  Hidden
                </label>
                <button
                  type="button"
                  aria-label={`Remove test ${i + 1}`}
                  onClick={() => onChange({ tests: value.tests.filter((_, idx) => idx !== i) })}
                  className="p-2 text-slate-400 hover:text-rose-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
