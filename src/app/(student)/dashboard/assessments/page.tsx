"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ClipboardCheck, CheckCircle2, Clock, PlayCircle, BookOpen, ArrowRight } from "lucide-react";
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
  type EnrolledCourseItem,
} from "@/lib/data/enrollments-api";
import { getStoredCourses, type FullCourse } from "@/lib/data/courses-store";

interface AssessmentRow {
  id: string;
  title: string;
  course: string;
  courseSlug: string;
  score: number;
  status: "Passed" | "Failed" | "Pending";
  date: string;
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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const loadAssessments = useCallback(async () => {
    setIsLoading(true);
    try {
      const enrollments = await fetchStudentEnrollments(effectiveEmail);
      const allCourses: FullCourse[] = getStoredCourses();

      const rows: AssessmentRow[] = [];

      await Promise.all(
        enrollments.map(async (e) => {
          const fullCourse = allCourses.find((c) => c.slug === e.slug || c.id === e.courseId);
          let progress = await fetchCourseProgress(e.slug, effectiveEmail);

          if (fullCourse && fullCourse.sections && fullCourse.sections.length > 0) {
            fullCourse.sections.forEach((sec, sIdx) => {
              const assignmentId = sec.assignment?.id || `assign-${e.slug}-${sIdx + 1}`;
              const isCompleted = progress.completedAssignmentIds?.includes(assignmentId);
              const score = progress.assignmentScores?.[assignmentId] || (isCompleted ? 88 : 0);

              rows.push({
                id: assignmentId,
                title: sec.assignment?.title || `${sec.title} — Module Test`,
                course: e.title,
                courseSlug: e.slug,
                score,
                status: isCompleted ? (score >= 70 ? "Passed" : "Failed") : "Pending",
                date: isCompleted ? (e.lastAccessedAt ? e.lastAccessedAt.slice(0, 10) : new Date().toISOString().slice(0, 10)) : "—",
              });
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
  }, [loadAssessments]);

  const passedCount = assessments.filter((a) => a.status === "Passed").length;
  const pendingCount = assessments.filter((a) => a.status === "Pending").length;
  const gradedAssessments = assessments.filter((a) => a.status !== "Pending");
  const avgScore = gradedAssessments.length > 0
    ? Math.round(gradedAssessments.reduce((sum, a) => sum + a.score, 0) / gradedAssessments.length)
    : 0;

  const activeAssessment = activeIndex !== null ? assessments[activeIndex] : null;

  const handleSubmitScore = (score: number) => {
    if (activeIndex === null) return;
    const target = assessments[activeIndex];
    if (!target) return;

    // Save to localStorage progress
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

    // Persist real submission to Backend API
    submitAssessment({
      courseSlug: target.courseSlug,
      assessmentId: target.id,
      studentEmail: effectiveEmail,
      score,
      feedback: score >= 70
        ? "Exceeded performance benchmark across all core competencies."
        : "Score below passing mark. Please review relevant module lectures.",
    }).catch((err) => {
      console.warn("Failed to persist assessment to backend:", err);
    });

    // Sync to Backend DB
    syncAllCourseProgress({
      courseSlug: target.courseSlug,
      studentEmail: effectiveEmail,
      completedVideoIds: [],
      completedAssignmentIds: score >= 70 ? [target.id] : [],
      assignmentScores: { [target.id]: score },
    }).catch(() => {});

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
        subtitle="Module tests and coding assessments across your enrolled courses"
      />

      <div className="flex-1 space-y-6 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4">
        {/* Metric Cards */}
        <Reveal variant="stagger" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <TiltCard>
            <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary/90 dark:shadow-[0_8px_30px_rgb(0,0,0,0.35)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Passed</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">{passedCount}</div>
              <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                {assessments.length > 0 ? `of ${assessments.length} total assessments` : "No assessments taken"}
              </div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary/90 dark:shadow-[0_8px_30px_rgb(0,0,0,0.35)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Average Score</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-[#2563EB] dark:bg-blue-950/40 dark:text-blue-400">
                  <ClipboardCheck className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">{avgScore}/100</div>
              <div className="mt-1 text-xs text-[#2563EB] dark:text-blue-400 font-semibold">Across completed attempts</div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary/90 dark:shadow-[0_8px_30px_rgb(0,0,0,0.35)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Awaiting You</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                  <Clock className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">{pendingCount}</div>
              <div className="mt-1 text-xs text-amber-600 dark:text-amber-400 font-semibold">Ready to attempt now</div>
            </div>
          </TiltCard>
        </Reveal>

        {/* Table / List */}
        <div className="rounded-[20px] border border-white/70 bg-white/80 p-4 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary/90 dark:shadow-[0_8px_30px_rgb(0,0,0,0.35)]">
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
                    <tr key={a.id || a.title} className="transition-colors hover:bg-slate-50/60 dark:hover:bg-surface-elevated/60">
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
      </div>

      {/* Take Assessment Modal */}
      {activeAssessment && (
        <TakeAssessmentModal
          isOpen={activeIndex !== null}
          title={activeAssessment.title}
          course={activeAssessment.course}
          onClose={() => setActiveIndex(null)}
          onSubmit={handleSubmitScore}
        />
      )}
    </>
  );
}
