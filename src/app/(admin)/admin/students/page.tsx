"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Users,
  UserCheck,
  UserX,
  Download,
  Mail,
  RefreshCw,
  BookOpen,
  Calendar,
  Layers,
  ArrowRight,
  Phone,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Star,
  MoreVertical,
  Edit3,
  ShieldAlert,
  PauseCircle,
  Trash2,
  Check,
  X,
  Tag,
  AlertCircle,
} from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { TiltCard } from "@/components/interactions/tilt-card";
import { Reveal } from "@/lib/motion/reveal";
import {
  fetchAdminStudents,
  updateAdminStudent,
  deleteAdminStudent,
  fetchPendingEnrollments,
  approveEnrollment,
  rejectEnrollment,
  type AdminStudentRecord,
  type PendingEnrollmentItem,
} from "@/lib/data/students-api";
import { getExactStudentCourseProgress } from "@/lib/data/enrollments-api";
import { apiFetch } from "@/lib/api/base-url";
import { MessageStudentModal } from "@/components/admin/message-student-modal";
import { EditStudentModal } from "@/components/admin/edit-student-modal";
import { motion } from "framer-motion";
import { CustomDropdown, type DropdownOption } from "@/components/ui/custom-dropdown";

export function getStudentProgressRating(progress: number) {
  if (progress >= 85) {
    return {
      stars: 5,
      score: "5.0",
      tier: "Top Performer",
      badgeColor: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40",
      barColor: "bg-gradient-to-r from-emerald-500 to-teal-500",
    };
  }
  if (progress >= 70) {
    return {
      stars: 5,
      score: "4.8",
      tier: "Star Learner",
      badgeColor: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40",
      barColor: "bg-gradient-to-r from-emerald-500 to-cyan-500",
    };
  }
  if (progress >= 50) {
    return {
      stars: 4,
      score: "4.0",
      tier: "Advanced",
      badgeColor: "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/40",
      barColor: "bg-gradient-to-r from-[#2563EB] to-cyan-500",
    };
  }
  if (progress >= 20) {
    return {
      stars: 3,
      score: "3.5",
      tier: "Active Learner",
      badgeColor: "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/40",
      barColor: "bg-gradient-to-r from-amber-500 to-orange-500",
    };
  }
  if (progress > 0) {
    return {
      stars: 2,
      score: "2.5",
      tier: "Beginner",
      badgeColor: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
      barColor: "bg-slate-400 dark:bg-slate-600",
    };
  }
  return {
    stars: 1,
    score: "1.0",
    tier: "Not Started",
    badgeColor: "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700",
    barColor: "bg-slate-200 dark:bg-slate-700",
  };
}

export default function AdminStudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<AdminStudentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"All" | "Pending" | "Enrolled" | "NoCourses">("All");
  const [courseFilter, setCourseFilter] = useState<string>("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [editingStudent, setEditingStudent] = useState<AdminStudentRecord | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [messageModalStudent, setMessageModalStudent] = useState<{
    name: string;
    email: string;
    phone?: string;
    id?: string;
    initials?: string;
    enrolledCourses?: string[];
  } | null>(null);

  // Pending Enrollments State
  const [pendingEnrollments, setPendingEnrollments] = useState<PendingEnrollmentItem[]>([]);
  const [isLoadingPending, setIsLoadingPending] = useState(false);
  const [rejectModalItem, setRejectModalItem] = useState<PendingEnrollmentItem | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState("");
  const [isActionInProgress, setIsActionInProgress] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadPending = useCallback(async () => {
    setIsLoadingPending(true);
    try {
      let list: PendingEnrollmentItem[] = [];
      if (typeof fetchPendingEnrollments === "function") {
        list = await fetchPendingEnrollments();
      } else {
        const res = await apiFetch("/admin/enrollments/pending", {
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) list = data;
        }
      }
      setPendingEnrollments(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to load pending enrollments:", err);
      setPendingEnrollments([]);
    } finally {
      setIsLoadingPending(false);
    }
  }, []);

  const handleApprove = async (item: PendingEnrollmentItem) => {
    setIsActionInProgress(item.id);
    try {
      let res: { success: boolean; data?: any; error?: string };
      if (typeof approveEnrollment === "function") {
        res = await approveEnrollment(item.id);
      } else {
        const response = await apiFetch(`/admin/enrollments/${encodeURIComponent(item.id)}/approve`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          res = { success: true, data: await response.json() };
        } else {
          const err = await response.json().catch(() => ({}));
          res = { success: false, error: err.message || "Failed to approve enrollment." };
        }
      }

      if (res.success) {
        showToast(`Enrollment approved for ${item.studentName}! Course access is now active.`);
        await Promise.all([loadPending(), loadStudents(false)]);
      } else {
        showToast(res.error || "Failed to approve enrollment.");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to approve enrollment.");
    } finally {
      setIsActionInProgress(null);
    }
  };

  const handleReject = async () => {
    if (!rejectModalItem) return;
    setIsActionInProgress(rejectModalItem.id);
    try {
      let res: { success: boolean; data?: any; error?: string };
      if (typeof rejectEnrollment === "function") {
        res = await rejectEnrollment(rejectModalItem.id, rejectionReasonInput.trim() || undefined);
      } else {
        const response = await apiFetch(`/admin/enrollments/${encodeURIComponent(rejectModalItem.id)}/reject`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason: rejectionReasonInput.trim() || undefined }),
        });
        if (response.ok) {
          res = { success: true, data: await response.json() };
        } else {
          const err = await response.json().catch(() => ({}));
          res = { success: false, error: err.message || "Failed to reject enrollment." };
        }
      }

      if (res.success) {
        showToast(`Enrollment request for ${rejectModalItem.studentName} was rejected.`);
        setRejectModalItem(null);
        setRejectionReasonInput("");
        await Promise.all([loadPending(), loadStudents(false)]);
      } else {
        showToast(res.error || "Failed to reject enrollment.");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to reject enrollment.");
    } finally {
      setIsActionInProgress(null);
    }
  };

  const handleToggleHold = async (s: AdminStudentRecord) => {
    const newStatus = s.status === "ON_HOLD" ? "ACTIVE" : "ON_HOLD";
    const res = await updateAdminStudent(s.id, { status: newStatus });
    if (res.success) {
      setStudents((prev) =>
        prev.map((item) => (item.id === s.id ? { ...item, status: newStatus } : item))
      );
      showToast(`Student status changed to ${newStatus === "ON_HOLD" ? "On Hold" : "Active"}.`);
    } else {
      showToast(res.error || "Failed to update status");
    }
    setOpenDropdownId(null);
  };

  const handleToggleBlock = async (s: AdminStudentRecord) => {
    const newStatus = s.status === "BLOCKED" ? "ACTIVE" : "BLOCKED";
    const res = await updateAdminStudent(s.id, { status: newStatus });
    if (res.success) {
      setStudents((prev) =>
        prev.map((item) => (item.id === s.id ? { ...item, status: newStatus } : item))
      );
      showToast(
        newStatus === "BLOCKED"
          ? `Student "${s.name}" is now blocked from logging in with this email.`
          : `Student "${s.name}" is unblocked.`
      );
    } else {
      showToast(res.error || "Failed to update status");
    }
    setOpenDropdownId(null);
  };

  const handleDeleteStudent = async (s: AdminStudentRecord) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently remove student "${s.name}" (${s.email})? This action cannot be undone.`
      )
    ) {
      return;
    }
    const res = await deleteAdminStudent(s.id);
    if (res.success) {
      setStudents((prev) => prev.filter((item) => item.id !== s.id));
      showToast(`Student "${s.name}" removed successfully.`);
    } else {
      showToast(res.error || "Failed to remove student.");
    }
    setOpenDropdownId(null);
  };

  const loadStudents = useCallback(async (isUserRefresh = false) => {
    if (isUserRefresh) {
      setIsRefreshing(true);
    }

    try {
      const data = await fetchAdminStudents();
      const enriched = data.map((student) => {
        const updatedEnrollments = student.enrollments.map((e) => {
          const dbProg = typeof e.progress === "number" ? e.progress : 0;
          const dbVids = typeof e.completedVideosCount === "number" ? e.completedVideosCount : 0;
          const exact = getExactStudentCourseProgress(e.courseSlug, student.email);
          const maxProg = Math.max(dbProg, exact.completedMilestones > 0 ? exact.overallPercent : 0);
          const maxVids = Math.max(dbVids, exact.completedVideoIds.length);
          return {
            ...e,
            progress: maxProg,
            completedVideosCount: maxVids,
          };
        });
        return { ...student, enrollments: updatedEnrollments };
      });

      setStudents(enriched);
      if (isUserRefresh) {
        showToast(`Roster updated in real time. ${data.length} registered students loaded.`);
      }
    } catch (err) {
      console.error("Failed to load students:", err);
      if (isUserRefresh) {
        showToast("Error updating students roster from API.");
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadStudents(false);
    loadPending();

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam?.toLowerCase() === "pending") {
        setFilterTab("Pending");
      }
    }

    const handleProgressChange = () => {
      loadStudents(false);
      loadPending();
    };

    window.addEventListener("jks_video_progress_changed", handleProgressChange);
    window.addEventListener("focus", handleProgressChange);
    return () => {
      window.removeEventListener("jks_video_progress_changed", handleProgressChange);
      window.removeEventListener("focus", handleProgressChange);
    };
  }, [loadStudents, loadPending]);

  // Derived Metrics from live data
  const totalRegistered = students.length;
  const enrolledCount = students.filter((s) => s.totalEnrolled > 0).length;
  const noCoursesCount = students.filter((s) => s.totalEnrolled === 0).length;

  // Every distinct course that at least one student is enrolled in, with its
  // live headcount — drives the "Course Enrolled" filter dropdown.
  const courseOptions = useMemo(() => {
    const map = new Map<string, { slug: string; title: string; count: number }>();
    students.forEach((s) => {
      const seen = new Set<string>();
      s.enrollments.forEach((e) => {
        const slug = (e.courseSlug || e.courseId || e.courseTitle || "").toLowerCase();
        if (!slug || seen.has(slug)) return;
        seen.add(slug);
        const existing = map.get(slug);
        if (existing) {
          existing.count += 1;
        } else {
          map.set(slug, { slug, title: e.courseTitle || slug, count: 1 });
        }
      });
    });
    return Array.from(map.values()).sort((a, b) => a.title.localeCompare(b.title));
  }, [students]);

  // Reset the course filter if that course disappears from the roster.
  useEffect(() => {
    if (courseFilter !== "ALL" && !courseOptions.some((c) => c.slug === courseFilter)) {
      setCourseFilter("ALL");
    }
  }, [courseOptions, courseFilter]);

  // Filtered List
  const filtered = useMemo(() => {
    let list = students;

    if (filterTab === "Enrolled") {
      list = list.filter((s) => s.totalEnrolled > 0);
    } else if (filterTab === "NoCourses") {
      list = list.filter((s) => s.totalEnrolled === 0);
    }

    if (courseFilter !== "ALL") {
      list = list.filter((s) =>
        s.enrollments.some(
          (e) => (e.courseSlug || e.courseId || e.courseTitle || "").toLowerCase() === courseFilter
        )
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          (s.phone && s.phone.toLowerCase().includes(q)) ||
          s.enrollments.some(
            (e) => e.courseTitle.toLowerCase().includes(q) || e.track.toLowerCase().includes(q)
          )
      );
    }

    return list;
  }, [students, filterTab, courseFilter, searchQuery]);

  // Filtered Pending Enrollments
  const filteredPending = useMemo(() => {
    let list = pendingEnrollments;
    if (courseFilter !== "ALL") {
      list = list.filter((p) => (p.courseSlug || p.courseId || p.courseTitle || "").toLowerCase() === courseFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.studentName.toLowerCase().includes(q) ||
          p.studentEmail.toLowerCase().includes(q) ||
          (p.studentPhone && p.studentPhone.toLowerCase().includes(q)) ||
          p.courseTitle.toLowerCase().includes(q) ||
          (p.couponCode && p.couponCode.toLowerCase().includes(q))
      );
    }
    return list;
  }, [pendingEnrollments, courseFilter, searchQuery]);

  // Dynamic CSV Exporter
  const handleExportCSV = () => {
    if (students.length === 0) {
      showToast("No student records to export.");
      return;
    }

    const headers = [
      "Student ID",
      "Name",
      "Email",
      "Phone",
      "Registration Date",
      "Enrolled Courses Count",
      "Overall Rating",
      "Average Progress",
    ];
    const rows = students.map((s) => {
      const avgProgress =
        s.enrollments.length > 0
          ? Math.round(
              s.enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) /
                s.enrollments.length
            )
          : 0;
      const rating = getStudentProgressRating(avgProgress);

      return [
        `"${s.id}"`,
        `"${s.name.replace(/"/g, '""')}"`,
        `"${s.email}"`,
        `"${s.phone || "N/A"}"`,
        `"${new Date(s.registeredAt).toLocaleString("en-IN")}"`,
        `"${s.totalEnrolled}"`,
        `"${s.enrollments.length > 0 ? `${rating.score}/5.0 Stars (${rating.tier})` : "Unrated"}"`,
        `"${s.enrollments.length > 0 ? `${avgProgress}%` : "0%"}"`,
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `JKS_Students_Roster_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Downloaded live students roster CSV successfully.");
  };

  return (
    <>
      <DashboardTopbar
        title="Students Directory"
        subtitle={`${students.length} registered students across all enterprise curriculum tracks.`}
        userInitials="LX"
      />

      <div className="flex-1 space-y-5 p-3 sm:p-6 lg:p-8 lg:pt-4">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-2xl border border-blue-200 dark:border-blue-800 bg-white/95 dark:bg-surface-hover/95 px-5 py-3.5 text-xs font-bold text-[#2563EB] dark:text-blue-400 shadow-2xl backdrop-blur-md animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 text-[#2563EB] dark:text-blue-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Live Metric KPI Cards (with Skeleton UI Support) */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="rounded-[20px] border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-surface-secondary p-5 shadow-sm animate-pulse space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="h-3.5 w-28 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800" />
                </div>
                <div className="h-8 w-16 rounded bg-slate-300 dark:bg-slate-700" />
                <div className="h-3 w-36 rounded bg-slate-200 dark:bg-slate-800" />
              </div>
            ))}
          </div>
        ) : (
          <Reveal variant="stagger" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <TiltCard>
              <div className="rounded-[20px] border border-white/70 dark:border-slate-800/80 bg-white/75 dark:bg-surface-secondary/90 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] dark:shadow-none backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Registered</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/50 text-[#2563EB] dark:text-blue-400">
                    <Users className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{totalRegistered}</div>
                <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Live from API database
                </div>
              </div>
            </TiltCard>

            <TiltCard>
              <div
                onClick={() => setFilterTab("Pending")}
                className={`rounded-[20px] border p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] dark:shadow-none backdrop-blur-xl cursor-pointer transition-all ${
                  pendingEnrollments.length > 0
                    ? "border-amber-300 dark:border-amber-700 bg-amber-50/70 dark:bg-amber-950/30 hover:border-amber-400"
                    : "border-white/70 dark:border-slate-800/80 bg-white/75 dark:bg-surface-secondary/90 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pending Approvals</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                    <Clock className={`h-4 w-4 ${pendingEnrollments.length > 0 ? "animate-pulse" : ""}`} />
                  </div>
                </div>
                <div className="mt-2 text-2xl font-black text-amber-700 dark:text-amber-400">
                  {pendingEnrollments.length}
                </div>
                <div className="mt-1 text-xs text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                  {pendingEnrollments.length > 0 ? "Action required: review requests" : "No pending reviews"}
                </div>
              </div>
            </TiltCard>

            <TiltCard>
              <div className="rounded-[20px] border border-white/70 dark:border-slate-800/80 bg-white/75 dark:bg-surface-secondary/90 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] dark:shadow-none backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Enrolled Learners</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                    <UserCheck className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">{enrolledCount}</div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {totalRegistered > 0
                    ? `${Math.round((enrolledCount / totalRegistered) * 100)}% conversion rate`
                    : "0%"}
                </div>
              </div>
            </TiltCard>

            <TiltCard>
              <div className="rounded-[20px] border border-white/70 dark:border-slate-800/80 bg-white/75 dark:bg-surface-secondary/90 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] dark:shadow-none backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">No Courses Yet</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                    <UserX className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-2 text-2xl font-black text-amber-600 dark:text-amber-400">{noCoursesCount}</div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">New registered accounts</div>
              </div>
            </TiltCard>
          </Reveal>
        )}

        {/* Controls & Search Bar */}
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
            <div className="relative w-full sm:w-auto sm:min-w-[280px]">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, phone, or course…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-input-bg py-2 pr-3 pl-9 text-xs font-medium text-slate-800 dark:text-white dark:placeholder-slate-400 outline-none shadow-xs transition-colors focus:border-[#2563EB] dark:focus:border-blue-500"
              />
            </div>

            {/* Filter Tabs with animated pill */}
            <div className="flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-elevated p-1 shadow-xs overflow-x-auto">
              {[
                { id: "All", label: `All (${totalRegistered})` },
                {
                  id: "Pending",
                  label: (
                    <span className="flex items-center gap-1.5">
                      <span>Pending Approvals</span>
                      <span
                        className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                          pendingEnrollments.length > 0
                            ? "bg-amber-500 text-white animate-pulse"
                            : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        {pendingEnrollments.length}
                      </span>
                    </span>
                  ),
                },
                { id: "Enrolled", label: `Enrolled (${enrolledCount})` },
                { id: "NoCourses", label: `No Courses (${noCoursesCount})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilterTab(tab.id as any)}
                  className={`relative rounded-lg px-3 py-1.5 text-xs font-bold transition-colors whitespace-nowrap cursor-pointer select-none ${
                    filterTab === tab.id
                      ? "text-white"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {filterTab === tab.id && (
                    <motion.div
                      layoutId="students-filter-pill"
                      className="absolute inset-0 rounded-lg bg-[#2563EB] shadow-xs"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Course Enrolled Filter using CustomDropdown */}
            <CustomDropdown
              options={[
                { value: "ALL", label: `All Courses (${courseOptions.length})` },
                ...courseOptions.map((c) => ({
                  value: c.slug,
                  label: c.title,
                  count: c.count,
                })),
              ]}
              value={courseFilter}
              onChange={(val) => setCourseFilter(val)}
              placeholder="Filter by Enrolled Course"
              icon={<Layers className="h-3.5 w-3.5 text-[#2563EB] dark:text-blue-400" />}
              searchable={courseOptions.length > 5}
              minWidth="min-w-[210px] max-w-[280px]"
            />

            {(courseFilter !== "ALL" || filterTab !== "All" || searchQuery.trim()) && (
              <button
                type="button"
                onClick={() => {
                  setCourseFilter("ALL");
                  setFilterTab("All");
                  setSearchQuery("");
                }}
                className="self-start rounded-xl px-2.5 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer whitespace-nowrap"
              >
                Clear filters ({filterTab === "Pending" ? filteredPending.length : filtered.length})
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => {
                loadStudents(true);
                loadPending();
              }}
              disabled={isRefreshing}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-elevated px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-xs hover:bg-slate-50 dark:hover:bg-surface-hover transition-colors cursor-pointer disabled:opacity-50"
              title="Refresh student roster and pending requests from database"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-[#2563EB] dark:text-blue-400" : ""}`}
              />
              <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-elevated px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-xs hover:bg-slate-50 dark:hover:bg-surface-hover transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-[#2563EB] dark:text-blue-400" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Main Content: Pending Approvals View OR Standard Students Roster */}
        {filterTab === "Pending" ? (
          <div className="rounded-[20px] border border-white/70 dark:border-slate-800/80 bg-white/80 dark:bg-surface-secondary/90 p-4 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] dark:shadow-none backdrop-blur-xl">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-500 animate-pulse" />
                  Course Enrollment Requests Awaiting Admin Approval
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Review applicant details, course selection, and applied coupons before granting active course access.
                </p>
              </div>
              <div className="text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 px-3 py-1.5 rounded-xl w-fit">
                {filteredPending.length} Request{filteredPending.length === 1 ? "" : "s"} Pending
              </div>
            </div>

            {isLoadingPending ? (
              <div className="py-12 text-center text-slate-400 animate-pulse">
                <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-[#2563EB]" />
                Loading enrollment approval queue...
              </div>
            ) : filteredPending.length === 0 ? (
              <div className="py-16 text-center text-slate-400 dark:text-slate-500">
                <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-1">Queue is all clear</span>
                  <span className="text-xs text-slate-400">
                    {searchQuery
                      ? "No pending enrollment requests match your current search filters."
                      : "There are currently no course enrollment requests waiting for review. All students are either confirmed or fully processed."}
                  </span>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[860px] border-separate border-spacing-y-2">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-400 uppercase">
                      <th className="pb-3 pr-4 pl-4">Applicant Student</th>
                      <th className="px-4 pb-3">Course & Timing</th>
                      <th className="px-4 pb-3">Requested Date</th>
                      <th className="px-4 pb-3">Coupon & Amount</th>
                      <th className="px-4 pb-3">Status</th>
                      <th className="pr-4 pb-3 pl-4 text-right">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPending.map((item) => (
                      <tr
                        key={item.id}
                        className="bg-white/95 dark:bg-surface-elevated/70 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-xs transition-colors hover:bg-slate-50/90 dark:hover:bg-surface-hover"
                      >
                        {/* Student Details */}
                        <td className="py-3.5 pr-4 pl-4 first:rounded-l-2xl">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950/60 text-xs font-bold text-amber-700 dark:text-amber-400 shadow-xs border border-amber-200/60 dark:border-amber-800/40">
                              {item.studentName?.slice(0, 2).toUpperCase() || "ST"}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 dark:text-white truncate">
                                {item.studentName}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate">
                                <Mail className="h-3 w-3 shrink-0" />
                                <span>{item.studentEmail}</span>
                              </div>
                              {item.studentPhone && item.studentPhone !== "N/A" && (
                                <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                                  <Phone className="h-3 w-3 shrink-0" />
                                  <span>{item.studentPhone}</span>
                                </div>
                              )}
                              {item.studentAddress && item.studentAddress !== "Online Enrollment" && (
                                <div className="text-[10px] text-slate-400 truncate max-w-[200px]">
                                  {item.studentAddress}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Course & Timing */}
                        <td className="px-4 py-3.5">
                          <div className="font-bold text-slate-900 dark:text-white max-w-[220px]">
                            {item.courseTitle}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Mode: <span className="font-medium text-slate-700 dark:text-slate-300">{item.paymentMode || "Online Application"}</span>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="font-semibold text-slate-700 dark:text-slate-300">
                            {new Date(item.enrolledAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {new Date(item.enrolledAt).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </td>

                        {/* Coupon & Amount */}
                        <td className="px-4 py-3.5">
                          <div className="space-y-1">
                            {item.couponCode ? (
                              <div className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-800/60">
                                <Tag className="h-2.5 w-2.5" />
                                {item.couponCode}
                                {item.discountAmount ? ` (-₹${item.discountAmount.toLocaleString("en-IN")})` : ""}
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-400 block">No coupon applied</span>
                            )}
                            <div className="font-bold text-slate-900 dark:text-white text-xs">
                              Payable: ₹{(item.finalAmount ?? 0).toLocaleString("en-IN")}
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100/90 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 shadow-xs">
                            <Clock className="h-3 w-3 animate-pulse text-amber-600" />
                            Pending Approval
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="pr-4 py-3.5 pl-4 text-right last:rounded-r-2xl whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              disabled={isActionInProgress === item.id}
                              onClick={() => handleApprove(item)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs hover:shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
                              title="Approve student enrollment and release course access"
                            >
                              <Check className="h-3.5 w-3.5" />
                              <span>{isActionInProgress === item.id ? "Approving..." : "Approve"}</span>
                            </button>

                            <button
                              type="button"
                              disabled={isActionInProgress === item.id}
                              onClick={() => {
                                setRejectModalItem(item);
                                setRejectionReasonInput("");
                              }}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold text-xs hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-all cursor-pointer disabled:opacity-50"
                              title="Reject student enrollment request"
                            >
                              <X className="h-3.5 w-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          /* Students Table with Skeleton (Skull UI) Loading Animation */
          <div className="rounded-[20px] border border-white/70 dark:border-slate-800/80 bg-white/80 dark:bg-surface-secondary/90 p-4 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] dark:shadow-none backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[760px] border-separate border-spacing-y-1.5">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-400 uppercase">
                  <th className="pb-3 pr-4 pl-4">Student Profile</th>
                  <th className="px-4 pb-3">Student Rating</th>
                  <th className="px-4 pb-3">Contact Details</th>
                  <th className="px-4 pb-3">Registration Date</th>
                  <th className="pr-4 pb-3 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* SKELETON UI (SKULL LOADING ANIMATION) */}
                {isLoading ? (
                  [1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-3.5 pr-4 pl-4 first:rounded-l-2xl">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
                          <div className="space-y-1.5">
                            <div className="h-3.5 w-28 rounded bg-slate-300 dark:bg-slate-700" />
                            <div className="h-2.5 w-40 rounded bg-slate-200 dark:bg-slate-800" />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="h-10 w-48 rounded-xl bg-slate-200 dark:bg-slate-800" />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="h-3.5 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="space-y-1">
                          <div className="h-3.5 w-20 rounded bg-slate-200 dark:bg-slate-800" />
                          <div className="h-2.5 w-14 rounded bg-slate-100 dark:bg-surface-hover" />
                        </div>
                      </td>
                      <td className="pr-4 py-3.5 pl-4 text-right last:rounded-r-2xl">
                        <div className="inline-block h-8 w-24 rounded-xl bg-slate-200 dark:bg-slate-800" />
                      </td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400 dark:text-slate-400 font-medium">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Users className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                        <span className="font-bold text-slate-700 dark:text-slate-200">No students found</span>
                        <span className="text-xs text-slate-400 dark:text-slate-400">
                          {searchQuery
                            ? "No registered students match your search criteria."
                            : "No registered student records exist in the database."}
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((s) => {
                    const initials = s.name
                      ? s.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()
                      : "ST";

                    return (
                      <tr
                        key={s.id}
                        onClick={() => router.push(`/admin/students/${s.id}`)}
                        className="group transition-all duration-200 ease-out hover:bg-slate-100/60 dark:hover:bg-white/[0.035] hover:shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:hover:shadow-[0_2px_14px_rgba(0,0,0,0.3)] cursor-pointer"
                        title="Click to view full student profile & academic dossier"
                      >
                        {/* Student Name & Email */}
                        <td className="py-3.5 pr-4 pl-4 whitespace-nowrap first:rounded-l-2xl">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/60 text-xs font-bold text-[#2563EB] dark:text-blue-400 group-hover:bg-[#2563EB] dark:group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-xs">
                              {initials}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors flex items-center gap-1.5 flex-wrap">
                                <span>{s.name}</span>
                                {s.status === "BLOCKED" ? (
                                  <span className="rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40 px-2 py-0.2 text-[10px] font-bold flex items-center gap-1">
                                    <ShieldAlert className="h-3 w-3" /> Blocked
                                  </span>
                                ) : s.status === "ON_HOLD" ? (
                                  <span className="rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40 px-2 py-0.2 text-[10px] font-bold flex items-center gap-1">
                                    <PauseCircle className="h-3 w-3" /> On Hold
                                  </span>
                                ) : s.totalEnrolled > 0 ? (
                                  <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 px-1.5 py-0.2 text-[10px] font-bold">
                                    Enrolled
                                  </span>
                                ) : (
                                  <span className="rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-1.5 py-0.2 text-[10px] font-medium">
                                    Registered
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] font-medium text-slate-400 dark:text-slate-400 flex items-center gap-1">
                                <span>{s.email}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Overall Student Rating (Calculated from entire courses average progress - No course names shown outside) */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          {s.enrollments && s.enrollments.length > 0 ? (
                            (() => {
                              const avgProgress = Math.round(
                                s.enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) /
                                  s.enrollments.length
                              );
                              const rating = getStudentProgressRating(avgProgress);

                              return (
                                <div className="flex items-center gap-2.5">
                                  {/* Single Star Icon + Score (e.g. 4.8/5) */}
                                  <div className="flex items-center gap-1 shrink-0">
                                    <Star className="h-4 w-4 text-amber-500 fill-amber-500 shrink-0" />
                                    <span className="text-[13px] font-black text-slate-900 dark:text-white">
                                      {rating.score}
                                      <span className="text-[11px] font-bold text-slate-400 dark:text-slate-400">/5</span>
                                    </span>
                                  </div>

                                  {/* Tier Badge */}
                                  <span
                                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold border ${rating.badgeColor} shrink-0`}
                                  >
                                    {rating.tier}
                                  </span>

                                  {/* Enrolled Courses Count */}
                                  <span className="text-[11px] font-medium text-slate-400 dark:text-slate-400">
                                    ({s.enrollments.length} {s.enrollments.length === 1 ? "Course" : "Courses"})
                                  </span>
                                </div>
                              );
                            })()
                          ) : (
                            <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-400">
                              <Star className="h-4 w-4 text-slate-300 dark:text-slate-600 shrink-0" />
                              <span className="text-xs font-medium text-slate-400 dark:text-slate-400">
                                —/5 <span className="text-slate-300 dark:text-slate-600">•</span> Unrated
                              </span>
                            </div>
                          )}
                        </td>

                        {/* Phone & Contact */}
                        <td className="px-4 py-3.5 whitespace-nowrap text-slate-600 dark:text-slate-300 font-medium">
                          <div className="flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5 text-slate-400 dark:text-slate-400 shrink-0" />
                            <span>
                              {s.phone && s.phone !== "N/A" ? s.phone : "No phone provided"}
                            </span>
                          </div>
                        </td>

                        {/* Registration Date */}
                        <td className="px-4 py-3.5 font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-slate-400 dark:text-slate-400 shrink-0" />
                            <span>
                              {s.registeredAt
                                ? new Date(s.registeredAt).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "Recent"}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-400 pl-5">
                            {new Date(s.registeredAt).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="pr-4 py-3.5 pl-4 text-right whitespace-nowrap last:rounded-r-2xl">
                          <div
                            className="flex items-center justify-end gap-1.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Link
                              href={`/admin/students/${s.id}`}
                              className="inline-flex items-center gap-1 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#2563EB] dark:text-blue-400 hover:bg-[#2563EB] hover:text-white border border-transparent dark:border-blue-800/40 px-3 py-1.5 text-xs font-bold transition-all shadow-xs"
                            >
                              <span>View Profile</span>
                              <ChevronRight className="h-3.5 w-3.5" />
                            </Link>

                            <button
                              type="button"
                              onClick={() =>
                                setMessageModalStudent({
                                  name: s.name,
                                  email: s.email,
                                  phone: s.phone,
                                  id: s.id,
                                  enrolledCourses: s.enrollments.map((e) => e.courseTitle),
                                })
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-elevated text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-surface-hover hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                              title="Message Student"
                            >
                              <Mail className="h-3.5 w-3.5" />
                            </button>

                            {/* Three Dots Menu for Student Operations */}
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() =>
                                  setOpenDropdownId(openDropdownId === s.id ? null : s.id)
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-elevated text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-surface-hover hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                                title="Account Settings & Controls"
                              >
                                <MoreVertical className="h-3.5 w-3.5" />
                              </button>

                              {openDropdownId === s.id && (
                                <div className="absolute right-0 top-9 z-30 w-48 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary p-1.5 shadow-2xl space-y-0.5 text-left animate-in fade-in zoom-in-95">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingStudent(s);
                                      setOpenDropdownId(null);
                                    }}
                                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-surface-hover cursor-pointer"
                                  >
                                    <Edit3 className="h-3.5 w-3.5 text-[#2563EB] dark:text-blue-400" />
                                    <span>Edit Details</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleToggleHold(s)}
                                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 cursor-pointer"
                                  >
                                    <PauseCircle className="h-3.5 w-3.5" />
                                    <span>{s.status === "ON_HOLD" ? "Remove Hold" : "Put on Hold"}</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleToggleBlock(s)}
                                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                                  >
                                    <ShieldAlert className="h-3.5 w-3.5" />
                                    <span>{s.status === "BLOCKED" ? "Unblock Account" : "Block Account"}</span>
                                  </button>

                                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteStudent(s)}
                                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    <span>Remove Student</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
        )}
      </div>

      {/* DIRECT MESSAGE STUDENT MODAL */}
      <MessageStudentModal
        isOpen={Boolean(messageModalStudent)}
        onClose={() => setMessageModalStudent(null)}
        student={messageModalStudent}
        onMessageSent={(summary) => showToast(summary)}
      />

      {/* EDIT STUDENT PROFILE MODAL */}
      <EditStudentModal
        isOpen={Boolean(editingStudent)}
        student={editingStudent}
        onClose={() => setEditingStudent(null)}
        onSaved={(updated) => {
          setStudents((prev) =>
            prev.map((item) => (item.id === updated.id ? { ...item, ...updated } : item))
          );
          showToast(`Student details for "${updated.name}" updated successfully.`);
        }}
      />

      {/* REJECT ENROLLMENT MODAL */}
      {rejectModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-rose-500" />
                Reject Course Enrollment
              </h3>
              <button
                type="button"
                onClick={() => setRejectModalItem(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-xl bg-slate-50 dark:bg-surface-elevated p-3 text-xs space-y-1">
              <div className="font-semibold text-slate-800 dark:text-white">
                Student: <span className="font-normal">{rejectModalItem.studentName} ({rejectModalItem.studentEmail})</span>
              </div>
              <div className="font-semibold text-slate-800 dark:text-white">
                Course: <span className="font-normal">{rejectModalItem.courseTitle}</span>
              </div>
              {rejectModalItem.couponCode && (
                <div className="font-semibold text-slate-800 dark:text-white">
                  Coupon: <span className="font-mono text-purple-600">{rejectModalItem.couponCode}</span>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Reason for rejection (will be shown to the student in their dashboard):
              </label>
              <textarea
                rows={3}
                value={rejectionReasonInput}
                onChange={(e) => setRejectionReasonInput(e.target.value)}
                placeholder="e.g., Incomplete fee clearance, invalid enrollment details, or duplicate application..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalItem(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-surface-hover rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isActionInProgress === rejectModalItem.id}
                onClick={handleReject}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isActionInProgress === rejectModalItem.id ? "Rejecting..." : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

