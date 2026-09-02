"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Compass,
  BookOpen,
  Code2,
  Hammer,
  TrendingUp,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

const STAGES = [
  {
    step: "01",
    shortName: "Discover",
    title: "DISCOVER",
    subtitle: "Find subjects, skills, and areas that interest you.",
    description:
      "Explore curated roadmaps across Java Full Stack, Modern Frontend, SAP S/4HANA, and Cloud Microservices. Discover your strengths through initial skill assessments and structured course previews.",
    icon: Compass,
    color: "from-blue-600 to-cyan-500",
    pill: "Step 01 • Exploration",
    highlights: ["Interactive Course Previews", "Free Demo Lessons", "Career Track Diagnostic"],
  },
  {
    step: "02",
    shortName: "Learn",
    title: "LEARN",
    subtitle: "Understand concepts through structured learning.",
    description:
      "Deep-dive into comprehensive, step-by-step modules taught by industry veterans. Learn architectural paradigms, design patterns, and clean code practices with zero ambiguity.",
    icon: BookOpen,
    color: "from-cyan-500 to-blue-600",
    pill: "Step 02 • Core Mastery",
    highlights: ["Live Cohorts + Self-Paced Access", "Enterprise Curriculum", "Code-along Sessions"],
  },
  {
    step: "03",
    shortName: "Practice",
    title: "PRACTICE",
    subtitle: "Apply what you learn through exercises and activities.",
    description:
      "Reinforce your technical reasoning with weekly coding challenges, timed quizzes, algorithmic exercises, and debugging sandboxes designed to test edge cases.",
    icon: Code2,
    color: "from-indigo-500 to-blue-600",
    pill: "Step 03 • Application",
    highlights: ["Interactive Code Sandboxes", "Sequential Unlock Quizzes", "Automated Evaluation"],
  },
  {
    step: "04",
    shortName: "Build",
    title: "BUILD",
    subtitle: "Create projects and solve practical problems.",
    description:
      "Architect production-grade capstones from scratch. Build multi-tenant microservices, real-time message streams, authentication systems, and cloud pipelines.",
    icon: Hammer,
    color: "from-purple-500 to-indigo-600",
    pill: "Step 04 • Creation",
    highlights: ["Full Stack Capstone Portfolio", "GitHub Code Reviews", "Docker & Cloud Deployments"],
  },
  {
    step: "05",
    shortName: "Grow",
    title: "GROW",
    subtitle: "Develop confidence and prepare for future opportunities.",
    description:
      "Test yourself against our AI Mock Interview simulator, craft an ATS-compliant resume with our builder, earn verified credentials, and transition seamlessly into high-impact tech roles.",
    icon: TrendingUp,
    color: "from-emerald-500 to-cyan-500",
    pill: "Step 05 • Transformation",
    highlights: ["AI Mock Interview Reports", "ATS Resume Maker", "Placement & Referral Support"],
  },
];

// 3 sets for a smooth continuous infinite loop
const LOOP_STAGES = [...STAGES, ...STAGES, ...STAGES];

export function AboutJourneyHorizontal() {
  const [isPaused, setIsPaused] = useState(false);
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative bg-bg-light text-text-heading py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-16 border-t border-border overflow-hidden">
      <div className="mx-auto max-w-[1280px] space-y-8 sm:space-y-12">
        {/* Clean Section Header (Numbers and play/pause buttons removed) */}
        <div className="space-y-2.5 max-w-2xl border-b border-border pb-6 sm:pb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary-blue">
            <Sparkles className="h-3.5 w-3.5 text-primary-blue" />
            <span>Continuous Learning Journey</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-text-heading leading-tight">
            FROM CURIOUS
            <br />
            TO CAPABLE.
          </h2>
          <p className="text-xs sm:text-sm text-text-body leading-relaxed">
            A continuous 5-stage transformation that turns curiosity into verified competence and career readiness.
          </p>
        </div>

        {/* Fast & Fluid Looping Infinite Card Rail */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)] py-2"
        >
          <motion.div
            animate={
              reducedMotion || isPaused
                ? { x: "0%" }
                : { x: ["0%", "-33.333%"] }
            }
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 8,
            }}

            className="flex gap-6 shrink-0"
          >
            {LOOP_STAGES.map((stage, idx) => {
              const Icon = stage.icon;

              return (
                <div
                  key={`${stage.step}-${idx}`}
                  className="w-[300px] sm:w-[360px] lg:w-[390px] shrink-0 rounded-[32px] border border-border bg-white p-6 sm:p-8 transition-all duration-300 hover:border-primary-blue hover:shadow-[0_20px_50px_rgba(37,99,235,0.12)] hover:-translate-y-1 space-y-5 flex flex-col justify-between shadow-xs cursor-default"
                >
                  {/* Card Top Pill */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-black text-primary-blue">
                      {stage.step}
                    </span>
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr ${stage.color} text-white shadow-md`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  {/* Card Heading & Subtitle */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono">
                      {stage.pill}
                    </span>
                    <h3 className="text-2xl font-extrabold text-text-heading tracking-tight">
                      {stage.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-primary-blue leading-snug">
                      {stage.subtitle}
                    </p>
                  </div>

                  {/* Narrative Description */}
                  <p className="text-xs sm:text-sm text-text-body leading-relaxed">
                    {stage.description}
                  </p>

                  {/* Highlights List */}
                  <div className="border-t border-slate-100 pt-4 space-y-2">
                    {stage.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
