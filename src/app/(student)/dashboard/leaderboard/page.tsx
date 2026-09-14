"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Trophy,
  Flame,
  Crown,
  Sparkles,
  Search,
  CheckCircle2,
  Zap,
  Star,
  ShieldCheck,
  Calendar,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Target,
  User,
} from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Reveal } from "@/lib/motion/reveal";
import { useMockSession } from "@/lib/auth/use-mock-auth";
import { useUser } from "@clerk/nextjs";
import { fetchLeaderboardData, type LeaderboardItem, type LeaderboardResponse } from "@/lib/data/students-api";
import { getClientSessionEmail } from "@/lib/data/enrollments-api";
import { LeaderboardWaveAnimation } from "@/components/dashboard/leaderboard-wave";
import { CelebrationAnimation } from "@/components/dashboard/celebration-animation";

export default function LeaderboardPage() {
  const session = useMockSession();
  const { user: clerkUser } = useUser();
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTrack, setSelectedTrack] = useState<string>("All Students");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("week");
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);

  const rankingsTableRef = useRef<HTMLDivElement | null>(null);

  const clerkEmail =
    clerkUser?.primaryEmailAddress?.emailAddress || clerkUser?.emailAddresses?.[0]?.emailAddress;
  const currentEmail = (clerkEmail || session?.email || getClientSessionEmail() || "").toLowerCase().trim();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetchLeaderboardData();
      setData(res);
    } catch (err) {
      console.warn("Failed to load leaderboard:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const rawList = useMemo(() => {
    if (!data?.leaderboard) return [];
    return [...data.leaderboard].sort((a, b) => b.points - a.points);
  }, [data]);

  // Top performer (Rank 1 overall)
  const topPerformer = useMemo(() => {
    if (!rawList || rawList.length === 0) return null;
    return rawList[0];
  }, [rawList]);

  // Fixed track tabs matching design: All Students, Full Stack, Java, Frontend, SAP
  const trackTabs = ["All Students", "Full Stack", "Java", "Frontend", "SAP"];

  // Filtered list
  const filteredList = useMemo(() => {
    let list = rawList;
    if (selectedTrack !== "All Students") {
      const t = selectedTrack.toLowerCase();
      list = list.filter((item) => {
        const itemTrack = item.track.toLowerCase();
        if (t === "java") return itemTrack.includes("java");
        if (t === "frontend") return itemTrack.includes("frontend");
        if (t === "sap") return itemTrack.includes("sap");
        if (t === "full stack") return itemTrack.includes("full stack");
        return itemTrack.includes(t);
      });
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
  const firstPlace = filteredList[0];
  const secondPlace = filteredList[1];
  const thirdPlace = filteredList[2];

  const scrollToRankings = () => {
    rankingsTableRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <DashboardTopbar userInitials={session?.initials || "ST"}>
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses, topics, or anything..."
            className="w-full rounded-full border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 pl-9 pr-4 py-2 text-xs text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500 shadow-xs"
          />
        </div>
      </DashboardTopbar>

      <div className="flex-1 space-y-6 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4 max-w-7xl mx-auto w-full">
        {/* PAGE HEADER WITH TIME DROPDOWN */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#2563EB] dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 shadow-xs">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Leaderboard
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Global student rankings, daily activity streaks, and mastery scores.
              </p>
            </div>
          </div>

          {/* This Week Dropdown */}
          <div className="relative self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setIsTimeDropdownOpen((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-elevated px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer"
            >
              <Calendar className="h-3.5 w-3.5 text-slate-500" />
              <span>
                {timeRange === "week"
                  ? "This Week"
                  : timeRange === "month"
                  ? "This Month"
                  : "All Time"}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {isTimeDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-36 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-elevated py-1 shadow-lg z-30">
                <button
                  type="button"
                  onClick={() => {
                    setTimeRange("week");
                    setIsTimeDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-semibold ${
                    timeRange === "week"
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/30"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  }`}
                >
                  This Week
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTimeRange("month");
                    setIsTimeDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-semibold ${
                    timeRange === "month"
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/30"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  }`}
                >
                  This Month
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTimeRange("all");
                    setIsTimeDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-semibold ${
                    timeRange === "all"
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/30"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  }`}
                >
                  All Time
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 1. TOP PERFORMER HERO SPOTLIGHT BANNER WITH DYNAMIC WAVE ANIMATION */}
        {topPerformer && (
          <Reveal variant="fade-up">
            <div className="relative overflow-hidden rounded-[26px] border border-blue-400/30 bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#7C3AED] p-6 sm:p-8 text-white shadow-[0_16px_48px_rgba(37,99,235,0.28)]">
              {/* Dynamic Animated Canvas Wave Mesh */}
              <LeaderboardWaveAnimation />

              {/* Ambient radial lighting overlays */}
              <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-violet-400/20 blur-3xl pointer-events-none" />
              <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                {/* Left Section: Performer Identity */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 text-amber-300 font-black text-xs uppercase tracking-wider">
                    <Crown className="h-4 w-4 fill-amber-300" />
                    <span>Top Performer</span>
                  </div>

                  <div className="flex items-center gap-4 mt-1">
                    {/* Avatar with crown badge */}
                    <div className="relative shrink-0">
                      <div className="flex h-16 w-16 sm:h-18 sm:w-18 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-black text-xl sm:text-2xl shadow-lg ring-4 ring-white/20 border border-white/40">
                        {topPerformer.initials}
                      </div>
                      <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-amber-950 shadow-md border-2 border-white">
                        <Crown className="h-3.5 w-3.5 fill-amber-950" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
                          {topPerformer.name}
                        </h2>
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/15 backdrop-blur-md px-3 py-0.5 text-[10px] sm:text-xs font-black text-amber-300 border border-amber-300/40 tracking-wider shadow-xs">
                          <Star className="h-3 w-3 fill-amber-300" />
                          {topPerformer.badge || "GRANDMASTER ARCHITECT"}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-blue-100/90 font-medium">
                        Enrolled Track: <span className="font-bold text-white uppercase">{topPerformer.track}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Section: 4 Key Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 border-t lg:border-t-0 lg:border-l border-white/15 pt-5 lg:pt-0 lg:pl-8">
                  {/* Daily Streak */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-xs text-blue-100/80 font-semibold mb-1">
                      <Flame className="h-4 w-4 text-orange-400 fill-orange-400" />
                      <span>Daily Streak</span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl sm:text-3xl font-black text-white">
                        {topPerformer.streakDays}
                      </span>
                      <span className="text-xs text-blue-200 font-medium">Days</span>
                    </div>
                  </div>

                  {/* Total XP */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-xs text-blue-100/80 font-semibold mb-1">
                      <Zap className="h-4 w-4 text-amber-300 fill-amber-300" />
                      <span>Total XP</span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl sm:text-3xl font-black text-white">
                        {topPerformer.points.toLocaleString()}
                      </span>
                      <span className="text-xs text-blue-200 font-medium">pts</span>
                    </div>
                  </div>

                  {/* Solved */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-xs text-blue-100/80 font-semibold mb-1">
                      <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                      <span>Solved</span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl sm:text-3xl font-black text-white">
                        {topPerformer.solvedAssignments}
                      </span>
                      <span className="text-xs text-blue-200 font-medium">Tasks</span>
                    </div>
                  </div>

                  {/* Accuracy */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-xs text-blue-100/80 font-semibold mb-1">
                      <Target className="h-4 w-4 text-rose-300" />
                      <span>Accuracy</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-black text-white">
                        {topPerformer.accuracy}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        )}

        {/* 2. HALL OF EXCELLENCE PODIUM CARD */}
        <Reveal variant="fade-up">
          <div className="relative overflow-hidden rounded-[26px] border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-3.5 sm:p-8 shadow-xs">
            {/* Celebratory moving confetti & ribbon particles animation */}
            <CelebrationAnimation />

            {/* Header */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 border border-amber-200/50 dark:border-amber-800/40 shadow-xs">
                  <Trophy className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white">
                    Hall of Excellence
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Leading by continuous daily streak, curriculum mastery, and code assessment performance.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={scrollToRankings}
                className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 dark:border-blue-900/60 bg-blue-50/80 dark:bg-blue-950/40 px-3.5 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-100/80 dark:hover:bg-blue-900/60 transition-all cursor-pointer self-start sm:self-auto shadow-xs"
              >
                <span>View Full Rankings</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* 3D Championship Podium Layout */}
            <div className="relative z-10 pt-3 sm:pt-6 pb-2">
              <div className="flex items-end justify-center gap-1.5 sm:gap-5 md:gap-7 max-w-xl mx-auto">
                {/* 2nd Place: Left (Silver) */}
                {secondPlace ? (
                  <div className="flex flex-col items-center flex-1 min-w-0 max-w-[170px] sm:max-w-[190px]">
                    {/* Student Identity Block */}
                    <div className="relative mb-2 sm:mb-3 flex flex-col items-center min-h-[102px] sm:min-h-[128px] justify-end w-full px-1">
                      <div className="relative">
                        <div className="flex h-11 w-11 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-tr from-slate-400 via-slate-300 to-slate-100 text-slate-800 font-black text-xs sm:text-base shadow-lg ring-2 sm:ring-4 ring-slate-300/90 dark:ring-slate-600 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 border border-white">
                          {secondPlace.initials}
                        </div>
                        <div className="absolute -bottom-1 -right-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-gradient-to-b from-slate-100 to-slate-300 text-slate-800 text-[9px] sm:text-[11px] font-black border-2 border-white shadow-xs">
                          2
                        </div>
                      </div>

                      <div className="text-center mt-1.5 sm:mt-2.5 w-full">
                        <div className="font-bold text-[11px] sm:text-sm text-slate-900 dark:text-white truncate max-w-[85px] sm:max-w-[150px] mx-auto">
                          {secondPlace.name}
                        </div>
                        <div className="mt-0.5 sm:mt-1">
                          <span className="inline-block rounded-full bg-blue-50 dark:bg-blue-950/50 px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[10px] font-bold text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/40 uppercase">
                            {secondPlace.track}
                          </span>
                        </div>
                        <div className="mt-0.5 sm:mt-1 flex items-center justify-center gap-0.5 sm:gap-1 text-[9px] sm:text-xs font-semibold text-amber-600 dark:text-amber-400">
                          <Flame className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-amber-500 text-amber-500" />
                          <span>{secondPlace.streakDays}d Streak</span>
                        </div>
                      </div>
                    </div>

                    {/* Silver Podium Pillar */}
                    <div className="w-full h-24 sm:h-36 rounded-t-2xl sm:rounded-t-3xl bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 dark:from-slate-600 dark:via-slate-700 dark:to-slate-800 shadow-[0_8px_20px_rgba(0,0,0,0.12)] flex flex-col items-center justify-center p-2 sm:p-3 text-center border-t-2 border-white/80 dark:border-slate-400/50 relative overflow-hidden">
                      <div className="absolute inset-x-0 top-0 h-1 bg-white/40" />
                      <span className="text-base sm:text-2xl font-black text-slate-700 dark:text-slate-100 tracking-tight drop-shadow-2xs">
                        2nd
                      </span>
                      <div className="mt-1 sm:mt-1.5 rounded-full bg-slate-900/10 dark:bg-black/20 px-2 sm:px-2.5 py-0.5 border border-white/40">
                        <span className="text-[9px] sm:text-xs font-extrabold text-slate-800 dark:text-slate-200 font-mono">
                          {secondPlace.points.toLocaleString()} pts
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 max-w-[170px]" />
                )}

                {/* 1st Place: Center (Gold, Champion Tier) */}
                {firstPlace && (
                  <div className="flex flex-col items-center flex-1 min-w-0 max-w-[190px] sm:max-w-[220px] -mt-3 sm:-mt-6">
                    {/* Student Identity Block */}
                    <div className="relative mb-2 sm:mb-3 flex flex-col items-center min-h-[114px] sm:min-h-[142px] justify-end w-full px-1">
                      <Crown className="h-4 w-4 sm:h-6 sm:w-6 text-amber-400 fill-amber-400 mb-0.5 sm:mb-1 animate-bounce" />

                      <div className="relative inline-flex items-center justify-center">
                        <div className="flex h-13 w-13 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-amber-950 font-black text-sm sm:text-2xl shadow-xl ring-2 sm:ring-4 ring-amber-400 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 border-2 border-white">
                          {firstPlace.initials}
                        </div>

                        <div className="absolute -bottom-1 -right-1 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-gradient-to-b from-amber-300 to-amber-500 text-amber-950 text-[10px] sm:text-xs font-black border-2 border-white shadow-md">
                          1
                        </div>
                      </div>

                      <div className="text-center mt-1.5 sm:mt-2.5 w-full">
                        <div className="font-black text-xs sm:text-base text-slate-900 dark:text-white truncate max-w-[90px] sm:max-w-[170px] mx-auto">
                          {firstPlace.name}
                        </div>
                        <div className="mt-0.5 sm:mt-1">
                          <span className="inline-block rounded-full bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 text-[8px] sm:text-[10px] font-black text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/40 uppercase">
                            {firstPlace.track}
                          </span>
                        </div>
                        <div className="mt-0.5 sm:mt-1 flex items-center justify-center gap-0.5 sm:gap-1 text-[9px] sm:text-xs font-bold text-amber-600 dark:text-amber-400">
                          <Flame className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-amber-500 text-amber-500" />
                          <span>{firstPlace.streakDays} Day Streak</span>
                        </div>
                      </div>
                    </div>

                    {/* Gold Podium Pillar */}
                    <div className="w-full h-34 sm:h-50 rounded-t-2xl sm:rounded-t-3xl bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 shadow-[0_12px_30px_rgba(245,158,11,0.25)] flex flex-col items-center justify-center p-2.5 sm:p-4 text-center border-t-2 border-yellow-100 relative overflow-hidden">
                      <div className="absolute inset-x-0 top-0 h-1 bg-white/60" />
                      <div className="flex items-center gap-1 text-amber-950">
                        <span className="text-xl sm:text-3xl font-black tracking-tight drop-shadow-xs">1st</span>
                      </div>
                      <div className="mt-1 sm:mt-1.5 rounded-full bg-amber-950/15 backdrop-blur-xs px-2.5 sm:px-3 py-0.5 border border-amber-950/20">
                        <span className="text-[10px] sm:text-sm font-black text-amber-950 dark:text-amber-950 font-mono">
                          {firstPlace.points.toLocaleString()} pts
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3rd Place: Right (Bronze) */}
                {thirdPlace ? (
                  <div className="flex flex-col items-center flex-1 min-w-0 max-w-[170px] sm:max-w-[190px]">
                    {/* Student Identity Block */}
                    <div className="relative mb-2 sm:mb-3 flex flex-col items-center min-h-[102px] sm:min-h-[128px] justify-end w-full px-1">
                      <div className="relative">
                        <div className="flex h-11 w-11 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-tr from-amber-700 via-orange-500 to-amber-300 text-white font-black text-xs sm:text-base shadow-lg ring-2 sm:ring-4 ring-orange-400/90 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 border border-white">
                          {thirdPlace.initials}
                        </div>
                        <div className="absolute -bottom-1 -right-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-gradient-to-b from-orange-300 to-orange-500 text-amber-950 text-[9px] sm:text-[11px] font-black border-2 border-white shadow-xs">
                          3
                        </div>
                      </div>

                      <div className="text-center mt-1.5 sm:mt-2.5 w-full">
                        <div className="font-bold text-[11px] sm:text-sm text-slate-900 dark:text-white truncate max-w-[85px] sm:max-w-[150px] mx-auto">
                          {thirdPlace.name}
                        </div>
                        <div className="mt-0.5 sm:mt-1">
                          <span className="inline-block rounded-full bg-blue-50 dark:bg-blue-950/50 px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[10px] font-bold text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/40 uppercase">
                            {thirdPlace.track}
                          </span>
                        </div>
                        <div className="mt-0.5 sm:mt-1 flex items-center justify-center gap-0.5 sm:gap-1 text-[9px] sm:text-xs font-semibold text-amber-600 dark:text-amber-400">
                          <Flame className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-amber-500 text-amber-500" />
                          <span>{thirdPlace.streakDays}d Streak</span>
                        </div>
                      </div>
                    </div>

                    {/* Bronze Podium Pillar */}
                    <div className="w-full h-20 sm:h-30 rounded-t-2xl sm:rounded-t-3xl bg-gradient-to-b from-orange-300 via-amber-500 to-amber-700 dark:from-amber-700 dark:via-orange-800 dark:to-amber-900 shadow-[0_8px_20px_rgba(0,0,0,0.12)] flex flex-col items-center justify-center p-2 sm:p-3 text-center border-t-2 border-white/60 dark:border-amber-400/40 relative overflow-hidden">
                      <div className="absolute inset-x-0 top-0 h-1 bg-white/40" />
                      <span className="text-base sm:text-2xl font-black text-amber-950 dark:text-amber-100 tracking-tight drop-shadow-2xs">
                        3rd
                      </span>
                      <div className="mt-1 sm:mt-1.5 rounded-full bg-amber-950/15 dark:bg-black/20 px-2 sm:px-2.5 py-0.5 border border-white/30">
                        <span className="text-[9px] sm:text-xs font-extrabold text-amber-950 dark:text-amber-200 font-mono">
                          {thirdPlace.points.toLocaleString()} pts
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 max-w-[170px]" />
                )}
              </div>

              {/* Connected Championship Pedestal Stage Ground Bar */}
              <div className="h-2.5 sm:h-3 w-full max-w-xl mx-auto rounded-b-xl bg-gradient-to-r from-slate-300 via-slate-200 to-slate-300 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 shadow-sm border-t border-white/40" />
            </div>
          </div>
        </Reveal>

        {/* 3. TRACK FILTER TABS & SEARCH BAR */}
        <div ref={rankingsTableRef} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2">
          {/* Track Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {trackTabs.map((tab) => {
              const isActive = selectedTrack === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSelectedTrack(tab)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search students..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-elevated pl-9 pr-3.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-xs"
            />
          </div>
        </div>

        {/* 4. REAL STUDENT RANKINGS TABLE */}
        <Reveal variant="fade-up">
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-surface-elevated shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-900/30">
                    <th className="py-3.5 px-4 w-12 text-center">#</th>
                    <th className="py-3.5 px-4">Student</th>
                    <th className="py-3.5 px-4">Track</th>
                    <th className="py-3.5 px-4">Streak</th>
                    <th className="py-3.5 px-4">Total XP</th>
                    <th className="py-3.5 px-4">Solved</th>
                    <th className="py-3.5 px-4">Accuracy</th>
                    <th className="py-3.5 px-4 w-10 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400 font-medium">
                        Loading student rankings...
                      </td>
                    </tr>
                  ) : filteredList.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400 font-medium">
                        No students found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredList.map((student) => {
                      const isMe = currentEmail && student.email.toLowerCase() === currentEmail;

                      let rankBadge = (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs mx-auto">
                          {student.displayRank}
                        </span>
                      );

                      if (student.displayRank === 1) {
                        rankBadge = (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-amber-950 font-black text-xs shadow-xs mx-auto">
                            1
                          </span>
                        );
                      } else if (student.displayRank === 2) {
                        rankBadge = (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-300 dark:bg-slate-600 text-slate-800 dark:text-white font-black text-xs shadow-xs mx-auto">
                            2
                          </span>
                        );
                      } else if (student.displayRank === 3) {
                        rankBadge = (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-400 text-amber-950 font-black text-xs shadow-xs mx-auto">
                            3
                          </span>
                        );
                      }

                      return (
                        <tr
                          key={student.id}
                          className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                            isMe ? "bg-blue-50/30 dark:bg-blue-950/20" : ""
                          }`}
                        >
                          {/* Rank */}
                          <td className="py-3.5 px-4 text-center">{rankBadge}</td>

                          {/* Student */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-xs">
                                {student.initials}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                                  <span>{student.name}</span>
                                  {isMe && (
                                    <span className="rounded-md bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 px-1.5 py-0.2 text-[10px] font-black">
                                      You
                                    </span>
                                  )}
                                  {student.isRealUser && (
                                    <span title="Verified Active Student">
                                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 inline" />
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Track */}
                          <td className="py-3.5 px-4">
                            <span className="text-blue-600 dark:text-blue-400 font-semibold">
                              {student.track}
                            </span>
                          </td>

                          {/* Streak */}
                          <td className="py-3.5 px-4">
                            <div className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                              <Flame className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                              <span>{student.streakDays}</span>
                            </div>
                          </td>

                          {/* Total XP */}
                          <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-100 font-mono">
                            {student.points.toLocaleString()}
                          </td>

                          {/* Solved Tasks */}
                          <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-semibold font-mono">
                            {student.solvedAssignments}
                          </td>

                          {/* Accuracy */}
                          <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-semibold font-mono">
                            {student.accuracy}%
                          </td>

                          {/* Chevron Action */}
                          <td className="py-3.5 px-4 text-right">
                            <ChevronRight className="h-4 w-4 text-slate-400 hover:text-blue-600 transition-colors inline" />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </div>
    </>
  );
}
