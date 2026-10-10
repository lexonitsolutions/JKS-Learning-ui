"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Plus, BookOpen, Search, Award, Star, TrendingUp, Sparkles, Video, Layers, Pencil, Trash2, AlertTriangle, X, MoreVertical, Eye, Activity, SlidersHorizontal, IndianRupee } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { CourseWorkflowModal, type CourseWorkflowData } from "@/components/admin/course-workflow-modal";
import { EditCourseModal } from "@/components/admin/edit-course-modal";
import { useAllCourses, saveCourse, saveCourseAsync, deleteCourse, toggleCourseStatus, type FullCourse } from "@/lib/data/courses-store";
import type { Track } from "@/lib/data/courses";
import { TiltCard } from "@/components/interactions/tilt-card";
import { Reveal } from "@/lib/motion/reveal";
import { motion } from "framer-motion";

export default function AdminCoursesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<FullCourse | null>(null);
  const courses = useAllCourses();
  const [selectedTrack, setSelectedTrack] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Three dots action dropdown state
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".course-actions-dropdown")) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sticky header animation state for row headings
  const [isHeaderStuck, setIsHeaderStuck] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!tableRef.current) return;
      const rect = tableRef.current.getBoundingClientRect();
      const topOffset = window.innerWidth >= 640 ? 80 : 64;
      setIsHeaderStuck(rect.top <= topOffset + 2);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // Delete confirmation state
  const [courseToDelete, setCourseToDelete] = useState<FullCourse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [togglingCourseId, setTogglingCourseId] = useState<string | null>(null);

  const handleToggleStatus = async (course: FullCourse) => {
    try {
      setTogglingCourseId(course.id || course.slug);
      const nextStatus = course.status === "Published" ? "Draft" : "Published";
      await toggleCourseStatus(course.id || course.slug, nextStatus);
    } catch (err: any) {
      alert(err?.message || "Failed to update course status");
    } finally {
      setTogglingCourseId(null);
    }
  };

  const filteredCourses = courses.filter((c) => {
    const matchesTrack = selectedTrack === "All" || c.track === selectedTrack;
    const matchesQuery = c.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTrack && matchesQuery;
  });

  const handleCreateCourseFromModal = async (newCourse: CourseWorkflowData) => {
    setSaveError(null);
    const fullCourse: FullCourse = {
      id: `crs-${Date.now()}`,
      slug: newCourse.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
      title: newCourse.title,
      track: newCourse.track as Track,
      level: newCourse.level as "Beginner" | "Intermediate" | "Advanced",
      durationWeeks: 12,
      price: newCourse.price !== "" && !isNaN(parseInt(newCourse.price.replace(/,/g, ""), 10)) ? parseInt(newCourse.price.replace(/,/g, ""), 10) : 0,
      rating: 5.0,
      studentsEnrolled: 0,
      summary: "Comprehensive multi-stage enterprise engineering curriculum.",
      thumbnail: newCourse.thumbnailUrl || "",
      createdAt: new Date().toISOString(),
      status: "Published",
      sections: newCourse.stages.map((stg) => ({
        id: stg.id,
        title: stg.stageTitle,
        order: stg.stageNumber,
        description: `Stage ${stg.stageNumber} curriculum milestone and lecture materials.`,
        directVideos: [
          {
            id: `v-${stg.id}`,
            title: stg.videoTitle,
            durationSeconds: 240,
            durationFormatted: stg.videoDuration,
            videoType: "url",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            order: 1,
          },
        ],
        assignment: {
          id: `asg-${stg.id}`,
          title: stg.assignmentTitle,
          description: `Practical evaluation and milestone check for ${stg.stageTitle}.`,
          type: stg.assignmentType === "MCQ" ? "MCQ" : "Project Submission",
          minPassingScore: stg.minPassingScore,
        },
      })),
    };
    // saveCourseAsync now throws when the database write is rejected, so an
    // admin is told rather than shown a course that only exists in this browser.
    try {
      await saveCourseAsync(fullCourse);
    } catch (err: any) {
      console.error("[AdminCourses] Course save failed:", err);
      setSaveError(err?.message || "Failed to save course. Please try again.");
    }
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;
    setIsDeleting(true);
    setSaveError(null);
    try {
      await deleteCourse(courseToDelete.id || courseToDelete.slug);
      setCourseToDelete(null);
    } catch (err: any) {
      // A course with enrolments, submissions or billing records is refused by
      // the API and must be archived instead — keep the dialog's target so the
      // admin can see which course the message is about.
      console.error("[AdminCourses] Course delete failed:", err);
      setSaveError(err?.message || "Failed to delete course. Please try again.");
      setCourseToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };


  const totalEnrolled = courses.reduce((acc, c) => acc + (c.studentsEnrolled || 0), 0);

  return (
    <>
      <DashboardTopbar
        title="Courses"
        subtitle="Manage curriculum, video lectures, sequential stage assignments, and certificates."
        userInitials="LX"
      />

      <div className="flex-1 space-y-5 p-3 sm:p-5 lg:p-6 lg:pt-4 w-full max-w-full overflow-x-clip">
        {saveError && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
            {saveError}
          </div>
        )}

        {/* Top Action Bar */}
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          {/* Search and Filters */}
          <div className="flex flex-1 flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
            <div className="relative w-full sm:w-auto sm:min-w-[260px]">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-400" />
              <input
                type="text"
                placeholder="Search courses…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-input-bg py-2 pr-3 pl-9 text-xs font-medium text-slate-800 dark:text-white dark:placeholder-slate-400 outline-none shadow-xs transition-colors focus:border-[#2563EB] dark:focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-elevated p-1 shadow-xs overflow-x-auto">
              {["All", "Full Stack", "Frontend", "SAP"].map((trk) => (
                <button
                  key={trk}
                  type="button"
                  onClick={() => setSelectedTrack(trk)}
                  className={`relative rounded-lg px-3 py-1.5 text-xs font-bold transition-colors whitespace-nowrap cursor-pointer select-none ${
                    selectedTrack === trk
                      ? "text-white"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {selectedTrack === trk && (
                    <motion.div
                      layoutId="courses-track-pill"
                      className="absolute inset-0 rounded-lg bg-[#2563EB] shadow-xs"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{trk}</span>
                </button>
              ))}
            </div>
          </div>

          {/* New Course Primary Action Buttons - Placed at Right Side Corner */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-elevated px-3 py-2 sm:py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-xs hover:bg-slate-50 dark:hover:bg-surface-hover transition-colors cursor-pointer"
              title="Quick Workflow Modal"
            >
              Quick Wizard
            </button>

            <Link
              href="/admin/courses/new"
              className="flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-[#2563EB] px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs font-bold text-white shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:bg-blue-700 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>New Course</span>
            </Link>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <Reveal variant="stagger" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <TiltCard>
            <div className="rounded-2xl border border-white/70 dark:border-slate-800/80 bg-white/75 dark:bg-surface-secondary/90 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] dark:shadow-none backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Courses</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/50 text-[#2563EB] dark:text-blue-400">
                  <BookOpen className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">{courses.length}</div>
              <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Live in active catalog</div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="rounded-2xl border border-white/70 dark:border-slate-800/80 bg-white/75 dark:bg-surface-secondary/90 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] dark:shadow-none backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Enrolled Students</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
                {totalEnrolled.toLocaleString()}
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">Across all courses</div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="rounded-2xl border border-white/70 dark:border-slate-800/80 bg-white/75 dark:bg-surface-secondary/90 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] dark:shadow-none backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Protected Video Player</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
                  <Award className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">100% In-App</div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">No external redirect &amp; Anti-Skip enabled</div>
            </div>
          </TiltCard>
        </Reveal>

        {/* Mobile View: Dedicated Responsive Course Cards with Direct Edit & Actions */}
        <div className="md:hidden space-y-3">
          {filteredCourses.length === 0 ? (
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-surface-secondary p-8 text-center text-slate-500">
              <BookOpen className="h-8 w-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-sm font-semibold">No courses found</p>
            </div>
          ) : (
            filteredCourses.map((c) => {
              const totalSec = c.sections?.length || 0;
              const totalVid = (c.sections || []).reduce(
                (acc, s) => acc + (s.directVideos?.length || 0) + (s.subsections || []).reduce((subAcc, sub) => subAcc + (sub.videos?.length || 0), 0),
                0
              );
              return (
                <div
                  key={c.id}
                  className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-surface-secondary p-4 shadow-xs space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200/80 dark:border-slate-700">
                      {c.thumbnail ? (
                        <img src={c.thumbnail} alt={c.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-bold text-xs text-blue-600 bg-blue-50 dark:bg-blue-950/60">
                          {c.track || "JKS"}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="rounded-md bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-300">
                          {c.track}
                        </span>
                        <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          c.status === "Published"
                            ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                            : "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                        }`}>
                          {c.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate mt-1">
                        {c.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono truncate">/{c.slug}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 dark:border-slate-800/80 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Price</span>
                      <span className="font-bold text-slate-900 dark:text-white">₹{c.price?.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Curriculum</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{totalSec} Sec • {totalVid} Vid</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Rating</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center justify-center gap-0.5">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        {c.rating?.toFixed(1) || "5.0"}
                      </span>
                    </div>
                  </div>

                  {/* Actions Bar — Directly Accessible on Mobile */}
                  <div className="flex items-center gap-2 pt-1">
                    <Link
                      href={`/admin/courses/new?edit=${encodeURIComponent(c.slug || c.id)}`}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white py-2.5 text-xs font-bold shadow-xs transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      <span>Edit Course</span>
                    </Link>
                    <Link
                      href={`/dashboard/my-courses/${c.slug}`}
                      className="flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 p-2.5 text-xs font-bold hover:bg-slate-50 transition-colors"
                      title="View Learning UI"
                    >
                      <Eye className="h-4 w-4 text-emerald-600" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setCourseToDelete(c)}
                      className="flex items-center justify-center rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 p-2.5 text-xs font-bold hover:bg-red-100 transition-colors cursor-pointer"
                      title="Delete Course"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Main Courses Table (Desktop & Tablet) */}
        <div
          ref={tableRef}
          className={`hidden md:block w-full max-w-full rounded-[22px] border transition-all duration-300 ${
            isHeaderStuck
              ? "border-blue-500/30 shadow-[0_12px_36px_-6px_rgba(20,50,100,0.12)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.7)]"
              : "border-white/70 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(20,50,100,0.06)] dark:shadow-none"
          } bg-white/80 dark:bg-surface-secondary/90 p-3 sm:p-4 backdrop-blur-xl overflow-hidden`}
        >
          <div className="w-full overflow-x-auto [scrollbar-width:thin]">
            <table className="w-full text-left text-xs border-separate border-spacing-y-1.5 min-w-[760px]">
              <colgroup><col className="w-[32%]" /><col className="w-[10%]" /><col className="w-[10%]" /><col className="w-[17%]" /><col className="w-[8%]" /><col className="w-[13%]" /><col className="w-[10%]" /></colgroup>
              <thead className="sticky top-16 sm:top-20 z-20 transition-all duration-300">
                <tr className="border-none relative">
                  {/* 1. Course Name & Structure */}
                  <th
                    className={`w-[32%] pb-3.5 pt-3.5 pr-3 pl-3 sm:pl-4 sticky top-16 sm:top-20 z-20 transition-all duration-300 first:rounded-l-xl ${
                      isHeaderStuck
                        ? "bg-white/95 dark:bg-[#070D1E]/95 backdrop-blur-2xl border-b border-blue-500/40 shadow-sm"
                        : "bg-slate-50/90 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800/80"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase">
                      <BookOpen className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                      <span className="truncate">Course Name &amp; Structure</span>
                      {isHeaderStuck && (
                        <span className="ml-1.5 hidden md:inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-950/80 border border-blue-300 dark:border-blue-800 px-1.5 py-0.2 text-[9.5px] font-extrabold text-blue-700 dark:text-blue-300 animate-in fade-in">
                          {filteredCourses.length}
                        </span>
                      )}
                    </div>
                  </th>

                  {/* 2. Track */}
                  <th
                    className={`w-[10%] px-2.5 sm:px-3 pb-3.5 pt-3.5 sticky top-16 sm:top-20 z-20 transition-all duration-300 ${
                      isHeaderStuck
                        ? "bg-white/95 dark:bg-[#070D1E]/95 backdrop-blur-2xl border-b border-blue-500/40 shadow-sm"
                        : "bg-slate-50/90 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800/80"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase whitespace-nowrap">
                      <Layers className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <span>Track</span>
                    </div>
                  </th>

                  {/* 3. Price */}
                  <th
                    className={`w-[10%] px-2.5 sm:px-3 pb-3.5 pt-3.5 sticky top-16 sm:top-20 z-20 transition-all duration-300 ${
                      isHeaderStuck
                        ? "bg-white/95 dark:bg-[#070D1E]/95 backdrop-blur-2xl border-b border-blue-500/40 shadow-sm"
                        : "bg-slate-50/90 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800/80"
                    }`}
                  >
                    <div className="flex items-center gap-1 text-[11px] font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase whitespace-nowrap">
                      <IndianRupee className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Price</span>
                    </div>
                  </th>

                  {/* 4. Sections & Videos */}
                  <th
                    className={`w-[17%] px-2.5 sm:px-3 pb-3.5 pt-3.5 sticky top-16 sm:top-20 z-20 transition-all duration-300 ${
                      isHeaderStuck
                        ? "bg-white/95 dark:bg-[#070D1E]/95 backdrop-blur-2xl border-b border-blue-500/40 shadow-sm"
                        : "bg-slate-50/90 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800/80"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase whitespace-nowrap">
                      <Video className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                      <span>Sections &amp; Videos</span>
                    </div>
                  </th>

                  {/* 5. Rating */}
                  <th
                    className={`w-[8%] px-2 sm:px-3 pb-3.5 pt-3.5 text-center sticky top-16 sm:top-20 z-20 transition-all duration-300 ${
                      isHeaderStuck
                        ? "bg-white/95 dark:bg-[#070D1E]/95 backdrop-blur-2xl border-b border-blue-500/40 shadow-sm"
                        : "bg-slate-50/90 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800/80"
                    }`}
                  >
                    <div className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase whitespace-nowrap">
                      <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500/30 shrink-0" />
                      <span>Rating</span>
                    </div>
                  </th>

                  {/* 6. Status */}
                  <th
                    className={`w-[13%] px-2.5 sm:px-3 pb-3.5 pt-3.5 text-center sticky top-16 sm:top-20 z-20 transition-all duration-300 ${
                      isHeaderStuck
                        ? "bg-white/95 dark:bg-[#070D1E]/95 backdrop-blur-2xl border-b border-blue-500/40 shadow-sm"
                        : "bg-slate-50/90 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800/80"
                    }`}
                  >
                    <div className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase whitespace-nowrap">
                      <Activity className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Status</span>
                    </div>
                  </th>

                  {/* 7. Action */}
                  <th
                    className={`w-[10%] px-2.5 sm:px-3 pb-3.5 pt-3.5 text-center sticky top-16 sm:top-20 z-20 transition-all duration-300 last:rounded-r-xl ${
                      isHeaderStuck
                        ? "bg-white/95 dark:bg-[#070D1E]/95 backdrop-blur-2xl border-b border-blue-500/40 shadow-sm"
                        : "bg-slate-50/90 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800/80"
                    }`}
                  >
                    <div className="inline-flex items-center justify-center gap-1 text-[11px] font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase whitespace-nowrap">
                      <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>Action</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500 dark:text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <BookOpen className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                        <p className="text-sm font-semibold">No courses found in database</p>
                        <p className="text-xs text-slate-400">Create a new course using the &ldquo;New Course&rdquo; button above.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCourses.map((c, index) => {
                    const sectionCount = c.sections?.length || 0;
                    const totalVids = (c.sections || []).reduce((acc, s) => {
                      const direct = s.directVideos?.length || 0;
                      const subVids = s.subsections?.reduce((subAcc, sub) => subAcc + sub.videos.length, 0) || 0;
                      return acc + direct + subVids;
                    }, 0);

                    return (
                      <tr key={c.id || c.slug} className="group transition-all duration-200 ease-out hover:bg-slate-100/60 dark:hover:bg-white/[0.035] hover:shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:hover:shadow-[0_2px_14px_rgba(0,0,0,0.3)]">
                      <td className="py-3.5 pr-3 pl-3 sm:pl-4 first:rounded-l-2xl">
                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                          {c.thumbnail ? (
                            <img
                              src={c.thumbnail}
                              alt={c.title}
                              className="h-10 w-14 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0 shadow-2xs"
                            />
                          ) : (
                            <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 text-[10px] font-extrabold text-white shrink-0 shadow-2xs border border-white/10">
                              {c.track?.slice(0, 4)}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-slate-900 dark:text-white truncate max-w-[140px] sm:max-w-[200px] lg:max-w-[250px]">{c.title}</div>
                            <div className="text-[11px] text-slate-400 dark:text-slate-400 font-mono truncate max-w-[120px] sm:max-w-[180px]">/{c.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-2.5 sm:px-3 py-3.5 font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-lg bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                          {c.track}
                        </span>
                      </td>
                      <td className="px-2.5 sm:px-3 py-3.5 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                        {c.price <= 0 ? (
                          <span className="inline-flex items-center rounded-md bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                            Free Course
                          </span>
                        ) : (
                          `₹${c.price.toLocaleString("en-IN")}`
                        )}
                      </td>
                      <td className="px-2.5 sm:px-3 py-3.5 font-medium text-slate-600 dark:text-slate-300">
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="inline-flex items-center gap-1 rounded bg-blue-50 dark:bg-blue-950/50 px-1.5 py-0.5 text-[10.5px] font-semibold text-[#2563EB] dark:text-blue-400 border border-transparent dark:border-blue-800/40 whitespace-nowrap">
                            <Layers className="h-3 w-3" /> {sectionCount} Sec
                          </span>
                          <span className="inline-flex items-center gap-1 rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10.5px] font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                            <Video className="h-3 w-3" /> {totalVids} Vids
                          </span>
                        </div>
                      </td>
                      <td className="px-2 sm:px-3 py-3.5 text-center font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {c.rating > 0 ? (
                          <span className="inline-flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            {c.rating}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-2.5 sm:px-3 py-3.5 text-center whitespace-nowrap">
                        <button
                          type="button"
                          disabled={togglingCourseId === (c.id || c.slug)}
                          onClick={() => handleToggleStatus(c)}
                          title={`Click to ${c.status === "Published" ? "unpublish (switch to Draft)" : "publish"} course`}
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50 whitespace-nowrap ${
                            c.status === "Published"
                              ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
                              : "bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:hover:bg-amber-900/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60"
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${c.status === "Published" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                          <span>{togglingCourseId === (c.id || c.slug) ? "Updating..." : c.status}</span>
                        </button>
                      </td>
                      <td className="px-2.5 sm:px-3 py-3.5 text-center whitespace-nowrap last:rounded-r-2xl">
                        <div className="relative inline-flex items-center justify-center course-actions-dropdown">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenDropdownId(
                                openDropdownId === (c.id || c.slug) ? null : (c.id || c.slug)
                              )
                            }
                            className={`flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-elevated text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-surface-hover hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shadow-xs ${
                              openDropdownId === (c.id || c.slug)
                                ? "ring-2 ring-blue-500/40 border-blue-500/40 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30"
                                : ""
                            }`}
                            title="Course Actions & Settings"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>

                          {openDropdownId === (c.id || c.slug) && (
                            <div
                              className={`absolute right-0 z-50 w-48 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-surface-secondary p-1.5 shadow-2xl space-y-0.5 text-left backdrop-blur-xl animate-in fade-in zoom-in-95 ${
                                index >= filteredCourses.length - 2 && filteredCourses.length > 2
                                  ? "bottom-10"
                                  : "top-10"
                              }`}
                            >
                              <Link
                                href={`/admin/courses/new?edit=${encodeURIComponent(c.slug || c.id)}`}
                                onClick={() => setOpenDropdownId(null)}
                                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-surface-hover hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                              >
                                <Pencil className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                <span>Edit Course</span>
                              </Link>

                              <Link
                                href={`/dashboard/my-courses/${c.slug}`}
                                onClick={() => setOpenDropdownId(null)}
                                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-surface-hover hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                              >
                                <Eye className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                <span>View Learning UI</span>
                              </Link>

                              <div className="h-px bg-slate-100 dark:bg-slate-800/80 my-1" />

                              <button
                                type="button"
                                onClick={() => {
                                  setOpenDropdownId(null);
                                  setCourseToDelete(c);
                                }}
                                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                }))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Course Creation Modal */}
      <CourseWorkflowModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateCourseFromModal}
      />

      {/* Edit Course & Videos Modal */}
      <EditCourseModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setCourseToEdit(null);
        }}
        course={courseToEdit}
      />

      {/* Delete Course Confirmation Modal */}
      {courseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !isDeleting && setCourseToDelete(null)}
          />

          {/* Modal Card */}
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-red-200 dark:border-red-800/60 bg-white dark:bg-surface-secondary shadow-2xl p-6 space-y-5">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setCourseToDelete(null)}
              disabled={isDeleting}
              className="absolute top-4 right-4 rounded-lg p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Icon + Title */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 dark:bg-red-950/50">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Delete Course?</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">This action cannot be undone.</p>
              </div>
            </div>

            {/* Course Info */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-surface-elevated px-4 py-3">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{courseToDelete.title}</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">/{courseToDelete.slug}</p>
              <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                <span>{courseToDelete.sections?.length || 0} sections</span>
                <span>·</span>
                <span>{courseToDelete.studentsEnrolled || 0} enrolled</span>
                <span>·</span>
                <span className={courseToDelete.status === "Published" ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-amber-600 dark:text-amber-400 font-semibold"}>
                  {courseToDelete.status}
                </span>
              </div>
            </div>

            {/* Warning text */}
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Deleting this course will permanently remove it from the database and the course catalog. Enrolled students will lose access. This <strong>cannot be reversed</strong>.
            </p>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCourseToDelete(null)}
                disabled={isDeleting}
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-elevated px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-surface-hover transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCourse}
                disabled={isDeleting}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-70 shadow-[0_4px_14px_rgba(220,38,38,0.35)]"
              >
                {isDeleting ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Yes, Delete Course</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
