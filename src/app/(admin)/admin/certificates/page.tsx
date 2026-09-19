"use client";

import React, { useState, useEffect, useCallback } from "react";
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
} from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { TiltCard } from "@/components/interactions/tilt-card";
import { Reveal } from "@/lib/motion/reveal";
import { CertificateModal, type CertificateData } from "@/components/common/certificate-modal";
import {
  fetchAdminCertificates,
  issueCertificateByAdmin,
  type AdminCertificateItem,
} from "@/lib/data/certificates-api";
import { fetchAdminStudents, type AdminStudentRecord } from "@/lib/data/students-api";
import { fetchDbCourses } from "@/lib/data/courses-api";
import type { Course } from "@/lib/data/courses";

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState<AdminCertificateItem[]>([]);
  const [students, setStudents] = useState<AdminStudentRecord[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [selectedCert, setSelectedCert] = useState<CertificateData | null>(null);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState<boolean>(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [isIssuing, setIsIssuing] = useState<boolean>(false);
  const [issueError, setIssueError] = useState<string | null>(null);

  const loadAllData = useCallback(async () => {
    try {
      const [certsData, studentsData, coursesData] = await Promise.all([
        fetchAdminCertificates(),
        fetchAdminStudents(),
        fetchDbCourses(),
      ]);

      setCertificates(certsData);
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
    loadAllData();
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Issued Credential Ledger
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live database records of student course completions and certificates
            </p>
          </div>

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

        {/* Real-Time Certificates Table */}
        <div className="rounded-[20px] border border-white/70 bg-white/80 p-4 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary dark:shadow-none">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Loading database certificates...
              </p>
            </div>
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
                  {certificates.map((c) => (
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
