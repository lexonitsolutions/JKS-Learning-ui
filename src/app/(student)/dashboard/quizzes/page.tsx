"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Loader2,
  RotateCcw,
  Trophy,
  XCircle,
} from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import {
  listQuizzes,
  submitQuiz,
  takeQuiz,
  type QuizResult,
  type StudentQuizSummary,
  type TakeQuiz,
} from "@/lib/data/explore-quizzes-api";

const errMsg = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong. Please try again.");

export default function StudentQuizzesPage() {
  const [quizzes, setQuizzes] = useState<StudentQuizSummary[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [category, setCategory] = useState("All");

  const [active, setActive] = useState<TakeQuiz | null>(null);
  const [starting, setStarting] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [current, setCurrent] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setQuizzes(await listQuizzes());
      setLoadError(null);
    } catch (e) {
      setLoadError(errMsg(e));
      setQuizzes([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    (quizzes ?? []).forEach((q) => q.category && set.add(q.category));
    return ["All", ...Array.from(set).sort()];
  }, [quizzes]);

  const visible = (quizzes ?? []).filter((q) => category === "All" || q.category === category);

  const start = async (id: string) => {
    setStarting(id);
    setActionError(null);
    try {
      const q = await takeQuiz(id);
      setActive(q);
      setAnswers({});
      setCurrent(0);
      setResult(null);
      setSecondsLeft(q.timeLimitMinutes ? q.timeLimitMinutes * 60 : null);
    } catch (e) {
      setActionError(errMsg(e));
    } finally {
      setStarting(null);
    }
  };

  const finish = useCallback(async () => {
    if (!active || submitting) return;
    setSubmitting(true);
    setActionError(null);
    try {
      setResult(await submitQuiz(active.id, answers));
      setSecondsLeft(null);
      void load();
    } catch (e) {
      setActionError(errMsg(e));
    } finally {
      setSubmitting(false);
    }
  }, [active, answers, load, submitting]);

  // Countdown; the quiz is submitted as it is when time runs out.
  useEffect(() => {
    if (secondsLeft === null || result) return;
    if (secondsLeft <= 0) {
      void finish();
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => (s === null ? s : s - 1)), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft, result, finish]);

  const close = () => {
    setActive(null);
    setResult(null);
    setSecondsLeft(null);
  };

  // ── Taking a quiz ───────────────────────────────────────────────────
  if (active && !result) {
    const q = active.questions[current];
    const answered = Object.keys(answers).length;
    const mm = secondsLeft !== null ? String(Math.floor(secondsLeft / 60)).padStart(2, "0") : null;
    const ss = secondsLeft !== null ? String(secondsLeft % 60).padStart(2, "0") : null;
    return (
      <>
        <DashboardTopbar title={active.title} subtitle={active.category ?? "Quiz"} />
        <div className="mx-auto w-full max-w-3xl flex-1 space-y-5 p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between gap-3 text-xs font-bold text-slate-600 dark:text-slate-300">
            <span>
              Question {current + 1} of {active.questions.length} · {answered} answered
            </span>
            {mm && (
              <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 ${secondsLeft! <= 60 ? "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300" : "bg-slate-100 dark:bg-slate-800"}`}>
                <Clock className="h-3.5 w-3.5" /> {mm}:{ss}
              </span>
            )}
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div className="h-full bg-[#2563EB] transition-all" style={{ width: `${((current + 1) / active.questions.length) * 100}%` }} />
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-surface-secondary sm:p-7">
            <h2 className="whitespace-pre-wrap text-base font-extrabold text-slate-900 dark:text-white">{q.prompt}</h2>
            <div className="mt-5 space-y-2.5">
              {q.options.map((o) => {
                const selected = answers[q.id] === o.index;
                return (
                  <button
                    key={o.index}
                    type="button"
                    onClick={() => setAnswers((a) => ({ ...a, [q.id]: o.index }))}
                    className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-colors cursor-pointer ${
                      selected
                        ? "border-[#2563EB] bg-blue-50 text-blue-900 dark:bg-blue-950/40 dark:text-blue-100"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${selected ? "border-[#2563EB] bg-[#2563EB]" : "border-slate-300"}`}>
                      {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </span>
                    <span>{o.text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {actionError && <p role="alert" className="text-xs font-semibold text-rose-600">{actionError}</p>}

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Previous
            </button>
            {current < active.questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrent((c) => c + 1)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
              >
                Next <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void finish()}
                disabled={submitting || answered < active.questions.length}
                title={answered < active.questions.length ? "Answer every question to submit" : undefined}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
              >
                {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />} Submit quiz
              </button>
            )}
          </div>
          <button type="button" onClick={close} className="text-xs font-semibold text-slate-500 underline cursor-pointer">
            Leave quiz
          </button>
        </div>
      </>
    );
  }

  // ── Result ──────────────────────────────────────────────────────────
  if (active && result) {
    return (
      <>
        <DashboardTopbar title={result.title} subtitle="Quiz result" />
        <div className="mx-auto w-full max-w-3xl flex-1 space-y-5 p-4 sm:p-6 lg:p-8">
          <div className={`rounded-3xl border p-6 text-center ${result.passed ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/20" : "border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20"}`}>
            <Trophy className={`mx-auto h-8 w-8 ${result.passed ? "text-emerald-600" : "text-amber-600"}`} />
            <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">{result.percent}%</p>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              {result.correct} of {result.total} correct · pass mark {result.passPercent}%
            </p>
            <p className="mt-2 text-sm font-extrabold">{result.passed ? "Passed" : "Not passed yet - try again"}</p>
          </div>

          <div className="space-y-3">
            {result.breakdown.map((b, i) => (
              <div key={b.id} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-800 dark:bg-surface-secondary">
                <div className="flex items-start gap-2">
                  {b.correct ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />}
                  <p className="font-bold text-slate-900 dark:text-white">
                    {i + 1}. {b.prompt}
                  </p>
                </div>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                  Your answer: <strong>{b.chosenIndex === null ? "Not answered" : b.choices[b.chosenIndex]}</strong>
                </p>
                {!b.correct && (
                  <p className="text-xs text-emerald-700 dark:text-emerald-400">
                    Correct answer: <strong>{b.choices[b.correctIndex]}</strong>
                  </p>
                )}
                {b.explanation && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{b.explanation}</p>}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => void start(active.id)} className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer">
              <RotateCcw className="h-3.5 w-3.5" /> Try again
            </button>
            <button type="button" onClick={close} className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 dark:border-slate-700 dark:text-slate-200 cursor-pointer">
              Back to quizzes
            </button>
          </div>
        </div>
      </>
    );
  }

  // ── List ────────────────────────────────────────────────────────────
  return (
    <>
      <DashboardTopbar title="Quizzes" subtitle="Practice quizzes published by JKS Learning. Take them any time." />
      <div className="flex-1 space-y-6 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4">
        {categories.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold cursor-pointer ${
                  category === c
                    ? "border border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300"
                    : "border border-transparent bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 dark:bg-surface-elevated dark:text-slate-300"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {actionError && <p role="alert" className="text-xs font-semibold text-rose-600">{actionError}</p>}
        {loadError && <p role="alert" className="text-xs font-semibold text-rose-600">{loadError}</p>}

        {quizzes === null ? (
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading quizzes…</div>
        ) : visible.length === 0 && !loadError ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
            <ClipboardCheck className="mx-auto h-8 w-8 text-slate-400" />
            <p className="mt-2 text-sm font-bold text-slate-700 dark:text-slate-200">No quizzes yet</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">New quizzes appear here as soon as they are published.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((q) => (
              <div key={q.id} className="flex flex-col justify-between rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-surface-secondary">
                <div>
                  {q.category && <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#2563EB] dark:bg-blue-950/50 dark:text-blue-300">{q.category}</span>}
                  <h3 className="mt-2 text-base font-extrabold text-slate-900 dark:text-white">{q.title}</h3>
                  {q.description && <p className="mt-1 line-clamp-3 text-xs text-slate-500 dark:text-slate-400">{q.description}</p>}
                  <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    <span>{q.questionCount} questions</span>
                    <span>Pass {q.passPercent}%</span>
                    {q.timeLimitMinutes && <span>{q.timeLimitMinutes} min</span>}
                  </p>
                  {q.myAttempts > 0 && (
                    <p className={`mt-3 text-[11px] font-bold ${q.myPassed ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                      {q.myPassed ? "Passed" : "Attempted"} · best {q.myBestPercent}% · {q.myAttempts} {q.myAttempts === 1 ? "attempt" : "attempts"}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => void start(q.id)}
                  disabled={starting === q.id}
                  className="mt-5 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#2563EB] py-2.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-60 cursor-pointer"
                >
                  {starting === q.id && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {q.myAttempts > 0 ? "Take again" : "Start quiz"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
