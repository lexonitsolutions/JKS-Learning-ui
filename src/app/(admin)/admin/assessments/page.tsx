"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ClipboardCheck, CheckCircle2, Clock, Plus, HelpCircle, FileQuestion, ArrowRight } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { ADMIN_ASSESSMENTS, type AdminAssessmentRow } from "@/lib/data/admin";
import { AddAssignmentModal } from "@/components/admin/add-assignment-modal";
import { AddQuestionToAssessmentModal } from "@/components/admin/add-question-to-assessment-modal";
import { TiltCard } from "@/components/interactions/tilt-card";
import { Reveal } from "@/lib/motion/reveal";

export default function AdminAssessmentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assessments, setAssessments] = useState<AdminAssessmentRow[]>(ADMIN_ASSESSMENTS);

  // Quick Add Question modal state
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [targetAssessment, setTargetAssessment] = useState<{ title: string; course: string } | null>(null);

  const totalSubmissions = assessments.reduce((sum, a) => sum + a.submissions, 0);
  const totalPending = assessments.reduce((sum, a) => sum + a.pendingReview, 0);

  const handleCreateAssignment = (assignment: AdminAssessmentRow) => {
    setAssessments([assignment, ...assessments]);
  };

  const handleOpenAddQuestion = (assessmentTitle?: string, courseTitle?: string) => {
    setTargetAssessment({
      title: assessmentTitle || (assessments[0]?.title ?? ""),
      course: courseTitle || (assessments[0]?.course ?? ""),
    });
    setIsQuestionModalOpen(true);
  };

  return (
    <>
      <DashboardTopbar
        title="Assessments"
        subtitle={`${assessments.length} stage assessments configured with sequential unlock logic.`}
        userInitials="AD"
      />

      <div className="flex-1 space-y-5 p-3 sm:p-6 lg:p-8 lg:pt-4">
        {/* Top Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Course Assessments &amp; Question Suites
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage stage module tests, question banks, and grading criteria
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/admin/assessments/questions"
              className="flex items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2 text-xs font-bold text-[#2563EB] hover:bg-blue-100 dark:border-blue-800/60 dark:bg-blue-950/40 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-all cursor-pointer"
            >
              <ClipboardCheck className="h-4 w-4" />
              <span>Question Bank</span>
            </Link>

            <button
              type="button"
              onClick={() => handleOpenAddQuestion()}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/50 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>Add Question</span>
            </button>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-[#2563EB] px-3.5 py-2 sm:px-4 sm:py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>New Assessment</span>
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <Reveal variant="stagger" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <TiltCard>
            <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary dark:shadow-none">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Submissions</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-[#2563EB] dark:bg-blue-950/50 dark:text-blue-400">
                  <ClipboardCheck className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
                {totalSubmissions.toLocaleString()}
              </div>
              <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Across all course stages</div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary dark:shadow-none">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Avg Passing Rate</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">76.4%</div>
              <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">+3.1% this month</div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary dark:shadow-none">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pending Review</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                  <Clock className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">{totalPending}</div>
              <div className="mt-1 text-xs text-amber-600 dark:text-amber-400 font-semibold">Requires trainer evaluation</div>
            </div>
          </TiltCard>
        </Reveal>

        {/* Table */}
        <div className="rounded-[20px] border border-white/70 bg-white/80 p-4 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary dark:shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-400 uppercase">
                  <th className="pb-3 pr-4 pl-0">Assessment Title</th>
                  <th className="px-4 pb-3">Associated Course</th>
                  <th className="px-4 pb-3">Type</th>
                  <th className="px-4 pb-3">Submissions</th>
                  <th className="px-4 pb-3 text-center">Avg. Score</th>
                  <th className="px-4 pb-3">Review Status</th>
                  <th className="pr-0 pb-3 pl-4 text-right">Add Question</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                {assessments.map((a) => (
                  <tr key={`${a.title}-${a.course}`} className="transition-colors hover:bg-slate-50/60 dark:hover:bg-surface-hover">
                    <td className="py-4 pr-4 pl-0 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {a.title}
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {a.course}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-[#2563EB] dark:bg-blue-950/50 dark:text-blue-400">
                        {a.type}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {a.submissions.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-center font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {a.submissions > 0 ? `${a.avgScore}/100` : "—"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {a.submissions === 0 ? (
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          No submissions yet
                        </span>
                      ) : a.pendingReview > 0 ? (
                        <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
                          {a.pendingReview} pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                          All Evaluated
                        </span>
                      )}
                    </td>
                    <td className="pr-0 py-4 pl-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleOpenAddQuestion(a.title, a.course)}
                        className="inline-flex items-center gap-1 rounded-xl bg-blue-50 border border-blue-200 px-3 py-1.5 text-xs font-bold text-[#2563EB] hover:bg-blue-100 dark:bg-blue-950/50 dark:border-blue-800/60 dark:text-blue-400 dark:hover:bg-blue-900/60 transition-colors cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Question</span>
                      </button>
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

      <AddQuestionToAssessmentModal
        isOpen={isQuestionModalOpen}
        assessmentTitle={targetAssessment?.title}
        courseTitle={targetAssessment?.course}
        onClose={() => {
          setIsQuestionModalOpen(false);
          setTargetAssessment(null);
        }}
      />
    </>
  );
}
