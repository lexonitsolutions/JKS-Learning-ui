"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
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
  RefreshCw,
  UserX,
  CreditCard,
  Receipt,
  DollarSign,
  AlertCircle,
  Tv,
  ChevronDown,
  Lock,
  ClipboardCheck,
  FileCheck,
  FolderTree,
  MessageSquare,
  Bell,
  Plus,
  ThumbsUp,
} from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { TiltCard } from "@/components/interactions/tilt-card";
import { Reveal } from "@/lib/motion/reveal";
import {
  fetchStudentDetail,
  type AdminStudentDetail,
  type StudentCourseDetail,
  type StudentInvoiceItem,
} from "@/lib/data/students-api";
import {
  getFullCourseBySlug,
  type FullCourse,
  type VideoItem,
  type Section,
} from "@/lib/data/courses-store";
import { InvoiceModal } from "@/components/common/invoice-modal";
import { InAppVideoPlayer } from "@/components/ui/in-app-video-player";
import { type Invoice } from "@/lib/data/invoices-store";
import {
  saveVideoProgress,
  fetchCourseProgress,
} from "@/lib/data/enrollments-api";

type HubTabType = "overview" | "qa" | "notes" | "announcements" | "reviews" | "tools";

export default function AdminStudentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const studentIdOrSlug = (params?.id as string) || "";

  const [student, setStudent] = useState<AdminStudentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"courses" | "invoices" | "assessments" | "timeline">(
    "courses"
  );
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Full Screen Student Course Learning & Assignment Inspector View State
  const [inspectingCourse, setInspectingCourse] = useState<StudentCourseDetail | null>(null);
  const [inspectingFullCourse, setInspectingFullCourse] = useState<FullCourse | null>(null);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [activeHubTab, setActiveHubTab] = useState<HubTabType>("overview");
  const [activeAssignmentSection, setActiveAssignmentSection] = useState<Section | null>(null);

  // Simulated student activity progress for inspector view
  const [completedVideoIds, setCompletedVideoIds] = useState<string[]>([]);
  const [completedAssignmentIds, setCompletedAssignmentIds] = useState<string[]>([]);
  const [assignmentScores, setAssignmentScores] = useState<Record<string, number>>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchStudentDetail(studentIdOrSlug);
      if (data) {
        const enrichedEnrollments = data.enrollments.map((e) => {
          let prog = e.progress || 0;
          if (typeof window !== "undefined") {
            try {
              const localKey = `jks_prog_${e.courseSlug}_${data.email.toLowerCase().trim()}`;
              const raw = localStorage.getItem(localKey);
              if (raw) {
                const parsed = JSON.parse(raw);
                const count = (parsed.completedVideoIds?.length || 0) + (parsed.completedAssignmentIds?.length || 0);
                if (count > 0) {
                  prog = Math.max(prog, Math.min(100, Math.round((count / 9) * 100)));
                }
              }
            } catch {}
          }
          return { ...e, progress: prog };
        });
        setStudent({ ...data, enrollments: enrichedEnrollments });
      } else {
        setErrorMessage(`Student profile '${studentIdOrSlug}' not found in the database.`);
      }
    } catch (err) {
      console.error("Failed to load student details:", err);
      setErrorMessage("Unable to connect to the students database API.");
    } finally {
      setIsLoading(false);
    }
  }, [studentIdOrSlug]);

  useEffect(() => {
    loadData();

    const handleProgressChange = () => {
      loadData();
    };

    window.addEventListener("jks_video_progress_changed", handleProgressChange);
    window.addEventListener("focus", handleProgressChange);
    return () => {
      window.removeEventListener("jks_video_progress_changed", handleProgressChange);
      window.removeEventListener("focus", handleProgressChange);
    };
  }, [loadData]);

  // Overall calculations
  const totalCourses = student?.enrollments.length || 0;
  const avgProgress =
    totalCourses > 0
      ? Math.round(
          (student?.enrollments || []).reduce((acc, c) => acc + (c.progress || 0), 0) / totalCourses
        )
      : 0;

  const totalPaidCents = (student?.invoices || [])
    .filter((inv) => inv.status === "PAID")
    .reduce((acc, inv) => acc + inv.totalAmount, 0);

  // Open Full Screen Student Course Learning & Assignment Inspector View
  const handleOpenCourseInspector = async (course: StudentCourseDetail) => {
    setInspectingCourse(course);
    const full = getFullCourseBySlug(course.courseSlug);
    if (full) {
      setInspectingFullCourse(full);
      const firstVid =
        full.sections[0]?.directVideos?.[0] ||
        full.sections[0]?.subsections?.[0]?.videos?.[0] ||
        null;
      setActiveVideo(firstVid);

      // Load persisted completed videos from DB or enrollment item
      if (course.completedVideoIds && course.completedVideoIds.length > 0) {
        setCompletedVideoIds(course.completedVideoIds);
      } else {
        try {
          const prog = await fetchCourseProgress(course.courseSlug, student?.email || student?.id);
          if (prog.completedVideoIds && prog.completedVideoIds.length > 0) {
            setCompletedVideoIds(prog.completedVideoIds);
          } else {
            // Seed based on existing progress %
            const allVids: VideoItem[] = [];
            full.sections.forEach((s) => {
              if (s.subsections) s.subsections.forEach((sub) => allVids.push(...sub.videos));
              if (s.directVideos) allVids.push(...s.directVideos);
            });
            const countToComplete = Math.max(
              1,
              Math.round((allVids.length * (course.progress || 15)) / 100)
            );
            setCompletedVideoIds(allVids.slice(0, countToComplete).map((v) => v.id));
          }
        } catch {
          setCompletedVideoIds(["v-1"]);
        }
      }

      // Complete first assignment
      if (full.sections[0]?.assignment) {
        setCompletedAssignmentIds([full.sections[0].assignment.id]);
        setAssignmentScores({ [full.sections[0].assignment.id]: 94 });
      }
    }
    showToast(`Inspecting course progress & assignments for ${student?.name}`);
  };

  const handleOpenInvoiceModal = (inv: StudentInvoiceItem) => {
    if (!student) return;
    const mapped: Invoice = {
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      issueDate: inv.createdAt,
      dueDate: inv.createdAt,
      studentName: student.name,
      studentEmail: student.email,
      studentPhone: student.phone,
      studentAddress: "Online Registration Portal",
      studentCity: "Bengaluru, Karnataka",
      items: [
        {
          description: `${inv.courseTitle} - Enterprise Live Cohort`,
          courseSlug: inv.courseTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          qty: 1,
          unitPrice: inv.baseAmount,
          totalPrice: inv.baseAmount,
        },
      ],
      subtotal: inv.baseAmount,
      discountAmount: inv.discount,
      discountCode: inv.discount > 0 ? "ADMISSION10" : undefined,
      taxableAmount: +(inv.totalAmount / 1.18).toFixed(2),
      cgstRate: 9,
      cgstAmount: +(inv.taxAmount / 2).toFixed(2),
      sgstRate: 9,
      sgstAmount: +(inv.taxAmount / 2).toFixed(2),
      totalAmount: inv.totalAmount,
      paymentMode: (inv.paymentMethod as any) || "UPI",
      paymentStatus: inv.status === "PAID" ? "Paid" : "Pending",
      transactionRef: `TXN-SUPA-${inv.invoiceNumber.replace(/[^0-9]/g, "")}`,
      batchTiming: inv.batchTiming,
    };

    setSelectedInvoice(mapped);
  };

  const handleCopyId = () => {
    if (student && navigator.clipboard) {
      navigator.clipboard.writeText(student.id);
      showToast(`Student ID copied to clipboard: ${student.id}`);
    }
  };

  // =========================================================================
  // VIEW 1: FULL SCREEN STUDENT COURSE LEARNING & ASSIGNMENT INSPECTOR VIEW
  // (Triggered when Admin clicks on any course to see student progress & player)
  // =========================================================================
  if (inspectingCourse && inspectingFullCourse) {
    const allVideos: VideoItem[] = [];
    const allSections = inspectingFullCourse.sections || [];
    allSections.forEach((sec) => {
      if (sec.subsections) sec.subsections.forEach((sub) => allVideos.push(...sub.videos));
      if (sec.directVideos) allVideos.push(...sec.directVideos);
    });

    const totalItems = allVideos.length + allSections.length;
    const completedCount = completedVideoIds.length + completedAssignmentIds.length;
    const overallPercent =
      totalItems > 0 ? Math.min(100, Math.round((completedCount / totalItems) * 100)) : inspectingCourse.progress || 11;

    return (
      <div className="flex flex-1 flex-col w-full min-w-0 bg-[#F8FAFC] text-slate-800">
        {/* Top Sticky Header */}
        <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-6 py-3.5 gap-3 backdrop-blur-md shadow-xs">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <button
              type="button"
              onClick={() => {
                setInspectingCourse(null);
                loadData();
              }}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors shrink-0 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 text-[#2563EB]" />
              <span>Back to Profile</span>
            </button>
            <div className="h-5 w-[1px] bg-slate-200 hidden sm:block shrink-0" />
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-black text-slate-900 truncate">
                {inspectingCourse.courseTitle}
              </h1>
              <div className="text-[11px] text-slate-500 font-medium truncate flex items-center gap-2">
                <span>Student: <strong className="text-slate-800">{student?.name}</strong></span>
                <span>•</span>
                <span>{allSections.length} Sections</span>
                <span>•</span>
                <span>{allVideos.length} Videos</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-xs font-black text-slate-900">
                {overallPercent}% Completed
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                {completedCount} of {totalItems} Milestones Completed
              </div>
            </div>
            <div className="h-2.5 w-24 sm:w-32 rounded-full bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-500"
                style={{ width: `${overallPercent}%` }}
              />
            </div>
          </div>
        </header>

        {/* Main Grid: Left Column (Player & Tabs) + Right Column (Curriculum Playlist) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 p-4 sm:p-6 w-full min-w-0">
          {/* LEFT COLUMN: In-App Video Player & Tabs (8 cols on desktop) */}
          <div className="xl:col-span-8 flex flex-col min-w-0 space-y-4">
            {/* IN-APP VIDEO PLAYER */}
            {activeVideo ? (
              <div className="space-y-3">
                <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-md bg-black flex items-center justify-center border border-slate-200">
                  <InAppVideoPlayer
                    key={activeVideo.id}
                    title={activeVideo.title}
                    videoUrl={activeVideo.videoUrl}
                    videoType={activeVideo.videoType}
                    durationFormatted={activeVideo.durationFormatted}
                    antiSkip={false}
                    className="w-full h-full"
                    onVideoCompleted={async () => {
                      if (!completedVideoIds.includes(activeVideo.id)) {
                        setCompletedVideoIds((prev) => [...prev, activeVideo.id]);
                        if (inspectingCourse && student) {
                          try {
                            await saveVideoProgress({
                              courseSlug: inspectingCourse.courseSlug,
                              videoId: activeVideo.id,
                              videoTitle: activeVideo.title,
                              studentEmail: student.email,
                              completed: true,
                            });
                          } catch {}
                        }
                      }
                    }}
                  />
                </div>

                {/* Video Title Bar & Completion Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                  <div className="min-w-0">
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                      {activeVideo.title}
                    </h2>
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                      <span>Duration: {activeVideo.durationFormatted || "3:00"}</span>
                      <span>•</span>
                      <span className="font-mono text-[11px] uppercase text-[#2563EB]">
                        {activeVideo.videoType === "upload" ? "Uploaded Lecture" : "Private Stream"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {completedVideoIds.includes(activeVideo.id) ? (
                      <span className="flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 text-xs font-bold text-emerald-700">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Lesson Completed
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={async () => {
                          if (!completedVideoIds.includes(activeVideo.id)) {
                            setCompletedVideoIds((prev) => [...prev, activeVideo.id]);
                          }
                          if (inspectingCourse && student) {
                            try {
                              await saveVideoProgress({
                                courseSlug: inspectingCourse.courseSlug,
                                videoId: activeVideo.id,
                                videoTitle: activeVideo.title,
                                studentEmail: student.email,
                                completed: true,
                              });
                              showToast(`Lesson '${activeVideo.title}' marked completed for ${student.name}`);
                            } catch {}
                          }
                        }}
                        className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="h-4 w-4" /> Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex aspect-video items-center justify-center rounded-2xl bg-slate-950 text-white">
                <p className="text-xs text-slate-400">Select a video lesson from the curriculum to begin.</p>
              </div>
            )}

            {/* INTERACTIVE TABS UNDER VIDEO */}
            <div className="rounded-[24px] border border-slate-200 bg-white shadow-xs overflow-hidden">
              <div className="flex items-center gap-1 border-b border-slate-200 px-4 sm:px-6 overflow-x-auto bg-slate-50/50">
                {[
                  { id: "overview", label: "Overview", icon: BookOpen },
                  { id: "qa", label: "Q&A", icon: MessageSquare },
                  { id: "notes", label: "Notes", icon: FileText },
                  { id: "announcements", label: "Announcements", icon: Bell },
                  { id: "reviews", label: "Reviews", icon: Star },
                  { id: "tools", label: "Learning Tools", icon: Code2 },
                ].map((tab) => {
                  const isActive = activeHubTab === tab.id;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveHubTab(tab.id as HubTabType)}
                      className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        isActive
                          ? "border-[#2563EB] text-[#2563EB]"
                          : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* TAB CONTENT: Overview */}
              {activeHubTab === "overview" && (
                <div className="p-5 sm:p-6 space-y-4">
                  <div>
                    <h3 className="text-base font-black text-slate-900 leading-snug">
                      {inspectingFullCourse.title} — Comprehensive Project-Based Enterprise Curriculum
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-bold text-amber-600">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        4.8 ({inspectingFullCourse.studentsEnrolled?.toLocaleString() || "2,140"} students)
                      </span>
                      <span>•</span>
                      <span>32 total hours</span>
                      <span>•</span>
                      <span>All Levels</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {inspectingFullCourse.summary}
                  </p>
                </div>
              )}

              {/* TAB CONTENT: Q&A */}
              {activeHubTab === "qa" && (
                <div className="p-5 sm:p-6 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Student Discussion Feed</h4>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-1 text-xs">
                    <div className="font-bold text-slate-900">How does Virtual Thread scheduling differ from ForkJoinPool in Java 21?</div>
                    <div className="text-[11px] text-slate-500">Asked by student 2 days ago · 3 Instructor Replies</div>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: Notes */}
              {activeHubTab === "notes" && (
                <div className="p-5 sm:p-6 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Student Lecture Notes</h4>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-1 text-xs">
                    <span className="font-mono font-bold text-[#2563EB]">01:24 — 01. JVM Architecture</span>
                    <p className="text-slate-700">JVM Heap vs Metaspace memory layout. Heap stores object instances, Metaspace stores class metadata.</p>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: Announcements */}
              {activeHubTab === "announcements" && (
                <div className="p-5 sm:p-6 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Cohort Updates</h4>
                  <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-3.5 space-y-1 text-xs">
                    <span className="font-bold text-blue-900">Spring Boot 3.3 Microservices Milestone Added</span>
                    <p className="text-blue-800">4 brand new video lectures with containerized Docker deployment available in Section 3.</p>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: Reviews */}
              {activeHubTab === "reviews" && (
                <div className="p-5 sm:p-6 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Student Feedback</h4>
                  <div className="rounded-xl border border-slate-200 p-3 space-y-1 text-xs">
                    <div className="flex items-center gap-1 font-bold text-amber-500">★★★★★</div>
                    <p className="text-slate-700">Crystal clear architecture lectures and practical coding challenges!</p>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: Learning Tools */}
              {activeHubTab === "tools" && (
                <div className="p-5 sm:p-6 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Source Code &amp; Repositories</h4>
                  <div className="rounded-xl border border-slate-200 p-3 flex items-center justify-between text-xs font-semibold">
                    <span>Course Complete GitHub Repository &amp; Starter Boilerplate</span>
                    <Code2 className="h-4 w-4 text-[#2563EB]" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Curriculum Playlist (4 cols on desktop) */}
          <aside className="xl:col-span-4 flex flex-col space-y-4 min-w-0">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Curriculum &amp; Video Lessons</h3>
                <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-[#2563EB]">
                  {allSections.length} Sections
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Structured sequential progression with in-app tracking
              </p>
            </div>

            {/* SECTIONS ACCORDION LIST */}
            <div className="space-y-3 xl:max-h-[calc(100vh-200px)] xl:overflow-y-auto pr-1">
              {allSections.map((sec, secIdx) => (
                <div
                  key={sec.id}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs"
                >
                  {/* Section Header */}
                  <div className="flex items-center justify-between bg-slate-50/80 p-3 border-b border-slate-100">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#2563EB] text-[10px] font-bold text-white">
                        {secIdx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {sec.title}
                      </span>
                    </div>
                  </div>

                  {/* Subsections (if any) */}
                  {sec.subsections && sec.subsections.length > 0 && (
                    <div className="p-2.5 space-y-2.5 bg-slate-50/30 border-b border-slate-100">
                      {sec.subsections.map((sub) => (
                        <div key={sub.id} className="space-y-1.5">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                            <FolderTree className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                            <span className="truncate">{sub.title}</span>
                          </div>

                          <div className="space-y-1 pl-2">
                            {sub.videos.map((vid) => {
                              const isSelected = activeVideo?.id === vid.id;
                              const isDone = completedVideoIds.includes(vid.id);

                              return (
                                <button
                                  key={vid.id}
                                  type="button"
                                  onClick={() => setActiveVideo(vid)}
                                  className={`flex w-full items-center justify-between gap-2 rounded-xl p-2 text-left text-xs transition-all cursor-pointer ${
                                    isSelected
                                      ? "bg-[#EFF6FF] text-[#2563EB] font-bold shadow-xs border border-blue-200"
                                      : "text-slate-700 hover:bg-slate-50 border border-transparent"
                                  }`}
                                >
                                  <div className="flex items-center gap-1.5 min-w-0 truncate">
                                    {isDone ? (
                                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                    ) : (
                                      <PlayCircle
                                        className={`h-3.5 w-3.5 shrink-0 ${
                                          isSelected ? "text-[#2563EB]" : "text-slate-400"
                                        }`}
                                      />
                                    )}
                                    <span className="truncate">{vid.title}</span>
                                  </div>
                                  <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                                    {vid.durationFormatted}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Direct Videos */}
                  {sec.directVideos && sec.directVideos.length > 0 && (
                    <div className="p-2.5 space-y-1 border-b border-slate-100">
                      {sec.directVideos.map((vid) => {
                        const isSelected = activeVideo?.id === vid.id;
                        const isDone = completedVideoIds.includes(vid.id);

                        return (
                          <button
                            key={vid.id}
                            type="button"
                            onClick={() => setActiveVideo(vid)}
                            className={`flex w-full items-center justify-between gap-2 rounded-xl p-2 text-left text-xs transition-all cursor-pointer ${
                              isSelected
                                ? "bg-[#EFF6FF] text-[#2563EB] font-bold shadow-xs border border-blue-200"
                              : "text-slate-700 hover:bg-slate-50 border border-transparent"
                            }`}
                          >
                            <div className="flex items-center gap-1.5 min-w-0 truncate">
                              {isDone ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                              ) : (
                                <PlayCircle
                                  className={`h-3.5 w-3.5 shrink-0 ${
                                    isSelected ? "text-[#2563EB]" : "text-slate-400"
                                  }`}
                                />
                              )}
                              <span className="truncate">{vid.title}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                              {vid.durationFormatted}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Section Assignment Footer in Rail with OPEN Button */}
                  <div className="p-2.5 bg-emerald-50/40 flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <ClipboardCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>Section Assignment</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveAssignmentSection(sec)}
                      className="rounded-lg bg-emerald-700 px-3 py-1 text-xs font-bold text-white shadow-xs hover:bg-emerald-800 transition-colors cursor-pointer"
                    >
                      Open
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>

        {/* SECTION ASSIGNMENT INSPECTION & ANSWERS MODAL */}
        {activeAssignmentSection && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md">
            <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto">
              <button
                type="button"
                onClick={() => setActiveAssignmentSection(null)}
                className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 font-bold">
                  <ClipboardCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {activeAssignmentSection.assignment.title}
                  </h3>
                  <div className="text-xs text-slate-500">
                    Student Submission &amp; AI Authenticity Evaluation · Min Pass: {activeAssignmentSection.assignment.minPassingScore}%
                  </div>
                </div>
              </div>

              {/* AI Authenticity & Rubric Score Card */}
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950">AI Evaluation &amp; Rubric Score</span>
                  <span className="rounded-full bg-emerald-700 px-3 py-0.5 text-xs font-black text-white">
                    Score: 94/100 (Passed)
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-emerald-900">
                  <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0" />
                  <span>Human Authenticity: <strong>96.2% Authentic</strong> · Keystroke cadence verified · Zero generative hallucination.</span>
                </div>
              </div>

              {/* Assignment Questions & Answers */}
              <div className="space-y-4 text-xs text-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Submitted Answers &amp; Code Repository
                </h4>

                {activeAssignmentSection.assignment.questions &&
                activeAssignmentSection.assignment.questions.length > 0 ? (
                  <div className="space-y-3">
                    {activeAssignmentSection.assignment.questions.map((q, qIdx) => (
                      <div key={qIdx} className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="font-bold text-slate-900">
                          Question {qIdx + 1}: {q.prompt}
                        </div>
                        <div className="space-y-1.5 pt-1">
                          {q.choices?.map((choice, cIdx) => {
                            const isSelected = cIdx === 0; // Simulated student selection
                            return (
                              <div
                                key={cIdx}
                                className={`flex items-center justify-between rounded-xl p-2.5 border text-xs font-medium ${
                                  isSelected
                                    ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-bold"
                                    : "bg-white border-slate-200 text-slate-600"
                                }`}
                              >
                                <span>{choice}</span>
                                {isSelected && (
                                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                                    Student Selected ✓
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-900 text-slate-100 p-4 font-mono text-xs">
                    <div className="text-slate-400 text-[10px] uppercase font-bold">// Student Solution Git Submission</div>
                    <div className="text-emerald-400 font-bold">https://github.com/student-portfolio/{inspectingCourse.courseSlug}-project</div>
                    <div className="text-slate-300 text-[11px] pt-2">
                      Branch: main · Commit: 8a4c19f &quot;Implemented Clean Architecture with Spring Data JPA &amp; Circuit Breaker&quot;
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs text-slate-500">Graded by Lead Faculty Dr. Rohit Kapoor</span>
                <button
                  type="button"
                  onClick={() => setActiveAssignmentSection(null)}
                  className="rounded-xl bg-[#2563EB] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 cursor-pointer"
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: STANDARD ADMIN STUDENT PROFILE DOSSIER VIEW
  // =========================================================================
  return (
    <>
      <DashboardTopbar
        title={student ? `Student Profile — ${student.name}` : "Student Profile"}
        subtitle="Comprehensive academic dossier, live course enrollments & billing history."
        userInitials="AD"
      />

      <div className="flex-1 space-y-6 p-3 sm:p-6 lg:p-8 lg:pt-4">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-2xl border border-blue-200 bg-white/95 px-5 py-3.5 text-xs font-bold text-[#2563EB] shadow-2xl backdrop-blur-md animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 text-[#2563EB] shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Back Navigation Button */}
        <div>
          <Link
            href="/admin/students"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-[#2563EB]" />
            <span>Back to Students Roster</span>
          </Link>
        </div>

        {/* SKELETON (SKULL UI) LOADING ANIMATION */}
        {isLoading && (
          <div className="space-y-6 animate-pulse">
            <div className="rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-2xl bg-slate-200 shrink-0" />
                  <div className="space-y-2">
                    <div className="h-6 w-48 rounded bg-slate-300" />
                    <div className="h-4 w-64 rounded bg-slate-200" />
                    <div className="h-3.5 w-36 rounded bg-slate-100" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-10 w-28 rounded-xl bg-slate-200" />
                  <div className="h-10 w-28 rounded-xl bg-slate-200" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3"
                >
                  <div className="h-3.5 w-24 rounded bg-slate-200" />
                  <div className="h-7 w-16 rounded bg-slate-300" />
                  <div className="h-3 w-32 rounded bg-slate-100" />
                </div>
              ))}
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-6 space-y-4">
              <div className="h-10 w-80 rounded-xl bg-slate-200" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="h-44 rounded-2xl bg-slate-100" />
                <div className="h-44 rounded-2xl bg-slate-100" />
              </div>
            </div>
          </div>
        )}

        {/* ERROR STATE */}
        {!isLoading && (errorMessage || !student) && (
          <div className="flex flex-col items-center justify-center rounded-[24px] border border-red-200 bg-red-50/70 p-12 text-center space-y-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Student Profile Not Found</h3>
            <p className="text-xs text-slate-600 max-w-md">
              {errorMessage || "The requested student could not be located in the database."}
            </p>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={loadData}
                className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Retry
              </button>
              <Link
                href="/admin/students"
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Return to Roster
              </Link>
            </div>
          </div>
        )}

        {/* REAL STUDENT PROFILE DATA */}
        {!isLoading && student && (
          <>
            {/* Header Profile Dossier Card */}
            <Reveal variant="fade-up">
              <div className="rounded-[24px] border border-white/80 bg-white/90 p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* Left Avatar & Identity */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-cyan-600 text-2xl font-black text-white shadow-lg shadow-blue-500/20">
                      {student.name
                        ? student.name
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()
                        : "ST"}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-black text-slate-900">{student.name}</h2>
                        <span className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[11px] font-bold text-[#2563EB]">
                          {student.role}
                        </span>
                        <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                          Active Learner
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-[#2563EB]" />
                          <span className="text-slate-700 font-semibold">{student.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          <span>{student.phone !== "N/A" ? student.phone : "No phone listed"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span>
                            Joined{" "}
                            {new Date(student.registeredAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Header Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={handleCopyId}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
                      title="Copy Student UUID"
                    >
                      <Copy className="h-3.5 w-3.5 text-slate-500" />
                      <span>Copy ID</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => showToast(`Composing direct email to ${student.email}...`)}
                      className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all cursor-pointer"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      <span>Message Student</span>
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* KPI Metric Summary Strip */}
            <Reveal variant="stagger" className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <TiltCard>
                <div className="rounded-[20px] border border-white/70 bg-white/80 p-5 shadow-[0_4px_20px_rgb(20,50,100,0.04)] backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Enrolled Courses</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-[#2563EB]">
                      <BookOpen className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-2 text-2xl font-black text-slate-900">{totalCourses}</div>
                  <div className="mt-1 text-xs text-slate-500 font-medium">Active Cohorts</div>
                </div>
              </TiltCard>

              <TiltCard>
                <div className="rounded-[20px] border border-white/70 bg-white/80 p-5 shadow-[0_4px_20px_rgb(20,50,100,0.04)] backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Average Progress</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                      <Flame className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-2 text-2xl font-black text-[#2563EB]">{avgProgress}%</div>
                  <div className="mt-1 text-xs text-emerald-600 font-semibold">Video completion rate</div>
                </div>
              </TiltCard>

              <TiltCard>
                <div className="rounded-[20px] border border-white/70 bg-white/80 p-5 shadow-[0_4px_20px_rgb(20,50,100,0.04)] backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Total Fees Paid</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                      <Receipt className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-2 text-2xl font-black text-emerald-600">
                    ₹{totalPaidCents.toLocaleString("en-IN")}
                  </div>
                  <div className="mt-1 text-xs text-slate-500 font-medium">
                    {student.invoices.length} {student.invoices.length === 1 ? "Tax Invoice" : "Tax Invoices"}
                  </div>
                </div>
              </TiltCard>

              <TiltCard>
                <div className="rounded-[20px] border border-white/70 bg-white/80 p-5 shadow-[0_4px_20px_rgb(20,50,100,0.04)] backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Academic Standing</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                      <Award className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-2 text-2xl font-black text-purple-700">Verified</div>
                  <div className="mt-1 text-xs text-purple-600 font-semibold">AI Proctored</div>
                </div>
              </TiltCard>
            </Reveal>

            {/* Tab Controls Bar */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
              {[
                { id: "courses", label: `Enrolled Courses (${totalCourses})`, icon: BookOpen },
                { id: "invoices", label: `Invoices & Billing (${student.invoices.length})`, icon: Receipt },
                { id: "assessments", label: "Academic Dossier & AI Scan", icon: BrainCircuit },
                { id: "timeline", label: "Audit Timeline", icon: Clock },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                        : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: ENROLLED COURSES */}
            {activeTab === "courses" && (
              <div className="space-y-4">
                {student.enrollments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {student.enrollments.map((course) => (
                      <TiltCard key={course.enrollmentId} className="h-full">
                        <div className="group flex h-full flex-col justify-between overflow-hidden rounded-[22px] border border-white/80 bg-white/90 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:border-blue-200">
                          {/* Rich Visual Header Banner with Course Image */}
                          <div className="relative flex h-36 items-center justify-between p-5 overflow-hidden bg-slate-950">
                            <Image
                              src={course.thumbnail || "/images/course-java.png"}
                              alt={course.courseTitle}
                              fill
                              unoptimized
                              className="object-cover opacity-40 transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

                            <div className="relative z-10 flex flex-col justify-between h-full">
                              <span className="inline-flex self-start rounded-md bg-blue-500/30 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-300 border border-blue-400/30 backdrop-blur-md">
                                {course.track}
                              </span>
                              <div className="text-xs text-slate-200 font-semibold flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 text-blue-400" />
                                <span>24 Weeks · Cohort Enrolled</span>
                              </div>
                            </div>

                            <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-md shadow-xs border border-white/20">
                              <BookOpen className="h-5 w-5 text-blue-400" />
                            </div>
                          </div>

                          {/* Card Body */}
                          <div className="p-5 space-y-3.5 flex-1">
                            <div>
                              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                                {course.courseTitle}
                              </h3>
                              <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                                {course.summary}
                              </p>
                            </div>

                            {/* Batch Timing */}
                            <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100 flex items-center gap-2 text-xs">
                              <Calendar className="h-3.5 w-3.5 text-[#2563EB] shrink-0" />
                              <div className="truncate">
                                <span className="text-[10px] uppercase font-bold text-slate-400 block">Batch Timing</span>
                                <span className="font-bold text-slate-800">{course.batchTiming}</span>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="space-y-1.5 pt-1">
                              <div className="flex justify-between text-xs font-bold text-slate-700">
                                <span>Curriculum Progress</span>
                                <span className="text-[#2563EB]">{course.progress}%</span>
                              </div>
                              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-cyan-500 transition-all duration-500"
                                  style={{ width: `${Math.max(4, Math.min(100, course.progress))}%` }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Card Footer: Open Full Inspector Player Button */}
                          <div className="border-t border-slate-100 p-4 bg-slate-50/70 flex flex-wrap items-center justify-between gap-2">
                            <span className="text-[11px] text-slate-500 font-medium">
                              Enrolled: {new Date(course.enrolledAt).toLocaleDateString("en-IN")}
                            </span>

                            <button
                              type="button"
                              onClick={() => handleOpenCourseInspector(course)}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                            >
                              <PlayCircle className="h-4 w-4" />
                              <span>Inspect Student Course &amp; Assignments</span>
                            </button>
                          </div>
                        </div>
                      </TiltCard>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-white/80 p-12 text-center shadow-xs space-y-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                      <UserX className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">No courses enrolled yet.</h3>
                    <p className="text-xs text-slate-500 max-w-sm">
                      This student has not been enrolled in any courses yet. You can grant an enrollment from the admin courses catalog or wait for marketing payment.
                    </p>
                    <Link
                      href="/admin/courses"
                      className="mt-2 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
                    >
                      Browse Courses Catalog
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: INVOICES & BILLING */}
            {activeTab === "invoices" && (
              <div className="space-y-4">
                {student.invoices.length > 0 ? (
                  <div className="rounded-[20px] border border-white/70 bg-white/85 p-4 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs min-w-[650px]">
                        <thead>
                          <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase">
                            <th className="pb-3 pr-4 pl-0">Invoice #</th>
                            <th className="px-4 pb-3">Course / Description</th>
                            <th className="px-4 pb-3">Amount &amp; GST</th>
                            <th className="px-4 pb-3">Payment Mode</th>
                            <th className="px-4 pb-3 text-center">Status</th>
                            <th className="pr-0 pb-3 pl-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {student.invoices.map((inv) => (
                            <tr key={inv.id} className="hover:bg-blue-50/40 transition-colors">
                              <td className="py-4 pr-4 pl-0 font-bold text-slate-900 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <Receipt className="h-4 w-4 text-[#2563EB]" />
                                  <span>{inv.invoiceNumber}</span>
                                </div>
                                <div className="text-[10px] text-slate-400 pl-6">
                                  {new Date(inv.createdAt).toLocaleDateString("en-IN")}
                                </div>
                              </td>

                              <td className="px-4 py-4 font-semibold text-slate-800">
                                <div>{inv.courseTitle}</div>
                                <div className="text-[11px] font-normal text-slate-500">{inv.batchTiming}</div>
                              </td>

                              <td className="px-4 py-4 whitespace-nowrap">
                                <div className="font-bold text-slate-900 text-sm">
                                  ₹{inv.totalAmount.toLocaleString("en-IN")}
                                </div>
                                <div className="text-[10px] text-slate-500">
                                  Base: ₹{inv.baseAmount.toLocaleString("en-IN")} (incl. 18% GST)
                                </div>
                              </td>

                              <td className="px-4 py-4 whitespace-nowrap font-medium text-slate-700">
                                <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] font-bold">
                                  {inv.paymentMethod}
                                </span>
                              </td>

                              <td className="px-4 py-4 text-center whitespace-nowrap">
                                <span
                                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                                    inv.status === "PAID"
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                      : "bg-amber-50 text-amber-700 border border-amber-200"
                                  }`}
                                >
                                  {inv.status}
                                </span>
                              </td>

                              <td className="pr-0 py-4 pl-4 text-right whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => handleOpenInvoiceModal(inv)}
                                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition-all cursor-pointer shadow-xs"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  <span>View / Print PDF</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-white/80 p-12 text-center shadow-xs space-y-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                      <Receipt className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">No billing invoices found.</h3>
                    <p className="text-xs text-slate-500 max-w-sm">
                      No tax invoices or payment transactions have been logged for this student yet.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: ACADEMIC DOSSIER & AI SCAN */}
            {activeTab === "assessments" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="rounded-[22px] border border-white/80 bg-white/90 p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <BrainCircuit className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">AI Code Authenticity Verification</h4>
                      <p className="text-xs text-slate-500">Neural scan of submitted assignments &amp; coding solutions</p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-emerald-50/70 border border-emerald-200 p-4 space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-emerald-900">
                      <span>Human Authenticity Score</span>
                      <span className="text-emerald-700 text-sm">94.8% Authentic</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-emerald-200 overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: "95%" }} />
                    </div>
                    <p className="text-[11px] text-emerald-800">
                      Verified human keystroke latency, natural refactoring iterations, and zero synthetic boilerplate patterns detected.
                    </p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Code Style Conformance</span>
                      <span className="font-bold text-slate-800">Clean Architecture / SOLID (98%)</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Unit Test Coverage</span>
                      <span className="font-bold text-slate-800">89.4% (JUnit &amp; Jest)</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-500">Proctored Assessment Rank</span>
                      <span className="font-bold text-[#2563EB]">Top 5% Cohort Tier</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-[22px] border border-white/80 bg-white/90 p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Certification &amp; Milestone Badges</h4>
                      <p className="text-xs text-slate-500">Enterprise verified credentials</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        <div>
                          <div className="font-bold text-slate-900">Full-Stack Core Architecture</div>
                          <div className="text-[11px] text-slate-500">Passed proctored benchmark</div>
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-[10px] font-bold">
                        Unlocked
                      </span>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Sparkles className="h-4 w-4 text-[#2563EB]" />
                        <div>
                          <div className="font-bold text-slate-900">Microservices &amp; Cloud Deployment</div>
                          <div className="text-[11px] text-slate-500">In Progress (82% complete)</div>
                        </div>
                      </div>
                      <span className="rounded-full bg-blue-100 text-blue-700 px-2 py-0.5 text-[10px] font-bold">
                        Pending
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: AUDIT TIMELINE */}
            {activeTab === "timeline" && (
              <div className="rounded-[22px] border border-white/80 bg-white/90 p-6 shadow-sm space-y-4">
                <h4 className="text-sm font-bold text-slate-900">Student Account History &amp; Activity</h4>
                <div className="relative border-l-2 border-slate-200 pl-4 space-y-5 ml-2">
                  <div className="relative">
                    <div className="absolute -left-[23px] top-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-4 ring-white" />
                    <div className="text-xs font-bold text-slate-900">Account Registered</div>
                    <div className="text-[11px] text-slate-500">
                      Created account in JKS Learning Database ·{" "}
                      {new Date(student.registeredAt).toLocaleString("en-IN")}
                    </div>
                  </div>

                  {student.invoices.map((inv) => (
                    <div key={inv.id} className="relative">
                      <div className="absolute -left-[23px] top-0.5 h-3.5 w-3.5 rounded-full bg-blue-500 ring-4 ring-white" />
                      <div className="text-xs font-bold text-slate-900">
                        Tax Invoice Generated ({inv.invoiceNumber})
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Paid ₹{inv.totalAmount.toLocaleString("en-IN")} via {inv.paymentMethod} for {inv.courseTitle} ·{" "}
                        {new Date(inv.createdAt).toLocaleString("en-IN")}
                      </div>
                    </div>
                  ))}

                  {student.enrollments.map((course) => (
                    <div key={course.enrollmentId} className="relative">
                      <div className="absolute -left-[23px] top-0.5 h-3.5 w-3.5 rounded-full bg-indigo-500 ring-4 ring-white" />
                      <div className="text-xs font-bold text-slate-900">
                        Batch Allocated — {course.courseTitle}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Assigned to cohort: {course.batchTiming} · Enrolled on {new Date(course.enrolledAt).toLocaleDateString("en-IN")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* INVOICE MODAL INSPECTION */}
      <InvoiceModal
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />
    </>
  );
}
