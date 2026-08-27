"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  IndianRupee,
  BookOpen,
  BrainCircuit,
  ChevronDown,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { Reveal } from "@/lib/motion/reveal";
import { TiltCard } from "@/components/interactions/tilt-card";

const KPI_CARDS = [
  {
    icon: Users,
    value: "8,140",
    label: "Total Students",
    growth: "+124 this week",
    growthType: "positive",
  },
  {
    icon: IndianRupee,
    value: "₹12.4L",
    label: "Revenue (MTD)",
    growth: "+8.2% vs last month",
    growthType: "positive",
  },
  {
    icon: BookOpen,
    value: "8",
    label: "Active Courses",
    growth: "3 tracks",
    growthType: "positive",
  },
  {
    icon: BrainCircuit,
    value: "1,920",
    label: "AI Interviews (MTD)",
    growth: "avg score 74",
    growthType: "positive",
  },
];

const RECENT_ENROLLMENTS = [
  {
    student: "Priya Nair",
    course: "SAP MM Functional Consultant",
    status: "Success",
    date: "2026-08-21",
  },
  {
    student: "Arjun Mehta",
    course: "Java Full Stack Developer",
    status: "Success",
    date: "2026-08-21",
  },
  {
    student: "Rahul Verma",
    course: "Modern Frontend (React)",
    status: "Pending",
    date: "2026-08-20",
  },
  {
    student: "Sneha Kulkarni",
    course: ".NET Full Stack Developer",
    status: "Failed",
    date: "2026-08-20",
  },
];

export default function AdminDashboardPage() {
  const [selectedRange, setSelectedRange] = useState("This Month");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <>
      {/* Top Header */}
      <DashboardTopbar
        title="Dashboard"
        subtitle="Here's what's happening with your platform today."
        userInitials="AD"
      />

      <div className="flex-1 space-y-6 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4">
        {/* 4 KPI Cards in 2 Columns on Mobile (2 rows) and 4 on Desktop */}
        <Reveal variant="stagger" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {KPI_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <TiltCard key={card.label}>
              <div
                className="group relative flex h-full flex-col justify-between rounded-[20px] border border-white/70 bg-white/75 p-3.5 sm:p-5 lg:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(20,50,100,0.1)]"
              >
                {/* Subtle soft 3D top-right accent */}
                <div className="flex items-start justify-between">
                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 lg:h-11 lg:w-11 items-center justify-center rounded-xl sm:rounded-full bg-[#EFF6FF] text-[#2563EB] shadow-xs transition-transform duration-300 group-hover:scale-105">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.2]" />
                  </div>
                </div>

                <div className="mt-2.5 sm:mt-4">
                  <div className="text-lg sm:text-2xl lg:text-[28px] font-extrabold tracking-tight text-slate-900 leading-tight">
                    {card.value}
                  </div>
                  <div className="mt-0.5 text-[11px] sm:text-xs font-medium text-slate-500 line-clamp-1">
                    {card.label}
                  </div>
                </div>

                <div className="mt-2 sm:mt-3 text-[10px] sm:text-xs font-semibold text-[#16A34A] truncate">
                  {card.growth}
                </div>
              </div>
              </TiltCard>
            );
          })}
        </Reveal>

        {/* Main Content: Two Columns (Revenue Overview & Recent Enrollments) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* LEFT: Revenue Overview Card */}
          <div className="flex flex-col justify-between rounded-[20px] border border-white/70 bg-white/80 p-4 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl lg:col-span-6 xl:col-span-6">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold tracking-tight text-slate-900">
                  Revenue Overview
                </h2>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-2xs hover:bg-slate-50 transition-colors"
                  >
                    <span>{selectedRange}</span>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 z-30 mt-1 w-32 rounded-xl border border-slate-100 bg-white py-1 shadow-lg">
                      {["This Month", "Last Month", "This Quarter", "This Year"].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setSelectedRange(opt);
                            setIsDropdownOpen(false);
                          }}
                          className="w-full px-3 py-1.5 text-left text-xs font-medium text-slate-600 hover:bg-[#EFF6FF] hover:text-[#2563EB]"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Metric & Trend */}
              <div className="mt-3 flex items-baseline gap-2.5">
                <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                  ₹12.4L
                </span>
                <span className="text-xs font-bold text-[#16A34A]">
                  +8.2% <span className="font-normal text-slate-500">vs last month</span>
                </span>
              </div>
            </div>

            {/* Responsive Chart */}
            <div className="mt-5 w-full overflow-hidden">
              <RevenueChart />
            </div>
          </div>

          {/* RIGHT: Recent Enrollments Card */}
          <div className="flex flex-col justify-between rounded-[20px] border border-white/70 bg-white/80 p-4 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl lg:col-span-6 xl:col-span-6">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold tracking-tight text-slate-900">
                  Recent Enrollments
                </h2>
                <Link
                  href="/admin/students"
                  className="group flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:underline"
                >
                  <span>View all</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              {/* Table */}
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[450px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                      <th className="pb-3 pr-4 pl-0">Student</th>
                      <th className="px-4 pb-3">Course</th>
                      <th className="px-4 pb-3 text-center">Status</th>
                      <th className="pr-0 pb-3 pl-4 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {RECENT_ENROLLMENTS.map((row) => {
                      const isSuccess = row.status === "Success";
                      const isPending = row.status === "Pending";

                      return (
                        <tr
                          key={`${row.student}-${row.course}`}
                          className="transition-colors hover:bg-slate-50/60"
                        >
                          <td className="py-3.5 pr-4 pl-0 font-bold text-slate-900 whitespace-nowrap">
                            {row.student}
                          </td>
                          <td className="px-4 py-3.5 font-medium text-slate-600 whitespace-nowrap">
                            {row.course}
                          </td>
                          <td className="px-4 py-3.5 text-center whitespace-nowrap">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                                isSuccess
                                  ? "bg-[#DCFCE7] text-[#15803D]"
                                  : isPending
                                    ? "bg-[#FEF3C7] text-[#B45309]"
                                    : "bg-[#FEE2E2] text-[#DC2626]"
                              }`}
                            >
                              {row.status}
                            </span>
                          </td>
                          <td className="pr-0 py-3.5 pl-4 text-right font-medium text-slate-500 whitespace-nowrap">
                            {row.date}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick 3D Insight banner at bottom of card */}
            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 rounded-xl bg-gradient-to-r from-[#EFF6FF] via-[#F8FAFC] to-[#EFF6FF] p-3.5 text-xs text-slate-600 border border-blue-50/80">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-white shadow-xs">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <span className="font-medium">
                  3 new student applications are awaiting batch allocation
                </span>
              </div>
              <Link
                href="/admin/students"
                className="font-bold text-[#2563EB] hover:underline self-end sm:self-auto"
              >
                Review →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
