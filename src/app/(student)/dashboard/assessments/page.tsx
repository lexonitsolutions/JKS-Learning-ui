"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  Clock,
  PlayCircle,
  RotateCcw,
  Eye,
  Calendar,
  AlertCircle,
  HelpCircle,
  Search,
  Award,
  Layers,
  Sparkles,
  BookOpen,
  XCircle,
  FileCheck,
} from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { TakeAssessmentModal } from "@/components/student/take-assessment-modal";
import { ViewSubmissionModal } from "@/components/student/view-submission-modal";
import { Reveal } from "@/lib/motion/reveal";
import { TiltCard } from "@/components/interactions/tilt-card";
import { useMockSession } from "@/lib/auth/use-mock-auth";
import { useUser } from "@clerk/nextjs";
import { getClientSessionEmail } from "@/lib/data/enrollments-api";
import {
  fetchStudentAssignedTasks,
  type IndividualTask,
} from "@/lib/data/tasks-api";

export default function AssessmentsPage() {
  const session = useMockSession();
  const { user: clerkUser } = useUser();
  const clerkEmail =
    clerkUser?.primaryEmailAddress?.emailAddress ||
    clerkUser?.emailAddresses?.[0]?.emailAddress;
  const effectiveEmail = (
    clerkEmail ||
    session?.email ||
    getClientSessionEmail() ||
    ""
  )
    .toLowerCase()
    .trim();

  const [isLoading, setIsLoading] = useState(true);
  const [assignedTasks, setAssignedTasks] = useState<IndividualTask[]>([]);
  const [activeTab, setActiveTab] = useState<"assigned" | "submitted" | "all">("assigned");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [takingTask, setTakingTask] = useState<IndividualTask | null>(null);
  const [viewingTask, setViewingTask] = useState<IndividualTask | null>(null);

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      if (effectiveEmail) {
        const tasks = await fetchStudentAssignedTasks(effectiveEmail);
        setAssignedTasks(tasks);
      }
    } catch (err) {
      console.warn("Failed to load student assigned tasks:", err);
    } finally {
      setIsLoading(false);
    }
  }, [effectiveEmail]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Status helper
  const getNormalizedStatus = (t: IndividualTask) => {
    const raw = String(t.status || "").toUpperCase();
    const score = t.submission?.instructorScore ?? t.submission?.score;

    if (raw === "COMPLETED" || (raw === "REVIEWED" && (score ?? 0) >= 60)) {
      return {
        label: "Completed",
        badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60",
        icon: CheckCircle2,
        isCompleted: true,
      };
    }
    if (raw === "FAILED" || (raw === "REVIEWED" && (score ?? 100) < 50)) {
      return {
        label: "Failed (Retry Available)",
        badge: "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800/60",
        icon: XCircle,
        isFailed: true,
      };
    }
    if (raw === "SUBMITTED") {
      return {
        label: "Submitted / Reviewing",
        badge: "bg-blue-50 text-[#2563EB] dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-800/60",
        icon: Clock,
        isSubmitted: true,
      };
    }
    if (raw === "IN_PROGRESS" || raw === "IN PROGRESS") {
      return {
        label: "In Progress",
        badge: "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800/60",
        icon: PlayCircle,
        isInProgress: true,
      };
    }
    return {
      label: "Assigned",
      badge: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800/60",
      icon: Clock,
      isAssigned: true,
    };
  };

  // Metrics
  const totalCount = assignedTasks.length;
  const actionRequiredTasks = assignedTasks.filter((t) => {
    const s = getNormalizedStatus(t);
    return s.isAssigned || s.isInProgress || s.isFailed;
  });
  const submittedTasksList = assignedTasks.filter((t) => {
    const s = getNormalizedStatus(t);
    return s.isSubmitted || s.isCompleted || s.isFailed;
  });
  const completedTasksList = assignedTasks.filter((t) => getNormalizedStatus(t).isCompleted);

  // Tab Filtering & Search
  const filteredTasks = useMemo(() => {
    let list: IndividualTask[] = [];
    if (activeTab === "assigned") {
      list = actionRequiredTasks;
    } else if (activeTab === "submitted") {
      list = submittedTasksList;
    } else {
      list = assignedTasks;
    }

    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (t) =>
        t.title?.toLowerCase().includes(q) ||
        t.courseTitle?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q)
    );
  }, [assignedTasks, activeTab, actionRequiredTasks, submittedTasksList, searchQuery]);

  const handleStartTask = (t: IndividualTask) => {
    // Mark status locally as In Progress if it was Assigned/Pending
    const status = getNormalizedStatus(t);
    if (status.isAssigned) {
      setAssignedTasks((prev) =>
        prev.map((item) => (item.id === t.id ? { ...item, status: "IN_PROGRESS" } : item))
      );
    }
    setTakingTask(t);
  };

  return (
    <>
      <DashboardTopbar
        title="Assessments &amp; Tasks"
        subtitle="Assigned individual tasks and submitted assessments from your instructors"
      />

      <div className="flex-1 space-y-6 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4">
        {/* Metric Cards */}
        <Reveal variant="stagger" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <TiltCard>
            <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary/90">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Assigned</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-[#2563EB] dark:bg-blue-950/40 dark:text-blue-400">
                  <FileText className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                {totalCount}
              </div>
              <div className="mt-1 text-xs text-[#2563EB] dark:text-blue-400 font-semibold">
                Tasks assigned by faculty
              </div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary/90">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Action Required</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                  <PlayCircle className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-black text-amber-600 dark:text-amber-400">
                {actionRequiredTasks.length}
              </div>
              <div className="mt-1 text-xs text-amber-600 dark:text-amber-400 font-semibold">
                Pending, in progress or retry
              </div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary/90">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Submitted &amp; In Review</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                  <Clock className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-black text-indigo-600 dark:text-indigo-400">
                {assignedTasks.filter((t) => getNormalizedStatus(t).isSubmitted).length}
              </div>
              <div className="mt-1 text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                Awaiting instructor review
              </div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary/90">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Completed</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {completedTasksList.length}
              </div>
              <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                Passed &amp; verified tasks
              </div>
            </div>
          </TiltCard>
        </Reveal>

        {/* TAB SWITCHER & SEARCH */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("assigned")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "assigned"
                  ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                  : "bg-white dark:bg-surface-elevated text-slate-600 dark:text-slate-300 hover:bg-slate-50"
              }`}
            >
              <PlayCircle className="h-4 w-4" />
              <span>Assigned Individual Tasks ({actionRequiredTasks.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("submitted")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "submitted"
                  ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                  : "bg-white dark:bg-surface-elevated text-slate-600 dark:text-slate-300 hover:bg-slate-50"
              }`}
            >
              <FileCheck className="h-4 w-4" />
              <span>Submitted Assessments ({submittedTasksList.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "all"
                  ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                  : "bg-white dark:bg-surface-elevated text-slate-600 dark:text-slate-300 hover:bg-slate-50"
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>All ({totalCount})</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[220px]">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search assessment title or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-elevated pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
            />
          </div>
        </div>

        {/* MAIN LIST VIEW */}
        <div className="rounded-[20px] border border-white/70 bg-white/80 p-4 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary/90">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-slate-400 animate-pulse">
              Loading your assigned assessments...
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
                {activeTab === "assigned"
                  ? "No Pending Tasks to Complete"
                  : activeTab === "submitted"
                  ? "No Assessments Submitted Yet"
                  : "No Assigned Assessments Found"}
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                {activeTab === "assigned"
                  ? "You have completed all currently assigned tasks! New assignments from instructors will appear here."
                  : activeTab === "submitted"
                  ? "When you complete and submit an assigned task, it will appear here with instructor marks, answers, and feedback."
                  : "Your customized individual tasks and assessments assigned by instructors will be listed here."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                    <th className="pb-3 pr-4 pl-0">Assessment Title &amp; Details</th>
                    <th className="px-4 pb-3">Course / Track</th>
                    <th className="px-4 pb-3">Assigned / Due</th>
                    <th className="px-4 pb-3 text-center">Questions</th>
                    <th className="px-4 pb-3 text-center">Status</th>
                    <th className="px-4 pb-3 text-center">Marks</th>
                    <th className="pr-0 pb-3 pl-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {filteredTasks.map((t) => {
                    const statusInfo = getNormalizedStatus(t);
                    const StatusIcon = statusInfo.icon;
                    const questionsCount = t.questions?.length || 0;
                    const score = t.submission?.instructorScore ?? t.submission?.score;
                    const feedback = t.submission?.instructorFeedback ?? t.submission?.feedback;

                    return (
                      <tr
                        key={t.id}
                        className="transition-all duration-200 ease-out hover:bg-slate-100/70 dark:hover:bg-white/[0.04]"
                      >
                        {/* Title & Description */}
                        <td className="py-4 pr-4 pl-0 max-w-xs">
                          <div className="font-bold text-slate-900 dark:text-white leading-snug">
                            {t.title}
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {t.description}
                          </div>
                          {feedback && (
                            <div className="mt-1 text-[10.5px] text-[#2563EB] dark:text-blue-400 font-medium line-clamp-1 italic">
                              "{feedback}"
                            </div>
                          )}
                        </td>

                        {/* Course */}
                        <td className="px-4 py-4 font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap">
                          {t.courseTitle || "General Track"}
                        </td>

                        {/* Assigned & Due Date */}
                        <td className="px-4 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                          <div className="space-y-0.5">
                            {t.dueDate ? (
                              <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                                <Calendar className="h-3 w-3 text-slate-400" />
                                <span>Due: {new Date(t.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                              </div>
                            ) : (
                              <div className="text-slate-400 italic">No deadline</div>
                            )}
                            <div className="text-[10px] text-slate-400">
                              Assigned: {new Date(t.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                            </div>
                          </div>
                        </td>

                        {/* Questions count */}
                        <td className="px-4 py-4 text-center whitespace-nowrap">
                          <span className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                            {questionsCount} {questionsCount === 1 ? "Question" : "Questions"}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4 text-center whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${statusInfo.badge}`}
                          >
                            <StatusIcon className="h-3 w-3" />
                            <span>{statusInfo.label}</span>
                          </span>
                        </td>

                        {/* Marks */}
                        <td className="px-4 py-4 text-center font-bold text-slate-900 dark:text-white whitespace-nowrap">
                          {score !== undefined ? (
                            <span
                              className={`rounded-lg px-2 py-0.5 text-xs font-black ${
                                statusInfo.isCompleted
                                  ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                                  : statusInfo.isFailed
                                  ? "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                              }`}
                            >
                              {score}/100
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>

                        {/* Action buttons */}
                        <td className="pr-0 py-4 pl-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            {/* If Failed: Show Retry Option */}
                            {statusInfo.isFailed && (
                              <button
                                type="button"
                                onClick={() => handleStartTask(t)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition-colors cursor-pointer"
                              >
                                <RotateCcw className="h-3.5 w-3.5" />
                                <span>Retry</span>
                              </button>
                            )}

                            {/* If Assigned/Pending: Start Assessment */}
                            {statusInfo.isAssigned && (
                              <button
                                type="button"
                                onClick={() => handleStartTask(t)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
                              >
                                <PlayCircle className="h-3.5 w-3.5" />
                                <span>Start Assessment</span>
                              </button>
                            )}

                            {/* If In Progress: Resume Assessment */}
                            {statusInfo.isInProgress && (
                              <button
                                type="button"
                                onClick={() => handleStartTask(t)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-purple-700 transition-colors cursor-pointer"
                              >
                                <PlayCircle className="h-3.5 w-3.5" />
                                <span>Resume</span>
                              </button>
                            )}

                            {/* If Submitted or Reviewed: View Submitted Answers */}
                            {(statusInfo.isSubmitted || statusInfo.isCompleted || statusInfo.isFailed) && (
                              <button
                                type="button"
                                onClick={() => setViewingTask(t)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-elevated px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                <span>View Answers</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* TAKE OR RETRY ASSESSMENT MODAL */}
      {takingTask && (
        <TakeAssessmentModal
          isOpen={Boolean(takingTask)}
          title={takingTask.title}
          course={takingTask.courseTitle || "General Track"}
          task={takingTask}
          studentEmail={effectiveEmail}
          onClose={() => setTakingTask(null)}
          onSubmit={(score, data) => {
            setAssignedTasks((prev) =>
              prev.map((t) =>
                t.id === takingTask.id
                  ? {
                      ...t,
                      status: "SUBMITTED",
                      submission: {
                        submittedAt: new Date().toISOString(),
                        answers: data?.answers || {},
                        uploadedFileName: data?.uploadedFileName,
                        score,
                      },
                    }
                  : t
              )
            );
            setTakingTask(null);
            setActiveTab("submitted");
          }}
        />
      )}

      {/* VIEW SUBMITTED ANSWERS & INSTRUCTOR FEEDBACK MODAL */}
      {viewingTask && (
        <ViewSubmissionModal
          isOpen={Boolean(viewingTask)}
          task={viewingTask}
          onClose={() => setViewingTask(null)}
          onRetry={(taskToRetry) => {
            setViewingTask(null);
            setTakingTask(taskToRetry);
          }}
        />
      )}
    </>
  );
}
