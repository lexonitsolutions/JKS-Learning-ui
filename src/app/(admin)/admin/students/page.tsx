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
} from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { TiltCard } from "@/components/interactions/tilt-card";
import { Reveal } from "@/lib/motion/reveal";
import { fetchAdminStudents, type AdminStudentRecord } from "@/lib/data/students-api";

export default function AdminStudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<AdminStudentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"All" | "Enrolled" | "NoCourses">("All");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadStudents = useCallback(async (showToastNotification = false) => {
    if (showToastNotification) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const data = await fetchAdminStudents();
      const enriched = data.map((student) => {
        const updatedEnrollments = student.enrollments.map((e) => {
          let prog = e.progress || 0;
          if (typeof window !== "undefined") {
            try {
              const localKey = `jks_prog_${e.courseSlug}_${student.email.toLowerCase().trim()}`;
              const raw = localStorage.getItem(localKey);
              if (raw) {
                const parsed = JSON.parse(raw);
                const count = (parsed.completedVideoIds?.length || 0) + (parsed.completedAssignmentIds?.length || 0);
                if (count > 0) {
                  prog = Math.max(prog, Math.min(100, Math.round((count / 9) * 100)));
                }
              }
            } catch {}
          }
          return { ...e, progress: prog };
        });
        return { ...student, enrollments: updatedEnrollments };
      });

      setStudents(enriched);
      if (showToastNotification) {
        showToast(`Roster updated in real time. ${data.length} registered students loaded.`);
      }
    } catch (err) {
      console.error("Failed to load students:", err);
      showToast("Error updating students roster from API.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadStudents(false);

    const handleProgressChange = () => {
      loadStudents(false);
    };

    window.addEventListener("jks_video_progress_changed", handleProgressChange);
    window.addEventListener("focus", handleProgressChange);
    return () => {
      window.removeEventListener("jks_video_progress_changed", handleProgressChange);
      window.removeEventListener("focus", handleProgressChange);
    };
  }, [loadStudents]);

  // Derived Metrics from live data
  const totalRegistered = students.length;
  const enrolledCount = students.filter((s) => s.totalEnrolled > 0).length;
  const noCoursesCount = students.filter((s) => s.totalEnrolled === 0).length;

  // Filtered List
  const filtered = useMemo(() => {
    let list = students;

    if (filterTab === "Enrolled") {
      list = list.filter((s) => s.totalEnrolled > 0);
    } else if (filterTab === "NoCourses") {
      list = list.filter((s) => s.totalEnrolled === 0);
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
  }, [students, filterTab, searchQuery]);

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
      "Enrolled Courses & Progress",
    ];
    const rows = students.map((s) => [
      `"${s.id}"`,
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.email}"`,
      `"${s.phone || "N/A"}"`,
      `"${new Date(s.registeredAt).toLocaleString("en-IN")}"`,
      `"${s.totalEnrolled}"`,
      `"${
        s.enrollments.map((e) => `${e.courseTitle} (${e.progress}%)`).join("; ") ||
        "No courses enrolled yet."
      }"`,
    ]);

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
        title="Students Management"
        subtitle={`Live database roster: ${totalRegistered} registered ${
          totalRegistered === 1 ? "student" : "students"
        } across all enterprise tracks.`}
        userInitials="AD"
      />

      <div className="flex-1 space-y-5 p-3 sm:p-6 lg:p-8 lg:pt-4">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-2xl border border-blue-200 bg-white/95 px-5 py-3.5 text-xs font-bold text-[#2563EB] shadow-2xl backdrop-blur-md animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 text-[#2563EB] shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Live Metric KPI Cards (with Skeleton UI Support) */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="rounded-[20px] border border-slate-200/80 bg-white/80 p-5 shadow-sm animate-pulse space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="h-3.5 w-28 rounded bg-slate-200" />
                  <div className="h-8 w-8 rounded-full bg-slate-200" />
                </div>
                <div className="h-8 w-16 rounded bg-slate-300" />
                <div className="h-3 w-36 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        ) : (
          <Reveal variant="stagger" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <TiltCard>
              <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Total Registered</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-[#2563EB]">
                    <Users className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-2 text-2xl font-black text-slate-900">{totalRegistered}</div>
                <div className="mt-1 text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Live from API database
                </div>
              </div>
            </TiltCard>

            <TiltCard>
              <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Enrolled Learners</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <UserCheck className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-2 text-2xl font-black text-emerald-600">{enrolledCount}</div>
                <div className="mt-1 text-xs text-slate-500 font-medium">
                  {totalRegistered > 0
                    ? `${Math.round((enrolledCount / totalRegistered) * 100)}% conversion rate`
                    : "0%"}
                </div>
              </div>
            </TiltCard>

            <TiltCard>
              <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">No Courses Yet</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                    <UserX className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-2 text-2xl font-black text-amber-600">{noCoursesCount}</div>
                <div className="mt-1 text-xs text-slate-500 font-medium">New registered accounts</div>
              </div>
            </TiltCard>
          </Reveal>
        )}

        {/* Controls & Search Bar */}
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
            <div className="relative w-full sm:w-auto sm:min-w-[280px]">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, phone, or course…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pr-3 pl-9 text-xs font-medium text-slate-800 outline-none shadow-xs transition-colors focus:border-[#2563EB]"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1 shadow-xs overflow-x-auto">
              {[
                { id: "All", label: `All (${totalRegistered})` },
                { id: "Enrolled", label: `Enrolled (${enrolledCount})` },
                { id: "NoCourses", label: `No Courses (${noCoursesCount})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilterTab(tab.id as any)}
                  className={`rounded-lg px-3 py-1 text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                    filterTab === tab.id
                      ? "bg-[#2563EB] text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => loadStudents(true)}
              disabled={isRefreshing}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
              title="Refresh student roster from database"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-[#2563EB]" : ""}`}
              />
              <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-[#2563EB]" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Students Table with Skeleton (Skull UI) Loading Animation */}
        <div className="rounded-[20px] border border-white/70 bg-white/80 p-4 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[760px]">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                  <th className="pb-3 pr-4 pl-0">Student Profile</th>
                  <th className="px-4 pb-3">Enrolled Courses & Progress</th>
                  <th className="px-4 pb-3">Contact Details</th>
                  <th className="px-4 pb-3">Registration Date</th>
                  <th className="pr-0 pb-3 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* SKELETON UI (SKULL LOADING ANIMATION) */}
                {isLoading ? (
                  [1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-4 pr-4 pl-0">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-slate-200 shrink-0" />
                          <div className="space-y-1.5">
                            <div className="h-3.5 w-28 rounded bg-slate-300" />
                            <div className="h-2.5 w-40 rounded bg-slate-200" />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="h-10 w-48 rounded-xl bg-slate-200" />
                      </td>
                      <td className="px-4 py-4">
                        <div className="h-3.5 w-24 rounded bg-slate-200" />
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <div className="h-3.5 w-20 rounded bg-slate-200" />
                          <div className="h-2.5 w-14 rounded bg-slate-100" />
                        </div>
                      </td>
                      <td className="pr-0 py-4 pl-4 text-right">
                        <div className="inline-block h-8 w-24 rounded-xl bg-slate-200" />
                      </td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Users className="h-8 w-8 text-slate-300" />
                        <span className="font-bold text-slate-700">No students found</span>
                        <span className="text-xs text-slate-400">
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
                        className="group transition-colors hover:bg-blue-50/50 cursor-pointer"
                        title="Click to view full student profile & academic dossier"
                      >
                        {/* Student Name & Email */}
                        <td className="py-4 pr-4 pl-0 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-colors shadow-xs">
                              {initials}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 group-hover:text-[#2563EB] transition-colors flex items-center gap-1.5">
                                <span>{s.name}</span>
                                {s.totalEnrolled > 0 && (
                                  <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 text-[10px] font-bold">
                                    Enrolled
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                                <span>{s.email}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* List Enrolled Courses with Progress */}
                        <td className="px-4 py-4 max-w-xs">
                          {s.enrollments && s.enrollments.length > 0 ? (
                            <div className="space-y-2">
                              {s.enrollments.map((e) => (
                                <div
                                  key={e.enrollmentId}
                                  className="rounded-xl border border-slate-200/90 bg-slate-50/80 p-2 text-xs space-y-1"
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <span
                                      className="font-bold text-slate-900 truncate"
                                      title={e.courseTitle}
                                    >
                                      {e.courseTitle}
                                    </span>
                                    <span className="text-[10px] font-black text-[#2563EB] shrink-0 bg-blue-100/70 px-1.5 py-0.5 rounded">
                                      {e.progress}%
                                    </span>
                                  </div>
                                  <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-[#2563EB] to-cyan-500 rounded-full"
                                      style={{
                                        width: `${Math.max(4, Math.min(100, e.progress))}%`,
                                      }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 border border-amber-200/70 px-2.5 py-1 text-[11px] font-bold text-amber-800">
                              <UserX className="h-3 w-3 text-amber-600" />
                              <span>No courses enrolled yet.</span>
                            </span>
                          )}
                        </td>

                        {/* Phone & Contact */}
                        <td className="px-4 py-4 whitespace-nowrap text-slate-600 font-medium">
                          <div className="flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <span>
                              {s.phone && s.phone !== "N/A" ? s.phone : "No phone provided"}
                            </span>
                          </div>
                        </td>

                        {/* Registration Date */}
                        <td className="px-4 py-4 font-medium text-slate-600 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <span>
                              {new Date(s.registeredAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 pl-5">
                            {new Date(s.registeredAt).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="pr-0 py-4 pl-4 text-right whitespace-nowrap">
                          <div
                            className="flex items-center justify-end gap-1.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Link
                              href={`/admin/students/${s.id}`}
                              className="inline-flex items-center gap-1 rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition-all shadow-xs"
                            >
                              <span>View Profile</span>
                              <ChevronRight className="h-3.5 w-3.5" />
                            </Link>

                            <button
                              type="button"
                              onClick={() =>
                                showToast(`Direct messaging initiated with ${s.email}...`)
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                              title="Message Student"
                            >
                              <Mail className="h-3.5 w-3.5" />
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
        </div>
      </div>
    </>
  );
}
