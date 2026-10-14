"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { fetchStudentInterviews, type InterviewSessionSummary } from "@/lib/data/ai-api";

interface AdminSession extends InterviewSessionSummary {
  report?: {
    overallScore: number;
    readinessVerdict: string;
    weaknesses?: string[];
    recommendedTopics?: string[];
  } | null;
}

export function StudentAiInterviews({ studentUserId }: { studentUserId: string }) {
  const [sessions, setSessions] = useState<AdminSession[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchStudentInterviews(studentUserId)
      .then((s) => !cancelled && setSessions(s as AdminSession[]))
      .catch((e: unknown) => !cancelled && setError(e instanceof Error ? e.message : "Could not load interviews."));
    return () => {
      cancelled = true;
    };
  }, [studentUserId]);

  if (error) return <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>;
  if (!sessions)
    return (
      <p className="flex items-center gap-2 text-sm text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading AI interviews…
      </p>
    );
  if (sessions.length === 0)
    return <p className="text-sm text-slate-500 dark:text-slate-400">This learner has not taken any AI mock interviews yet.</p>;

  return (
    <ul className="space-y-3">
      {sessions.map((s) => (
        <li key={s.id} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-surface-secondary">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {s.technology} · {s.type.charAt(0) + s.type.slice(1).toLowerCase()} · {s.experience}
            </p>
            <span className="text-xs text-slate-500 dark:text-slate-400">{new Date(s.startedAt).toLocaleString()}</span>
          </div>
          {s.report ? (
            <div className="mt-2 text-xs text-slate-600 dark:text-slate-300">
              <p>
                <span className="text-lg font-extrabold text-[#2563EB] dark:text-blue-400">{s.report.overallScore}</span>
                <span className="ml-2 font-semibold">{s.report.readinessVerdict}</span>
              </p>
              {!!s.report.weaknesses?.length && (
                <p className="mt-1">
                  <span className="font-semibold">Weak areas: </span>
                  {s.report.weaknesses.join("; ")}
                </p>
              )}
              {!!s.report.recommendedTopics?.length && (
                <p className="mt-1">
                  <span className="font-semibold">Recommended: </span>
                  {s.report.recommendedTopics.join(", ")}
                </p>
              )}
            </div>
          ) : (
            <p className="mt-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
              {s.status === "IN_PROGRESS" ? "Not finished" : "Interrupted"}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
