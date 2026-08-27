"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BrainCircuit,
  Sparkles,
  Mic,
  Volume2,
  CheckCircle2,
  ChevronRight,
  Code2,
  Layers,
  Database,
  ShieldCheck,
  RefreshCw,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TiltCard } from "@/components/interactions/tilt-card";

interface QuestionScenario {
  id: string;
  track: string;
  icon: typeof Code2;
  level: string;
  category: string;
  question: string;
  sampleAnswer: string;
  metrics: {
    technical: number;
    communication: number;
    problemSolving: number;
    depth: number;
  };
  keyTakeaway: string;
  studyTip: string;
}

const SCENARIOS: QuestionScenario[] = [
  {
    id: "fullstack",
    track: "Full Stack (React & Node)",
    icon: Code2,
    level: "Senior L5",
    category: "Architecture & Concurrency",
    question:
      "How do you prevent race conditions when handling multiple concurrent state updates in React 19 Server Actions paired with optimistic UI updates?",
    sampleAnswer:
      "I leverage useOptimistic alongside server idempotency keys. For asynchronous state transitions, React 19's Action transition boundary ensures rollback on failure while client queue locks isolate overlapping patch dispatches.",
    metrics: {
      technical: 94,
      communication: 91,
      problemSolving: 88,
      depth: 92,
    },
    keyTakeaway:
      "Clear distinction between optimistic client rendering and authoritative backend state reconciliation.",
    studyTip: "Reinforce idempotency key handling across distributed microservice retries.",
  },
  {
    id: "java",
    track: "Java Full Stack & Spring",
    icon: Database,
    level: "Lead Architect",
    category: "Distributed Transactions",
    question:
      "When orchestrating a multi-service order pipeline, why would you choose the Saga pattern with event choreography over two-phase commit (2PC)?",
    sampleAnswer:
      "2PC requires continuous distributed locks, introducing high latency and single-point-of-failure bottlenecks. Choreographed Sagas use asynchronous Kafka events with compensating transactions for eventual consistency without locking.",
    metrics: {
      technical: 96,
      communication: 89,
      problemSolving: 95,
      depth: 93,
    },
    keyTakeaway:
      "Demonstrates solid grasp of CAP theorem, eventual consistency, and compensation mechanisms.",
    studyTip: "Review Kafka dead-letter queues and outbox pattern implementations.",
  },
  {
    id: "sap",
    track: "SAP S/4HANA & Cloud",
    icon: Layers,
    level: "Senior Consultant",
    category: "Clean Core Extensibility",
    question:
      "How do you implement Clean Core side-by-side extensions in SAP BTP without modifying standard S/4HANA ERP tables?",
    sampleAnswer:
      "We expose standard CDS views via released RAP (RESTful Application Programming) APIs and consume them in SAP BTP using CAP framework or SAP Build, ensuring zero core modifications during upgrade cycles.",
    metrics: {
      technical: 92,
      communication: 94,
      problemSolving: 90,
      depth: 89,
    },
    keyTakeaway:
      "Accurately explains SAP RAP, CDS view interfaces, and Cloud SDK decoupling patterns.",
    studyTip: "Explore Event Mesh pub/sub triggers between S/4HANA and BTP.",
  },
  {
    id: "sysdesign",
    track: "System Design",
    icon: ShieldCheck,
    level: "Staff Engineer",
    category: "High-Throughput Systems",
    question:
      "Design a real-time rate limiting algorithm for 100,000 requests/sec across a globally distributed API gateway.",
    sampleAnswer:
      "I would combine a local in-memory Token Bucket on edge NGINX/Envoy nodes with periodic asynchronous batch synchronization to a Redis Cluster using Sliding Window Logs to cap cluster-wide spikes.",
    metrics: {
      technical: 95,
      communication: 92,
      problemSolving: 97,
      depth: 94,
    },
    keyTakeaway:
      "Proactively evaluated edge-layer memory constraints vs central Redis round-trip latency.",
    studyTip: "Detail handling of clock drift across multi-region edge nodes.",
  },
];

export function InterviewSimulator() {
  const [selectedId, setSelectedId] = useState<string>("fullstack");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeTab, setActiveTab] = useState<"answer" | "analysis">("analysis");

  const current = SCENARIOS.find((s) => s.id === selectedId) || SCENARIOS[0];

  useEffect(() => {
    const speakTimer = setTimeout(() => setIsSpeaking(true), 50);
    const stopTimer = setTimeout(() => setIsSpeaking(false), 2450);
    return () => {
      clearTimeout(speakTimer);
      clearTimeout(stopTimer);
    };
  }, [selectedId]);

  return (
    <div className="relative mx-auto max-w-[1280px] px-6 lg:px-16">
      {/* Background Glow */}
      <div
        className="pointer-events-none absolute -top-12 left-1/2 -z-10 h-96 w-[90%] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(30, 94, 255, 0.6) 0%, rgba(0, 240, 255, 0.3) 50%, transparent 80%)",
        }}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        {/* Left Column: Interactive Track Selector & Live AI Controller */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="rounded-2xl border border-border/80 bg-white/80 p-6 backdrop-blur-md shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-border/60">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-blue/10 text-primary-blue">
                  <BrainCircuit className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-heading">AI Question Generator</h3>
                  <p className="text-xs text-text-body">Select a track to simulate live prompt</p>
                </div>
              </div>
              <Badge variant="primary" className="text-xs">
                Adaptive AI L5
              </Badge>
            </div>

            {/* Track Switcher */}
            <div className="mt-4 flex flex-col gap-2">
              {SCENARIOS.map((scenario) => {
                const isSelected = scenario.id === selectedId;
                const Icon = scenario.icon;
                return (
                  <button
                    key={scenario.id}
                    onClick={() => {
                      setSelectedId(scenario.id);
                    }}
                    className={`group flex items-center justify-between rounded-xl p-3.5 text-left transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-primary-blue text-white shadow-md shadow-primary-blue/20 scale-[1.01]"
                        : "bg-bg-light hover:bg-primary-blue/5 text-text-heading border border-border/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                          isSelected ? "bg-white/20 text-white" : "bg-white text-primary-blue shadow-xs"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold leading-none">{scenario.track}</div>
                        <div
                          className={`mt-1 text-[11px] ${
                            isSelected ? "text-white/80" : "text-text-body"
                          }`}
                        >
                          {scenario.category} • {scenario.level}
                        </div>
                      </div>
                    </div>
                    <ChevronRight
                      className={`h-4 w-4 transition-transform ${
                        isSelected ? "text-white translate-x-0.5" : "text-text-body/40 group-hover:translate-x-0.5"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* AI Live Audio Simulation Bar */}
            <div className="mt-5 rounded-xl border border-primary-blue/15 bg-primary-blue/[0.03] p-3.5">
              <div className="flex items-center justify-between text-xs font-semibold text-text-heading mb-2">
                <span className="flex items-center gap-1.5 text-primary-blue">
                  <Volume2 className={`h-4 w-4 ${isSpeaking ? "animate-pulse" : ""}`} />
                  {isSpeaking ? "AI Synthesizing Question..." : "AI Ready to Evaluate"}
                </span>
                <span className="text-[11px] font-mono text-text-body">48kHz Voice Engine</span>
              </div>
              {/* Animated Waveform Equalizer */}
              <div className="flex h-7 items-center justify-center gap-1 overflow-hidden rounded-lg bg-primary-dark/95 px-4">
                {Array.from({ length: 24 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 rounded-full bg-gradient-to-t from-primary-blue to-cyan-400"
                    animate={{
                      height: isSpeaking
                        ? [4, Math.sin(i * 0.7) * 18 + 8, Math.cos(i * 0.5) * 16 + 6, 4]
                        : [4, 6, 4],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: isSpeaking ? 0.6 + (i % 5) * 0.1 : 2,
                      ease: "easeInOut",
                      delay: i * 0.03,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-border bg-white p-3 text-center shadow-xs">
              <div className="text-lg font-bold text-primary-blue">120ms</div>
              <div className="text-[11px] text-text-body">Evaluation Latency</div>
            </div>
            <div className="rounded-xl border border-border bg-white p-3 text-center shadow-xs">
              <div className="text-lg font-bold text-emerald-600">5-Axis</div>
              <div className="text-[11px] text-text-body">Scoring Vector</div>
            </div>
            <div className="rounded-xl border border-border bg-white p-3 text-center shadow-xs">
              <div className="text-lg font-bold text-violet-600">100%</div>
              <div className="text-[11px] text-text-body">Adaptive Flow</div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Mock Interview Console */}
        <div className="lg:col-span-7">
          <TiltCard className="overflow-hidden rounded-2xl border border-primary-blue/20 bg-primary-dark text-white shadow-xl shadow-primary-dark/20">
            {/* Terminal Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-5 py-3.5">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-xs text-white/50">
                  jks-ai-interview-session:/{current.id}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Interviewer Active
                </span>
              </div>
            </div>

            {/* Terminal Body */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-5"
                >
                  {/* AI Question Bubble */}
                  <div className="rounded-xl border border-primary-blue/30 bg-primary-blue/10 p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>AI INTERVIEWER QUESTION</span>
                      <span className="ml-auto text-[11px] font-normal text-white/40">
                        {current.category}
                      </span>
                    </div>
                    <p className="mt-2 text-base font-medium leading-relaxed text-white">
                      &ldquo;{current.question}&rdquo;
                    </p>
                  </div>

                  {/* Tabs: Candidate Answer vs AI Diagnostic Analysis */}
                  <div>
                    <div className="flex border-b border-white/10">
                      <button
                        onClick={() => setActiveTab("analysis")}
                        className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold transition-colors cursor-pointer border-b-2 ${
                          activeTab === "analysis"
                            ? "border-cyan-400 text-cyan-400"
                            : "border-transparent text-white/60 hover:text-white"
                        }`}
                      >
                        <Zap className="h-3.5 w-3.5" />
                        AI Diagnostic Scoring
                      </button>
                      <button
                        onClick={() => setActiveTab("answer")}
                        className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold transition-colors cursor-pointer border-b-2 ${
                          activeTab === "answer"
                            ? "border-cyan-400 text-cyan-400"
                            : "border-transparent text-white/60 hover:text-white"
                        }`}
                      >
                        <Mic className="h-3.5 w-3.5" />
                        Candidate Response
                      </button>
                    </div>

                    <div className="pt-4">
                      {activeTab === "analysis" ? (
                        <div className="space-y-4">
                          {/* 4 Score Metrics Grid */}
                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {[
                              { label: "Technical Accuracy", score: current.metrics.technical, color: "text-cyan-400" },
                              { label: "Communication", score: current.metrics.communication, color: "text-emerald-400" },
                              { label: "Problem Solving", score: current.metrics.problemSolving, color: "text-indigo-400" },
                              { label: "System Depth", score: current.metrics.depth, color: "text-violet-400" },
                            ].map((m) => (
                              <div
                                key={m.label}
                                className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center"
                              >
                                <div className={`text-xl font-bold font-mono ${m.color}`}>
                                  {m.score}%
                                </div>
                                <div className="mt-1 text-[11px] text-white/60 leading-tight">
                                  {m.label}
                                </div>
                                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
                                  <motion.div
                                    className="h-full bg-gradient-to-r from-primary-blue to-cyan-400"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${m.score}%` }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* AI Evaluation Insight */}
                          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs text-emerald-300">
                            <div className="font-semibold flex items-center gap-1.5 text-emerald-400">
                              <CheckCircle2 className="h-4 w-4" /> Strong Signal Detected
                            </div>
                            <p className="mt-1 text-white/80">{current.keyTakeaway}</p>
                          </div>

                          {/* Actionable Tip */}
                          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-3.5 text-xs">
                            <span className="font-semibold text-indigo-300">
                              Targeted Study Recommendation:
                            </span>{" "}
                            <span className="text-white/80">{current.studyTip}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs font-mono leading-relaxed text-white/90">
                            <span className="text-cyan-400 font-semibold">&gt; Transcribed Response:</span>
                            <p className="mt-2 text-white/80">{current.sampleAnswer}</p>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-white/50">
                            <span className="inline-block h-2 w-2 rounded-full bg-cyan-400" />
                            Speech pace: 142 wpm • Sentiment: Confident • Zero filler word penalty
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </TiltCard>
        </div>
      </div>
    </div>
  );
}
