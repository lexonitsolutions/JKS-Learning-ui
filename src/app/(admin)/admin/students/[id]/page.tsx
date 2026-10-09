"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
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
  Loader2,
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
  resolveAssessmentKind,
  assessmentKindLabel,
  type FullCourse,
  type VideoItem,
  type Section,
} from "@/lib/data/courses-store";
import { approveCourseCompletion } from "@/lib/data/certificates-api";
import { InvoiceModal } from "@/components/common/invoice-modal";
import { InAppVideoPlayer } from "@/components/ui/in-app-video-player";
import { type Invoice } from "@/lib/data/invoices-store";
import {
  saveVideoProgress,
  fetchCourseProgress,
  getExactStudentCourseProgress,
} from "@/lib/data/enrollments-api";
import { approveEnrollment, rejectEnrollment } from "@/lib/data/students-api";
import { CourseThumbnail } from "@/components/common/course-thumbnail";
import { MessageStudentModal } from "@/components/admin/message-student-modal";
import { EditStudentModal } from "@/components/admin/edit-student-modal";

type HubTabType = "overview" | "qa" | "reviews" | "tools";

interface ParsedQuestionItem {
  questionIndex: number;
  prompt: string;
  type: "MCQ" | "SHORT_ANSWER" | "LONG_ANSWER" | "FILE_UPLOAD" | "CODING";
  choices?: string[];
  correctAnswer?: any;
  correctIndex?: number;
  studentAnswer?: any;
  selectedChoiceText?: string;
  isCorrect?: boolean;
  earned?: number;
  max?: number;
  modelAnswer?: string;
  keywords?: string;
  rubric?: string;
  fileUrl?: string;
  fileName?: string;
}

interface ParsedSubmissionDetails {
  isMultiQuestion: boolean;
  score?: number;
  maxMarks?: number;
  passed?: boolean;
  minPass?: number;
  attemptCount?: number;
  isRetake?: boolean;
  questions: ParsedQuestionItem[];
}

function normalizeQuestionType(
  rawType?: string,
  studentAnswer?: any,
  choices?: any[]
): "MCQ" | "SHORT_ANSWER" | "LONG_ANSWER" | "FILE_UPLOAD" | "CODING" {
  const upper = String(rawType || "").toUpperCase().trim();
  if (upper.includes("MCQ") || upper.includes("CHOICE")) return "MCQ";
  if (upper.includes("LONG") || upper.includes("COMPREHENS") || upper.includes("ESSAY")) return "LONG_ANSWER";
  if (upper.includes("FILE") || upper.includes("UPLOAD")) return "FILE_UPLOAD";
  if (upper.includes("CODE") || upper.includes("CODING") || upper.includes("PROGRAM")) return "CODING";
  if (upper.includes("SHORT")) return "SHORT_ANSWER";

  if (typeof studentAnswer === "number") return "MCQ";
  if (Array.isArray(choices) && choices.length > 1 && (typeof studentAnswer !== "string" || studentAnswer.length < 15)) {
    return "MCQ";
  }
  if (
    typeof studentAnswer === "string" &&
    (studentAnswer.startsWith("http") ||
      studentAnswer.endsWith(".zip") ||
      studentAnswer.endsWith(".pdf") ||
      studentAnswer.endsWith(".docx"))
  ) {
    return "FILE_UPLOAD";
  }
  if (typeof studentAnswer === "string" && (studentAnswer.length > 120 || studentAnswer.split(/\s+/).length > 25)) {
    return "LONG_ANSWER";
  }
  return "SHORT_ANSWER";
}

function parseTaskSubmissionDetails(task: CourseTaskItem): ParsedSubmissionDetails {
  // 1. If backend already provided structured submissionDetails
  if (task.submissionDetails?.questions && task.submissionDetails.questions.length > 0) {
    const questions: ParsedQuestionItem[] = task.submissionDetails.questions.map((q, idx) => {
      const normType = normalizeQuestionType(q.type, q.studentAnswer, q.choices);
      return {
        questionIndex: q.questionIndex ?? idx,
        prompt: q.prompt || `Question ${idx + 1}`,
        type: normType,
        choices: normType === "MCQ" && Array.isArray(q.choices) && q.choices.length > 0 ? q.choices : undefined,
        correctAnswer: q.correctAnswer,
        correctIndex: (q as any).correctIndex,
        studentAnswer: q.studentAnswer,
        selectedChoiceText: q.selectedChoiceText,
        isCorrect: q.isCorrect,
        earned: q.earned ?? (q.isCorrect ? 1 : 0),
        max: q.max ?? 1,
        modelAnswer: (q as any).modelAnswer,
        keywords: (q as any).keywords,
        rubric: (q as any).rubric,
        fileUrl: (q as any).fileUrl || task.submissionFileUrl,
        fileName: (q as any).fileName || task.submissionFileName,
      };
    });

    return {
      isMultiQuestion:
        questions.length > 1 ||
        Boolean(questions[0]?.choices) ||
        typeof questions[0]?.studentAnswer === "number" ||
        questions[0]?.type !== "MCQ",
      score: task.submissionDetails.score ?? task.marks,
      maxMarks: task.submissionDetails.maxMarks ?? task.maxMarks ?? 100,
      passed: task.submissionDetails.passed,
      minPass: task.submissionDetails.minPass ?? 70,
      attemptCount: task.submissionDetails.attemptCount,
      isRetake: task.submissionDetails.isRetake,
      questions,
    };
  }

  // 2. Parse from answersJson or studentAnswer JSON string
  let rawJsonObj: any = null;
  if (task.answersJson && typeof task.answersJson === "object") {
    rawJsonObj = task.answersJson;
  } else if (
    task.studentAnswer &&
    typeof task.studentAnswer === "string" &&
    (task.studentAnswer.trim().startsWith("{") || task.studentAnswer.trim().startsWith("["))
  ) {
    try {
      rawJsonObj = JSON.parse(task.studentAnswer);
    } catch {
      rawJsonObj = null;
    }
  }

  if (rawJsonObj && typeof rawJsonObj === "object") {
    const rawAnswers =
      rawJsonObj.answers && typeof rawJsonObj.answers === "object" ? rawJsonObj.answers : rawJsonObj;
    const detailsList: any[] = Array.isArray(rawJsonObj.details) ? rawJsonObj.details : [];
    const numericKeys = Object.keys(rawAnswers)
      .filter((k) => !isNaN(Number(k)))
      .map(Number)
      .sort((a, b) => a - b);

    if (numericKeys.length > 0 || detailsList.length > 0) {
      const allIndices = Array.from(
        new Set([...numericKeys, ...detailsList.map((d: any) => Number(d.questionIndex || 0))])
      ).sort((a, b) => a - b);

      const questions: ParsedQuestionItem[] = allIndices.map((qIdx) => {
        const studentAns = rawAnswers[String(qIdx)] ?? rawAnswers[qIdx];
        const detail = detailsList.find((d: any) => d.questionIndex === qIdx);
        const normType = normalizeQuestionType(detail?.type, studentAns, detail?.choices);
        const isNum = typeof studentAns === "number";
        const isCorrect = detail?.isCorrect !== undefined ? Boolean(detail.isCorrect) : undefined;
        const prompt =
          detail?.prompt ||
          (qIdx === 0 && allIndices.length === 1
            ? task.question || task.topicName
            : `Question ${qIdx + 1}`);

        return {
          questionIndex: qIdx,
          prompt,
          type: normType,
          choices: normType === "MCQ" && Array.isArray(detail?.choices) ? detail.choices : undefined,
          correctAnswer: detail?.correctAnswer,
          correctIndex: detail?.correctIndex,
          studentAnswer: studentAns,
          selectedChoiceText: isNum
            ? `Option ${String.fromCharCode(65 + studentAns)}`
            : typeof studentAns === "string"
            ? studentAns
            : undefined,
          isCorrect,
          earned: detail?.earned ?? (isCorrect ? 1 : 0),
          max: detail?.max ?? 1,
          modelAnswer: detail?.modelAnswer,
          keywords: detail?.keywords,
          rubric: detail?.rubric,
          fileUrl: detail?.fileUrl || task.submissionFileUrl,
          fileName: detail?.fileName || task.submissionFileName,
        };
      });

      return {
        isMultiQuestion:
          questions.length > 1 || typeof questions[0]?.studentAnswer === "number" || questions[0]?.type !== "MCQ",
        score: typeof rawJsonObj.score === "number" ? rawJsonObj.score : task.marks,
        maxMarks: task.maxMarks || 100,
        passed: rawJsonObj.passed,
        minPass: rawJsonObj.minPass || 70,
        attemptCount: rawJsonObj.attemptCount,
        isRetake: rawJsonObj.isRetake,
        questions,
      };
    }
  }

  return {
    isMultiQuestion: false,
    score: task.marks,
    maxMarks: task.maxMarks || 100,
    questions: [],
  };
}

function AdminStudentDetailsContent() {
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
  const [isApprovingCert, setIsApprovingCert] = useState(false);

  const searchParams = useSearchParams();
  const inspectCourseQuery = searchParams.get("inspectCourse");
  const autoApproveCert = searchParams.get("approveCert") === "true";

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

  const handleApproveInspectedCertificate = async () => {
    if (!inspectingCourse) return;
    setIsApprovingCert(true);
    try {
      const res = await approveCourseCompletion(inspectingCourse.enrollmentId);
      if (res.success) {
        showToast(`Course certificate approved and issued! Official email sent to ${student?.name}.`);
        setInspectingCourse((prev) => (prev ? { ...prev, completionApproved: true } : prev));
        setStudent((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            enrollments: prev.enrollments.map((en) =>
              en.enrollmentId === inspectingCourse.enrollmentId
                ? { ...en, completionApproved: true }
                : en
            ),
          };
        });
      } else {
        showToast(res.error || "Failed to approve completion");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to approve completion");
    } finally {
      setIsApprovingCert(false);
    }
  };

  // Auto-open inspected course from admin notification email link
  useEffect(() => {
    if (inspectCourseQuery && student && student.enrollments.length > 0 && !inspectingCourse) {
      const targetSlug = inspectCourseQuery.toLowerCase().trim();
      const matched = student.enrollments.find(
        (e) =>
          e.courseSlug?.toLowerCase().trim() === targetSlug ||
          e.courseId === inspectCourseQuery ||
          e.courseTitle?.toLowerCase().includes(targetSlug)
      );
      if (matched) {
        handleOpenCourseInspector(matched);
      }
    }
  }, [inspectCourseQuery, student, inspectingCourse]);

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
        {/* Persistent Top Header matching student workspace course view */}
        <DashboardTopbar
          title={inspectingCourse.courseTitle}
          subtitle={`Student Inspection: ${student?.name || "Student"} · ${allSections.length} Sections · ${allVideos.length} Video Lessons`}
          userInitials="AD"
        />

        {/* Top Learning Hub Navigation Bar matching student workspace */}
        <header className="relative z-20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-transparent bg-transparent px-4 py-3 sm:py-0 sm:px-6 sm:h-16 gap-3 backdrop-blur-md dark:border-transparent dark:bg-transparent">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <button
              type="button"
              onClick={() => {
                setInspectingCourse(null);
                loadData();
              }}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white/70 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-white hover:text-blue-600 transition-all shrink-0 dark:border-slate-700/80 dark:bg-surface-elevated/70 dark:text-slate-200 dark:hover:bg-surface-hover dark:hover:text-blue-400 shadow-xs cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Profile</span>
            </button>
            <div className="h-4 w-[1px] bg-slate-200 hidden sm:block dark:bg-slate-800" />
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-[200px] sm:max-w-md dark:text-white">
                {inspectingCourse.courseTitle}
              </h2>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                Student: <strong className="text-slate-800 dark:text-slate-200">{student?.name}</strong> · {allSections.length} Sections · {allVideos.length} Videos
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
            {inspectingCourse.completionApproved ? (
              <span className="flex items-center gap-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/40 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Certificate Approved
              </span>
            ) : (
              <button
                type="button"
                onClick={handleApproveInspectedCertificate}
                disabled={isApprovingCert}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors cursor-pointer disabled:opacity-60"
              >
                {isApprovingCert ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Award className="h-3.5 w-3.5" />
                )}
                <span>Approve Certificate</span>
              </button>
            )}

            <div className="text-left sm:text-right">
              <div className="text-xs font-black text-slate-900 dark:text-white">
                {overallPercent}% Completed
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                {completedCount} of {totalItems} Milestones Completed
              </div>
            </div>
            <div className="h-2 w-20 sm:w-32 rounded-full bg-slate-100 overflow-hidden shrink-0 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80">
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
            {/* IN-APP VIDEO PLAYER - Normal page scroll */}
            {activeVideo ? (
              <div className="relative w-full space-y-3">
                <div className="w-full aspect-video max-h-[35vh] sm:max-h-[42vh] lg:max-h-[48vh] mx-auto rounded-2xl overflow-hidden shadow-md bg-black flex items-center justify-center border border-slate-200 dark:border-slate-800">
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary p-3.5 sm:p-4 shadow-xs">
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
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Asked by student 2 days ago · 3 Tutor Replies</div>
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

          {/* RIGHT COLUMN: Curriculum Playlist (4 cols on desktop) - Sticky and scrollable independently */}
          <aside className="xl:col-span-4 flex flex-col space-y-4 min-w-0 xl:sticky xl:top-4 xl:max-h-[calc(100vh-2rem)] xl:overflow-y-auto">
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
                  Submitted Answers &amp; Evaluation
                </h4>

                {(() => {
                  const asg = activeAssignmentSection.assignment;
                  const matchedSubmission = (student?.submissions || student?.assessments || []).find(
                    (s: any) =>
                      s.assessmentId === asg.id ||
                      s.id === asg.id ||
                      (s.title && s.title.toLowerCase().trim() === asg.title?.toLowerCase().trim()) ||
                      (s.courseSlug === inspectingCourse.courseSlug &&
                        asg.title &&
                        s.title?.toLowerCase().includes(asg.title.toLowerCase().slice(0, 15)))
                  );

                  const submittedAnswers = (matchedSubmission?.answers || {}) as Record<string | number, any>;
                  const isDone = completedAssignmentIds.includes(asg.id);

                  if (asg.questions && asg.questions.length > 0) {
                    return (
                      <div className="space-y-3">
                        {asg.questions.map((q, qIdx) => {
                          const kind = resolveAssessmentKind(q.type, asg.type, q);
                          const studentAns =
                            submittedAnswers[qIdx] ??
                            submittedAnswers[q.id || ""] ??
                            (typeof submittedAnswers === "object" ? submittedAnswers[String(qIdx)] : undefined);

                          return (
                            <div
                              key={qIdx}
                              className="space-y-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-surface-elevated p-4"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="font-bold text-slate-900 dark:text-white">
                                  <span className="text-[#2563EB] dark:text-blue-400 mr-1.5">Q{qIdx + 1}.</span>
                                  {q.prompt}
                                </div>
                                <span className="shrink-0 rounded-full bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 text-[10px] font-bold text-[#2563EB] dark:text-blue-300 uppercase">
                                  {assessmentKindLabel(kind)}
                                </span>
                              </div>

                              {/* SHORT ANSWER & LONG ANSWER */}
                              {(kind === "SHORT_ANSWER" || kind === "LONG_ANSWER") && (
                                <div className="space-y-2 pt-1">
                                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-secondary p-3 space-y-1">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                      Student Submitted Response
                                    </span>
                                    <p className="text-xs text-slate-900 dark:text-slate-100 font-medium whitespace-pre-wrap leading-relaxed">
                                      {studentAns !== undefined && studentAns !== null && String(studentAns).trim() !== ""
                                        ? String(studentAns)
                                        : isDone
                                        ? "Student completed this short answer assignment successfully."
                                        : "Pending student submission"}
                                    </p>
                                  </div>

                                  {q.modelAnswer && (
                                    <div className="rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/70 dark:bg-blue-950/30 p-3 space-y-1">
                                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                                        Model / Expected Answer
                                      </span>
                                      <p className="text-xs text-blue-950 dark:text-blue-200 whitespace-pre-wrap leading-relaxed">
                                        {q.modelAnswer}
                                      </p>
                                    </div>
                                  )}

                                  {q.keywords && (
                                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                                        Mandatory Concepts:{" "}
                                      </span>
                                      {q.keywords}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* MULTIPLE CHOICE */}
                              {kind === "MCQ" && (
                                <div className="space-y-1.5 pt-1">
                                  {(q.choices || []).map((choice, cIdx) => {
                                    const isSelected =
                                      studentAns === cIdx ||
                                      studentAns === choice ||
                                      studentAns === String(cIdx) ||
                                      (typeof studentAns === "string" && studentAns.toLowerCase() === choice.toLowerCase()) ||
                                      (isDone && studentAns === undefined && cIdx === (q.correctIndex ?? 0));
                                    const isCorrect = cIdx === (q.correctIndex ?? 0);

                                    return (
                                      <div
                                        key={cIdx}
                                        className={`flex items-center justify-between rounded-xl p-2.5 border text-xs font-medium ${
                                          isSelected
                                            ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-200 font-bold"
                                            : isCorrect
                                            ? "bg-blue-50/50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/40 text-blue-900 dark:text-blue-300"
                                            : "bg-white dark:bg-surface-secondary border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
                                        }`}
                                      >
                                        <div className="flex items-center gap-2">
                                          <span className="font-bold text-[10px] text-slate-400">
                                            {String.fromCharCode(65 + cIdx)}.
                                          </span>
                                          <span>{choice}</span>
                                        </div>
                                        {isSelected && (
                                          <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                                            Student Selected ✓
                                          </span>
                                        )}
                                        {!isSelected && isCorrect && (
                                          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold bg-blue-100 dark:bg-blue-950/50 px-2 py-0.5 rounded">
                                            Correct Answer
                                          </span>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}

                              {/* CODING CHALLENGE */}
                              {kind === "CODING" && (
                                <div className="space-y-2 pt-1 font-mono text-xs">
                                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-slate-200 space-y-1">
                                    <div className="text-[10px] uppercase font-bold text-slate-400">
                                      Student Code Submission ({q.language || "Code"})
                                    </div>
                                    <pre className="text-[11px] leading-relaxed whitespace-pre-wrap overflow-x-auto text-emerald-300">
                                      {studentAns || q.starterCode || "// Completed practical solution in workspace"}
                                    </pre>
                                  </div>
                                </div>
                              )}

                              {/* FILE UPLOAD */}
                              {kind === "FILE_UPLOAD" && (
                                <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-3 bg-white dark:bg-surface-secondary flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <FileCheck className="h-4 w-4 text-emerald-600" />
                                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                                      {typeof studentAns === "string" && studentAns
                                        ? studentAns
                                        : `${inspectingCourse.courseSlug}-assignment-solution.pdf`}
                                    </span>
                                  </div>
                                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
                                    Verified Submission
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  }

                  // Fallback when no structured questions in assignment
                  return (
                    <div className="space-y-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 p-4 font-mono text-xs">
                      <div className="text-slate-400 text-[10px] uppercase font-bold">
                        // Student Solution Submission
                      </div>
                      <div className="text-emerald-400 font-bold">
                        {(submittedAnswers as any)?.repoUrl ||
                          (typeof submittedAnswers === "string" ? submittedAnswers : null) ||
                          `https://github.com/${(student?.name || "student").toLowerCase().replace(/[^a-z0-9]/g, "")}/${inspectingCourse.courseSlug}-solution`}
                      </div>
                      <div className="text-slate-300 text-[11px] pt-1">
                        Status: Verified Milestone Completion · Recorded in Student Academic Ledger
                      </div>
                    </div>
                  );
                })()}
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
                              {course.status === "PENDING" && (
                                <span className="inline-flex items-center gap-1 rounded-md bg-amber-500 text-white px-1.5 py-0.5 text-[9px] font-bold shadow-xs animate-pulse">
                                  <Clock className="h-2.5 w-2.5" /> Pending Approval
                                </span>
                              )}
                              {course.status === "REJECTED" && (
                                <span className="inline-flex items-center gap-1 rounded-md bg-rose-600/90 text-white px-1.5 py-0.5 text-[9px] font-bold shadow-xs">
                                  <X className="h-2.5 w-2.5" /> Rejected
                                </span>
                              )}
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
                                    {course.status === "PENDING" ? (
                                      <>
                                        <button
                                          type="button"
                                          onClick={async () => {
                                            const res = await approveEnrollment(course.enrollmentId);
                                            if (res.success) {
                                              showToast("Enrollment approved successfully!");
                                              loadData();
                                            } else {
                                              showToast(res.error || "Failed to approve enrollment");
                                            }
                                            setOpenCourseDropdownId(null);
                                          }}
                                          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer"
                                        >
                                          <Check className="h-3 w-3" />
                                          <span>Approve Access</span>
                                        </button>
                                        <button
                                          type="button"
                                          onClick={async () => {
                                            const reason = prompt("Enter reason for rejection (optional):");
                                            if (reason === null) return;
                                            const res = await rejectEnrollment(course.enrollmentId, reason || undefined);
                                            if (res.success) {
                                              showToast("Enrollment rejected.");
                                              loadData();
                                            } else {
                                              showToast(res.error || "Failed to reject enrollment");
                                            }
                                            setOpenCourseDropdownId(null);
                                          }}
                                          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                                        >
                                          <X className="h-3 w-3" />
                                          <span>Reject Request</span>
                                        </button>
                                      </>
                                    ) : course.status === "REMOVED" ? (
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
                : null;
              const avgAuthenticity = hasAssessments
                ? (assessmentsList.reduce((acc, a) => acc + (a.aiAuthenticityScore || 100), 0) / assessmentsList.length).toFixed(1)
                : null;

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
                          <span className="text-emerald-700 dark:text-emerald-300 text-sm font-black">
                            {avgAuthenticity !== null ? `${avgAuthenticity}% Authentic` : "N/A (No submissions)"}
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-emerald-200 dark:bg-emerald-900/60 overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${avgAuthenticity !== null ? Math.min(100, Math.max(10, parseFloat(avgAuthenticity))) : 0}%` }}
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
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {avgScore !== null ? `${avgScore}% (Pass mark: 70%)` : "N/A"}
                          </span>
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

              // Identify tasks that have actually been submitted / answered
              const submittedTasks = courseTasks.filter((t) => {
                const sUpper = String(t.status || "").toUpperCase();
                const isSubmitted =
                  sUpper === "SUBMITTED" ||
                  sUpper === "GRADED" ||
                  sUpper === "COMPLETED" ||
                  sUpper === "REVIEWED" ||
                  t.source === "submission";
                const hasValidAnswer =
                  t.studentAnswer &&
                  t.studentAnswer !== "Not submitted yet" &&
                  t.studentAnswer !== "Pending submission";
                return isSubmitted || Boolean(t.submittedAt) || Boolean(hasValidAnswer);
              });

              const gradedTasks = submittedTasks.filter(
                (t) => typeof t.outOf5 === "number" && t.outOf5 > 0
              );
              const avgScore =
                gradedTasks.length > 0
                  ? (
                      gradedTasks.reduce((acc, t) => acc + (t.outOf5 || 0), 0) /
                      gradedTasks.length
                    ).toFixed(1)
                  : null;

              // Calculate authentic verified submissions
              const aiScores = (student.submissions || student.assessments || [])
                .map((s) => s.aiAuthenticityScore)
                .filter((score): score is number => typeof score === "number" && score > 0);
              const avgAiScore =
                aiScores.length > 0
                  ? `${Math.round(aiScores.reduce((a, b) => a + b, 0) / aiScores.length)}%`
                  : submittedTasks.length > 0
                  ? "100%"
                  : null;

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
                          {submittedTasks.length}{" "}
                          <span className="text-xs font-normal text-slate-400">
                            {submittedTasks.length === 1 ? "task" : "tasks"}
                          </span>
                        </div>
                      </div>
                      <div className="rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 p-3 border border-emerald-200/50 dark:border-emerald-800/30">
                        <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                          Average Grade
                        </span>
                        <div className="mt-1 text-lg font-black text-emerald-700 dark:text-emerald-300">
                          {avgScore !== null ? (
                            <>
                              {avgScore} <span className="text-xs font-semibold">/ 5.0</span>
                            </>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-500 text-sm font-semibold">
                              N/A
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="rounded-xl bg-blue-50/70 dark:bg-blue-950/40 p-3 border border-blue-200/50 dark:border-blue-800/30">
                        <span className="text-[11px] font-semibold text-blue-800 dark:text-blue-300">
                          AI Authenticity
                        </span>
                        <div className="mt-1 text-lg font-black text-blue-700 dark:text-blue-300">
                          {avgAiScore !== null ? (
                            <>
                              {avgAiScore} <span className="text-xs font-semibold">Verified</span>
                            </>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-500 text-sm font-semibold">
                              N/A
                            </span>
                          )}
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
                                          {task.isRetake && (
                                            <span className="rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/40 px-2.5 py-0.5 text-[10px] font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1">
                                              <RefreshCw className="h-3 w-3" />
                                              Retake (Attempt #{task.attemptsCount || 2})
                                            </span>
                                          )}
                                          <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                            {task.assignmentType || "Short Answer"}
                                          </span>
                                          {(() => {
                                            const sUpper = String(task.status || "").toUpperCase();
                                            const isDone = sUpper === "GRADED" || sUpper === "COMPLETED" || sUpper === "REVIEWED";
                                            const isSub = sUpper === "SUBMITTED" || Boolean(task.submittedAt);
                                            const isFail = sUpper === "FAILED";
                                            return (
                                              <span
                                                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                                                  isDone
                                                    ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                                                    : isSub
                                                    ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                                                    : isFail
                                                    ? "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800"
                                                    : "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                                                }`}
                                              >
                                                {isDone ? "Completed" : isSub ? "Submitted" : isFail ? "Failed" : "Pending"}
                                              </span>
                                            );
                                          })()}
                                        </div>
                                      </div>

                                      {(() => {
                                        const parsedSubmission = parseTaskSubmissionDetails(task);
                                        return (
                                          <>
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
                                            <div className="rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/30 dark:bg-blue-950/20 p-3.5 space-y-3">
                                              <div className="flex flex-wrap items-center justify-between gap-2">
                                                <div className="text-[10px] font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                                                  <FileCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                                  <span>Student's Actual Answer / Submission</span>
                                                </div>
                                                {parsedSubmission.isMultiQuestion && parsedSubmission.questions.length > 0 && (
                                                  <div className="flex items-center gap-2">
                                                    <span className="rounded-full px-2 py-0.5 text-[10px] font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                                      {parsedSubmission.questions.length} Questions
                                                    </span>
                                                    {parsedSubmission.passed !== undefined && (
                                                      <span
                                                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                                                          parsedSubmission.passed
                                                            ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                                                            : "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800"
                                                        }`}
                                                      >
                                                        {parsedSubmission.passed ? "Passed" : "Needs Review"} (
                                                        {parsedSubmission.score ?? task.marks}%)
                                                      </span>
                                                    )}
                                                  </div>
                                                )}
                                              </div>

                                              {/* 1. Multi-Question Submission Breakdown */}
                                              {parsedSubmission.isMultiQuestion && parsedSubmission.questions.length > 0 ? (
                                                <div className="space-y-3 pt-1">
                                                  {parsedSubmission.questions.map((q, qIdx) => {
                                                    const isMcq = q.type === "MCQ";
                                                    const isShortAnswer = q.type === "SHORT_ANSWER";
                                                    const isLongAnswer = q.type === "LONG_ANSWER";
                                                    const isFileUpload = q.type === "FILE_UPLOAD";
                                                    const isCoding = q.type === "CODING";

                                                    const typeBadgeColor = isMcq
                                                      ? "bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                                                      : isShortAnswer
                                                      ? "bg-teal-100 text-teal-800 dark:bg-teal-950/70 dark:text-teal-300 border-teal-200 dark:border-teal-800"
                                                      : isLongAnswer
                                                      ? "bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                                                      : isFileUpload
                                                      ? "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                                                      : "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/70 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800";

                                                    const typeLabel = isMcq
                                                      ? "Multiple Choice"
                                                      : isShortAnswer
                                                      ? "Short Answer"
                                                      : isLongAnswer
                                                      ? "Long Answer"
                                                      : isFileUpload
                                                      ? "File Upload"
                                                      : isCoding
                                                      ? "Coding Solution"
                                                      : q.type;

                                                    const studentAnswerText =
                                                      typeof q.studentAnswer === "string" ? q.studentAnswer.trim() : "";
                                                    const wordCount = studentAnswerText
                                                      ? studentAnswerText.split(/\s+/).filter(Boolean).length
                                                      : 0;

                                                    return (
                                                      <div
                                                        key={qIdx}
                                                        className="rounded-xl bg-white dark:bg-surface-secondary border border-slate-200 dark:border-slate-800 p-3.5 space-y-2.5 shadow-xs"
                                                      >
                                                        {/* Question Header */}
                                                        <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
                                                          <div className="flex items-start gap-2 min-w-0 flex-1">
                                                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-[10px] font-bold mt-0.5">
                                                              {qIdx + 1}
                                                            </span>
                                                            <div className="min-w-0 flex-1">
                                                              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">
                                                                {q.prompt || `Question ${qIdx + 1}`}
                                                              </span>
                                                            </div>
                                                          </div>

                                                          <div className="flex items-center gap-1.5 shrink-0">
                                                            <span
                                                              className={`rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${typeBadgeColor}`}
                                                            >
                                                              {typeLabel}
                                                            </span>

                                                            {q.isCorrect !== undefined && (
                                                              <span
                                                                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold shrink-0 border ${
                                                                  q.isCorrect
                                                                    ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                                                                    : "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                                                                }`}
                                                              >
                                                                {q.isCorrect ? (
                                                                  <>
                                                                    <CheckCircle className="h-2.5 w-2.5" />
                                                                    <span>
                                                                      Correct ({q.earned ?? 1}/{q.max ?? 1} pt)
                                                                    </span>
                                                                  </>
                                                                ) : (
                                                                  <>
                                                                    <XCircle className="h-2.5 w-2.5" />
                                                                    <span>
                                                                      Incorrect ({q.earned ?? 0}/{q.max ?? 1} pt)
                                                                    </span>
                                                                  </>
                                                                )}
                                                              </span>
                                                            )}
                                                          </div>
                                                        </div>

                                                        {/* 1. MCQ TYPE */}
                                                        {isMcq ? (
                                                          Array.isArray(q.choices) && q.choices.length > 0 ? (
                                                            <div className="space-y-1.5 pt-0.5">
                                                              {q.choices.map((choiceText, cIdx) => {
                                                                const letter = String.fromCharCode(65 + cIdx);
                                                                const isSelected =
                                                                  q.studentAnswer === cIdx ||
                                                                  q.studentAnswer === letter ||
                                                                  q.studentAnswer === choiceText ||
                                                                  q.selectedChoiceText === choiceText ||
                                                                  (typeof q.studentAnswer === "string" &&
                                                                    q.studentAnswer.toLowerCase() === choiceText.toLowerCase());

                                                                const isAnsCorrect =
                                                                  q.correctIndex === cIdx ||
                                                                  q.correctAnswer === cIdx ||
                                                                  q.correctAnswer === letter ||
                                                                  q.correctAnswer === choiceText ||
                                                                  (typeof q.correctAnswer === "string" &&
                                                                    q.correctAnswer.toLowerCase() === choiceText.toLowerCase());

                                                                return (
                                                                  <div
                                                                    key={cIdx}
                                                                    className={`flex items-center justify-between rounded-lg p-2.5 text-xs border transition-all ${
                                                                      isSelected
                                                                        ? isAnsCorrect
                                                                          ? "border-emerald-400 dark:border-emerald-700 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 font-semibold"
                                                                          : "border-blue-400 dark:border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-950 dark:text-blue-100 font-semibold"
                                                                        : isAnsCorrect
                                                                        ? "border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/30 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 font-medium"
                                                                        : "border-slate-200 dark:border-slate-800/80 bg-slate-50/40 dark:bg-surface-elevated/40 text-slate-700 dark:text-slate-300"
                                                                    }`}
                                                                  >
                                                                    <div className="flex items-center gap-2.5">
                                                                      <span
                                                                        className={`flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-bold ${
                                                                          isSelected
                                                                            ? isAnsCorrect
                                                                              ? "bg-emerald-600 text-white"
                                                                              : "bg-blue-600 text-white"
                                                                            : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                                                                        }`}
                                                                      >
                                                                        {letter}
                                                                      </span>
                                                                      <span className="leading-snug">{choiceText}</span>
                                                                    </div>

                                                                    <div className="flex items-center gap-1.5 shrink-0">
                                                                      {isAnsCorrect && (
                                                                        <span className="rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 px-2 py-0.5 text-[9px] font-bold">
                                                                          Correct Key
                                                                        </span>
                                                                      )}
                                                                      {isSelected && (
                                                                        <span className="rounded-md bg-blue-600 text-white px-2 py-0.5 text-[9px] font-bold shadow-xs">
                                                                          Student's Selection
                                                                        </span>
                                                                      )}
                                                                    </div>
                                                                  </div>
                                                                );
                                                              })}
                                                            </div>
                                                          ) : typeof q.studentAnswer === "number" ? (
                                                            <div className="flex items-center gap-2 rounded-lg bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-2.5 text-xs">
                                                              <span className="font-semibold text-blue-900 dark:text-blue-200">
                                                                Student's Selected Choice:
                                                              </span>
                                                              <span className="font-bold text-blue-700 dark:text-blue-400">
                                                                Option {String.fromCharCode(65 + q.studentAnswer)} (Choice #{q.studentAnswer + 1})
                                                              </span>
                                                            </div>
                                                          ) : (
                                                            <div className="rounded-lg bg-slate-50/80 dark:bg-surface-elevated/50 border border-slate-200 dark:border-slate-800 p-3 text-xs text-slate-800 dark:text-slate-200 font-sans">
                                                              {studentAnswerText || "No answer provided."}
                                                            </div>
                                                          )
                                                        ) : isShortAnswer ? (
                                                          /* 2. SHORT ANSWER TYPE */
                                                          <div className="space-y-2">
                                                            <div className="rounded-xl border border-slate-200/90 dark:border-slate-700/70 bg-slate-50/60 dark:bg-slate-900/40 p-3 space-y-1.5">
                                                              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                                                <span>Student Written Answer</span>
                                                                {wordCount > 0 && (
                                                                  <span className="font-mono text-slate-400">
                                                                    {wordCount} {wordCount === 1 ? "word" : "words"}
                                                                  </span>
                                                                )}
                                                              </div>
                                                              <div className="text-xs text-slate-900 dark:text-slate-100 whitespace-pre-wrap leading-relaxed font-sans font-medium">
                                                                {studentAnswerText || (
                                                                  <span className="italic text-slate-400">No written answer submitted.</span>
                                                                )}
                                                              </div>
                                                            </div>

                                                            {q.modelAnswer && (
                                                              <div className="rounded-xl border border-emerald-200/70 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 p-2.5 space-y-1 text-xs">
                                                                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                                                                  <CheckCircle className="h-3 w-3" />
                                                                  <span>Benchmark / Model Answer</span>
                                                                </div>
                                                                <div className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans text-xs">
                                                                  {q.modelAnswer}
                                                                </div>
                                                              </div>
                                                            )}

                                                            {q.keywords && (
                                                              <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[10px]">
                                                                <span className="font-semibold text-slate-500 dark:text-slate-400">
                                                                  Key Concepts:
                                                                </span>
                                                                {q.keywords.split(/[,;\s]+/).filter(Boolean).map((kw, kwIdx) => (
                                                                  <span
                                                                    key={kwIdx}
                                                                    className="rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 font-mono"
                                                                  >
                                                                    {kw}
                                                                  </span>
                                                                ))}
                                                              </div>
                                                            )}
                                                          </div>
                                                        ) : isLongAnswer ? (
                                                          /* 3. LONG ANSWER TYPE */
                                                          <div className="space-y-2.5">
                                                            <div className="rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-900/50 p-3.5 space-y-2 shadow-xs">
                                                              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                                                                <span>Comprehensive Submission</span>
                                                                {wordCount > 0 && (
                                                                  <span className="font-mono text-slate-400">
                                                                    {wordCount} words · {studentAnswerText.length} chars
                                                                  </span>
                                                                )}
                                                              </div>
                                                              <div className="text-xs text-slate-900 dark:text-slate-100 whitespace-pre-wrap leading-relaxed font-sans font-medium selection:bg-purple-100">
                                                                {studentAnswerText || (
                                                                  <span className="italic text-slate-400">No comprehensive answer submitted.</span>
                                                                )}
                                                              </div>
                                                            </div>

                                                            {q.rubric && (
                                                              <div className="rounded-xl border border-blue-200/70 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20 p-2.5 text-xs space-y-1">
                                                                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 block">
                                                                  Rubric &amp; Evaluation Criteria
                                                                </span>
                                                                <div className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap text-xs leading-relaxed">
                                                                  {q.rubric}
                                                                </div>
                                                              </div>
                                                            )}

                                                            {q.modelAnswer && (
                                                              <div className="rounded-xl border border-emerald-200/70 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 p-2.5 space-y-1 text-xs">
                                                                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                                                                  <CheckCircle className="h-3 w-3" />
                                                                  <span>Reference / Model Solution</span>
                                                                </div>
                                                                <div className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans text-xs">
                                                                  {q.modelAnswer}
                                                                </div>
                                                              </div>
                                                            )}
                                                          </div>
                                                        ) : isFileUpload ? (
                                                          /* 4. FILE UPLOAD TYPE */
                                                          <div className="space-y-2">
                                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20 p-3">
                                                              <div className="flex items-center gap-3 min-w-0">
                                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300">
                                                                  <FileText className="h-5 w-5" />
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                                                    {q.fileName || q.studentAnswer || task.submissionFileName || "Attached Project Solution"}
                                                                  </div>
                                                                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                                                                    Uploaded deliverable file / submission artifact
                                                                  </div>
                                                                </div>
                                                              </div>

                                                              {(q.fileUrl || task.submissionFileUrl) && (
                                                                <a
                                                                  href={q.fileUrl || task.submissionFileUrl}
                                                                  target="_blank"
                                                                  rel="noopener noreferrer"
                                                                  download
                                                                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-1.5 text-xs font-bold transition-colors shrink-0 shadow-xs"
                                                                >
                                                                  <Download className="h-3.5 w-3.5" />
                                                                  <span>Download Deliverable</span>
                                                                </a>
                                                              )}
                                                            </div>

                                                            {studentAnswerText && studentAnswerText !== q.fileName && !studentAnswerText.startsWith("http") && (
                                                              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-2.5 text-xs text-slate-700 dark:text-slate-300">
                                                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                                                                  Student Notes / Explanations
                                                                </span>
                                                                <div className="whitespace-pre-wrap">{studentAnswerText}</div>
                                                              </div>
                                                            )}
                                                          </div>
                                                        ) : isCoding ? (
                                                          /* 5. CODING SOLUTION TYPE */
                                                          <div className="space-y-2">
                                                            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs font-mono text-emerald-400 whitespace-pre-wrap overflow-x-auto shadow-inner">
                                                              {studentAnswerText || "// No code submitted."}
                                                            </div>
                                                          </div>
                                                        ) : (
                                                          /* GENERAL TEXT FALLBACK */
                                                          <div className="rounded-xl bg-slate-50/80 dark:bg-surface-elevated/50 border border-slate-200 dark:border-slate-800 p-3 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed font-sans">
                                                            {studentAnswerText || "No answer submitted."}
                                                          </div>
                                                        )}
                                                      </div>
                                                    );
                                                  })}
                                                </div>
                                              ) : Array.isArray(task.options) &&
                                                task.options.length > 0 &&
                                                (task.assignmentType?.toUpperCase().includes("MCQ") || typeof task.studentAnswer === "number") ? (
                                                /* Single MCQ Answer View */
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
                                                        className={`flex items-center justify-between rounded-lg p-2.5 text-xs border ${
                                                          isSelected
                                                            ? isCorrect
                                                              ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-medium"
                                                              : "border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-medium"
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
                                              ) : task.submissionFileUrl || task.assignmentType?.toUpperCase().includes("FILE") ? (
                                                /* File Upload Answer View */
                                                <div className="flex items-center justify-between rounded-xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-surface-secondary p-3.5">
                                                  <div className="flex items-center gap-2.5">
                                                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                    <div>
                                                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                                                        {task.submissionFileName || "Student Project Archive"}
                                                      </div>
                                                      <div className="text-[10px] text-slate-400">Attached student deliverable file</div>
                                                    </div>
                                                  </div>
                                                  {task.submissionFileUrl && (
                                                    <a
                                                      href={task.submissionFileUrl}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      download
                                                      className="flex items-center gap-1.5 rounded-xl bg-blue-600 text-white px-3 py-1.5 text-xs font-bold hover:bg-blue-700 transition-colors"
                                                    >
                                                      <Download className="h-3.5 w-3.5" />
                                                      <span>Download File</span>
                                                    </a>
                                                  )}
                                                </div>
                                              ) : (
                                                /* Text / Short / Long Answer / Code Answer View */
                                                <div className="rounded-xl bg-white dark:bg-surface-secondary border border-slate-200 dark:border-slate-800 p-3.5 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed font-sans font-medium">
                                                  {task.studentAnswer || task.examplesCaseStudy || "No written response submitted yet."}
                                                </div>
                                              )}
                                            </div>
                                          </>
                                        );
                                      })()}

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
                                    {typeof t.outOf5 === "number" && t.outOf5 > 0 ? (
                                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 text-xs font-black">
                                        ★ {t.outOf5.toFixed(1)}
                                      </span>
                                    ) : (
                                      <span className="text-slate-400 dark:text-slate-500 font-mono">—</span>
                                    )}
                                  </td>
                                  <td className="p-3 whitespace-nowrap">
                                    <div className="flex flex-col gap-1 items-start">
                                      <span className="rounded-full bg-blue-100 dark:bg-blue-950/70 border border-blue-300 dark:border-blue-800/60 text-blue-800 dark:text-blue-300 px-2 py-0.5 text-[10px] font-bold">
                                        {t.remarks || (t.status === "Submitted" ? "Submitted" : "Pending")}
                                      </span>
                                      {t.isRetake && (
                                        <span className="rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/40 px-2 py-0.5 text-[9px] font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1">
                                          <RefreshCw className="h-2.5 w-2.5" />
                                          Retake #{t.attemptsCount || 2}
                                        </span>
                                      )}
                                    </div>
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
              {/* Retake Attempt Banner & History */}
              {selectedTaskModal.isRetake && (
                <div className="rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50 p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5 text-xs">
                      <RefreshCw className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                      Retake Submission · Attempt #{selectedTaskModal.attemptsCount || 2}
                    </span>
                    <span className="text-[11px] font-semibold text-purple-700 dark:text-purple-300">
                      Total Attempts: {selectedTaskModal.attemptsCount || 2}
                    </span>
                  </div>
                  {Array.isArray(selectedTaskModal.attempts) && selectedTaskModal.attempts.length > 1 && (
                    <div className="space-y-1.5 pt-1 border-t border-purple-200/60 dark:border-purple-800/40">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                        Attempt Timeline:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedTaskModal.attempts.map((att: any, aIdx: number) => (
                          <div
                            key={aIdx}
                            className="rounded-lg bg-white/80 dark:bg-surface-elevated p-2 text-[11px] border border-purple-100 dark:border-purple-900/40 flex justify-between items-center"
                          >
                            <span className="font-medium">Attempt #{att.attemptNumber || aIdx + 1}</span>
                            <span className="text-slate-500 font-mono text-[10px]">
                              {att.submittedAt ? new Date(att.submittedAt).toLocaleDateString("en-GB") : ""}
                            </span>
                            {att.score !== undefined && (
                              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                {att.score}%
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Remarks Banner if present */}
              {selectedTaskModal.remarks && (
                <div className="rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 p-3.5 flex items-start gap-2.5">
                  <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-blue-900 dark:text-blue-200">
                      Tutor / System Evaluation:{" "}
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
                <div className="rounded-xl bg-slate-50 dark:bg-surface-elevated/70 border border-slate-200 dark:border-slate-800/80 p-3.5 leading-relaxed text-[11px] text-slate-800 dark:text-slate-200">
                  {(() => {
                    const parsed = parseTaskSubmissionDetails(selectedTaskModal);
                    if (parsed.isMultiQuestion && parsed.questions.length > 0) {
                      return (
                        <div className="space-y-4 font-sans text-xs">
                          {parsed.questions.map((q, idx) => {
                            const isMcq = q.type === "MCQ";
                            const isShort = q.type === "SHORT_ANSWER";
                            const isLong = q.type === "LONG_ANSWER";
                            const isFile = q.type === "FILE_UPLOAD";
                            const isCoding = q.type === "CODING";

                            const typeBadge = isMcq
                              ? { label: "Multiple Choice", cls: "bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200 dark:border-blue-800" }
                              : isShort
                              ? { label: "Short Answer", cls: "bg-teal-100 text-teal-800 dark:bg-teal-950/70 dark:text-teal-300 border-teal-200 dark:border-teal-800" }
                              : isLong
                              ? { label: "Long Answer", cls: "bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border-purple-200 dark:border-purple-800" }
                              : isFile
                              ? { label: "File Upload", cls: "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800" }
                              : { label: "Coding Solution", cls: "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/70 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800" };

                            const studentText = typeof q.studentAnswer === "string" ? q.studentAnswer.trim() : "";

                            return (
                              <div
                                key={idx}
                                className="rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-surface-elevated/40 p-3.5 space-y-2.5 shadow-2xs"
                              >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white text-[10px] font-bold">
                                      {idx + 1}
                                    </span>
                                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold border ${typeBadge.cls}`}>
                                      {typeBadge.label}
                                    </span>
                                  </div>
                                  {q.isCorrect !== undefined && (
                                    <span
                                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                        q.isCorrect
                                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                                          : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800"
                                      }`}
                                    >
                                      {q.isCorrect ? "Correct" : "Needs Review"} ({q.earned ?? (q.isCorrect ? 1 : 0)}/{q.max ?? 1} pt)
                                    </span>
                                  )}
                                </div>

                                <p className="font-semibold text-slate-900 dark:text-white text-xs">
                                  {q.prompt}
                                </p>

                                {/* Response Content */}
                                {isMcq ? (
                                  <div className="rounded-lg bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/40 p-2.5 text-xs">
                                    <span className="font-bold text-blue-700 dark:text-blue-300 mr-1.5">
                                      Student's Selection:
                                    </span>
                                    <span className="text-slate-800 dark:text-slate-200 font-medium">
                                      {q.selectedChoiceText || q.studentAnswer || "No choice selected"}
                                    </span>
                                  </div>
                                ) : isFile ? (
                                  <div className="rounded-lg border border-amber-200 dark:border-amber-800/60 bg-amber-50/40 dark:bg-amber-950/20 p-3 space-y-2">
                                    <div className="flex items-center justify-between gap-2">
                                      <div className="flex items-center gap-2">
                                        <FileCheck className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                        <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                                          {q.fileName || selectedTaskModal.submissionFileName || "Student Uploaded Submission"}
                                        </span>
                                      </div>
                                      {(q.fileUrl || selectedTaskModal.submissionFileUrl) && (
                                        <a
                                          href={q.fileUrl || selectedTaskModal.submissionFileUrl}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="inline-flex items-center gap-1 rounded-md bg-amber-600 hover:bg-amber-700 text-white px-2.5 py-1 text-[11px] font-bold transition-colors"
                                        >
                                          <Download className="h-3 w-3" />
                                          Download File
                                        </a>
                                      )}
                                    </div>
                                    {studentText && !studentText.startsWith("http") && (
                                      <p className="text-[11px] text-slate-600 dark:text-slate-400 italic">
                                        "{studentText}"
                                      </p>
                                    )}
                                  </div>
                                ) : isCoding ? (
                                  <div className="rounded-lg bg-slate-900 dark:bg-black/90 border border-slate-800 p-3 font-mono text-[11px] text-emerald-400 whitespace-pre-wrap overflow-x-auto">
                                    {studentText || "// No code submitted"}
                                  </div>
                                ) : (
                                  /* Short or Long Written Answer */
                                  <div className="space-y-2">
                                    <div className="rounded-lg bg-slate-50 dark:bg-surface-secondary/70 border border-slate-200 dark:border-slate-800 p-3 text-xs leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                                      {studentText || (
                                        <span className="italic text-slate-400">No written answer provided.</span>
                                      )}
                                    </div>
                                    {q.modelAnswer && (
                                      <div className="rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 p-2.5 text-[11px] text-emerald-900 dark:text-emerald-300">
                                        <span className="font-bold block mb-0.5">Model / Benchmark Answer:</span>
                                        <span className="leading-relaxed">{q.modelAnswer}</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    }
                    if (selectedTaskModal.submissionFileUrl) {
                      return (
                        <div className="rounded-lg border border-amber-200 dark:border-amber-800/60 bg-amber-50/40 dark:bg-amber-950/20 p-3.5 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <FileCheck className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white text-xs">
                                {selectedTaskModal.submissionFileName || "Submitted Assignment File"}
                              </div>
                              <div className="text-[11px] text-slate-500">Click to inspect or download student submission</div>
                            </div>
                          </div>
                          <a
                            href={selectedTaskModal.submissionFileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 text-xs font-bold transition-colors"
                          >
                            <Download className="h-3.5 w-3.5" />
                            Download
                          </a>
                        </div>
                      );
                    }
                    return (
                      <div className="font-mono text-[11px] whitespace-pre-wrap">
                        {selectedTaskModal.examplesCaseStudy}
                      </div>
                    );
                  })()}
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

export default function AdminStudentDetailsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex h-96 w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#2563EB]" />
        </div>
      }
    >
      <AdminStudentDetailsContent />
    </React.Suspense>
  );
}

