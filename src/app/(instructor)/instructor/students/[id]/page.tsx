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
  MessageSquare,
  Radio,
  Video,
} from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { TiltCard } from "@/components/interactions/tilt-card";
import { Reveal } from "@/lib/motion/reveal";
import {
  getStudentProfile,
  StudentAssignmentSubmission,
  StudentCourseProgress,
  StudentQuizResult,
  DetailedStudentProfile,
} from "@/lib/data/admin-student-details";

export default function InstructorStudentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const studentSlug = (params?.id as string) || "priya-nair";
  const student: DetailedStudentProfile = useMemo(() => getStudentProfile(studentSlug), [studentSlug]);

  const [activeTab, setActiveTab] = useState<
    "courses" | "assignments" | "overview" | "quizzes" | "certificates" | "guidance" | "timeline"
  >("courses");

  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string | "all">("all");
  const [assignmentFilter, setAssignmentFilter] = useState<"all" | "high-human" | "ai-assisted">("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal inspection states
  const [inspectingAssignment, setInspectingAssignment] = useState<StudentAssignmentSubmission | null>(null);
  const [inspectingQuiz, setInspectingQuiz] = useState<StudentQuizResult | null>(null);
  const [inspectModalTab, setInspectModalTab] = useState<"answers" | "ai-scan" | "rubric">("answers");
  const [copiedCode, setCopiedCode] = useState(false);

  // Guidance state
  const [guidanceText, setGuidanceText] = useState("");
  const [guidanceSent, setGuidanceSent] = useState(false);

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

  const handleSelectCourseDrilldown = (courseTitle: string) => {
    setSelectedCourseFilter(courseTitle);
    setActiveTab("assignments");
    showToast(`Filtering assignments & AI authenticity scan for: ${courseTitle}`);
  };

  const handleSendGuidance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guidanceText.trim()) return;
    setGuidanceSent(true);
    showToast(`Personalized faculty advice dispatched to ${student.name}!`);
    setTimeout(() => {
      setGuidanceSent(false);
      setGuidanceText("");
    }, 1500);
  };

  const filteredAssignments = useMemo(() => {
    let list = student.assignments;
    if (selectedCourseFilter !== "all") {
      list = list.filter((a: StudentAssignmentSubmission) => a.courseTitle === selectedCourseFilter);
    }
    if (assignmentFilter === "high-human") {
      list = list.filter((a: StudentAssignmentSubmission) => a.aiAnalysis.humanScore >= 90);
    } else if (assignmentFilter === "ai-assisted") {
      list = list.filter((a: StudentAssignmentSubmission) => a.aiAnalysis.aiScore > 10);
    }
    return list;
  }, [student.assignments, selectedCourseFilter, assignmentFilter]);

  return (
    <>
      <DashboardTopbar
        title={`Student Dossier — ${student.name}`}
        subtitle="Faculty diagnostic report, AI authenticity scan, code solutions, and academic progress."
        userInitials="RK"
      />

      <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8 lg:pt-4 max-w-7xl mx-auto w-full">
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
            href="/instructor/students"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#2563EB] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Faculty Student Roster</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => showToast("Exporting Complete Academic Dossier (PDF)...")}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              <span>Export Dossier (PDF)</span>
            </button>

            <button
              type="button"
              onClick={() => showToast(`Progress report & feedback summary emailed to ${student.email}!`)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Email Progress Report</span>
            </button>
          </div>
        </div>

        {/* Header Profile & Progress Rating Hero Card */}
        <Reveal variant="fade-up">
          <div className="relative overflow-hidden rounded-[28px] border border-white/80 bg-white/90 p-6 sm:p-7 shadow-[0_12px_40px_rgb(20,50,100,0.06)] backdrop-blur-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left Column: Avatar & Information */}
              <div className="lg:col-span-7 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="relative">
                  <div className="flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-[#2563EB] to-indigo-600 text-3xl font-black text-white shadow-xl shadow-blue-500/25">
                    {student.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </div>
                  <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 border-2 border-white text-white shadow-sm">
                    <Check className="h-4 w-4 stroke-[3]" />
                  </div>
                </div>

                <div className="space-y-2 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-black text-slate-900 leading-tight">
                      {student.name}
                    </h2>
                    <span className="rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                      {student.status}
                    </span>
                    <span className="rounded-full bg-blue-50 px-3 py-0.5 text-xs font-bold text-[#2563EB] border border-blue-200">
                      {student.tier}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4 text-[#2563EB]" />
                    <span>{student.role}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-0.5 font-medium">
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

              {/* Right Column: Faculty Diagnostic Rating Box */}
              <div className="lg:col-span-5 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/80 via-indigo-50/50 to-white p-5 shadow-inner space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                    Student Progress Rating
                  </span>
                  <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-900">
                    {student.learningPace}
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
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
                    <span className="text-2xl font-black text-slate-900">
                      {student.performanceRating}
                    </span>
                    <span className="text-xs font-bold text-slate-400">/ 5.0</span>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-black text-[#2563EB]">
                      {student.masteryScore}% Mastery
                    </div>
                    <div className="text-[10px] font-bold text-emerald-600">
                      {student.performanceTier}
                    </div>
                  </div>
                </div>

                {/* Progress Velocity Bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-600">
                    <span>Curriculum Completion Index</span>
                    <span className="text-[#2563EB]">{student.analytics.completionRate}%</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-blue-100/80 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-cyan-500 transition-all duration-500"
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
            { id: "overview", label: "Learning Analytics & Study Hours" },
            { id: "quizzes", label: `Quizzes & Tests (${student.quizzes.length})` },
            { id: "certificates", label: `Certificates (${student.certificates.length})` },
            { id: "guidance", label: "Direct Lecturer Guidance" },
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
                className={`rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-150 cursor-pointer whitespace-nowrap ${
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
        {/* TAB 1: ENROLLED COURSES                                                   */}
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
              {student.courses.map((course: StudentCourseProgress) => (
                <TiltCard key={course.courseId} className="h-full">
                  <div
                    onClick={() => handleSelectCourseDrilldown(course.courseTitle)}
                    className="group flex h-full flex-col justify-between overflow-hidden rounded-[24px] border border-white/80 bg-white/95 shadow-[0_10px_35px_rgb(20,50,100,0.07)] backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:border-blue-300 hover:-translate-y-1 cursor-pointer"
                  >
                    {/* Top Gradient Hero Banner */}
                    <div className="relative flex h-32 flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-[#1E3A8A] p-5 text-white overflow-hidden">
                      <div
                        className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{
                          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
                          backgroundSize: "16px 16px",
                        }}
                      />
                      <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-blue-500/25 blur-2xl pointer-events-none" />

                      <div className="relative z-10 flex items-center justify-between">
                        <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md border border-white/20">
                          {course.track}
                        </span>
                        <span className="rounded-full bg-blue-500/25 px-2.5 py-1 text-[10px] font-bold text-blue-200 border border-blue-400/30">
                          {course.hoursSpent} hrs logged
                        </span>
                      </div>

                      <div className="relative z-10 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                          <GraduationCap className="h-3.5 w-3.5 text-blue-400" />
                          <span className="truncate max-w-[200px]">
                            {course.instructorName || "Faculty Lead"}
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
                          {student.assignments.filter((a: StudentAssignmentSubmission) => a.courseTitle === course.courseTitle).length} Submissions
                        </span>
                      </div>
                    </div>

                    {/* Action Strip */}
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
              ))}
            </Reveal>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ASSIGNMENTS & AI AUTHENTICITY SCAN                                 */}
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
                {student.courses.map((c: StudentCourseProgress) => (
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
              {filteredAssignments.map((asg: StudentAssignmentSubmission) => (
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
                        <span>Inspect Solution & Code</span>
                      </button>
                    </div>
                  </div>

                  {/* AI vs Human Breakdown Card */}
                  <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 shadow-xs">
                          <ShieldCheck className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            AI Authenticity & Linguistic Verification
                          </div>
                          <span className="inline-block mt-0.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800">
                            {asg.aiAnalysis.verdict}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                        <span>Plagiarism: <strong className="text-slate-900">{asg.aiAnalysis.plagiarismRate}%</strong></span>
                        <span>Complexity: <strong className="text-[#2563EB]">{asg.aiAnalysis.syntacticComplexity}</strong></span>
                        <span>Confidence: <strong className="text-emerald-600">{asg.aiAnalysis.confidenceScore}%</strong></span>
                      </div>
                    </div>

                    {/* Dual Ratio Bar */}
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

                  {/* Faculty Feedback */}
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
              <div className="lg:col-span-7 rounded-[22px] border border-white/80 bg-white/90 p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Weekly Study Hours Breakdown</h3>
                    <p className="text-xs text-slate-500">Daily time spent on video lectures, assignments and code lab</p>
                  </div>
                  <span className="text-xs font-bold text-[#2563EB]">
                    {student.analytics.weeklyStudyHours.reduce((a: number, b: { day: string; hours: number }) => a + b.hours, 0).toFixed(1)} hrs this week
                  </span>
                </div>

                <div className="flex items-end justify-between gap-3 pt-4 h-44">
                  {student.analytics.weeklyStudyHours.map((d: { day: string; hours: number }) => {
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
                  {student.analytics.skillsRadar.map((skill: { skill: string; score: number }) => (
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
                      <th className="pr-0 pb-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {student.quizzes.map((qz: StudentQuizResult) => (
                      <tr key={qz.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 font-bold text-slate-900">{qz.title}</td>
                        <td className="px-4 py-3.5 text-slate-600">{qz.category}</td>
                        <td className="px-4 py-3.5 font-black text-[#2563EB]">{qz.score}%</td>
                        <td className="px-4 py-3.5 text-slate-600 font-medium">
                          {qz.correctAnswers} / {qz.totalQuestions}
                        </td>
                        <td className="px-4 py-3.5 text-slate-600">{qz.durationMinutes} mins</td>
                        <td className="px-4 py-3.5 text-slate-600">{qz.attemptDate}</td>
                        <td className="pr-0 py-3.5 text-right">
                          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                            {qz.status}
                          </span>
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
        {/* TAB 5: CERTIFICATES                                                       */}
        {/* ========================================================================= */}
        {activeTab === "certificates" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {student.certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="rounded-[22px] border border-white/80 bg-white/90 p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl flex items-start gap-4"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 shadow-xs shrink-0">
                    <Award className="h-6 w-6" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-[#2563EB]">
                        {cert.track}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600">{cert.grade}</span>
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-900">{cert.courseTitle}</h4>
                    <div className="text-xs text-slate-500 font-mono">
                      Verification ID: {cert.verificationId}
                    </div>
                    <div className="text-[11px] text-slate-400">Issued on {cert.issueDate}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: DIRECT FACULTY GUIDANCE                                            */}
        {/* ========================================================================= */}
        {activeTab === "guidance" && (
          <div className="space-y-6">
            <form onSubmit={handleSendGuidance} className="rounded-[24px] border border-white/80 bg-white/95 p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl space-y-4">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                <MessageSquare className="h-5 w-5 text-[#2563EB]" />
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Send Personalized Faculty Guidance & Action Items
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Delivered directly to {student.name}&apos;s student dashboard and registered email ({student.email}).
                  </p>
                </div>
              </div>

              <textarea
                rows={5}
                required
                value={guidanceText}
                onChange={(e) => setGuidanceText(e.target.value)}
                placeholder={`Provide strategic recommendations for ${student.name} regarding their coding assignments, microservices architecture, capstone design, or AI mock interview readiness...`}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-xs font-medium text-slate-800 outline-none focus:border-[#2563EB] focus:bg-white transition-colors"
              />

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400">Faculty Lead: Dr. Rohit Kapoor</span>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 px-6 py-2.5 text-xs font-extrabold text-white shadow-md shadow-blue-500/25 transition-all cursor-pointer"
                >
                  {guidanceSent ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 animate-bounce" /> Guidance Dispatched!
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> Dispatch Advice to {student.name}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: TIMELINE                                                           */}
        {/* ========================================================================= */}
        {activeTab === "timeline" && (
          <div className="rounded-[24px] border border-white/80 bg-white/95 p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Chronological Academic Activity Log
            </h3>
            <div className="space-y-4 pt-2">
              {student.timeline.map((log) => (
                <div key={log.id} className="flex items-start gap-3.5">
                  <div className="mt-1 h-3 w-3 rounded-full bg-[#2563EB] ring-4 ring-blue-100 shrink-0" />
                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-900">{log.title}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{log.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600">{log.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* SOLUTION & CODE INSPECTOR MODAL                                           */}
      {/* ========================================================================= */}
      {inspectingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 sm:p-6 backdrop-blur-sm overflow-y-auto">
          <div className="relative flex w-full max-w-4xl flex-col rounded-[28px] border border-white/80 bg-white shadow-2xl overflow-hidden max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-900 px-6 py-4 text-white">
              <div className="flex items-center gap-2.5">
                <Code2 className="h-5 w-5 text-blue-400" />
                <div>
                  <h3 className="text-sm font-bold">{inspectingAssignment.title}</h3>
                  <p className="text-xs text-slate-400">{inspectingAssignment.courseTitle}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectingAssignment(null)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-100px)]">
              {/* Executive Summary */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase">
                  Executive Architecture Blueprint
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {inspectingAssignment.studentAnswers.executiveSummary}
                </p>
              </div>

              {/* Methodology */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase">
                  Implementation Methodology
                </span>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                  {inspectingAssignment.studentAnswers.methodology}
                </p>
              </div>

              {/* Code Solution */}
              {inspectingAssignment.studentAnswers.codeSolution && (
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-slate-100 text-xs font-mono space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-blue-400 font-bold">
                      {inspectingAssignment.studentAnswers.codeSolution.filename}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyCode(
                          inspectingAssignment.studentAnswers.codeSolution?.code || ""
                        )
                      }
                      className="flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-[10px] text-slate-300 hover:bg-slate-700 cursor-pointer"
                    >
                      <Copy className="h-3 w-3" />
                      <span>{copiedCode ? "Copied!" : "Copy Code"}</span>
                    </button>
                  </div>
                  <pre className="text-xs text-emerald-300 overflow-x-auto">
                    {inspectingAssignment.studentAnswers.codeSolution.code}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
