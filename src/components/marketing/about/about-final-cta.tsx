"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles, ShieldCheck } from "lucide-react";

export function AboutFinalCta() {
  return (
    <section className="relative bg-bg-light dark:bg-background text-text-heading dark:text-white py-24 lg:py-36 px-6 lg:px-16 border-t border-border dark:border-slate-800/80 overflow-hidden transition-colors duration-300">
      <div className="mx-auto max-w-4xl text-center space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-blue dark:text-blue-400">
          <Sparkles className="h-3.5 w-3.5 text-primary-blue dark:text-blue-400" />
          <span>Begin Your Transformation</span>
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-text-heading dark:text-white leading-tight">
          YOUR LEARNING JOURNEY
          <br />
          <span className="text-primary-blue dark:text-blue-400">STARTS HERE.</span>
        </h2>

        <p className="text-lg sm:text-xl text-text-body dark:text-slate-300 font-medium tracking-wide">
          Explore. Learn. Practice. Build. Grow.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/courses"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-primary-fill px-8 py-4 text-sm font-bold text-white shadow-lg shadow-primary-blue/25 hover:bg-blue-600 transition-all cursor-pointer"
          >
            <span>Explore JKS Learning</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/register-course"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 dark:border-slate-700/80 bg-white dark:bg-surface-secondary px-8 py-4 text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-surface-elevated transition-all cursor-pointer"
          >
            <BookOpen className="h-4 w-4 text-primary-blue dark:text-blue-400" />
            <span>Start Learning</span>
          </Link>
        </div>

        <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200/80 dark:border-slate-800">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> 100% Practical Sandboxes
          </span>
          <span>•</span>
          <span>Live Faculty Mentorship</span>
          <span>•</span>
          <span>AI Mock Interview Included</span>
        </div>
      </div>
    </section>
  );
}
