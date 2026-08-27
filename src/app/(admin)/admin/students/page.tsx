"use client";

import React, { useState } from "react";
import { Search, Users, UserCheck, ShieldAlert, Download, Mail, MoreHorizontal } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { ADMIN_STUDENTS } from "@/lib/data/admin";
import { TiltCard } from "@/components/interactions/tilt-card";
import { Reveal } from "@/lib/motion/reveal";

export default function AdminStudentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | "Active" | "Inactive">("All");

  const filtered = ADMIN_STUDENTS.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "All" || s.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <DashboardTopbar
        title="Students"
        subtitle={`${ADMIN_STUDENTS.length} registered students across all enterprise learning tracks.`}
        userInitials="AD"
      />

      <div className="flex-1 space-y-5 p-3 sm:p-6 lg:p-8 lg:pt-4">
        {/* Metric Cards */}
        <Reveal variant="stagger" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <TiltCard>
          <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Registered</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-[#2563EB]">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-extrabold text-slate-900">8,140</div>
            <div className="mt-1 text-xs text-emerald-600 font-semibold">+124 this week</div>
          </div>
          </TiltCard>

          <TiltCard>
          <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Active Learners</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <UserCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-extrabold text-slate-900">7,890</div>
            <div className="mt-1 text-xs text-emerald-600 font-semibold">96.9% retention rate</div>
          </div>
          </TiltCard>

          <TiltCard>
          <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Stage Progressions</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                <ShieldAlert className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-extrabold text-slate-900">22,410</div>
            <div className="mt-1 text-xs text-slate-500 font-medium">Video & assignment milestones</div>
          </div>
          </TiltCard>
        </Reveal>

        {/* Controls Bar */}
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
            <div className="relative w-full sm:w-auto sm:min-w-[260px]">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by student name or email…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pr-3 pl-9 text-xs font-medium text-slate-800 outline-none shadow-xs transition-colors focus:border-[#2563EB]"
              />
            </div>

            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1 shadow-xs overflow-x-auto">
              {(["All", "Active", "Inactive"] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setFilterStatus(st)}
                  className={`rounded-lg px-3 py-1 text-xs font-bold transition-colors whitespace-nowrap ${
                    filterStatus === st
                      ? "bg-[#2563EB] text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors self-end sm:self-auto cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Roster CSV</span>
          </button>
        </div>

        {/* Students Table */}
        <div className="rounded-[20px] border border-white/70 bg-white/80 p-4 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                  <th className="pb-3 pr-4 pl-0">Student</th>
                  <th className="px-4 pb-3">Enrolled Courses</th>
                  <th className="px-4 pb-3">AI Interviews</th>
                  <th className="px-4 pb-3 text-center">Status</th>
                  <th className="px-4 pb-3">Joined Date</th>
                  <th className="pr-0 pb-3 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((s) => (
                  <tr key={s.email} className="transition-colors hover:bg-slate-50/60">
                    <td className="py-4 pr-4 pl-0 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-xs font-bold text-[#2563EB]">
                          {s.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{s.name}</div>
                          <div className="text-[11px] font-medium text-slate-400">{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-700 whitespace-nowrap">
                      {s.enrolledCourses} {s.enrolledCourses === 1 ? "course" : "courses"}
                    </td>
                    <td className="px-4 py-4 font-semibold text-[#2563EB] whitespace-nowrap">
                      {s.aiInterviews} sessions
                    </td>
                    <td className="px-4 py-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          s.status === "Active"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-500 whitespace-nowrap">
                      {s.joinedDate}
                    </td>
                    <td className="pr-0 py-4 pl-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                          title="Message Student"
                        >
                          <Mail className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                        >
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </button>
                      </div>
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
