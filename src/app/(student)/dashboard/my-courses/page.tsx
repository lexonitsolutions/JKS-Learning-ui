"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Layers,
  Video,
  ShoppingBag,
  PlusCircle,
  X,
  PlayCircle,
  Clock,
  Award,
  Search,
  Flame,
  Check,
} from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { TiltCard } from "@/components/interactions/tilt-card";
import { Reveal } from "@/lib/motion/reveal";
import {
  useStudentOwnedCourses,
  useAllCourses,
  enrollStudentCourse,
  unenrollStudentCourse,
} from "@/lib/data/courses-store";

export default function MyCoursesPage() {
  const ownedCourses = useStudentOwnedCourses();
  const allCourses = useAllCourses();
  const [filterTab, setFilterTab] = useState<"all" | "in-progress" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCatalogModal, setShowCatalogModal] = useState(false);

  // Compute progress for each enrolled course
  const coursesWithProgress = useMemo(() => {
    return ownedCourses.map((course) => {
      const totalSections = course.sections?.length || 0;
      const totalVideos = (course.sections || []).reduce((acc, s) => {
        const direct = s.directVideos?.length || 0;
        const subVids =
          s.subsections?.reduce((subAcc, sub) => subAcc + sub.videos.length, 0) || 0;
        return acc + direct + subVids;
      }, 0);

      // Realistic progress mock based on course slug
      let progress = 35;
      let lastTopic = "Core Architecture & Setup";
      let nextLesson = "Lesson 4: Deep Dive";

      if (course.slug.includes("java")) {
        progress = 62;
        lastTopic = "Spring Data JPA & Hibernate Relations";
        nextLesson = "Section 4 · Video 2: Microservices Circuit Breaker";
      } else if (course.slug.includes("frontend") || course.slug.includes("react")) {
        progress = 28;
        lastTopic = "React 19 Server Components & Actions";
        nextLesson = "Section 2 · Video 5: Optimistic UI Updates";
      } else if (course.slug.includes("ai")) {
        progress = 85;
        lastTopic = "Autonomous Agent Loop with LangGraph";
        nextLesson = "Section 6 · Video 1: Production Guardrails";
      } else if (course.slug.includes("dsa")) {
        progress = 45;
        lastTopic = "Dynamic Programming on Trees";
        nextLesson = "Section 5 · Video 3: Graph Traversal & Dijkstra";
      } else if (course.slug.includes("node")) {
        progress = 15;
        lastTopic = "Node.js Event Loop Internal Phases";
        nextLesson = "Section 1 · Video 4: Cluster Module & Worker Threads";
      }

      return {
        ...course,
        totalSections,
        totalVideos,
        progress,
        lastTopic,
        nextLesson,
        isCompleted: progress >= 100,
      };
    });
  }, [ownedCourses]);

  // Overall Stats
  const totalEnrolled = coursesWithProgress.length;
  const avgProgress = totalEnrolled > 0
    ? Math.round(coursesWithProgress.reduce((acc, c) => acc + c.progress, 0) / totalEnrolled)
    : 0;
  const completedCount = coursesWithProgress.filter((c) => c.isCompleted || c.progress >= 80).length;

  // Filtered List
  const filteredCourses = useMemo(() => {
    let list = coursesWithProgress;
    if (filterTab === "in-progress") {
      list = list.filter((c) => c.progress < 100);
    } else if (filterTab === "completed") {
      list = list.filter((c) => c.progress >= 100 || c.progress >= 80);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.track.toLowerCase().includes(q) ||
          c.summary.toLowerCase().includes(q)
      );
    }

    return list;
  }, [coursesWithProgress, filterTab, searchQuery]);

  return (
    <>
      <DashboardTopbar
        title="My Courses"
        subtitle={`You are currently enrolled in ${totalEnrolled} active learning tracks.`}
        userInitials="JD"
      />

      <div className="flex-1 space-y-6 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4">
        {/* Learning Metric Summary Cards */}
        <Reveal variant="fade-up" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/80 bg-white/85 p-4 shadow-[0_4px_20px_rgb(20,50,100,0.04)] backdrop-blur-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Enrolled Tracks</p>
              <h4 className="text-xl font-black text-slate-900 mt-0.5">{totalEnrolled} Courses</h4>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>

          <div className="rounded-2xl border border-white/80 bg-white/85 p-4 shadow-[0_4px_20px_rgb(20,50,100,0.04)] backdrop-blur-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Average Completion</p>
              <h4 className="text-xl font-black text-[#2563EB] mt-0.5">{avgProgress}%</h4>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Flame className="h-5 w-5" />
            </div>
          </div>

          <div className="rounded-2xl border border-white/80 bg-white/85 p-4 shadow-[0_4px_20px_rgb(20,50,100,0.04)] backdrop-blur-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Certificates Unlocked</p>
              <h4 className="text-xl font-black text-emerald-600 mt-0.5">{completedCount} Verified</h4>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Award className="h-5 w-5" />
            </div>
          </div>
        </Reveal>

        {/* Action & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-2">
            {[
              { id: "all", label: `All Courses (${totalEnrolled})` },
              { id: "in-progress", label: "In Progress" },
              { id: "completed", label: "Completed" },
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
            <div className="relative w-full sm:w-56">
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
              href="/dashboard/courses"
              className="flex items-center justify-center gap-1.5 rounded-xl bg-white border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-all cursor-pointer whitespace-nowrap"
            >
              <ShoppingBag className="h-4 w-4 text-[#2563EB]" />
              <span>Browse Catalog</span>
            </Link>

            <button
              type="button"
              onClick={() => setShowCatalogModal(true)}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition-all cursor-pointer whitespace-nowrap"
              title="Toggle course enrollments for testing"
            >
              <PlusCircle className="h-4 w-4 text-blue-400" />
              <span>Manage</span>
            </button>
          </div>
        </div>

        {/* Enrolled Courses Grid */}
        {filteredCourses.length > 0 ? (
          <Reveal variant="stagger" className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {filteredCourses.map((course) => (
              <TiltCard key={course.id || course.slug} className="h-full">
                <div className="flex h-full flex-col justify-between overflow-hidden rounded-[22px] border border-white/80 bg-white/90 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:border-blue-200">
                  {/* Card Header Gradient Banner */}
                  <div className="relative flex h-28 items-center justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6 overflow-hidden">
                    <div
                      className="absolute inset-0 opacity-15"
                      style={{
                        backgroundImage: "radial-gradient(circle at 50% 50%, white 1px, transparent 1px)",
                        backgroundSize: "14px 14px",
                      }}
                    />

                    <div className="relative z-10">
                      <span className="rounded-md bg-blue-500/20 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-300 border border-blue-400/20">
                        {course.track}
                      </span>
                      <div className="mt-2 text-xs text-slate-300 font-medium">
                        {course.level} · {course.durationWeeks} weeks
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

                    {/* Course Structure Meta Strip */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium border-y border-slate-100 py-2.5">
                      <span className="flex items-center gap-1">
                        <Layers className="h-3.5 w-3.5 text-[#2563EB]" /> {course.totalSections} Sections
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Video className="h-3.5 w-3.5 text-purple-600" /> {course.totalVideos} Lessons
                      </span>
                      <span>•</span>
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Lifetime Access
                      </span>
                    </div>

                    {/* Last Watched & Next Lesson Tracker */}
                    <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 space-y-1">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Current Lesson
                      </div>
                      <div className="text-xs font-semibold text-slate-800 truncate flex items-center gap-1.5">
                        <PlayCircle className="h-3.5 w-3.5 text-[#2563EB] shrink-0" />
                        <span>{course.lastTopic}</span>
                      </div>
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
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Direct Link to Video Player */}
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
        ) : (
          <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-white/80 p-12 text-center shadow-xs">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#2563EB]">
              <BookOpen className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900">No Enrolled Courses In This View</h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm">
              {searchQuery
                ? "No enrolled courses match your search criteria. Try a different query."
                : "You haven't enrolled in any courses yet. Browse our catalog and start your learning journey!"}
            </p>
            <div className="mt-5 flex items-center gap-3">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Clear Search
                </button>
              )}
              <Link
                href="/dashboard/courses"
                className="rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all cursor-pointer"
              >
                Browse All Courses
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* QUICK MANAGE MODAL (Allows toggling ownership for testing/demo purposes) */}
      {showCatalogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-[24px] border border-slate-100 bg-white p-6 shadow-2xl overflow-hidden space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="h-5 w-5 text-[#2563EB]" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Quick Manage Enrollments
                  </h3>
                  <p className="text-xs text-slate-500">
                    Toggle course ownership to test progress states
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCatalogModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {allCourses.map((c) => {
                const isOwned = ownedCourses.some((oc) => oc.slug === c.slug);
                return (
                  <div
                    key={c.id || c.slug}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4 transition-colors hover:border-slate-300"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                          {c.track}
                        </span>
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {c.title}
                        </span>
                      </div>
                      <div className="mt-1 text-[11px] text-slate-500">
                        ₹{c.price.toLocaleString("en-IN")} · {c.sections?.length || 0} Sections
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {isOwned ? (
                        <button
                          type="button"
                          onClick={() => unenrollStudentCourse(c.slug)}
                          className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
                        >
                          Revoke Ownership
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => enrollStudentCourse(c.slug)}
                          className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors cursor-pointer"
                        >
                          <PlusCircle className="h-3.5 w-3.5" /> Enroll Course
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setShowCatalogModal(false)}
                className="rounded-xl bg-[#2563EB] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
