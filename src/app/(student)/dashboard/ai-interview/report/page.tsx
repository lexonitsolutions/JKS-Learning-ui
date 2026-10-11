"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, AlertTriangle, ListChecks, RefreshCcw, Loader2 } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { ScoreRing } from "@/components/ui/score-ring";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Reveal } from "@/lib/motion/reveal";
import { fetchInterviewReport, type InterviewReport } from "@/lib/data/ai-api";

const GLASS_CARD =
  "rounded-[20px] border border-white/70 bg-white/80 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary/90 dark:shadow-[0_8px_30px_rgb(0,0,0,0.35)]";

const CATEGORY_LABELS: Record<keyof InterviewReport["categoryScores"], string> = {
  technicalKnowledge: "Technical Knowledge",
  problemSolving: "Problem Solving",
  communication: "Communication",
  answerQuality: "Answer Quality",
  confidence: "Confidence",
};

function scoreTone(score: number) {
  return score >= 75
    ? "text-emerald-600 dark:text-emerald-400"
    : score >= 50
      ? "text-amber-500 dark:text-amber-400"
      : "text-rose-600 dark:text-rose-400";
}

function ReportView() {
  const id = useSearchParams().get("id");
  const [report, setReport] = useState<InterviewReport | null>(null);
  const [error, setError] = useState<string | null>(id ? null : "No interview selected.");

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    fetchInterviewReport(id)
      .then((r) => !cancelled && setReport(r))
      .catch((e: unknown) => !cancelled && setError(e instanceof Error ? e.message : "Could not load this report."));
    return () => {
      cancelled = true;
    };
  }, [id]);

  const subtitle = report
    ? `${report.session.technology} · ${report.session.type.charAt(0) + report.session.type.slice(1).toLowerCase()} · ${report.session.experience}`
    : "Loading your report…";

  return (
    <>
      <DashboardTopbar title="AI Interview Report" subtitle={subtitle} />

      <div className="flex-1 space-y-6 overflow-y-auto p-4 pt-3 sm:p-6 lg:p-8">
        {error && (
          <div className={`${GLASS_CARD} flex flex-col items-center gap-3 p-10 text-center`}>
            <AlertTriangle className="h-8 w-8 text-amber-500" />
            <p className="text-sm text-slate-600 dark:text-slate-300">{error}</p>
            <Link href="/dashboard/ai-interview" className={buttonVariants({ size: "md" })}>
              Back to AI Mock Interview
            </Link>
          </div>
        )}

        {!error && !report && (
          <div className="flex items-center justify-center gap-2 py-24 text-sm text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading report…
          </div>
        )}

        {report && (
          <>
            <Reveal variant="fade-up">
              <div className={`${GLASS_CARD} p-4 sm:p-6`}>
                <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-[auto_1fr] md:items-center">
                  <div className="flex justify-center">
                    <ScoreRing score={report.overallScore} size={150} />
                  </div>
                  <div>
                    <Badge variant={report.overallScore >= 60 ? "success" : "warning"}>
                      {report.readinessVerdict || "Report ready"}
                    </Badge>
                    <div className="mt-4 space-y-3">
                      {(Object.keys(CATEGORY_LABELS) as (keyof typeof CATEGORY_LABELS)[]).map((key) => (
                        <div key={key}>
                          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                            <span>{CATEGORY_LABELS[key]}</span>
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {report.categoryScores[key]}
                            </span>
                          </div>
                          <div className="mt-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800">
                            <div
                              className="h-full rounded-full bg-[#2563EB] dark:bg-blue-500"
                              style={{ width: `${report.categoryScores[key]}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal variant="stagger" className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
              <ListCard
                title="Strengths"
                items={report.strengths}
                dot="bg-emerald-500"
                icon={<CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
              />
              <ListCard
                title="Weaknesses"
                items={report.weaknesses}
                dot="bg-amber-500"
                icon={<AlertTriangle className="h-5 w-5 text-amber-500 dark:text-amber-400" />}
              />
            </Reveal>

            {report.recommendedTopics.length > 0 && (
              <Reveal variant="fade-up">
                <div className={`${GLASS_CARD} p-4 sm:p-6`}>
                  <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                    <ListChecks className="h-5 w-5 text-[#2563EB] dark:text-blue-400" /> Recommended Topics
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {report.recommendedTopics.map((t) => (
                      <Badge key={t} variant="primary">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Question-by-Question Breakdown</h3>
              <div className="mt-3 space-y-4">
                {report.answers.map((q, i) => (
                  <div key={`${q.order}-${i}`} className={`${GLASS_CARD} p-4 sm:p-5`}>
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        Q{i + 1}. {q.question}
                      </p>
                      <span className={`shrink-0 text-lg font-extrabold ${scoreTone(q.score)}`}>{q.score}</span>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-xs text-slate-600 dark:text-slate-300">
                      <span className="font-semibold text-slate-900 dark:text-white">Your answer: </span>
                      {q.answer}
                    </p>
                    {q.feedback && (
                      <p className="mt-2 rounded-xl border border-transparent bg-slate-50 p-3 text-xs text-slate-600 dark:border-slate-800 dark:bg-surface-elevated dark:text-slate-300">
                        {q.feedback}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {report.improvementPlan.length > 0 && (
              <Reveal variant="fade-up">
                <div className="relative overflow-hidden rounded-[20px] border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 p-6 text-white">
                  <h3 className="relative text-base font-bold text-white">Your Improvement Plan</h3>
                  <ol className="relative mt-3 space-y-2 text-sm text-white/80">
                    {report.improvementPlan.map((step, i) => (
                      <li key={step} className="flex gap-2">
                        <span className="font-semibold text-blue-400">{i + 1}.</span> {step}
                      </li>
                    ))}
                  </ol>
                  <Link
                    href="/dashboard/ai-interview"
                    className={cn(buttonVariants({ size: "md" }), "relative mt-5")}
                  >
                    <RefreshCcw className="h-4 w-4" /> Take another interview
                  </Link>
                </div>
              </Reveal>
            )}
          </>
        )}
      </div>
    </>
  );
}

function ListCard({
  title,
  items,
  dot,
  icon,
}: {
  title: string;
  items: string[];
  dot: string;
  icon: React.ReactNode;
}) {
  return (
    <div className={`${GLASS_CARD} p-4 sm:p-6`}>
      <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
        {icon} {title}
      </h3>
      <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-300 sm:text-sm">
        {items.length === 0 && <li className="text-slate-400">Nothing to report.</li>}
        {items.map((s) => (
          <li key={s} className="flex gap-2">
            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} /> {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AiInterviewReportPage() {
  return (
    <Suspense fallback={null}>
      <ReportView />
    </Suspense>
  );
}
