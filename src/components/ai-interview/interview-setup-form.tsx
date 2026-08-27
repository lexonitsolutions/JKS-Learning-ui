"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Code2,
  Puzzle,
  Users,
  Briefcase,
  Play,
  Sparkles,
  Layers,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { COURSES } from "@/lib/data/courses";

const EXPERIENCE_LEVELS = [
  { id: "Fresher", label: "Fresher", sub: "0–1 years" },
  { id: "1–3 years", label: "Junior / Mid", sub: "1–3 years" },
  { id: "3–5 years", label: "Senior", sub: "3–5 years" },
  { id: "5+ years", label: "Lead / Staff", sub: "5+ years" },
] as const;

const INTERVIEW_TYPES = [
  {
    id: "technical",
    label: "Technical & Code",
    icon: Code2,
    body: "Core runtime fundamentals, frameworks, concurrency & optimal algorithms.",
  },
  {
    id: "scenario",
    label: "System Design & Scenarios",
    icon: Puzzle,
    body: "Distributed architecture, latency budgets, caching & trade-off decisions.",
  },
  {
    id: "hr",
    label: "Behavioral & Leadership",
    icon: Users,
    body: "STAR method, team communication, ownership & conflict resolution.",
  },
  {
    id: "experience",
    label: "Project & Resume Defense",
    icon: Briefcase,
    body: "Panel-style deep dive grilling on your actual production portfolio.",
  },
] as const;

export function InterviewSetupForm() {
  const router = useRouter();
  const [technology, setTechnology] = useState(COURSES[0].slug);
  const [experience, setExperience] = useState<string>(EXPERIENCE_LEVELS[0].id);
  const [type, setType] = useState<string>("technical");
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push("/dashboard/ai-interview/report");
    }, 600);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 rounded-[24px] border border-white/70 bg-white/85 p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/80 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-blue/10 text-primary-blue">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-h3 font-bold text-text-heading">AI Interview Configuration</h2>
            <p className="text-xs text-text-body">Tailors question difficulty and scoring parameters</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary-blue/10 px-2.5 py-1 text-xs font-semibold text-primary-blue">
          <Zap className="h-3 w-3" /> Adaptive L5
        </span>
      </div>

      {/* 1. Track Selection */}
      <div>
        <label className="text-label text-text-heading flex items-center gap-1.5">
          <Layers className="h-4 w-4 text-primary-blue" />
          1. Select Technology Track
        </label>
        <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {COURSES.map((c) => {
            const isSelected = technology === c.slug;
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => setTechnology(c.slug)}
                className={`relative flex items-center justify-between rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
                  isSelected
                    ? "border-primary-blue bg-primary-blue/5 shadow-xs"
                    : "border-border bg-bg-light/50 hover:bg-bg-light"
                }`}
              >
                <div>
                  <div className={`text-sm font-semibold ${isSelected ? "text-primary-blue" : "text-text-heading"}`}>
                    {c.title}
                  </div>
                  <div className="text-[11px] text-text-body mt-0.5">{c.level} • {c.durationWeeks} weeks</div>
                </div>
                {isSelected && (
                  <motion.div
                    layoutId="track-pill"
                    className="h-2 w-2 rounded-full bg-primary-blue"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Experience Level */}
      <div>
        <label className="text-label text-text-heading flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-primary-blue" />
          2. Target Experience Level
        </label>
        <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {EXPERIENCE_LEVELS.map((level) => {
            const isSelected = experience === level.id;
            return (
              <button
                key={level.id}
                type="button"
                onClick={() => setExperience(level.id)}
                className={`rounded-xl border p-3 text-center transition-all cursor-pointer ${
                  isSelected
                    ? "border-primary-blue bg-primary-blue text-white shadow-md shadow-primary-blue/20"
                    : "border-border bg-bg-light/60 hover:bg-white text-text-heading"
                }`}
              >
                <div className="text-xs font-bold leading-none">{level.label}</div>
                <div className={`mt-1 text-[10px] ${isSelected ? "text-white/80" : "text-text-body"}`}>
                  {level.sub}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Interview Format */}
      <div>
        <label className="text-label text-text-heading flex items-center gap-1.5">
          <Code2 className="h-4 w-4 text-primary-blue" />
          3. Interview Format
        </label>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {INTERVIEW_TYPES.map((t) => {
            const isSelected = type === t.id;
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setType(t.id)}
                className={`group flex items-start gap-3 rounded-xl border p-4 text-left transition-all cursor-pointer ${
                  isSelected
                    ? "border-primary-blue bg-primary-blue/[0.04] shadow-xs"
                    : "border-border bg-white hover:border-primary-blue/30"
                }`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    isSelected ? "bg-primary-blue text-white" : "bg-primary-blue/10 text-primary-blue"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <div className={`text-xs font-bold ${isSelected ? "text-primary-blue" : "text-text-heading"}`}>
                    {t.label}
                  </div>
                  <div className="mt-1 text-[11px] text-text-body leading-relaxed">{t.body}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit Action */}
      <div className="pt-2">
        <Button
          size="lg"
          className="w-full font-bold shadow-lg shadow-primary-blue/20 cursor-pointer text-base"
          onClick={handleStart}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Initializing Adaptive AI Session...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Play className="h-4 w-4" /> Launch Adaptive Mock Interview
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
