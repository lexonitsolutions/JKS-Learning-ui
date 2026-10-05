"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  GraduationCap,
  ChevronRight,
  Search,
  Loader2,
  AlertCircle,
  Calendar,
  Clock,
  Mail,
  Phone,
  ArrowLeft,
  UserCheck,
  Sparkles,
  TrendingUp,
  Layers,
  Copy,
  Check,
} from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import {
  fetchBatchesHierarchy,
  type InstructorBatchHierarchy,
  type BatchCourseItem,
  type EnrolledStudentItem,
} from "@/lib/api/batches-api";

interface BatchesManagerViewProps {
  role: "admin" | "instructor";
}

// Avatar color helper based on string hash for visually appealing student initials
function getAvatarGradient(name: string) {
  const gradients = [
    "from-blue-600 via-indigo-600 to-violet-600",
    "from-emerald-500 via-teal-600 to-cyan-600",
    "from-amber-500 via-orange-600 to-rose-600",
    "from-purple-600 via-fuchsia-600 to-pink-600",
    "from-sky-500 via-blue-600 to-indigo-600",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}

// Track badge style helper
function getTrackBadgeStyle(track?: string) {
  const t = (track || "").toUpperCase();
  if (t.includes("FULL_STACK") || t.includes("FULL STACK")) {
    return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
  }
  if (t.includes("FRONTEND")) {
    return "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20";
  }
  if (t.includes("SAP")) {
    return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
  }
  if (t.includes("DOTNET") || t.includes(".NET")) {
    return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
  }
  return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
}

export function BatchesManagerView({ role }: BatchesManagerViewProps) {
  const [instructors, setInstructors] = useState<InstructorBatchHierarchy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Drill-down selection states
  const [selectedInstructorId, setSelectedInstructorId] = useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchBatchesHierarchy();
      setInstructors(data || []);
      // If role is instructor and there's 1 instructor, auto-select them
      if (role === "instructor" && data && data.length === 1) {
        setSelectedInstructorId(data[0].id);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load batches hierarchy");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCopyEmail = (email: string) => {
    if (!email) return;
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const selectedInstructor = instructors.find((i) => i.id === selectedInstructorId);
  const selectedCourse = selectedInstructor?.courses.find((c) => c.id === selectedCourseId);

  // Filtered lists
  const filteredInstructors = instructors.filter(
    (inst) =>
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCourses = (selectedInstructor?.courses || []).filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStudents = (selectedCourse?.enrolledStudents || []).filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery)
  );

  // Aggregate stats
  const totalInstructors = instructors.length;
  const totalCourses = instructors.reduce((acc, i) => acc + (i.courses?.length || 0), 0);
  const totalStudents = instructors.reduce((acc, i) => acc + (i.totalStudentsCount || 0), 0);
  const activeCohorts = instructors.reduce(
    (acc, i) => acc + (i.courses || []).filter((c) => c.studentsCount > 0).length,
    0
  );

  return (
    <>
      <DashboardTopbar
        title="Academic Batches & Cohorts"
        subtitle="Live hierarchy view: Instructors → Assigned Curricula → Enrolled Cohort Students."
        userInitials={role === "admin" ? "AD" : "IN"}
      />

      <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Error Alert */}
        {error && (
          <div className="rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/90 dark:bg-rose-950/40 p-4 text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center gap-2.5 shadow-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* TOP STATS STRIP - Pro UI Designer Hero Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-surface-secondary/95 p-4 sm:p-5 shadow-[0_4px_20px_rgb(0,0,0,0.02)] backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                Active Faculty
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-[#2563EB] dark:text-blue-400">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {totalInstructors}
              </span>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                <Sparkles className="h-3 w-3" /> Teaching
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Verified instructors roster</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-surface-secondary/95 p-4 sm:p-5 shadow-[0_4px_20px_rgb(0,0,0,0.02)] backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                Active Cohorts
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {activeCohorts}
              </span>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Batches</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Cohorts with enrolled learners</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-surface-secondary/95 p-4 sm:p-5 shadow-[0_4px_20px_rgb(0,0,0,0.02)] backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                Assigned Courses
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Layers className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {totalCourses}
              </span>
              <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">Curricula</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Multi-track assigned subjects</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-surface-secondary/95 p-4 sm:p-5 shadow-[0_4px_20px_rgb(0,0,0,0.02)] backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                Total Enrolled
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <GraduationCap className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {totalStudents}
              </span>
              <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">Students</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Registered across active batches</p>
          </div>
        </div>

        {/* INTERACTIVE NAVIGATION BREADCRUMBS */}
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-surface-secondary/70 p-2.5 sm:p-3 backdrop-blur-md">
          <button
            type="button"
            onClick={() => {
              setSelectedInstructorId(null);
              setSelectedCourseId(null);
              setSearchQuery("");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              !selectedInstructorId
                ? "bg-[#2563EB] text-white shadow-xs shadow-blue-500/20"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-surface-elevated"
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>All Instructors ({instructors.length})</span>
          </button>

          {selectedInstructor && (
            <>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <button
                type="button"
                onClick={() => {
                  setSelectedCourseId(null);
                  setSearchQuery("");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  !selectedCourseId
                    ? "bg-[#2563EB] text-white shadow-xs shadow-blue-500/20"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-surface-elevated"
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>
                  {selectedInstructor.name} ({selectedInstructor.courses.length} Courses)
                </span>
              </button>
            </>
          )}

          {selectedCourse && (
            <>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#2563EB] text-white shadow-xs shadow-blue-500/20">
                <GraduationCap className="h-3.5 w-3.5" />
                <span>
                  {selectedCourse.title} ({selectedCourse.studentsCount} Students)
                </span>
              </span>
            </>
          )}
        </div>

        {/* SEARCH AND BACK ACTION BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                selectedCourse
                  ? "Search students by name, email, or phone..."
                  : selectedInstructor
                  ? "Search assigned courses..."
                  : "Search instructors by name or email..."
              }
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB] shadow-2xs transition-all"
            />
          </div>

          {(selectedInstructorId || selectedCourseId) && (
            <button
              type="button"
              onClick={() => {
                if (selectedCourseId) {
                  setSelectedCourseId(null);
                } else {
                  setSelectedInstructorId(null);
                }
                setSearchQuery("");
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-secondary px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-blue-400 shadow-2xs transition-all cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to {selectedCourseId ? "Assigned Courses" : "All Instructors"}</span>
            </button>
          )}
        </div>

        {/* MAIN DRILLDOWN CONTENT AREA */}
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin text-[#2563EB] mb-3" />
            <p className="text-xs font-medium">Loading live batches hierarchy...</p>
          </div>
        ) : (
          <div>
            {/* LEVEL 1: ALL INSTRUCTORS GRID */}
            {!selectedInstructorId && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-sm uppercase tracking-wider">
                      Faculty & Academic Instructors
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                      Step 1: Select Instructor
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    {filteredInstructors.length} Instructor{filteredInstructors.length === 1 ? "" : "s"}
                  </span>
                </div>

                {filteredInstructors.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center text-slate-400 max-w-md mx-auto">
                    <Users className="h-8 w-8 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No instructors found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {searchQuery.trim()
                        ? `No instructors matched "${searchQuery}".`
                        : "No instructors registered in the system yet."}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {filteredInstructors.map((inst) => (
                      <div
                        key={inst.id}
                        onClick={() => {
                          setSelectedInstructorId(inst.id);
                          setSearchQuery("");
                        }}
                        className="relative overflow-hidden rounded-[24px] border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-surface-secondary/95 p-6 shadow-[0_4px_24px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_36px_rgb(37,99,235,0.12)] hover:border-blue-500/60 dark:hover:border-blue-500/50 transition-all duration-300 cursor-pointer group space-y-5 backdrop-blur-xl"
                      >
                        <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-bl from-blue-500/10 via-indigo-500/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />

                        <div className="flex items-start justify-between relative z-10">
                          <div className="flex items-center gap-3.5">
                            <div className="relative">
                              <div
                                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${getAvatarGradient(
                                  inst.name
                                )} text-white font-black text-lg shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300`}
                              >
                                {inst.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white dark:border-surface-secondary shadow-xs" />
                            </div>
                            <div>
                              <h4 className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors">
                                {inst.name}
                              </h4>
                              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                                <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                                <span className="truncate max-w-[170px] sm:max-w-[200px]">{inst.email}</span>
                              </p>
                            </div>
                          </div>

                          <div className="h-9 w-9 rounded-xl bg-slate-50 dark:bg-surface-elevated flex items-center justify-center text-slate-400 group-hover:bg-[#2563EB] group-hover:text-white transition-all shadow-2xs">
                            <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                          <div className="rounded-xl bg-slate-50/80 dark:bg-input-bg p-3 border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between text-slate-400 mb-1">
                              <BookOpen className="h-3.5 w-3.5 text-[#2563EB]" />
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Courses
                              </span>
                            </div>
                            <span className="text-xl font-black text-slate-900 dark:text-white block tracking-tight">
                              {inst.assignedCoursesCount}
                            </span>
                            <span className="text-[10.5px] font-medium text-slate-500 dark:text-slate-400">
                              Assigned Curricula
                            </span>
                          </div>

                          <div className="rounded-xl bg-slate-50/80 dark:bg-input-bg p-3 border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between text-slate-400 mb-1">
                              <GraduationCap className="h-3.5 w-3.5 text-emerald-500" />
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Students
                              </span>
                            </div>
                            <span className="text-xl font-black text-slate-900 dark:text-white block tracking-tight">
                              {inst.totalStudentsCount}
                            </span>
                            <span className="text-[10.5px] font-medium text-slate-500 dark:text-slate-400">
                              Cohort Learners
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1 text-xs font-bold text-[#2563EB] dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
                          <span>View Assigned Batches</span>
                          <span className="text-base font-normal">→</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* LEVEL 2: INSTRUCTOR'S ASSIGNED COURSES */}
            {selectedInstructor && !selectedCourseId && (
              <div className="space-y-5">
                {/* Selected Instructor Ribbon Card */}
                <div className="relative overflow-hidden rounded-[24px] border border-blue-200/80 dark:border-blue-900/60 bg-gradient-to-r from-blue-50/90 via-indigo-50/50 to-white dark:from-blue-950/30 dark:via-surface-secondary dark:to-surface-secondary p-5 sm:p-6 shadow-sm backdrop-blur-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${getAvatarGradient(
                          selectedInstructor.name
                        )} text-white font-black text-xl shadow-md shadow-blue-500/25 shrink-0`}
                      >
                        {selectedInstructor.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-slate-900 dark:text-white text-lg sm:text-xl tracking-tight">
                            {selectedInstructor.name}
                          </h3>
                          <span className="rounded-full bg-blue-100 dark:bg-blue-900/60 text-[#2563EB] dark:text-blue-300 text-[10px] font-extrabold px-2.5 py-0.5 border border-blue-200 dark:border-blue-800">
                            Verified Faculty
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5 text-slate-400" />
                            {selectedInstructor.email}
                          </span>
                          {selectedInstructor.phone && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Phone className="h-3.5 w-3.5 text-slate-400" />
                                {selectedInstructor.phone}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-white dark:bg-surface-elevated px-4 py-2 border border-slate-200 dark:border-slate-800 text-center shadow-2xs">
                        <span className="block text-xl font-black text-[#2563EB] dark:text-blue-400">
                          {selectedInstructor.courses.length}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Curricula
                        </span>
                      </div>
                      <div className="rounded-2xl bg-white dark:bg-surface-elevated px-4 py-2 border border-slate-200 dark:border-slate-800 text-center shadow-2xs">
                        <span className="block text-xl font-black text-emerald-600 dark:text-emerald-400">
                          {selectedInstructor.totalStudentsCount}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Students
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-sm uppercase tracking-wider">
                      Assigned Curricula & Batches
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-surface-elevated text-slate-600 dark:text-slate-300">
                      Step 2: Select Course
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    {filteredCourses.length} Course{filteredCourses.length === 1 ? "" : "s"}
                  </span>
                </div>

                {filteredCourses.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center text-slate-400 max-w-md mx-auto">
                    <BookOpen className="h-8 w-8 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      No assigned courses found
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {searchQuery.trim()
                        ? `No courses matched "${searchQuery}".`
                        : "No curricula have been assigned to this instructor yet."}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {filteredCourses.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setSelectedCourseId(c.id);
                          setSearchQuery("");
                        }}
                        className="rounded-[22px] border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-surface-secondary/95 p-5 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:border-[#2563EB] hover:shadow-[0_12px_32px_rgb(37,99,235,0.1)] transition-all cursor-pointer group flex flex-col justify-between space-y-4 backdrop-blur-xl"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${getTrackBadgeStyle(
                                c.track
                              )}`}
                            >
                              {c.track || "GENERAL"}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                              <UserCheck className="h-3 w-3" /> {c.studentsCount} Students
                            </span>
                          </div>

                          <h4 className="font-extrabold text-slate-900 dark:text-white text-base group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                            {c.title}
                          </h4>

                          <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1 truncate">
                            <span className="text-slate-500 font-sans">slug:</span> {c.slug}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-[#2563EB] dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
                          <span>View Enrolled Student Cohort</span>
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* LEVEL 3: ENROLLED STUDENTS IN SELECTED COURSE */}
            {selectedInstructor && selectedCourse && (
              <div className="space-y-5">
                {/* Course Header Banner */}
                <div className="relative overflow-hidden rounded-[24px] border border-emerald-200/80 dark:border-emerald-900/60 bg-gradient-to-r from-emerald-50/90 via-teal-50/40 to-white dark:from-emerald-950/30 dark:via-surface-secondary dark:to-surface-secondary p-5 sm:p-6 shadow-sm backdrop-blur-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-2.5 py-0.5 rounded-md">
                          Faculty: {selectedInstructor.name}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getTrackBadgeStyle(
                            selectedCourse.track
                          )}`}
                        >
                          {selectedCourse.track}
                        </span>
                      </div>
                      <h3 className="font-black text-slate-900 dark:text-white text-lg sm:text-xl tracking-tight">
                        {selectedCourse.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Live student cohort registered for this curriculum.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-extrabold px-4 py-2 rounded-2xl bg-white dark:bg-surface-elevated text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-2xs">
                        Enrolled Cohort: {selectedCourse.studentsCount} Students
                      </span>
                    </div>
                  </div>
                </div>

                {filteredStudents.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center text-slate-400 max-w-md mx-auto">
                    <GraduationCap className="h-8 w-8 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      No students found
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {searchQuery.trim()
                        ? `No enrolled students matched "${searchQuery}".`
                        : "No students are currently enrolled in this course batch."}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-[24px] border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-surface-secondary/95 shadow-[0_4px_24px_rgb(0,0,0,0.02)] overflow-hidden backdrop-blur-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/80 dark:bg-input-bg border-b border-slate-200/80 dark:border-slate-800 text-[10.5px] font-extrabold uppercase tracking-wider text-slate-500">
                          <tr>
                            <th className="px-5 py-3.5">Learner Profile</th>
                            <th className="px-5 py-3.5">Contact Details</th>
                            <th className="px-5 py-3.5">Cohort Batch Timing</th>
                            <th className="px-5 py-3.5">Enrollment Date</th>
                            <th className="px-5 py-3.5">Completed Lessons</th>
                            <th className="px-5 py-3.5">Academic Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                          {filteredStudents.map((st) => (
                            <tr
                              key={st.enrollmentId}
                              className="hover:bg-blue-50/30 dark:hover:bg-surface-hover/60 transition-colors"
                            >
                              <td className="px-5 py-3.5">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${getAvatarGradient(
                                      st.name
                                    )} text-white font-black text-xs shrink-0 shadow-2xs`}
                                  >
                                    {st.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <span className="font-extrabold text-slate-900 dark:text-white block text-sm">
                                      {st.name}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-mono">
                                      ID: {st.enrollmentId.slice(-6).toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5 text-[11px]">
                                    <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                                    <span className="truncate max-w-[180px]">{st.email}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleCopyEmail(st.email)}
                                      className="p-0.5 text-slate-400 hover:text-[#2563EB] cursor-pointer"
                                      title="Copy Email"
                                    >
                                      {copiedEmail === st.email ? (
                                        <Check className="h-2.5 w-2.5 text-emerald-500" />
                                      ) : (
                                        <Copy className="h-2.5 w-2.5" />
                                      )}
                                    </button>
                                  </div>
                                  {st.phone && (
                                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                                      <Phone className="h-3 w-3 shrink-0" />
                                      <span>{st.phone}</span>
                                    </div>
                                  )}
                                </div>
                              </td>

                              <td className="px-5 py-3.5">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-300 text-[11px] font-bold border border-blue-200/80 dark:border-blue-900">
                                  <Clock className="h-3 w-3 text-[#2563EB] dark:text-blue-400" />
                                  <span>{st.batchTiming || "Regular Cohort"}</span>
                                </span>
                              </td>

                              <td className="px-5 py-3.5 text-slate-500 text-[11px]">
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                  <span>{new Date(st.enrolledAt).toLocaleDateString()}</span>
                                </div>
                              </td>

                              <td className="px-5 py-3.5">
                                <div className="space-y-1 max-w-[120px]">
                                  <div className="flex items-center justify-between text-[11px]">
                                    <span className="font-extrabold text-slate-700 dark:text-slate-200">
                                      {st.completedVideos} completed
                                    </span>
                                  </div>
                                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                                      style={{
                                        width: `${Math.min(Math.max(st.completedVideos * 10, 5), 100)}%`,
                                      }}
                                    />
                                  </div>
                                </div>
                              </td>

                              <td className="px-5 py-3.5">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-extrabold ${
                                    st.status === "ACTIVE"
                                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                                      : "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                                  }`}
                                >
                                  <span
                                    className={`h-1.5 w-1.5 rounded-full ${
                                      st.status === "ACTIVE"
                                        ? "bg-emerald-500 animate-pulse"
                                        : "bg-amber-500"
                                    }`}
                                  />
                                  <span>{st.status}</span>
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
