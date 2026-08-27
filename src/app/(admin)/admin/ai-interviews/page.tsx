"use client";

import React from "react";
import { BrainCircuit, Sparkles, Award } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { ADMIN_AI_INTERVIEWS } from "@/lib/data/admin";
import { TiltCard } from "@/components/interactions/tilt-card";
import { Reveal } from "@/lib/motion/reveal";

export default function AdminAiInterviewsPage() {
  const completed = ADMIN_AI_INTERVIEWS.filter((i) => i.status === "Completed");
  const avgScore = Math.round(
    completed.reduce((sum, i) => sum + i.score, 0) / (completed.length || 1)
  );

  return (
    <>
      <DashboardTopbar
        title="AI Interviews"
        subtitle="Real-time AI behavioral and technical interview evaluations."
        userInitials="AD"
      />

      <div className="flex-1 space-y-6 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4">
        {/* Metric Cards */}
        <Reveal variant="stagger" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <TiltCard>
          <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Interviews</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-[#2563EB]">
                <BrainCircuit className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-extrabold text-slate-900">1,920</div>
            <div className="mt-1 text-xs text-emerald-600 font-semibold">+18% this month</div>
          </div>
          </TiltCard>

          <TiltCard>
          <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Average Candidate Score</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Award className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-extrabold text-slate-900">{avgScore} / 100</div>
            <div className="mt-1 text-xs text-emerald-600 font-semibold">Tier 1 Placement Ready</div>
          </div>
          </TiltCard>

          <TiltCard>
          <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">AI Neural Engine</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-extrabold text-slate-900">v4.2 Active</div>
            <div className="mt-1 text-xs text-slate-500 font-medium">Real-time voice & coding analysis</div>
          </div>
          </TiltCard>
        </Reveal>

        {/* Interviews Table */}
        <div className="rounded-[20px] border border-white/70 bg-white/80 p-4 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                  <th className="pb-3 pr-4 pl-0">Student</th>
                  <th className="px-4 pb-3">Technology Stack</th>
                  <th className="px-4 pb-3">Interview Type</th>
                  <th className="px-4 pb-3 text-center">Score</th>
                  <th className="px-4 pb-3 text-center">Status</th>
                  <th className="pr-0 pb-3 pl-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {ADMIN_AI_INTERVIEWS.map((row, i) => (
                  <tr key={`${row.student}-${i}`} className="transition-colors hover:bg-slate-50/60">
                    <td className="py-4 pr-4 pl-0 font-bold text-slate-900 whitespace-nowrap">
                      {row.student}
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-700 whitespace-nowrap">
                      <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                        {row.technology}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-600 whitespace-nowrap">
                      {row.type}
                    </td>
                    <td className="px-4 py-4 text-center whitespace-nowrap">
                      {row.status === "Completed" ? (
                        <span
                          className={`font-extrabold ${
                            row.score >= 85
                              ? "text-emerald-600"
                              : row.score >= 70
                                ? "text-[#2563EB]"
                                : "text-amber-600"
                          }`}
                        >
                          {row.score}/100
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          row.status === "Completed"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="pr-0 py-4 pl-4 text-right font-medium text-slate-500 whitespace-nowrap">
                      {row.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
