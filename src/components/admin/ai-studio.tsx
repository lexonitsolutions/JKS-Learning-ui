"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Copy, Loader2, Save, Sparkles, Wand2 } from "lucide-react";
import {
  fetchAiHealth,
  fetchAiUsage,
  generateCurriculum,
  generateQuizQuestions,
  type AiHealth,
  type AiUsage,
  type GeneratedCurriculum,
  type GeneratedQuestion,
} from "@/lib/data/ai-api";
import { getStoredCourses } from "@/lib/data/courses-store";
import type { TaskQuestion } from "@/lib/data/tasks-api";
import { createTemplate } from "@/lib/data/assessment-templates-api";
import { CODING_LANGUAGE_OPTIONS } from "@/lib/utils/coding-question";

const CARD =
  "rounded-[20px] border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800/80 dark:bg-surface-secondary sm:p-6";
const INPUT =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-surface-elevated dark:text-white";
const BTN =
  "inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60";

type Tab = "questions" | "curriculum" | "status";

const errMsg = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong. Please try again.");

function ErrorBox({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300"
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

function toTaskQuestion(q: GeneratedQuestion, idx: number): TaskQuestion {
  const base = { id: `ai-q-${Date.now()}-${idx}`, maxPoints: q.marks || 5, explanation: q.explanation };
  if (q.type === "MCQ" && q.options?.length) {
    const correct = q.options.findIndex((o) => o === q.correctAnswer);
    return { ...base, type: "MCQ", prompt: q.question, choices: q.options, correctAnswer: correct >= 0 ? correct : 0 };
  }
  if (q.type === "CODING") {
    // Everything coding-specific is kept: language, partly-complete starter code,
    // instructions, tests (including which are hidden) and the reference solution.
    return {
      ...base,
      type: "CODING",
      prompt: q.question,
      language: q.language,
      starterCode: q.starterCode ?? "",
      instructions: q.instructions,
      testCases: q.testCases ?? [],
      referenceSolution: q.referenceSolution,
    };
  }
  return { ...base, type: "SHORT_ANSWER", prompt: q.question, modelAnswer: q.correctAnswer || q.explanation };
}

/** The "Medium" question type is stored as SHORT_ANSWER so existing records keep their meaning. */
const TYPE_LABEL: Record<GeneratedQuestion["type"], string> = {
  MCQ: "MCQ",
  SHORT_ANSWER: "Medium",
  CODING: "Coding",
};

/* ── Question generator ─────────────────────────────────────────────── */
function QuestionGenerator({ basePath }: { basePath: "admin" | "instructor" }) {
  const [courses, setCourses] = useState<{ id: string; title: string }[]>([]);
  const [courseTitle, setCourseTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("MEDIUM");
  const [mcq, setMcq] = useState(3);
  const [medium, setMedium] = useState(2);
  const [coding, setCoding] = useState(1);
  const [codingLanguage, setCodingLanguage] = useState("");
  const [warnings, setWarnings] = useState<string[]>([]);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<GeneratedQuestion[] | null>(null);
  const [title, setTitle] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Courses live in localStorage, which is only readable after mount.
    void Promise.resolve().then(() => {
      const list = getStoredCourses().map((c) => ({ id: c.id, title: c.title }));
      setCourses(list);
      if (list[0]) setCourseTitle((cur) => cur || list[0].title);
    });
  }, []);

  const total = mcq + medium + coding;

  async function run() {
    if (!courseTitle.trim() || !topic.trim()) {
      setError("Enter a course and a topic first.");
      return;
    }
    if (total < 1 || total > 15) {
      setError("Choose between 1 and 15 questions in total.");
      return;
    }
    setBusy(true);
    setError(null);
    setSaved(false);
    setSavedId(null);
    setWarnings([]);
    try {
      const res = await generateQuizQuestions({
        courseTitle: courseTitle.trim(),
        topic: topic.trim(),
        difficulty,
        mcqCount: mcq,
        mediumCount: medium,
        codingCount: coding,
        codingLanguage: codingLanguage || undefined,
      });
      setQuestions(res.questions);
      setWarnings(res.warnings ?? []);
      setTitle(`${topic.trim()} - AI draft`);
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    if (!questions?.length || !title.trim() || saving) return;
    setSaving(true);
    setError(null);
    try {
      const course = courses.find((c) => c.title === courseTitle);
      const saved = await createTemplate({
        title: title.trim(),
        description: `AI-generated ${difficulty.toLowerCase()} questions on ${topic.trim()}. Review before assigning.`,
        // Only a real database id can be linked; otherwise the title is kept as text.
        courseId: course && /^[a-f0-9]{24}$/i.test(course.id) ? course.id : undefined,
        courseTitle: courseTitle.trim(),
        topic: topic.trim(),
        difficulty,
        questions: questions.map(toTaskQuestion),
      });
      setSaved(true);
      setSavedId(saved.id);
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setSaving(false);
    }
  }

  const num = (v: string) => Math.max(0, Math.min(10, Number(v) || 0));

  return (
    <div className="space-y-5">
      <div className={CARD}>
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Generate assessment questions</h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Drafts are saved as assessment templates for you to review and edit before assigning them to learners.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
            Course
            <input
              className={`${INPUT} mt-1.5`}
              list="ai-studio-courses"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              placeholder="e.g. Java Full Stack"
            />
            <datalist id="ai-studio-courses">
              {courses.map((c) => (
                <option key={c.id} value={c.title} />
              ))}
            </datalist>
          </label>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
            Topic
            <input
              className={`${INPUT} mt-1.5`}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Collections framework"
              maxLength={120}
            />
          </label>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
            Difficulty
            <select className={`${INPUT} mt-1.5`} value={difficulty} onChange={(e) => setDifficulty(e.target.value as typeof difficulty)}>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(
              [
                ["MCQ", mcq, setMcq],
                ["Medium", medium, setMedium],
                ["Coding", coding, setCoding],
              ] as const
            ).map(([label, value, set]) => (
              <label key={label} className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
                {label}
                <input
                  type="number"
                  min={0}
                  max={10}
                  className={`${INPUT} mt-1.5`}
                  value={value}
                  onChange={(e) => set(num(e.target.value))}
                />
              </label>
            ))}
          </div>
        </div>
        {coding > 0 && (
          <label className="mt-4 block max-w-xs text-xs font-semibold text-slate-600 dark:text-slate-300">
            Coding language
            <select className={`${INPUT} mt-1.5`} value={codingLanguage} onChange={(e) => setCodingLanguage(e.target.value)}>
              <option value="">Detect from course and topic</option>
              {CODING_LANGUAGE_OPTIONS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
          </label>
        )}
        <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
          <strong>Medium</strong> questions ask for a written answer of a few sentences. Coding questions come with
          partly-complete starter code, tests and a reference solution that students never see.
        </p>
        {error && <ErrorBox message={error} />}
        <button type="button" className={`${BTN} mt-5`} onClick={run} disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
          {busy ? "Generating…" : `Generate ${total} question${total === 1 ? "" : "s"}`}
        </button>
      </div>

      {questions && (
        <div className={CARD}>
          <div className="flex flex-wrap items-end gap-3">
            <label className="min-w-[220px] flex-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
              Template name
              <input className={`${INPUT} mt-1.5`} value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} />
            </label>
            <button type="button" className={BTN} onClick={save} disabled={saved || saving || !title.trim()}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              {saving ? "Saving…" : saved ? "Saved" : "Save as template"}
            </button>
          </div>
          {saved && savedId && (
            <p role="status" className="mt-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              Saved. Find it under{" "}
              <Link
                href={basePath === "admin" ? "/admin/assessments?view=ai" : "/instructor/assessments?view=ai"}
                className="underline underline-offset-2"
              >
                Assessments → AI Assessments
              </Link>{" "}
              to review it, create an assessment and assign students.
            </p>
          )}
          {warnings.length > 0 && (
            <ul className="mt-3 space-y-1" role="status">
              {warnings.map((w) => (
                <li key={w} className="flex items-start gap-1.5 text-xs text-amber-700 dark:text-amber-300">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {w}
                </li>
              ))}
            </ul>
          )}
          <ol className="mt-5 space-y-4">
            {questions.map((q, i) => (
              <li key={q.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                <div className="flex items-center justify-between gap-3 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  <span>
                    Q{i + 1} · {TYPE_LABEL[q.type]}
                    {q.type === "CODING" && q.language ? ` · ${q.language}` : ""}
                  </span>
                  <span>{q.marks} marks</span>
                </div>
                <p className="mt-1.5 text-sm font-semibold text-slate-900 dark:text-white">{q.question}</p>
                {q.options && (
                  <ul className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    {q.options.map((o) => (
                      <li key={o} className={o === q.correctAnswer ? "font-bold text-emerald-600 dark:text-emerald-400" : ""}>
                        {o === q.correctAnswer ? "✓ " : "• "}
                        {o}
                      </li>
                    ))}
                  </ul>
                )}
                {q.type !== "MCQ" && q.correctAnswer && (
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-semibold">Model answer: </span>
                    {q.correctAnswer}
                  </p>
                )}
                {q.instructions && (
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-semibold">Student must: </span>
                    {q.instructions}
                  </p>
                )}
                {q.starterCode && (
                  <>
                    <p className="mt-2 text-[10.5px] font-bold uppercase tracking-wide text-slate-400">Starter code (shown to student)</p>
                    <pre className="mt-1 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-[11px] text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">{q.starterCode}</pre>
                  </>
                )}
                {q.testCases && q.testCases.length > 0 && (
                  <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                    {q.testCases.length} test cases ({q.testCases.filter((t) => t.hidden).length} hidden from students)
                  </p>
                )}
                {q.referenceSolution && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      Reference solution (staff only)
                    </summary>
                    <pre className="mt-1 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-[11px] text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">{q.referenceSolution}</pre>
                  </details>
                )}
                {q.explanation && <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">{q.explanation}</p>}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

/* ── Curriculum designer ────────────────────────────────────────────── */
function CurriculumDesigner() {
  const [courseTitle, setCourseTitle] = useState("");
  const [audience, setAudience] = useState("Beginners");
  const [weeks, setWeeks] = useState(8);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<GeneratedCurriculum | null>(null);
  const [copied, setCopied] = useState(false);

  async function run() {
    if (!courseTitle.trim() || !audience.trim()) {
      setError("Enter a course title and target audience.");
      return;
    }
    setBusy(true);
    setError(null);
    setCopied(false);
    try {
      setPlan(await generateCurriculum({ courseTitle: courseTitle.trim(), targetAudience: audience.trim(), durationWeeks: weeks }));
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setBusy(false);
    }
  }

  async function copy() {
    if (!plan) return;
    const text = plan.modules
      .map(
        (m, i) =>
          `Module ${i + 1}: ${m.title}\n${m.description}\n` +
          m.lessons.map((l) => `  - ${l.title} (${l.contentType.toLowerCase()}, ${l.durationMinutes} min)`).join("\n"),
      )
      .join("\n\n");
    try {
      await navigator.clipboard.writeText(`${plan.courseTitle} - ${plan.durationWeeks} weeks\n\n${text}`);
      setCopied(true);
    } catch {
      setError("Could not copy to the clipboard.");
    }
  }

  return (
    <div className="space-y-5">
      <div className={CARD}>
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Design a curriculum</h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Get a module-by-module outline to refine in the Syllabus or Courses pages.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
            Course title
            <input className={`${INPUT} mt-1.5`} value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} maxLength={120} placeholder="e.g. Java Full Stack" />
          </label>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
            Target audience
            <input className={`${INPUT} mt-1.5`} value={audience} onChange={(e) => setAudience(e.target.value)} maxLength={120} />
          </label>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
            Duration (weeks)
            <input
              type="number"
              min={1}
              max={52}
              className={`${INPUT} mt-1.5`}
              value={weeks}
              onChange={(e) => setWeeks(Math.max(1, Math.min(52, Number(e.target.value) || 1)))}
            />
          </label>
        </div>
        {error && <ErrorBox message={error} />}
        <button type="button" className={`${BTN} mt-5`} onClick={run} disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
          {busy ? "Designing…" : "Generate curriculum"}
        </button>
      </div>

      {plan && (
        <div className={CARD}>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {plan.courseTitle} · {plan.durationWeeks} weeks
            </h3>
            <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-surface-hover">
              {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy outline"}
            </button>
          </div>
          <ol className="mt-4 space-y-4">
            {plan.modules.map((m, i) => (
              <li key={`${m.title}-${i}`} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Module {i + 1}: {m.title}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{m.description}</p>
                <ul className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  {m.lessons.map((l, j) => (
                    <li key={`${l.title}-${j}`} className="flex justify-between gap-3">
                      <span>{l.title}</span>
                      <span className="shrink-0 text-slate-400">
                        {l.contentType.toLowerCase()} · {l.durationMinutes} min
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

/* ── Status (admin only) ────────────────────────────────────────────── */
function StatusPanel() {
  const [health, setHealth] = useState<AiHealth | null>(null);
  const [usage, setUsage] = useState<AiUsage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchAiHealth(), fetchAiUsage()])
      .then(([h, u]) => {
        if (cancelled) return;
        setHealth(h);
        setUsage(u);
        setError(null);
      })
      .catch((e: unknown) => !cancelled && setError(errMsg(e)))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const load = () => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  };

  const tone = (s: string) =>
    s === "healthy" ? "text-emerald-600 dark:text-emerald-400" : s === "unconfigured" ? "text-slate-400" : "text-rose-600 dark:text-rose-400";

  return (
    <div className="space-y-5">
      <div className={CARD}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">AI providers</h2>
          <button type="button" onClick={load} disabled={loading} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-surface-hover">
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Re-test
          </button>
        </div>
        {error && <ErrorBox message={error} />}
        {health && (
          <>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Overall:{" "}
              <span className={health.overallStatus === "OPERATIONAL" ? "font-bold text-emerald-600" : "font-bold text-rose-600"}>
                {health.overallStatus}
              </span>
            </p>
            <ul className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
              {health.providers.map((p) => (
                <li key={p.provider} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm">
                  <span className="font-semibold capitalize text-slate-900 dark:text-white">{p.provider}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{p.model ?? p.error ?? ""}</span>
                  <span className={`text-xs font-bold uppercase ${tone(p.status)}`}>
                    {p.status}
                    {p.status === "healthy" ? ` · ${p.latencyMs}ms` : ""}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {usage && (
        <div className={CARD}>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Usage this month</h2>
          <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["Requests today", usage.requestsToday],
              ["Requests (month)", usage.requestsThisMonth],
              ["Failed", `${usage.failedRequests} (${usage.errorRatePercent}%)`],
              ["Avg latency", `${usage.averageLatencyMs}ms`],
              ["Fallback used", `${usage.fallbackUsageCount} (${usage.fallbackRatePercent}%)`],
              ["Tokens", usage.totalTokensThisMonth.toLocaleString()],
            ].map(([k, v]) => (
              <div key={String(k)} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                <dt className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{k}</dt>
                <dd className="mt-0.5 text-lg font-extrabold text-slate-900 dark:text-white">{v}</dd>
              </div>
            ))}
          </dl>
          {usage.featureBreakdown.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {usage.featureBreakdown.map((f) => (
                <li key={f.feature} className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600 dark:bg-surface-elevated dark:text-slate-300">
                  {f.feature}: {f.count}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export function AiStudio({ isAdmin }: { isAdmin: boolean }) {
  const [tab, setTab] = useState<Tab>("questions");
  const tabs: { id: Tab; label: string }[] = [
    { id: "questions", label: "Question generator" },
    { id: "curriculum", label: "Curriculum designer" },
    ...(isAdmin ? [{ id: "status" as Tab, label: "Status & usage" }] : []),
  ];
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-surface-secondary">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition-colors ${
              tab === t.id
                ? "bg-[#2563EB] text-white"
                : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-surface-hover"
            }`}
          >
            {t.id !== "status" && <Sparkles className="h-3.5 w-3.5" />}
            {t.label}
          </button>
        ))}
      </div>
      {tab === "questions" && <QuestionGenerator basePath={isAdmin ? "admin" : "instructor"} />}
      {tab === "curriculum" && <CurriculumDesigner />}
      {tab === "status" && isAdmin && <StatusPanel />}
    </div>
  );
}
