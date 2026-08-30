"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  BookOpen,
  Users,
  Video,
  Star,
  Search,
  CheckCircle2,
  Lock,
  Layers,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Edit,
  Trash2,
} from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { getStoredCourses, type FullCourse } from "@/lib/data/courses-store";
import { Reveal } from "@/lib/motion/reveal";
import { TiltCard } from "@/components/interactions/tilt-card";

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState<FullCourse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrack, setSelectedTrack] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  useEffect(() => {
    // Load courses from courses-store
    const loaded = getStoredCourses();
    setCourses(loaded);
  }, []);

  const filteredCourses = courses.filter((crs) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = crs.title.toLowerCase().includes(query) || crs.summary.toLowerCase().includes(query);
    const matchesTrack = selectedTrack === "All" || crs.track === selectedTrack;
    const matchesStatus = selectedStatus === "All" || crs.status === selectedStatus;
    return matchesSearch && matchesTrack && matchesStatus;
  });

  return (
    <>
      <DashboardTopbar
        title="My Courses & Curriculum"
        subtitle="Manage lectures, upload multi-section videos, configure anti-skip settings, and review syllabus."
        userInitials="RK"
      />

      <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8 lg:pt-4 max-w-7xl mx-auto w-full">
        {/* Action & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-3 max-w-md">
            <div className="relative w-full">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search courses by keyword or module…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pr-3 pl-9 text-xs font-medium text-slate-800 outline-none shadow-xs transition-colors focus:border-[#2563EB]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={selectedTrack}
              onChange={(e) => setSelectedTrack(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-[#2563EB]"
            >
              <option value="All">All Tracks</option>
              <option value="Full Stack">Full Stack</option>
              <option value="Frontend">Frontend</option>
              <option value="SAP">SAP</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-[#2563EB]"
            >
              <option value="All">All Statuses</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>

            <Link
              href="/instructor/courses/new"
              className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>Upload New Course</span>
            </Link>
          </div>
        </div>

        {/* Courses Grid */}
        <Reveal variant="stagger" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map((crs) => {
            const totalVideos = crs.sections.reduce(
              (acc, s) => acc + (s.directVideos?.length || 0) + (s.subsections?.reduce((subAcc, sub) => subAcc + sub.videos.length, 0) || 0),
              0
            );
            const totalAssignments = crs.sections.reduce((acc, s) => acc + (s.assignment ? 1 : 0), 0);

            return (
              <TiltCard key={crs.id}>
                <div className="flex h-full flex-col justify-between rounded-[22px] border border-white/70 bg-white/90 p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl transition-all hover:shadow-lg">
                  <div>
                    {/* Header: Track & Status */}
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-[#2563EB]">
                        {crs.track}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          crs.status === "Published"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {crs.status}
                      </span>
                    </div>

                    {/* Course Title & Summary */}
                    <div className="mt-3">
                      <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                        {crs.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {crs.summary}
                      </p>
                    </div>

                    {/* Meta Stats Grid */}
                    <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-slate-50/80 p-2.5 text-center text-xs">
                      <div>
                        <div className="font-extrabold text-slate-900">{crs.sections.length}</div>
                        <div className="text-[10px] text-slate-400 font-medium">Sections</div>
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-900">{totalVideos}</div>
                        <div className="text-[10px] text-slate-400 font-medium">Videos</div>
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-900">{totalAssignments}</div>
                        <div className="text-[10px] text-slate-400 font-medium">Tests</div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action Bar */}
                  <div className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-slate-500 font-medium">
                        <Users className="h-3.5 w-3.5 text-slate-400" />
                        {crs.studentsEnrolled.toLocaleString()} Students
                      </span>
                      <span className="flex items-center gap-1 font-bold text-amber-600">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        {crs.rating > 0 ? crs.rating : "New"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <Link
                        href={`/instructor/students?course=${crs.slug}`}
                        className="flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Users className="h-3.5 w-3.5" />
                        <span>Roster</span>
                      </Link>
                      <Link
                        href="/instructor/courses/new"
                        className="flex items-center justify-center gap-1 rounded-xl bg-[#2563EB] py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        <span>Edit Course</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </Reveal>
      </div>
    </>
  );
}
