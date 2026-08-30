"use client";

import React, { useState } from "react";
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

const INSTRUCTOR_STUDENTS: StudentRosterItem[] = [
  {
    id: "st-1",
    slug: "priya-nair",
    name: "Priya Nair",
    email: "priya.nair@example.com",
    initials: "PN",
    courseTitle: "Java Full Stack Developer Mastery",
    progressPercent: 92,
    completedVideos: 24,
    totalVideos: 26,
    assignmentAvg: 88,
    lastActive: "Today at 2:15 PM",
    status: "In Progress",
  },
  {
    id: "st-2",
    slug: "arjun-mehta",
    name: "Arjun Mehta",
    email: "arjun.mehta@example.com",
    initials: "AM",
    courseTitle: "Java Full Stack Developer Mastery",
    progressPercent: 100,
    completedVideos: 26,
    totalVideos: 26,
    assignmentAvg: 94,
    lastActive: "Yesterday",
    status: "Completed",
  },
  {
    id: "st-3",
    slug: "sneha-kulkarni",
    name: "Sneha Kulkarni",
    email: "sneha.kulkarni@example.com",
    initials: "SK",
    courseTitle: ".NET Full Stack Developer Enterprise Edition",
    progressPercent: 74,
    completedVideos: 17,
    totalVideos: 23,
    assignmentAvg: 82,
    lastActive: "2 days ago",
    status: "In Progress",
  },
  {
    id: "st-4",
    slug: "rahul-verma",
    name: "Rahul Verma",
    email: "rahul.verma@example.com",
    initials: "RV",
    courseTitle: "Java Full Stack Developer Mastery",
    progressPercent: 35,
    completedVideos: 9,
    totalVideos: 26,
    assignmentAvg: 58,
    lastActive: "5 days ago",
    status: "Needs Attention",
  },
  {
    id: "st-5",
    slug: "karthik-reddy",
    name: "Karthik Reddy",
    email: "karthik.reddy@example.com",
    initials: "KR",
    courseTitle: "Java Full Stack Developer Mastery",
    progressPercent: 88,
    completedVideos: 23,
    totalVideos: 26,
    assignmentAvg: 91,
    lastActive: "Today at 10:00 AM",
    status: "In Progress",
  },
  {
    id: "st-6",
    slug: "divya-menon",
    name: "Divya Menon",
    email: "divya.menon@example.com",
    initials: "DM",
    courseTitle: ".NET Full Stack Developer Enterprise Edition",
    progressPercent: 42,
    completedVideos: 10,
    totalVideos: 23,
    assignmentAvg: 64,
    lastActive: "1 week ago",
    status: "Needs Attention",
  },
];

export default function InstructorStudentsPage() {
  const [students] = useState<StudentRosterItem[]>(INSTRUCTOR_STUDENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

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
        subtitle={`${students.length} active learners enrolled across your curriculum tracks.`}
        userInitials="RK"
      />

      <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8 lg:pt-4 max-w-7xl mx-auto w-full">
        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-3 max-w-md w-full">
            <div className="relative w-full">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search students by name, email, or course…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-3 pl-9 text-xs font-medium text-slate-800 outline-none shadow-xs transition-colors focus:border-[#2563EB]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-[#2563EB] shadow-xs"
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
              className="rounded-[22px] border border-white/80 bg-white/95 p-5 shadow-sm space-y-3.5 active:scale-[0.99] transition-all hover:border-blue-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-xs font-black text-[#2563EB]">
                    {st.initials}
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900 text-sm">{st.name}</div>
                    <div className="text-[11px] text-slate-400">{st.email}</div>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    st.status === "Completed"
                      ? "bg-emerald-50 text-emerald-700"
                      : st.status === "Needs Attention"
                      ? "bg-rose-50 text-rose-700"
                      : "bg-blue-50 text-blue-700"
                  }`}
                >
                  {st.status === "Completed" && <CheckCircle2 className="h-3 w-3" />}
                  {st.status === "Needs Attention" && <AlertCircle className="h-3 w-3" />}
                  {st.status}
                </span>
              </div>

              <div className="text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-xl">
                {st.courseTitle}
              </div>

              {/* Progress */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600">Video Progress ({st.completedVideos}/{st.totalVideos})</span>
                  <span className="text-[#2563EB]">{st.progressPercent}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
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

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-semibold">
                <span className="text-slate-500">Avg Score: <strong className="text-slate-900">{st.assignmentAvg}%</strong></span>
                <span className="text-[#2563EB] font-bold flex items-center gap-1">
                  <span>View Dossier</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Desktop View: Full Data Table (>= 768px) */}
        <div className="hidden md:block rounded-[24px] border border-white/80 bg-white/90 shadow-[0_8px_30px_rgb(20,50,100,0.04)] backdrop-blur-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
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
              <tbody className="divide-y divide-slate-100/80">
                {filteredStudents.map((st) => (
                  <tr
                    key={st.id}
                    className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                  >
                    <td className="px-5 py-4">
                      <Link
                        href={`/instructor/students/${st.slug}`}
                        className="flex items-center gap-3"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-xs font-bold text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                          {st.initials}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-[#2563EB] transition-colors flex items-center gap-1.5">
                            <span>{st.name}</span>
                            <Eye className="h-3 w-3 text-slate-400 group-hover:text-[#2563EB] opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="text-[11px] text-slate-400">{st.email}</div>
                        </div>
                      </Link>
                    </td>

                    <td className="px-5 py-4 font-medium text-slate-800">
                      <Link href={`/instructor/students/${st.slug}`} className="block">
                        {st.courseTitle}
                      </Link>
                    </td>

                    <td className="px-5 py-4 min-w-[150px]">
                      <Link href={`/instructor/students/${st.slug}`} className="block space-y-1">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span>{st.progressPercent}%</span>
                          <span className="text-slate-400 font-normal">
                            {st.completedVideos}/{st.totalVideos} videos
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
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
                              ? "bg-emerald-50 text-emerald-700"
                              : st.assignmentAvg >= 65
                              ? "bg-blue-50 text-blue-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {st.assignmentAvg}%
                        </span>
                      </Link>
                    </td>

                    <td className="px-5 py-4 text-slate-500 font-medium">{st.lastActive}</td>

                    <td className="px-5 py-4">
                      <Link href={`/instructor/students/${st.slug}`} className="inline-block">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            st.status === "Completed"
                              ? "bg-emerald-50 text-emerald-700"
                              : st.status === "Needs Attention"
                              ? "bg-rose-50 text-rose-700"
                              : "bg-blue-50 text-blue-700"
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
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB] transition-all shadow-xs"
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
