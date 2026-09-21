"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ClipboardCheck,
  CheckCircle2,
  Clock,
  PlayCircle,
  BookOpen,
  ArrowRight,
  FileText,
  Calendar,
  AlertCircle,
  Eye,
  ShieldCheck,
} from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { TakeAssessmentModal } from "@/components/student/take-assessment-modal";
import { Reveal } from "@/lib/motion/reveal";
import { TiltCard } from "@/components/interactions/tilt-card";
import { useMockSession } from "@/lib/auth/use-mock-auth";
import { useUser } from "@clerk/nextjs";
import {
  fetchStudentEnrollments,
  fetchCourseProgress,
  submitAssessment,
  syncAllCourseProgress,
  getClientSessionEmail,
} from "@/lib/data/enrollments-api";
import { fetchStudentAssignedTasks, type IndividualTask, type TaskQuestion } from "@/lib/data/tasks-api";
import {
  getStoredCourses,
  syncCoursesWithBackend,
  fetchLiveCourseBySlug,
  type FullCourse,
} from "@/lib/data/courses-store";

interface AssessmentRow {
  uniqueKey: string;
  id: string;
  title: string;
  course: string;
  courseSlug: string;
  score: number;
  status: "Passed" | "Failed" | "Pending";
  date: string;
  /** Live assignment content as authored by the admin. */
  description: string;
  minPassingScore: number;
  questions: TaskQuestion[];
}

/**
 * Translate a course section assignment into the question shape the
 * assessment modal renders.
 *
 * The builder stores the answer key as `correctIndex` and the question kind as
 * a human-readable label; the modal speaks `correctAnswer` and an enum.
 */
function toTaskQuestions(assignment: FullCourse["sections"][number]["assignment"]): TaskQuestion[] {
  const raw = Array.isArray(assignment?.questions) ? assignment.questions : [];
  return raw.map((q, idx) => {
    const label = (q.type || assignment?.type || "").toLowerCase();
    let type: TaskQuestion["type"] = "SHORT_ANSWER";
    if (label.includes("mcq") || label.includes("choice")) type = "MCQ";
    else if (label.includes("file") || label.includes("project") || label.includes("upload")) type = "FILE_UPLOAD";
    else if (label.includes("long") || label.includes("cod") || label.includes("comprehens")) type = "LONG_ANSWER";

    return {
      id: q.id || `q-${idx + 1}`,
      type,
      prompt: q.prompt || `Question ${idx + 1}`,
      modelAnswer: q.modelAnswer,
      choices: Array.isArray(q.choices) ? q.choices : undefined,
      correctAnswer: typeof q.correctIndex === "number" ? q.correctIndex : undefined,
      maxPoints: typeof q.maxPoints === "number" ? q.maxPoints : undefined,
    };
  });
}

const STATUS_STYLE: Record<AssessmentRow["status"], string> = {
  Passed: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border dark:border-emerald-800/40",
  Failed: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 dark:border dark:border-rose-800/40",
  Pending: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 dark:border dark:border-amber-800/40",
};

export default function AssessmentsPage() {
  const session = useMockSession();
  const { user: clerkUser } = useUser();
  const clerkEmail = clerkUser?.primaryEmailAddress?.emailAddress || clerkUser?.emailAddresses?.[0]?.emailAddress;
  const effectiveEmail = (clerkEmail || session?.email || getClientSessionEmail() || "").toLowerCase().trim();

  const [isLoading, setIsLoading] = useState(true);
  const [assessments, setAssessments] = useState<AssessmentRow[]>([]);
  const [assignedTasks, setAssignedTasks] = useState<IndividualTask[]>([]);
  const [activeTab, setActiveTab] = useState<"tasks" | "milestones">("tasks");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeTask, setActiveTask] = useState<IndividualTask | null>(null);

  const loadAssessments = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Fetch individual assigned tasks
      if (effectiveEmail) {
        const tasks = await fetchStudentAssignedTasks(effectiveEmail);
        setAssignedTasks(tasks);
      }

      // 2. Fetch course milestone tests.
      // Curriculum comes from the API rather than the localStorage cache: an
      // assignment an admin edited after the student enrolled would otherwise
      // keep rendering from the copy cached at enrolment time.
      const enrollments = await fetchStudentEnrollments(effectiveEmail);
      let allCourses: FullCourse[] = await syncCoursesWithBackend().catch(() => []);
      if (!allCourses.length) allCourses = getStoredCourses();

      const uniqueEnrollments = enrollments.filter(
        (e, idx, arr) =>
          arr.findIndex(
            (x) =>
              (x.slug && x.slug === e.slug) ||
              (x.courseId && x.courseId === e.courseId)
          ) === idx
      );

      const rows: AssessmentRow[] = [];

      await Promise.all(
        uniqueEnrollments.map(async (e) => {
          // Draft / unpublished courses are absent from the public catalog,
          // so fall back to a direct read for enrolments we cannot resolve.
          const fullCourse =
            allCourses.find((c) => c.slug === e.slug || c.id === e.courseId) ||
            (await fetchLiveCourseBySlug(e.slug));
          let progress = await fetchCourseProgress(e.slug, effectiveEmail);

          if (fullCourse && fullCourse.sections && fullCourse.sections.length > 0) {
            fullCourse.sections.forEach((sec, sIdx) => {
              const assignmentId = sec.assignment?.id || `assign-${e.slug}-${sIdx + 1}`;
              const isCompleted = progress.completedAssignmentIds?.includes(assignmentId);
              const score = progress.assignmentScores?.[assignmentId] || (isCompleted ? 88 : 0);
              const rowKey = `${e.slug || e.courseId || "course"}-${assignmentId}-${sIdx}`;
              const minPassingScore =
                typeof sec.assignment?.minPassingScore === "number" ? sec.assignment.minPassingScore : 70;

              if (!rows.some((r) => r.uniqueKey === rowKey)) {
                rows.push({
                  uniqueKey: rowKey,
                  id: assignmentId,
                  title: sec.assignment?.title || `${sec.title} — Module Test`,
                  course: e.title,
                  courseSlug: e.slug,
                  score,
                  status: isCompleted ? (score >= minPassingScore ? "Passed" : "Failed") : "Pending",
                  date: isCompleted ? (e.lastAccessedAt ? e.lastAccessedAt.slice(0, 10) : new Date().toISOString().slice(0, 10)) : "—",
                  description: sec.assignment?.description || "",
                  minPassingScore,
                  questions: toTaskQuestions(sec.assignment),
                });
              }
            });
          }
        })
      );

      setAssessments(rows);
    } catch {
      setAssessments([]);
    } finally {
      setIsLoading(false);
    }
  }, [effectiveEmail]);

  useEffect(() => {
    loadAssessments();
    // Re-read on focus so assignments edited by an admin while this tab sat
    // open are picked up instead of the copy fetched on mount.
    const handleFocus = () => {
      if (document.visibilityState === "visible") loadAssessments();
    };
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
    };
  }, [loadAssessments]);

  const passedCount = assessments.filter((a) => a.status === "Passed").length;
  const pendingCount = assessments.filter((a) => a.status === "Pending").length;
  const completedTasksCount = assignedTasks.filter((t) => t.status === "COMPLETED" || t.status === "REVIEWED").length;
  const pendingTasksCount = assignedTasks.filter((t) => t.status === "PENDING").length;

  const activeAssessment = activeIndex !== null ? assessments[activeIndex] : null;

  const handleSubmitScore = (score: number) => {
    if (activeIndex === null) return;
    const target = assessments[activeIndex];
    if (!target) return;

    if (typeof window !== "undefined") {
      try {
        const key = `jks_prog_${target.courseSlug}_${effectiveEmail || "student"}`;
        const existing = JSON.parse(localStorage.getItem(key) || "{}");
        const completedIds = Array.from(new Set([...(existing.completedAssignmentIds || []), target.id]));
        const scores = { ...(existing.assignmentScores || {}), [target.id]: score };
        localStorage.setItem(
          key,
          JSON.stringify({
            ...existing,
            completedAssignmentIds: completedIds,
            assignmentScores: scores,
          })
        );
      } catch {}
    }

    submitAssessment({
      courseSlug: target.courseSlug,
      assessmentId: target.id,
      studentEmail: effectiveEmail,
      score,
      feedback: score >= target.minPassingScore
        ? "Exceeded performance benchmark across all core competencies."
        : "Score below passing mark. Please review relevant module lectures.",
    }).catch((err) => {
      console.warn("Failed to persist assessment to backend:", err);
    });

    syncAllCourseProgress({
      courseSlug: target.courseSlug,
      studentEmail: effectiveEmail,
      completedVideoIds: [],
      completedAssignmentIds: score >= target.minPassingScore ? [target.id] : [],
      assignmentScores: { [target.id]: score },
    }).catch(() => {});

    setAssessments((prev) =>
      prev.map((a, idx) =>
        idx === activeIndex
          ? {
              ...a,
              score,
              status: score >= target.minPassingScore ? "Passed" : "Failed",
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
        title="Assessments &amp; Tasks"
        subtitle="Individual tasks assigned by your instructors and course milestone assessments"
      />

      <div className="flex-1 space-y-6 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4">
        {/* Metric Cards */}
        <Reveal variant="stagger" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <TiltCard>
            <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary/90">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Assigned Tasks</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-[#2563EB] dark:bg-blue-950/40 dark:text-blue-400">
                  <FileText className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                {assignedTasks.length}
              </div>
              <div className="mt-1 text-xs text-[#2563EB] dark:text-blue-400 font-semibold">
                {pendingTasksCount} pending completion
              </div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary/90">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Course Milestones</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {passedCount}
              </div>
              <div className="mt-1 text-xs text-slate-500 font-medium">
                of {assessments.length} total quizzes passed
              </div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary/90">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Awaiting Submission</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                  <Clock className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-black text-amber-600 dark:text-amber-400">
                {pendingTasksCount + pendingCount}
              </div>
              <div className="mt-1 text-xs text-amber-600 dark:text-amber-400 font-semibold">
                Tasks &amp; tests ready for attempt
              </div>
            </div>
          </TiltCard>
        </Reveal>

        {/* TAB SWITCHER */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("tasks")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === "tasks"
                ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                : "bg-white dark:bg-surface-elevated text-slate-600 dark:text-slate-300 hover:bg-slate-50"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Assigned Individual Tasks ({assignedTasks.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("milestones")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === "milestones"
                ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                : "bg-white dark:bg-surface-elevated text-slate-600 dark:text-slate-300 hover:bg-slate-50"
            }`}
          >
            <ClipboardCheck className="h-4 w-4" />
            <span>Course Milestone Tests ({assessments.length})</span>
          </button>
        </div>

        {/* TAB 1: INDIVIDUAL STUDENT TASKS */}
        {activeTab === "tasks" && (
          <div className="rounded-[20px] border border-white/70 bg-white/80 p-4 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary/90">
            {assignedTasks.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[650px]">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                      <th className="pb-3 pr-4 pl-0">Task Details</th>
                      <th className="px-4 pb-3">Course</th>
                      <th className="px-4 pb-3">Due Date</th>
                      <th className="px-4 pb-3 text-center">Status</th>
                      <th className="px-4 pb-3 text-center">Grade</th>
                      <th className="pr-0 pb-3 pl-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {assignedTasks.map((t) => {
                      const isPending = t.status === "PENDING";
                      const isSubmitted = t.status === "SUBMITTED";
                      const isReviewed = t.status === "REVIEWED" || t.status === "COMPLETED";

                      return (
                        <tr key={t.id} className="transition-colors hover:bg-slate-50/60 dark:hover:bg-surface-elevated/60">
                          <td className="py-4 pr-4 pl-0">
                            <div className="font-bold text-slate-900 dark:text-white leading-snug">{t.title}</div>
                            <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{t.description}</div>
                          </td>

                          <td className="px-4 py-4 font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap">
                            {t.courseTitle || "General Track"}
                          </td>

                          <td className="px-4 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                            {t.dueDate ? (
                              <div className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                <span>{new Date(t.dueDate).toLocaleDateString("en-IN")}</span>
                              </div>
                            ) : (
                              "No deadline"
                            )}
                          </td>

                          <td className="px-4 py-4 text-center whitespace-nowrap">
                            {isSubmitted ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/50 px-2.5 py-0.5 text-[11px] font-bold text-[#2563EB] dark:text-blue-400">
                                <Clock className="h-3 w-3" /> Submitted
                              </span>
                            ) : isReviewed ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                                <CheckCircle2 className="h-3 w-3" /> Completed
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 dark:text-amber-300">
                                <Clock className="h-3 w-3" /> Pending
                              </span>
                            )}
                          </td>

                          <td className="px-4 py-4 text-center font-bold text-slate-900 dark:text-white whitespace-nowrap">
                            {t.submission?.score !== undefined ? (
                              <span className="rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 text-xs font-black">
                                {t.submission.score}/100
                              </span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>

                          <td className="pr-0 py-4 pl-4 text-right whitespace-nowrap">
                            {isPending ? (
                              <button
                                type="button"
                                onClick={() => setActiveTask(t)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
                              >
                                <PlayCircle className="h-3.5 w-3.5" />
                                <span>Take / Submit</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setActiveTask(t)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-elevated px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                <span>View Submission</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">No Individual Tasks Assigned Yet</h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  When your teachers or course instructors assign customized tasks or projects, they will appear here.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: COURSE MILESTONES */}
        {activeTab === "milestones" && (
          <div className="rounded-[20px] border border-white/70 bg-white/80 p-4 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary/90">
            {assessments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[550px]">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                      <th className="pb-3 pr-4 pl-0">Assessment</th>
                      <th className="px-4 pb-3">Course</th>
                      <th className="px-4 pb-3">Score</th>
                      <th className="px-4 pb-3">Status</th>
                      <th className="px-4 pb-3">Date</th>
                      <th className="pr-0 pb-3 pl-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {assessments.map((a, idx) => (
                      <tr key={a.uniqueKey || `${a.courseSlug}-${a.id}-${idx}`} className="transition-colors hover:bg-slate-50/60 dark:hover:bg-surface-elevated/60">
                        <td className="py-4 pr-4 pl-0 font-bold text-slate-900 dark:text-white whitespace-nowrap">{a.title}</td>
                        <td className="px-4 py-4 font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap">{a.course}</td>
                        <td className="px-4 py-4 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                          {a.status === "Pending" ? "—" : `${a.score}/100`}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_STYLE[a.status]}`}>
                            {a.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">{a.date}</td>
                        <td className="pr-0 py-4 pl-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setActiveIndex(idx)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-[#2563EB] shadow-xs hover:bg-[#EFF6FF] dark:border-slate-700 dark:bg-surface-elevated dark:text-blue-400 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
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
            ) : (
              <div className="py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400">
                  <ClipboardCheck className="h-6 w-6" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">No Assessments Available</h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Enroll in courses to unlock module quizzes, stage assignments, and architectural tests.
                </p>
                <div className="mt-4">
                  <Link
                    href="/dashboard/my-courses"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>Explore Courses</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* TAKE COURSE MILESTONE MODAL */}
      {activeAssessment && (
        <TakeAssessmentModal
          isOpen={activeIndex !== null}
          title={activeAssessment.title}
          course={activeAssessment.course}
          questions={activeAssessment.questions}
          instructions={activeAssessment.description}
          passingScore={activeAssessment.minPassingScore}
          studentEmail={effectiveEmail}
          onClose={() => setActiveIndex(null)}
          onSubmit={handleSubmitScore}
        />
      )}

      {/* TAKE INDIVIDUAL TASK MODAL */}
      {activeTask && (
        <TakeAssessmentModal
          isOpen={Boolean(activeTask)}
          title={activeTask.title}
          course={activeTask.courseTitle || "General Track"}
          task={activeTask}
          studentEmail={effectiveEmail}
          onClose={() => setActiveTask(null)}
          onSubmit={(score, data) => {
            setAssignedTasks((prev) =>
              prev.map((t) =>
                t.id === activeTask.id
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
            setActiveTask(null);
          }}
        />
      )}
    </>
  );
}
