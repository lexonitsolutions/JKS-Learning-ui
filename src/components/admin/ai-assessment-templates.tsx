"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Loader2, Pencil, Search, Send, Sparkles, Trash2, X } from "lucide-react";
import Link from "next/link";
import {
  assignTemplate,
  deleteTemplate,
  fetchTemplateStudents,
  getTemplate,
  listTemplates,
  updateTemplate,
  type TemplateDetail,
  type TemplateSummary,
} from "@/lib/data/assessment-templates-api";
import { StudentPickerModal } from "./student-picker-modal";

const TYPE_LABEL: Record<string, string> = {
  MCQ: "MCQ",
  SHORT_ANSWER: "Medium",
  LONG_ANSWER: "Long answer",
  FILE_UPLOAD: "File upload",
  CODING: "Coding",
};

const INPUT =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#2563EB] dark:border-slate-700 dark:bg-input-bg dark:text-white";

const errMsg = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong. Please try again.");

interface Props {
  /** Where the AI Studio link points for the empty state. */
  aiStudioHref: string;
  onToast?: (message: string) => void;
}

/**
 * Templates saved from AI Studio. They come from the database, so they survive
 * refreshes and new sessions. From here a template can be reviewed, turned into
 * an assessment and assigned to selected students.
 */
export function AiAssessmentTemplates({ aiStudioHref, onToast }: Props) {
  const [templates, setTemplates] = useState<TemplateSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const [viewing, setViewing] = useState<TemplateDetail | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

  const [assigning, setAssigning] = useState<TemplateSummary | null>(null);
  const [assignTitle, setAssignTitle] = useState("");
  const [assignDue, setAssignDue] = useState("");

  const load = useCallback(async () => {
    setError(null);
    try {
      setTemplates(await listTemplates());
    } catch (e) {
      setTemplates([]);
      setError(errMsg(e));
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return templates ?? [];
    return (templates ?? []).filter((t) =>
      [t.title, t.courseTitle, t.topic].some((v) => v?.toLowerCase().includes(q)),
    );
  }, [templates, query]);

  async function openDetails(t: TemplateSummary) {
    setViewLoading(true);
    setError(null);
    try {
      setViewing(await getTemplate(t.id));
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setViewLoading(false);
    }
  }

  async function rename(t: TemplateSummary) {
    const next = window.prompt("Template name:", t.title);
    if (next === null || !next.trim() || next.trim() === t.title) return;
    try {
      await updateTemplate(t.id, { title: next.trim() });
      onToast?.("Template renamed.");
      await load();
    } catch (e) {
      setError(errMsg(e));
    }
  }

  async function remove(t: TemplateSummary) {
    if (
      !window.confirm(
        `Delete "${t.title}"? Assessments already created from it stay with their students. This cannot be undone.`,
      )
    ) {
      return;
    }
    try {
      await deleteTemplate(t.id);
      onToast?.("Template deleted.");
      await load();
    } catch (e) {
      setError(errMsg(e));
    }
  }

  function startAssign(t: TemplateSummary) {
    setAssignTitle(t.title);
    setAssignDue("");
    setAssigning(t);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-1.5 text-sm font-bold text-slate-900 dark:text-white">
            <Sparkles className="h-4 w-4 text-[#2563EB]" /> AI Assessments
          </h3>
          <p className="text-xs text-slate-500">
            Templates saved from AI Studio. Create an assessment from one and assign it to students.
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search templates"
            aria-label="Search templates"
            className={`${INPUT} pl-9`}
          />
        </div>
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">
          {error}{" "}
          <button type="button" onClick={load} className="font-bold underline">
            Retry
          </button>
        </div>
      )}

      {templates === null ? (
        <p className="flex items-center gap-2 py-8 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading templates…
        </p>
      ) : filtered.length === 0 && !error ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {templates.length === 0 ? "No AI templates yet" : "No templates match your search"}
          </p>
          {templates.length === 0 && (
            <p className="mt-1 text-xs text-slate-500">
              Generate questions in{" "}
              <Link href={aiStudioHref} className="font-semibold text-[#2563EB] underline underline-offset-2">
                AI Studio
              </Link>{" "}
              and choose <em>Save as template</em>.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <div
              key={t.id}
              className="flex flex-col justify-between space-y-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-surface-secondary"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-[#2563EB] dark:border-blue-800/60 dark:bg-blue-950/50 dark:text-blue-400">
                    {t.courseTitle || "No course"}
                  </span>
                  <span className="shrink-0 text-[11px] font-semibold text-slate-400">{t.questionCount} Questions</span>
                </div>
                <h4 className="text-sm font-bold leading-snug text-slate-900 dark:text-white">{t.title}</h4>
                {t.topic && <p className="text-xs text-slate-500 dark:text-slate-400">Topic: {t.topic}</p>}
                <div className="flex flex-wrap gap-1.5">
                  {t.questionTypes.map((ty) => (
                    <span key={ty} className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {TYPE_LABEL[ty] ?? ty}
                    </span>
                  ))}
                  {t.difficulty && (
                    <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
                      {t.difficulty.charAt(0) + t.difficulty.slice(1).toLowerCase()}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">Saved {new Date(t.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-2 dark:border-slate-800">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => openDetails(t)}
                    disabled={viewLoading}
                    className="rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-surface-hover"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => startAssign(t)}
                    className="inline-flex items-center gap-1 rounded-lg bg-[#2563EB] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-700"
                  >
                    <Send className="h-3 w-3" /> Assign
                  </button>
                </div>
                {t.canModify && (
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => rename(t)}
                      aria-label={`Rename ${t.title}`}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(t)}
                      aria-label={`Delete ${t.title}`}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <TemplateDetailsModal template={viewing} onClose={() => setViewing(null)} onAssign={() => viewing && (setViewing(null), startAssign(viewing))} />

      <StudentPickerModal
        open={!!assigning}
        resetKey={`${assigning?.id ?? ""}|${assignTitle}`}
        title="Create assessment & assign"
        subtitle={assigning?.title}
        note="Creates one assessment per selected student. Students who already have an assessment with this title are skipped."
        confirmVerb="Assign to"
        header={
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              Assessment title
              <input className={`${INPUT} mt-1`} value={assignTitle} maxLength={120} onChange={(e) => setAssignTitle(e.target.value)} />
            </label>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              Due date (optional)
              <input type="date" className={`${INPUT} mt-1`} value={assignDue} onChange={(e) => setAssignDue(e.target.value)} />
            </label>
          </div>
        }
        load={(search) => (assigning ? fetchTemplateStudents(assigning.id, search, assignTitle) : Promise.resolve([]))}
        onConfirm={async (ids) => {
          if (!assigning) return;
          const res = await assignTemplate(assigning.id, {
            studentIds: ids,
            title: assignTitle.trim() || undefined,
            dueDate: assignDue || undefined,
          });
          onToast?.(
            res.skipped.length > 0
              ? `Assigned to ${res.assigned} student(s). ${res.skipped.length} skipped.`
              : `Assigned to ${res.assigned} student(s).`,
          );
        }}
        onClose={() => setAssigning(null)}
      />
    </div>
  );
}

function TemplateDetailsModal({
  template,
  onClose,
  onAssign,
}: {
  template: TemplateDetail | null;
  onClose: () => void;
  onAssign: () => void;
}) {
  useEffect(() => {
    if (!template) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [template, onClose]);

  if (!template || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs dark:bg-black/75" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tpl-title"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-surface-secondary"
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-5 dark:border-slate-800">
          <div className="min-w-0">
            <h3 id="tpl-title" className="text-base font-black text-slate-900 dark:text-white">
              {template.title}
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              {[template.courseTitle, template.topic, `${template.questionCount} questions`].filter(Boolean).join(" · ")}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-surface-hover">
            <X className="h-4 w-4" />
          </button>
        </div>

        <ol className="space-y-3 overflow-y-auto p-5">
          {template.questions.map((q, i) => (
            <li key={q.id ?? i} className="rounded-xl border border-slate-200 p-3.5 text-xs dark:border-slate-700">
              <div className="flex items-center justify-between text-[10.5px] font-bold uppercase tracking-wide text-slate-400">
                <span>
                  Q{i + 1} · {TYPE_LABEL[q.type] ?? q.type}
                  {q.type === "CODING" && q.language ? ` · ${q.language}` : ""}
                </span>
                <span>{q.maxPoints ?? ""} marks</span>
              </div>
              <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{q.prompt}</p>

              {q.type === "MCQ" && q.choices && (
                <ul className="mt-2 space-y-1 text-slate-600 dark:text-slate-300">
                  {q.choices.map((c, ci) => (
                    <li key={ci} className={ci === q.correctAnswer ? "font-bold text-emerald-600 dark:text-emerald-400" : ""}>
                      {ci === q.correctAnswer ? "✓ " : "• "}
                      {c}
                    </li>
                  ))}
                </ul>
              )}
              {q.type === "SHORT_ANSWER" && q.modelAnswer && (
                <p className="mt-2 text-slate-600 dark:text-slate-300">
                  <span className="font-semibold">Model answer: </span>
                  {q.modelAnswer}
                </p>
              )}
              {q.type === "CODING" && (
                <div className="mt-2 space-y-2">
                  {q.instructions && (
                    <p className="text-slate-600 dark:text-slate-300">
                      <span className="font-semibold">Student must: </span>
                      {q.instructions}
                    </p>
                  )}
                  {q.starterCode && (
                    <pre className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-[11px] text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">{q.starterCode}</pre>
                  )}
                  <p className="text-[11px] text-slate-500">
                    {(q.testCases ?? []).length} test cases ({(q.testCases ?? []).filter((t) => t.hidden).length} hidden from students)
                  </p>
                  {q.referenceSolution && (
                    <details>
                      <summary className="cursor-pointer text-[11px] font-semibold text-slate-500">Reference solution (staff only)</summary>
                      <pre className="mt-1 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-[11px] text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">{q.referenceSolution}</pre>
                    </details>
                  )}
                </div>
              )}
            </li>
          ))}
        </ol>

        <div className="flex justify-end gap-2 border-t border-slate-100 p-4 dark:border-slate-800">
          <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-surface-hover">
            Close
          </button>
          <button type="button" onClick={onAssign} className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white hover:bg-blue-700">
            <Send className="h-3.5 w-3.5" /> Create assessment & assign
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
