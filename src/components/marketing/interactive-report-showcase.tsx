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
    <div className="relative mx-auto max-w-[1280px] px-6 lg:px-16">
      {/* Header with Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <span className="text-label text-cyan-400">Interactive Diagnostic Engine</span>
          <h3 className="text-h2 mt-1 text-white">Live Readiness Report Architecture</h3>
        </div>

        {/* Before / After Toggle */}
        <div className="inline-flex rounded-xl border border-white/15 bg-white/5 p-1 backdrop-blur-md">
          <button
            onClick={() => setAttemptKey("attempt1")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              attemptKey === "attempt1"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : "text-white/60 hover:text-white"
            }`}
          >
            Attempt #1 (Baseline 68%)
          </button>
          <button
            onClick={() => setAttemptKey("attempt2")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              attemptKey === "attempt2"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "text-white/60 hover:text-white"
            }`}
          >
            Attempt #2 (Retake 92% 🚀)
          </button>
        </div>
      </div>

      {/* Main Glass Card */}
      <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 lg:p-8 backdrop-blur-xl shadow-2xl">
        {/* Subtle Ambient Radial Glow */}
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full opacity-20 blur-3xl"
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
              <div className="lg:col-span-5 flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center">
                <AnimatedScoreRing
                  score={report.overallScore}
                  size={170}
                  label="Overall Readiness"
                />
                <div className="mt-4 flex items-center gap-2">
                  <Badge variant={report.badgeVariant} className="text-xs font-semibold">
                    {report.readinessLevel}
                  </Badge>
                  {attemptKey === "attempt2" && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                      <TrendingUp className="h-3.5 w-3.5" /> +24% Boost
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs text-white/60 max-w-xs">
                  {report.label} • Benchmarked against 22,000+ candidate evaluations
                </p>
              </div>

              {/* View Switcher & Detailed Category Bars */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="flex border-b border-white/10 pb-2">
                  <button
                    onClick={() => setActiveView("categories")}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer border-b-2 ${
                      activeView === "categories"
                        ? "border-cyan-400 text-cyan-400"
                        : "border-transparent text-white/60 hover:text-white"
                    }`}
                  >
                    <BarChart3 className="h-3.5 w-3.5" />
                    5-Axis Evaluation
                  </button>
                  <button
                    onClick={() => setActiveView("study-plan")}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer border-b-2 ${
                      activeView === "study-plan"
                        ? "border-cyan-400 text-cyan-400"
                        : "border-transparent text-white/60 hover:text-white"
                    }`}
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    Targeted Study Plan ({report.actionItems.length} modules)
                  </button>
                </div>

                {activeView === "categories" ? (
                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    {report.scores.map(([label, score]) => (
                      <AnimatedScoreBar key={label} label={label} score={score} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {report.actionItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-3 hover:bg-white/[0.05] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-cyan-400/10 text-xs font-bold text-cyan-400 font-mono">
                            0{idx + 1}
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-white">{item.topic}</div>
                            <div className="text-[11px] text-white/50">{item.courseRef}</div>
                          </div>
                        </div>
                        <span className="rounded-md bg-white/10 px-2 py-1 text-[11px] font-mono text-cyan-300">
                          {item.estTime}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Diagnostic Signals Footer */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 pt-4 border-t border-white/10">
              <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-emerald-400">Primary Strength Identified</div>
                  <p className="mt-1 text-xs text-white/80">{report.highlightStrength}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-amber-400">Recommended Optimization Area</div>
                  <p className="mt-1 text-xs text-white/80">{report.highlightGap}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
