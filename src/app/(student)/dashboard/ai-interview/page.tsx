"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrainCircuit, Loader2, Send, History, ArrowRight, AlertTriangle, Clock, X } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Reveal } from "@/lib/motion/reveal";
import { FeatureAccessGate, useFeatureAccess } from "@/components/common/feature-access-gate";
import { VoiceAnswerButton } from "@/components/ai-interview/voice-answer-button";
import {
  completeInterview,
  fetchMyInterviews,
  startInterview,
  submitInterviewAnswer,
  type InterviewSessionSummary,
  type InterviewType,
} from "@/lib/data/ai-api";

const CARD =
  "rounded-[20px] border border-white/70 bg-white/80 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary/90 dark:shadow-none";
const INPUT =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-surface-elevated dark:text-white";

// Suggestions only - students may type any technology they know.
const TECH_SUGGESTIONS = [
  "Java",
  "Python",
  "React",
  "React Native",
  "Node.js",
  "JavaScript",
  "TypeScript",
  "Spring Boot",
  "SQL",
  "SAP ABAP",
  "System Design",
];
const MAX_TECHNOLOGIES = 10;
const EXPERIENCE_LEVELS: { value: string; hint: string }[] = [
  { value: "Beginner", hint: "Learning the fundamentals" },
  { value: "Intermediate", hint: "Comfortable building real features" },
  { value: "Advanced", hint: "Deep, production-level experience" },
];
const TYPES: { value: InterviewType; label: string; hint: string }[] = [
  { value: "TECHNICAL", label: "Technical", hint: "Concepts & problem solving" },
  { value: "SCENARIO", label: "Scenario", hint: "Real-world design cases" },
  { value: "HR", label: "HR", hint: "Behavioural & culture fit" },
  { value: "EXPERIENCE", label: "Experience", hint: "Your past projects" },
];
const TOTAL_QUESTIONS = 5;

type Phase = "setup" | "interview" | "finishing";

function errMsg(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong. Please try again.";
}

export default function AiInterviewPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("setup");
  const access = useFeatureAccess("AI_MOCK_INTERVIEW");
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");
  const [experience, setExperience] = useState(EXPERIENCE_LEVELS[0].value);
  const technology = technologies.join(", ");
  const [type, setType] = useState<InterviewType>("TECHNICAL");

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [history, setHistory] = useState<InterviewSessionSummary[] | null>(null);
  const answerRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetchMyInterviews()
      .then((h) => !cancelled && setHistory(h))
      .catch(() => !cancelled && setHistory([]));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (phase === "interview" && !busy) answerRef.current?.focus();
  }, [phase, busy, question]);

  function addTechnologies(raw: string) {
    const parts = raw
      .split(",")
      .map((t) => t.trim().slice(0, 40))
      .filter(Boolean);
    if (parts.length === 0) return;
    setTechnologies((prev) => {
      const next = [...prev];
      for (const p of parts) {
        if (next.length >= MAX_TECHNOLOGIES) break;
        if (!next.some((t) => t.toLowerCase() === p.toLowerCase())) next.push(p);
      }
      return next;
    });
    setTechInput("");
  }

  async function handleStart() {
    // Include text typed but not yet confirmed with Enter.
    const pending = techInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const all = [...technologies];
    for (const p of pending) {
      if (!all.some((t) => t.toLowerCase() === p.toLowerCase())) all.push(p);
    }
    const finalTech = all.slice(0, MAX_TECHNOLOGIES).join(", ");
    if (!finalTech) {
      setError("Add at least one technology you know.");
      return;
    }
    setTechnologies(all.slice(0, MAX_TECHNOLOGIES));
    setTechInput("");
    setBusy(true);
    setError(null);
    try {
      const res = await startInterview({ technology: finalTech, experience, type });
      setSessionId(res.sessionId);
      setQuestion(res.question);
      setIndex(0);
      setAnswer("");
      setPhase("interview");
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  }

  async function finish(id: string) {
    setPhase("finishing");
    setError(null);
    try {
      await completeInterview(id);
      router.push(`/dashboard/ai-interview/report?id=${id}`);
    } catch (err) {
      setError(errMsg(err));
      setPhase("interview");
    }
  }

  async function handleSubmit() {
    if (!sessionId || !answer.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await submitInterviewAnswer(sessionId, question, answer.trim());
      const nextIndex = index + 1;
      if (nextIndex >= TOTAL_QUESTIONS) {
        await finish(sessionId);
        return;
      }
      setIndex(nextIndex);
      setQuestion(res.question);
      setAnswer("");
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <DashboardTopbar
        title="AI Mock Interview"
        subtitle="Practise with an adaptive AI interviewer and get an objective, scored report."
      />

      <div className="flex-1 space-y-6 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4">
        {phase === "setup" && (
          <>
            {access.state && !access.state.canUse && (
              <Reveal>
                <FeatureAccessGate
                  feature="AI_MOCK_INTERVIEW"
                  title="AI Mock Interview"
                  state={access.state}
                  onChanged={access.reload}
                />
              </Reveal>
            )}
            {access.error && <ErrorBox message={access.error} />}

            <Reveal>
              <div className={`${CARD} p-5 sm:p-7`}>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#2563EB] dark:bg-blue-950/50 dark:text-blue-400">
                    <BrainCircuit className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Start a new interview</h2>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                      {TOTAL_QUESTIONS} questions. Each question adapts to your previous answers, and your scored report is
                      generated at the end.
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="tech-input" className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Technologies you know
                  </label>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-2 focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-blue-500/20 dark:border-slate-700 dark:bg-surface-elevated">
                    {technologies.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#2563EB] dark:bg-blue-950/50 dark:text-blue-300"
                      >
                        {t}
                        <button
                          type="button"
                          aria-label={`Remove ${t}`}
                          onClick={() => setTechnologies((prev) => prev.filter((x) => x !== t))}
                          className="rounded p-0.5 hover:bg-blue-100 dark:hover:bg-blue-900/60"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      id="tech-input"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === ",") {
                          e.preventDefault();
                          addTechnologies(techInput);
                        } else if (e.key === "Backspace" && !techInput && technologies.length) {
                          setTechnologies((prev) => prev.slice(0, -1));
                        }
                      }}
                      onBlur={() => addTechnologies(techInput)}
                      disabled={technologies.length >= MAX_TECHNOLOGIES}
                      placeholder={technologies.length ? "Add another…" : "e.g. Java, React Native, SAP ABAP"}
                      className="min-w-[10rem] flex-1 bg-transparent px-1.5 py-1 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                    Type any technology and press Enter or comma. Up to {MAX_TECHNOLOGIES}.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {TECH_SUGGESTIONS.filter((t) => !technologies.some((x) => x.toLowerCase() === t.toLowerCase())).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => addTechnologies(t)}
                        className="rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:border-[#2563EB] hover:text-[#2563EB] dark:border-slate-700 dark:text-slate-300"
                      >
                        + {t}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="mt-5 text-xs font-semibold text-slate-600 dark:text-slate-300">Experience level</p>
                <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Experience level">
                  {EXPERIENCE_LEVELS.map((lvl) => (
                    <button
                      key={lvl.value}
                      type="button"
                      role="radio"
                      aria-checked={experience === lvl.value}
                      onClick={() => setExperience(lvl.value)}
                      className={`rounded-xl border p-3 text-left transition-colors ${
                        experience === lvl.value
                          ? "border-[#2563EB] bg-blue-50 dark:border-blue-500 dark:bg-blue-950/40"
                          : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-surface-elevated"
                      }`}
                    >
                      <span className="block text-sm font-bold text-slate-900 dark:text-white">{lvl.value}</span>
                      <span className="mt-0.5 block text-[11px] text-slate-500 dark:text-slate-400">{lvl.hint}</span>
                    </button>
                  ))}
                </div>

                <p className="mt-5 text-xs font-semibold text-slate-600 dark:text-slate-300">Interview type</p>
                <div className="mt-2 grid grid-cols-2 gap-3 lg:grid-cols-4">
                  {TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setType(t.value)}
                      className={`rounded-xl border p-3 text-left transition-colors ${
                        type === t.value
                          ? "border-[#2563EB] bg-blue-50 dark:border-blue-500 dark:bg-blue-950/40"
                          : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-surface-elevated"
                      }`}
                    >
                      <span className="block text-sm font-bold text-slate-900 dark:text-white">{t.label}</span>
                      <span className="mt-0.5 block text-[11px] text-slate-500 dark:text-slate-400">{t.hint}</span>
                    </button>
                  ))}
                </div>

                {error && <ErrorBox message={error} />}

                <button
                  type="button"
                  onClick={handleStart}
                  disabled={busy || !access.state?.canUse}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-60"
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  {busy ? "Preparing your interviewer…" : "Start interview"}
                </button>
              </div>
            </Reveal>

            <Reveal>
              <div className={`${CARD} p-5 sm:p-7`}>
                <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                  <History className="h-4 w-4 text-slate-400" /> Your previous interviews
                </h3>
                {history === null ? (
                  <p className="mt-3 text-sm text-slate-500">Loading…</p>
                ) : history.length === 0 ? (
                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                    You haven&apos;t taken an interview yet. Your reports will appear here.
                  </p>
                ) : (
                  <ul className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
                    {history.map((s) => (
                      <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {s.technology} · {s.type.charAt(0) + s.type.slice(1).toLowerCase()}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {s.experience} · {new Date(s.startedAt).toLocaleDateString()}
                          </p>
                        </div>
                        {s.report ? (
                          <Link
                            href={`/dashboard/ai-interview/report?id=${s.id}`}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-surface-hover"
                          >
                            Score {s.report.overallScore} · View report
                          </Link>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                            <Clock className="h-3.5 w-3.5" />
                            {s.status === "IN_PROGRESS" ? "Not finished" : "Interrupted"}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          </>
        )}

        {phase !== "setup" && (
          <Reveal>
            <div className={`${CARD} mx-auto max-w-3xl p-5 sm:p-7`}>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span>
                  {technology} · {type.charAt(0) + type.slice(1).toLowerCase()}
                </span>
                <span>
                  Question {Math.min(index + 1, TOTAL_QUESTIONS)} of {TOTAL_QUESTIONS}
                </span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-[#2563EB] transition-all duration-500"
                  style={{ width: `${(index / TOTAL_QUESTIONS) * 100}%` }}
                />
              </div>

              {phase === "finishing" ? (
                <div className="flex flex-col items-center gap-3 py-14 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-[#2563EB]" />
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Scoring your interview…</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    The AI is evaluating every answer. This takes a few seconds.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-800 dark:bg-surface-elevated dark:text-slate-100">
                    <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-[#2563EB] dark:text-blue-400">
                      Interviewer
                    </p>
                    {question}
                  </div>

                  <textarea
                    ref={answerRef}
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyDown={(e) => {
                      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") void handleSubmit();
                    }}
                    disabled={busy}
                    maxLength={6000}
                    rows={7}
                    placeholder="Type your answer here… (Ctrl+Enter to submit)"
                    className={`${INPUT} mt-4 resize-y`}
                  />

                  <div className="mt-3">
                    <VoiceAnswerButton
                      disabled={busy}
                      onTranscript={(text) =>
                        setAnswer((prev) => (prev.trim() ? `${prev.trim()} ${text}` : text).slice(0, 6000))
                      }
                    />
                  </div>

                  {error && <ErrorBox message={error} />}

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => sessionId && index > 0 && finish(sessionId)}
                      disabled={busy || index === 0}
                      title={index === 0 ? "Answer at least one question first" : "Finish now and get your report"}
                      className="text-xs font-semibold text-slate-500 underline-offset-2 hover:underline disabled:no-underline disabled:opacity-40 dark:text-slate-400"
                    >
                      End interview early
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={busy || !answer.trim()}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50"
                    >
                      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      {busy ? "Thinking…" : index + 1 >= TOTAL_QUESTIONS ? "Submit & get report" : "Submit answer"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </Reveal>
        )}
      </div>
    </>
  );
}

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
