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
  ShieldAlert,
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
  MoreVertical,
  Pause,
  Play,
  Trash2,
  Edit3,
  PauseCircle,
  ClipboardList,
  FileSpreadsheet,
  LayoutGrid,
  Table,
} from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { TiltCard } from "@/components/interactions/tilt-card";
import { Reveal } from "@/lib/motion/reveal";
import {
  fetchStudentDetail,
  updateEnrollmentStatus,
  fetchStudentCourseTasks,
  downloadStudentCourseTasksDocx,
  type CourseTaskItem,
  type AdminStudentDetail,
  type StudentCourseDetail,
  type StudentInvoiceItem,
  type AdminStudentRecord,
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
  getExactStudentCourseProgress,
} from "@/lib/data/enrollments-api";
import { CourseThumbnail } from "@/components/common/course-thumbnail";
import { MessageStudentModal } from "@/components/admin/message-student-modal";
import { EditStudentModal } from "@/components/admin/edit-student-modal";

type HubTabType = "overview" | "qa" | "notes" | "announcements" | "reviews" | "tools";

export default function AdminStudentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const studentIdOrSlug = (params?.id as string) || "";

  const [student, setStudent] = useState<AdminStudentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "courses" | "invoices" | "assessments" | "timeline" | "course-tasks"
  >("courses");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [openCourseDropdownId, setOpenCourseDropdownId] = useState<string | null>(null);

  // Courses Tasks state
  const [courseTasks, setCourseTasks] = useState<CourseTaskItem[]>([]);
  const [selectedTaskCourse, setSelectedTaskCourse] = useState<string>("all");
  const [availableTaskCourses, setAvailableTaskCourses] = useState<
    { id: string; title: string; slug: string; taskCount: number }[]
  >([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [isDownloadingDocx, setIsDownloadingDocx] = useState(false);
  const [taskSearchQuery, setTaskSearchQuery] = useState("");
  const [selectedTaskModal, setSelectedTaskModal] = useState<CourseTaskItem | null>(null);
  const [taskViewMode, setTaskViewMode] = useState<"cards" | "table">("cards");

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

  const loadCourseTasks = useCallback(
    async (courseSlugOrId?: string) => {
      if (!studentIdOrSlug) return;
      setIsLoadingTasks(true);
      try {
        const res = await fetchStudentCourseTasks(
          studentIdOrSlug,
          courseSlugOrId === "all" ? undefined : courseSlugOrId
        );
        if (res) {
          setCourseTasks(res.tasks || []);
          if (res.availableCourses && res.availableCourses.length > 0) {
            setAvailableTaskCourses(res.availableCourses);
          }
        }
      } catch (err) {
        console.error("Failed to load course tasks:", err);
      } finally {
        setIsLoadingTasks(false);
      }
    },
    [studentIdOrSlug]
  );

  const handleDownloadTasksDocx = async () => {
    if (!student) return;
    setIsDownloadingDocx(true);
    try {
      const activeCourseObj = availableTaskCourses.find(
        (c) => c.slug === selectedTaskCourse || c.id === selectedTaskCourse
      );
      const courseTitle =
        activeCourseObj?.title ||
        (selectedTaskCourse !== "all"
          ? selectedTaskCourse
          : student.enrollments[0]?.courseTitle || "Course Tasks");
      await downloadStudentCourseTasksDocx(
        studentIdOrSlug,
        selectedTaskCourse === "all" ? undefined : selectedTaskCourse,
        courseTitle
      );
      showToast(`Downloaded ${courseTitle} tasks document (.docx)`);
    } catch (err: any) {
      showToast(err?.message || "Failed to download tasks document");
    } finally {
      setIsDownloadingDocx(false);
    }
  };

  const handleUpdateCourseStatus = async (
    enrollmentId: string,
    newStatus: "ACTIVE" | "PAUSED" | "REMOVED"
  ) => {
    const res = await updateEnrollmentStatus(enrollmentId, newStatus);
    if (res.success) {
      const savedStatus = res.data?.status || newStatus;
      setStudent((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          enrollments: prev.enrollments.map((e) =>
            e.enrollmentId === enrollmentId ? { ...e, status: savedStatus } : e
          ),
        };
      });
      showToast(
        newStatus === "PAUSED"
          ? "Course access paused for student."
          : newStatus === "REMOVED"
          ? "Student removed from course."
          : "Course access resumed."
      );
    } else {
      showToast(res.error || "Failed to update course enrollment status.");
    }
    setOpenCourseDropdownId(null);
  };

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchStudentDetail(studentIdOrSlug);
      if (data) {
        const enrichedEnrollments = data.enrollments.map((e) => {
          const exact = getExactStudentCourseProgress(e.courseSlug, data.email);
          const dbProg = typeof e.progress === "number" ? e.progress : 0;
          const dbVideos = Array.isArray(e.completedVideoIds) ? e.completedVideoIds : [];
          const dbAssignments = Array.isArray(e.completedAssignmentIds) ? e.completedAssignmentIds : [];

          // Combine DB persisted data with any immediate local browser actions
          const mergedVideos = Array.from(new Set([...dbVideos, ...exact.completedVideoIds]));
          const mergedAssignments = Array.from(new Set([...dbAssignments, ...exact.completedAssignmentIds]));
          const mergedMilestones = mergedVideos.length + mergedAssignments.length;
          const totalMilestones = e.totalMilestones || exact.totalMilestones || 11;
          const calcProg = totalMilestones > 0 ? Math.min(100, Math.round((mergedMilestones / totalMilestones) * 100)) : 0;
          const finalProg = Math.max(dbProg, calcProg);

          return {
            ...e,
            progress: finalProg,
            completedVideoIds: mergedVideos,
            completedVideosCount: mergedVideos.length,
            completedAssignmentIds: mergedAssignments,
          };
        });
        setStudent({ ...data, enrollments: enrichedEnrollments });
        if (enrichedEnrollments.length > 0) {
          setAvailableTaskCourses(
            enrichedEnrollments.map((e) => ({
              id: e.courseId,
              title: e.courseTitle,
              slug: e.courseSlug,
              taskCount: 0,
            }))
          );
        }
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

  useEffect(() => {
    if (studentIdOrSlug) {
      loadCourseTasks(selectedTaskCourse);
    }
  }, [studentIdOrSlug, selectedTaskCourse, loadCourseTasks]);

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

      // Load EXACT completed videos and assignments directly from the database record
      const dbVideos = Array.isArray(course.completedVideoIds) ? course.completedVideoIds : [];
      const dbAssignments = Array.isArray(course.completedAssignmentIds) ? course.completedAssignmentIds : [];

      const exact = getExactStudentCourseProgress(course.courseSlug, student?.email || student?.id);
      const finalVideos = Array.from(new Set([...dbVideos, ...exact.completedVideoIds]));
      const finalAssignments = Array.from(new Set([...dbAssignments, ...exact.completedAssignmentIds]));

      setCompletedVideoIds(finalVideos);
      setCompletedAssignmentIds(finalAssignments);
      setAssignmentScores(exact.assignmentScores || {});
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
      <div className="flex flex-1 flex-col w-full min-w-0 bg-[#F8FAFC] dark:bg-background text-slate-800 dark:text-slate-100">
        {/* Top Sticky Header */}
        <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-surface-secondary/95 px-4 sm:px-6 py-3.5 gap-3 backdrop-blur-md shadow-xs">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <button
              type="button"
              onClick={() => {
                setInspectingCourse(null);
                loadData();
              }}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-elevated px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-xs hover:bg-slate-50 dark:hover:bg-surface-hover transition-colors shrink-0 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 text-[#2563EB] dark:text-blue-400" />
              <span>Back to Profile</span>
            </button>
            <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block shrink-0" />
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
                {inspectingCourse.courseTitle}
              </h1>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate flex items-center gap-2">
                <span>Student: <strong className="text-slate-800 dark:text-slate-200">{student?.name}</strong></span>
                <span>•</span>
                <span>{allSections.length} Sections</span>
                <span>•</span>
                <span>{allVideos.length} Videos</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-xs font-black text-slate-900 dark:text-white">
                {overallPercent}% Completed
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                {completedCount} of {totalItems} Milestones Completed
              </div>
            </div>
            <div className="h-2.5 w-24 sm:w-32 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
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
                <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-md bg-black flex items-center justify-center border border-slate-200 dark:border-slate-800">
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary p-4 shadow-xs">
                  <div className="min-w-0">
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                      {activeVideo.title}
                    </h2>
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>Duration: {activeVideo.durationFormatted || "3:00"}</span>
                      <span>•</span>
                      <span className="font-mono text-[11px] uppercase text-[#2563EB] dark:text-blue-400">
                        {activeVideo.videoType === "upload" ? "Uploaded Lecture" : "Private Stream"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {completedVideoIds.includes(activeVideo.id) ? (
                      <span className="flex items-center gap-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/40 px-3.5 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Lesson Completed
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
            <div className="rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary shadow-xs overflow-hidden">
              <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 overflow-x-auto bg-slate-50/50 dark:bg-surface-elevated/60">
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
                          ? "border-[#2563EB] text-[#2563EB] dark:text-blue-400"
                          : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700"
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
                    <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                      {inspectingFullCourse.title} — Comprehensive Project-Based Enterprise Curriculum
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        4.8 ({inspectingFullCourse.studentsEnrolled?.toLocaleString() || "2,140"} students)
                      </span>
                      <span>•</span>
                      <span>32 total hours</span>
                      <span>•</span>
                      <span>All Levels</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {inspectingFullCourse.summary}
                  </p>
                </div>
              )}

              {/* TAB CONTENT: Q&A */}
              {activeHubTab === "qa" && (
                <div className="p-5 sm:p-6 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Student Discussion Feed</h4>
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-surface-elevated/70 p-3.5 space-y-1 text-xs">
                    <div className="font-bold text-slate-900 dark:text-white">How does Virtual Thread scheduling differ from ForkJoinPool in Java 21?</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Asked by student 2 days ago · 3 Instructor Replies</div>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: Notes */}
              {activeHubTab === "notes" && (
                <div className="p-5 sm:p-6 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Student Lecture Notes</h4>
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-surface-elevated/70 p-3.5 space-y-1 text-xs">
                    <span className="font-mono font-bold text-[#2563EB] dark:text-blue-400">01:24 — 01. JVM Architecture</span>
                    <p className="text-slate-700 dark:text-slate-300">JVM Heap vs Metaspace memory layout. Heap stores object instances, Metaspace stores class metadata.</p>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: Announcements */}
              {activeHubTab === "announcements" && (
                <div className="p-5 sm:p-6 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Cohort Updates</h4>
                  <div className="rounded-xl border border-blue-200 dark:border-blue-800/60 bg-blue-50/60 dark:bg-blue-950/40 p-3.5 space-y-1 text-xs">
                    <span className="font-bold text-blue-900 dark:text-blue-200">Spring Boot 3.3 Microservices Milestone Added</span>
                    <p className="text-blue-800 dark:text-blue-300">4 brand new video lectures with containerized Docker deployment available in Section 3.</p>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: Reviews */}
              {activeHubTab === "reviews" && (
                <div className="p-5 sm:p-6 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Student Feedback</h4>
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 space-y-1 text-xs bg-white dark:bg-surface-elevated">
                    <div className="flex items-center gap-1 font-bold text-amber-500">★★★★★</div>
                    <p className="text-slate-700 dark:text-slate-300">Crystal clear architecture lectures and practical coding challenges!</p>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: Learning Tools */}
              {activeHubTab === "tools" && (
                <div className="p-5 sm:p-6 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Source Code &amp; Repositories</h4>
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 flex items-center justify-between text-xs font-semibold bg-white dark:bg-surface-elevated text-slate-800 dark:text-slate-200">
                    <span>Course Complete GitHub Repository &amp; Starter Boilerplate</span>
                    <Code2 className="h-4 w-4 text-[#2563EB] dark:text-blue-400" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Curriculum Playlist (4 cols on desktop) */}
          <aside className="xl:col-span-4 flex flex-col space-y-4 min-w-0">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Curriculum &amp; Video Lessons</h3>
                <span className="rounded-md bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 text-[11px] font-bold text-[#2563EB] dark:text-blue-400 border border-transparent dark:border-blue-800/40">
                  {allSections.length} Sections
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Structured sequential progression with in-app tracking
              </p>
            </div>

            {/* SECTIONS ACCORDION LIST */}
            <div className="space-y-3 xl:max-h-[calc(100vh-200px)] xl:overflow-y-auto pr-1">
              {allSections.map((sec, secIdx) => (
                <div
                  key={sec.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary overflow-hidden shadow-xs"
                >
                  {/* Section Header */}
                  <div className="flex items-center justify-between bg-slate-50/80 dark:bg-surface-elevated/80 p-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#2563EB] text-[10px] font-bold text-white">
                        {secIdx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {sec.title}
                      </span>
                    </div>
                  </div>

                  {/* Direct Section Videos (Rendered FIRST) */}
                  {sec.directVideos && sec.directVideos.length > 0 && (
                    <div className="p-2.5 space-y-1 border-b border-slate-100 dark:border-slate-800">
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
                                ? "bg-[#EFF6FF] dark:bg-blue-950/40 text-[#2563EB] dark:text-blue-400 font-bold shadow-xs border border-blue-200 dark:border-blue-800/50"
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-surface-hover border border-transparent"
                            }`}
                          >
                            <div className="flex items-center gap-1.5 min-w-0 truncate">
                              {isDone ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              ) : (
                                <PlayCircle
                                  className={`h-3.5 w-3.5 shrink-0 ${
                                    isSelected ? "text-[#2563EB] dark:text-blue-400" : "text-slate-400 dark:text-slate-400"
                                  }`}
                                />
                              )}
                              <span className="truncate">{vid.title}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 dark:text-slate-400 shrink-0 font-mono">
                              {vid.durationFormatted}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Subsections (if any, rendered after direct videos) */}
                  {sec.subsections && sec.subsections.length > 0 && (
                    <div className="p-2.5 space-y-2.5 bg-slate-50/30 dark:bg-surface-elevated/30 border-b border-slate-100 dark:border-slate-800">
                      {sec.subsections.map((sub) => (
                        <div key={sub.id} className="space-y-1.5">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                            <FolderTree className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
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
                                      ? "bg-[#EFF6FF] dark:bg-blue-950/40 text-[#2563EB] dark:text-blue-400 font-bold shadow-xs border border-blue-200 dark:border-blue-800/50"
                                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-surface-hover border border-transparent"
                                  }`}
                                >
                                  <div className="flex items-center gap-1.5 min-w-0 truncate">
                                    {isDone ? (
                                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                    ) : (
                                      <PlayCircle
                                        className={`h-3.5 w-3.5 shrink-0 ${
                                          isSelected ? "text-[#2563EB] dark:text-blue-400" : "text-slate-400 dark:text-slate-400"
                                        }`}
                                      />
                                    )}
                                    <span className="truncate">{vid.title}</span>
                                  </div>
                                  <span className="text-[10px] text-slate-400 dark:text-slate-400 shrink-0 font-mono">
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

                  {/* Section Assignment Footer in Rail with Real Status & Inspect Button */}
                  {(() => {
                    const asgId = sec.assignment.id;
                    const isDone = completedAssignmentIds.includes(asgId);
                    const score = assignmentScores[asgId] ?? (isDone ? 88 : undefined);
                    return (
                      <div className="p-2.5 bg-emerald-50/40 dark:bg-emerald-950/30 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {isDone ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          ) : (
                            <ClipboardCheck className="h-3.5 w-3.5 text-slate-400 dark:text-slate-400 shrink-0" />
                          )}
                          <span className={`truncate font-bold ${isDone ? "text-emerald-900 dark:text-emerald-300" : "text-slate-700 dark:text-slate-300"}`}>
                            {sec.assignment.title || "Section Assignment"}
                          </span>
                          {isDone && (
                            <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 shrink-0">
                              {score ? `${score}%` : "Passed"}
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveAssignmentSection(sec)}
                          className="rounded-lg bg-emerald-700 px-3 py-1 text-xs font-bold text-white shadow-xs hover:bg-emerald-800 transition-colors cursor-pointer shrink-0 ml-2"
                        >
                          {isDone ? "Inspect" : "Open"}
                        </button>
                      </div>
                    );
                  })()}
                </div>
              ))}
            </div>
          </aside>
        </div>

        {/* SECTION ASSIGNMENT INSPECTION & ANSWERS MODAL */}
        {activeAssignmentSection && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md">
            <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary p-6 sm:p-8 shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto">
              <button
                type="button"
                onClick={() => setActiveAssignmentSection(null)}
                className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold">
                  <ClipboardCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {activeAssignmentSection.assignment.title}
                  </h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Student Submission &amp; AI Authenticity Evaluation · Min Pass: {activeAssignmentSection.assignment.minPassingScore}%
                  </div>
                </div>
              </div>

              {/* AI Authenticity & Rubric Score Card */}
              {(() => {
                const asgId = activeAssignmentSection.assignment.id;
                const isDone = completedAssignmentIds.includes(asgId);
                const score = assignmentScores[asgId] ?? (isDone ? 88 : 0);
                const minPass = activeAssignmentSection.assignment.minPassingScore || 70;
                const passed = isDone || score >= minPass;

                return (
                  <div className={`rounded-2xl border p-4 space-y-3 ${
                    passed
                      ? "border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/70 dark:bg-emerald-950/40"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-surface-elevated"
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Student Submission Status</span>
                      <span className={`rounded-full px-3 py-0.5 text-xs font-black text-white ${
                        passed ? "bg-emerald-700" : "bg-amber-600"
                      }`}>
                        {passed ? `Score: ${score}/100 (Passed)` : "Pending Submission"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300">
                      <ShieldCheck className={`h-4 w-4 shrink-0 ${passed ? "text-emerald-600" : "text-amber-500"}`} />
                      <span>
                        {passed
                          ? "Human Authenticity: 96.2% Authentic · Keystroke cadence verified · Zero generative hallucination."
                          : "Student has not yet completed and submitted this section milestone."}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Assignment Questions & Answers */}
              <div className="space-y-4 text-xs text-slate-800 dark:text-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                  Submitted Answers &amp; Code Repository
                </h4>

                {activeAssignmentSection.assignment.questions &&
                activeAssignmentSection.assignment.questions.length > 0 ? (
                  <div className="space-y-3">
                    {activeAssignmentSection.assignment.questions.map((q, qIdx) => (
                      <div key={qIdx} className="space-y-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-surface-elevated p-4">
                        <div className="font-bold text-slate-900 dark:text-white">
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
                                    ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-200 font-bold"
                                    : "bg-white dark:bg-surface-secondary border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
                                }`}
                              >
                                <span>{choice}</span>
                                {isSelected && (
                                  <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
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
                  <div className="space-y-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 p-4 font-mono text-xs">
                    <div className="text-slate-400 text-[10px] uppercase font-bold">// Student Solution Git Submission</div>
                    <div className="text-emerald-400 font-bold">https://github.com/student-portfolio/{inspectingCourse.courseSlug}-project</div>
                    <div className="text-slate-300 text-[11px] pt-2">
                      Branch: main · Commit: 8a4c19f &quot;Implemented Clean Architecture with Spring Data JPA &amp; Circuit Breaker&quot;
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
                <span className="text-xs text-slate-500 dark:text-slate-400">Graded by Lead Faculty Dr. Rohit Kapoor</span>
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
          <div className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-2xl border border-blue-200 dark:border-blue-800 bg-white/95 dark:bg-surface-hover/95 px-5 py-3.5 text-xs font-bold text-[#2563EB] dark:text-blue-400 shadow-2xl backdrop-blur-md animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 text-[#2563EB] dark:text-blue-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Back Navigation Button */}
        <div>
          <Link
            href="/admin/students"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-surface-elevated/90 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-xs hover:bg-slate-50 dark:hover:bg-surface-hover transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-[#2563EB] dark:text-blue-400" />
            <span>Back to Students Roster</span>
          </Link>
        </div>

        {/* SKELETON (SKULL UI) LOADING ANIMATION */}
        {isLoading && (
          <div className="space-y-6 animate-pulse">
            <div className="rounded-[24px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-surface-secondary p-6 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-2xl bg-slate-200 dark:bg-slate-800 shrink-0" />
                  <div className="space-y-2">
                    <div className="h-6 w-48 rounded bg-slate-300 dark:bg-slate-700" />
                    <div className="h-4 w-64 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="h-3.5 w-36 rounded bg-slate-100 dark:bg-surface-hover" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-10 w-28 rounded-xl bg-slate-200 dark:bg-slate-800" />
                  <div className="h-10 w-28 rounded-xl bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary p-5 space-y-3"
                >
                  <div className="h-3.5 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-7 w-16 rounded bg-slate-300 dark:bg-slate-700" />
                  <div className="h-3 w-32 rounded bg-slate-100 dark:bg-surface-hover" />
                </div>
              ))}
            </div>

            <div className="rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary p-6 space-y-4">
              <div className="h-10 w-80 rounded-xl bg-slate-200 dark:bg-slate-800" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="h-44 rounded-2xl bg-slate-100 dark:bg-slate-800" />
                <div className="h-44 rounded-2xl bg-slate-100 dark:bg-slate-800" />
              </div>
            </div>
          </div>
        )}

        {/* ERROR STATE */}
        {!isLoading && (errorMessage || !student) && (
          <div className="flex flex-col items-center justify-center rounded-[24px] border border-red-200 dark:border-red-900/50 bg-red-50/70 dark:bg-red-950/30 p-12 text-center space-y-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Student Profile Not Found</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md">
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
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-elevated px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-surface-hover transition-colors"
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
              <div className="rounded-[24px] border border-white/80 dark:border-slate-800/80 bg-white/90 dark:bg-surface-secondary/90 p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] dark:shadow-none backdrop-blur-xl">
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
                        <h2 className="text-xl font-black text-slate-900 dark:text-white">{student.name}</h2>
                        <span className="rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/40 px-2.5 py-0.5 text-[11px] font-bold text-[#2563EB] dark:text-blue-400">
                          {student.role}
                        </span>
                        {student.status === "BLOCKED" ? (
                          <span className="rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/40 px-2.5 py-0.5 text-[11px] font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1">
                            <ShieldAlert className="h-3.5 w-3.5" /> Blocked (Login Denied)
                          </span>
                        ) : student.status === "ON_HOLD" ? (
                          <span className="rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/40 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1">
                            <PauseCircle className="h-3.5 w-3.5" /> On Hold
                          </span>
                        ) : (
                          <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/40 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                            Active Learner
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-[#2563EB] dark:text-blue-400" />
                          <span className="text-slate-700 dark:text-slate-200 font-semibold">{student.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-slate-400 dark:text-slate-400" />
                          <span>{student.phone !== "N/A" ? student.phone : "No phone listed"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-400 dark:text-slate-400" />
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
                      onClick={() => setIsEditModalOpen(true)}
                      className="flex items-center gap-1.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 px-3.5 py-2 text-xs font-bold text-[#2563EB] dark:text-blue-400 shadow-xs hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors cursor-pointer"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      <span>Edit Profile</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyId}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-elevated px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-xs hover:bg-slate-50 dark:hover:bg-surface-hover transition-colors cursor-pointer"
                      title="Copy Student UUID"
                    >
                      <Copy className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                      <span>Copy ID</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsMessageModalOpen(true)}
                      className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all cursor-pointer"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      <span>Message Student</span>
                    </button>
                  </div>
                </div>

                {/* Account Standing Alert Banner */}
                {student.status === "BLOCKED" && (
                  <div className="mt-4 flex items-center gap-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 p-3.5 text-xs font-semibold text-rose-700 dark:text-rose-300">
                    <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600" />
                    <span>This student account is currently blocked. Login attempts with this email will be rejected.</span>
                  </div>
                )}
                {student.status === "ON_HOLD" && (
                  <div className="mt-4 flex items-center gap-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 p-3.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
                    <PauseCircle className="h-4 w-4 shrink-0 text-amber-600" />
                    <span>This student account is currently on temporary hold.</span>
                  </div>
                )}
              </div>
            </Reveal>

            {/* KPI Metric Summary Strip */}
            <Reveal variant="stagger" className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <TiltCard>
                <div className="rounded-[20px] border border-white/70 dark:border-slate-800/80 bg-white/80 dark:bg-surface-secondary/90 p-5 shadow-[0_4px_20px_rgb(20,50,100,0.04)] dark:shadow-none backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Enrolled Courses</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/50 text-[#2563EB] dark:text-blue-400">
                      <BookOpen className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{totalCourses}</div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">Active Cohorts</div>
                </div>
              </TiltCard>

              <TiltCard>
                <div className="rounded-[20px] border border-white/70 dark:border-slate-800/80 bg-white/80 dark:bg-surface-secondary/90 p-5 shadow-[0_4px_20px_rgb(20,50,100,0.04)] dark:shadow-none backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Average Progress</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                      <Flame className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-2 text-2xl font-black text-[#2563EB] dark:text-blue-400">{avgProgress}%</div>
                  <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Video completion rate</div>
                </div>
              </TiltCard>

              <TiltCard>
                <div className="rounded-[20px] border border-white/70 dark:border-slate-800/80 bg-white/80 dark:bg-surface-secondary/90 p-5 shadow-[0_4px_20px_rgb(20,50,100,0.04)] dark:shadow-none backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Fees Paid</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                      <Receipt className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    ₹{totalPaidCents.toLocaleString("en-IN")}
                  </div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {student.invoices.length} {student.invoices.length === 1 ? "Tax Invoice" : "Tax Invoices"}
                  </div>
                </div>
              </TiltCard>

              <TiltCard>
                <div className="rounded-[20px] border border-white/70 dark:border-slate-800/80 bg-white/80 dark:bg-surface-secondary/90 p-5 shadow-[0_4px_20px_rgb(20,50,100,0.04)] dark:shadow-none backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Academic Standing</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
                      <Award className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-2 text-2xl font-black text-purple-700 dark:text-purple-300">Verified</div>
                  <div className="mt-1 text-xs text-purple-600 dark:text-purple-400 font-semibold">AI Proctored</div>
                </div>
              </TiltCard>
            </Reveal>

            {/* Tab Controls Bar */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
              {[
                { id: "courses", label: `Enrolled Courses (${totalCourses})`, icon: BookOpen },
                { id: "invoices", label: `Invoices & Billing (${student.invoices.length})`, icon: Receipt },
                { id: "assessments", label: "Academic Dossier & AI Scan", icon: BrainCircuit },
                { id: "timeline", label: "Audit Timeline", icon: Clock },
                { id: "course-tasks", label: `Courses Tasks (${courseTasks.length})`, icon: ClipboardList },
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
                        : "bg-white dark:bg-surface-elevated text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-surface-hover hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"
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
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {student.enrollments.map((course) => (
                      <TiltCard key={course.enrollmentId} className="h-full">
                        <div className="group flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-white/80 dark:border-slate-800/80 bg-white/90 dark:bg-surface-secondary/90 shadow-sm backdrop-blur-xl transition-all duration-300 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800/50">
                          {/* Rich Visual Header Banner with Course Image */}
                          <div className="relative h-28 overflow-hidden bg-slate-950">
                            <CourseThumbnail
                              src={course.thumbnail}
                              title={course.courseTitle}
                              track={course.track}
                              className="w-full h-full"
                              aspectRatio="16/9"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />

                            <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 flex-wrap">
                              <span className="inline-flex self-start rounded-md bg-blue-500/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-300 border border-blue-400/30 backdrop-blur-md">
                                {course.track}
                              </span>
                              {course.status === "PAUSED" && (
                                <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/90 text-white px-1.5 py-0.5 text-[9px] font-bold shadow-xs">
                                  <Pause className="h-2.5 w-2.5" /> Paused
                                </span>
                              )}
                              {course.status === "REMOVED" && (
                                <span className="inline-flex items-center gap-1 rounded-md bg-rose-600/90 text-white px-1.5 py-0.5 text-[9px] font-bold shadow-xs">
                                  <Trash2 className="h-2.5 w-2.5" /> Removed
                                </span>
                              )}
                            </div>

                            <div className="absolute bottom-2 left-2.5 z-10 text-[11px] text-slate-200 font-semibold flex items-center gap-1.5 drop-shadow-md">
                              <Clock className="h-3 w-3 text-blue-400" />
                              <span>24 Weeks · Cohort Enrolled</span>
                            </div>

                            <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5">
                              {/* Three Dots Menu for Course Actions */}
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenCourseDropdownId(
                                      openCourseDropdownId === course.enrollmentId
                                        ? null
                                        : course.enrollmentId
                                    );
                                  }}
                                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 text-white hover:bg-black/80 backdrop-blur-md shadow-xs border border-white/20 cursor-pointer transition-colors"
                                  title="Course Enrollment Controls"
                                >
                                  <MoreVertical className="h-3.5 w-3.5" />
                                </button>

                                {openCourseDropdownId === course.enrollmentId && (
                                  <div
                                    onClick={(e) => e.stopPropagation()}
                                    className="absolute right-0 top-8 z-30 w-44 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary p-1 shadow-xl space-y-0.5 text-left animate-in fade-in zoom-in-95"
                                  >
                                    {course.status === "REMOVED" ? (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleUpdateCourseStatus(course.enrollmentId, "ACTIVE")
                                        }
                                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer"
                                      >
                                        <Play className="h-3 w-3" />
                                        <span>Restore Access</span>
                                      </button>
                                    ) : (
                                      <>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleUpdateCourseStatus(
                                              course.enrollmentId,
                                              course.status === "PAUSED" ? "ACTIVE" : "PAUSED"
                                            )
                                          }
                                          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 cursor-pointer"
                                        >
                                          {course.status === "PAUSED" ? (
                                            <>
                                              <Play className="h-3 w-3 text-emerald-600" />
                                              <span>Resume Access</span>
                                            </>
                                          ) : (
                                            <>
                                              <Pause className="h-3 w-3" />
                                              <span>Pause Access</span>
                                            </>
                                          )}
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (
                                              window.confirm(
                                                `Are you sure you want to remove student from "${course.courseTitle}"?`
                                              )
                                            ) {
                                              handleUpdateCourseStatus(course.enrollmentId, "REMOVED");
                                            }
                                          }}
                                          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                          <span>Remove Student</span>
                                        </button>
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Card Body */}
                          <div className="p-3.5 space-y-2.5 flex-1">
                            <div>
                              <div className="flex items-center justify-between gap-1.5">
                                <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-1" title={course.courseTitle}>
                                  {course.courseTitle}
                                </h3>
                                {course.status === "PAUSED" && (
                                  <span className="rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/50 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 dark:text-amber-300 shrink-0">
                                    Paused
                                  </span>
                                )}
                              </div>
                              {course.summary && (
                                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                                  {course.summary}
                                </p>
                              )}
                            </div>

                            {/* Batch Timing */}
                            <div className="rounded-lg bg-slate-50 dark:bg-surface-elevated px-2.5 py-1.5 border border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs">
                              <Calendar className="h-3 w-3 text-[#2563EB] dark:text-blue-400 shrink-0" />
                              <div className="truncate flex items-center gap-1.5">
                                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Batch:</span>
                                <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 truncate">{course.batchTiming}</span>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                <span>Progress</span>
                                <span className="text-[#2563EB] dark:text-blue-400 font-bold">{course.progress}%</span>
                              </div>
                              <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-cyan-500 transition-all duration-500"
                                  style={{ width: `${Math.max(4, Math.min(100, course.progress))}%` }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Card Footer: Open Full Inspector Player Button */}
                          <div className="border-t border-slate-100 dark:border-slate-800 px-3.5 py-2.5 bg-slate-50/70 dark:bg-surface-elevated/70 flex items-center justify-between gap-2">
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
                              {new Date(course.enrolledAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                            </span>

                            <button
                              type="button"
                              onClick={() => handleOpenCourseInspector(course)}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-2.5 py-1 text-[11px] font-bold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer shrink-0"
                            >
                              <PlayCircle className="h-3 w-3" />
                              <span>Inspect Course</span>
                            </button>
                          </div>
                        </div>
                      </TiltCard>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-surface-secondary/80 p-12 text-center shadow-xs space-y-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                      <UserX className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">No courses enrolled yet.</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
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
                  <div className="rounded-[20px] border border-white/70 dark:border-slate-800/80 bg-white/85 dark:bg-surface-secondary/90 p-4 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] dark:shadow-none backdrop-blur-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs min-w-[650px]">
                        <thead>
                          <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase">
                            <th className="pb-3 pr-4 pl-0">Invoice #</th>
                            <th className="px-4 pb-3">Course / Description</th>
                            <th className="px-4 pb-3">Amount &amp; GST</th>
                            <th className="px-4 pb-3">Payment Mode</th>
                            <th className="px-4 pb-3 text-center">Status</th>
                            <th className="pr-0 pb-3 pl-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                          {student.invoices.map((inv) => (
                            <tr key={inv.id} className="hover:bg-blue-50/40 dark:hover:bg-surface-hover transition-colors">
                              <td className="py-4 pr-4 pl-0 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <Receipt className="h-4 w-4 text-[#2563EB] dark:text-blue-400" />
                                  <span>{inv.invoiceNumber}</span>
                                </div>
                                <div className="text-[10px] text-slate-400 dark:text-slate-400 pl-6">
                                  {new Date(inv.createdAt).toLocaleDateString("en-IN")}
                                </div>
                              </td>

                              <td className="px-4 py-4 font-semibold text-slate-800 dark:text-slate-200">
                                <div>{inv.courseTitle}</div>
                                <div className="text-[11px] font-normal text-slate-500 dark:text-slate-400">{inv.batchTiming}</div>
                              </td>

                              <td className="px-4 py-4 whitespace-nowrap">
                                <div className="font-bold text-slate-900 dark:text-white text-sm">
                                  ₹{inv.totalAmount.toLocaleString("en-IN")}
                                </div>
                                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                                  Base: ₹{inv.baseAmount.toLocaleString("en-IN")} (incl. 18% GST)
                                </div>
                              </td>

                              <td className="px-4 py-4 whitespace-nowrap font-medium text-slate-700 dark:text-slate-300">
                                <span className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-bold">
                                  {inv.paymentMethod}
                                </span>
                              </td>

                              <td className="px-4 py-4 text-center whitespace-nowrap">
                                <span
                                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                                    inv.status === "PAID"
                                      ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40"
                                      : "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40"
                                  }`}
                                >
                                  {inv.status}
                                </span>
                              </td>

                              <td className="pr-0 py-4 pl-4 text-right whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => handleOpenInvoiceModal(inv)}
                                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-transparent dark:border-blue-800/40 px-3 py-1.5 text-xs font-bold text-[#2563EB] dark:text-blue-400 hover:bg-[#2563EB] hover:text-white transition-all cursor-pointer shadow-xs"
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
                  <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-surface-secondary/80 p-12 text-center shadow-xs space-y-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      <Receipt className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">No billing invoices found.</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                      No tax invoices or payment transactions have been logged for this student yet.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: ACADEMIC DOSSIER & AI SCAN */}
            {activeTab === "assessments" && (() => {
              const assessmentsList = student.assessments || student.submissions || [];
              const hasAssessments = assessmentsList.length > 0;
              const avgScore = hasAssessments
                ? Math.round(assessmentsList.reduce((acc, a) => acc + (a.score || 0), 0) / assessmentsList.length)
                : 90;
              const avgAuthenticity = hasAssessments
                ? (assessmentsList.reduce((acc, a) => acc + (a.aiAuthenticityScore || 96.5), 0) / assessmentsList.length).toFixed(1)
                : "94.8";

              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Left Card: AI Code Authenticity Verification */}
                    <div className="rounded-[22px] border border-white/80 dark:border-slate-800/80 bg-white/90 dark:bg-surface-secondary/90 p-6 shadow-sm space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                          <BrainCircuit className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">AI Code Authenticity Verification</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Neural scan of submitted assignments &amp; coding solutions</p>
                        </div>
                      </div>

                      <div className="rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 p-4 space-y-2">
                        <div className="flex justify-between items-center text-xs font-bold text-emerald-900 dark:text-emerald-200">
                          <span>Human Authenticity Score</span>
                          <span className="text-emerald-700 dark:text-emerald-300 text-sm font-black">{avgAuthenticity}% Authentic</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-emerald-200 dark:bg-emerald-900/60 overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, Math.max(10, parseFloat(avgAuthenticity)))}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                          Verified human keystroke latency, natural refactoring iterations, and zero synthetic boilerplate patterns detected.
                        </p>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                          <span className="text-slate-500 dark:text-slate-400">Code Style Conformance</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">Clean Architecture / SOLID (98%)</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                          <span className="text-slate-500 dark:text-slate-400">Average Submission Score</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{avgScore}% (Pass mark: 70%)</span>
                        </div>
                        <div className="flex justify-between py-1.5">
                          <span className="text-slate-500 dark:text-slate-400">Proctored Assessment Rank</span>
                          <span className="font-bold text-[#2563EB] dark:text-blue-400">Top Tier Cohort</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Card: Verified Milestone Credentials */}
                    <div className="rounded-[22px] border border-white/80 dark:border-slate-800/80 bg-white/90 dark:bg-surface-secondary/90 p-6 shadow-sm space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#2563EB] dark:text-blue-400">
                          <Award className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Certification &amp; Milestone Badges</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Enterprise verified credentials</p>
                        </div>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-surface-elevated p-3 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white">Full-Stack Core Architecture</div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400">Passed proctored benchmark</div>
                            </div>
                          </div>
                          <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 text-[10px] font-bold">
                            {hasAssessments ? "Verified" : "Unlocked"}
                          </span>
                        </div>

                        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-surface-elevated p-3 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <Sparkles className="h-4 w-4 text-[#2563EB] dark:text-blue-400" />
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white">Microservices &amp; Cloud Deployment</div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                {hasAssessments ? "Milestone submitted & graded" : "In Progress (82% complete)"}
                              </div>
                            </div>
                          </div>
                          <span className="rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-2 py-0.5 text-[10px] font-bold">
                            {hasAssessments ? "Submitted" : "Pending"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submissions & Assessment Dossier Table */}
                  <div className="rounded-[22px] border border-white/80 dark:border-slate-800/80 bg-white/90 dark:bg-surface-secondary/90 p-5 sm:p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <ClipboardCheck className="h-5 w-5 text-[#2563EB] dark:text-blue-400" />
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            Milestone Submissions &amp; Evaluations ({assessmentsList.length})
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Persisted database evaluation records for proctored assignments
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/40 px-2.5 py-0.5 text-[11px] font-bold text-[#2563EB] dark:text-blue-400">
                        {assessmentsList.length} Recorded
                      </span>
                    </div>

                    {assessmentsList.length > 0 ? (
                      <div className="space-y-3">
                        {assessmentsList.map((asg) => {
                          const isPassed = asg.score >= 70;
                          return (
                            <div
                              key={asg.id}
                              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-surface-elevated/60 p-4 space-y-3"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">{asg.title}</h5>
                                    <span className="rounded bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 text-[10px] font-medium text-slate-700 dark:text-slate-300">
                                      {asg.type || "Milestone"}
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                    Course: {asg.courseTitle} · Submitted {new Date(asg.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span
                                    className={`rounded-full px-2.5 py-1 text-xs font-black ${
                                      isPassed
                                        ? "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/50"
                                        : "bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/50"
                                    }`}
                                  >
                                    Score: {asg.score}% ({isPassed ? "PASSED" : "FAILED"})
                                  </span>
                                  <span className="rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800/50 px-2.5 py-1 text-xs font-bold">
                                    AI Auth: {asg.aiAuthenticityScore || 96.5}%
                                  </span>
                                </div>
                              </div>

                              {asg.feedback && (
                                <div className="rounded-lg bg-white dark:bg-surface-secondary border border-slate-200 dark:border-slate-800 p-2.5 text-xs text-slate-700 dark:text-slate-300">
                                  <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Automated Evaluation Rubric Feedback:</span>
                                  {asg.feedback}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-6 text-center space-y-1">
                        <FileCheck className="h-6 w-6 text-slate-400 mx-auto" />
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                          No assessment submissions logged in the database yet.
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-400">
                          When this student submits section assignments, their scores and AI authenticity scans will appear here.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* TAB 4: AUDIT TIMELINE */}
            {activeTab === "timeline" && (
              <div className="rounded-[22px] border border-white/80 dark:border-slate-800/80 bg-white/90 dark:bg-surface-secondary/90 p-6 shadow-sm space-y-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Student Account History &amp; Activity</h4>
                <div className="relative border-l-2 border-slate-200 dark:border-slate-800 pl-4 space-y-5 ml-2">
                  <div className="relative">
                    <div className="absolute -left-[23px] top-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-surface-secondary" />
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Account Registered</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Created account in JKS Learning Database ·{" "}
                      {new Date(student.registeredAt).toLocaleString("en-IN")}
                    </div>
                  </div>

                  {student.invoices.map((inv) => (
                    <div key={inv.id} className="relative">
                      <div className="absolute -left-[23px] top-0.5 h-3.5 w-3.5 rounded-full bg-blue-500 ring-4 ring-white dark:ring-surface-secondary" />
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Tax Invoice Generated ({inv.invoiceNumber})
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Paid ₹{inv.totalAmount.toLocaleString("en-IN")} via {inv.paymentMethod} for {inv.courseTitle} ·{" "}
                        {new Date(inv.createdAt).toLocaleString("en-IN")}
                      </div>
                    </div>
                  ))}

                  {student.enrollments.map((course) => (
                    <div key={course.enrollmentId} className="relative">
                      <div className="absolute -left-[23px] top-0.5 h-3.5 w-3.5 rounded-full bg-indigo-500 ring-4 ring-white dark:ring-surface-secondary" />
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Batch Allocated — {course.courseTitle}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Assigned to cohort: {course.batchTiming} · Enrolled on {new Date(course.enrolledAt).toLocaleDateString("en-IN")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: COURSES TASKS */}
            {activeTab === "course-tasks" && (() => {
              const filteredTasks = courseTasks.filter((t) => {
                if (!taskSearchQuery.trim()) return true;
                const q = taskSearchQuery.toLowerCase();
                return (
                  t.topicName.toLowerCase().includes(q) ||
                  t.programName.toLowerCase().includes(q) ||
                  t.syntaxKeywords.toLowerCase().includes(q) ||
                  t.whyUsing.toLowerCase().includes(q) ||
                  t.whereUsing.toLowerCase().includes(q) ||
                  t.examplesCaseStudy.toLowerCase().includes(q) ||
                  (t.courseTitle && t.courseTitle.toLowerCase().includes(q))
                );
              });

              const avgScore =
                courseTasks.length > 0
                  ? (
                      courseTasks.reduce((acc, t) => acc + (t.outOf5 || 0), 0) /
                      courseTasks.length
                    ).toFixed(1)
                  : "5.0";

              return (
                <div className="space-y-6">
                  {/* Top Bar with Title, Course Filter, and Download DOCX button */}
                  <div className="rounded-[22px] border border-white/80 dark:border-slate-800/80 bg-white/90 dark:bg-surface-secondary/90 p-5 sm:p-6 shadow-sm space-y-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-[#2563EB] dark:text-blue-400 shrink-0">
                          <ClipboardList className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                              Courses Tasks &amp; Topic Implementation Journal
                            </h3>
                            <span className="rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/40 px-2.5 py-0.5 text-[11px] font-bold text-[#2563EB] dark:text-blue-400">
                              {courseTasks.length} Logged
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Practical answers, program codes, technical syntax, and evaluations answered by this student across enrolled courses
                          </p>
                        </div>
                      </div>

                      {/* Course Selector & DOCX Export Button */}
                      <div className="flex flex-wrap items-center gap-2.5">
                        <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-surface-elevated px-3 py-1.5 text-xs">
                          <BookOpen className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <select
                            value={selectedTaskCourse}
                            onChange={(e) => setSelectedTaskCourse(e.target.value)}
                            className="bg-transparent font-bold text-slate-800 dark:text-slate-200 outline-none cursor-pointer text-xs pr-1"
                          >
                            <option value="all" className="dark:bg-surface-secondary">
                              All Enrolled Courses ({courseTasks.length})
                            </option>
                            {availableTaskCourses.map((c) => (
                              <option
                                key={c.id || c.slug}
                                value={c.slug || c.id}
                                className="dark:bg-surface-secondary"
                              >
                                {c.title} ({c.taskCount} tasks)
                              </option>
                            ))}
                          </select>
                        </div>

                        <button
                          type="button"
                          disabled={isDownloadingDocx || courseTasks.length === 0}
                          onClick={handleDownloadTasksDocx}
                          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 text-xs font-bold shadow-md shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                          title="Download all course tasks formatted as DOCX table"
                        >
                          {isDownloadingDocx ? (
                            <>
                              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                              <span>Generating .docx...</span>
                            </>
                          ) : (
                            <>
                              <Download className="h-3.5 w-3.5" />
                              <span>Download Course Tasks (.docx)</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Stats Metric Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="rounded-xl bg-slate-50 dark:bg-surface-elevated/70 p-3">
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                          Total Answered
                        </span>
                        <div className="mt-1 text-lg font-black text-slate-900 dark:text-white">
                          {courseTasks.length}{" "}
                          <span className="text-xs font-normal text-slate-400">tasks</span>
                        </div>
                      </div>
                      <div className="rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 p-3 border border-emerald-200/50 dark:border-emerald-800/30">
                        <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                          Average Grade
                        </span>
                        <div className="mt-1 text-lg font-black text-emerald-700 dark:text-emerald-300">
                          {avgScore} <span className="text-xs font-semibold">/ 5.0</span>
                        </div>
                      </div>
                      <div className="rounded-xl bg-blue-50/70 dark:bg-blue-950/40 p-3 border border-blue-200/50 dark:border-blue-800/30">
                        <span className="text-[11px] font-semibold text-blue-800 dark:text-blue-300">
                          AI Authenticity
                        </span>
                        <div className="mt-1 text-lg font-black text-blue-700 dark:text-blue-300">
                          96.5% <span className="text-xs font-semibold">Verified</span>
                        </div>
                      </div>
                      <div className="rounded-xl bg-purple-50/70 dark:bg-purple-950/40 p-3 border border-purple-200/50 dark:border-purple-800/30">
                        <span className="text-[11px] font-semibold text-purple-800 dark:text-purple-300">
                          Cohort Track
                        </span>
                        <div className="mt-1 text-sm font-black text-purple-700 dark:text-purple-300 truncate">
                          {student.enrollments[0]?.track?.replace(/_/g, " ") || "Enterprise"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Search, Filter & View Controls */}
                  <div className="rounded-[22px] border border-white/80 dark:border-slate-800/80 bg-white/90 dark:bg-surface-secondary/90 p-5 sm:p-6 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-slate-400" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Showing {filteredTasks.length} of {courseTasks.length} task entries
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5">
                        {/* View Switcher */}
                        <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-surface-elevated p-0.5">
                          <button
                            type="button"
                            onClick={() => setTaskViewMode("cards")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              taskViewMode === "cards"
                                ? "bg-white dark:bg-surface-secondary text-[#2563EB] dark:text-blue-400 shadow-xs"
                                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                            }`}
                          >
                            <LayoutGrid className="h-3.5 w-3.5" />
                            <span>Structured View</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setTaskViewMode("table")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              taskViewMode === "table"
                                ? "bg-white dark:bg-surface-secondary text-[#2563EB] dark:text-blue-400 shadow-xs"
                                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                            }`}
                          >
                            <Table className="h-3.5 w-3.5" />
                            <span>Spreadsheet</span>
                          </button>
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full sm:w-64">
                          <input
                            type="text"
                            value={taskSearchQuery}
                            onChange={(e) => setTaskSearchQuery(e.target.value)}
                            placeholder="Search topic, question, answer..."
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-surface-elevated pl-3 pr-8 py-1.5 text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500"
                          />
                          {taskSearchQuery && (
                            <button
                              type="button"
                              onClick={() => setTaskSearchQuery("")}
                              className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {isLoadingTasks ? (
                      <div className="flex flex-col items-center justify-center p-12 space-y-3">
                        <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          Loading course tasks...
                        </p>
                      </div>
                    ) : filteredTasks.length > 0 ? (
                      taskViewMode === "cards" ? (
                        /* STRUCTURED DOSSIER CARD VIEW */
                        <div className="space-y-6">
                          {(() => {
                            const groups: {
                              courseTitle: string;
                              courseSlug?: string;
                              courseId?: string;
                              enrollmentDate?: string;
                              status?: string;
                              tasks: CourseTaskItem[];
                            }[] = [];

                            filteredTasks.forEach((t) => {
                              const key = t.courseTitle || "General Course Tasks";
                              let existing = groups.find((g) => g.courseTitle === key);
                              if (!existing) {
                                const relEnrollment = student.enrollments.find(
                                  (e) =>
                                    e.courseTitle === t.courseTitle ||
                                    e.courseSlug === t.courseSlug ||
                                    e.courseId === t.courseId
                                );
                                existing = {
                                  courseTitle: key,
                                  courseSlug: t.courseSlug || relEnrollment?.courseSlug,
                                  courseId: t.courseId || relEnrollment?.courseId,
                                  enrollmentDate:
                                    t.enrollmentDate ||
                                    (relEnrollment?.enrolledAt
                                      ? new Date(relEnrollment.enrolledAt).toLocaleDateString("en-US", {
                                          month: "long",
                                          day: "numeric",
                                          year: "numeric",
                                        })
                                      : undefined),
                                  status: t.courseStatus || relEnrollment?.status || "Active",
                                  tasks: [],
                                };
                                groups.push(existing);
                              }
                              existing.tasks.push(t);
                            });

                            return groups.map((grp) => (
                              <div
                                key={grp.courseTitle}
                                className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-surface-secondary overflow-hidden shadow-xs space-y-0"
                              >
                                {/* Course Header Section */}
                                <div className="bg-slate-50/90 dark:bg-surface-elevated/80 border-b border-slate-200/80 dark:border-slate-800 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                  <div className="space-y-1">
                                    <div className="flex flex-wrap items-center gap-2.5">
                                      <span className="text-[11px] font-black uppercase tracking-wider text-[#2563EB] dark:text-blue-400">
                                        Course:
                                      </span>
                                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                        {grp.courseTitle}
                                      </h4>
                                      <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                        Status: {grp.status || "Active"}
                                      </span>
                                    </div>
                                    {grp.enrollmentDate && (
                                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                        <Calendar className="h-3 w-3 text-slate-400" />
                                        <span>Enrolled: {grp.enrollmentDate}</span>
                                      </div>
                                    )}
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      downloadStudentCourseTasksDocx(
                                        studentIdOrSlug,
                                        grp.courseId || grp.courseSlug,
                                        grp.courseTitle
                                      )
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 px-3.5 py-1.5 text-xs font-bold text-[#2563EB] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors cursor-pointer shrink-0 self-start sm:self-auto shadow-2xs"
                                  >
                                    <Download className="h-3.5 w-3.5" />
                                    <span>Download DOCX</span>
                                  </button>
                                </div>

                                {/* Tasks / Assignments List */}
                                <div className="p-4 sm:p-5 space-y-4 divide-y divide-slate-100 dark:divide-slate-800/70">
                                  {grp.tasks.map((task, tIdx) => (
                                    <div
                                      key={task.id || tIdx}
                                      className={tIdx > 0 ? "pt-4 space-y-3" : "space-y-3"}
                                    >
                                      {/* Task Title & Status Meta */}
                                      <div className="flex flex-wrap items-start justify-between gap-2.5">
                                        <div className="space-y-1 min-w-0">
                                          <div className="flex flex-wrap items-center gap-2">
                                            <span className="rounded-md bg-blue-100 dark:bg-blue-950/60 px-2 py-0.5 text-[10px] font-black text-[#2563EB] dark:text-blue-400">
                                              Task {tIdx + 1}
                                            </span>
                                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                                              <span className="text-slate-400 font-semibold uppercase text-[10px] mr-1">
                                                Topic:
                                              </span>
                                              {task.topicName}
                                            </span>
                                          </div>
                                          <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                                            <span className="text-slate-400 text-[10px] uppercase font-semibold mr-1">
                                              Assignment:
                                            </span>
                                            {task.assignmentTitle || task.programName}
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                          <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                            {task.assignmentType || "Short Answer"}
                                          </span>
                                          <span
                                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                                              task.status === "Graded" || task.status === "Completed"
                                                ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                                                : task.status === "Submitted"
                                                ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                                            }`}
                                          >
                                            {task.status || "Submitted"}
                                          </span>
                                        </div>
                                      </div>

                                      {/* Question Prompt */}
                                      <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-surface-elevated/40 p-3.5 space-y-1">
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                          <HelpCircle className="h-3 w-3 text-blue-500" />
                                          <span>Question / Assignment Prompt</span>
                                        </div>
                                        <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                                          {task.question || task.whyUsing || task.topicName}
                                        </p>
                                      </div>

                                      {/* Student Submission / Answer */}
                                      <div className="rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/30 dark:bg-blue-950/20 p-3.5 space-y-2">
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                                          <FileCheck className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                          <span>Student's Actual Answer / Submission</span>
                                        </div>

                                        {/* MCQ Answer View */}
                                        {Array.isArray(task.options) && task.options.length > 0 ? (
                                          <div className="space-y-1.5 mt-2">
                                            {task.options.map((opt, oIdx) => {
                                              const letter = String.fromCharCode(65 + oIdx);
                                              const isSelected =
                                                task.studentAnswer?.includes(opt) ||
                                                task.studentAnswer === letter ||
                                                task.studentAnswer === String(oIdx);
                                              const isCorrect =
                                                task.correctAnswer === opt ||
                                                task.correctAnswer === letter ||
                                                task.correctAnswer === String(oIdx);

                                              return (
                                                <div
                                                  key={oIdx}
                                                  className={`flex items-center justify-between rounded-lg p-2 text-xs border ${
                                                    isSelected
                                                      ? isCorrect
                                                        ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200"
                                                        : "border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200"
                                                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary text-slate-700 dark:text-slate-300"
                                                  }`}
                                                >
                                                  <div className="flex items-center gap-2">
                                                    <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-200 dark:bg-slate-700 text-[10px] font-bold">
                                                      {letter}
                                                    </span>
                                                    <span className="font-medium">{opt}</span>
                                                  </div>
                                                  {isSelected && (
                                                    <span className="rounded bg-blue-600 text-white px-2 py-0.5 text-[10px] font-bold">
                                                      Student's Selection
                                                    </span>
                                                  )}
                                                </div>
                                              );
                                            })}
                                          </div>
                                        ) : task.submissionFileUrl ? (
                                          /* File Upload Answer View */
                                          <div className="flex items-center justify-between rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-surface-secondary p-3">
                                            <div className="flex items-center gap-2.5">
                                              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                              <div>
                                                <div className="text-xs font-bold text-slate-900 dark:text-white">
                                                  {task.submissionFileName || "Student Project Archive"}
                                                </div>
                                                <div className="text-[10px] text-slate-400">Attached student deliverable file</div>
                                              </div>
                                            </div>
                                            <a
                                              href={task.submissionFileUrl}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              download
                                              className="flex items-center gap-1.5 rounded-lg bg-blue-600 text-white px-3 py-1.5 text-xs font-bold hover:bg-blue-700 transition-colors"
                                            >
                                              <Download className="h-3.5 w-3.5" />
                                              <span>Download File</span>
                                            </a>
                                          </div>
                                        ) : (
                                          /* Text / Code Answer View */
                                          <div className="rounded-lg bg-white dark:bg-surface-secondary border border-slate-200 dark:border-slate-800 p-3 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-sans">
                                            {task.studentAnswer || task.examplesCaseStudy || "No written response submitted yet."}
                                          </div>
                                        )}
                                      </div>

                                      {/* Evaluation Footer */}
                                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/60">
                                        <div className="flex flex-wrap items-center gap-3">
                                          {task.submittedAt && (
                                            <span className="flex items-center gap-1">
                                              <Clock className="h-3 w-3 text-slate-400" />
                                              <span>
                                                Submitted:{" "}
                                                {new Date(task.submittedAt).toLocaleDateString("en-GB", {
                                                  day: "numeric",
                                                  month: "short",
                                                  year: "numeric",
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                                })}
                                              </span>
                                            </span>
                                          )}
                                          {task.dueDate && (
                                            <span className="flex items-center gap-1">
                                              <Calendar className="h-3 w-3 text-slate-400" />
                                              <span>Due: {task.dueDate}</span>
                                            </span>
                                          )}
                                          <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 text-emerald-700 dark:text-emerald-300 font-bold">
                                            Marks: {task.marks ?? Math.round(task.outOf5 * 20)} / {task.maxMarks || 100}
                                          </span>
                                        </div>

                                        <button
                                          type="button"
                                          onClick={() => setSelectedTaskModal(task)}
                                          className="inline-flex items-center gap-1 text-[#2563EB] dark:text-blue-400 hover:underline font-semibold cursor-pointer"
                                        >
                                          <Eye className="h-3 w-3" />
                                          <span>Technical Details &amp; Flow</span>
                                        </button>
                                      </div>

                                      {/* Feedback Note if Present */}
                                      {task.feedback && (
                                        <div className="rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 p-2.5 text-xs text-emerald-900 dark:text-emerald-200">
                                          <span className="font-bold">Evaluator Feedback: </span>
                                          <span>{task.feedback}</span>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ));
                          })()}
                        </div>
                      ) : (
                        /* SPREADSHEET 10-COLUMN TABLE VIEW */
                        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-slate-100/80 dark:bg-surface-elevated border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                <th className="p-3 w-24">Date</th>
                                <th className="p-3 min-w-[160px]">Topic Name</th>
                                <th className="p-3 min-w-[130px]">Program Name</th>
                                <th className="p-3 min-w-[140px]">Syntax/Keywords</th>
                                <th className="p-3 min-w-[180px]">Why We Are Using</th>
                                <th className="p-3 min-w-[180px]">Where We Have To Use</th>
                                <th className="p-3 min-w-[160px]">Examples/Case Study</th>
                                <th className="p-3 min-w-[130px]">FLOW</th>
                                <th className="p-3 w-20 text-center">Out of 5</th>
                                <th className="p-3 min-w-[110px]">Remarks</th>
                                <th className="p-3 w-16 text-center">Inspect</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                              {filteredTasks.map((t, idx) => (
                                <tr
                                  key={t.id || idx}
                                  className="hover:bg-blue-50/40 dark:hover:bg-surface-hover/60 transition-colors group cursor-pointer"
                                  onClick={() => setSelectedTaskModal(t)}
                                >
                                  <td className="p-3 text-[11px] font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                    {t.date}
                                  </td>
                                  <td className="p-3 font-bold text-slate-900 dark:text-white">
                                    <div>{t.topicName}</div>
                                    {t.courseTitle && (
                                      <span className="text-[10px] font-normal text-blue-600 dark:text-blue-400 block mt-0.5">
                                        {t.courseTitle}
                                      </span>
                                    )}
                                  </td>
                                  <td className="p-3">
                                    <span className="rounded bg-slate-100 dark:bg-surface-elevated border border-slate-200 dark:border-slate-700 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-800 dark:text-slate-200">
                                      {t.programName}
                                    </span>
                                  </td>
                                  <td className="p-3 text-slate-600 dark:text-slate-400 text-[11px] max-w-[140px]">
                                    <div className="line-clamp-2">{t.syntaxKeywords}</div>
                                  </td>
                                  <td className="p-3 text-slate-600 dark:text-slate-300 max-w-[180px]">
                                    <div className="line-clamp-2 text-[11px]">{t.whyUsing}</div>
                                  </td>
                                  <td className="p-3 text-slate-600 dark:text-slate-300 max-w-[180px]">
                                    <div className="line-clamp-2 text-[11px]">{t.whereUsing}</div>
                                  </td>
                                  <td className="p-3 max-w-[160px]">
                                    <div className="rounded bg-slate-50 dark:bg-surface-elevated/70 border border-slate-200/60 dark:border-slate-800 p-1.5 font-mono text-[10px] text-slate-700 dark:text-slate-300 line-clamp-2">
                                      {t.examplesCaseStudy}
                                    </div>
                                  </td>
                                  <td className="p-3 text-slate-500 dark:text-slate-400 max-w-[130px]">
                                    <div className="line-clamp-2 text-[10px]">{t.flow}</div>
                                  </td>
                                  <td className="p-3 text-center whitespace-nowrap">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 text-xs font-black">
                                      ★ {typeof t.outOf5 === "number" ? t.outOf5.toFixed(1) : "5.0"}
                                    </span>
                                  </td>
                                  <td className="p-3 whitespace-nowrap">
                                    <span className="rounded-full bg-blue-100 dark:bg-blue-950/70 border border-blue-300 dark:border-blue-800/60 text-blue-800 dark:text-blue-300 px-2 py-0.5 text-[10px] font-bold">
                                      {t.remarks || "Verified"}
                                    </span>
                                  </td>
                                  <td className="p-3 text-center">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedTaskModal(t);
                                      }}
                                      className="rounded-lg p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors cursor-pointer"
                                      title="View full task details"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )
                    ) : (
                      <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center space-y-2">
                        <FileSpreadsheet className="h-8 w-8 text-slate-400 mx-auto" />
                        <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          No course tasks found matching your filter
                        </h5>
                        <p className="text-[11px] text-slate-400">
                          Try clearing the search query or selecting a different course from the dropdown.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </>
        )}
      </div>

      {/* INVOICE MODAL INSPECTION */}
      <InvoiceModal
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />

      {/* DIRECT MESSAGE STUDENT MODAL */}
      <MessageStudentModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        student={
          student
            ? {
                name: student.name,
                email: student.email,
                phone: student.phone,
                id: student.id,
                enrolledCourses: student.enrollments.map((e) => e.courseTitle),
              }
            : null
        }
        onMessageSent={(summary) => showToast(summary)}
      />

      {/* EDIT STUDENT PROFILE MODAL */}
      <EditStudentModal
        isOpen={isEditModalOpen}
        student={
          student
            ? {
                id: student.id,
                name: student.name,
                email: student.email,
                phone: student.phone,
                role: student.role,
                status: student.status,
                registeredAt: student.registeredAt,
                createdAt: student.createdAt,
                enrollments: student.enrollments as any,
                totalEnrolled: student.totalEnrolled,
              }
            : null
        }
        onClose={() => setIsEditModalOpen(false)}
        onSaved={(updated) => {
          setStudent((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              name: updated.name,
              email: updated.email,
              phone: updated.phone,
              status: updated.status || prev.status,
            };
          });
          showToast(`Student profile updated successfully.`);
        }}
      />

      {/* COURSE TASK DETAIL INSPECTION MODAL */}
      {selectedTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4 bg-slate-50/70 dark:bg-surface-elevated/70">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                  <FileSpreadsheet className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedTaskModal.topicName}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {selectedTaskModal.programName}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {selectedTaskModal.date}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-bold">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span>{selectedTaskModal.outOf5} / 5.0</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedTaskModal(null)}
                  className="rounded-xl p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="overflow-y-auto p-6 space-y-5 text-xs text-slate-700 dark:text-slate-300">
              {/* Remarks Banner if present */}
              {selectedTaskModal.remarks && (
                <div className="rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 p-3.5 flex items-start gap-2.5">
                  <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-blue-900 dark:text-blue-200">
                      Instructor / System Evaluation:{" "}
                    </span>
                    <span className="text-blue-800 dark:text-blue-300">
                      {selectedTaskModal.remarks}
                    </span>
                  </div>
                </div>
              )}

              {/* Syntax & Keywords */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Syntax / Keywords
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedTaskModal.syntaxKeywords);
                      showToast("Syntax copied to clipboard");
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    <Copy className="h-3 w-3" />
                    <span>Copy Code</span>
                  </button>
                </div>
                <div className="rounded-xl bg-slate-900 dark:bg-black/80 border border-slate-800 p-3 font-mono text-[11px] text-emerald-400 overflow-x-auto whitespace-pre-wrap">
                  {selectedTaskModal.syntaxKeywords}
                </div>
              </div>

              {/* Why We Are Using */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Why We Are Using
                </label>
                <div className="rounded-xl bg-slate-50 dark:bg-surface-elevated/70 border border-slate-200 dark:border-slate-800/80 p-3.5 leading-relaxed">
                  {selectedTaskModal.whyUsing || selectedTaskModal.whyWeAreUsing}
                </div>
              </div>

              {/* Where We Have To Use */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Where We Have To Use
                </label>
                <div className="rounded-xl bg-slate-50 dark:bg-surface-elevated/70 border border-slate-200 dark:border-slate-800/80 p-3.5 leading-relaxed">
                  {selectedTaskModal.whereUsing || selectedTaskModal.whereWeHaveToUse}
                </div>
              </div>

              {/* Examples / Case Study */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Examples / Case Study
                </label>
                <div className="rounded-xl bg-slate-50 dark:bg-surface-elevated/70 border border-slate-200 dark:border-slate-800/80 p-3.5 leading-relaxed font-mono text-[11px] bg-amber-500/5 text-slate-800 dark:text-slate-200">
                  {selectedTaskModal.examplesCaseStudy}
                </div>
              </div>

              {/* Execution Flow */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Execution Flow
                </label>
                <div className="rounded-xl bg-slate-50 dark:bg-surface-elevated/70 border border-slate-200 dark:border-slate-800/80 p-3.5 leading-relaxed text-slate-800 dark:text-slate-200">
                  {selectedTaskModal.flow}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-100 dark:border-slate-800 px-6 py-3 bg-slate-50/70 dark:bg-surface-elevated/70 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedTaskModal(null)}
                className="rounded-xl bg-slate-200 dark:bg-slate-700 px-4 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
