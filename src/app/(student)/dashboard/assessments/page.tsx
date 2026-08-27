"use client";

import React, { useState } from "react";
import { ClipboardCheck, CheckCircle2, Clock, PlayCircle } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { TakeAssessmentModal } from "@/components/student/take-assessment-modal";
import { Reveal } from "@/lib/motion/reveal";
import { TiltCard } from "@/components/interactions/tilt-card";

interface AssessmentRow {
  title: string;
  course: string;
  score: number;
  status: "Passed" | "Failed" | "Pending";
  date: string;
}

const INITIAL_ASSESSMENTS: AssessmentRow[] = [
  { title: "Core Java & OOP — Module Test", course: "Java Full Stack Developer Mastery", score: 88, status: "Passed", date: "2026-08-10" },
  { title: "Spring Boot & REST APIs — Module Test", course: "Java Full Stack Developer Mastery", score: 74, status: "Passed", date: "2026-08-17" },
  { title: "Web Fundamentals — Module Test", course: "Modern Frontend Engineering with React", score: 0, status: "Pending", date: "—" },
];

const STATUS_STYLE: Record<AssessmentRow["status"], string> = {
  Passed: "bg-emerald-50 text-emerald-700",
  Failed: "bg-rose-50 text-rose-700",
  Pending: "bg-amber-50 text-amber-700",
};

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState<AssessmentRow[]>(INITIAL_ASSESSMENTS);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const passedCount = assessments.filter((a) => a.status === "Passed").length;
  const pendingCount = assessments.filter((a) => a.status === "Pending").length;
  const avgScore = Math.round(
    assessments.filter((a) => a.status !== "Pending").reduce((sum, a) => sum + a.score, 0) /
      (assessments.filter((a) => a.status !== "Pending").length || 1)
  );

  const activeAssessment = activeIndex !== null ? assessments[activeIndex] : null;

  const handleSubmitScore = (score: number) => {
    if (activeIndex === null) return;
    setAssessments((prev) =>
      prev.map((a, idx) =>
        idx === activeIndex
          ? {
              ...a,
              score,
              status: score >= 70 ? "Passed" : "Failed",
              date: new Date().toISOString().slice(0, 10),
            }
          : a
      )
    );
    setActiveIndex(null);
  };

  return (
    <>
      <DashboardTopbar
        title="Assessments"
        subtitle="Module tests and coding assessments across your courses"
      />

      <div className="flex-1 space-y-6 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4">
        {/* Metric Cards */}
        <Reveal variant="stagger" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <TiltCard>
            <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Passed</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-extrabold text-slate-900">{passedCount}</div>
              <div className="mt-1 text-xs text-emerald-600 font-semibold">of {assessments.length} total assessments</div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Average Score</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-[#2563EB]">
                  <ClipboardCheck className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-extrabold text-slate-900">{avgScore}/100</div>
              <div className="mt-1 text-xs text-[#2563EB] font-semibold">Across completed attempts</div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Awaiting You</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                  <Clock className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-extrabold text-slate-900">{pendingCount}</div>
              <div className="mt-1 text-xs text-amber-600 font-semibold">Ready to attempt now</div>
            </div>
          </TiltCard>
        </Reveal>

        {/* Table */}
        <div className="rounded-[20px] border border-white/70 bg-white/80 p-4 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[550px]">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                  <th className="pb-3 pr-4 pl-0">Assessment</th>
                  <th className="px-4 pb-3">Course</th>
                  <th className="px-4 pb-3">Score</th>
                  <th className="px-4 pb-3">Status</th>
                  <th className="px-4 pb-3">Date</th>
                  <th className="pr-0 pb-3 pl-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {assessments.map((a, idx) => (
                  <tr key={a.title} className="transition-colors hover:bg-slate-50/60">
                    <td className="py-4 pr-4 pl-0 font-bold text-slate-900 whitespace-nowrap">{a.title}</td>
                    <td className="px-4 py-4 font-medium text-slate-600 whitespace-nowrap">{a.course}</td>
                    <td className="px-4 py-4 font-semibold text-slate-700 whitespace-nowrap">
                      {a.status === "Pending" ? "—" : `${a.score}/100`}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_STYLE[a.status]}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-500 whitespace-nowrap">{a.date}</td>
                    <td className="pr-0 py-4 pl-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setActiveIndex(idx)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-[#2563EB] shadow-xs hover:bg-[#EFF6FF] transition-colors"
                      >
                        <PlayCircle className="h-3.5 w-3.5" />
                        {a.status === "Pending" ? "Take Assessment" : "Retake"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <TakeAssessmentModal
        isOpen={activeAssessment !== null}
        title={activeAssessment?.title ?? ""}
        course={activeAssessment?.course ?? ""}
        onClose={() => setActiveIndex(null)}
        onSubmit={handleSubmitScore}
      />
    </>
  );
}
