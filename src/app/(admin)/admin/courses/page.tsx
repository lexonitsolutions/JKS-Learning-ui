"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, BookOpen, Search, Award, Star, TrendingUp, Sparkles, Video, Layers } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { CourseWorkflowModal, type CourseWorkflowData } from "@/components/admin/course-workflow-modal";
import { useAllCourses, saveCourse, type FullCourse } from "@/lib/data/courses-store";
import type { Track } from "@/lib/data/courses";
import { TiltCard } from "@/components/interactions/tilt-card";
import { Reveal } from "@/lib/motion/reveal";

export default function AdminCoursesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const courses = useAllCourses();
  const [selectedTrack, setSelectedTrack] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = courses.filter((c) => {
    const matchesTrack = selectedTrack === "All" || c.track === selectedTrack;
    const matchesQuery = c.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTrack && matchesQuery;
  });

  const handleCreateCourseFromModal = (newCourse: CourseWorkflowData) => {
    const fullCourse: FullCourse = {
      id: `crs-${Date.now()}`,
      slug: newCourse.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
      title: newCourse.title,
      track: newCourse.track as Track,
      level: newCourse.level as "Beginner" | "Intermediate" | "Advanced",
      durationWeeks: 12,
      price: parseInt(newCourse.price.replace(/,/g, ""), 10) || 24999,
      rating: 5.0,
      studentsEnrolled: 0,
      summary: "Comprehensive multi-stage enterprise engineering curriculum.",
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
          type: stg.assignmentType === "MCQ" ? "MCQ" : stg.assignmentType === "Coding Challenge" ? "Coding Challenge" : "Project Submission",
          minPassingScore: stg.minPassingScore,
        },
      })),
    };
    saveCourse(fullCourse);
  };

  const totalEnrolled = courses.reduce((acc, c) => acc + (c.studentsEnrolled || 0), 0);

  return (
    <>
      <DashboardTopbar
        title="Courses"
        subtitle="Manage curriculum, video lectures, sequential stage assignments, and certificates."
        userInitials="AD"
      />

      <div className="flex-1 space-y-5 p-3 sm:p-6 lg:p-8 lg:pt-4">
        {/* Top Action Bar */}
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          {/* Search and Filters */}
          <div className="flex flex-1 flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
            <div className="relative w-full sm:w-auto sm:min-w-[260px]">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search courses…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pr-3 pl-9 text-xs font-medium text-slate-800 outline-none shadow-xs transition-colors focus:border-[#2563EB]"
              />
            </div>

            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1 shadow-xs overflow-x-auto">
              {["All", "Full Stack", "Frontend", "SAP"].map((trk) => (
                <button
                  key={trk}
                  type="button"
                  onClick={() => setSelectedTrack(trk)}
                  className={`rounded-lg px-3 py-1 text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                    selectedTrack === trk
                      ? "bg-[#2563EB] text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {trk}
                </button>
              ))}
            </div>
          </div>

          {/* New Course Primary Action Buttons - Placed at Right Side Corner */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 sm:py-2.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
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
            <div className="rounded-2xl border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Active Courses</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-[#2563EB]">
                  <BookOpen className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-extrabold text-slate-900">{courses.length}</div>
              <div className="mt-1 text-xs text-emerald-600 font-semibold">Live in active catalog</div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="rounded-2xl border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Total Enrolled Students</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-extrabold text-slate-900">
                {totalEnrolled.toLocaleString()}
              </div>
              <div className="mt-1 text-xs text-emerald-600 font-semibold">+14% month-on-month</div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="rounded-2xl border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Protected Video Player</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                  <Award className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-extrabold text-slate-900">100% In-App</div>
              <div className="mt-1 text-xs text-slate-500 font-medium">No external redirect & Anti-Skip enabled</div>
            </div>
          </TiltCard>
        </Reveal>

        {/* Main Courses Table */}
        <div className="rounded-[20px] border border-white/70 bg-white/80 p-4 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[680px]">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                  <th className="pb-3 pr-4 pl-0">Course Name & Structure</th>
                  <th className="px-4 pb-3">Track</th>
                  <th className="px-4 pb-3">Price</th>
                  <th className="px-4 pb-3">Sections & Videos</th>
                  <th className="px-4 pb-3 text-center">Rating</th>
                  <th className="px-4 pb-3 text-center">Status</th>
                  <th className="pr-0 pb-3 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredCourses.map((c) => {
                  const sectionCount = c.sections?.length || 0;
                  const totalVids = (c.sections || []).reduce((acc, s) => {
                    const direct = s.directVideos?.length || 0;
                    const subVids = s.subsections?.reduce((subAcc, sub) => subAcc + sub.videos.length, 0) || 0;
                    return acc + direct + subVids;
                  }, 0);

                  return (
                    <tr key={c.id || c.slug} className="transition-colors hover:bg-slate-50/60">
                      <td className="py-4 pr-4 pl-0 whitespace-nowrap">
                        <div className="font-bold text-slate-900">{c.title}</div>
                        <div className="text-[11px] text-slate-400 font-mono">/{c.slug}</div>
                      </td>
                      <td className="px-4 py-4 font-medium text-slate-600 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                          {c.track}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-semibold text-slate-900 whitespace-nowrap">
                        ₹{c.price.toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-4 font-medium text-slate-600 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-[#2563EB]">
                            <Layers className="h-3 w-3" /> {sectionCount} Sections
                          </span>
                          <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                            <Video className="h-3 w-3" /> {totalVids} Videos
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center font-medium text-slate-700 whitespace-nowrap">
                        {c.rating > 0 ? (
                          <span className="inline-flex items-center gap-1 font-bold text-amber-600">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            {c.rating}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-4 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                            c.status === "Published"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="pr-0 py-4 pl-4 text-right whitespace-nowrap">
                        <Link
                          href={`/dashboard/my-courses/${c.slug}`}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-[#2563EB] shadow-xs hover:bg-[#EFF6FF] transition-colors inline-block"
                        >
                          View Learning UI
                        </Link>
                      </td>
                    </tr>
                  );
                })}
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
    </>
  );
}
