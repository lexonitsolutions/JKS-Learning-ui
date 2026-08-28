"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Award,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  BrainCircuit,
  Bot,
  User,
  ShieldCheck,
  TrendingUp,
  Download,
  Share2,
  FileText,
  Sparkles,
  Flame,
  Star,
  Layers,
  ChevronRight,
  Filter,
  BarChart3,
  Check,
  Send,
  ExternalLink,
  Code2,
  Copy,
  Eye,
  X,
  FileCode,
  HelpCircle,
  CheckCircle,
  XCircle,
  PlayCircle,
  GraduationCap,
} from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { TiltCard } from "@/components/interactions/tilt-card";
import { Reveal } from "@/lib/motion/reveal";
import {
  getStudentProfile,
  StudentAssignmentSubmission,
  StudentCourseProgress,
  StudentQuizResult,
} from "@/lib/data/admin-student-details";

export default function AdminStudentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const studentSlug = (params?.id as string) || "priya-nair";
  const student = useMemo(() => getStudentProfile(studentSlug), [studentSlug]);

  const [activeTab, setActiveTab] = useState<
    "overview" | "courses" | "assignments" | "quizzes" | "certificates" | "timeline"
  >("courses");

  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string | "all">("all");
  const [assignmentFilter, setAssignmentFilter] = useState<"all" | "high-human" | "ai-assisted">("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal inspection states
  const [inspectingAssignment, setInspectingAssignment] = useState<StudentAssignmentSubmission | null>(null);
  const [inspectingQuiz, setInspectingQuiz] = useState<StudentQuizResult | null>(null);
  const [inspectModalTab, setInspectModalTab] = useState<"answers" | "ai-scan" | "rubric">("answers");
  const [copiedCode, setCopiedCode] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopyCode = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Handle clicking on an enrolled course card -> drills down to Assignments & AI Scan for that course
  const handleSelectCourseDrilldown = (courseTitle: string) => {
    setSelectedCourseFilter(courseTitle);
    setActiveTab("assignments");
    showToast(`Filtering assignments & AI authenticity scan for: ${courseTitle}`);
  };

  const filteredAssignments = useMemo(() => {
    let list = student.assignments;
    if (selectedCourseFilter !== "all") {
      list = list.filter((a) => a.courseTitle === selectedCourseFilter);
    }
    if (assignmentFilter === "high-human") {
      list = list.filter((a) => a.aiAnalysis.humanScore >= 90);
    } else if (assignmentFilter === "ai-assisted") {
      list = list.filter((a) => a.aiAnalysis.aiScore > 10);
    }
    return list;
  }, [student.assignments, selectedCourseFilter, assignmentFilter]);

  return (
    <>
      <DashboardTopbar
        title={`Student Profile — ${student.name}`}
        subtitle="Comprehensive academic dossier, AI authenticity verification & performance analytics."
        userInitials="AD"
      />

      <div className="flex-1 space-y-6 p-3 sm:p-6 lg:p-8 lg:pt-4">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-2xl border border-blue-200 bg-white/95 px-5 py-3.5 text-xs font-bold text-[#2563EB] shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 className="h-4 w-4 text-[#2563EB]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Back Button & Action Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Link
            href="/admin/students"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#2563EB] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Students Roster</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => showToast("Exporting Complete Student Academic Dossier (PDF)...")}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              <span>Export Dossier (PDF)</span>
            </button>

            <button
              type="button"
              onClick={() => showToast(`Academic performance report emailed to ${student.email}!`)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Email Progress Report</span>
            </button>
          </div>
        </div>

        {/* Header Profile & Progress Rating Hero Card */}
        <Reveal variant="fade-up">
          <div className="relative overflow-hidden rounded-[24px] border border-white/80 bg-white/85 p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left Column: Avatar & Basic Information */}
              <div className="lg:col-span-7 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="relative">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-indigo-600 text-2xl font-black text-white shadow-lg shadow-blue-500/25">
                    {student.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 border-2 border-white text-white">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                </div>

                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
                      {student.name}
                    </h2>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                      {student.status}
                    </span>
                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-[#2563EB] border border-blue-200">
                      {student.tier}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-600">{student.role}</p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1 font-medium">
                    <span className="inline-flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      {student.email}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      {student.phone}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {student.location}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      Enrolled {student.joinedDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Progress Rating & Performance Velocity Box */}
              <div className="lg:col-span-5 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-white p-4.5 shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Student Progress Rating
                  </span>
                  <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-800">
                    {student.learningPace}
                  </span>
                </div>

                <div className="mt-2.5 flex items-baseline justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(student.performanceRating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-amber-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xl font-black text-slate-900">
                      {student.performanceRating}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">/ 5.0</span>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-extrabold text-[#2563EB]">
                      {student.masteryScore}% Mastery
                    </div>
                    <div className="text-[10px] font-medium text-emerald-600">
                      {student.performanceTier}
                    </div>
                  </div>
                </div>

                {/* Progress Velocity Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                    <span>Curriculum Completion Index</span>
                    <span>{student.analytics.completionRate}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-blue-100/80 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-cyan-500"
                      style={{ width: `${student.analytics.completionRate}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Tab Navigation Strip */}
        <div className="flex items-center gap-1.5 border-b border-slate-200/80 pb-1 overflow-x-auto">
          {[
            { id: "courses", label: `Enrolled Courses (${student.courses.length})` },
            { id: "assignments", label: `Assignments & AI Scan (${student.assignments.length})` },
            { id: "overview", label: "Overview & Analytics" },
            { id: "quizzes", label: `Quizzes & Tests (${student.quizzes.length})` },
            { id: "certificates", label: `Certificates (${student.certificates.length})` },
            { id: "timeline", label: "Activity Timeline" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (tab.id === "assignments") {
                    setSelectedCourseFilter("all");
                  }
                }}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all duration-150 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: ENROLLED COURSES (Redesigned like Dashboard All-Courses Card Style) */}
        {/* ========================================================================= */}
        {activeTab === "courses" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Enrolled Learning Pathways</h3>
                <p className="text-xs text-slate-500">
                  Click any course card to inspect its submitted assignments, answers, and AI authenticity verification report.
                </p>
              </div>
              <span className="text-xs font-bold text-[#2563EB] bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
                {student.courses.length} Active Tracks
              </span>
            </div>

            <Reveal variant="stagger" className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {student.courses.map((course) => {
                const isCompleted = course.progress >= 100;
                return (
                  <TiltCard key={course.courseId} className="h-full">
                    <div
                      onClick={() => handleSelectCourseDrilldown(course.courseTitle)}
                      className="group flex h-full flex-col justify-between overflow-hidden rounded-[24px] border border-white/80 bg-white/95 shadow-[0_10px_35px_rgb(20,50,100,0.07)] backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:border-blue-300 hover:-translate-y-1 cursor-pointer"
                    >
                      {/* Premium Top Gradient Hero Banner */}
                      <div className="relative flex h-32 flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-[#1E3A8A] p-5 text-white overflow-hidden">
                        {/* Decorative background grid and glow */}
                        <div
                          className="absolute inset-0 opacity-20"
                          style={{
                            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
                            backgroundSize: "16px 16px",
                          }}
                        />
                        <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-blue-500/25 blur-2xl" />

                        {/* Top Badges */}
                        <div className="relative z-10 flex items-center justify-between">
                          <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md border border-white/20">
                            {course.track}
                          </span>
                          <span className="rounded-full bg-blue-500/25 px-2.5 py-1 text-[10px] font-bold text-blue-200 border border-blue-400/30">
                            {course.hoursSpent} hrs logged
                          </span>
                        </div>

                        {/* Banner Footer Info */}
                        <div className="relative z-10 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                            <GraduationCap className="h-3.5 w-3.5 text-blue-400" />
                            <span className="truncate max-w-[200px]">
                              {course.instructorName || "JKS Faculty"}
                            </span>
                          </div>
                          <span className="text-[11px] font-bold text-emerald-400">
                            Grade: {course.grade}
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="flex-1 p-6 space-y-4">
                        <div>
                          <h4 className="text-lg font-extrabold text-slate-900 leading-snug group-hover:text-[#2563EB] transition-colors">
                            {course.courseTitle}
                          </h4>
                          <p className="mt-1 text-xs text-slate-500 flex items-center gap-2">
                            <span>{course.completedLessons} of {course.totalLessons} Lessons Finished</span>
                            <span>•</span>
                            <span>Active: {course.lastActive}</span>
                          </p>
                        </div>

                        {/* Progress Bar & Status */}
                        <div className="space-y-1.5 pt-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-600">Course Mastery Index</span>
                            <span className="text-[#2563EB]">{course.progress}%</span>
                          </div>
                          <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-cyan-500 transition-all duration-500"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Status Pills */}
                        <div className="flex items-center justify-between pt-1">
                          {course.certificateEarned ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Certificate Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                              <Clock className="h-3.5 w-3.5" /> In Progress
                            </span>
                          )}

                          <span className="text-xs font-bold text-slate-400">
                            {student.assignments.filter((a) => a.courseTitle === course.courseTitle).length} Assignments Submitted
                          </span>
                        </div>
                      </div>

                      {/* Action Button Strip */}
                      <div className="border-t border-slate-100 bg-slate-50/70 p-4 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-600 group-hover:text-[#2563EB] transition-colors">
                          Inspect Submissions & AI Scan
                        </span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[#2563EB] shadow-xs group-hover:bg-[#2563EB] group-hover:text-white transition-all">
                          <ChevronRight className="h-4 w-4 stroke-[2.5]" />
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                );
              })}
            </Reveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ASSIGNMENTS & AI AUTHENTICITY SCAN (With Full Answer Inspection)   */}
        {/* ========================================================================= */}
        {activeTab === "assignments" && (
          <div className="space-y-6">
            {/* Filter and Course Selection Strip */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white/90 p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                  <Filter className="h-3.5 w-3.5 text-slate-400" /> Filter by Track:
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedCourseFilter("all")}
                  className={`rounded-xl px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                    selectedCourseFilter === "all"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  All Courses ({student.assignments.length})
                </button>
                {student.courses.map((c) => (
                  <button
                    key={c.courseId}
                    type="button"
                    onClick={() => setSelectedCourseFilter(c.courseTitle)}
                    className={`rounded-xl px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                      selectedCourseFilter === c.courseTitle
                        ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {c.track}
                  </button>
                ))}
              </div>

              {/* AI Verdict Filter */}
              <div className="flex items-center gap-2">
                {[
                  { id: "all", label: "All Verdicts" },
                  { id: "high-human", label: "Authentic Human (≥90%)" },
                  { id: "ai-assisted", label: "AI Assisted" },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setAssignmentFilter(f.id as any)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-colors cursor-pointer ${
                      assignmentFilter === f.id
                        ? "bg-blue-100 text-[#2563EB]"
                        : "text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Filter Notice */}
            {selectedCourseFilter !== "all" && (
              <div className="flex items-center justify-between rounded-xl bg-blue-50 border border-blue-200 px-4 py-2.5 text-xs text-[#2563EB]">
                <span className="font-bold">
                  Showing submissions for: <span className="underline">{selectedCourseFilter}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedCourseFilter("all")}
                  className="font-bold underline hover:text-blue-900 cursor-pointer"
                >
                  Clear filter & show all
                </button>
              </div>
            )}

            {/* Assignments List */}
            <div className="space-y-5">
              {filteredAssignments.map((asg) => (
                <div
                  key={asg.id}
                  className="rounded-[24px] border border-white/80 bg-white/95 p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl space-y-5 transition-all hover:shadow-xl hover:border-blue-200"
                >
                  {/* Top Header: Title, Course Badge & Score */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-[#2563EB] border border-blue-100">
                          {asg.courseTitle}
                        </span>
                        <span className="text-xs text-slate-400">Submitted: {asg.submittedAt}</span>
                      </div>
                      <h4 className="mt-1.5 text-lg font-extrabold text-slate-900">{asg.title}</h4>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-black text-slate-900">{asg.score}/100</div>
                        <div className="text-[10px] font-bold text-emerald-600 uppercase">
                          {asg.status}
                        </div>
                      </div>

                      {/* Primary Action to Open Solution Dossier */}
                      <button
                        type="button"
                        onClick={() => {
                          setInspectingAssignment(asg);
                          setInspectModalTab("answers");
                        }}
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5 text-blue-400" />
                        <span>Inspect Answers & Code</span>
                      </button>
                    </div>
                  </div>

                  {/* AI vs Human Writing Analysis Breakdown Card */}
                  <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 shadow-xs">
                          <ShieldCheck className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            JKS AI Authenticity & Linguistic Verification
                          </div>
                          <span className="inline-block mt-0.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800">
                            {asg.aiAnalysis.verdict}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                        <span>Plagiarism: <strong className="text-slate-900">{asg.aiAnalysis.plagiarismRate}%</strong></span>
                        <span>Complexity: <strong className="text-[#2563EB]">{asg.aiAnalysis.syntacticComplexity}</strong></span>
                        <span>Detector Confidence: <strong className="text-emerald-600">{asg.aiAnalysis.confidenceScore}%</strong></span>
                      </div>
                    </div>

                    {/* Dual Color AI vs Human Ratio Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-emerald-700 flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5" /> Human Authored: {asg.aiAnalysis.humanScore}%
                        </span>
                        <span className="text-indigo-600 flex items-center gap-1.5">
                          <Bot className="h-3.5 w-3.5" /> AI Assisted: {asg.aiAnalysis.aiScore}%
                        </span>
                      </div>

                      <div className="flex h-3 w-full rounded-full overflow-hidden bg-slate-200">
                        <div
                          className="bg-emerald-500 transition-all duration-500"
                          style={{ width: `${asg.aiAnalysis.humanScore}%` }}
                        />
                        <div
                          className="bg-indigo-500 transition-all duration-500"
                          style={{ width: `${asg.aiAnalysis.aiScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Key Findings Preview */}
                    <div className="space-y-1 pt-1">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        AI Telemetry Analysis Notes
                      </div>
                      <ul className="space-y-1">
                        {asg.aiAnalysis.keyFindings.map((finding, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                            <span className="text-emerald-500 font-bold">•</span>
                            <span>{finding}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Submission Answers Preview Snippet */}
                  <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-[#2563EB]" /> Submitted Executive Summary
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setInspectingAssignment(asg);
                          setInspectModalTab("answers");
                        }}
                        className="text-[11px] text-[#2563EB] hover:underline cursor-pointer"
                      >
                        View Full Code & Blueprint →
                      </button>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {asg.studentAnswers.executiveSummary}
                    </p>
                  </div>

                  {/* Instructor Feedback */}
                  <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3 text-xs text-slate-700 flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-[#2563EB] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#2563EB]">Lead Trainer Feedback: </span>
                      <span>{asg.feedback}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: OVERVIEW & LEARNING ANALYTICS                                      */}
        {/* ========================================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Top 4 Quick Metric Cards */}
            <Reveal variant="stagger" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <TiltCard>
                <div className="rounded-[20px] border border-white/70 bg-white/80 p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Total Study Time</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#2563EB]">
                      <Clock className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-2 text-2xl font-extrabold text-slate-900">
                    {student.analytics.totalHoursLearned} hrs
                  </div>
                  <div className="mt-1 text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5" /> Active Learner
                  </div>
                </div>
              </TiltCard>

              <TiltCard>
                <div className="rounded-[20px] border border-white/70 bg-white/80 p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Learning Streak</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
                      <Flame className="h-4 w-4 fill-amber-500" />
                    </div>
                  </div>
                  <div className="mt-2 text-2xl font-extrabold text-slate-900">
                    {student.analytics.dayStreak} Days
                  </div>
                  <div className="mt-1 text-xs text-amber-600 font-semibold">Continuous Practice</div>
                </div>
              </TiltCard>

              <TiltCard>
                <div className="rounded-[20px] border border-white/70 bg-white/80 p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">AI Mock Readiness</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                      <BrainCircuit className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-2 text-2xl font-extrabold text-slate-900">
                    {student.analytics.aiInterviewAvgScore}/100
                  </div>
                  <div className="mt-1 text-xs text-purple-600 font-semibold">Technical & Scenario</div>
                </div>
              </TiltCard>

              <TiltCard>
                <div className="rounded-[20px] border border-white/70 bg-white/80 p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Assessments Passed</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-2 text-2xl font-extrabold text-slate-900">
                    {student.analytics.totalAssessmentsPassed} Passed
                  </div>
                  <div className="mt-1 text-xs text-emerald-600 font-semibold">100% Pass Rate</div>
                </div>
              </TiltCard>
            </Reveal>

            {/* Weekly Study Hours & Skills Radar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Weekly Learning Activity Bar Graph */}
              <div className="lg:col-span-7 rounded-[22px] border border-white/80 bg-white/90 p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Weekly Study Hours Breakdown</h3>
                    <p className="text-xs text-slate-500">Daily time spent on video lectures, assignments and code lab</p>
                  </div>
                  <span className="text-xs font-bold text-[#2563EB]">
                    {student.analytics.weeklyStudyHours.reduce((a, b) => a + b.hours, 0).toFixed(1)} hrs this week
                  </span>
                </div>

                <div className="flex items-end justify-between gap-3 pt-4 h-44">
                  {student.analytics.weeklyStudyHours.map((d) => {
                    const heightPercent = Math.min(100, Math.round((d.hours / 8) * 100));
                    return (
                      <div key={d.day} className="flex flex-1 flex-col items-center gap-2 h-full justify-end">
                        <span className="text-[10px] font-extrabold text-slate-600">{d.hours}h</span>
                        <div className="w-full max-w-[36px] rounded-t-xl bg-slate-100 h-full flex items-end overflow-hidden">
                          <div
                            className="w-full rounded-t-xl bg-gradient-to-t from-[#2563EB] to-cyan-400 transition-all duration-500"
                            style={{ height: `${heightPercent}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-slate-500">{d.day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Verified Competency Breakdown */}
              <div className="lg:col-span-5 rounded-[22px] border border-white/80 bg-white/90 p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900">Domain Competency Ratings</h3>
                  <p className="text-xs text-slate-500">Verified through automated assessments & code reviews</p>
                </div>

                <div className="space-y-3 pt-1">
                  {student.analytics.skillsRadar.map((skill) => (
                    <div key={skill.skill} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>{skill.skill}</span>
                        <span className="text-[#2563EB]">{skill.score}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"
                          style={{ width: `${skill.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: QUIZZES & ASSESSMENTS                                              */}
        {/* ========================================================================= */}
        {activeTab === "quizzes" && (
          <div className="space-y-4">
            <div className="rounded-[22px] border border-white/80 bg-white/90 p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[650px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase text-slate-400">
                      <th className="pb-3">Assessment Title</th>
                      <th className="px-4 pb-3">Category</th>
                      <th className="px-4 pb-3">Score</th>
                      <th className="px-4 pb-3">Accuracy</th>
                      <th className="px-4 pb-3">Duration</th>
                      <th className="px-4 pb-3">Date</th>
                      <th className="pr-0 pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {student.quizzes.map((qz) => (
                      <tr key={qz.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 font-bold text-slate-900">{qz.title}</td>
                        <td className="px-4 py-3.5 text-slate-600">{qz.category}</td>
                        <td className="px-4 py-3.5 font-black text-[#2563EB]">{qz.score}%</td>
                        <td className="px-4 py-3.5 text-slate-600 font-medium">
                          {qz.correctAnswers} / {qz.totalQuestions}
                        </td>
                        <td className="px-4 py-3.5 text-slate-500">{qz.durationMinutes} mins</td>
                        <td className="px-4 py-3.5 text-slate-500">{qz.attemptDate}</td>
                        <td className="pr-0 py-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => setInspectingQuiz(qz)}
                            className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-[#2563EB] hover:bg-blue-100 transition-colors cursor-pointer"
                          >
                            <Eye className="h-3 w-3" />
                            <span>Audit Answers</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: CERTIFICATES EARNED                                                */}
        {/* ========================================================================= */}
        {activeTab === "certificates" && (
          <div className="space-y-4">
            {student.certificates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {student.certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="relative overflow-hidden rounded-[24px] border border-blue-200/80 bg-gradient-to-br from-white via-white to-blue-50/50 p-6 shadow-md shadow-blue-500/5 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                          <Award className="h-6 w-6" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Verified Certification
                          </span>
                          <h4 className="text-sm font-black text-slate-900">{cert.courseTitle}</h4>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400">Verification ID:</span>
                        <div className="font-mono font-bold text-[#2563EB]">{cert.verificationId}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Issue Date:</span>
                        <div className="font-semibold text-slate-800">{cert.issueDate}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Grade:</span>
                        <div className="font-bold text-emerald-600">{cert.grade}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Ledger Status:</span>
                        <div className="font-semibold text-slate-800">Verified & Active</div>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => showToast(`Downloaded verified certificate PDF (${cert.verificationId})`)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Download PDF Certificate</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => showToast(`Copied verification link: https://jkslearning.com/verify/${cert.verificationId}`)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                      >
                        <Share2 className="h-3.5 w-3.5" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[22px] border border-dashed border-slate-300 bg-white/80 p-12 text-center">
                <Award className="h-10 w-10 text-slate-300 mx-auto" />
                <h4 className="mt-3 text-sm font-bold text-slate-900">No Certificates Earned Yet</h4>
                <p className="mt-1 text-xs text-slate-500">
                  Student is currently progressing toward capstone completion.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: ACTIVITY TIMELINE                                                  */}
        {/* ========================================================================= */}
        {activeTab === "timeline" && (
          <div className="rounded-[22px] border border-white/80 bg-white/90 p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {student.timeline.map((log) => (
                <div key={log.id} className="relative space-y-1">
                  <div
                    className={`absolute -left-[27px] top-1 h-3.5 w-3.5 rounded-full border-2 border-white ${log.badgeColor} shadow-xs`}
                  />
                  <div className="flex items-center justify-between text-xs">
                    <h5 className="font-extrabold text-slate-900">{log.title}</h5>
                    <span className="text-slate-400 font-medium">{log.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{log.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: SUBMITTED ASSIGNMENT & AI AUTHENTICITY INSPECTION DOSSIER        */}
      {/* ========================================================================= */}
      {inspectingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative flex flex-col max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-[28px] border border-white/90 bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="relative flex items-center justify-between bg-gradient-to-r from-slate-950 via-slate-900 to-[#1E3A8A] px-6 py-5 text-white">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-300 border border-blue-400/30">
                    {inspectingAssignment.courseTitle}
                  </span>
                  <span className="text-xs text-slate-300">
                    Submitted: {inspectingAssignment.submittedAt}
                  </span>
                </div>
                <h3 className="text-lg font-black text-white">{inspectingAssignment.title}</h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <div className="text-2xl font-black text-emerald-400">
                    {inspectingAssignment.score}/100
                  </div>
                  <div className="text-[10px] font-bold text-slate-300 uppercase">
                    Grade: Distinction
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setInspectingAssignment(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Nav Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 px-6 pt-3 bg-slate-50/80">
              {[
                { id: "answers", label: "Student Submitted Solution & Code", icon: Code2 },
                { id: "ai-scan", label: "AI Writing Scan & Authenticity", icon: ShieldCheck },
                { id: "rubric", label: "Grading Rubric & Feedback", icon: Award },
              ].map((tab) => {
                const isActive = inspectModalTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setInspectModalTab(tab.id as any)}
                    className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? "border-[#2563EB] text-[#2563EB] bg-white rounded-t-xl"
                        : "border-transparent text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* TAB 1: STUDENT SUBMITTED ANSWERS & CODE */}
              {inspectModalTab === "answers" && (
                <div className="space-y-6">
                  {/* Original Assignment Prompt */}
                  <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4.5 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#2563EB] uppercase tracking-wider">
                      <HelpCircle className="h-4 w-4" /> Assignment Problem Statement
                    </div>
                    <p className="text-xs font-medium text-slate-800 leading-relaxed">
                      {inspectingAssignment.assignmentPrompt}
                    </p>
                  </div>

                  {/* Student Written Narrative */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#2563EB]" /> Executive Summary & Solution Architecture
                    </h4>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-xs text-slate-700 leading-relaxed space-y-2">
                      <p>{inspectingAssignment.studentAnswers.executiveSummary}</p>
                      <div className="pt-2 border-t border-slate-200/80">
                        <span className="font-bold text-slate-900 block mb-1">Step-by-Step Methodology:</span>
                        <p className="whitespace-pre-line text-slate-600">
                          {inspectingAssignment.studentAnswers.methodology}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Configuration Parameters Table (if applicable) */}
                  {inspectingAssignment.studentAnswers.configurationParameters && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-slate-900">Configured Enterprise Parameters</h4>
                      <div className="overflow-hidden rounded-2xl border border-slate-200">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-100 text-[11px] font-bold text-slate-600 uppercase">
                            <tr>
                              <th className="p-3">Parameter / Key</th>
                              <th className="p-3">Configured Value</th>
                              <th className="p-3">Business Purpose</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white">
                            {inspectingAssignment.studentAnswers.configurationParameters.map((p, idx) => (
                              <tr key={idx}>
                                <td className="p-3 font-bold text-slate-900">{p.parameter}</td>
                                <td className="p-3 font-mono text-[#2563EB]">{p.configuredValue}</td>
                                <td className="p-3 text-slate-600">{p.purpose}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Submitted Code Solution */}
                  {inspectingAssignment.studentAnswers.codeSolution && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                          <FileCode className="h-4 w-4 text-[#2563EB]" />
                          <span>Submitted Source: {inspectingAssignment.studentAnswers.codeSolution.filename}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(inspectingAssignment.studentAnswers.codeSolution!.code)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          <span>{copiedCode ? "Copied!" : "Copy Code"}</span>
                        </button>
                      </div>

                      <div className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs font-mono text-emerald-400 shadow-inner">
                        <pre className="whitespace-pre">
                          {inspectingAssignment.studentAnswers.codeSolution.code}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Attached Files List */}
                  {inspectingAssignment.studentAnswers.submittedFiles && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-xs font-bold text-slate-500">Verified Submission Artifacts:</span>
                      {inspectingAssignment.studentAnswers.submittedFiles.map((file, i) => (
                        <span
                          key={i}
                          className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 border border-slate-200"
                        >
                          📎 {file}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: AI SCAN & AUTHENTICITY AUDIT */}
              {inspectModalTab === "ai-scan" && (
                <div className="space-y-6">
                  {/* Verdict Banner */}
                  <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md">
                        <ShieldCheck className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-emerald-900">
                          {inspectingAssignment.aiAnalysis.verdict}
                        </div>
                        <div className="text-xs text-emerald-700">
                          Confidence Score: {inspectingAssignment.aiAnalysis.confidenceScore}% (Scanned {inspectingAssignment.aiAnalysis.tokenCount} tokens)
                        </div>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-extrabold text-white">
                      PASSED AUDIT
                    </span>
                  </div>

                  {/* Dual Ratio Bar */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Linguistic Authorship Breakdown
                    </h4>
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-emerald-700 flex items-center gap-1.5">
                        <User className="h-4 w-4" /> Human Written Content: {inspectingAssignment.aiAnalysis.humanScore}%
                      </span>
                      <span className="text-indigo-600 flex items-center gap-1.5">
                        <Bot className="h-4 w-4" /> AI Generated / Paraphrased: {inspectingAssignment.aiAnalysis.aiScore}%
                      </span>
                    </div>

                    <div className="flex h-4 w-full rounded-full overflow-hidden bg-slate-100">
                      <div
                        className="bg-emerald-500 transition-all duration-500"
                        style={{ width: `${inspectingAssignment.aiAnalysis.humanScore}%` }}
                      />
                      <div
                        className="bg-indigo-500 transition-all duration-500"
                        style={{ width: `${inspectingAssignment.aiAnalysis.aiScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Telemetry Metrics Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                      <span className="text-[11px] font-bold text-slate-400 uppercase">Plagiarism Index</span>
                      <div className="mt-1 text-xl font-extrabold text-slate-900">
                        {inspectingAssignment.aiAnalysis.plagiarismRate}%
                      </div>
                      <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Industry Standard &lt; 5%</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                      <span className="text-[11px] font-bold text-slate-400 uppercase">Syntactic Variance</span>
                      <div className="mt-1 text-xl font-extrabold text-[#2563EB]">
                        {inspectingAssignment.aiAnalysis.syntacticComplexity}
                      </div>
                      <p className="text-[10px] text-slate-500 font-semibold mt-0.5">High Burstiness & Depth</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                      <span className="text-[11px] font-bold text-slate-400 uppercase">Detector Confidence</span>
                      <div className="mt-1 text-xl font-extrabold text-emerald-600">
                        {inspectingAssignment.aiAnalysis.confidenceScore}%
                      </div>
                      <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Dual-Engine Verification</p>
                    </div>
                  </div>

                  {/* Bullet Findings */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Detailed Telemetry Audit Findings
                    </h4>
                    <ul className="space-y-2 pt-1">
                      {inspectingAssignment.aiAnalysis.keyFindings.map((finding, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 3: RUBRIC BREAKDOWN & FEEDBACK */}
              {inspectModalTab === "rubric" && (
                <div className="space-y-6">
                  <div className="overflow-hidden rounded-2xl border border-slate-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-[11px] font-bold text-slate-600 uppercase">
                        <tr>
                          <th className="p-3.5">Evaluation Criteria</th>
                          <th className="p-3.5">Max Score</th>
                          <th className="p-3.5">Awarded</th>
                          <th className="p-3.5">Instructor Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {inspectingAssignment.rubricBreakdown.map((item, idx) => (
                          <tr key={idx}>
                            <td className="p-3.5 font-bold text-slate-900">{item.criteria}</td>
                            <td className="p-3.5 text-slate-500">{item.maxScore} pts</td>
                            <td className="p-3.5 font-black text-[#2563EB]">{item.awardedScore} pts</td>
                            <td className="p-3.5 text-slate-600">{item.feedback}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary Feedback Box */}
                  <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-5 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#2563EB]">
                      <Sparkles className="h-4 w-4" /> Evaluator Final Assessment
                    </div>
                    <p className="text-xs font-medium text-slate-800 leading-relaxed">
                      {inspectingAssignment.feedback}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
              <span className="text-xs font-medium text-slate-500">
                JKS Academic Verification Ledger • Signature Valid
              </span>
              <button
                type="button"
                onClick={() => setInspectingAssignment(null)}
                className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: QUIZ / TEST ANSWER BREAKDOWN AUDIT                               */}
      {/* ========================================================================= */}
      {inspectingQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative flex flex-col max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-[28px] border border-white/90 bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-gradient-to-r from-slate-950 via-slate-900 to-[#1E3A8A] px-6 py-5 text-white">
              <div>
                <span className="text-xs text-blue-300 font-bold">{inspectingQuiz.category}</span>
                <h3 className="text-lg font-black text-white">{inspectingQuiz.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectingQuiz(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-blue-50 border border-blue-100 text-xs">
                <span className="font-bold text-slate-700">
                  Total Questions: {inspectingQuiz.totalQuestions} • Correct: {inspectingQuiz.correctAnswers}
                </span>
                <span className="text-lg font-black text-[#2563EB]">{inspectingQuiz.score}% Accuracy</span>
              </div>

              {inspectingQuiz.questionsList && inspectingQuiz.questionsList.length > 0 ? (
                inspectingQuiz.questionsList.map((q) => (
                  <div key={q.qNumber} className="rounded-2xl border border-slate-200 bg-white p-4.5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-xs font-extrabold text-slate-900">
                        Q{q.qNumber}. {q.question}
                      </span>
                      {q.isCorrect ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <CheckCircle className="h-3.5 w-3.5" /> Correct
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                          <XCircle className="h-3.5 w-3.5" /> Incorrect
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5 text-xs">
                      {q.options.map((opt, i) => {
                        const isStudentChoice = opt === q.studentAnswer;
                        const isCorrectChoice = opt === q.correctAnswer;
                        return (
                          <div
                            key={i}
                            className={`rounded-xl p-2.5 border font-medium ${
                              isCorrectChoice
                                ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-bold"
                                : isStudentChoice && !q.isCorrect
                                ? "bg-rose-50 border-rose-300 text-rose-900"
                                : "bg-slate-50/60 border-slate-200 text-slate-700"
                            }`}
                          >
                            {opt} {isStudentChoice && "(Student Selection)"} {isCorrectChoice && "✓"}
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-1 text-[11px] text-slate-500">
                      <span className="font-bold text-slate-700">Explanation: </span>
                      <span>{q.explanation}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-slate-500">
                  Detailed question telemetry recorded on grading ledger. (Total score: {inspectingQuiz.score}%)
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 flex justify-end">
              <button
                type="button"
                onClick={() => setInspectingQuiz(null)}
                className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
