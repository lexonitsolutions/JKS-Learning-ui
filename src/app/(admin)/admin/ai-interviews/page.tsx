"use client";

import React from "react";
import Link from "next/link";
import { BrainCircuit, Sparkles, Clock, ArrowRight, ShieldAlert, CheckCircle2 } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Reveal } from "@/lib/motion/reveal";

export default function AdminAiInterviewsPage() {
  return (
    <>
      <DashboardTopbar
        title="AI Interviews (Coming Soon)"
        subtitle="AI-powered live voice and coding interview evaluation engine."
        userInitials="AD"
      />

      <div className="flex-1 space-y-6 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4">
        {/* Coming Soon Notice Card */}
        <Reveal>
          <div className="relative overflow-hidden rounded-[24px] border border-amber-200/80 bg-gradient-to-br from-amber-50/90 via-white to-orange-50/50 p-8 sm:p-10 shadow-[0_8px_30px_rgb(245,158,11,0.08)] backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-100/80 border border-amber-300/60 px-3 py-1 text-xs font-bold text-amber-800">
                  <Clock className="h-3.5 w-3.5 text-amber-700" />
                  <span>Feature in Active Development</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  AI Interview Proctoring & Analytics Engine
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  This section has been temporarily disabled as requested while live student audio speech-to-text processing, anti-cheating video telemetry, and automated rubrics are being integrated with PostgreSQL database models.
                </p>
              </div>

              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 shadow-inner">
                <BrainCircuit className="h-10 w-10" />
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 border-t border-amber-200/60 pt-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Live Voice Transcription</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Real-time candidate speech analysis and cadence evaluation.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Code Execution Sandbox</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Live Monaco editor compiler with automated test cases.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Direct DB Session Sync</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Student scores stored directly to PostgreSQL interview tables.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <Link
                href="/admin/students"
                className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
              >
                <span>View Registered Students</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
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
