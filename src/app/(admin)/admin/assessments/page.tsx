"use client";

import React, { useState } from "react";
import { ClipboardCheck, CheckCircle2, Clock, Plus } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { ADMIN_ASSESSMENTS, type AdminAssessmentRow } from "@/lib/data/admin";
import { AddAssignmentModal } from "@/components/admin/add-assignment-modal";
import { TiltCard } from "@/components/interactions/tilt-card";
import { Reveal } from "@/lib/motion/reveal";

export default function AdminAssessmentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assessments, setAssessments] = useState<AdminAssessmentRow[]>(ADMIN_ASSESSMENTS);

  const totalSubmissions = assessments.reduce((sum, a) => sum + a.submissions, 0);
  const totalPending = assessments.reduce((sum, a) => sum + a.pendingReview, 0);

  const handleCreateAssignment = (assignment: AdminAssessmentRow) => {
    setAssessments([assignment, ...assessments]);
  };

  return (
    <>
      <DashboardTopbar
        title="Assessments"
        subtitle={`${assessments.length} stage assessments configured with sequential unlock logic.`}
        userInitials="AD"
      />

      <div className="flex-1 space-y-5 p-3 sm:p-6 lg:p-8 lg:pt-4">
        {/* Top Action Bar - Placed at Right Side Corner */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-[#2563EB] px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs font-bold text-white shadow-[0_4px_14px_rgba(37,99,235,0.3)] hover:bg-blue-700 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>New Assignment</span>
          </button>
        </div>

        {/* Metric Cards */}
        <Reveal variant="stagger" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <TiltCard>
            <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Total Submissions</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-[#2563EB]">
                  <ClipboardCheck className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-extrabold text-slate-900">
                {totalSubmissions.toLocaleString()}
              </div>
              <div className="mt-1 text-xs text-emerald-600 font-semibold">Across all course stages</div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Avg Passing Rate</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-extrabold text-slate-900">76.4%</div>
              <div className="mt-1 text-xs text-emerald-600 font-semibold">+3.1% this month</div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Pending Review</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                  <Clock className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-extrabold text-slate-900">{totalPending}</div>
              <div className="mt-1 text-xs text-amber-600 font-semibold">Requires trainer evaluation</div>
            </div>
          </TiltCard>
        </Reveal>

        {/* Table */}
        <div className="rounded-[20px] border border-white/70 bg-white/80 p-4 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                  <th className="pb-3 pr-4 pl-0">Assessment Title</th>
                  <th className="px-4 pb-3">Associated Course</th>
                  <th className="px-4 pb-3">Type</th>
                  <th className="px-4 pb-3">Submissions</th>
                  <th className="px-4 pb-3 text-center">Avg. Score</th>
                  <th className="pr-0 pb-3 pl-4 text-right">Review Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {assessments.map((a) => (
                  <tr key={`${a.title}-${a.course}`} className="transition-colors hover:bg-slate-50/60">
                    <td className="py-4 pr-4 pl-0 font-bold text-slate-900 whitespace-nowrap">
                      {a.title}
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-600 whitespace-nowrap">
                      {a.course}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-[#2563EB]">
                        {a.type}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-700 whitespace-nowrap">
                      {a.submissions.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-center font-bold text-slate-900 whitespace-nowrap">
                      {a.submissions > 0 ? `${a.avgScore}/100` : "—"}
                    </td>
                    <td className="pr-0 py-4 pl-4 text-right whitespace-nowrap">
                      {a.submissions === 0 ? (
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-500">
                          No submissions yet
                        </span>
                      ) : a.pendingReview > 0 ? (
                        <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
                          {a.pendingReview} pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                          All Evaluated
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddAssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateAssignment}
      />
    </>
  );
}
