"use client";

import React from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Video,
  Clock,
  Award,
  Star,
  CheckCircle2,
  PieChart,
  Activity,
} from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { TiltCard } from "@/components/interactions/tilt-card";
import { Reveal } from "@/lib/motion/reveal";

export default function InstructorAnalyticsPage() {
  return (
    <>
      <DashboardTopbar
        title="Teaching & Academic Analytics"
        subtitle="Monitor video completion metrics, assessment pass distributions, and student satisfaction."
        userInitials="RK"
      />

      <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8 lg:pt-4 max-w-7xl mx-auto w-full">
        {/* Top 4 Metric Summaries */}
        <Reveal variant="stagger" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <TiltCard>
            <div className="flex h-full flex-col justify-between rounded-[20px] border border-white/70 bg-white/90 p-5 shadow-[0_8px_30px_rgb(20,50,100,0.04)] backdrop-blur-xl">
              <span className="text-xs font-bold text-slate-500 uppercase">Avg Course Completion</span>
              <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">81.4%</div>
              <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-emerald-600">
                <TrendingUp className="h-3.5 w-3.5" /> +6.2% vs last term
              </div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="flex h-full flex-col justify-between rounded-[20px] border border-white/70 bg-white/90 p-5 shadow-[0_8px_30px_rgb(20,50,100,0.04)] backdrop-blur-xl">
              <span className="text-xs font-bold text-slate-500 uppercase">Total Watch Hours</span>
              <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">14,820 hrs</div>
              <div className="mt-1 text-xs font-medium text-slate-400">Across 3 courses</div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="flex h-full flex-col justify-between rounded-[20px] border border-white/70 bg-white/90 p-5 shadow-[0_8px_30px_rgb(20,50,100,0.04)] backdrop-blur-xl">
              <span className="text-xs font-bold text-slate-500 uppercase">1st-Attempt Pass Rate</span>
              <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">86.8%</div>
              <div className="mt-1 text-xs font-semibold text-blue-600">High comprehension</div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="flex h-full flex-col justify-between rounded-[20px] border border-white/70 bg-white/90 p-5 shadow-[0_8px_30px_rgb(20,50,100,0.04)] backdrop-blur-xl">
              <span className="text-xs font-bold text-slate-500 uppercase">Student Satisfaction</span>
              <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">98.2%</div>
              <div className="mt-1 text-xs font-medium text-amber-500 flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400" /> 4.9/5.0 average
              </div>
            </div>
          </TiltCard>
        </Reveal>

        {/* Charts & Breakdowns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Module Engagement Rate Chart */}
          <div className="rounded-[22px] border border-white/70 bg-white/90 p-6 shadow-[0_8px_30px_rgb(20,50,100,0.04)] backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[#2563EB]" />
                <h3 className="text-sm font-bold text-slate-900">Module-by-Module Completion Rate</h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">Java Full Stack Track</span>
            </div>

            <div className="space-y-3 pt-2">
              {[
                { module: "Module 1: Java OOP & Concurrency", rate: 96 },
                { module: "Module 2: Spring Boot 3 & REST", rate: 91 },
                { module: "Module 3: Hibernate & Distributed DBs", rate: 84 },
                { module: "Module 4: Kafka Event Sourcing", rate: 79 },
                { module: "Module 5: Microservices Capstone", rate: 74 },
              ].map((item) => (
                <div key={item.module} className="space-y-1 text-xs">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>{item.module}</span>
                    <span>{item.rate}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#60A5FA]"
                      style={{ width: `${item.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assessment Score Distribution */}
          <div className="rounded-[22px] border border-white/70 bg-white/90 p-6 shadow-[0_8px_30px_rgb(20,50,100,0.04)] backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#2563EB]" />
                <h3 className="text-sm font-bold text-slate-900">Grade Score Distribution</h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">All 3,520 Students</span>
            </div>

            <div className="grid grid-cols-4 gap-3 pt-2">
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-4 text-center">
                <div className="text-xl font-extrabold text-emerald-700">62%</div>
                <div className="text-[11px] font-bold text-emerald-900 mt-1">90 - 100%</div>
                <div className="text-[10px] text-emerald-600">Distinction</div>
              </div>
              <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4 text-center">
                <div className="text-xl font-extrabold text-blue-700">26%</div>
                <div className="text-[11px] font-bold text-blue-900 mt-1">75 - 89%</div>
                <div className="text-[10px] text-blue-600">First Class</div>
              </div>
              <div className="rounded-xl border border-amber-100 bg-amber-50/70 p-4 text-center">
                <div className="text-xl font-extrabold text-amber-700">9%</div>
                <div className="text-[11px] font-bold text-amber-900 mt-1">60 - 74%</div>
                <div className="text-[10px] text-amber-600">Pass</div>
              </div>
              <div className="rounded-xl border border-rose-100 bg-rose-50/70 p-4 text-center">
                <div className="text-xl font-extrabold text-rose-700">3%</div>
                <div className="text-[11px] font-bold text-rose-900 mt-1">&lt; 60%</div>
                <div className="text-[10px] text-rose-600">Retry</div>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600 leading-relaxed border border-slate-100">
              <span className="font-bold text-slate-900">Teaching Insight:</span> Students demonstrate highest retention on Microservices Outbox coding assignments due to comprehensive step-by-step video breakdowns.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
