"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Trophy,
  Flame,
  Crown,
  Medal,
  Award,
  ChevronDown,
  Sparkles,
  Search,
  CheckCircle2,
  Code2,
  BrainCircuit,
} from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Reveal } from "@/lib/motion/reveal";
import { TiltCard } from "@/components/interactions/tilt-card";

interface StreakMaintainer {
  rank: number;
  name: string;
  avatar?: string;
  initials: string;
  streakDays: number;
  color: string;
}

const TOP_STREAK_MAINTAINERS: StreakMaintainer[] = [
  { rank: 1, name: "Satish Jhamwer", initials: "SJ", streakDays: 904, color: "bg-amber-100 text-amber-700" },
  { rank: 2, name: "Peeyush Raj", initials: "PR", streakDays: 621, color: "bg-orange-100 text-orange-700" },
  { rank: 3, name: "Akkal Dhami", initials: "AD", streakDays: 421, color: "bg-amber-50 text-amber-800" },
  { rank: 4, name: "APROSE LALB...", initials: "AL", streakDays: 400, color: "bg-slate-100 text-slate-700" },
  { rank: 5, name: "Ayush Gupta", initials: "AG", streakDays: 390, color: "bg-purple-100 text-purple-700" },
  { rank: 6, name: "Shadan Atmash", initials: "SA", streakDays: 380, color: "bg-blue-100 text-blue-700" },
  { rank: 7, name: "Neha Khan", initials: "NK", streakDays: 312, color: "bg-rose-100 text-rose-700" },
  { rank: 8, name: "Ganesh Kumar...", initials: "GK", streakDays: 303, color: "bg-emerald-100 text-emerald-700" },
  { rank: 9, name: "Lakshmikanth T...", initials: "LT", streakDays: 298, color: "bg-indigo-100 text-indigo-700" },
  { rank: 10, name: "Prabhulal Ragh...", initials: "PR", streakDays: 293, color: "bg-cyan-100 text-cyan-700" },
  { rank: 11, name: "Vikas Verma", initials: "VV", streakDays: 291, color: "bg-teal-100 text-teal-700" },
  { rank: 12, name: "Ahmad Raza", initials: "AR", streakDays: 261, color: "bg-pink-100 text-pink-700" },
];

const TOP_SOLVERS = [
  { rank: 1, name: "Jordan Dsouza", track: "Java Full Stack", solved: 142, points: 2840, badge: "Master Solver" },
  { rank: 2, name: "Priya Sharma", track: "Frontend React", solved: 138, points: 2760, badge: "Speed Demon" },
  { rank: 3, name: "Satish Jhamwer", track: ".NET Core", solved: 129, points: 2580, badge: "Consistent" },
  { rank: 4, name: "Rahul Verma", track: "Java Full Stack", solved: 115, points: 2300, badge: "Rising Star" },
  { rank: 5, name: "Neha Khan", track: "Cloud & DevOps", solved: 108, points: 2160, badge: "Bug Hunter" },
];

export default function LeaderboardPage() {
  const [period, setPeriod] = useState("Today");

  return (
    <>
      <DashboardTopbar
        title="Leaderboard"
        subtitle="See who is leading the way on JKS Learning today."
        userInitials="JD"
      />

      <div className="flex-1 space-y-6 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4">
        {/* Top Header Banner with Podium */}
        <Reveal variant="fade-up">
          <div className="relative overflow-hidden rounded-[24px] border border-white/70 bg-gradient-to-r from-amber-50/60 via-white to-blue-50/40 p-6 sm:p-8 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Left Title */}
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                      Leaderboard
                    </h2>
                    <p className="text-xs sm:text-sm font-medium text-amber-600 flex items-center gap-1.5 mt-0.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>See who&apos;s leading the way on JKS Learning today</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: Top 3 Podium Cards */}
              <div className="flex items-end justify-center gap-3 sm:gap-4 self-center lg:self-auto">
                {/* 2nd Place */}
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 border-2 border-slate-300 font-bold text-xs text-slate-700 shadow-sm">
                    PR
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 mt-1">Peeyush</span>
                  <div className="mt-1 flex h-14 w-16 items-center justify-center rounded-t-xl bg-slate-200/90 text-sm font-black text-slate-600">
                    2
                  </div>
                </div>

                {/* 1st Place (Winner) */}
                <div className="flex flex-col items-center -translate-y-2">
                  <Crown className="h-5 w-5 text-amber-500 fill-amber-400 mb-0.5" />
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 border-2 border-amber-400 font-bold text-sm text-amber-800 shadow-md">
                    SJ
                  </div>
                  <span className="text-xs font-black text-amber-600 mt-1">Satish</span>
                  <div className="mt-1 flex h-20 w-20 items-center justify-center rounded-t-xl bg-gradient-to-t from-amber-400 to-amber-300 text-lg font-black text-white shadow-sm">
                    1
                  </div>
                </div>

                {/* 3rd Place */}
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 border-2 border-amber-600/40 font-bold text-xs text-amber-800 shadow-sm">
                    AD
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 mt-1">Akkal</span>
                  <div className="mt-1 flex h-11 w-16 items-center justify-center rounded-t-xl bg-amber-100 text-sm font-black text-amber-700">
                    3
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* 2 Main Columns: Top Streak Maintainers (Left) & Top Solvers (Right) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* LEFT: Top Streak Maintainers (12 ranked cards) */}
          <div className="lg:col-span-7">
            <Reveal variant="fade-up">
              <div className="rounded-[24px] border border-white/70 bg-white/85 p-5 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Flame className="h-4 w-4 text-orange-500 fill-orange-500" />
                      <span>Top Streak Maintainers</span>
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Consistency is the key to mastery
                    </p>
                  </div>
                </div>

                {/* 12 Streak Cards Grid (4 columns x 3 rows) */}
                <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {TOP_STREAK_MAINTAINERS.map((m) => {
                    const isTop1 = m.rank === 1;
                    const isTop2 = m.rank === 2;
                    const isTop3 = m.rank === 3;

                    return (
                      <div
                        key={m.name}
                        className={`relative flex flex-col items-center justify-between rounded-2xl border p-3.5 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
                          isTop1
                            ? "border-amber-400 bg-amber-50/40 shadow-xs"
                            : isTop2
                              ? "border-orange-300 bg-orange-50/30 shadow-xs"
                              : isTop3
                                ? "border-amber-200 bg-amber-50/20 shadow-xs"
                                : "border-slate-200/70 bg-slate-50/40 hover:bg-white"
                        }`}
                      >
                        {/* Rank Badge */}
                        <div
                          className={`absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black ${
                            isTop1
                              ? "bg-amber-400 text-white"
                              : isTop2
                                ? "bg-orange-400 text-white"
                                : isTop3
                                  ? "bg-amber-600 text-white"
                                  : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {m.rank}
                        </div>

                        {/* Top Crown indicator for rank 1 */}
                        {isTop1 && (
                          <Crown className="absolute -top-2 left-1/2 -translate-x-1/2 h-4 w-4 text-amber-500 fill-amber-400" />
                        )}

                        {/* Avatar */}
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-full font-bold text-xs shadow-xs ${m.color}`}
                        >
                          {m.initials}
                        </div>

                        {/* Name */}
                        <div className="mt-2.5 text-xs font-bold text-slate-900 line-clamp-1">
                          {m.name}
                        </div>

                        {/* Streak Badge */}
                        <div className="mt-2 flex flex-col items-center">
                          <span className="flex items-center gap-1 text-xs font-black text-slate-800">
                            <Flame className="h-3 w-3 text-orange-500 fill-orange-500" />
                            {m.streakDays}
                          </span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                            DAY STREAK
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          </div>

          {/* RIGHT: Today's Top Solvers */}
          <div className="lg:col-span-5">
            <Reveal variant="fade-up">
              <div className="rounded-[24px] border border-white/70 bg-white/85 p-5 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Code2 className="h-4 w-4 text-[#2563EB]" />
                      <span>Today&apos;s Top Solvers</span>
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Questions solved on JKS Learning
                    </p>
                  </div>

                  {/* Period Filter Dropdown */}
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 outline-none cursor-pointer"
                  >
                    <option value="Today">Today</option>
                    <option value="This Week">This Week</option>
                    <option value="All Time">All Time</option>
                  </select>
                </div>

                {/* Solvers Ranked List */}
                <div className="mt-4 space-y-2.5">
                  {TOP_SOLVERS.map((s) => (
                    <div
                      key={s.name}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                            s.rank === 1
                              ? "bg-amber-100 text-amber-700 font-black"
                              : s.rank === 2
                                ? "bg-slate-200 text-slate-700"
                                : s.rank === 3
                                  ? "bg-amber-50 text-amber-800"
                                  : "text-slate-400"
                          }`}
                        >
                          {s.rank}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{s.name}</div>
                          <div className="text-[10px] text-slate-400">{s.track}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-black text-[#2563EB]">{s.solved} Solved</div>
                        <div className="text-[10px] font-semibold text-emerald-600">{s.points} pts</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </>
  );
}
