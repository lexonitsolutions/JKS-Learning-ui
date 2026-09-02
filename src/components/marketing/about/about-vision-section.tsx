"use client";

import React from "react";
import { Sparkles, Compass, ShieldCheck, ArrowRight, Award, CheckCircle2 } from "lucide-react";
import { JksLogo } from "@/components/common/jks-logo";

export function AboutVisionSection() {
  return (
    <section className="relative bg-[#0B1120] text-white py-20 sm:py-28 lg:py-36 px-4 sm:px-6 lg:px-16 overflow-hidden selection:bg-cyan-500 selection:text-slate-950 border-t border-white/10">
      {/* Ambient Gradient Mesh Lights */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-tr from-blue-600/15 via-cyan-500/10 to-indigo-600/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-[1280px] space-y-10 sm:space-y-14">
        {/* Small Label */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-300 font-mono">
              Our Vision
            </span>
          </div>
        </div>

        {/* Main Emotional Headline */}
        <div className="max-w-4xl space-y-6">
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white">
            BUILDING A GENERATION
            <br />
            THAT IS READY FOR
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
              WHAT&apos;S NEXT.
            </span>
          </h2>

          <p className="max-w-2xl text-sm sm:text-base lg:text-xl text-slate-300 leading-relaxed">
            We believe education should do more than deliver knowledge. It should inspire curiosity, develop capability, and give students the confidence to build meaningful futures.
          </p>
        </div>

        {/* Vision Stats & Brand Signature Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 sm:pt-10 border-t border-white/10 text-xs font-mono">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-white font-sans">8,000+</div>
            <div className="text-slate-400 uppercase tracking-wider text-[11px]">Engineers Trained</div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-cyan-300 font-sans">100%</div>
            <div className="text-slate-400 uppercase tracking-wider text-[11px]">Practical Capstones</div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-sans">22,000+</div>
            <div className="text-slate-400 uppercase tracking-wider text-[11px]">AI Readiness Evaluations</div>
          </div>
        </div>

        {/* JKS Learning Emblem Signature */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10">
          <JksLogo size="sm" variant="dark" />
          <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 uppercase tracking-widest">
            JKS LEARNING • EMPOWERING TOMORROW&apos;S CREATORS
          </span>
        </div>
      </div>
    </section>
  );
}
