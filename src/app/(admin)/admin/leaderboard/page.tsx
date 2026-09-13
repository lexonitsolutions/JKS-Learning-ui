"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
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
  Zap,
  Star,
  ShieldCheck,
  TrendingUp,
  RefreshCw,
  Clock,
  ArrowUpRight,
  Filter,
  User,
  ExternalLink,
} from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Reveal } from "@/lib/motion/reveal";
import { TiltCard } from "@/components/interactions/tilt-card";
import { useMockSession } from "@/lib/auth/use-mock-auth";
import { fetchLeaderboardData, type LeaderboardItem, type LeaderboardResponse } from "@/lib/data/students-api";

export default function AdminLeaderboardPage() {
  const session = useMockSession();
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "streaks" | "solvers">("all");
  const [selectedTrack, setSelectedTrack] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetchLeaderboardData();
      setData(res);
    } catch (err) {
      console.warn("Failed to load admin leaderboard:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const rawList = useMemo(() => {
    if (!data) return [];
    if (activeTab === "streaks") {
      return [...data.leaderboard].sort((a, b) => b.streakDays - a.streakDays);
    }
    if (activeTab === "solvers") {
      return [...data.leaderboard].sort((a, b) => b.solvedAssignments - a.solvedAssignments);
    }
    return [...data.leaderboard].sort((a, b) => b.points - a.points);
  }, [data, activeTab]);

  // Filtered list
  const filteredList = useMemo(() => {
    let list = rawList;
    if (selectedTrack !== "All") {
      list = list.filter((item) => item.track.toLowerCase().includes(selectedTrack.toLowerCase()));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.email.toLowerCase().includes(q) ||
          item.track.toLowerCase().includes(q)
      );
    }
    return list.map((item, idx) => ({ ...item, displayRank: idx + 1 }));
  }, [rawList, selectedTrack, searchQuery]);

  // Top 3 Podium
  const topThree = useMemo(() => {
    return filteredList.slice(0, 3);
  }, [filteredList]);

  const firstPlace = topThree[0];
  const secondPlace = topThree[1];
  const thirdPlace = topThree[2];

  return (
    <>
      <DashboardTopbar
        title="Student Leaderboard & Streaks"
        subtitle="Live platform student rankings, activity streaks, and mastery XP metrics."
        userInitials="AD"
      />

      <div className="flex-1 space-y-6 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4">
        {/* TOP ADMIN METRIC STRIP */}
        <Reveal variant="fade-up" className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="rounded-[20px] border border-white/70 dark:border-slate-800/80 bg-white/80 dark:bg-surface-secondary/90 p-5 shadow-[0_4px_20px_rgb(20,50,100,0.04)] dark:shadow-none backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Ranked Students</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/50 text-[#2563EB] dark:text-blue-400">
                <Trophy className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
              {data?.metrics.totalActiveLearners || filteredList.length}
            </div>
            <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Active cohort learners</div>
          </div>

          <div className="rounded-[20px] border border-white/70 dark:border-slate-800/80 bg-white/80 dark:bg-surface-secondary/90 p-5 shadow-[0_4px_20px_rgb(20,50,100,0.04)] dark:shadow-none backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Completed Lessons</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                <Flame className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-amber-600 dark:text-amber-400">
              {data?.metrics.totalCompletedLessons || 0}
            </div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">Video milestones achieved</div>
          </div>

          <div className="rounded-[20px] border border-white/70 dark:border-slate-800/80 bg-white/80 dark:bg-surface-secondary/90 p-5 shadow-[0_4px_20px_rgb(20,50,100,0.04)] dark:shadow-none backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Challenges Solved</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {data?.metrics.totalChallengesSolved || 0}
            </div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">Passed assessments</div>
          </div>

          <div className="rounded-[20px] border border-white/70 dark:border-slate-800/80 bg-white/80 dark:bg-surface-secondary/90 p-5 shadow-[0_4px_20px_rgb(20,50,100,0.04)] dark:shadow-none backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Top Rank Champion</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
                <Crown className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-lg font-black text-slate-900 dark:text-white truncate">
              {firstPlace?.name || "Davood Khan"}
            </div>
            <div className="mt-1 text-xs text-purple-600 dark:text-purple-400 font-semibold">
              {firstPlace?.points.toLocaleString() || "2,975"} XP Points
            </div>
          </div>
        </Reveal>

        {/* 3D PODIUM SECTION */}
        {topThree.length >= 3 && (
          <Reveal variant="fade-up">
            <div className="relative overflow-hidden rounded-[26px] border border-white/80 dark:border-slate-800/80 bg-gradient-to-b from-white via-slate-50/50 to-blue-50/30 dark:from-surface-secondary dark:via-surface-secondary/80 dark:to-surface-elevated p-6 sm:p-8 shadow-[0_8px_30px_rgb(20,50,100,0.06)] dark:shadow-none backdrop-blur-xl">
              <div className="text-center max-w-md mx-auto mb-8">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                  <Trophy className="h-3.5 w-3.5" />
                  <span>Cohort Top Achievers</span>
                </span>
                <h3 className="mt-2 text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Academic Honor Podium
                </h3>
              </div>

              {/* 3D Podium Pillars */}
              <div className="flex flex-col sm:flex-row items-end justify-center gap-4 sm:gap-6 pt-4 max-w-2xl mx-auto">
                {/* 2nd Place */}
                {secondPlace && (
                  <div className="w-full sm:w-1/3 flex flex-col items-center order-2 sm:order-1">
                    <div className="relative mb-2">
                      <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700 text-slate-700 dark:text-slate-200 font-black text-base sm:text-lg shadow-md border-2 border-slate-300 dark:border-slate-600">
                        {secondPlace.initials}
                      </div>
                      <div className="absolute -bottom-2 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-300 dark:bg-slate-600 text-slate-800 dark:text-white text-xs font-black shadow-xs ring-2 ring-white dark:ring-surface-secondary">
                        2
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-extrabold text-sm text-slate-900 dark:text-white truncate max-w-[140px]">
                        {secondPlace.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[140px]">
                        {secondPlace.track}
                      </div>
                      <div className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                        <Flame className="h-3.5 w-3.5" />
                        <span>{secondPlace.streakDays}d Streak</span>
                      </div>
                    </div>

                    <div className="mt-3 w-full h-24 sm:h-28 rounded-t-2xl bg-gradient-to-b from-slate-200 via-slate-100 to-slate-200/50 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 border-t-2 border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center shadow-inner">
                      <span className="text-xl sm:text-2xl font-black text-slate-400 dark:text-slate-500">2nd</span>
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        {secondPlace.points.toLocaleString()} pts
                      </span>
                    </div>
                  </div>
                )}

                {/* 1st Place */}
                {firstPlace && (
                  <div className="w-full sm:w-1/3 flex flex-col items-center order-1 sm:order-2 -translate-y-2 sm:-translate-y-4">
                    <Crown className="h-7 w-7 text-amber-400 fill-amber-400 mb-1 animate-pulse" />
                    <div className="relative mb-2">
                      <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-400 text-slate-950 font-black text-lg sm:text-xl shadow-lg shadow-amber-500/25 border-2 border-amber-300">
                        {firstPlace.initials}
                      </div>
                      <div className="absolute -bottom-2 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 text-xs font-black shadow-md ring-2 ring-white dark:ring-surface-secondary">
                        1
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-black text-base text-slate-900 dark:text-white truncate max-w-[160px]">
                        {firstPlace.name}
                      </div>
                      <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 truncate max-w-[160px]">
                        {firstPlace.track}
                      </div>
                      <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 text-xs font-black text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        <Flame className="h-3.5 w-3.5 fill-amber-500" />
                        <span>{firstPlace.streakDays} Day Streak</span>
                      </div>
                    </div>

                    <div className="mt-3 w-full h-32 sm:h-36 rounded-t-2xl bg-gradient-to-b from-amber-400 via-amber-300 to-yellow-400/80 border-t-2 border-amber-300 flex flex-col items-center justify-center shadow-lg shadow-amber-500/20">
                      <span className="text-2xl sm:text-3xl font-black text-slate-950">1st</span>
                      <span className="text-xs font-black text-slate-900">
                        {firstPlace.points.toLocaleString()} pts
                      </span>
                    </div>
                  </div>
                )}

                {/* 3rd Place */}
                {thirdPlace && (
                  <div className="w-full sm:w-1/3 flex flex-col items-center order-3">
                    <div className="relative mb-2">
                      <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-200 to-amber-100 dark:from-orange-950 dark:to-amber-900 text-orange-900 dark:text-orange-200 font-black text-base sm:text-lg shadow-md border-2 border-orange-300 dark:border-orange-800">
                        {thirdPlace.initials}
                      </div>
                      <div className="absolute -bottom-2 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-orange-400 text-slate-950 text-xs font-black shadow-xs ring-2 ring-white dark:ring-surface-secondary">
                        3
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-extrabold text-sm text-slate-900 dark:text-white truncate max-w-[140px]">
                        {thirdPlace.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[140px]">
                        {thirdPlace.track}
                      </div>
                      <div className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                        <Flame className="h-3.5 w-3.5" />
                        <span>{thirdPlace.streakDays}d Streak</span>
                      </div>
                    </div>

                    <div className="mt-3 w-full h-20 sm:h-24 rounded-t-2xl bg-gradient-to-b from-orange-200/90 via-amber-100 to-orange-200/40 dark:from-amber-950/80 dark:via-orange-950/90 dark:to-slate-900 border-t-2 border-orange-300 dark:border-orange-800 flex flex-col items-center justify-center shadow-inner">
                      <span className="text-xl sm:text-2xl font-black text-orange-800/80 dark:text-orange-400">3rd</span>
                      <span className="text-[11px] font-bold text-orange-900/80 dark:text-orange-300">
                        {thirdPlace.points.toLocaleString()} pts
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        )}

        {/* CONTROLS */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-surface-secondary border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-x-auto">
            {[
              { id: "all", label: "Overall Mastery", icon: Trophy },
              { id: "streaks", label: "Top Streaks", icon: Flame },
              { id: "solvers", label: "Top Solvers", icon: Zap },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-[#2563EB] text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-56">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search student or track..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-input-bg py-2 pl-9 pr-3 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <button
              type="button"
              onClick={loadData}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-elevated text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              title="Refresh Leaderboard"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* FULL LEADERBOARD ROSTER */}
        <div className="overflow-hidden rounded-[22px] border border-white/80 dark:border-slate-800/80 bg-white/90 dark:bg-surface-secondary/90 shadow-[0_8px_30px_rgb(20,50,100,0.06)] dark:shadow-none backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-surface-elevated text-slate-500 dark:text-slate-400 uppercase font-black tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 pl-6 pr-3">Rank</th>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Curriculum Track</th>
                  <th className="py-3.5 px-4">Streak Days</th>
                  <th className="py-3.5 px-4">Lessons & Tasks</th>
                  <th className="py-3.5 px-4">Accuracy</th>
                  <th className="py-3.5 px-4 text-right">Total XP</th>
                  <th className="py-3.5 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-[#2563EB]" />
                      <span>Syncing live leaderboard from MongoDB...</span>
                    </td>
                  </tr>
                ) : filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-slate-400">
                      No students found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredList.map((student) => (
                    <tr
                      key={student.id}
                      className="transition-colors hover:bg-slate-50/80 dark:hover:bg-surface-hover"
                    >
                      <td className="py-4 pl-6 pr-3">
                        <div className="flex items-center gap-2">
                          {student.displayRank === 1 ? (
                            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-400 text-slate-950 font-black text-xs shadow-xs">
                              1
                            </div>
                          ) : student.displayRank === 2 ? (
                            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-300 dark:bg-slate-600 text-slate-900 dark:text-white font-black text-xs">
                              2
                            </div>
                          ) : student.displayRank === 3 ? (
                            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-orange-400 text-slate-950 font-black text-xs">
                              3
                            </div>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-500 font-bold pl-2 text-xs">
                              #{student.displayRank}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-xs">
                            {student.initials}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                              <span>{student.name}</span>
                              {student.isRealUser && (
                                <span title="Verified Active Student">
                                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">{student.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-800/40 px-2 py-0.5 text-[11px] font-bold text-blue-700 dark:text-blue-300">
                          {student.track}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="inline-flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
                          <Flame className="h-4 w-4 fill-amber-500" />
                          <span>{student.streakDays} Days</span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="text-xs text-slate-800 dark:text-slate-200">
                          <b>{student.completedVideos}</b> vids · <b>{student.solvedAssignments}</b> tasks
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                              style={{ width: `${student.accuracy}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            {student.accuracy}%
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <span className="text-sm font-black text-[#2563EB] dark:text-blue-400">
                          {student.points.toLocaleString()}
                        </span>
                        <span className="text-[11px] text-slate-400 ml-1">XP</span>
                      </td>

                      <td className="py-4 pr-6 text-right">
                        {student.isRealUser ? (
                          <Link
                            href={`/admin/students/${student.id}`}
                            className="inline-flex items-center gap-1 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#2563EB] dark:text-blue-400 hover:bg-[#2563EB] hover:text-white px-2.5 py-1 text-[11px] font-bold transition-all"
                          >
                            <span>Inspect</span>
                            <ArrowUpRight className="h-3 w-3" />
                          </Link>
                        ) : (
                          <span className="text-[11px] text-slate-400">Cohort Peer</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
