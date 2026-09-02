"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Terminal,
  Cpu,
  Compass,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Layers,
  GraduationCap,
  PlayCircle,
  FileCode,
  ShieldCheck,
  BrainCircuit,
} from "lucide-react";

const CAPABILITIES = [
  {
    num: "01",
    tag: "CURRICULUM ARCHITECTURE",
    title: "STRUCTURED COURSES",
    headline: "Learn concepts through structured and accessible courses designed for continuous learning.",
    description:
      "Every track is engineered from fundamentals to advanced cloud architectures with modular, bite-sized lessons, self-paced progress tracking, and zero filler content.",
    features: [
      "Modular hierarchical curriculum (Course → Module → Topic → Lesson)",
      "Industry-verified frameworks (Spring Boot 3, React 19, SAP Cloud, .NET 9)",
      "High-definition video lessons with downloadable source code",
    ],
    ctaText: "Browse All Courses",
    ctaHref: "/courses",
    visual: {
      type: "curriculum",
      items: [
        "Module 01: Core Architecture & Design Patterns",
        "Module 02: Microservices & Event-Driven Systems",
        "Module 03: Distributed State & Database Partitioning",
        "Module 04: Production Deployment & AWS Cloud",
      ],
    },
  },
  {
    num: "02",
    tag: "HANDS-ON PRODUCTION",
    title: "PRACTICAL LEARNING",
    headline: "Move beyond theory through projects, activities, and real-world applications.",
    description:
      "Students build complete end-to-end full stack projects with live databases, microservice pipelines, authentication, payment gateways, and cloud deployments.",
    features: [
      "100% production-aligned capstone engineering",
      "Git branch workflows, code reviews, and Docker containerization",
      "Real-world edge cases: concurrency, caching, and rate limiting",
    ],
    ctaText: "Explore Capstones",
    ctaHref: "/courses",
    visual: {
      type: "terminal",
      title: "jks-sandbox-runner ~ npm run test:production",
      logs: [
        "✓ Microservice cluster initialized: 4 nodes running",
        "✓ Kafka message broker: 10,000 events/sec ingested",
        "✓ Database transaction latency: 4.2ms (p99)",
        "✓ Production build passing: 0 errors, 100% test coverage",
      ],
    },
  },
  {
    num: "03",
    tag: "PROFESSIONAL COMPETENCY",
    title: "SKILL DEVELOPMENT",
    headline: "Build technical, creative, and professional skills that prepare you for future opportunities.",
    description:
      "Beyond coding syntax, develop the problem-solving mindset, algorithmic intuition, and architectural reasoning demanded by global technology leaders.",
    features: [
      "Data Structures, Algorithms & Complexity Optimization",
      "Clean Architecture & SOLID design principles",
      "ATS-compliant Resume Maker & Technical Portfolio Showcase",
    ],
    ctaText: "Try Resume Maker",
    ctaHref: "/dashboard/resume-builder",
    visual: {
      type: "skills-tree",
      categories: [
        { label: "Backend Core", skills: ["Java 21", "Spring Boot", "C# .NET", "Go"] },
        { label: "Frontend Core", skills: ["React 19", "Next.js 15", "TypeScript", "Tailwind"] },
        { label: "Cloud & DevOps", skills: ["Docker", "Kubernetes", "AWS", "Kafka"] },
      ],
    },
  },
  {
    num: "04",
    tag: "MENTORSHIP & READINESS",
    title: "AI GUIDANCE & ADVICE",
    headline: "Learn with structured guidance and resources that help you understand what to learn and how to improve.",
    description:
      "Get continuous diagnostic feedback through our proprietary AI Mock Interview system, evaluating technical clarity, behavioral articulation, and system design readiness.",
    features: [
      "AI Mock Interviews with real-time audio evaluation",
      "5-axis readiness radar report (Technical, Architecture, Communication, Edge Cases)",
      "Weekly live faculty Q&A and placement guidance",
    ],
    ctaText: "Take AI Mock Interview",
    ctaHref: "/ai-mock-interview",
    visual: {
      type: "ai-radar",
      score: "94 / 100",
      readiness: "Interview Ready",
      pillars: ["Technical Depth (95%)", "System Architecture (92%)", "Communication (94%)", "Edge Cases (90%)"],
    },
  },
];

export function AboutWhatWeProvide() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="relative bg-white text-text-heading py-20 lg:py-32 px-6 lg:px-16 border-t border-border overflow-hidden">
      <div className="mx-auto max-w-[1280px] space-y-16">
        {/* Section Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary-blue">
            <Sparkles className="h-3.5 w-3.5 text-primary-blue" />
            <span>The JKS Learning Ecosystem</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-text-heading leading-tight">
            EVERYTHING YOU NEED
            <br />
            TO KEEP LEARNING.
          </h2>
          <p className="text-base text-text-body leading-relaxed">
            A complete, integrated ecosystem engineered to take you from foundational concepts to enterprise mastery and career readiness.
          </p>
        </div>

        {/* 4 Large Editorial Capability Panels */}
        <div className="space-y-12">
          {CAPABILITIES.map((panel, idx) => (
            <div
              key={panel.num}
              className="rounded-[36px] border border-border bg-slate-50/50 p-8 sm:p-12 lg:p-16 shadow-[0_12px_40px_rgba(15,23,42,0.04)] transition-all duration-300 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)] grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-center"
            >
              {/* Left Column: Narrative Content */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-2xl sm:text-3xl font-black text-primary-blue">
                    {panel.num}
                  </span>
                  <div className="h-4 w-px bg-slate-300" />
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500 font-mono">
                    {panel.tag}
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-text-heading tracking-tight">
                    {panel.title}
                  </h3>
                  <p className="text-base sm:text-lg font-semibold text-primary-blue leading-snug">
                    {panel.headline}
                  </p>
                </div>

                <p className="text-sm sm:text-base text-text-body leading-relaxed">
                  {panel.description}
                </p>

                {/* Feature Bullets */}
                <ul className="space-y-2.5 pt-2">
                  {panel.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-2">
                  <Link
                    href={panel.ctaHref}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary-blue px-6 py-3 text-xs font-bold text-white shadow-md shadow-primary-blue/25 hover:bg-blue-600 transition-all cursor-pointer"
                  >
                    <span>{panel.ctaText}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Visual Artifact */}
              <div className="rounded-3xl border border-slate-200 bg-slate-900 text-white p-6 sm:p-8 shadow-xl space-y-4">
                {panel.visual.type === "curriculum" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs border-b border-white/10 pb-3">
                      <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                        <BookOpen className="h-4 w-4" /> Live Course Hierarchy
                      </span>
                      <span className="font-mono text-[10px] text-emerald-400">● 100% Industry Aligned</span>
                    </div>
                    <div className="space-y-2 font-mono text-xs">
                      {panel.visual.items?.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <span className="h-2 w-2 rounded-full bg-cyan-400" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {panel.visual.type === "terminal" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs border-b border-white/10 pb-3">
                      <span className="font-bold text-emerald-400 flex items-center gap-1.5 font-mono">
                        <Terminal className="h-4 w-4" /> {panel.visual.title}
                      </span>
                    </div>
                    <div className="space-y-1.5 font-mono text-[11px] text-slate-300 p-2 bg-slate-950/80 rounded-xl leading-relaxed">
                      {panel.visual.logs?.map((log, i) => (
                        <div key={i} className="text-emerald-400/90 font-medium">
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {panel.visual.type === "skills-tree" && (
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between text-xs border-b border-white/10 pb-3">
                      <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                        <Cpu className="h-4 w-4" /> Full Spectrum Stack Mastery
                      </span>
                    </div>
                    <div className="space-y-3">
                      {panel.visual.categories?.map((cat, i) => (
                        <div key={i} className="space-y-1.5">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{cat.label}</div>
                          <div className="flex flex-wrap gap-1.5">
                            {cat.skills.map((s, si) => (
                              <span
                                key={si}
                                className="rounded-lg bg-white/10 border border-white/10 px-2.5 py-1 text-xs font-mono text-slate-200"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {panel.visual.type === "ai-radar" && (
                  <div className="space-y-4 text-center">
                    <div className="flex items-center justify-between text-xs border-b border-white/10 pb-3 text-left">
                      <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                        <BrainCircuit className="h-4 w-4" /> AI Mock Interview Diagnostics
                      </span>
                      <span className="rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5">
                        {panel.visual.readiness}
                      </span>
                    </div>
                    <div className="py-2">
                      <div className="text-4xl font-black font-mono text-cyan-300">{panel.visual.score}</div>
                      <div className="text-xs text-slate-400 mt-1">Evaluated across 25+ real-time response parameters</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-left text-xs">
                      {panel.visual.pillars?.map((p, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-[11px] text-slate-300">
                          {p}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
