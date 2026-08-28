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
} from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { TiltCard } from "@/components/interactions/tilt-card";
import { Reveal } from "@/lib/motion/reveal";
import { getStudentProfile } from "@/lib/data/admin-student-details";

export default function AdminStudentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const studentSlug = (params?.id as string) || "priya-nair";
  const student = useMemo(() => getStudentProfile(studentSlug), [studentSlug]);

  const [activeTab, setActiveTab] = useState<
    "overview" | "courses" | "assignments" | "quizzes" | "certificates" | "timeline"
  >("overview");

  const [assignmentFilter, setAssignmentFilter] = useState<"all" | "high-human" | "ai-assisted">("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredAssignments = useMemo(() => {
    if (assignmentFilter === "high-human") {
      return student.assignments.filter((a) => a.aiAnalysis.humanScore >= 90);
    }
    if (assignmentFilter === "ai-assisted") {
      return student.assignments.filter((a) => a.aiAnalysis.aiScore > 10);
    }
    return student.assignments;
  }, [student.assignments, assignmentFilter]);

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
          <div className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-3.5 text-xs font-bold text-[#2563EB] shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-4">
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
            { id: "overview", label: "Overview & Analytics" },
            { id: "courses", label: `Enrolled Courses (${student.courses.length})` },
            { id: "assignments", label: `Assignments & AI Scan (${student.assignments.length})` },
            { id: "quizzes", label: `Quizzes & Tests (${student.quizzes.length})` },
            { id: "certificates", label: `Certificates (${student.certificates.length})` },
            { id: "timeline", label: "Activity Timeline" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
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

        {/* TAB CONTENT 1: OVERVIEW & LEARNING ANALYTICS */}
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

        {/* TAB CONTENT 2: ENROLLED COURSES */}
        {activeTab === "courses" && (
          <div className="space-y-4">
            <Reveal variant="stagger" className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {student.courses.map((c) => (
                <TiltCard key={c.courseId} className="h-full">
                  <div className="flex h-full flex-col justify-between rounded-[22px] border border-white/80 bg-white/90 p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="rounded-md bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-[#2563EB] border border-blue-200">
                          {c.track}
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          {c.hoursSpent} hrs logged
                        </span>
                      </div>

                      <h4 className="text-base font-extrabold text-slate-900 leading-snug">
                        {c.courseTitle}
                      </h4>

                      <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                        <span>{c.completedLessons} of {c.totalLessons} lessons completed</span>
                        <span className="font-extrabold text-slate-900">{c.grade}</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-500">Course Progress</span>
                          <span className="text-[#2563EB]">{c.progress}%</span>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-cyan-500 transition-all duration-500"
                            style={{ width: `${c.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Last active: {c.lastActive}</span>
                      {c.certificateEarned ? (
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Certificate Issued
                        </span>
                      ) : (
                        <span className="text-slate-500 font-medium">In Progress</span>
                      )}
                    </div>
                  </div>
                </TiltCard>
              ))}
            </Reveal>
          </div>
        )}

        {/* TAB CONTENT 3: ASSIGNMENT SUBMISSIONS & AI WRITING ANALYSIS */}
        {activeTab === "assignments" && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex items-center justify-between bg-white/80 p-3 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600 pl-2">Filter Analysis:</span>
                {[
                  { id: "all", label: "All Submissions" },
                  { id: "high-human", label: "Authentic Human (≥90%)" },
                  { id: "ai-assisted", label: "AI Assisted (>10%)" },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setAssignmentFilter(f.id as any)}
                    className={`rounded-lg px-3 py-1 text-xs font-bold transition-colors cursor-pointer ${
                      assignmentFilter === f.id
                        ? "bg-[#2563EB] text-white shadow-xs"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <span className="text-xs text-slate-400 pr-2">
                Powered by JKS AI Authenticity Engine
              </span>
            </div>

            {/* Assignments List */}
            <div className="space-y-4">
              {filteredAssignments.map((asg) => (
                <div
                  key={asg.id}
                  className="rounded-[22px] border border-white/80 bg-white/90 p-5 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl space-y-4"
                >
                  {/* Top Row: Title, Course, Grade & Submission Date */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-[#2563EB]">
                          {asg.courseTitle}
                        </span>
                        <span className="text-xs text-slate-400">Submitted: {asg.submittedAt}</span>
                      </div>
                      <h4 className="mt-1 text-base font-extrabold text-slate-900">{asg.title}</h4>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-lg font-black text-slate-900">{asg.score}/100</div>
                        <div className="text-[10px] font-bold text-emerald-600 uppercase">
                          {asg.status}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI vs Human Writing Analysis Breakdown Card */}
                  <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                          <ShieldCheck className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900">
                            AI Writing Authenticity Check
                          </span>
                          <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800">
                            {asg.aiAnalysis.verdict}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                        <span>Plagiarism: <strong className="text-slate-900">{asg.aiAnalysis.plagiarismRate}%</strong></span>
                        <span>Complexity: <strong className="text-[#2563EB]">{asg.aiAnalysis.syntacticComplexity}</strong></span>
                      </div>
                    </div>

                    {/* Dual Color AI vs Human Ratio Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-emerald-700 flex items-center gap-1">
                          <User className="h-3.5 w-3.5" /> Human Authored: {asg.aiAnalysis.humanScore}%
                        </span>
                        <span className="text-indigo-600 flex items-center gap-1">
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

                    {/* Key Verification Findings */}
                    <div className="space-y-1 pt-1">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Key Detector Findings
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

                  {/* Instructor Feedback */}
                  <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3 text-xs text-slate-700">
                    <span className="font-bold text-[#2563EB]">Lead Trainer Feedback: </span>
                    <span>{asg.feedback}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB CONTENT 4: QUIZZES & ASSESSMENTS */}
        {activeTab === "quizzes" && (
          <div className="space-y-4">
            <div className="rounded-[22px] border border-white/80 bg-white/90 p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[600px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase text-slate-400">
                      <th className="pb-3">Assessment Title</th>
                      <th className="px-4 pb-3">Category</th>
                      <th className="px-4 pb-3">Score</th>
                      <th className="px-4 pb-3">Accuracy</th>
                      <th className="px-4 pb-3">Duration</th>
                      <th className="px-4 pb-3">Date</th>
                      <th className="pr-0 pb-3 text-right">Result</th>
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
                        <td className="pr-0 py-3.5 text-right font-bold text-emerald-600">
                          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-700">
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

        {/* TAB CONTENT 5: CERTIFICATES EARNED */}
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
                        className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800"
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

        {/* TAB CONTENT 6: ACTIVITY TIMELINE */}
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
    </>
  );
}
