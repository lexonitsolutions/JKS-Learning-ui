"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Award,
  ShieldCheck,
  Eye,
  CheckCircle2,
  Plus,
  X,
  Loader2,
  RefreshCw,
  Sparkles,
  Users,
  BookOpen,
  Search,
} from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { TiltCard } from "@/components/interactions/tilt-card";
import { Reveal } from "@/lib/motion/reveal";
import { CertificateModal, type CertificateData } from "@/components/common/certificate-modal";
import {
  fetchAdminCertificates,
  issueCertificateByAdmin,
  fetchPendingCompletions,
  approveCourseCompletion,
  type AdminCertificateItem,
  type PendingCompletionItem,
} from "@/lib/data/certificates-api";
import { fetchAdminStudents, type AdminStudentRecord } from "@/lib/data/students-api";
import { useSearchParams } from "next/navigation";
import { fetchDbCourses } from "@/lib/data/courses-api";
import type { Course } from "@/lib/data/courses";

export default function AdminCertificatesPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "pending" ? "pending" : "issued";

  const [certificates, setCertificates] = useState<AdminCertificateItem[]>([]);
  const [pendingCompletions, setPendingCompletions] = useState<PendingCompletionItem[]>([]);
  const [students, setStudents] = useState<AdminStudentRecord[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"issued" | "pending">(initialTab);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("ALL");
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Distinct courses for dropdown filter
  const uniqueCourses = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => {
      if (c.title) set.add(c.title);
    });
    certificates.forEach((c) => {
      if (c.courseTitle) set.add(c.courseTitle);
    });
    pendingCompletions.forEach((p) => {
      if (p.courseTitle) set.add(p.courseTitle);
    });
    return Array.from(set).sort();
  }, [courses, certificates, pendingCompletions]);

  // Filtered issued certificates
  const filteredCertificates = useMemo(() => {
    let list = certificates;

    if (selectedCourse !== "ALL") {
      list = list.filter(
        (c) =>
          c.courseTitle === selectedCourse ||
          c.courseId === selectedCourse ||
          c.courseSlug === selectedCourse
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((c) => {
        const studentNameMatch = c.studentName?.toLowerCase().includes(q);
        const studentEmailMatch = c.studentEmail?.toLowerCase().includes(q);
        const studentIdMatch = c.userId?.toLowerCase().includes(q);
        const certIdMatch =
          c.verificationId?.toLowerCase().includes(q) || c.id?.toLowerCase().includes(q);
        const courseMatch = c.courseTitle?.toLowerCase().includes(q);
        return studentNameMatch || studentEmailMatch || studentIdMatch || certIdMatch || courseMatch;
      });
    }

    return list;
  }, [certificates, selectedCourse, searchQuery]);

  // Filtered pending completions
  const filteredPendingCompletions = useMemo(() => {
    let list = pendingCompletions;

    if (selectedCourse !== "ALL") {
      list = list.filter(
        (p) =>
          p.courseTitle === selectedCourse ||
          p.courseId === selectedCourse ||
          p.courseSlug === selectedCourse
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const studentNameMatch = p.studentName?.toLowerCase().includes(q);
        const studentEmailMatch = p.studentEmail?.toLowerCase().includes(q);
        const studentIdMatch = p.userId?.toLowerCase().includes(q);
        const courseMatch = p.courseTitle?.toLowerCase().includes(q);
        return studentNameMatch || studentEmailMatch || studentIdMatch || courseMatch;
      });
    }

    return list;
  }, [pendingCompletions, selectedCourse, searchQuery]);

  const [selectedCert, setSelectedCert] = useState<CertificateData | null>(null);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState<boolean>(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [isIssuing, setIsIssuing] = useState<boolean>(false);
  const [issueError, setIssueError] = useState<string | null>(null);

  const loadAllData = useCallback(async () => {
    try {
      const [certsData, pendingData, studentsData, coursesData] = await Promise.all([
        fetchAdminCertificates(),
        fetchPendingCompletions(),
        fetchAdminStudents(),
        fetchDbCourses(),
      ]);

      setCertificates(certsData);
      setPendingCompletions(pendingData);
      setStudents(studentsData);
      setCourses(coursesData);

      if (studentsData.length > 0 && !selectedStudentId) {
        setSelectedStudentId(studentsData[0].id);
      }
      if (coursesData.length > 0 && !selectedCourseId) {
        setSelectedCourseId((coursesData[0] as any).id || coursesData[0].slug);
      }
    } catch (err) {
      console.warn("Failed to load certificate workspace data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedStudentId, selectedCourseId]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const handleRefresh = () => {
    setRefreshing(true);
    setActionMessage(null);
    loadAllData();
  };

  const handleApproveCompletion = async (enrollmentId: string, studentName: string, courseTitle: string) => {
    setApprovingId(enrollmentId);
    setActionMessage(null);
    const res = await approveCourseCompletion(enrollmentId);
    if (res.success) {
      setActionMessage({
        type: "success",
        text: `Successfully approved 100% course completion and issued certificate for ${studentName} (${courseTitle})!`,
      });
      await loadAllData();
    } else {
      setActionMessage({
        type: "error",
        text: res.error || "Failed to approve course completion.",
      });
    }
    setApprovingId(null);
  };

  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !selectedCourseId) {
      setIssueError("Please select both a student and a course.");
      return;
    }

    setIsIssuing(true);
    setIssueError(null);

    const res = await issueCertificateByAdmin(selectedStudentId, selectedCourseId);
    if (res.success) {
      setIsIssueModalOpen(false);
      await loadAllData();
      const student = students.find((s) => s.id === selectedStudentId);
      const course = courses.find((c) => (c as any).id === selectedCourseId || c.slug === selectedCourseId);
      if (student && course && res.certificate) {
        setSelectedCert({
          id: res.certificate.verificationId || "CERT-" + Date.now(),
          studentName: student.name || student.email.split("@")[0],
          courseTitle: course.title,
          issuedDate: new Date().toISOString(),
          grade: "Mastery & Stage Completion (100%)",
        });
      }
    } else {
      setIssueError(res.error || "Failed to issue certificate");
    }
    setIsIssuing(false);
  };

  return (
    <>
      <DashboardTopbar
        title="Certificates"
        subtitle={`${certificates.length} cryptographically verified certificates issued to real graduates in database.`}
        userInitials="AD"
      />

      <div className="flex-1 space-y-6 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4">
        {/* Actions Bar */}
        <div className="flex items-center justify-end gap-2">

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-xs hover:bg-slate-50 dark:hover:bg-surface-hover cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-primary-blue" : ""}`} />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIssueError(null);
                setIsIssueModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary-fill px-4 py-2 text-xs font-bold text-white shadow-md shadow-primary-blue/20 hover:bg-blue-600 cursor-pointer transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Issue Certificate</span>
            </button>
          </div>
        </div>

        {/* Metric Cards with Real DB Counts */}
        <Reveal variant="stagger" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <TiltCard>
            <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary dark:shadow-none">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Issued Credentials
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-[#2563EB] dark:bg-blue-950/50 dark:text-blue-400">
                  <Award className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
                {certificates.length.toLocaleString()}
              </div>
              <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                {certificates.length > 0 ? "100% verified authentic" : "Ready to award"}
              </div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary dark:shadow-none">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Completion Milestone
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
                Stage-Verified
              </div>
              <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                All videos + assignments passed
              </div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary dark:shadow-none">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Verification Ledger
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                  <ShieldCheck className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
                Instant QR & ID
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                Publicly verifiable cryptographic proofs
              </div>
            </div>
          </TiltCard>
        </Reveal>

        {/* Tab Switcher & Search & Filter Controls */}
        <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("issued")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === "issued"
                  ? "bg-[#2563EB] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-surface-secondary border border-slate-200 dark:border-slate-800"
              }`}
            >
              Issued Credentials ({filteredCertificates.length}{filteredCertificates.length !== certificates.length ? ` / ${certificates.length}` : ""})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("pending")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === "pending"
                  ? "bg-[#2563EB] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-surface-secondary border border-slate-200 dark:border-slate-800"
              }`}
            >
              <span>Pending Completions</span>
              {pendingCompletions.length > 0 && (
                <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-extrabold text-white animate-pulse">
                  {filteredPendingCompletions.length}
                </span>
              )}
            </button>
          </div>

          {/* Search bar & Course Dropdown */}
          <div className="flex flex-1 flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-end gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px] sm:max-w-md">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by student ID, name, email, cert ID, course..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg py-2 pr-8 pl-9 text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-[#2563EB]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute top-1/2 right-2.5 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  title="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Course Dropdown Filter */}
            <div className="relative min-w-[180px]">
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

            {(searchQuery || selectedCourse !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCourse("ALL");
                }}
                className="inline-flex items-center gap-1 rounded-xl px-2.5 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                title="Reset all filters"
              >
                <X className="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Action Feedback Banner */}
        {actionMessage && (
          <div
            className={`flex items-center gap-2 rounded-xl p-3 text-xs font-semibold ${
              actionMessage.type === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                : "bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800"
            }`}
          >
            {actionMessage.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <X className="h-4 w-4 shrink-0" />
            )}
            <span>{actionMessage.text}</span>
          </div>
        )}

        {/* Real-Time Certificates / Pending Completions Table */}
        <div className="rounded-[20px] border border-white/70 bg-white/80 p-4 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary dark:shadow-none">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Loading database certificates...
              </p>
            </div>
          ) : activeTab === "pending" ? (
            /* Pending Course Completions Tab */
            pendingCompletions.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  No Pending Course Completions
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  When enrolled students reach 100% video lectures and pass all milestone assessments, their completion requests will appear here for admin review and approval before certificate issuance.
                </p>
              </div>
            ) : filteredPendingCompletions.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  No Matching Completion Requests Found
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  No pending completion requests match your search criteria. Try adjusting your search query or selecting "All Courses".
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCourse("ALL");
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-elevated px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-surface-hover transition-colors cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" /> Clear Filters
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-400 uppercase">
                      <th className="pb-3 pr-4 pl-0">Student</th>
                      <th className="px-4 pb-3">Course &amp; Track</th>
                      <th className="px-4 pb-3">Completed Lectures</th>
                      <th className="px-4 pb-3">Requested At</th>
                      <th className="px-4 pb-3 text-center">Status</th>
                      <th className="pr-0 pb-3 pl-4 text-right">Approval Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                    {filteredPendingCompletions.map((p) => (
                      <tr
                        key={p.enrollmentId}
                        className="transition-colors hover:bg-slate-50/60 dark:hover:bg-surface-hover"
                      >
                        <td className="py-4 pr-4 pl-0 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{p.studentName}</p>
                            <p className="text-[10px] text-slate-400 font-normal">{p.studentEmail}</p>
                            {p.userId && (
                              <p className="text-[9px] text-slate-400/80 font-mono font-normal">ID: {p.userId}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap">
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-white">{p.courseTitle}</p>
                            <span className="inline-block mt-0.5 rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                              {p.track}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 text-xs font-bold text-[#2563EB] dark:text-blue-400">
                            {p.completedLectures} Lectures Done
                          </span>
                        </td>
                        <td className="px-4 py-4 font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                          {p.requestedAt
                            ? new Date(p.requestedAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "Recent"}
                        </td>
                        <td className="px-4 py-4 text-center whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
                            Pending Admin Approval
                          </span>
                        </td>
                        <td className="pr-0 py-4 pl-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleApproveCompletion(p.enrollmentId, p.studentName, p.courseTitle)}
                            disabled={approvingId === p.enrollmentId}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-50 transition-all cursor-pointer"
                          >
                            {approvingId === p.enrollmentId ? (
                              <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                <span>Approving...</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>Approve &amp; Issue Certificate</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : certificates.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-primary-blue flex items-center justify-center">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No Certificates Issued Yet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Real-time certificates issued to verified graduates from the database will appear here. You can issue a certificate now.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIssueError(null);
                  setIsIssueModalOpen(true);
                }}
                className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-primary-fill px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-primary-blue/25 hover:bg-blue-600 cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Issue First Certificate
              </button>
            </div>
          ) : filteredCertificates.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-[#2563EB] dark:text-blue-400 flex items-center justify-center">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No Matching Certificates Found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                No issued certificates match your search query or course selection. Try clearing your filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCourse("ALL");
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-elevated px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-surface-hover transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" /> Clear Filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[650px]">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-400 uppercase">
                    <th className="pb-3 pr-4 pl-0">Student</th>
                    <th className="px-4 pb-3">Course Completed</th>
                    <th className="px-4 pb-3">Verification ID</th>
                    <th className="px-4 pb-3">Issued Date</th>
                    <th className="px-4 pb-3 text-center">Status</th>
                    <th className="pr-0 pb-3 pl-4 text-right">Certificate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                  {filteredCertificates.map((c) => (
                    <tr
                      key={c.id || c.verificationId}
                      className="transition-colors hover:bg-slate-50/60 dark:hover:bg-surface-hover"
                    >
                      <td className="py-4 pr-4 pl-0 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{c.studentName}</p>
                          {c.studentEmail && (
                            <p className="text-[10px] text-slate-400 font-normal">{c.studentEmail}</p>
                          )}
                          {c.userId && (
                            <p className="text-[9px] text-slate-400/80 font-mono font-normal">ID: {c.userId}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {c.courseTitle}
                      </td>
                      <td className="px-4 py-4 font-mono font-bold text-[#2563EB] dark:text-blue-400 whitespace-nowrap">
                        {c.verificationId}
                      </td>
                      <td className="px-4 py-4 font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {c.issuedAt
                          ? new Date(c.issuedAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "Verified"}
                      </td>
                      <td className="px-4 py-4 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                          <ShieldCheck className="h-3 w-3" /> Valid
                        </span>
                      </td>
                      <td className="pr-0 py-4 pl-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedCert({
                              id: c.verificationId,
                              studentName: c.studentName,
                              courseTitle: c.courseTitle,
                              issuedDate: c.issuedAt || new Date().toISOString(),
                              grade: c.grade || "Mastery & Stage Completion (100%)",
                            })
                          }
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-[#2563EB] shadow-xs hover:bg-[#EFF6FF] dark:border-slate-700/80 dark:bg-surface-elevated dark:text-blue-400 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" /> Preview
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Issue Real Certificate */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-primary-blue dark:bg-blue-950/50 dark:text-blue-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Issue Authentic Certificate
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Generates a cryptographically verified credential in MongoDB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsIssueModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-surface-hover hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleIssueCertificate} className="mt-4 space-y-4">
              {issueError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/50 dark:border-rose-900 text-xs font-semibold text-rose-700 dark:text-rose-400">
                  {issueError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-primary-blue" />
                  Select Real Student
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-elevated px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:border-primary-blue focus:outline-none"
                  required
                >
                  <option value="" disabled>
                    -- Select enrolled student --
                  </option>
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name || st.email} ({st.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-primary-blue" />
                  Select Course
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-elevated px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:border-primary-blue focus:outline-none"
                  required
                >
                  <option value="" disabled>
                    -- Select course --
                  </option>
                  {courses.map((c) => {
                    const cId = (c as any).id || c.slug;
                    return (
                      <option key={c.slug} value={cId}>
                        {c.title} ({c.track})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsIssueModalOpen(false)}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-surface-hover cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isIssuing}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary-fill px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-primary-blue/25 hover:bg-blue-600 disabled:opacity-50 cursor-pointer"
                >
                  {isIssuing ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Issuing...</span>
                    </>
                  ) : (
                    <>
                      <Award className="h-3.5 w-3.5" />
                      <span>Issue Certificate</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certificate Preview & Print Modal */}
      <CertificateModal
        certificate={selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </>
  );
}
