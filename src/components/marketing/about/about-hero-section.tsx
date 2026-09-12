"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowDown,
  Sparkles,
  Compass,
  Code2,
  BrainCircuit,
  Cpu,
  Award,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Zap,
} from "lucide-react";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { AboutHeroVisual } from "./about-hero-visual";

const INFINITE_CARDS_ROW1 = [
  { icon: Code2, label: "Live Microservices Sandboxes", tag: "Spring Boot 3 + Kafka", color: "text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-300 dark:bg-blue-500/12 dark:border-blue-400/25" },
  { icon: BrainCircuit, label: "AI Mock Interview Diagnostics", tag: "25+ Response Metrics", color: "text-cyan-600 bg-cyan-50 border-cyan-200 dark:text-cyan-300 dark:bg-cyan-500/12 dark:border-cyan-400/25" },
  { icon: Cpu, label: "Modern Frontend Engineering", tag: "React 19 + Next.js 15", color: "text-indigo-600 bg-indigo-50 border-indigo-200 dark:text-indigo-300 dark:bg-indigo-500/12 dark:border-indigo-400/25" },
  { icon: Award, label: "100% Verified Certifications", tag: "Enterprise Credential", color: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-500/12 dark:border-emerald-400/25" },
  { icon: ShieldCheck, label: "SAP S/4HANA Cloud Systems", tag: "ABAP Cloud & Fiori", color: "text-purple-600 bg-purple-50 border-purple-200 dark:text-purple-300 dark:bg-purple-500/12 dark:border-purple-400/25" },
];

const INFINITE_CARDS_ROW2 = [
  { icon: Terminal, label: "Production Capstone Reviews", tag: "Git Pull Request Workflows", color: "text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-300 dark:bg-amber-500/12 dark:border-amber-400/25" },
  { icon: Zap, label: "Algorithmic Problem Solving", tag: "Concurrency & Edge Cases", color: "text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-300 dark:bg-blue-500/12 dark:border-blue-400/25" },
  { icon: CheckCircle2, label: "ATS Resume Builder", tag: "1-Click PDF Export", color: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-500/12 dark:border-emerald-400/25" },
  { icon: Compass, label: "1-on-1 Faculty Mentorship", tag: "Weekly Live Cohorts", color: "text-indigo-600 bg-indigo-50 border-indigo-200 dark:text-indigo-300 dark:bg-indigo-500/12 dark:border-indigo-400/25" },
  { icon: Sparkles, label: "8,000+ Students Trained", tag: "Placement Referrals", color: "text-cyan-600 bg-cyan-50 border-cyan-200 dark:text-cyan-300 dark:bg-cyan-500/12 dark:border-cyan-400/25" },
];

export function AboutHeroSection() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-[90vh] flex-col justify-between overflow-hidden border-b border-border dark:border-slate-800/80 bg-bg-light dark:bg-background px-5 pb-12 pt-16 text-text-heading dark:text-white sm:px-6 lg:px-16 transition-colors duration-300">
      {/* Subtle Ambient Radial Lights */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[420px] w-[800px] rounded-full bg-gradient-to-b from-blue-500/8 via-cyan-400/5 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-10 h-72 w-72 rounded-full bg-indigo-500/5 blur-2xl" />

      {/* Top Meta Indicator */}
      <div className="relative z-10 mx-auto max-w-[1280px] w-full flex items-center justify-between">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-800/80 bg-blue-50/80 dark:bg-blue-950/60 px-3.5 py-1.5 backdrop-blur-md shadow-xs">
          <span className="h-2 w-2 rounded-full bg-primary-fill animate-ping" />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary-blue dark:text-blue-400">
            About JKS Learning
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-text-body dark:text-slate-400">
          <Compass className="h-3.5 w-3.5 text-primary-blue dark:text-blue-400" />
          <span>EST. 2026 • HYDERABAD &amp; BENGALURU</span>
        </div>
      </div>

      {/* Main Editorial Headline & Narrative + 3D Scene */}
      <div className="relative z-10 mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-10 py-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8 lg:py-14">
        <div className="max-w-4xl space-y-6">
          <div className="space-y-1">
            <h1 className="text-[1.9rem] font-black leading-[1.06] tracking-tight text-text-heading dark:text-white sm:text-5xl md:text-6xl lg:text-[52px] xl:text-[62px]">
              LEARN TODAY.
              <br />
              <span className="text-primary-blue dark:text-blue-400">
                BUILD TOMORROW.
              </span>
            </h1>
          </div>

          <p className="max-w-2xl text-[0.95rem] font-normal leading-relaxed text-text-body dark:text-slate-300 sm:text-lg lg:text-[1.05rem] xl:text-xl">
            JKS Learning is built to help students develop practical knowledge, real-world skills, and the confidence to create their future.
          </p>

          {/* Quick Metrics Strip */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-200 dark:border-slate-800 pt-4 font-mono text-xs text-text-body dark:text-slate-400">
            <div>
              <span className="text-text-heading dark:text-white font-bold text-sm">8,000+</span> Students Empowered
            </div>
            <div className="hidden h-3 w-px bg-slate-300 dark:bg-slate-700 sm:block" />
            <div>
              <span className="text-text-heading dark:text-white font-bold text-sm">100%</span> Practical Project Sandboxes
            </div>
            <div className="hidden h-3 w-px bg-slate-300 dark:bg-slate-700 sm:block" />
            <div>
              <span className="text-primary-blue dark:text-blue-400 font-bold text-sm">AI Readiness</span> Evaluation
            </div>
          </div>
        </div>

        {/* 3D scene — order-last on mobile so the headline still owns the fold */}
        <div className="order-last w-full lg:order-none">
          <AboutHeroVisual />
        </div>
      </div>

      {/* Infinite Loop Animation Showcase (2 Continuous Seamless Rows) */}
      <div className="relative z-10 my-6 w-full overflow-hidden space-y-3 pointer-events-none select-none">
        {/* Row 1 - Leftward Infinite Flow */}
        <div className="flex gap-4 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <motion.div
            animate={reducedMotion ? false : { x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 24,
            }}
            className="flex gap-4 shrink-0"
          >
            {[...INFINITE_CARDS_ROW1, ...INFINITE_CARDS_ROW1].map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-2xl border border-border dark:border-slate-800/80 bg-white dark:bg-surface-secondary px-4 py-3 shadow-[0_4px_16px_rgba(15,23,42,0.04)] shrink-0"
                >
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${card.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-text-heading dark:text-white whitespace-nowrap">{card.label}</div>
                    <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">{card.tag}</div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Row 2 - Rightward Infinite Flow */}
        <div className="flex gap-4 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <motion.div
            animate={reducedMotion ? false : { x: ["-50%", "0%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 28,
            }}
            className="flex gap-4 shrink-0"
          >
            {[...INFINITE_CARDS_ROW2, ...INFINITE_CARDS_ROW2].map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-2xl border border-border dark:border-slate-800/80 bg-white dark:bg-surface-secondary px-4 py-3 shadow-[0_4px_16px_rgba(15,23,42,0.04)] shrink-0"
                >
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${card.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-text-heading dark:text-white whitespace-nowrap">{card.label}</div>
                    <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">{card.tag}</div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Bottom Scroll Cue */}
      <div className="relative z-10 mx-auto max-w-[1280px] w-full flex items-end justify-between border-t border-border dark:border-slate-800/80 pt-4">
        <div className="flex items-center gap-2.5 text-xs font-bold tracking-wider text-text-body dark:text-slate-400 uppercase">
          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-surface-secondary text-primary-blue dark:text-blue-400 shadow-xs animate-bounce">
            <ArrowDown className="h-3.5 w-3.5" />
          </div>
          <span className="text-text-heading dark:text-white">Scroll to Explore</span>
        </div>

        <div className="text-right font-mono text-xs text-text-body dark:text-slate-400">
          <span className="text-primary-blue dark:text-blue-400 font-bold">01</span> / 06 • <span className="uppercase text-slate-400 dark:text-slate-400">Philosophy</span>
        </div>
      </div>
    </section>
  );
}
