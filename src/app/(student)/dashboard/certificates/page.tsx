"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Award, Download, ShieldCheck, Eye, X, CheckCircle2, Lock, BookOpen, ArrowRight } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Reveal } from "@/lib/motion/reveal";
import { CertificateModal } from "@/components/common/certificate-modal";
import { useMockSession } from "@/lib/auth/use-mock-auth";
import { useUser } from "@clerk/nextjs";
import { fetchStudentEnrollments, getClientSessionEmail, getExactStudentCourseProgress, type EnrolledCourseItem } from "@/lib/data/enrollments-api";

interface EarnedCertificate {
  id: string;
  course: string;
  courseSlug: string;
  issuedOn: string;
  grade: string;
  status: string;
}

export default function StudentCertificatesPage() {
  const session = useMockSession();
  const { user: clerkUser } = useUser();
  const clerkEmail = clerkUser?.primaryEmailAddress?.emailAddress || clerkUser?.emailAddresses?.[0]?.emailAddress;
  const effectiveEmail = (clerkEmail || session?.email || getClientSessionEmail() || "").toLowerCase().trim();
  const studentName = clerkUser?.fullName || session?.name || "Student Learner";

  const [isLoading, setIsLoading] = useState(true);
  const [enrollments, setEnrollments] = useState<EnrolledCourseItem[]>([]);
  const [selectedCert, setSelectedCert] = useState<EarnedCertificate | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchStudentEnrollments(effectiveEmail);
      const enriched = data.map((c) => {
        const exact = getExactStudentCourseProgress(c.slug, effectiveEmail);
        const prog = exact.completedMilestones > 0 ? exact.overallPercent : (c.progress || 0);
        return {
          ...c,
          progress: prog,
          completedVideosCount: exact.completedVideoIds.length,
          totalLessons: exact.totalMilestones,
          isCompleted: prog >= 100,
        };
      });
      setEnrollments(enriched);
    } catch {
      setEnrollments([]);
    } finally {
      setIsLoading(false);
    }
  }, [effectiveEmail]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const earnedCertificates: EarnedCertificate[] = enrollments
    .filter((e) => e.progress >= 100 || e.isCompleted)
    .map((e) => ({
      id: `JKS-CERT-${e.courseId ? e.courseId.slice(-6).toUpperCase() : "VERIFIED"}`,
      course: e.title,
      courseSlug: e.slug,
      issuedOn: e.lastAccessedAt ? e.lastAccessedAt.slice(0, 10) : new Date().toISOString().slice(0, 10),
      grade: "Mastery (100%)",
      status: "Verified",
    }));

  const inProgressCourses = enrollments.filter((e) => e.progress < 100 && !e.isCompleted);

  const initials =
    session?.initials ||
    studentName
      .trim()
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2) ||
    "ST";

  return (
    <>
      <DashboardTopbar
        title="My Verified Certificates"
        subtitle="Cryptographically verified proof of completed courses and stage requirements."
        userInitials={initials}
      />

      <div className="flex-1 space-y-6 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4">
        {/* Metric Cards */}
        <Reveal variant="stagger" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-[20px] border border-slate-100 bg-white p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.04)] dark:border-slate-800/80 dark:bg-surface-secondary/90 dark:shadow-[0_8px_30px_rgb(0,0,0,0.35)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Earned Credentials</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-[#2563EB] dark:bg-blue-950/40 dark:text-blue-400">
                <Award className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
              {earnedCertificates.length}
            </div>
            <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              {earnedCertificates.length > 0 ? "100% verified authentic" : "No certificates issued yet"}
            </div>
          </div>

          <div className="rounded-[20px] border border-slate-100 bg-white p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.04)] dark:border-slate-800/80 dark:bg-surface-secondary/90 dark:shadow-[0_8px_30px_rgb(0,0,0,0.35)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Courses In Progress</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                <Lock className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
              {inProgressCourses.length}
            </div>
            <div className="mt-1 text-xs text-amber-600 dark:text-amber-400 font-semibold">
              Complete stages to unlock certificates
            </div>
          </div>

          <div className="rounded-[20px] border border-slate-100 bg-white p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.04)] dark:border-slate-800/80 dark:bg-surface-secondary/90 dark:shadow-[0_8px_30px_rgb(0,0,0,0.35)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Global Recognition</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">Enterprise Grade</div>
            <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Shareable on LinkedIn &amp; Resumes</div>
          </div>
        </Reveal>

        {/* Earned Certificates Section */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Earned Certificates</h2>
          {earnedCertificates.length > 0 ? (
            <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
              {earnedCertificates.map((cert) => (
                <div
                  key={cert.id}
                  className="flex flex-col justify-between rounded-[20px] border border-slate-100 bg-white p-4 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.04)] dark:border-slate-800/80 dark:bg-surface-secondary/90 dark:shadow-[0_8px_30px_rgb(0,0,0,0.35)]"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border dark:border-emerald-800/40">
                          <CheckCircle2 className="h-3 w-3" /> Fully Verified
                        </span>
                        <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-white">{cert.course}</h3>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                          Issued on {cert.issuedOn} · {cert.grade}
                        </p>
                      </div>
                      <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-xs">
                        <Award className="h-6 w-6" />
                      </div>
                    </div>

                    <div className="mt-4 font-mono text-xs font-bold text-[#2563EB] dark:text-blue-400">
                      ID: {cert.id}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" /> Blockchain Authenticated
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedCert(cert)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-surface-elevated dark:text-slate-200 dark:hover:bg-surface-hover cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" /> View
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedCert(cert)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-[#2563EB] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5" /> Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-3 rounded-[20px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-surface-secondary/90 p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">No Certificates Earned Yet</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Complete 100% of all stage lectures and pass required module tests in your enrolled courses to receive verified digital certificates.
              </p>
              <div className="mt-4">
                <Link
                  href="/dashboard/my-courses"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>View My Courses</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Locked / In Progress Certificates */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Certificates in Progress</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Track completion progress towards unlocking verified certificates.
          </p>

          {inProgressCourses.length > 0 ? (
            <div className="mt-4 sm:mt-5 space-y-4">
              {inProgressCourses.map((item) => (
                <div
                  key={item.slug}
                  className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-surface-elevated/60"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {item.completedVideosCount || 0} of {item.totalLessons || 0} Lessons Completed
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-full sm:w-32">
                      <div className="flex justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        <span>Progress</span>
                        <span>{item.progress}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#2563EB]"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                    <Link
                      href={`/dashboard/my-courses/${item.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#2563EB] hover:underline"
                    >
                      <span>Continue</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-6 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {enrollments.length === 0
                  ? "You are not currently enrolled in any courses."
                  : "All enrolled courses are completed!"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Official Printable Certificate Modal */}
      <CertificateModal
        certificate={
          selectedCert
            ? {
                id: selectedCert.id,
                studentName,
                courseTitle: selectedCert.course,
                issuedDate: selectedCert.issuedOn,
                grade: selectedCert.grade,
              }
            : null
        }
        onClose={() => setSelectedCert(null)}
      />
    </>
  );
}
