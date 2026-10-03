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
  Repeat,
  Layers,
  Sparkles,
} from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { TiltCard } from "@/components/interactions/tilt-card";
import { Reveal } from "@/lib/motion/reveal";
import {
  fetchAdminTasks,
  type IndividualTask,
  type ReusableAssessment,
  getStoredMasterAssessments,
  fetchAllReusableAssessments,
} from "@/lib/data/tasks-api";
import { CreateTaskModal } from "@/components/admin/create-task-modal";
import { ReviewTaskModal } from "@/components/admin/review-task-modal";

export default function AdminAssessmentsPage() {
  const [tasks, setTasks] = useState<IndividualTask[]>([]);
  const [reusableList, setReusableList] = useState<ReusableAssessment[]>([]);
  const [activeView, setActiveView] = useState<"ASSIGNMENTS" | "TEMPLATES">("ASSIGNMENTS");
  
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedCourse, setSelectedCourse] = useState<string>("ALL");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isReuseMode, setIsReuseMode] = useState(false);
  const [reassignAssessment, setReassignAssessment] = useState<ReusableAssessment | null>(null);
  const [reviewingTask, setReviewingTask] = useState<IndividualTask | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadTasks = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      // 1. Immediately populate from local cache
      const cachedReusable = getStoredMasterAssessments();
      setReusableList(cachedReusable);

      // 2. Load live tasks and full aggregated reusable assessments from all courses
      const [data, reusable] = await Promise.all([
        fetchAdminTasks(),
        fetchAllReusableAssessments(),
      ]);
      setTasks(data);
      if (reusable && reusable.length > 0) {
        setReusableList(reusable);
      }
      if (isManual) {
        showToast(`Loaded ${data.length} student assignments and ${reusable.length} course assessments.`);
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

  const handleOpenAssignModal = (tpl?: ReusableAssessment, isReuse?: boolean) => {
    setReassignAssessment(tpl || null);
    setIsReuseMode(Boolean(isReuse || tpl));
    setIsCreateModalOpen(true);
  };

  const handleReassignFromTask = (task: IndividualTask) => {
    const tpl: ReusableAssessment = {
      id: `asm-${Date.now()}`,
      title: task.title,
      description: task.description,
      instructions: task.instructions,
      courseId: task.courseId,
      courseTitle: task.courseTitle,
      dueDate: task.dueDate,
      requiredFiles: task.requiredFiles,
      questions: task.questions,
      timesAssigned: 1,
      assignedStudents: [task.assignedStudentEmail],
      createdAt: task.createdAt,
    };
    setReassignAssessment(tpl);
    setIsReuseMode(true);
    setIsCreateModalOpen(true);
  };

  return (
    <>
      <DashboardTopbar
        title="Assessments & Student Assignments"
        subtitle="Create reusable assessments once, assign to multiple students at once, and evaluate individual submissions."
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
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-elevated p-1 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveView("ASSIGNMENTS")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                activeView === "ASSIGNMENTS"
                  ? "bg-[#2563EB] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
              }`}
            >
              Student Attempts &amp; Reviews ({totalTasks})
            </button>
            <button
              type="button"
              onClick={() => setActiveView("TEMPLATES")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                activeView === "TEMPLATES"
                  ? "bg-[#2563EB] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
              }`}
            >
              Reusable Assessments ({reusableList.length})
            </button>
          </div>

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
              onClick={() => {
                handleOpenAssignModal(undefined, true);
              }}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2 text-xs font-bold text-[#2563EB] hover:bg-blue-100 dark:border-blue-800/60 dark:bg-blue-950/40 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-all cursor-pointer shadow-xs"
              title="Reuse an existing course assignment or created assessment"
            >
              <Repeat className="h-4 w-4" />
              <span>Reuse Existing Assignment</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenAssignModal()}
              className="flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>Create &amp; Assign Assessment</span>
            </button>
          </div>
        </div>

        {/* Live Metric Cards */}
        <Reveal variant="stagger" className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4">
          <TiltCard>
            <div className="rounded-2xl border border-white/70 bg-white/75 p-3.5 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary dark:shadow-none">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">Total Assigned</span>
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-blue-50 text-[#2563EB] dark:bg-blue-950/50 dark:text-blue-400">
                  <ClipboardCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
              </div>
              <div className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {totalTasks}
              </div>
              <div className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-slate-500 font-medium">Student attempt records</div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="rounded-2xl border border-white/70 bg-white/75 p-3.5 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary dark:shadow-none">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">Pending</span>
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                  <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
              </div>
              <div className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">{pendingCount}</div>
              <div className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-slate-500 font-medium">Awaiting student work</div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="rounded-2xl border border-white/70 bg-white/75 p-3.5 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary dark:shadow-none">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">Submitted</span>
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                  <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
              </div>
              <div className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400">{submittedCount}</div>
              <div className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-indigo-600 font-semibold">Requires faculty review</div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="rounded-2xl border border-white/70 bg-white/75 p-3.5 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary dark:shadow-none">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">Completed</span>
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
              </div>
              <div className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">{completedCount}</div>
              <div className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-emerald-600 font-semibold">Evaluated &amp; feedback sent</div>
            </div>
          </TiltCard>
        </Reveal>

        {activeView === "TEMPLATES" ? (
          /* REUSABLE ASSESSMENTS LIBRARY VIEW */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Reusable Master Assessments
                </h3>
                <p className="text-xs text-slate-500">
                  Select any assessment below to assign to single or multiple students at once without recreating questions.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleOpenAssignModal()}
                className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Master Assessment</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reusableList.map((tpl) => (
                <div
                  key={tpl.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-surface-secondary p-4 shadow-sm hover:shadow-md transition-all space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-blue-50 dark:bg-blue-950/50 text-[#2563EB] dark:text-blue-400 px-2.5 py-0.5 text-[10px] font-bold border border-blue-200 dark:border-blue-800/60">
                        {tpl.courseTitle || "All Courses"}
                      </span>
                      <span className="text-[11px] text-slate-400 font-semibold">
                        {tpl.questions?.length || 0} Questions
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {tpl.title}
                    </h4>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {tpl.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">
                      Assigned <span className="font-bold text-slate-700 dark:text-slate-300">{tpl.timesAssigned}</span> time(s)
                    </span>

                    <button
                      type="button"
                      onClick={() => handleOpenAssignModal(tpl)}
                      className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      <Repeat className="h-3 w-3" />
                      <span>Assign to Students</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* STUDENT ASSIGNMENTS & ATTEMPTS VIEW */
          <div className="space-y-4">
            {/* Search and Filters Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by student email, task, or course..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-elevated pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB] transition-all"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Course Dropdown Filter */}
                <div className="relative">
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="appearance-none rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-elevated px-3 py-2 pr-8 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-xs outline-none cursor-pointer"
                  >
                    <option value="ALL">All Courses ({uniqueCourses.length})</option>
                    {uniqueCourses.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
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
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
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

            {/* RESPONSIVE TABLE & CARD CONTAINER */}
            <div className="rounded-2xl border border-white/70 bg-white/80 p-3 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary dark:shadow-none overflow-hidden">
              {/* DESKTOP TABLE VIEW (Visible on md and larger) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs table-fixed">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                      <th className="pb-3 pr-3 pl-0 w-[30%]">Task &amp; Assigned Student</th>
                      <th className="px-3 pb-3 w-[22%]">Course / Track</th>
                      <th className="px-3 pb-3 w-[15%]">Due Date</th>
                      <th className="px-3 pb-3 text-center w-[11%]">Status</th>
                      <th className="px-3 pb-3 text-center w-[10%]">Score / Grade</th>
                      <th className="pr-1 pb-3 pl-3 text-right w-[12%]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {isLoading ? (
                      [1, 2, 3].map((i) => (
                        <tr key={i} className="animate-pulse">
                          <td className="py-4 pr-3 pl-0">
                            <div className="h-4 w-44 rounded bg-slate-200 dark:bg-slate-700" />
                            <div className="h-3 w-32 rounded bg-slate-100 dark:bg-slate-800 mt-1" />
                          </td>
                          <td className="px-3 py-4"><div className="h-3.5 w-24 rounded bg-slate-200 dark:bg-slate-700" /></td>
                          <td className="px-3 py-4"><div className="h-3.5 w-20 rounded bg-slate-200 dark:bg-slate-700" /></td>
                          <td className="px-3 py-4"><div className="h-6 w-18 rounded bg-slate-200 dark:bg-slate-700 mx-auto" /></td>
                          <td className="px-3 py-4"><div className="h-3.5 w-10 rounded bg-slate-200 dark:bg-slate-700 mx-auto" /></td>
                          <td className="pr-1 py-4 pl-3 text-right"><div className="h-8 w-20 rounded bg-slate-200 dark:bg-slate-700 inline-block" /></td>
                        </tr>
                      ))
                    ) : filteredTasks.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <ClipboardCheck className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                            <span className="font-bold text-slate-700 dark:text-slate-200">No student tasks found</span>
                            <span className="text-xs text-slate-400">
                              {searchQuery
                                ? "No assignments match your search."
                                : "Click 'Create & Assign Assessment' above to assign to students."}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredTasks.map((task) => {
                        const isSubmitted = task.status === "SUBMITTED";
                        const isReviewed = task.status === "REVIEWED" || task.status === "COMPLETED";
                        const questionsCount = task.questions?.length || 0;

                        return (
                          <tr key={task.id} className="transition-colors hover:bg-slate-50/70 dark:hover:bg-surface-hover">
                            {/* Task Title & Student */}
                            <td className="py-3.5 pr-3 pl-0">
                              <div className="font-bold text-slate-900 dark:text-white leading-snug truncate" title={task.title}>
                                {task.title}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5 truncate">
                                <User className="h-3 w-3 text-[#2563EB] dark:text-blue-400 shrink-0" />
                                <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">
                                  {task.assignedStudentEmail}
                                </span>
                                {questionsCount > 0 && (
                                  <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-1.5 text-[9.5px] text-slate-500 shrink-0">
                                    {questionsCount} Q
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Course */}
                            <td className="px-3 py-3.5 font-medium text-slate-700 dark:text-slate-300 truncate" title={task.courseTitle || "General Track"}>
                              {task.courseTitle || "General Track"}
                            </td>

                            {/* Due Date */}
                            <td className="px-3 py-3.5 whitespace-nowrap text-slate-600 dark:text-slate-300">
                              {task.dueDate ? (
                                <div className="flex items-center gap-1 text-[11px]">
                                  <Calendar className="h-3 w-3 text-slate-400 shrink-0" />
                                  <span>{new Date(task.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                                </div>
                              ) : (
                                <span className="text-slate-400 italic text-[11px]">No deadline</span>
                              )}
                            </td>

                            {/* Status Badge */}
                            <td className="px-3 py-3.5 text-center whitespace-nowrap">
                              {task.status === "SUBMITTED" ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/50 px-2 py-0.5 text-[10.5px] font-bold text-[#2563EB] dark:text-blue-400">
                                  <Clock className="h-2.5 w-2.5" /> Submitted
                                </span>
                              ) : task.status === "REVIEWED" || task.status === "COMPLETED" ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/50 px-2 py-0.5 text-[10.5px] font-bold text-emerald-700 dark:text-emerald-300">
                                  <CheckCircle2 className="h-2.5 w-2.5" /> Completed
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/50 px-2 py-0.5 text-[10.5px] font-bold text-amber-700 dark:text-amber-300">
                                  <Clock className="h-2.5 w-2.5" /> Pending
                                </span>
                              )}
                            </td>

                            {/* Score */}
                            <td className="px-3 py-3.5 text-center font-bold text-slate-900 dark:text-white whitespace-nowrap">
                              {task.submission?.score !== undefined ? (
                                <span className="rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 text-xs font-black">
                                  {task.submission.score}/100
                                </span>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="pr-1 py-3.5 pl-3 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                {isSubmitted ? (
                                  <button
                                    type="button"
                                    onClick={() => setReviewingTask(task)}
                                    className="inline-flex items-center gap-1 rounded-lg bg-[#2563EB] px-2.5 py-1 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
                                  >
                                    <FileText className="h-3 w-3" />
                                    <span>Review</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setReviewingTask(task)}
                                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-elevated px-2 py-1 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
                                  >
                                    <Eye className="h-3 w-3" />
                                    <span>Details</span>
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => handleReassignFromTask(task)}
                                  title="Reassign this assessment to more students"
                                  className="inline-flex items-center justify-center h-6 w-6 rounded-lg text-slate-400 hover:text-[#2563EB] hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors cursor-pointer"
                                >
                                  <Repeat className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS VIEW (Clean responsive stack for mobile devices) */}
              <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
                {isLoading ? (
                  <div className="p-4 text-center text-xs text-slate-400">Loading assignments...</div>
                ) : filteredTasks.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">No assignments found.</div>
                ) : (
                  filteredTasks.map((task) => {
                    const isSubmitted = task.status === "SUBMITTED";
                    const isReviewed = task.status === "REVIEWED" || task.status === "COMPLETED";

                    return (
                      <div key={task.id} className="py-3.5 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-xs leading-snug">
                              {task.title}
                            </h4>
                            <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                              <User className="h-3 w-3 text-[#2563EB]" />
                              <span className="font-semibold text-slate-700 dark:text-slate-300">
                                {task.assignedStudentEmail}
                              </span>
                            </div>
                          </div>

                          {task.status === "SUBMITTED" ? (
                            <span className="rounded-full bg-blue-50 text-[#2563EB] border border-blue-200 px-2 py-0.5 text-[10px] font-bold shrink-0">
                              Submitted
                            </span>
                          ) : isReviewed ? (
                            <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold shrink-0">
                              Completed
                            </span>
                          ) : (
                            <span className="rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 text-[10px] font-bold shrink-0">
                              Pending
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
                          <span className="truncate max-w-[200px]">{task.courseTitle || "General Track"}</span>
                          {task.dueDate && (
                            <span>Due: {new Date(task.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <div className="text-xs font-bold">
                            {task.submission?.score !== undefined ? (
                              <span className="text-emerald-600">Score: {task.submission.score}/100</span>
                            ) : (
                              <span className="text-slate-400">Score: —</span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setReviewingTask(task)}
                              className="rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-300"
                            >
                              {isSubmitted ? "Review" : "Details"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReassignFromTask(task)}
                              className="rounded-lg bg-blue-50 text-[#2563EB] px-2.5 py-1 text-xs font-bold flex items-center gap-1"
                            >
                              <Repeat className="h-3 w-3" />
                              <span>Assign Again</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CREATE & ASSIGN ASSESSMENT MODAL */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        initialAssessment={reassignAssessment}
        isReuseMode={isReuseMode}
        onClose={() => {
          setIsCreateModalOpen(false);
          setReassignAssessment(null);
          setIsReuseMode(false);
        }}
        onCreated={(newTask) => {
          setTasks((prev) => [newTask, ...prev]);
          showToast(`Task assigned to ${newTask.assignedStudentEmail}.`);
        }}
        onBatchCreated={(newTasks) => {
          setTasks((prev) => [...newTasks, ...prev]);
          fetchAllReusableAssessments().then((reusable) => setReusableList(reusable));
          showToast(`Assessment assigned successfully to ${newTasks.length} student(s)!`);
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
