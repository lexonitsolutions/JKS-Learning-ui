"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  ClipboardCheck,
  CheckCircle2,
  Clock,
  Plus,
  HelpCircle,
  FileQuestion,
  ArrowRight,
  User,
  Search,
  RefreshCw,
  FileText,
  AlertCircle,
  ShieldCheck,
  Calendar,
  Eye,
  CheckCircle,
} from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { TiltCard } from "@/components/interactions/tilt-card";
import { Reveal } from "@/lib/motion/reveal";
import { fetchAdminTasks, type IndividualTask } from "@/lib/data/tasks-api";
import { CreateTaskModal } from "@/components/admin/create-task-modal";
import { ReviewTaskModal } from "@/components/admin/review-task-modal";

export default function AdminAssessmentsPage() {
  const [tasks, setTasks] = useState<IndividualTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedCourse, setSelectedCourse] = useState<string>("ALL");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [reviewingTask, setReviewingTask] = useState<IndividualTask | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadTasks = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const data = await fetchAdminTasks();
      setTasks(data);
      if (isManual) {
        showToast(`Loaded ${data.length} individual student assignments.`);
      }
    } catch (err) {
      console.error("Failed to load tasks:", err);
      if (isManual) showToast("Error connecting to tasks database.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadTasks(false);
  }, [loadTasks]);

  // Derived Metrics from live DB tasks
  const totalTasks = tasks.length;
  const pendingCount = tasks.filter((t) => t.status === "PENDING").length;
  const submittedCount = tasks.filter((t) => t.status === "SUBMITTED").length;
  const completedCount = tasks.filter((t) => t.status === "COMPLETED" || t.status === "REVIEWED").length;

  // Distinct courses for dropdown filter
  const uniqueCourses = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => {
      if (t.courseTitle) set.add(t.courseTitle);
    });
    return Array.from(set).sort();
  }, [tasks]);

  // Filtered List with course and student search
  const filteredTasks = useMemo(() => {
    let list = tasks;

    if (statusFilter !== "ALL") {
      if (statusFilter === "COMPLETED") {
        list = list.filter((t) => t.status === "COMPLETED" || t.status === "REVIEWED");
      } else {
        list = list.filter((t) => t.status === statusFilter);
      }
    }

    if (selectedCourse !== "ALL") {
      list = list.filter((t) => t.courseTitle === selectedCourse);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((t) => {
        const titleMatch = t.title.toLowerCase().includes(q);
        const emailMatch = t.assignedStudentEmail.toLowerCase().includes(q);
        const idMatch = t.assignedStudentId ? t.assignedStudentId.toLowerCase().includes(q) : false;
        const courseMatch = t.courseTitle ? t.courseTitle.toLowerCase().includes(q) : false;
        const descMatch = t.description ? t.description.toLowerCase().includes(q) : false;
        return titleMatch || emailMatch || idMatch || courseMatch || descMatch;
      });
    }

    return list;
  }, [tasks, statusFilter, selectedCourse, searchQuery]);

  return (
    <>
      <DashboardTopbar
        title="Individual Student Tasks"
        subtitle={`${totalTasks} customized assignments and project tasks assigned across enrolled students.`}
        userInitials="AD"
      />

      <div className="flex-1 space-y-5 p-3 sm:p-6 lg:p-8 lg:pt-4">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-2xl border border-blue-200 dark:border-blue-800 bg-white/95 dark:bg-surface-hover/95 px-5 py-3.5 text-xs font-bold text-[#2563EB] dark:text-blue-400 shadow-2xl backdrop-blur-md animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 text-[#2563EB] dark:text-blue-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Action Bar */}
        <div className="flex flex-wrap items-center justify-end gap-2.5">

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => loadTasks(true)}
              disabled={isRefreshing}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-elevated px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-xs hover:bg-slate-50 dark:hover:bg-surface-hover transition-colors cursor-pointer disabled:opacity-50"
              title="Refresh task assignments"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-[#2563EB]" : ""}`} />
              <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
            </button>

            <Link
              href="/admin/assessments/questions"
              className="flex items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2 text-xs font-bold text-[#2563EB] hover:bg-blue-100 dark:border-blue-800/60 dark:bg-blue-950/40 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-all cursor-pointer"
            >
              <ClipboardCheck className="h-4 w-4" />
              <span>Question Bank</span>
            </Link>

            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>Assign New Task</span>
            </button>
          </div>
        </div>

        {/* Live Metric Cards */}
        <Reveal variant="stagger" className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <TiltCard>
            <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary dark:shadow-none">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Assigned</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-[#2563EB] dark:bg-blue-950/50 dark:text-blue-400">
                  <ClipboardCheck className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                {totalTasks}
              </div>
              <div className="mt-1 text-xs text-slate-500 font-medium">Individual student tasks</div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary dark:shadow-none">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pending Submissions</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                  <Clock className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-black text-amber-600 dark:text-amber-400">{pendingCount}</div>
              <div className="mt-1 text-xs text-slate-500 font-medium">Awaiting student work</div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary dark:shadow-none">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Submitted &amp; In Review</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                  <FileText className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-black text-indigo-600 dark:text-indigo-400">{submittedCount}</div>
              <div className="mt-1 text-xs text-indigo-600 font-semibold">Requires faculty review</div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary dark:shadow-none">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Completed &amp; Graded</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">{completedCount}</div>
              <div className="mt-1 text-xs text-emerald-600 font-semibold">Evaluated &amp; feedback sent</div>
            </div>
          </TiltCard>
        </Reveal>

        {/* Search & Filter Controls */}
        <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
          <div className="flex flex-1 flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
            {/* Search Input: Title, Student ID, Email, Course */}
            <div className="relative flex-1 min-w-[280px]">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by student ID, email, task, or course..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg py-2 pr-3 pl-9 text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-[#2563EB]"
              />
            </div>

            {/* Course Dropdown Filter */}
            <div className="relative min-w-[200px]">
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-input-bg px-3.5 py-2 text-xs font-semibold text-slate-800 dark:text-white outline-none focus:border-[#2563EB] dark:focus:border-blue-500 pr-8 shadow-xs cursor-pointer"
              >
                <option value="ALL">All Courses ({uniqueCourses.length})</option>
                {uniqueCourses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-elevated p-1 shadow-xs overflow-x-auto">
              {[
                { id: "ALL", label: `All (${totalTasks})` },
                { id: "PENDING", label: `Pending (${pendingCount})` },
                { id: "SUBMITTED", label: `Submitted (${submittedCount})` },
                { id: "COMPLETED", label: `Completed (${completedCount})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`rounded-lg px-3 py-1 text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                    statusFilter === tab.id
                      ? "bg-[#2563EB] text-white shadow-xs"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* TASKS TABLE */}
        <div className="rounded-[20px] border border-white/70 bg-white/80 p-4 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary dark:shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[760px]">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                  <th className="pb-3 pr-4 pl-0">Task &amp; Assigned Student</th>
                  <th className="px-4 pb-3">Course / Track</th>
                  <th className="px-4 pb-3">Due Date</th>
                  <th className="px-4 pb-3 text-center">Status</th>
                  <th className="px-4 pb-3 text-center">Score / Grade</th>
                  <th className="pr-0 pb-3 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {isLoading ? (
                  [1, 2, 3].map((i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-4 pr-4 pl-0">
                        <div className="h-4 w-48 rounded bg-slate-200 dark:bg-slate-700" />
                        <div className="h-3 w-32 rounded bg-slate-100 dark:bg-slate-800 mt-1" />
                      </td>
                      <td className="px-4 py-4"><div className="h-3.5 w-24 rounded bg-slate-200 dark:bg-slate-700" /></td>
                      <td className="px-4 py-4"><div className="h-3.5 w-20 rounded bg-slate-200 dark:bg-slate-700" /></td>
                      <td className="px-4 py-4"><div className="h-6 w-20 rounded bg-slate-200 dark:bg-slate-700 mx-auto" /></td>
                      <td className="px-4 py-4"><div className="h-3.5 w-12 rounded bg-slate-200 dark:bg-slate-700 mx-auto" /></td>
                      <td className="pr-0 py-4 pl-4 text-right"><div className="h-8 w-24 rounded bg-slate-200 dark:bg-slate-700 inline-block" /></td>
                    </tr>
                  ))
                ) : filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <ClipboardCheck className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                        <span className="font-bold text-slate-700 dark:text-slate-200">No individual tasks found</span>
                        <span className="text-xs text-slate-400">
                          {searchQuery
                            ? "No tasks match your search criteria."
                            : "Click '+ Assign New Task' above to assign a customized task or assignment to an individual student."}
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => {
                    const isSubmitted = task.status === "SUBMITTED";
                    const isReviewed = task.status === "REVIEWED" || task.status === "COMPLETED";
                    const isPending = task.status === "PENDING";
                    const questionsCount = task.questions?.length || 0;

                    return (
                      <tr key={task.id} className="transition-colors hover:bg-slate-50/70 dark:hover:bg-surface-hover">
                        {/* Task Title & Student */}
                        <td className="py-4 pr-4 pl-0">
                          <div className="font-bold text-slate-900 dark:text-white leading-snug">
                            {task.title}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                            <User className="h-3 w-3 text-[#2563EB] dark:text-blue-400" />
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {task.assignedStudentEmail}
                            </span>
                            {questionsCount > 0 && (
                              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-1.5 text-[10px] text-slate-500">
                                {questionsCount} {questionsCount === 1 ? "Question" : "Questions"}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Course */}
                        <td className="px-4 py-4 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                          {task.courseTitle || "General Track"}
                        </td>

                        {/* Due Date */}
                        <td className="px-4 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                          {task.dueDate ? (
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                              <span>{new Date(task.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">No deadline set</span>
                          )}
                        </td>

                        {/* Status Badge */}
                        <td className="px-4 py-4 text-center whitespace-nowrap">
                          {task.status === "SUBMITTED" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/50 px-2.5 py-0.5 text-[11px] font-bold text-[#2563EB] dark:text-blue-400">
                              <Clock className="h-3 w-3" /> Submitted
                            </span>
                          ) : task.status === "REVIEWED" || task.status === "COMPLETED" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                              <CheckCircle2 className="h-3 w-3" /> Completed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 dark:text-amber-300">
                              <Clock className="h-3 w-3" /> Pending
                            </span>
                          )}
                        </td>

                        {/* Score */}
                        <td className="px-4 py-4 text-center font-bold text-slate-900 dark:text-white whitespace-nowrap">
                          {task.submission?.score !== undefined ? (
                            <span className="rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 text-xs font-black">
                              {task.submission.score}/100
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="pr-0 py-4 pl-4 text-right whitespace-nowrap">
                          {isSubmitted ? (
                            <button
                              type="button"
                              onClick={() => setReviewingTask(task)}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
                            >
                              <FileText className="h-3.5 w-3.5" />
                              <span>Review Submission</span>
                            </button>
                          ) : isReviewed ? (
                            <button
                              type="button"
                              onClick={() => setReviewingTask(task)}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span>View Review</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setReviewingTask(task)}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-elevated px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span>Details</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CREATE INDIVIDUAL TASK MODAL */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={(newTask) => {
          setTasks((prev) => [newTask, ...prev]);
          showToast(`Task "${newTask.title}" assigned to ${newTask.assignedStudentEmail}.`);
        }}
      />

      {/* REVIEW TASK SUBMISSION MODAL */}
      <ReviewTaskModal
        isOpen={Boolean(reviewingTask)}
        task={reviewingTask}
        onClose={() => setReviewingTask(null)}
        onReviewed={(updated) => {
          setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
          showToast(`Task reviewed and feedback sent to ${updated.assignedStudentEmail}.`);
        }}
      />
    </>
  );
}
