"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  BarChart3,
  CheckCircle2,
  Eye,
  Layers,
  Loader2,
  Pencil,
  Plus,
  Rocket,
  Sparkles,
  Trash2,
  Wand2,
  X,
} from "lucide-react";
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
import {
  deleteTemplate,
  getTemplate,
  listTemplates,
  type TemplateDetail,
  type TemplateSummary,
} from "@/lib/data/assessment-templates-api";

const errMsg = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong. Please try again.");
const newId = () => `q${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
const blankQuestion = (): QuizDraftQuestion => ({
  id: newId(),
  prompt: "",
  choices: ["", "", "", ""],
  correctIndex: 0,
  correctIndices: [0],
  multipleAnswers: false,
  explanation: "",
});
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

function AdminQuizzesContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"quizzes" | "templates">(
    searchParams.get("tab") === "templates" ? "templates" : "quizzes",
  );

  const [list, setList] = useState<AdminQuizSummary[] | null>(null);
  const [templates, setTemplates] = useState<TemplateSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<{ id: string | null; quiz: Omit<AdminQuizDetail, "id"> } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [results, setResults] = useState<{ title: string; passPercent: number; rows: QuizAttemptRow[] } | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateDetail | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);

  const loadQuizzes = useCallback(async () => {
    try {
      setList(await adminListQuizzes());
      setError(null);
    } catch (e) {
      setError(errMsg(e));
      setList([]);
    }
  }, []);

  const loadTemplatesList = useCallback(async () => {
    try {
      setTemplates(await listTemplates());
    } catch {
      setTemplates([]);
    }
  }, []);

  useEffect(() => {
    void loadQuizzes();
    void loadTemplatesList();
  }, [loadQuizzes, loadTemplatesList]);

  useEffect(() => {
    if (searchParams.get("tab") === "templates") {
      setActiveTab("templates");
    }
  }, [searchParams]);

  const openEditor = async (id: string | null) => {
    setSaveError(null);
    setTemplatePickerOpen(false);
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
      await loadQuizzes();
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
      await loadQuizzes();
    } catch (e) {
      setSaveError(errMsg(e));
    } finally {
      setSaving(false);
    }
  };

  // Convert template detail to quiz draft questions
  const templateQuestionsToDraft = (t: TemplateDetail): QuizDraftQuestion[] => {
    return t.questions.map((q, idx) => {
      const choices = q.choices && q.choices.length >= 2 ? q.choices : ["Option 1", "Option 2", "Option 3", "Option 4"];
      const isMulti = q.multipleAnswers || (Array.isArray(q.correctAnswers) && q.correctAnswers.length > 1);
      const rawIndices = Array.isArray(q.correctAnswers) ? q.correctAnswers : [typeof q.correctAnswer === "number" ? q.correctAnswer : 0];
      const correctIndices = rawIndices.filter((ci: number) => ci >= 0 && ci < choices.length);
      const correctIndex = correctIndices.length > 0 ? correctIndices[0] : 0;
      return {
        id: q.id || `q-${idx + 1}-${Date.now().toString(36)}`,
        prompt: q.prompt,
        choices,
        correctIndex,
        correctIndices: correctIndices.length > 0 ? correctIndices : [0],
        multipleAnswers: isMulti,
        explanation: q.explanation || "",
      };
    });
  };

  // Load a template into the quiz editor
  const loadTemplateIntoEditor = async (templateId: string) => {
    setBusy(templateId);
    setError(null);
    try {
      const t = await getTemplate(templateId);
      const questions = templateQuestionsToDraft(t);
      setEditing({
        id: null,
        quiz: {
          title: t.title,
          description: t.description ?? "",
          category: t.courseTitle || t.topic || "General",
          status: "DRAFT",
          passPercent: 60,
          timeLimitMinutes: 15,
          shuffleQuestions: true,
          shuffleOptions: true,
          questions: questions.length > 0 ? questions : [blankQuestion()],
        },
      });
      setTemplatePickerOpen(false);
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setBusy(null);
    }
  };

  // Directly publish a live quiz from template
  const publishFromTemplate = async (templateId: string) => {
    setBusy(templateId);
    setError(null);
    try {
      const t = await getTemplate(templateId);
      const questions = templateQuestionsToDraft(t);
      if (questions.length === 0) {
        throw new Error("This template contains no questions.");
      }
      await adminSaveQuiz(null, {
        title: t.title,
        description: t.description || `Quiz generated from template ${t.title}`,
        category: t.courseTitle || t.topic || "General",
        status: "PUBLISHED",
        passPercent: 60,
        timeLimitMinutes: 15,
        shuffleQuestions: true,
        shuffleOptions: true,
        questions,
      });
      await loadQuizzes();
      setActiveTab("quizzes");
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setBusy(null);
    }
  };

  const removeTemplate = async (t: TemplateSummary) => {
    if (!window.confirm(`Delete template "${t.title}"? Existing quizzes created from it will remain intact.`)) return;
    setBusy(t.id);
    try {
      await deleteTemplate(t.id);
      await loadTemplatesList();
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setBusy(null);
    }
  };

  const openPreview = async (templateId: string) => {
    setBusy(templateId);
    try {
      setPreviewTemplate(await getTemplate(templateId));
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setBusy(null);
    }
  };

  const patchQuiz = (p: Partial<Omit<AdminQuizDetail, "id">>) => setEditing((c) => (c ? { ...c, quiz: { ...c.quiz, ...p } } : c));
  const patchQuestion = (i: number, p: Partial<QuizDraftQuestion>) =>
    setEditing((c) => (c ? { ...c, quiz: { ...c.quiz, questions: c.quiz.questions.map((q, idx) => (idx === i ? { ...q, ...p } : q)) } } : c));

  return (
    <>
      <DashboardTopbar title="Quizzes" subtitle="Create practice quizzes for every student, manage templates, and monitor results." />
      <div className="mx-auto w-full max-w-6xl flex-1 space-y-5 p-4 sm:p-6 lg:p-8">
        {/* Top bar with tabs & actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-surface-secondary">
            <button
              type="button"
              onClick={() => setActiveTab("quizzes")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-colors cursor-pointer ${
                activeTab === "quizzes"
                  ? "bg-[#2563EB] text-white"
                  : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-surface-hover"
              }`}
            >
              All Quizzes {list ? `(${list.length})` : ""}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("templates")}
              className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-colors cursor-pointer ${
                activeTab === "templates"
                  ? "bg-[#2563EB] text-white"
                  : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-surface-hover"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              Quiz Templates {templates ? `(${templates.length})` : ""}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/ai-studio?tab=quiz"
              className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2 text-xs font-bold text-[#2563EB] hover:bg-blue-100 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300 cursor-pointer"
            >
              <Wand2 className="h-3.5 w-3.5" /> Generate with AI Studio
            </Link>
            <button
              type="button"
              onClick={() => void openEditor(null)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
            >
              <Plus className="h-4 w-4" /> New quiz
            </button>
          </div>
        </div>

        {error && <p role="alert" className="text-xs font-semibold text-rose-600">{error}</p>}

        {/* ── TAB 1: ALL QUIZZES ───────────────────────────────────────── */}
        {activeTab === "quizzes" && (
          <>
            <p className="text-xs text-slate-500 dark:text-slate-400">Students find published quizzes under Explore → Quizzes.</p>
            {list === null ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
            ) : list.length === 0 && !error ? (
              <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-xs text-slate-500 dark:border-slate-700">
                <p>No quizzes created yet.</p>
                <div className="mt-3 flex justify-center gap-2">
                  <button type="button" onClick={() => void openEditor(null)} className="rounded-xl bg-[#2563EB] px-4 py-2 font-bold text-white hover:bg-blue-700 cursor-pointer">
                    Create first quiz
                  </button>
                  <Link href="/admin/ai-studio?tab=quiz" className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer">
                    Generate with AI
                  </Link>
                </div>
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
          </>
        )}

        {/* ── TAB 2: QUIZ TEMPLATES ────────────────────────────────────── */}
        {activeTab === "templates" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Templates saved from <strong>AI Studio</strong> or created manually. You can load any template into the quiz editor or publish it directly with 1 click.
              </p>
              <Link
                href="/admin/ai-studio?tab=quiz"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:underline cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" /> Generate new template in AI Studio →
              </Link>
            </div>

            {templates === null ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading templates…</div>
            ) : templates.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-xs text-slate-500 dark:border-slate-700">
                <Layers className="mx-auto h-8 w-8 text-slate-400" />
                <p className="mt-2 font-bold text-slate-700 dark:text-slate-200">No quiz templates saved yet</p>
                <p className="mt-1 text-slate-400">Go to AI Studio to generate and save quiz questions as reusable templates.</p>
                <Link
                  href="/admin/ai-studio?tab=quiz"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 font-bold text-white hover:bg-blue-700 cursor-pointer"
                >
                  <Wand2 className="h-4 w-4" /> Go to AI Studio Quiz Generator
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {templates.map((t) => (
                  <div
                    key={t.id}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-surface-secondary"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-[#2563EB] dark:bg-blue-950/50 dark:text-blue-300">
                          {t.questionCount} questions
                        </span>
                        {t.difficulty && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              t.difficulty === "EASY"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                                : t.difficulty === "HARD"
                                ? "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300"
                                : "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
                            }`}
                          >
                            {t.difficulty}
                          </span>
                        )}
                      </div>

                      <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                        {t.title}
                      </h3>
                      {t.description && (
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                          {t.description}
                        </p>
                      )}
                      {(t.courseTitle || t.topic) && (
                        <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-slate-400">
                          {t.courseTitle && <span className="rounded bg-slate-100 px-2 py-0.5 dark:bg-slate-800">{t.courseTitle}</span>}
                          {t.topic && <span className="rounded bg-slate-100 px-2 py-0.5 dark:bg-slate-800">{t.topic}</span>}
                        </div>
                      )}
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => void loadTemplateIntoEditor(t.id)}
                          disabled={busy === t.id}
                          className="inline-flex items-center gap-1 rounded-lg bg-[#2563EB] px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-60 cursor-pointer"
                          title="Open in editor to customize or schedule"
                        >
                          <Pencil className="h-3 w-3" /> Use
                        </button>
                        <button
                          type="button"
                          onClick={() => void publishFromTemplate(t.id)}
                          disabled={busy === t.id}
                          className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 disabled:opacity-60 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 cursor-pointer"
                          title="1-click Publish to Explore Quizzes"
                        >
                          <Rocket className="h-3 w-3" /> Publish
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => void openPreview(t.id)}
                          disabled={busy === t.id}
                          className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
                          title="Preview questions"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => void removeTemplate(t)}
                          disabled={busy === t.id}
                          className="rounded-lg border border-rose-200 p-1.5 text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:hover:bg-rose-950/30 cursor-pointer"
                          title="Delete template"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6">
          <div className="relative w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-surface-secondary sm:p-7">
            <button type="button" onClick={() => setEditing(null)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer" aria-label="Close"><X className="h-4 w-4" /></button>

            <div className="flex flex-wrap items-center justify-between gap-3 pr-8">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">{editing.id ? "Edit quiz" : "New quiz"}</h2>

              {/* Template Picker Button */}
              {templates && templates.length > 0 && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setTemplatePickerOpen((o) => !o)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#2563EB] hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300 cursor-pointer"
                  >
                    <Layers className="h-3.5 w-3.5" /> Load from Template
                  </button>

                  {templatePickerOpen && (
                    <div className="absolute right-0 top-full z-20 mt-1 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-surface-elevated max-h-60 overflow-y-auto">
                      <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Select a template</p>
                      {templates.map((tpl) => (
                        <button
                          key={tpl.id}
                          type="button"
                          onClick={() => void loadTemplateIntoEditor(tpl.id)}
                          className="flex w-full flex-col items-start rounded-xl p-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{tpl.title}</span>
                          <span className="text-[10.5px] text-slate-400">{tpl.questionCount} questions {tpl.difficulty ? `· ${tpl.difficulty}` : ""}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

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
              {editing.quiz.questions.map((q, i) => {
                const isMulti = q.multipleAnswers === true;
                return (
                  <div key={q.id} className="space-y-2 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Question {i + 1}</span>
                        <button
                          type="button"
                          onClick={() => patchQuestion(i, { multipleAnswers: !isMulti })}
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold cursor-pointer ${
                            isMulti
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                          }`}
                        >
                          {isMulti ? "Multiple Answers" : "Single Choice"} (Switch)
                        </button>
                      </div>
                      {editing.quiz.questions.length > 1 && (
                        <button type="button" onClick={() => patchQuiz({ questions: editing.quiz.questions.filter((_, idx) => idx !== i) })} className="text-slate-400 hover:text-rose-500 cursor-pointer" title="Delete question"><Trash2 className="h-3.5 w-3.5" /></button>
                      )}
                    </div>
                    <textarea rows={2} className={inputCls} value={q.prompt} onChange={(e) => patchQuestion(i, { prompt: e.target.value })} placeholder="Write the question" />
                    <div className="space-y-1.5">
                      {q.choices.map((c, ci) => {
                        const isChecked = isMulti
                          ? (q.correctIndices || [q.correctIndex]).includes(ci)
                          : q.correctIndex === ci;

                        return (
                          <div key={ci} className="flex items-center gap-2">
                            <input
                              type={isMulti ? "checkbox" : "radio"}
                              name={`correct-${q.id}`}
                              className={isMulti ? "accent-purple-600 h-4 w-4 cursor-pointer" : "accent-emerald-600 h-4 w-4 cursor-pointer"}
                              checked={isChecked}
                              onChange={() => {
                                if (isMulti) {
                                  const currentList = q.correctIndices || [q.correctIndex];
                                  const next = currentList.includes(ci)
                                    ? currentList.filter((idx) => idx !== ci)
                                    : [...currentList, ci];
                                  if (next.length === 0) return;
                                  patchQuestion(i, { correctIndices: next, correctIndex: next[0] });
                                } else {
                                  patchQuestion(i, { correctIndex: ci, correctIndices: [ci] });
                                }
                              }}
                              title={isMulti ? "Mark as one of the correct options" : "Mark as the correct option"}
                            />
                            <input className={inputCls} value={c} onChange={(e) => patchQuestion(i, { choices: q.choices.map((x, xi) => (xi === ci ? e.target.value : x)) })} placeholder={`Option ${ci + 1}`} />
                            {q.choices.length > 2 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const nextChoices = q.choices.filter((_, xi) => xi !== ci);
                                  const nextCorrectIndices = (q.correctIndices || [q.correctIndex])
                                    .filter((idx) => idx !== ci)
                                    .map((idx) => (idx > ci ? idx - 1 : idx));
                                  const nextPrimary = nextCorrectIndices.length > 0 ? nextCorrectIndices[0] : 0;
                                  patchQuestion(i, {
                                    choices: nextChoices,
                                    correctIndices: nextCorrectIndices.length > 0 ? nextCorrectIndices : [0],
                                    correctIndex: nextPrimary,
                                  });
                                }}
                                className="text-slate-400 hover:text-rose-500 cursor-pointer"
                                title="Remove option"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                      {q.choices.length < 6 && (
                        <button type="button" onClick={() => patchQuestion(i, { choices: [...q.choices, ""] })} className="text-[11px] font-bold text-[#2563EB] cursor-pointer">+ Add option</button>
                      )}
                    </div>
                    <input className={inputCls} value={q.explanation ?? ""} onChange={(e) => patchQuestion(i, { explanation: e.target.value })} placeholder="Explanation shown after submitting (optional)" />
                  </div>
                );
              })}
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

      {/* Template Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6">
          <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-surface-secondary sm:p-7">
            <button type="button" onClick={() => setPreviewTemplate(null)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer" aria-label="Close"><X className="h-4 w-4" /></button>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">{previewTemplate.title}</h2>
            <p className="mt-1 text-xs text-slate-500">{previewTemplate.description || "Quiz template preview"}</p>

            <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {previewTemplate.questions.map((q, idx) => (
                <div key={q.id || idx} className="rounded-xl border border-slate-200 p-3.5 dark:border-slate-700 text-xs">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span>Q{idx + 1} {q.multipleAnswers ? "· Multiple Answers" : "· Single Choice"}</span>
                    <span>{q.maxPoints ?? 1} marks</span>
                  </div>
                  <p className="mt-1 font-semibold text-slate-900 dark:text-white">{q.prompt}</p>
                  {q.choices && (
                    <ul className="mt-2 space-y-1">
                      {q.choices.map((c, ci) => {
                        const isCorrect = q.multipleAnswers
                          ? (q.correctAnswers || [q.correctAnswer]).includes(ci)
                          : q.correctAnswer === ci;
                        return (
                          <li
                            key={ci}
                            className={`flex items-center gap-1.5 rounded-lg px-2 py-1 ${
                              isCorrect ? "font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300" : "text-slate-600 dark:text-slate-300"
                            }`}
                          >
                            <span>{isCorrect ? "✓" : "•"}</span>
                            <span>{c}</span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                  {q.explanation && (
                    <p className="mt-2 text-[11px] text-slate-500 italic">Explanation: {q.explanation}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const tId = previewTemplate.id;
                  setPreviewTemplate(null);
                  void loadTemplateIntoEditor(tId);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
              >
                <Pencil className="h-3.5 w-3.5" /> Use this Template
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

export default function AdminQuizzesPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading quizzes...</div>}>
      <AdminQuizzesContent />
    </React.Suspense>
  );
}
