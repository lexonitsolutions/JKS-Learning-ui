import { CheckCircle2, AlertTriangle, ListChecks, RefreshCcw } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { ScoreRing } from "@/components/ui/score-ring";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { TiltCard } from "@/components/interactions/tilt-card";
import { Reveal } from "@/lib/motion/reveal";
import { SAMPLE_REPORT } from "@/lib/data/interview-report";
import Link from "next/link";

const GLASS_CARD = "rounded-[20px] border border-white/70 bg-white/80 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl";

export default function AiInterviewReportPage() {
  const r = SAMPLE_REPORT;

  return (
    <>
      <DashboardTopbar
        title="AI Interview Report"
        subtitle="Java Full Stack · Technical · 1–3 years"
        userInitials="JD"
      />

      <div className="flex-1 space-y-6 overflow-y-auto p-4 pt-3 sm:p-6 lg:p-8">
        {/* Above the fold: score ring + category bars */}
        <Reveal variant="fade-up">
          <TiltCard>
            <div className={`${GLASS_CARD} p-4 sm:p-6`}>
              <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-[auto_1fr] md:items-center">
                <div className="flex justify-center">
                  <ScoreRing score={r.overallScore} size={150} />
                </div>
                <div>
                  <Badge variant="success">{r.readinessVerdict}</Badge>
                  <div className="mt-4 space-y-3">
                    {r.categories.map((cat) => (
                      <div key={cat.label}>
                        <div className="flex justify-between text-xs sm:text-sm text-slate-600">
                          <span>{cat.label}</span>
                          <span className="font-semibold text-slate-900">{cat.score}</span>
                        </div>
                        <div className="mt-1 h-1.5 rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-[#2563EB]"
                            style={{ width: `${cat.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TiltCard>
        </Reveal>

        {/* Strengths / weaknesses */}
        <Reveal variant="stagger" className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          <TiltCard>
            <div className={`${GLASS_CARD} p-4 sm:p-6`}>
              <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" /> Strengths
              </h3>
              <ul className="mt-3 space-y-2 text-xs sm:text-sm text-slate-600">
                {r.strengths.map((s) => (
                  <li key={s} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" /> {s}
                  </li>
                ))}
              </ul>
            </div>
          </TiltCard>
          <TiltCard>
            <div className={`${GLASS_CARD} p-4 sm:p-6`}>
              <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
                <AlertTriangle className="h-5 w-5 text-amber-500" /> Weaknesses
              </h3>
              <ul className="mt-3 space-y-2 text-xs sm:text-sm text-slate-600">
                {r.weaknesses.map((w) => (
                  <li key={w} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" /> {w}
                  </li>
                ))}
              </ul>
            </div>
          </TiltCard>
        </Reveal>

        {/* Recommended topics */}
        <Reveal variant="fade-up">
          <div className={`${GLASS_CARD} p-4 sm:p-6`}>
            <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
              <ListChecks className="h-5 w-5 text-[#2563EB]" /> Recommended Topics
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {r.recommendedTopics.map((t) => (
                <Badge key={t} variant="primary">
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Per-question breakdown */}
        <div>
          <h3 className="text-base font-bold text-slate-900">Question-by-Question Breakdown</h3>
          <Reveal variant="stagger" className="mt-3 space-y-4">
            {r.questions.map((q, i) => (
              <div key={q.question} className={`${GLASS_CARD} p-4 sm:p-5`}>
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm font-semibold text-slate-900">
                    Q{i + 1}. {q.question}
                  </p>
                  <span
                    className={`shrink-0 text-lg font-extrabold ${
                      q.score >= 75 ? "text-emerald-600" : q.score >= 60 ? "text-amber-500" : "text-rose-600"
                    }`}
                  >
                    {q.score}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-600">
                  <span className="font-semibold">Your answer: </span>
                  {q.answerSummary}
                </p>
                <p className="mt-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
                  {q.feedback}
                </p>
              </div>
            ))}
          </Reveal>
        </div>

        {/* Improvement plan */}
        <Reveal variant="fade-up">
          <div className="relative overflow-hidden rounded-[20px] border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 p-6 text-white shadow-lg">
            <div
              className="pointer-events-none absolute -top-10 right-10 h-40 w-40 rounded-full opacity-60"
              style={{ background: "radial-gradient(circle, rgba(56,189,248,0.2), transparent 70%)" }}
            />
            <h3 className="relative text-base font-bold text-white">Your Improvement Plan</h3>
            <ol className="relative mt-3 space-y-2 text-sm text-white/80">
              {r.improvementPlan.map((step, i) => (
                <li key={step} className="flex gap-2">
                  <span className="font-semibold text-blue-400">{i + 1}.</span> {step}
                </li>
              ))}
            </ol>
            <Link href="/dashboard/ai-interview" className={buttonVariants({ size: "md" }) + " relative mt-5"}>
              <RefreshCcw className="h-4 w-4" /> Retake with Adjusted Focus
            </Link>
          </div>
        </Reveal>
      </div>
    </>
  );
}
