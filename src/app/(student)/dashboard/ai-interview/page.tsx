"use client";

import React from "react";
import Link from "next/link";
import { BrainCircuit, Clock, ArrowRight, CheckCircle2, BookOpen } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Reveal } from "@/lib/motion/reveal";

export default function AiInterviewSetupPage() {
  return (
    <>
      <DashboardTopbar
        title="AI Mock Interview (Coming Soon)"
        subtitle="AI-powered live voice and coding interview simulator with real-time feedback."
      />

      <div className="flex-1 space-y-6 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4">
        {/* Coming Soon Notice Card */}
        <Reveal>
          <div className="relative overflow-hidden rounded-[24px] border border-amber-200/80 dark:border-amber-900/50 bg-gradient-to-br from-amber-50/90 via-white to-orange-50/50 dark:from-surface-elevated dark:via-surface-secondary dark:to-amber-950/20 p-8 sm:p-10 shadow-[0_8px_30px_rgb(245,158,11,0.08)] dark:shadow-none backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-100/80 dark:bg-amber-950/60 border border-amber-300/60 dark:border-amber-800/60 px-3 py-1 text-xs font-bold text-amber-800 dark:text-amber-300">
                  <Clock className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400" />
                  <span>Feature in Active Development</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  AI Mock Interview &amp; Evaluation Engine
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  This section has been temporarily disabled while live audio voice synthesis, real-time code sandbox execution, and comprehensive rubrics are being integrated with production database models.
                </p>
              </div>

              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/20 dark:border-amber-800/40 text-amber-600 dark:text-amber-400 shadow-inner">
                <BrainCircuit className="h-10 w-10" />
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 border-t border-amber-200/60 dark:border-slate-800 pt-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">Voice &amp; Coding Simulator</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Interactive speech-to-text technical questions tailored to your track.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">Instant Rubric Feedback</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Automated scoring on problem-solving approach, complexity, and communication.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">Verified Progress Sync</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Interview results and certificates saved directly to your learning profile.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <Link
                href="/dashboard/my-courses"
                className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>Continue Coursework</span>
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-elevated px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-surface-hover transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </>
  );
}
