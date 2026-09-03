"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Layers,
  Video,
  ShoppingBag,
  PlayCircle,
  Clock,
  Award,
  Search,
  Flame,
  User,
  AlertCircle,
  RefreshCw,
  Calendar,
} from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { TiltCard } from "@/components/interactions/tilt-card";
import { Reveal } from "@/lib/motion/reveal";
import { useMockSession } from "@/lib/auth/use-mock-auth";
import { fetchStudentEnrollments, getClientSessionEmail, type EnrolledCourseItem } from "@/lib/data/enrollments-api";

export default function MyCoursesPage() {
  const session = useMockSession();
  const [courses, setCourses] = useState<EnrolledCourseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filterTab, setFilterTab] = useState<"all" | "in-progress" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const loadEnrollments = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    const userEmail = session?.email || getClientSessionEmail();
    try {
      const data = await fetchStudentEnrollments(userEmail);
      const enriched = data.map((c) => {
        let prog = c.progress || 0;
        if (typeof window !== "undefined") {
          try {
            const localKey = `jks_prog_${c.slug}_${userEmail || "student"}`;
            const fallbackKey = `jks_prog_${c.slug}_student`;
            const raw = localStorage.getItem(localKey) || localStorage.getItem(fallbackKey);
            if (raw) {
              const parsed = JSON.parse(raw);
              const count = (parsed.completedVideoIds?.length || 0) + (parsed.completedAssignmentIds?.length || 0);
              if (count > 0) {
                prog = Math.max(prog, Math.min(100, Math.round((count / 9) * 100)));
              }
            }
          } catch {}
        }
        return { ...c, progress: prog, isCompleted: prog >= 100 };
      });
      setCourses(enriched);
    } catch (err: any) {
      console.error("Failed to load real enrollments:", err);
      setErrorMessage("Unable to connect to the enrollments server. Please verify your connection.");
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  }, [session?.email]);

  useEffect(() => {
    loadEnrollments();

    const handleProgressChange = () => {
      loadEnrollments();
    };

    window.addEventListener("jks_video_progress_changed", handleProgressChange);
    window.addEventListener("focus", handleProgressChange);
    return () => {
      window.removeEventListener("jks_video_progress_changed", handleProgressChange);
      window.removeEventListener("focus", handleProgressChange);
    };
  }, [loadEnrollments]);

  // Overall Stats from live data
  const totalEnrolled = courses.length;
  const avgProgress =
    totalEnrolled > 0
      ? Math.round(courses.reduce((acc, c) => acc + (c.progress || 0), 0) / totalEnrolled)
      : 0;
  const completedCount = courses.filter((c) => (c.progress || 0) >= 100).length;

  // Filtered List
  const filteredCourses = useMemo(() => {
    let list = courses;
    if (filterTab === "in-progress") {
      list = list.filter((c) => (c.progress || 0) < 100);
    } else if (filterTab === "completed") {
      list = list.filter((c) => (c.progress || 0) >= 100);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.track.toLowerCase().includes(q) ||
          c.summary?.toLowerCase().includes(q) ||
          c.instructorName.toLowerCase().includes(q)
      );
    }

    return list;
  }, [courses, filterTab, searchQuery]);

  return (
    <>
      <DashboardTopbar
        title="My Courses"
        subtitle={
          isLoading
            ? "Syncing your live enrollments..."
            : totalEnrolled === 0
            ? "No courses enrolled yet."
            : `You are currently enrolled in ${totalEnrolled} active learning ${totalEnrolled === 1 ? "track" : "tracks"}.`
        }
        userInitials={session?.initials || "ST"}
      />

      <div className="flex-1 space-y-6 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4">
        {/* Learning Metric Summary Cards */}
        <Reveal variant="fade-up" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/80 bg-white/85 p-4 shadow-[0_4px_20px_rgb(20,50,100,0.04)] backdrop-blur-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Enrolled Tracks</p>
              <h4 className="text-xl font-black text-slate-900 mt-0.5">
                {isLoading ? "..." : `${totalEnrolled} ${totalEnrolled === 1 ? "Course" : "Courses"}`}
              </h4>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>

          <div className="rounded-2xl border border-white/80 bg-white/85 p-4 shadow-[0_4px_20px_rgb(20,50,100,0.04)] backdrop-blur-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Average Completion</p>
              <h4 className="text-xl font-black text-[#2563EB] mt-0.5">
                {isLoading ? "..." : `${avgProgress}%`}
              </h4>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Flame className="h-5 w-5" />
            </div>
          </div>

          <div className="rounded-2xl border border-white/80 bg-white/85 p-4 shadow-[0_4px_20px_rgb(20,50,100,0.04)] backdrop-blur-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Completed Tracks</p>
              <h4 className="text-xl font-black text-emerald-600 mt-0.5">
                {isLoading ? "..." : `${completedCount} Finished`}
              </h4>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Award className="h-5 w-5" />
            </div>
          </div>
        </Reveal>

        {/* Action & Filter Bar (Only show search/filter when user has enrollments) */}
        {!isLoading && !errorMessage && totalEnrolled > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Status Tabs */}
            <div className="flex items-center gap-2">
              {[
                { id: "all", label: `All Courses (${totalEnrolled})` },
                {
                  id: "in-progress",
                  label: `In Progress (${courses.filter((c) => (c.progress || 0) < 100).length})`,
                },
                { id: "completed", label: `Completed (${completedCount})` },
              ].map((tab) => {
                const isActive = filterTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFilterTab(tab.id as any)}
                    className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 cursor-pointer select-none ${
                      isActive
                        ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20 scale-[1.02]"
                        : "bg-slate-200/80 text-slate-700 hover:bg-slate-300 hover:text-slate-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Quick Search & Explore Catalog Links */}
            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-60">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search enrolled..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white/90 py-2 pl-9 pr-3 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none transition-colors focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <Link
                href="/courses"
                className="flex items-center justify-center gap-1.5 rounded-xl bg-white border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-all cursor-pointer whitespace-nowrap"
              >
                <ShoppingBag className="h-4 w-4 text-[#2563EB]" />
                <span>Browse Courses</span>
              </Link>
            </div>
          </div>
        )}

        {/* LOADING STATE SKELETONS */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {[1, 2].map((n) => (
              <div
                key={n}
                className="h-80 rounded-[22px] border border-slate-200 bg-white/70 p-6 shadow-sm animate-pulse space-y-4"
              >
                <div className="h-28 rounded-xl bg-slate-200" />
                <div className="h-5 w-3/4 rounded bg-slate-200" />
                <div className="h-4 w-1/2 rounded bg-slate-200" />
                <div className="h-3 w-full rounded bg-slate-200" />
                <div className="h-10 w-full rounded-xl bg-slate-200 pt-4" />
              </div>
            ))}
          </div>
        )}

        {/* ERROR STATE */}
        {!isLoading && errorMessage && (
          <div className="flex flex-col items-center justify-center rounded-[24px] border border-red-200 bg-red-50/70 p-10 text-center space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Failed to Load Enrollments</h3>
            <p className="text-xs text-slate-600 max-w-md">{errorMessage}</p>
            <button
              type="button"
              onClick={loadEnrollments}
              className="mt-2 flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Retry Connection
            </button>
          </div>
        )}

        {/* ENROLLED COURSES GRID (REAL DATA ONLY) */}
        {!isLoading && !errorMessage && filteredCourses.length > 0 && (
          <Reveal variant="stagger" className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {filteredCourses.map((course) => (
              <TiltCard key={course.id || course.slug} className="h-full">
                <div className="flex h-full flex-col justify-between overflow-hidden rounded-[22px] border border-white/80 bg-white/90 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:border-blue-200">
                  {/* Card Header Gradient Banner */}
                  <div className="relative flex h-28 items-center justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6 overflow-hidden">
                    <div
                      className="absolute inset-0 opacity-15"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 50% 50%, white 1px, transparent 1px)",
                        backgroundSize: "14px 14px",
                      }}
                    />

                    <div className="relative z-10">
                      <span className="rounded-md bg-blue-500/20 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-300 border border-blue-400/20">
                        {course.track}
                      </span>
                      <div className="mt-2 text-xs text-slate-300 font-medium">
                        {course.level} · {course.durationWeeks} Weeks
                      </div>
                    </div>

                    <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-blue-300 backdrop-blur-md shadow-xs">
                      <BookOpen className="h-5 w-5" />
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="flex-1 p-6 space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {course.title}
                      </h3>
                      <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {course.summary}
                      </p>
                    </div>

                    {/* Instructor & Cohort Timing Row */}
                    <div className="rounded-xl bg-slate-50/90 p-3 border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-600 font-bold shrink-0">
                          <User className="h-3.5 w-3.5" />
                        </div>
                        <div className="truncate">
                          <div className="text-[10px] uppercase font-bold text-slate-400">Lead Faculty</div>
                          <div className="font-bold text-slate-800 truncate">{course.instructorName}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 font-bold shrink-0">
                          <Calendar className="h-3.5 w-3.5" />
                        </div>
                        <div className="truncate">
                          <div className="text-[10px] uppercase font-bold text-slate-400">Batch Cohort</div>
                          <div className="font-bold text-slate-800 truncate">{course.batchTiming}</div>
                        </div>
                      </div>
                    </div>

                    {/* Course Structure Meta Strip */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium border-y border-slate-100 py-2.5">
                      <span className="flex items-center gap-1">
                        <Layers className="h-3.5 w-3.5 text-[#2563EB]" /> {course.totalSections} Modules
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Video className="h-3.5 w-3.5 text-purple-600" /> {course.totalLessons} Lessons
                      </span>
                      <span>•</span>
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Lifetime Access
                      </span>
                    </div>

                    {/* Dynamic Course Progress Bar */}
                    <div>
                      <div className="mb-1.5 flex justify-between text-xs font-bold text-slate-700">
                        <span>Course Progress</span>
                        <span className="text-[#2563EB]">{course.progress}% completed</span>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-cyan-500 transition-all duration-500"
                          style={{ width: `${Math.max(0, Math.min(100, course.progress))}%` }}
                        />
                      </div>
                    </div>

                    {/* Last Accessed Date */}
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium pt-1">
                      <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>
                        Last accessed:{" "}
                        <span className="text-slate-700 font-semibold">
                          {new Date(course.lastAccessedAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Card Footer: Direct Link to Course Learning Player */}
                  <div className="border-t border-slate-100 p-5 bg-slate-50/50">
                    <Link
                      href={`/dashboard/my-courses/${course.slug}`}
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 hover:scale-[1.01]"
                    >
                      <PlayCircle className="h-4 w-4" />
                      <span>Continue Learning</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </TiltCard>
            ))}
          </Reveal>
        )}

        {/* CLEAN EMPTY STATE (WHEN STUDENT HAS ZERO ENROLLED COURSES) */}
        {!isLoading && !errorMessage && totalEnrolled === 0 && (
          <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-white/80 p-12 text-center shadow-xs space-y-4 my-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#2563EB] ring-8 ring-blue-50/50 shadow-sm">
              <BookOpen className="h-8 w-8" />
            </div>

            <div className="space-y-1.5 max-w-md">
              <h3 className="text-lg font-black text-slate-900">No courses enrolled yet.</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                You are not currently enrolled in any courses. Explore our curated, production-ready tech tracks and kickstart your career journey today!
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/courses"
                className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-6 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/25 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Browse Courses</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

        {/* EMPTY STATE FOR FILTER / SEARCH RESULTS */}
        {!isLoading && !errorMessage && totalEnrolled > 0 && filteredCourses.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-white/80 p-12 text-center shadow-xs space-y-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No Courses Found</h3>
            <p className="text-xs text-slate-500 max-w-sm">
              No enrolled courses match your search or filter tab. Try clearing the search query.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setFilterTab("all");
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Clear Filter
            </button>
          </div>
        )}
      </div>
    </>
  );
}
