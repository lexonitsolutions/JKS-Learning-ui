"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  TrendingUp,
  BrainCircuit,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Sliders,
  Sparkles,
  BarChart3,
} from "lucide-react";
import { AnimatedScoreRing } from "@/components/marketing/animated-score-ring";
import { AnimatedScoreBar } from "@/components/marketing/animated-score-bar";
import { Badge } from "@/components/ui/badge";

interface ReportState {
  label: string;
  overallScore: number;
  readinessLevel: string;
  badgeVariant: "success" | "warning";
  scores: [string, number][];
  highlightStrength: string;
  highlightGap: string;
  actionItems: { topic: string; estTime: string; courseRef: string }[];
}

const REPORT_ATTEMPTS: { [key: string]: ReportState } = {
  attempt1: {
    label: "Initial Diagnostic (Day 1)",
    overallScore: 68,
    readinessLevel: "Developing Candidate",
    badgeVariant: "warning",
    scores: [
      ["Technical Knowledge", 72],
      ["Problem Solving", 65],
      ["Communication", 78],
      ["Answer Quality", 62],
      ["Confidence", 64],
    ],
    highlightStrength: "Strong fundamentals in component lifecycle and core syntax.",
    highlightGap: "Missed edge case handling for distributed failovers and race conditions.",
    actionItems: [
      { topic: "Concurrent State Transitions & Optimistic Locking", estTime: "45 mins", courseRef: "React 19 Pro Track" },
      { topic: "Distributed Saga Orchestration & Rollback Patterns", estTime: "60 mins", courseRef: "Enterprise Microservices" },
      { topic: "Structured Problem Framing (STAR Framework)", estTime: "30 mins", courseRef: "Interview Mastery Series" },
    ],
  },
  attempt2: {
    label: "After AI Targeted Practice (Day 7)",
    overallScore: 92,
    readinessLevel: "Top Tier / Offer Ready",
    badgeVariant: "success",
    scores: [
      ["Technical Knowledge", 95],
      ["Problem Solving", 90],
      ["Communication", 94],
      ["Answer Quality", 91],
      ["Confidence", 89],
    ],
    highlightStrength: "Exemplary structural clarity, proactive tradeoff evaluation, zero hesitations.",
    highlightGap: "Minor opportunity to benchmark alternative caching strategies under high write load.",
    actionItems: [
      { topic: "Advanced Edge Caching Strategies (Redis Cluster vs DynamoDB DAX)", estTime: "25 mins", courseRef: "Advanced System Design" },
      { topic: "Executive Level Architectural Presentation Techniques", estTime: "20 mins", courseRef: "Staff Engineer Workshop" },
    ],
  },
};

export function InteractiveReportShowcase() {
  const [attemptKey, setAttemptKey] = useState<"attempt1" | "attempt2">("attempt2");
  const [activeView, setActiveView] = useState<"categories" | "study-plan">("categories");

  const report = REPORT_ATTEMPTS[attemptKey];

  return (
    <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-16">
      {/* Header with Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-300">
            <BrainCircuit className="h-3.5 w-3.5 text-cyan-400" /> Interactive Diagnostic Engine
          </span>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mt-3 text-white tracking-tight">
            Live Readiness Report Architecture
          </h3>
        </div>

        {/* Before / After Toggle */}
        <div className="inline-flex rounded-xl border border-white/10 bg-slate-900/90 p-1.5 backdrop-blur-md shadow-inner">
          <button
            type="button"
            onClick={() => setAttemptKey("attempt1")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              attemptKey === "attempt1"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Attempt #1 (Baseline 68%)
          </button>
          <button
            type="button"
            onClick={() => setAttemptKey("attempt2")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              attemptKey === "attempt2"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Attempt #2 (Retake 92% 🚀)
          </button>
        </div>
      </div>

      {/* Main Glass Card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 lg:p-10 backdrop-blur-xl shadow-2xl">
        {/* Subtle Ambient Radial Glow */}
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full opacity-20 blur-3xl transition-all duration-700"
          style={{
            background: attemptKey === "attempt2" ? "#10B981" : "#F59E0B",
          }}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={attemptKey}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Top Score Summary Row */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
              {/* Score Ring & Overall Level */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-slate-950/70 p-6 sm:p-8 text-center shadow-inner">
                <AnimatedScoreRing
                  score={report.overallScore}
                  size={170}
                  label="Overall Readiness"
                  variant="dark"
                />
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      report.badgeVariant === "success"
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                        : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    {report.readinessLevel}
                  </span>
                  {attemptKey === "attempt2" && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 text-xs font-bold text-emerald-300">
                      <TrendingUp className="h-3.5 w-3.5" /> +24% Boost
                    </span>
                  )}
                </div>
                <p className="mt-3 text-xs text-slate-400 max-w-xs leading-relaxed">
                  {report.label} • Benchmarked against 22,000+ candidate evaluations
                </p>
              </div>

              {/* View Switcher & Detailed Category Bars */}
              <div className="lg:col-span-7 flex flex-col gap-5">
                <div className="flex border-b border-white/10 pb-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setActiveView("categories")}
                    className={`flex items-center gap-2 pb-2 text-xs font-bold transition-all cursor-pointer border-b-2 -mb-2 ${
                      activeView === "categories"
                        ? "border-cyan-400 text-cyan-300"
                        : "border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <BarChart3 className="h-4 w-4 text-cyan-400" />
                    5-Axis Evaluation
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveView("study-plan")}
                    className={`flex items-center gap-2 pb-2 text-xs font-bold transition-all cursor-pointer border-b-2 -mb-2 ${
                      activeView === "study-plan"
                        ? "border-cyan-400 text-cyan-300"
                        : "border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <BookOpen className="h-4 w-4 text-cyan-400" />
                    Targeted Study Plan ({report.actionItems.length} modules)
                  </button>
                </div>

                {activeView === "categories" ? (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {report.scores.map(([label, score], idx) => (
                      <div key={label} className={idx === 4 ? "sm:col-span-2" : ""}>
                        <AnimatedScoreBar label={label} score={score} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {report.actionItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-3.5 hover:bg-white/[0.05] transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/15 text-xs font-bold text-cyan-300 font-mono border border-cyan-500/30">
                            0{idx + 1}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-bold text-white truncate">{item.topic}</div>
                            <div className="text-[11px] text-slate-400">{item.courseRef}</div>
                          </div>
                        </div>
                        <span className="shrink-0 rounded-lg bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 text-[11px] font-mono text-cyan-300">
                          {item.estTime}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Diagnostic Signals Footer */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 pt-6 border-t border-white/10">
              <div className="flex items-start gap-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 shadow-xs">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Primary Strength Identified</div>
                  <p className="mt-1 text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">{report.highlightStrength}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 rounded-2xl border border-amber-500/30 bg-amber-950/20 p-5 shadow-xs">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">Recommended Optimization Area</div>
                  <p className="mt-1 text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">{report.highlightGap}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

