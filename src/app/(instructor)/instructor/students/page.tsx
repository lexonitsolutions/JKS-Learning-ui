"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  BookOpen,
  CheckCircle2,
  Clock,
  ChevronRight,
  AlertCircle,
  Eye,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Reveal } from "@/lib/motion/reveal";
import { fetchAdminStudents, type AdminStudentRecord } from "@/lib/data/students-api";
import { useMockSession } from "@/lib/auth/use-mock-auth";

interface StudentRosterItem {
  id: string;
  slug: string;
  name: string;
  email: string;
  initials: string;
  courseTitle: string;
  progressPercent: number;
  completedVideos: number;
  totalVideos: number;
  assignmentAvg: number;
  lastActive: string;
  status: "Completed" | "In Progress" | "Needs Attention";
}

export default function InstructorStudentsPage() {
  const session = useMockSession();
  const lecturerInitials = session?.initials || "LE";

  const [rawStudents, setRawStudents] = useState<AdminStudentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await fetchAdminStudents();
        if (isMounted) setRawStudents(data);
      } catch (err) {
        console.warn("Failed to load students:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const students: StudentRosterItem[] = rawStudents.map((s) => {
    const primaryEnrollment = s.enrollments?.[0];
    const progressPercent = typeof primaryEnrollment?.progress === "number" ? primaryEnrollment.progress : 0;
    const completedVideos = primaryEnrollment?.completedVideosCount ?? 0;
    const totalVideos = 26;
    const status: "Completed" | "In Progress" | "Needs Attention" =
      progressPercent >= 100
        ? "Completed"
        : progressPercent > 0 && progressPercent < 40
        ? "Needs Attention"
        : "In Progress";

    const initials = s.name
      ? s.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
      : "ST";

    return {
      id: s.id,
      slug: s.id,
      name: s.name || "Student",
      email: s.email,
      initials,
      courseTitle:
        primaryEnrollment?.courseTitle ||
        (s.totalEnrolled > 0 ? `${s.totalEnrolled} Courses Enrolled` : "Enrolled Learner"),
      progressPercent,
      completedVideos,
      totalVideos,
      assignmentAvg: progressPercent >= 70 ? 88 : 72,
      lastActive: s.registeredAt
        ? new Date(s.registeredAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
        : "Recently active",
      status,
    };
  });

  const filteredStudents = students.filter((s) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      s.name.toLowerCase().includes(query) ||
      s.email.toLowerCase().includes(query) ||
      s.courseTitle.toLowerCase().includes(query);
    const matchesStatus = statusFilter === "All" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <DashboardTopbar
        title="Faculty Student Roster"
        subtitle={
          isLoading
            ? "Connecting to database records..."
            : `${students.length} real students registered in database across course tracks.`
        }
        userInitials={lecturerInitials}
      />

      <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8 lg:pt-4 max-w-7xl mx-auto w-full">
        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-3 max-w-md w-full">
            <div className="relative w-full">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-400" />
              <input
                type="text"
                placeholder="Search students by name, email, or course…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg py-2.5 pr-3 pl-9 text-xs font-medium text-slate-800 dark:text-white dark:placeholder-slate-400 outline-none shadow-xs transition-colors focus:border-[#2563EB]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3.5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-[#2563EB] shadow-xs"
            >
              <option value="All">All Progress States</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Needs Attention">Needs Attention</option>
            </select>
          </div>
        </div>

        {/* Mobile View: Cards layout for small screens (< 768px) */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filteredStudents.map((st) => (
            <Link
              key={st.id}
              href={`/instructor/students/${st.slug}`}
              className="rounded-[22px] border border-white/80 dark:border-slate-800/80 bg-white/95 dark:bg-surface-secondary p-5 shadow-sm space-y-3.5 active:scale-[0.99] transition-all hover:border-blue-300 dark:hover:border-blue-600/50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-xs font-black text-[#2563EB] dark:text-blue-400">
                    {st.initials}
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900 dark:text-white text-sm">{st.name}</div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-400">{st.email}</div>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    st.status === "Completed"
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400"
                      : st.status === "Needs Attention"
                      ? "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400"
                      : "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400"
                  }`}
                >
                  {st.status === "Completed" && <CheckCircle2 className="h-3 w-3" />}
                  {st.status === "Needs Attention" && <AlertCircle className="h-3 w-3" />}
                  {st.status}
                </span>
              </div>

              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-surface-elevated p-2.5 rounded-xl">
                {st.courseTitle}
              </div>

              {/* Progress */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600 dark:text-slate-400">Video Progress ({st.completedVideos}/{st.totalVideos})</span>
                  <span className="text-[#2563EB] dark:text-blue-400">{st.progressPercent}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      st.progressPercent === 100
                        ? "bg-emerald-500"
                        : st.progressPercent < 40
                        ? "bg-amber-500"
                        : "bg-[#2563EB]"
                    }`}
                    style={{ width: `${st.progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold">
                <span className="text-slate-500 dark:text-slate-400">Avg Score: <strong className="text-slate-900 dark:text-white">{st.assignmentAvg}%</strong></span>
                <span className="text-[#2563EB] dark:text-blue-400 font-bold flex items-center gap-1">
                  <span>View Dossier</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Desktop View: Full Data Table (>= 768px) */}
        <div className="hidden md:block rounded-[24px] border border-white/80 dark:border-slate-800/80 bg-white/90 dark:bg-surface-secondary shadow-[0_8px_30px_rgb(20,50,100,0.04)] backdrop-blur-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-surface-elevated text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-4">Student</th>
                  <th className="px-5 py-4">Course Track</th>
                  <th className="px-5 py-4">Video Progress</th>
                  <th className="px-5 py-4">Assignment Avg</th>
                  <th className="px-5 py-4">Last Active</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80 dark:divide-slate-800/80">
                {filteredStudents.map((st) => (
                  <tr
                    key={st.id}
                    className="hover:bg-blue-50/40 dark:hover:bg-surface-hover transition-colors group cursor-pointer"
                  >
                    <td className="px-5 py-4">
                      <Link
                        href={`/instructor/students/${st.slug}`}
                        className="flex items-center gap-3"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-xs font-bold text-[#2563EB] dark:text-blue-400 group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                          {st.initials}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                            <span>{st.name}</span>
                            <Eye className="h-3 w-3 text-slate-400 dark:text-slate-400 group-hover:text-[#2563EB] dark:group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="text-[11px] text-slate-400 dark:text-slate-400">{st.email}</div>
                        </div>
                      </Link>
                    </td>

                    <td className="px-5 py-4 font-medium text-slate-800 dark:text-slate-200">
                      <Link href={`/instructor/students/${st.slug}`} className="block">
                        {st.courseTitle}
                      </Link>
                    </td>

                    <td className="px-5 py-4 min-w-[150px]">
                      <Link href={`/instructor/students/${st.slug}`} className="block space-y-1">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-slate-900 dark:text-white">{st.progressPercent}%</span>
                          <span className="text-slate-400 dark:text-slate-400 font-normal">
                            {st.completedVideos}/{st.totalVideos} videos
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              st.progressPercent === 100
                                ? "bg-emerald-500"
                                : st.progressPercent < 40
                                ? "bg-amber-500"
                                : "bg-[#2563EB]"
                            }`}
                            style={{ width: `${st.progressPercent}%` }}
                          />
                        </div>
                      </Link>
                    </td>

                    <td className="px-5 py-4">
                      <Link href={`/instructor/students/${st.slug}`} className="inline-block">
                        <span
                          className={`inline-flex items-center font-bold px-2 py-0.5 rounded ${
                            st.assignmentAvg >= 80
                              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400"
                              : st.assignmentAvg >= 65
                              ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400"
                              : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400"
                          }`}
                        >
                          {st.assignmentAvg}%
                        </span>
                      </Link>
                    </td>

                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400 font-medium">{st.lastActive}</td>

                    <td className="px-5 py-4">
                      <Link href={`/instructor/students/${st.slug}`} className="inline-block">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            st.status === "Completed"
                              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400"
                              : st.status === "Needs Attention"
                              ? "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400"
                              : "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400"
                          }`}
                        >
                          {st.status === "Completed" && <CheckCircle2 className="h-3 w-3" />}
                          {st.status === "Needs Attention" && <AlertCircle className="h-3 w-3" />}
                          {st.status}
                        </span>
                      </Link>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/instructor/students/${st.slug}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-elevated px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-[#2563EB] hover:text-white dark:hover:bg-[#2563EB] dark:hover:text-white hover:border-[#2563EB] transition-all shadow-xs"
                      >
                        <span>View Academic Dossier</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
