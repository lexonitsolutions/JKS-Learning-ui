"use client";

import React from "react";
import { BarChart3, Users, IndianRupee, Award } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { TiltCard } from "@/components/interactions/tilt-card";
import { Reveal } from "@/lib/motion/reveal";

export default function AdminAnalyticsPage() {
  const tracks = [
    { name: "Full Stack", revenue: 850000, students: 3520, percent: 55 },
    { name: "Frontend", revenue: 480000, students: 3020, percent: 30 },
    { name: "SAP Enterprise", revenue: 390000, students: 1500, percent: 25 },
  ];

  return (
    <>
      <DashboardTopbar
        title="Analytics"
        subtitle="Deep dive into enterprise enrollment growth, revenue by track, and completion metrics."
        userInitials="AD"
      />

      <div className="flex-1 space-y-6 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4">
        {/* Metric Cards in 2 Columns on Mobile (2 rows) */}
        <Reveal variant="stagger" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <TiltCard>
          <div className="rounded-[20px] border border-white/70 bg-white/75 p-3.5 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-semibold text-slate-500 line-clamp-1">Gross Revenue</span>
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg sm:rounded-full bg-blue-50 text-[#2563EB]">
                <IndianRupee className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
            </div>
            <div className="mt-2 text-lg sm:text-2xl font-extrabold text-slate-900 leading-tight">₹1.24 Cr</div>
            <div className="mt-1 text-[10px] sm:text-xs text-emerald-600 font-semibold truncate">+14.2% YoY growth</div>
          </div>
          </TiltCard>

          <TiltCard>
          <div className="rounded-[20px] border border-white/70 bg-white/75 p-3.5 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-semibold text-slate-500 line-clamp-1">Completion Rate</span>
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg sm:rounded-full bg-emerald-50 text-emerald-600">
                <Award className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
            </div>
            <div className="mt-2 text-lg sm:text-2xl font-extrabold text-slate-900 leading-tight">89.4%</div>
            <div className="mt-1 text-[10px] sm:text-xs text-emerald-600 font-semibold truncate">Anti-skip enforced</div>
          </div>
          </TiltCard>

          <TiltCard>
          <div className="rounded-[20px] border border-white/70 bg-white/75 p-3.5 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-semibold text-slate-500 line-clamp-1">Active Students</span>
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
            </div>
            <div className="mt-2 text-lg sm:text-2xl font-extrabold text-slate-900 leading-tight">8,140</div>
            <div className="mt-1 text-[10px] sm:text-xs text-purple-600 font-semibold truncate">High engagement</div>
          </div>
          </TiltCard>

          <TiltCard>
          <div className="rounded-[20px] border border-white/70 bg-white/75 p-3.5 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-semibold text-slate-500 line-clamp-1">AI Interviews</span>
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                <BarChart3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
            </div>
            <div className="mt-2 text-lg sm:text-2xl font-extrabold text-slate-900 leading-tight">22,000+</div>
            <div className="mt-1 text-[10px] sm:text-xs text-amber-600 font-semibold truncate">Sessions done</div>
          </div>
          </TiltCard>
        </Reveal>

        {/* 2-Column Analytics Breakdown */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Revenue Curve */}
          <div className="rounded-[20px] border border-white/70 bg-white/80 p-4 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl lg:col-span-7">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Monthly Revenue Velocity</h3>
                <p className="text-xs text-slate-500 font-medium">30-day continuous revenue stream</p>
              </div>
              <div className="text-sm font-extrabold text-[#2563EB]">₹12.4L MTD</div>
            </div>
            <div className="mt-6 overflow-hidden">
              <RevenueChart />
            </div>
          </div>

          {/* Revenue by Track & Popularity */}
          <div className="flex flex-col justify-between rounded-[20px] border border-white/70 bg-white/80 p-4 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl lg:col-span-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">Revenue & Demand by Track</h3>
              <p className="text-xs text-slate-500 font-medium">Distribution across technology verticals</p>

              <div className="mt-6 space-y-4">
                {tracks.map((t) => (
                  <div key={t.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{t.name}</span>
                      <span className="font-semibold text-slate-500">
                        ₹{(t.revenue / 100000).toFixed(1)}L ({t.students} students)
                      </span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#2563EB]"
                        style={{ width: `${t.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-gradient-to-r from-[#EFF6FF] to-blue-50/60 p-4 text-xs text-slate-700 border border-blue-100/80">
              <div className="font-bold text-[#2563EB]">Executive Growth Summary</div>
              <p className="mt-1 leading-relaxed text-slate-600">
                Full Stack track enrollments surged by 28% following the launch of the AI mock interview curriculum.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
