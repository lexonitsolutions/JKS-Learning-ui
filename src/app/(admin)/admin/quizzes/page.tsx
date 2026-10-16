"use client";

import React, { useCallback, useEffect, useState } from "react";
import { BarChart3, CheckCircle2, Eye, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import {
  adminDeleteQuiz,
  adminGetQuiz,
  adminListQuizzes,
  adminQuizAttempts,
  adminSaveQuiz,
  type AdminQuizDetail,
  type AdminQuizSummary,
  type QuizAttemptRow,
  type QuizDraftQuestion,
} from "@/lib/data/explore-quizzes-api";

const errMsg = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong. Please try again.");
const newId = () => `q${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
const blankQuestion = (): QuizDraftQuestion => ({ id: newId(), prompt: "", choices: ["", "", "", ""], correctIndex: 0, explanation: "" });
const blankQuiz = (): Omit<AdminQuizDetail, "id"> => ({
  title: "",
  description: "",
  category: "",
  status: "DRAFT",
  passPercent: 60,
  timeLimitMinutes: null,
  shuffleQuestions: true,
  shuffleOptions: true,
  questions: [blankQuestion()],
});

const inputCls =
  "w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 outline-none focus:border-[#2563EB] dark:border-slate-700 dark:bg-input-bg dark:text-white";

export default function AdminQuizzesPage() {
  const [list, setList] = useState<AdminQuizSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<{ id: string | null; quiz: Omit<AdminQuizDetail, "id"> } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [results, setResults] = useState<{ title: string; passPercent: number; rows: QuizAttemptRow[] } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setList(await adminListQuizzes());
      setError(null);
    } catch (e) {
      setError(errMsg(e));
      setList([]);
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);

  const openEditor = async (id: string | null) => {
    setSaveError(null);
    if (!id) return setEditing({ id: null, quiz: blankQuiz() });
    setBusy(id);
    try {
      const { id: _id, ...rest } = await adminGetQuiz(id);
      setEditing({ id, quiz: { ...rest, description: rest.description ?? "", category: rest.category ?? "" } });
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setBusy(null);
    }
  };

  const openResults = async (q: AdminQuizSummary) => {
    setBusy(q.id);
    try {
      const r = await adminQuizAttempts(q.id);
      setResults({ title: r.quiz.title, passPercent: r.quiz.passPercent, rows: r.attempts });
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setBusy(null);
    }
  };

  const remove = async (q: AdminQuizSummary) => {
    if (!window.confirm(`Delete "${q.title}" and all ${q.attempts} recorded attempt(s)? This cannot be undone.`)) return;
    setBusy(q.id);
    try {
      await adminDeleteQuiz(q.id);
      await load();
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setBusy(null);
    }
  };

  const save = async (status: "DRAFT" | "PUBLISHED") => {
    if (!editing) return;
    setSaving(true);
    setSaveError(null);
    try {
      await adminSaveQuiz(editing.id, { ...editing.quiz, status });
      setEditing(null);
      await load();
    } catch (e) {
      setSaveError(errMsg(e));
    } finally {
      setSaving(false);
    }
  };

  const patchQuiz = (p: Partial<Omit<AdminQuizDetail, "id">>) => setEditing((c) => (c ? { ...c, quiz: { ...c.quiz, ...p } } : c));
  const patchQuestion = (i: number, p: Partial<QuizDraftQuestion>) =>
    setEditing((c) => (c ? { ...c, quiz: { ...c.quiz, questions: c.quiz.questions.map((q, idx) => (idx === i ? { ...q, ...p } : q)) } } : c));

  return (
    <>
      <DashboardTopbar title="Quizzes" subtitle="Create practice quizzes for every student and monitor their results." />
      <div className="mx-auto w-full max-w-6xl flex-1 space-y-5 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">Students find published quizzes under Explore → Quizzes.</p>
          <button type="button" onClick={() => void openEditor(null)} className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer">
            <Plus className="h-4 w-4" /> New quiz
          </button>
        </div>

        {error && <p role="alert" className="text-xs font-semibold text-rose-600">{error}</p>}

        {list === null ? (
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
        ) : list.length === 0 && !error ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-xs text-slate-500 dark:border-slate-700">
            No quizzes yet. Create the first one.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-surface-secondary">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-surface-elevated">
                <tr>
                  <th className="px-4 py-3">Quiz</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Questions</th>
                  <th className="px-4 py-3">Students</th>
                  <th className="px-4 py-3">Attempts</th>
                  <th className="px-4 py-3">Avg score</th>
                  <th className="px-4 py-3">Pass rate</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {list.map((q) => (
                  <tr key={q.id}>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900 dark:text-white">{q.title}</div>
                      {q.category && <div className="text-[11px] text-slate-400">{q.category}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${q.status === "PUBLISHED" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}>{q.status === "PUBLISHED" ? "Published" : "Draft"}</span>
                    </td>
                    <td className="px-4 py-3">{q.questionCount}</td>
                    <td className="px-4 py-3">{q.students}</td>
                    <td className="px-4 py-3">{q.attempts}</td>
                    <td className="px-4 py-3">{q.averagePercent === null ? "-" : `${q.averagePercent}%`}</td>
                    <td className="px-4 py-3">{q.passRate === null ? "-" : `${q.passRate}%`}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <button type="button" title="Results" onClick={() => void openResults(q)} disabled={busy === q.id} className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 cursor-pointer"><BarChart3 className="h-3.5 w-3.5" /></button>
                        <button type="button" title="Edit" onClick={() => void openEditor(q.id)} disabled={busy === q.id} className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 cursor-pointer"><Pencil className="h-3.5 w-3.5" /></button>
                        <button type="button" title="Delete" onClick={() => void remove(q)} disabled={busy === q.id} className="rounded-lg border border-rose-200 p-1.5 text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:hover:bg-rose-950/30 cursor-pointer"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Editor */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6">
          <div className="relative w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-surface-secondary sm:p-7">
            <button type="button" onClick={() => setEditing(null)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer" aria-label="Close"><X className="h-4 w-4" /></button>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">{editing.id ? "Edit quiz" : "New quiz"}</h2>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-6">
              <label className="sm:col-span-4 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Title
                <input className={`${inputCls} mt-1 font-normal normal-case`} value={editing.quiz.title} onChange={(e) => patchQuiz({ title: e.target.value })} placeholder="e.g. JavaScript fundamentals" />
              </label>
              <label className="sm:col-span-2 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Category
                <input className={`${inputCls} mt-1 font-normal normal-case`} value={editing.quiz.category ?? ""} onChange={(e) => patchQuiz({ category: e.target.value })} placeholder="e.g. React" />
              </label>
              <label className="sm:col-span-6 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Description
                <textarea rows={2} className={`${inputCls} mt-1 font-normal normal-case`} value={editing.quiz.description ?? ""} onChange={(e) => patchQuiz({ description: e.target.value })} />
              </label>
              <label className="sm:col-span-2 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Pass mark (%)
                <input type="number" min={1} max={100} className={`${inputCls} mt-1`} value={editing.quiz.passPercent} onChange={(e) => patchQuiz({ passPercent: Math.round(Number(e.target.value) || 0) })} />
              </label>
              <label className="sm:col-span-2 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Time limit (min)
                <input type="number" min={1} max={300} className={`${inputCls} mt-1`} placeholder="No limit" value={editing.quiz.timeLimitMinutes ?? ""} onChange={(e) => patchQuiz({ timeLimitMinutes: e.target.value === "" ? null : Math.round(Number(e.target.value)) })} />
              </label>
              <div className="sm:col-span-2 flex flex-col justify-end gap-1 text-xs font-semibold text-slate-700 dark:text-slate-200">
                <label className="flex items-center gap-2"><input type="checkbox" className="accent-[#2563EB]" checked={editing.quiz.shuffleQuestions} onChange={(e) => patchQuiz({ shuffleQuestions: e.target.checked })} /> Shuffle questions per student</label>
                <label className="flex items-center gap-2"><input type="checkbox" className="accent-[#2563EB]" checked={editing.quiz.shuffleOptions} onChange={(e) => patchQuiz({ shuffleOptions: e.target.checked })} /> Shuffle options per student</label>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {editing.quiz.questions.map((q, i) => (
                <div key={q.id} className="space-y-2 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Question {i + 1}</span>
                    {editing.quiz.questions.length > 1 && (
                      <button type="button" onClick={() => patchQuiz({ questions: editing.quiz.questions.filter((_, idx) => idx !== i) })} className="text-slate-400 hover:text-rose-500 cursor-pointer" title="Delete question"><Trash2 className="h-3.5 w-3.5" /></button>
                    )}
                  </div>
                  <textarea rows={2} className={inputCls} value={q.prompt} onChange={(e) => patchQuestion(i, { prompt: e.target.value })} placeholder="Write the question" />
                  <div className="space-y-1.5">
                    {q.choices.map((c, ci) => (
                      <div key={ci} className="flex items-center gap-2">
                        <input type="radio" name={`correct-${q.id}`} className="accent-emerald-600" checked={q.correctIndex === ci} onChange={() => patchQuestion(i, { correctIndex: ci })} title="Mark as the correct option" />
                        <input className={inputCls} value={c} onChange={(e) => patchQuestion(i, { choices: q.choices.map((x, xi) => (xi === ci ? e.target.value : x)) })} placeholder={`Option ${ci + 1}`} />
                        {q.choices.length > 2 && (
                          <button type="button" onClick={() => patchQuestion(i, { choices: q.choices.filter((_, xi) => xi !== ci), correctIndex: q.correctIndex === ci ? 0 : q.correctIndex > ci ? q.correctIndex - 1 : q.correctIndex })} className="text-slate-400 hover:text-rose-500 cursor-pointer" title="Remove option"><X className="h-3.5 w-3.5" /></button>
                        )}
                      </div>
                    ))}
                    {q.choices.length < 6 && (
                      <button type="button" onClick={() => patchQuestion(i, { choices: [...q.choices, ""] })} className="text-[11px] font-bold text-[#2563EB] cursor-pointer">+ Add option</button>
                    )}
                  </div>
                  <input className={inputCls} value={q.explanation ?? ""} onChange={(e) => patchQuestion(i, { explanation: e.target.value })} placeholder="Explanation shown after submitting (optional)" />
                </div>
              ))}
              <button type="button" onClick={() => patchQuiz({ questions: [...editing.quiz.questions, blankQuestion()] })} className="flex w-full items-center justify-center gap-1 rounded-xl border border-dashed border-blue-300 py-2 text-xs font-bold text-[#2563EB] hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-950/40 cursor-pointer">
                <Plus className="h-3.5 w-3.5" /> Add question
              </button>
            </div>

            {saveError && <p role="alert" className="mt-4 text-xs font-semibold text-rose-600">{saveError}</p>}

            <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
              <button type="button" onClick={() => setEditing(null)} className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">Cancel</button>
              <button type="button" disabled={saving} onClick={() => void save("DRAFT")} className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 cursor-pointer">Save as draft</button>
              <button type="button" disabled={saving} onClick={() => void save("PUBLISHED")} className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-60 cursor-pointer">
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Eye className="h-3.5 w-3.5" />} Publish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6">
          <div className="relative w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-surface-secondary sm:p-7">
            <button type="button" onClick={() => setResults(null)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer" aria-label="Close"><X className="h-4 w-4" /></button>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">{results.title} - results</h2>
            <p className="text-xs text-slate-500">Pass mark {results.passPercent}% · {results.rows.length} attempt(s)</p>
            {results.rows.length === 0 ? (
              <p className="mt-6 text-center text-xs text-slate-500">No student has taken this quiz yet.</p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                  <thead className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <tr><th className="py-2 pr-3">Student</th><th className="py-2 pr-3">Score</th><th className="py-2 pr-3">Result</th><th className="py-2">Submitted</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {results.rows.map((r) => (
                      <tr key={r.id}>
                        <td className="py-2 pr-3"><div className="font-bold text-slate-900 dark:text-white">{r.userName || "Student"}</div><div className="text-[11px] text-slate-400">{r.userEmail}</div></td>
                        <td className="py-2 pr-3">{r.correct}/{r.total} ({r.percent}%)</td>
                        <td className="py-2 pr-3">{r.passed ? <span className="inline-flex items-center gap-1 text-emerald-600"><CheckCircle2 className="h-3 w-3" /> Passed</span> : <span className="text-amber-600">Not passed</span>}</td>
                        <td className="py-2">{new Date(r.submittedAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
