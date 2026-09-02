"use client";

import React, { useState } from "react";
import {
  Code2,
  FolderGit2,
  Cpu,
  Palette,
  Users2,
  Lightbulb,
  Sparkles,
  ArrowRight,
  Terminal,
} from "lucide-react";

const REAL_WORLD_PILLARS = [
  {
    id: "coding",
    title: "Production Coding",
    icon: Code2,
    description: "Write clean, maintainable, performant code designed for enterprise codebases with Git version control.",
    metric: "10,000+ Lines of Production Code",
  },
  {
    id: "projects",
    title: "Capstone Projects",
    icon: FolderGit2,
    description: "Architect full stack applications solving tangible commerce, logistics, and fintech problems.",
    metric: "4 Portfolio Capstones per Track",
  },
  {
    id: "tech",
    title: "Modern Tech Stacks",
    icon: Cpu,
    description: "Harness modern frameworks: Spring Boot 3, Next.js 15, Kafka, Docker, SAP ABAP Cloud, and Azure.",
    metric: "Zero Legacy Outdated Curriculum",
  },
  {
    id: "creativity",
    title: "Architectural Creativity",
    icon: Palette,
    description: "Design elegant microservice architectures, intuitive user interfaces, and robust distributed caches.",
    metric: "Design Patterns & UI/UX Best Practices",
  },
  {
    id: "collaboration",
    title: "Peer Collaboration",
    icon: Users2,
    description: "Engage in pair programming, peer pull request reviews, and agile team sprint ceremonies.",
    metric: "Weekly Cohort Sync & Standups",
  },
  {
    id: "problem-solving",
    title: "Algorithmic Problem Solving",
    icon: Lightbulb,
    description: "Master computational thinking, concurrency debugging, performance profiling, and system bottlenecks.",
    metric: "Edge Case & System Design Scenarios",
  },
];

export function AboutBeyondClassroom() {
  const [activePillar, setActivePillar] = useState(REAL_WORLD_PILLARS[0]);

  return (
    <section className="relative bg-white text-text-heading py-20 lg:py-32 px-6 lg:px-16 border-t border-border overflow-hidden">
      <div className="mx-auto max-w-[1280px] space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary-blue">
            <Sparkles className="h-3.5 w-3.5 text-primary-blue" />
            <span>Applied Education</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-text-heading leading-tight">
            DON&apos;T JUST LEARN IT.
            <br />
            <span className="text-primary-blue">USE IT.</span>
          </h2>
          <p className="text-sm sm:text-base text-text-body max-w-2xl mx-auto leading-relaxed">
            JKS Learning encourages students to take what they learn beyond textbooks and classrooms — into projects, experiments, technology, creativity, and real-world problem solving.
          </p>
        </div>

        {/* 6 Real-World Pillar Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REAL_WORLD_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            const isSelected = activePillar.id === pillar.id;

            return (
              <div
                key={pillar.id}
                onMouseEnter={() => setActivePillar(pillar)}
                className={`rounded-[28px] border p-8 transition-all duration-300 cursor-pointer space-y-4 flex flex-col justify-between ${
                  isSelected
                    ? "border-primary-blue bg-blue-50/40 shadow-lg shadow-primary-blue/5 ring-1 ring-primary-blue/20"
                    : "border-border bg-slate-50/50 hover:bg-white hover:border-slate-300 shadow-xs"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-200 text-primary-blue shadow-xs">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      Applied
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-text-heading">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-text-body leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/60 font-mono text-[11px] font-bold text-primary-blue">
                  {pillar.metric}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
