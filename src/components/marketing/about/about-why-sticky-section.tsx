"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Cpu,
  Layers,
  Sparkles,
  TrendingUp,
  Award,
  CheckCircle2,
  Users,
  Compass,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

const PILLARS = [
  {
    num: "01",
    mobileLabel: "Practical",
    shortLabel: "Practical Sandboxes",
    title: "LEARNING SHOULD BE PRACTICAL.",
    subtitle: "Concepts become powerful when you put them into practice.",
    description:
      "Students should not only understand concepts. They should know how to apply them to build production-grade software, solve edge cases, and design scalable architectures.",
    badge: "Hands-on Sandboxes",
    visual: {
      type: "code",
      title: "Real-World Distributed Pipeline",
      codeSnippet: `// 01: Practical Microservice Architecture
@Service
public class LearningEngine {
    public CareerOutcome transform(Student student) {
        return student.applyPracticalKnowledge()
                      .buildProductionCapstones()
                      .evaluateWithAiReadiness();
    }
}`,
      tag: "Spring Boot 3 + Kafka + React 19",
    },
  },
  {
    num: "02",
    mobileLabel: "Skills",
    shortLabel: "Industry Skills",
    title: "SKILLS CREATE OPPORTUNITIES.",
    subtitle: "Direct industry capability outweighs mere completion certificates.",
    description:
      "JKS Learning focuses on developing skills that students can use in academics, projects, careers, and the real world — bridging the gap between classroom theory and enterprise readiness.",
    badge: "Industry Competency",
    visual: {
      type: "skills",
      title: "Enterprise Skill Matrix",
      skillsList: [
        { name: "Distributed Systems & Cloud", level: "Production Tier" },
        { name: "Full Stack Architecture", level: "Industry Standard" },
        { name: "AI-Evaluated Interview Readiness", level: "92nd Percentile" },
        { name: "SAP S/4HANA Cloud Integration", level: "Enterprise Tier" },
      ],
      tag: "Direct Job Placement Focus",
    },
  },
  {
    num: "03",
    mobileLabel: "Potential",
    shortLabel: "Personalized Growth",
    title: "EVERY STUDENT HAS POTENTIAL.",
    subtitle: "The right mentorship unlocks extraordinary talent.",
    description:
      "Our goal is to provide the right learning environment, resources, guidance, and opportunities to help students move forward with confidence and clarity at every step.",
    badge: "Personalized Growth",
    visual: {
      type: "mentorship",
      title: "Continuous Mentorship Ecosystem",
      metrics: [
        { label: "1-on-1 Faculty Mentorship", val: "Weekly Cohorts" },
        { label: "AI Interview Diagnostics", val: "Instant Diagnostic" },
        { label: "Curriculum Progression", val: "Self-Paced + Live" },
      ],
      tag: "Confidence & Growth",
    },
  },
];


export function AboutWhyStickySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const reducedMotion = useReducedMotion();

  // Track desktop scroll position to sync the pinned left sidebar
  useEffect(() => {
    const handleScroll = () => {
      // Only track on desktop
      if (window.innerWidth < 1024) return;

      const card1 = document.getElementById("pillar-01");
      const card2 = document.getElementById("pillar-02");
      const card3 = document.getElementById("pillar-03");

      if (!card1 || !card2 || !card3) return;

      const topOffset = window.innerHeight * 0.45;
      const r2 = card2.getBoundingClientRect();
      const r3 = card3.getBoundingClientRect();

      if (r3.top <= topOffset) {
        setActiveStep(2);
      } else if (r2.top <= topOffset) {
        setActiveStep(1);
      } else {
        setActiveStep(0);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentPillar = PILLARS[activeStep];

  return (
    <section
      ref={containerRef}
      className="relative bg-bg-light text-text-heading py-14 sm:py-20 lg:py-32 px-4 sm:px-6 lg:px-16 border-t border-border"
    >
      <div className="mx-auto max-w-[1280px]">
        {/* ========================================================= */}
        {/* 1. MOBILE RESPONSIVE VIEW (< lg) — 1-Card Tabbed Layout  */}
        {/* ========================================================= */}
        <div className="block lg:hidden space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary-blue">
              <Sparkles className="h-3.5 w-3.5 text-primary-blue" />
              <span>Foundational Philosophy</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-text-heading leading-tight">
              WHY JKS LEARNING?
            </h2>
            <p className="text-xs text-text-body leading-relaxed">
              We believe true education happens when theory meets real-world application, empowering every student to become a confident creator.
            </p>
          </div>

          {/* Segmented 3-Column Tab Bar (Fixed, Un-scrollable, fits 100% mobile width cleanly) */}
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-100/90 border border-slate-200/80 shadow-inner w-full">
            {PILLARS.map((p, idx) => {
              const isSelected = activeStep === idx;
              return (
                <button
                  key={p.num}
                  type="button"
                  onClick={() => setActiveStep(idx)}
                  className={`flex items-center justify-center gap-1.5 rounded-xl py-2 px-1 text-center transition-all cursor-pointer ${
                    isSelected
                      ? "bg-white text-primary-blue shadow-xs font-bold ring-1 ring-slate-200/80"
                      : "text-slate-600 hover:text-slate-900 font-medium"
                  }`}
                >
                  <span className="font-mono text-[11px] font-bold opacity-75">{p.num}</span>
                  <span className="text-xs tracking-tight">{p.mobileLabel}</span>
                </button>
              );
            })}
          </div>


          {/* Active Pillar Card (Only 1 card rendered at a time on mobile to prevent endless scrolling) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPillar.num}
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-mono text-2xl font-black text-primary-blue">
                  {currentPillar.num}
                </span>
                <span className="rounded-full bg-blue-50 border border-blue-100 text-primary-blue text-xs font-bold px-3 py-1">
                  {currentPillar.badge}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-text-heading tracking-tight leading-snug">
                  {currentPillar.title}
                </h3>
                <p className="text-xs font-bold text-primary-blue">
                  {currentPillar.subtitle}
                </p>
              </div>

              <p className="text-xs text-text-body leading-relaxed">
                {currentPillar.description}
              </p>

              {/* Visual Demo Card */}
              <div className="rounded-2xl border border-slate-200/80 bg-slate-900 text-white p-4 space-y-2.5 shadow-inner">
                <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                  <span className="font-bold text-cyan-300 flex items-center gap-1.5 text-xs">
                    <Code2 className="h-3.5 w-3.5" /> {currentPillar.visual.title}
                  </span>
                </div>

                {currentPillar.visual.type === "code" && (
                  <pre className="font-mono text-[11px] text-slate-300 overflow-x-auto p-2 bg-slate-950/70 rounded-xl leading-relaxed">
                    <code>{currentPillar.visual.codeSnippet}</code>
                  </pre>
                )}

                {currentPillar.visual.type === "skills" && (
                  <div className="grid grid-cols-1 gap-2 pt-1">
                    {currentPillar.visual.skillsList?.map((s, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 text-xs"
                      >
                        <span className="font-medium text-slate-200">{s.name}</span>
                        <span className="font-mono text-[10px] text-emerald-400 font-bold">{s.level}</span>
                      </div>
                    ))}
                  </div>
                )}

                {currentPillar.visual.type === "mentorship" && (
                  <div className="grid grid-cols-3 gap-1.5 pt-1">
                    {currentPillar.visual.metrics?.map((m, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-xl bg-white/5 border border-white/5 text-center space-y-0.5"
                      >
                        <div className="font-mono text-[11px] font-bold text-cyan-300">{m.val}</div>
                        <div className="text-[9px] text-slate-400 leading-tight">{m.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Quick Stepper Navigation */}
              <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs font-bold">
                <button
                  type="button"
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep(activeStep - 1)}
                  className="flex items-center gap-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Previous
                </button>
                <button
                  type="button"
                  disabled={activeStep === PILLARS.length - 1}
                  onClick={() => setActiveStep(activeStep + 1)}
                  className="flex items-center gap-1 text-primary-blue hover:underline disabled:opacity-30 cursor-pointer"
                >
                  Next <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ========================================================= */}
        {/* 2. DESKTOP VIEW (lg+) — Sticky Locked Left Rail Layout    */}
        {/* ========================================================= */}
        <div className="hidden lg:grid grid-cols-[380px_1fr] gap-16 items-start">
          {/* Left Pinned Sticky Column (Stationary until all 3 cards finish scrolling) */}
          <div className="sticky top-28 self-start space-y-8 z-10">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary-blue">
                <Sparkles className="h-3.5 w-3.5 text-primary-blue" />
                <span>Foundational Philosophy</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-text-heading leading-tight">
                WHY JKS
                <br />
                LEARNING?
              </h2>
              <p className="text-sm text-text-body leading-relaxed max-w-sm">
                We believe true education happens when theory meets real-world application, empowering every student to become a confident creator.
              </p>
            </div>

            {/* Step Progress Rail with Active Highlight */}
            <div className="flex flex-col gap-3 border-l-2 border-slate-200 pl-4">
              {PILLARS.map((p, idx) => {
                const isActive = activeStep === idx;
                return (
                  <button
                    key={p.num}
                    type="button"
                    onClick={() => {
                      const el = document.getElementById(`pillar-${p.num}`);
                      el?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }}
                    className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs font-mono font-bold transition-all cursor-pointer text-left ${
                      isActive
                        ? "bg-blue-50 text-primary-blue border border-blue-200 shadow-xs translate-x-1.5 font-black"
                        : "text-slate-500 hover:text-slate-900 border border-transparent"
                    }`}
                  >
                    <span className="text-sm">{p.num}</span>
                    <span>• {p.badge}</span>
                  </button>
                );
              })}
            </div>

            <div className="text-xs font-mono text-slate-400 pt-2">
              CHAPTER <span className="text-primary-blue font-bold">02 / 06</span> • THE REASON
            </div>
          </div>

          {/* Right Scrolling Story Cards (3 Distinct Steps) */}
          <div className="space-y-24">
            {PILLARS.map((pillar) => (
              <motion.div
                key={pillar.num}
                id={`pillar-${pillar.num}`}
                initial={reducedMotion ? false : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="rounded-[32px] border border-border bg-white p-10 lg:p-12 shadow-[0_12px_40px_rgba(15,23,42,0.05)] space-y-6 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)]"
              >
                {/* Header with Step Number */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="font-mono text-3xl font-black text-primary-blue">
                    {pillar.num}
                  </span>
                  <span className="rounded-full bg-blue-50 border border-blue-100 text-primary-blue text-xs font-bold px-3.5 py-1">
                    {pillar.badge}
                  </span>
                </div>

                {/* Main Pillar Headline */}
                <div className="space-y-1.5">
                  <h3 className="text-2xl lg:text-3xl font-extrabold text-text-heading tracking-tight leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="text-sm font-bold text-primary-blue">
                    {pillar.subtitle}
                  </p>
                </div>

                {/* Detailed Narrative */}
                <p className="text-sm text-text-body leading-relaxed">
                  {pillar.description}
                </p>

                {/* Visual Demonstration Sandbox Card */}
                <div className="rounded-2xl border border-slate-200/80 bg-slate-900 text-white p-6 space-y-3 shadow-inner">
                  <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2.5">
                    <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                      <Code2 className="h-4 w-4" /> {pillar.visual.title}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">{pillar.visual.tag}</span>
                  </div>

                  {pillar.visual.type === "code" && (
                    <pre className="font-mono text-xs text-slate-300 overflow-x-auto p-2 bg-slate-950/70 rounded-xl leading-relaxed">
                      <code>{pillar.visual.codeSnippet}</code>
                    </pre>
                  )}

                  {pillar.visual.type === "skills" && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {pillar.visual.skillsList?.map((s, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs"
                        >
                          <span className="font-medium text-slate-200">{s.name}</span>
                          <span className="font-mono text-[10px] text-emerald-400 font-bold">{s.level}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {pillar.visual.type === "mentorship" && (
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {pillar.visual.metrics?.map((m, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl bg-white/5 border border-white/5 text-center space-y-1"
                        >
                          <div className="font-mono text-xs font-bold text-cyan-300">{m.val}</div>
                          <div className="text-[10px] text-slate-400">{m.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
