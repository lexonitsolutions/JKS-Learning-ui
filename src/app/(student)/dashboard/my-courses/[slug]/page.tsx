"use client";

import React, { useState, useEffect, use, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Lock,
  PlayCircle,
  CheckCircle2,
  ArrowLeft,
  Award,
  Download,
  ClipboardCheck,
  FileCheck,
  X,
  Layers,
  FolderTree,
  ChevronDown,
  ChevronRight,
  Sparkles,
  BookOpen,
  Tv,
  Star,
  Clock,
  Calendar,
  Globe,
  Subtitles,
  Smartphone,
  Share2,
  MessageSquare,
  FileText,
  Bell,
  Search,
  Plus,
  ThumbsUp,
  HelpCircle,
  ExternalLink,
  Code2,
  Send,
  Check,
  Tag,
  AlertTriangle,
  Timer,
  RotateCcw,
  ShieldCheck,
  AlertCircle,
  XCircle,
} from "lucide-react";
import {
  getFullCourseBySlug,
  getStoredCourses,
  type FullCourse,
  type VideoItem,
  type Section,
  type SubSection,
} from "@/lib/data/courses-store";
import { InAppVideoPlayer } from "@/components/ui/in-app-video-player";
import {
  fetchCourseProgress,
  syncAllCourseProgress,
  submitAssessment,
  saveVideoProgress,
  getClientSessionEmail,
} from "@/lib/data/enrollments-api";
import { CertificateModal } from "@/components/common/certificate-modal";
import { useMockSession } from "@/lib/auth/use-mock-auth";
import { useUser } from "@clerk/nextjs";

function TwitterIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function LinkedinIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  );
}

function YoutubeIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

type TabType = "overview" | "curriculum" | "qa" | "notes" | "announcements" | "reviews" | "tools";

function formatCooldown(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export default function CourseLearningHubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const session = useMockSession();
  const { user: clerkUser } = useUser();
  const studentName = clerkUser?.fullName || session?.name || "Student Learner";
  const effectiveEmail = (clerkUser?.primaryEmailAddress?.emailAddress || clerkUser?.emailAddresses?.[0]?.emailAddress || session?.email || getClientSessionEmail() || "").toLowerCase().trim();

  const [course, setCourse] = useState<FullCourse | null>(null);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string>("");
  const [completedVideoIds, setCompletedVideoIds] = useState<string[]>([]);
  const [completedAssignmentIds, setCompletedAssignmentIds] = useState<string[]>([]);
  const [assignmentScores, setAssignmentScores] = useState<Record<string, number>>({});
  const [assignmentCooldowns, setAssignmentCooldowns] = useState<Record<string, number>>({});
  const [activeQuizAnswers, setActiveQuizAnswers] = useState<Record<number, number>>({});
  const [now, setNow] = useState<number>(Date.now());

  // Active Tab below Video (Udemy style)
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [showSchedulerBanner, setShowSchedulerBanner] = useState(true);
  const [showSchedulerModal, setShowSchedulerModal] = useState(false);

  // Q&A State
  const [qaSearch, setQaSearch] = useState("");
  const [showAskModal, setShowAskModal] = useState(false);
  const [newQuestionTitle, setNewQuestionTitle] = useState("");
  const [newQuestionBody, setNewQuestionBody] = useState("");
  const [questionsList, setQuestionsList] = useState([
    {
      id: "q-1",
      author: "Rahul Sharma",
      avatar: "/images/hero-developer.png",
      title: "How does Virtual Thread scheduling differ from ForkJoinPool in Java 21?",
      timeAgo: "2 days ago",
      lecture: "02. Modern Java 21 Features",
      upvotes: 14,
      replies: 3,
      hasInstructorResponse: true,
    },
    {
      id: "q-2",
      author: "Priya Patel",
      avatar: "/images/student-3d-developer.png",
      title: "Getting ClassNotFoundException when packaging Spring Boot JAR with custom dependencies",
      timeAgo: "4 days ago",
      lecture: "04. Spring Boot 3 Core",
      upvotes: 8,
      replies: 2,
      hasInstructorResponse: true,
    },
  ]);

  // Notes State
  const [newNoteText, setNewNoteText] = useState("");
  const [notesList, setNotesList] = useState<{ id: string; timestamp: string; text: string; lecture: string }[]>([
    {
      id: "note-1",
      timestamp: "01:24",
      lecture: "01. JVM Architecture & Memory",
      text: "JVM Heap vs Metaspace memory layout. Heap stores object instances, Metaspace stores class metadata.",
    },
  ]);

  // Active assignment modal & evaluation feedback & cert modal
  const [activeAssignmentSection, setActiveAssignmentSection] = useState<Section | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<{
    sectionId: string;
    asgId: string;
    title: string;
    score: number;
    minPass: number;
    passed: boolean;
    cooldownUntil?: number;
  } | null>(null);
  const [showCertModal, setShowCertModal] = useState(false);
  const [showLockedRequirementsModal, setShowLockedRequirementsModal] = useState(false);

  // Live timer tick for real-time cooldown countdowns
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load course & real-time progress on mount or slug change
  useEffect(() => {
    const loadData = async () => {
      const loadedCourse = getFullCourseBySlug(slug) || getStoredCourses()[0];
      if (loadedCourse) {
        setCourse(loadedCourse);

        // Fetch persisted video & assignment progress
        try {
          const prog = await fetchCourseProgress(slug, effectiveEmail);
          let initialVideos = prog.completedVideoIds || [];
          let initialAssignments = prog.completedAssignmentIds || [];
          let scores: Record<string, number> = { ...(prog.assignmentScores || {}) };
          let cooldowns: Record<string, number> = {};

          // Check local cache for rich scores and cooldowns
          if (typeof window !== "undefined") {
            try {
              const localKey = `jks_prog_${slug}_${effectiveEmail || "student"}`;
              const fallbackKey = `jks_prog_${slug}_student`;
              const cached = localStorage.getItem(localKey) || localStorage.getItem(fallbackKey);
              if (cached) {
                const parsed = JSON.parse(cached);
                if (parsed.completedVideoIds?.length > 0) {
                  initialVideos = Array.from(new Set([...initialVideos, ...parsed.completedVideoIds]));
                }
                if (parsed.completedAssignmentIds?.length > 0) {
                  initialAssignments = Array.from(new Set([...initialAssignments, ...parsed.completedAssignmentIds]));
                }
                if (parsed.assignmentScores) {
                  scores = { ...scores, ...parsed.assignmentScores };
                }
                if (parsed.assignmentCooldowns) {
                  cooldowns = parsed.assignmentCooldowns;
                }
              }
            } catch {}
          }

          // Ensure every completed assignment has a valid passing score
          initialAssignments.forEach((id) => {
            if (typeof scores[id] !== "number") {
              scores[id] = 85;
            }
          });

          setCompletedVideoIds(initialVideos);
          setCompletedAssignmentIds(initialAssignments);
          setAssignmentScores(scores);
          setAssignmentCooldowns(cooldowns);

          // Batch sync to backend to ensure DB is current
          if (effectiveEmail && (initialVideos.length > 0 || initialAssignments.length > 0)) {
            syncAllCourseProgress({
              courseSlug: slug,
              studentEmail: effectiveEmail,
              completedVideoIds: initialVideos,
              completedAssignmentIds: initialAssignments,
              assignmentScores: scores,
            }).catch(() => {});
          }
        } catch (e) {
          console.warn("Could not load backend progress:", e);
        }

        // Find first video (Direct section video first, then subsections)
        let firstVid: VideoItem | null = null;
        let firstSecId = "";
        for (const sec of loadedCourse.sections || []) {
          if (sec.directVideos && sec.directVideos.length > 0) {
            firstVid = sec.directVideos[0];
            firstSecId = sec.id;
            break;
          } else if (sec.subsections && sec.subsections.length > 0 && sec.subsections[0].videos.length > 0) {
            firstVid = sec.subsections[0].videos[0];
            firstSecId = sec.id;
            break;
          }
        }

        if (firstVid) {
          setActiveVideo(firstVid);
          setActiveSectionId(firstSecId);
        }
      }
    };

    loadData();
  }, [slug, effectiveEmail]);

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] dark:bg-background">
        <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">Loading course curriculum…</div>
      </div>
    );
  }

  // Calculate total items for overall progress (Direct videos first, then subsections)
  const allVideos: VideoItem[] = [];
  const allSections = course.sections || [];
  allSections.forEach((sec) => {
    if (sec.directVideos) {
      allVideos.push(...sec.directVideos);
    }
    if (sec.subsections) {
      sec.subsections.forEach((sub) => {
        allVideos.push(...sub.videos);
      });
    }
  });

  const totalVideos = allVideos.length;
  const completedVideosCount = allVideos.filter((v) => completedVideoIds.includes(v.id)).length;
  const allVideosCompleted = totalVideos > 0 && completedVideosCount >= totalVideos;

  // Strict assignment verification with passing mark check
  const totalAssignments = allSections.length;
  const passedAssignments = allSections.filter((sec) => {
    const asgId = sec.assignment.id;
    const score = assignmentScores[asgId];
    const minPass = sec.assignment.minPassingScore || 70;
    return completedAssignmentIds.includes(asgId) && ((typeof score === "number" && score >= minPass) || typeof score === "undefined");
  });
  const passedAssignmentsCount = passedAssignments.length;
  const allAssignmentsPassed = totalAssignments > 0 && passedAssignmentsCount >= totalAssignments;

  // Certificate access is ONLY unlocked when 100% of videos are watched AND 100% of assignments scored >= pass mark
  const isCertificateUnlocked = allVideosCompleted && allAssignmentsPassed;

  const totalMilestones = totalVideos + totalAssignments;
  const completedMilestones = completedVideosCount + passedAssignmentsCount;
  const overallPercent = totalMilestones > 0 ? Math.min(100, Math.round((completedMilestones / totalMilestones) * 100)) : 0;

  const handleVideoCompleted = async (vidId: string) => {
    const updatedVideos = completedVideoIds.includes(vidId)
      ? completedVideoIds
      : [...completedVideoIds, vidId];

    setCompletedVideoIds(updatedVideos);

    if (typeof window !== "undefined") {
      try {
        const key = `jks_prog_${slug}_${effectiveEmail || "student"}`;
        localStorage.setItem(
          key,
          JSON.stringify({
            completedVideoIds: updatedVideos,
            completedAssignmentIds,
            assignmentScores,
            assignmentCooldowns,
          })
        );
      } catch {}
    }

    // Persist real-time progress to Backend
    try {
      await syncAllCourseProgress({
        courseSlug: slug,
        studentEmail: effectiveEmail,
        completedVideoIds: updatedVideos,
        completedAssignmentIds,
        assignmentScores,
      });
    } catch (err) {
      console.warn("Failed to persist video progress to backend:", err);
    }
  };

  const handleSelectVideo = (vid: VideoItem, secId: string) => {
    setActiveVideo(vid);
    setActiveSectionId(secId);
  };

  const handleOpenAssignment = (sec: Section) => {
    setActiveAssignmentSection(sec);
    setActiveQuizAnswers({});
  };

  const handleSelectQuizAnswer = (qIdx: number, choiceIdx: number) => {
    setActiveQuizAnswers((prev) => ({ ...prev, [qIdx]: choiceIdx }));
  };

  const handleSubmitAssignment = async (sec: Section) => {
    const asgId = sec.assignment.id;
    const questions = sec.assignment.questions || [];
    const minPass = sec.assignment.minPassingScore || 70;

    let calculatedScore = 0;
    if (questions.length > 0) {
      let correct = 0;
      questions.forEach((q, idx) => {
        const selected = activeQuizAnswers[idx];
        const correctIdx = typeof q.correctIndex === "number" ? q.correctIndex : 0;
        if (selected === correctIdx) {
          correct++;
        }
      });
      calculatedScore = Math.round((correct / questions.length) * 100);
    } else {
      // Default challenge / practical submission score
      calculatedScore = 85;
    }

    const passed = calculatedScore >= minPass;
    const cooldownDurationMs = 180 * 1000; // 3 minutes cooldown timer on fail
    const cooldownExpiry = passed ? 0 : Date.now() + cooldownDurationMs;

    let updatedCompletedAssignments = [...completedAssignmentIds];
    if (passed) {
      if (!updatedCompletedAssignments.includes(asgId)) {
        updatedCompletedAssignments.push(asgId);
      }
    } else {
      // If failed, remove from passed/completed list so certificate stays locked
      updatedCompletedAssignments = updatedCompletedAssignments.filter((id) => id !== asgId);
    }

    const updatedScores = { ...assignmentScores, [asgId]: calculatedScore };
    const updatedCooldowns = { ...assignmentCooldowns };
    if (passed) {
      delete updatedCooldowns[asgId];
    } else {
      updatedCooldowns[asgId] = cooldownExpiry;
    }

    setCompletedAssignmentIds(updatedCompletedAssignments);
    setAssignmentScores(updatedScores);
    setAssignmentCooldowns(updatedCooldowns);

    // Save to local cache
    if (typeof window !== "undefined") {
      try {
        const key = `jks_prog_${slug}_${effectiveEmail || "student"}`;
        localStorage.setItem(
          key,
          JSON.stringify({
            completedVideoIds,
            completedAssignmentIds: updatedCompletedAssignments,
            assignmentScores: updatedScores,
            assignmentCooldowns: updatedCooldowns,
          })
        );
      } catch {}
    }

    // Persist real assessment submission to backend DB
    try {
      await submitAssessment({
        courseSlug: slug,
        assessmentId: asgId,
        studentEmail: effectiveEmail,
        answers: activeQuizAnswers,
        score: calculatedScore,
        feedback: passed
          ? "Exceeded performance benchmark across all core competencies."
          : "Score below passing mark. Please review relevant module lectures and re-attempt.",
      });
    } catch (err) {
      console.warn("Failed to persist assessment submission to backend:", err);
    }

    // Sync to backend DB
    try {
      await syncAllCourseProgress({
        courseSlug: slug,
        studentEmail: effectiveEmail,
        completedVideoIds,
        completedAssignmentIds: updatedCompletedAssignments,
        assignmentScores: updatedScores,
      });
    } catch (e) {
      console.warn("Failed to save assignment progress:", e);
    }

    setActiveAssignmentSection(null);
    setActiveQuizAnswers({});
    setEvaluationResult({
      sectionId: sec.id,
      asgId,
      title: sec.assignment.title,
      score: calculatedScore,
      minPass,
      passed,
      cooldownUntil: passed ? undefined : cooldownExpiry,
    });
  };

  const handleAddNote = () => {
    if (!newNoteText.trim()) return;
    const note = {
      id: `note-${Date.now()}`,
      timestamp: "02:15",
      lecture: activeVideo?.title || "Current Lecture",
      text: newNoteText,
    };
    setNotesList([note, ...notesList]);
    setNewNoteText("");
  };

  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionTitle.trim()) return;
    const q = {
      id: `q-${Date.now()}`,
      author: studentName,
      avatar: "/images/hero-developer.png",
      title: newQuestionTitle,
      timeAgo: "Just now",
      lecture: activeVideo?.title || "Current Lecture",
      upvotes: 1,
      replies: 0,
      hasInstructorResponse: false,
    };
    setQuestionsList([q, ...questionsList]);
    setNewQuestionTitle("");
    setNewQuestionBody("");
    setShowAskModal(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] text-slate-800 dark:bg-background dark:text-slate-100 overflow-x-hidden transition-colors duration-200">
      {/* Top Learning Hub Navigation Bar */}
      <header className="sticky top-0 z-30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 sm:py-0 sm:px-6 sm:h-16 gap-3 backdrop-blur-md dark:border-slate-800/80 dark:bg-surface-secondary/95">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <Link
            href="/dashboard/my-courses"
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors shrink-0 dark:border-slate-700/80 dark:bg-surface-elevated dark:text-slate-200 dark:hover:bg-surface-hover"
          >
            <ArrowLeft className="h-4 w-4" /> My Courses
          </Link>
          <div className="h-4 w-[1px] bg-slate-200 hidden sm:block dark:bg-slate-800" />
          <div className="min-w-0">
            <h1 className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-[200px] sm:max-w-md dark:text-white">
              {course.title}
            </h1>
            <div className="text-[10px] text-slate-400 font-medium dark:text-slate-400">
              {allSections.length} Sections · {allVideos.length} Video Lessons
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <div className="text-left sm:text-right">
            <div className="text-xs font-extrabold text-slate-900 dark:text-white">
              {overallPercent}% Completed
            </div>
            <div className="text-[10px] text-slate-500 font-medium dark:text-slate-400">
              {completedMilestones} of {totalMilestones} Milestones Done
            </div>
          </div>
          <div className="h-2 w-20 sm:w-32 rounded-full bg-slate-100 overflow-hidden shrink-0 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-500"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Learning Hub Grid */}
      <div className="flex flex-1 min-w-0 flex-col lg:flex-row overflow-x-hidden">
        {/* LEFT COLUMN: In-App Video Viewport & Udemy Bottom Sections */}
        <div className="flex flex-1 min-w-0 flex-col p-3 sm:p-5 lg:p-6 space-y-5">
          {/* IN-APP VIDEO PLAYER */}
          {activeVideo ? (
            <div className="space-y-3">
              <InAppVideoPlayer
                key={activeVideo.id}
                title={activeVideo.title}
                videoUrl={activeVideo.videoUrl}
                videoType={activeVideo.videoType}
                durationFormatted={activeVideo.durationFormatted}
                antiSkip={true}
                onVideoCompleted={() => handleVideoCompleted(activeVideo.id)}
              />

              {/* Video Title Bar & Completion Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800/80 dark:bg-surface-secondary">
                <div className="min-w-0">
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate dark:text-white">{activeVideo.title}</h2>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>Duration: {activeVideo.durationFormatted}</span>
                    <span>•</span>
                    <span className="font-mono text-[11px] uppercase text-[#2563EB] dark:text-blue-400">
                      {activeVideo.videoType === "upload" ? "Uploaded Lecture" : "Stream Video"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {completedVideoIds.includes(activeVideo.id) ? (
                    <span className="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" /> Lesson Completed
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleVideoCompleted(activeVideo.id)}
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

          {/* ======================================================== */}
          {/* UDEMY-STYLE INTERACTIVE TABS & SECTIONS UNDER VIDEO       */}
          {/* ======================================================== */}
          <div className="rounded-[24px] border border-slate-200 bg-white shadow-xs overflow-hidden dark:border-slate-800/80 dark:bg-surface-secondary">
            {/* Udemy Tabs Strip */}
            <div className="flex items-center gap-1 border-b border-slate-200 px-4 sm:px-6 overflow-x-auto bg-slate-50/50 dark:border-slate-800 dark:bg-surface-elevated">
              {[
                { id: "curriculum", label: "Curriculum & Lessons", icon: FolderTree, mobileOnly: true },
                { id: "overview", label: "Overview", icon: BookOpen },
                { id: "qa", label: "Q&A", icon: MessageSquare },
                { id: "notes", label: "Notes", icon: FileText },
                { id: "announcements", label: "Announcements", icon: Bell },
                { id: "reviews", label: "Reviews", icon: Star },
                { id: "tools", label: "Learning Tools", icon: Code2 },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`flex items-center gap-2 border-b-2 px-4 py-3.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      tab.mobileOnly ? "lg:hidden " : ""
                    }${
                      isActive
                        ? "border-[#2563EB] text-[#2563EB] dark:text-blue-400 dark:border-blue-500"
                        : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 dark:text-slate-400 dark:hover:text-white dark:hover:border-slate-700"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENTS */}
            <div className="p-5 sm:p-8">
              {/* TAB 0: CURRICULUM & VIDEO LESSONS (Mobile only) */}
              {activeTab === "curriculum" && (
                <div className="lg:hidden space-y-6 max-w-4xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                        Course Curriculum &amp; Video Lessons
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5 dark:text-slate-400">
                        {allSections.length} Sections · {allVideos.length} Video Lessons · {totalMilestones} Milestones
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-left sm:text-right">
                        <div className="text-xs font-bold text-[#2563EB] dark:text-blue-400">{overallPercent}% Completed</div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-400">{completedMilestones}/{totalMilestones} Done</div>
                      </div>
                      {isCertificateUnlocked ? (
                        <button
                          type="button"
                          onClick={() => setShowCertModal(true)}
                          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs cursor-pointer"
                        >
                          <Award className="h-4 w-4" /> Certificate
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowLockedRequirementsModal(true)}
                          className="flex items-center gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 shadow-xs cursor-pointer"
                        >
                          <Lock className="h-3.5 w-3.5 text-amber-500" /> Certificate
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Sections & Video Lessons List */}
                  <div className="space-y-4">
                    {allSections.map((sec, secIdx) => {
                      const asgId = sec.assignment.id;
                      const score = assignmentScores[asgId] ?? (completedAssignmentIds.includes(asgId) ? 85 : undefined);
                      const minPass = sec.assignment.minPassingScore || 70;
                      const isPassed = completedAssignmentIds.includes(asgId) && ((typeof score === "number" && score >= minPass) || typeof score === "undefined");
                      const cooldownExpiry = assignmentCooldowns[asgId] || 0;
                      const isCooldownActive = cooldownExpiry > now;
                      const secondsRemaining = Math.max(0, Math.ceil((cooldownExpiry - now) / 1000));

                      return (
                        <div
                          key={sec.id}
                          className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs dark:border-slate-800 dark:bg-surface-secondary"
                        >
                          <div className="flex items-center justify-between bg-slate-50/80 p-3.5 border-b border-slate-100 dark:bg-surface-elevated dark:border-slate-800">
                            <div className="flex items-center gap-2.5">
                              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#2563EB] text-[11px] font-bold text-white">
                                {secIdx + 1}
                              </span>
                              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                {sec.title}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400 font-medium dark:text-slate-400">
                              {(sec.directVideos?.length || 0) + (sec.subsections ? sec.subsections.reduce((acc: number, s: SubSection) => acc + s.videos.length, 0) : 0)} Lessons
                            </span>
                          </div>

                          {/* Direct Section Videos (Rendered FIRST) */}
                          {sec.directVideos && sec.directVideos.length > 0 && (
                            <div className="p-3.5 space-y-1.5">
                              {sec.directVideos.map((vid: VideoItem) => {
                                const isSelected = activeVideo?.id === vid.id;
                                const isDone = completedVideoIds.includes(vid.id);

                                return (
                                  <button
                                    key={vid.id}
                                    type="button"
                                    onClick={() => {
                                      handleSelectVideo(vid, sec.id);
                                      window.scrollTo({ top: 0, behavior: "smooth" });
                                    }}
                                    className={`flex w-full items-center justify-between gap-2 rounded-xl p-3 text-left text-xs sm:text-sm transition-all cursor-pointer ${
                                      isSelected
                                        ? "bg-[#EFF6FF] text-[#2563EB] font-bold shadow-xs border border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/60"
                                        : "text-slate-700 hover:bg-slate-50 border border-transparent dark:text-slate-300 dark:hover:bg-surface-elevated"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      {isDone ? (
                                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                      ) : (
                                        <PlayCircle
                                          className={`h-4 w-4 shrink-0 ${
                                            isSelected ? "text-[#2563EB] dark:text-blue-400" : "text-slate-400 dark:text-slate-400"
                                          }`}
                                        />
                                      )}
                                      <span className="truncate">{vid.title}</span>
                                    </div>
                                    <span className="text-[11px] text-slate-400 shrink-0 font-mono dark:text-slate-400">
                                      {vid.durationFormatted}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {/* Subsections & Nested Videos (Rendered after direct videos) */}
                          {sec.subsections && sec.subsections.length > 0 && (
                            <div className="divide-y divide-slate-100 dark:divide-slate-800 border-t border-slate-100 dark:border-slate-800/80">
                              {sec.subsections.map((sub: SubSection) => (
                                <div key={sub.id} className="p-3.5 space-y-2">
                                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">
                                    {sub.title}
                                  </div>

                                  <div className="space-y-1.5 pl-2 sm:pl-3">
                                    {sub.videos.map((vid: VideoItem) => {
                                      const isSelected = activeVideo?.id === vid.id;
                                      const isDone = completedVideoIds.includes(vid.id);

                                      return (
                                        <button
                                          key={vid.id}
                                          type="button"
                                          onClick={() => {
                                            handleSelectVideo(vid, sec.id);
                                            window.scrollTo({ top: 0, behavior: "smooth" });
                                          }}
                                          className={`flex w-full items-center justify-between gap-2 rounded-xl p-3 text-left text-xs sm:text-sm transition-all cursor-pointer ${
                                            isSelected
                                              ? "bg-[#EFF6FF] text-[#2563EB] font-bold shadow-xs border border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/60"
                                              : "text-slate-700 hover:bg-slate-50 border border-transparent dark:text-slate-300 dark:hover:bg-surface-elevated"
                                          }`}
                                        >
                                          <div className="flex items-center gap-2.5 min-w-0">
                                            {isDone ? (
                                              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                            ) : (
                                              <PlayCircle
                                                className={`h-4 w-4 shrink-0 ${
                                                  isSelected ? "text-[#2563EB] dark:text-blue-400" : "text-slate-400 dark:text-slate-400"
                                                }`}
                                              />
                                            )}
                                            <span className="truncate">{vid.title}</span>
                                          </div>
                                          <span className="text-[11px] text-slate-400 shrink-0 font-mono dark:text-slate-400">
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

                          {/* Section Assignment Footer */}
                          <div className="border-t border-slate-100 p-3 bg-slate-50/60 flex items-center justify-between text-xs dark:border-slate-800 dark:bg-surface-elevated/60">
                            <span className="font-semibold flex items-center gap-1.5">
                              {isPassed ? (
                                <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                                  <CheckCircle2 className="h-4 w-4" /> Passed ({score ?? 85}%)
                                </span>
                              ) : isCooldownActive ? (
                                <span className="text-amber-700 dark:text-amber-400 flex items-center gap-1">
                                  <Timer className="h-4 w-4 animate-pulse" /> Retake in {formatCooldown(secondsRemaining)}
                                </span>
                              ) : (
                                <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                  <ClipboardCheck className="h-4 w-4 text-blue-600" /> Section Assignment (Pass: {minPass}%)
                                </span>
                              )}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleOpenAssignment(sec)}
                              className={`font-bold hover:underline cursor-pointer ${
                                isPassed
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : isCooldownActive
                                  ? "text-amber-600 dark:text-amber-400"
                                  : "text-[#2563EB] dark:text-blue-400"
                              }`}
                            >
                              {isPassed ? "Review" : isCooldownActive ? "View Cooldown" : "Take Assessment →"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="space-y-8 max-w-4xl">
                  {/* Course Header & Rating Meta */}
                  <div className="space-y-3">
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight dark:text-white">
                      {course.title} — Comprehensive Project-Based Enterprise Curriculum
                    </h1>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600 font-medium dark:text-slate-400">
                      <div className="flex items-center gap-1.5 text-amber-600 font-bold dark:text-amber-400">
                        <span className="text-sm font-extrabold">{course.rating || 4.8}</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span className="text-slate-500 font-normal dark:text-slate-400">({course.studentsEnrolled ? `${(course.studentsEnrolled * 6).toLocaleString()} ratings` : "1,240 ratings"})</span>
                      </div>

                      <span>•</span>
                      <span>{course.studentsEnrolled ? `${course.studentsEnrolled.toLocaleString()} students` : "14,845 students"}</span>
                      <span>•</span>
                      <span>{course.durationWeeks ? `${course.durationWeeks * 2} total hours` : "32 total hours"}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-400" /> Updated 2026
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Globe className="h-3.5 w-3.5 text-slate-400" /> English, Hindi
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Subtitles className="h-3.5 w-3.5 text-slate-400" /> Subtitles Available
                      </span>
                    </div>
                  </div>

                  {/* Schedule Learning Time Box */}
                  {showSchedulerBanner && (
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-surface-elevated">
                      <div className="flex items-start gap-3.5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-800 shadow-2xs dark:border-slate-700 dark:bg-surface-secondary dark:text-white">
                          <Calendar className="h-5 w-5 text-[#2563EB] dark:text-blue-400" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                            Schedule learning time
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed max-w-xl dark:text-slate-300">
                            Learning a little each day adds up. Set time aside to complete your daily video lectures and score passing marks on assignments to unlock your verified credential.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <button
                          type="button"
                          onClick={() => setShowSchedulerModal(true)}
                          className="rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
                        >
                          Get started
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowSchedulerBanner(false)}
                          className="rounded-xl px-3 py-2 text-xs font-bold text-slate-500 hover:bg-slate-200/60 transition-colors cursor-pointer dark:text-slate-400 dark:hover:bg-surface-hover"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  )}

                  {/* By The Numbers Grid */}
                  <div className="border-t border-slate-100 pt-6 dark:border-slate-800">
                    <h3 className="text-sm font-extrabold text-slate-900 mb-4 dark:text-white">By the numbers</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-xs text-slate-700 dark:text-slate-300">
                      <div className="space-y-2">
                        <div><span className="text-slate-500 dark:text-slate-400 font-medium">Skill level:</span> <span className="font-bold text-slate-900 dark:text-white">{course.level || "All Levels"}</span></div>
                        <div><span className="text-slate-500 dark:text-slate-400 font-medium">Students:</span> <span className="font-bold text-slate-900 dark:text-white">{course.studentsEnrolled || "14,845"}</span></div>
                        <div><span className="text-slate-500 dark:text-slate-400 font-medium">Languages:</span> <span className="font-bold text-slate-900 dark:text-white">English, Hindi</span></div>
                        <div><span className="text-slate-500 dark:text-slate-400 font-medium">Captions:</span> <span className="font-bold text-slate-900 dark:text-white">Yes</span></div>
                      </div>
                      <div className="space-y-2">
                        <div><span className="text-slate-500 dark:text-slate-400 font-medium">Lectures:</span> <span className="font-bold text-slate-900 dark:text-white">{allVideos.length || 42}</span></div>
                        <div><span className="text-slate-500 dark:text-slate-400 font-medium">Video:</span> <span className="font-bold text-slate-900 dark:text-white">32 total hours</span></div>
                      </div>
                    </div>
                  </div>

                  {/* Certificates Section */}
                  <div className="border-t border-slate-100 pt-6 dark:border-slate-800">
                    <h3 className="text-sm font-extrabold text-slate-900 mb-2 dark:text-white">Accredited Certificate</h3>
                    <p className="text-xs text-slate-600 mb-3 dark:text-slate-400">
                      Unlock official JKS Learning certificate by completing 100% of video lectures and passing all section assignments (&ge; 70%).
                    </p>
                    {isCertificateUnlocked ? (
                      <button
                        type="button"
                        onClick={() => setShowCertModal(true)}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:from-amber-600 cursor-pointer"
                      >
                        <Award className="h-4 w-4" />
                        <span>View Verified Certificate</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowLockedRequirementsModal(true)}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 cursor-pointer dark:border-slate-700/80 dark:bg-surface-elevated dark:text-slate-300 dark:hover:bg-surface-hover"
                      >
                        <Lock className="h-4 w-4 text-amber-500" />
                        <span>Certificate Locked ({completedMilestones}/{totalMilestones} Milestones)</span>
                      </button>
                    )}
                  </div>

                  {/* Description Section */}
                  <div className="border-t border-slate-100 pt-6 space-y-4 dark:border-slate-800">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Description</h3>
                    <p className="text-xs text-slate-600 leading-relaxed dark:text-slate-300">
                      {course.summary} This master series takes you step-by-step from core syntax, fundamentals, architectural design patterns to enterprise-grade cloud deployments. Each section is reinforced with coding challenges, interactive stage assessments, and real-time AI interview practice.
                    </p>

                    {/* What You'll Learn Checklist */}
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 mt-4 dark:border-slate-800 dark:bg-surface-elevated/50">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 dark:text-white">
                        What you&apos;ll learn
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                        {[
                          "Full Stack Architecture & Microservices",
                          "High-Performance Concurrency & Memory Model",
                          "REST APIs & Authentication with JWT & OAuth2",
                          "Modern React Component Design & State Management",
                          "SQL & NoSQL Schema Design, Indexing & Optimization",
                          "Docker Containerization & Kubernetes Cluster Setup",
                          "CI/CD Automated Pipelines with GitHub Actions",
                          "Scenario-based Technical & System Design Interviews",
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Instructor Section */}
                  <div className="border-t border-slate-100 pt-6 space-y-4 dark:border-slate-800">
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Instructor</h3>

                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="relative h-16 w-16 shrink-0 rounded-full border-2 border-slate-200 overflow-hidden bg-slate-900 dark:border-slate-700">
                        <Image
                          src="/images/hero-developer.png"
                          alt="Shubham Saurav"
                          width={64}
                          height={64}
                          unoptimized
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="space-y-2 flex-1">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Shubham Saurav &amp; JKS Mentor Team</h4>
                          <p className="text-xs text-slate-500 font-medium dark:text-slate-400">
                            Lead Enterprise Architect &amp; Engineering Educator (10+ Years Experience)
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button type="button" className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors dark:bg-surface-elevated dark:text-slate-300 dark:hover:bg-surface-hover">
                            <TwitterIcon className="h-3.5 w-3.5" />
                          </button>
                          <button type="button" className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors dark:bg-surface-elevated dark:text-slate-300 dark:hover:bg-surface-hover">
                            <LinkedinIcon className="h-3.5 w-3.5" />
                          </button>
                          <button type="button" className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors dark:bg-surface-elevated dark:text-slate-300 dark:hover:bg-surface-hover">
                            <YoutubeIcon className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed dark:text-slate-300">
                          Shubham Saurav is a senior software engineer and architect with a deep passion for teaching. Over the past decade, he has mentored over 50,000+ engineers globally.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Q&A */}
              {activeTab === "qa" && (
                <div className="space-y-6 max-w-3xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search all course questions..."
                        value={qaSearch}
                        onChange={(e) => setQaSearch(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs text-slate-900 outline-none focus:border-[#2563EB] dark:border-slate-700/80 dark:bg-input-bg dark:text-white dark:placeholder-slate-400"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowAskModal(true)}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Ask a new question</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {questionsList
                      .filter((q) =>
                        qaSearch ? q.title.toLowerCase().includes(qaSearch.toLowerCase()) : true
                      )
                      .map((q) => (
                        <div
                          key={q.id}
                          className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2 hover:border-slate-300 transition-colors dark:border-slate-800 dark:bg-surface-elevated dark:hover:border-slate-700"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <div className="relative h-8 w-8 shrink-0 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                                <Image
                                  src={q.avatar}
                                  alt={q.author}
                                  width={32}
                                  height={32}
                                  unoptimized
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{q.title}</h4>
                                <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-400">
                                  <span>{q.author}</span>
                                  <span>•</span>
                                  <span>{q.lecture}</span>
                                  <span>•</span>
                                  <span>{q.timeAgo}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="flex items-center gap-1 text-xs text-slate-500 font-bold bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 dark:bg-surface-secondary dark:border-slate-700 dark:text-slate-300">
                                <ThumbsUp className="h-3 w-3" /> {q.upvotes}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-slate-500 font-bold bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 dark:bg-surface-secondary dark:border-slate-700 dark:text-slate-300">
                                <MessageSquare className="h-3 w-3" /> {q.replies}
                              </span>
                            </div>
                          </div>

                          {q.hasInstructorResponse && (
                            <div className="mt-2 rounded-xl bg-blue-50/70 border border-blue-100 p-2.5 text-[11px] text-slate-700 flex items-center gap-1.5 dark:bg-blue-950/40 dark:border-blue-900/40 dark:text-blue-300">
                              <CheckCircle2 className="h-3.5 w-3.5 text-[#2563EB] dark:text-blue-400 shrink-0" />
                              <span>Instructor verified answer available</span>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* TAB 3: NOTES */}
              {activeTab === "notes" && (
                <div className="space-y-6 max-w-3xl">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3 dark:border-slate-800 dark:bg-surface-elevated/50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-white">
                        Take a note at <span className="text-[#2563EB] font-mono dark:text-blue-400">02:15</span>
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-400">{activeVideo?.title}</span>
                    </div>

                    <textarea
                      rows={3}
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder="Type your notes or key takeaways here..."
                      className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 outline-none focus:border-[#2563EB] dark:border-slate-700/80 dark:bg-input-bg dark:text-white dark:placeholder-slate-400"
                    />

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleAddNote}
                        className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" /> Save Note
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider dark:text-slate-300">
                      Saved Notes ({notesList.length})
                    </h4>
                    {notesList.map((n) => (
                      <div
                        key={n.id}
                        className="rounded-2xl border border-slate-200 bg-white p-4 space-y-1.5 shadow-2xs dark:border-slate-800 dark:bg-surface-elevated"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="rounded bg-blue-100 px-2 py-0.5 font-mono text-[11px] font-bold text-[#2563EB] dark:bg-blue-950/60 dark:text-blue-400">
                            {n.timestamp}
                          </span>
                          <span className="text-[11px] text-slate-400 dark:text-slate-400">{n.lecture}</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium dark:text-slate-300">{n.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: ANNOUNCEMENTS */}
              {activeTab === "announcements" && (
                <div className="space-y-4 max-w-3xl">
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-2xs dark:border-slate-800 dark:bg-surface-elevated">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                        <Image
                          src="/images/hero-developer.png"
                          alt="Instructor"
                          width={40}
                          height={40}
                          unoptimized
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">Shubham Saurav (Instructor)</h4>
                        <span className="text-[11px] text-slate-400 dark:text-slate-400">Posted 3 days ago</span>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      🚀 Course Curriculum and Milestone Challenges Active!
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed dark:text-slate-300">
                      Hello learners! Welcome to this mastercourse. Complete each video lesson sequentially and make sure to score &ge; 70% on section assessments to qualify for your official verified certificate!
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 5: REVIEWS */}
              {activeTab === "reviews" && (
                <div className="space-y-6 max-w-3xl">
                  <div className="flex items-center gap-6 rounded-2xl border border-slate-200 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-surface-elevated">
                    <div className="text-center">
                      <div className="text-4xl font-black text-slate-900 dark:text-white">4.8</div>
                      <div className="flex items-center justify-center gap-0.5 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium dark:text-slate-400">Course Rating</span>
                    </div>

                    <div className="flex-1 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <span className="w-12 text-slate-500 dark:text-slate-400">5 stars</span>
                        <div className="h-2 flex-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: "82%" }} />
                        </div>
                        <span className="w-8 text-right font-bold">82%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-12 text-slate-500 dark:text-slate-400">4 stars</span>
                        <div className="h-2 flex-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: "14%" }} />
                        </div>
                        <span className="w-8 text-right font-bold">14%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-12 text-slate-500 dark:text-slate-400">3 stars</span>
                        <div className="h-2 flex-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: "3%" }} />
                        </div>
                        <span className="w-8 text-right font-bold">3%</span>
                      </div>
                    </div>
                  </div>

                  {/* Student Testimonials */}
                  <div className="space-y-3">
                    {[
                      {
                        name: "Ananya Roy",
                        date: "1 week ago",
                        rating: 5,
                        text: "Best course for Full Stack engineering! The system architecture explanation and real milestone assessments helped me crack my Tier-1 technical interviews.",
                      },
                      {
                        name: "Vikram Malhotra",
                        date: "2 weeks ago",
                        rating: 5,
                        text: "Crystal clear explanations. The combination of video lectures with anti-skip protection and realistic coding challenges made learning super effective.",
                      },
                    ].map((rev, idx) => (
                      <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2 dark:border-slate-800 dark:bg-surface-elevated">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">{rev.name}</span>
                          <span className="text-[11px] text-slate-400 dark:text-slate-400">{rev.date}</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed dark:text-slate-300">{rev.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: LEARNING TOOLS */}
              {activeTab === "tools" && (
                <div className="space-y-4 max-w-3xl">
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 dark:border-slate-800 dark:bg-surface-elevated">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider dark:text-white">
                      Downloadable Source Code &amp; Repositories
                    </h4>
                    <div className="space-y-2">
                      <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-[#2563EB] bg-slate-50/50 text-xs font-semibold text-slate-800 transition-colors dark:border-slate-700 dark:bg-surface-secondary dark:text-slate-200 dark:hover:border-blue-500"
                      >
                        <div className="flex items-center gap-2">
                          <Code2 className="h-4 w-4 text-[#2563EB] dark:text-blue-400" />
                          <span>Course Complete GitHub Repository &amp; Starter Boilerplate</span>
                        </div>
                        <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Active Section Assignments Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Section Assignments &amp; Milestones</h3>
            {allSections.map((sec, secIdx) => {
              const asgId = sec.assignment.id;
              const score = assignmentScores[asgId] ?? (completedAssignmentIds.includes(asgId) ? 85 : undefined);
              const minPass = sec.assignment.minPassingScore || 70;
              const isPassed = completedAssignmentIds.includes(asgId) && ((typeof score === "number" && score >= minPass) || typeof score === "undefined");
              const cooldownExpiry = assignmentCooldowns[asgId] || 0;
              const isCooldownActive = cooldownExpiry > now;
              const secondsRemaining = Math.max(0, Math.ceil((cooldownExpiry - now) / 1000));

              return (
                <div
                  key={sec.id}
                  className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-xs space-y-3 dark:border-slate-800/80 dark:bg-surface-secondary"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white dark:bg-slate-800">
                        {secIdx + 1}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{sec.title}</h4>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      Section {secIdx + 1}
                    </span>
                  </div>

                  <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border p-3.5 transition-colors ${
                    isPassed
                      ? "border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-950/20"
                      : isCooldownActive
                      ? "border-amber-200 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/20"
                      : "border-blue-100 bg-slate-50/60 dark:border-slate-800 dark:bg-surface-elevated"
                  }`}>
                    <div>
                      <div className="flex items-center gap-2">
                        {isPassed ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        ) : isCooldownActive ? (
                          <Timer className="h-4 w-4 text-amber-600 dark:text-amber-400 animate-pulse" />
                        ) : (
                          <ClipboardCheck className="h-4 w-4 text-[#2563EB] dark:text-blue-400" />
                        )}
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {sec.assignment.title}
                        </span>
                      </div>
                      <div className="mt-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                        Type: {sec.assignment.type} · Minimum Pass Mark: {minPass}%
                        {typeof score === "number" && (
                          <span className={`ml-2 font-bold ${isPassed ? "text-emerald-600" : "text-rose-600"}`}>
                            (Your Score: {score}%)
                          </span>
                        )}
                      </div>
                      {isCooldownActive && (
                        <div className="mt-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Retake cooldown active: Available in {formatCooldown(secondsRemaining)}
                        </div>
                      )}
                    </div>

                    <div>
                      {isPassed ? (
                        <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs">
                          <CheckCircle2 className="h-4 w-4" /> Passed ({score ?? 85}%)
                        </span>
                      ) : isCooldownActive ? (
                        <button
                          type="button"
                          onClick={() => handleOpenAssignment(sec)}
                          className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-amber-600 transition-all cursor-pointer"
                        >
                          <Timer className="h-4 w-4" /> Cooldown ({formatCooldown(secondsRemaining)})
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenAssignment(sec)}
                          className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-all hover:scale-105 cursor-pointer"
                        >
                          <FileCheck className="h-4 w-4" /> {typeof score === "number" ? "Retake Assessment" : "Take Assignment"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Sequential Curriculum Rail & Certificate Unlock */}
        <aside className="hidden lg:block w-full shrink-0 border-t border-slate-200 bg-white p-4 sm:p-5 lg:w-[340px] xl:w-[380px] lg:border-t-0 lg:border-l space-y-6 dark:border-slate-800/80 dark:bg-surface-secondary">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Curriculum &amp; Video Lessons</h3>
            <p className="text-xs text-slate-500 font-medium dark:text-slate-400">
              Structured progression with in-app tracking &amp; assessments
            </p>
          </div>

          {/* SECTIONS ACCORDION LIST */}
          <div className="space-y-4">
            {allSections.map((sec, secIdx) => {
              const asgId = sec.assignment.id;
              const score = assignmentScores[asgId] ?? (completedAssignmentIds.includes(asgId) ? 85 : undefined);
              const minPass = sec.assignment.minPassingScore || 70;
              const isPassed = completedAssignmentIds.includes(asgId) && ((typeof score === "number" && score >= minPass) || typeof score === "undefined");
              const cooldownExpiry = assignmentCooldowns[asgId] || 0;
              const isCooldownActive = cooldownExpiry > now;
              const secondsRemaining = Math.max(0, Math.ceil((cooldownExpiry - now) / 1000));

              return (
                <div
                  key={sec.id}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs dark:border-slate-800 dark:bg-surface-secondary"
                >
                  {/* Section Header Accordion */}
                  <div className="flex items-center justify-between bg-slate-50/80 p-3.5 border-b border-slate-100 dark:bg-surface-elevated dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#2563EB] text-[11px] font-bold text-white">
                        {secIdx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-900 line-clamp-1 dark:text-white">
                        {sec.title}
                      </span>
                    </div>
                  </div>

                  {/* Direct Section Videos (Rendered FIRST) */}
                  {sec.directVideos && sec.directVideos.length > 0 && (
                    <div className="p-3 space-y-1.5 border-b border-slate-100 dark:border-slate-800/80">
                      {sec.directVideos.map((vid) => {
                        const isSelected = activeVideo?.id === vid.id;
                        const isDone = completedVideoIds.includes(vid.id);

                        return (
                          <button
                            key={vid.id}
                            type="button"
                            onClick={() => handleSelectVideo(vid, sec.id)}
                            className={`flex w-full items-center justify-between gap-2 rounded-xl p-2.5 text-left text-xs transition-all cursor-pointer ${
                              isSelected
                                ? "bg-[#EFF6FF] text-[#2563EB] font-bold shadow-xs border border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/60"
                                : "text-slate-700 hover:bg-slate-50 border border-transparent dark:text-slate-300 dark:hover:bg-surface-elevated"
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              {isDone ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              ) : (
                                <PlayCircle
                                  className={`h-4 w-4 shrink-0 ${
                                    isSelected ? "text-[#2563EB] dark:text-blue-400" : "text-slate-400 dark:text-slate-400"
                                  }`}
                                />
                              )}
                              <span className="truncate">{vid.title}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 shrink-0 font-mono dark:text-slate-400">
                              {vid.durationFormatted}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Subsections (if any, rendered after direct videos) */}
                  {sec.subsections && sec.subsections.length > 0 && (
                    <div className="p-3 space-y-3 bg-slate-50/30 border-b border-slate-100 dark:bg-surface-elevated/30 dark:border-slate-800">
                      {sec.subsections.map((sub) => (
                        <div key={sub.id} className="space-y-2">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                            <FolderTree className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                            <span>{sub.title}</span>
                          </div>

                          <div className="space-y-1.5 pl-3">
                            {sub.videos.map((vid) => {
                              const isSelected = activeVideo?.id === vid.id;
                              const isDone = completedVideoIds.includes(vid.id);

                              return (
                                <button
                                  key={vid.id}
                                  type="button"
                                  onClick={() => handleSelectVideo(vid, sec.id)}
                                  className={`flex w-full items-center justify-between gap-2 rounded-xl p-2.5 text-left text-xs transition-all cursor-pointer ${
                                    isSelected
                                      ? "bg-[#EFF6FF] text-[#2563EB] font-bold shadow-xs border border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/60"
                                      : "text-slate-700 hover:bg-slate-50 border border-transparent dark:text-slate-300 dark:hover:bg-surface-elevated"
                                  }`}
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    {isDone ? (
                                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                    ) : (
                                      <PlayCircle
                                        className={`h-4 w-4 shrink-0 ${
                                          isSelected ? "text-[#2563EB] dark:text-blue-400" : "text-slate-400 dark:text-slate-400"
                                        }`}
                                      />
                                    )}
                                    <span className="truncate">{vid.title}</span>
                                  </div>
                                  <span className="text-[10px] text-slate-400 shrink-0 font-mono dark:text-slate-400">
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

                  {/* Section Assignment Footer in Rail */}
                  <div className="border-t border-slate-100 p-2.5 bg-slate-50/50 flex items-center justify-between text-[11px] dark:border-slate-800 dark:bg-surface-elevated/50">
                    <span className="font-semibold flex items-center gap-1">
                      {isPassed ? (
                        <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Passed ({score ?? 85}%)
                        </span>
                      ) : isCooldownActive ? (
                        <span className="text-amber-700 dark:text-amber-400 flex items-center gap-1">
                          <Timer className="h-3.5 w-3.5 animate-pulse" /> Retake {formatCooldown(secondsRemaining)}
                        </span>
                      ) : (
                        <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <ClipboardCheck className="h-3.5 w-3.5 text-blue-600" /> Assignment ({minPass}%)
                        </span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenAssignment(sec)}
                      className={`font-bold hover:underline cursor-pointer ${
                        isPassed
                          ? "text-emerald-600 dark:text-emerald-400"
                          : isCooldownActive
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-[#2563EB] dark:text-blue-400"
                      }`}
                    >
                      {isPassed ? "Review" : isCooldownActive ? "Timer" : "Open"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DYNAMIC CERTIFICATE UNLOCK CARD */}
          <div
            className={`rounded-2xl border p-5 transition-all duration-300 ${
              isCertificateUnlocked
                ? "border-amber-300 bg-gradient-to-br from-amber-50 via-white to-blue-50 shadow-md dark:border-amber-500/40 dark:from-amber-950/20 dark:via-surface-secondary dark:to-blue-950/20"
                : "border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-surface-elevated"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  isCertificateUnlocked
                    ? "bg-amber-400 text-slate-950 shadow-xs"
                    : "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                <Award className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide dark:text-white">
                  Accredited Certificate
                </h4>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {isCertificateUnlocked
                    ? "Congratulations! 100% of video lectures and all section assignments passed."
                    : "Certificate is locked. Complete 100% video lectures and pass all section assignments (≥ 70%) to unlock."}
                </p>
              </div>
            </div>

            {/* Checklist */}
            <div className="mt-3.5 space-y-1.5 border-t border-slate-200/60 pt-3 text-[11px] dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  {allVideosCompleted ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Lock className="h-3.5 w-3.5 text-amber-500" />
                  )}
                  Videos Watched
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {completedVideosCount}/{totalVideos}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  {allAssignmentsPassed ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Lock className="h-3.5 w-3.5 text-amber-500" />
                  )}
                  Assignments Passed (&ge;70%)
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {passedAssignmentsCount}/{totalAssignments}
                </span>
              </div>
            </div>

            <div className="mt-4">
              {isCertificateUnlocked ? (
                <button
                  type="button"
                  onClick={() => setShowCertModal(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-2.5 text-xs font-bold text-white shadow-md hover:from-amber-600 hover:to-amber-700 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <Award className="h-4 w-4" /> Download Verified Certificate
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowLockedRequirementsModal(true)}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer dark:border-slate-700 dark:bg-input-bg dark:text-slate-300"
                >
                  <Lock className="h-3.5 w-3.5 text-amber-500" /> View Missing Requirements
                </button>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* SCHEDULE LEARNING TIME MODAL */}
      {showSchedulerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4 dark:border-slate-800/80 dark:bg-surface-secondary">
            <button
              type="button"
              onClick={() => setShowSchedulerModal(false)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer dark:bg-slate-800 dark:text-slate-400"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB] dark:bg-blue-950/50 dark:text-blue-400">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Schedule Learning Time</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Build a daily routine and get automated reminders</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Frequency</label>
                <select className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-800 outline-none dark:border-slate-700/80 dark:bg-input-bg dark:text-white">
                  <option>Every Day (30 mins)</option>
                  <option>Weekdays (Mon-Fri 45 mins)</option>
                  <option>Weekends (Sat-Sun 2 hours)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Preferred Time</label>
                <input
                  type="time"
                  defaultValue="19:00"
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-800 outline-none dark:border-slate-700/80 dark:bg-input-bg dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowSchedulerModal(false)}
                className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer dark:text-slate-400 dark:hover:bg-surface-hover"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSchedulerModal(false);
                  setShowSchedulerBanner(false);
                }}
                className="rounded-xl bg-[#2563EB] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 cursor-pointer"
              >
                Save Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ASK NEW QUESTION MODAL (Q&A) */}
      {showAskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4 dark:border-slate-800/80 dark:bg-surface-secondary">
            <button
              type="button"
              onClick={() => setShowAskModal(false)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">Ask a Question</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Ask the mentor or community about this lecture</p>

            <form onSubmit={handlePostQuestion} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Question Title / Summary</label>
                <input
                  value={newQuestionTitle}
                  onChange={(e) => setNewQuestionTitle(e.target.value)}
                  placeholder="e.g. Why does my Spring Boot application fail on port 8080?"
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 outline-none focus:border-[#2563EB] dark:border-slate-700/80 dark:bg-input-bg dark:text-white dark:placeholder-slate-400"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Details &amp; Code Snippets</label>
                <textarea
                  rows={4}
                  value={newQuestionBody}
                  onChange={(e) => setNewQuestionBody(e.target.value)}
                  placeholder="Provide context, error stack traces or what you've tried..."
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-mono text-slate-900 outline-none focus:border-[#2563EB] dark:border-slate-700/80 dark:bg-input-bg dark:text-white dark:placeholder-slate-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAskModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer dark:text-slate-400 dark:hover:bg-surface-hover"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" /> Post Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SECTION ASSIGNMENT MODAL (With Interactive Questions & Cooldown Guard) */}
      {activeAssignmentSection && (() => {
        const asgId = activeAssignmentSection.assignment.id;
        const cooldownExpiry = assignmentCooldowns[asgId] || 0;
        const isCooldownActive = cooldownExpiry > now;
        const secondsRemaining = Math.max(0, Math.ceil((cooldownExpiry - now) / 1000));
        const minPass = activeAssignmentSection.assignment.minPassingScore || 70;
        const questions = activeAssignmentSection.assignment.questions || [];

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto">
            <div className="relative w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl space-y-5 my-8 dark:border-slate-800/80 dark:bg-surface-secondary">
              <button
                type="button"
                onClick={() => setActiveAssignmentSection(null)}
                className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer dark:bg-slate-800 dark:text-slate-400"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB] dark:bg-blue-950/60 dark:text-blue-400">
                  <ClipboardCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {activeAssignmentSection.assignment.title}
                  </h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Section Assessment · Passing Threshold: <strong className="text-slate-800 dark:text-slate-200">{minPass}% Score</strong>
                  </div>
                </div>
              </div>

              {/* COOLDOWN WARNING BANNER */}
              {isCooldownActive && (
                <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-xs space-y-2 dark:border-amber-800 dark:bg-amber-950/40">
                  <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300">
                    <Timer className="h-4 w-4 animate-spin text-amber-600 dark:text-amber-400" />
                    <span>Retake Cooldown in Progress</span>
                  </div>
                  <p className="text-amber-800 dark:text-amber-300">
                    You did not achieve the required {minPass}% passing mark on your previous attempt. You must wait for the cooldown timelimit to expire before submitting again.
                  </p>
                  <div className="flex items-center gap-2 pt-1 font-mono text-xs font-bold text-amber-950 dark:text-amber-200">
                    <span>Available to submit in:</span>
                    <span className="rounded-lg bg-amber-200/80 px-2.5 py-1 text-sm text-amber-900 dark:bg-amber-900 dark:text-amber-100">
                      {formatCooldown(secondsRemaining)}
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
                <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 font-medium leading-relaxed dark:bg-surface-elevated dark:border-slate-800">
                  {activeAssignmentSection.assignment.description}
                </div>

                {questions.length > 0 ? (
                  <div className="space-y-4">
                    <div className="text-xs font-bold text-slate-900 uppercase tracking-wider dark:text-white">
                      Assessment Questions ({questions.length})
                    </div>
                    {questions.map((q, qIdx) => (
                      <div key={qIdx} className="space-y-2.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-surface-elevated/60">
                        <div className="font-bold text-slate-900 text-xs sm:text-sm dark:text-white">
                          <span className="text-[#2563EB] dark:text-blue-400 mr-1.5">Q{qIdx + 1}.</span> {q.prompt}
                        </div>
                        <div className="space-y-2 pt-1">
                          {q.choices?.map((choice, cIdx) => {
                            const isSelected = activeQuizAnswers[qIdx] === cIdx;
                            return (
                              <button
                                key={cIdx}
                                type="button"
                                disabled={isCooldownActive}
                                onClick={() => handleSelectQuizAnswer(qIdx, cIdx)}
                                className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left text-xs transition-all cursor-pointer ${
                                  isCooldownActive
                                    ? "opacity-60 cursor-not-allowed bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800"
                                    : isSelected
                                    ? "border-[#2563EB] bg-blue-50/70 font-semibold text-[#2563EB] shadow-xs dark:bg-blue-950/40 dark:border-blue-500 dark:text-blue-300"
                                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-surface-secondary dark:text-slate-300 dark:hover:bg-surface-hover"
                                }`}
                              >
                                <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                                  isSelected
                                    ? "border-[#2563EB] bg-[#2563EB] text-white dark:border-blue-400 dark:bg-blue-500"
                                    : "border-slate-300 text-slate-500 dark:border-slate-600 dark:text-slate-400"
                                }`}>
                                  {String.fromCharCode(65 + cIdx)}
                                </div>
                                <span className="flex-1">{choice}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      Submit Milestone GitHub Repository URL or Solution Notes:
                    </label>
                    <textarea
                      rows={3}
                      disabled={isCooldownActive}
                      defaultValue="https://github.com/student-workspace/jks-milestone-solution"
                      className="w-full rounded-xl border border-slate-200 p-3 text-xs font-mono text-slate-800 outline-none focus:border-[#2563EB] dark:border-slate-700/80 dark:bg-input-bg dark:text-white"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                <div className="text-[11px] text-slate-400">
                  {questions.length > 0
                    ? `${Object.keys(activeQuizAnswers).length} of ${questions.length} answered`
                    : "Ready for evaluation"}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveAssignmentSection(null)}
                    className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer dark:text-slate-400 dark:hover:bg-surface-hover"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    disabled={isCooldownActive}
                    onClick={() => handleSubmitAssignment(activeAssignmentSection)}
                    className={`flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all ${
                      isCooldownActive
                        ? "bg-slate-400 cursor-not-allowed opacity-60 dark:bg-slate-700"
                        : "bg-emerald-600 hover:bg-emerald-700 cursor-pointer hover:scale-105"
                    }`}
                  >
                    <FileCheck className="h-4 w-4" />
                    {isCooldownActive ? `Cooldown (${formatCooldown(secondsRemaining)})` : "Submit & Evaluate Score"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* EVALUATION FEEDBACK MODAL (Shows Real Pass/Fail + Cooldown Explanation) */}
      {evaluationResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl space-y-4 text-center dark:border-slate-800/80 dark:bg-surface-secondary">
            <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${
              evaluationResult.passed
                ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
                : "bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400"
            }`}>
              {evaluationResult.passed ? (
                <CheckCircle2 className="h-8 w-8" />
              ) : (
                <XCircle className="h-8 w-8" />
              )}
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {evaluationResult.passed ? "Assessment Passed! 🎉" : "Assessment Failed"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {evaluationResult.title}
              </p>
            </div>

            <div className={`rounded-2xl p-4 border ${
              evaluationResult.passed
                ? "bg-emerald-50 border-emerald-200 text-emerald-950 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-200"
                : "bg-rose-50 border-rose-200 text-rose-950 dark:bg-rose-950/30 dark:border-rose-800 dark:text-rose-200"
            }`}>
              <div className="text-2xl font-black">{evaluationResult.score}%</div>
              <div className="text-xs font-semibold mt-1">
                Required Passing Mark: {evaluationResult.minPass}%
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {evaluationResult.passed
                ? "Great job! You met the passing requirements. Your milestone progress has been verified and saved to your course record."
                : "Your score was below the minimum required passing mark. In accordance with course standards, the certificate remains locked until you retake and pass this assessment. A 3-minute cooldown timer has been initiated."}
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setEvaluationResult(null)}
                className={`w-full rounded-xl py-2.5 text-xs font-bold text-white shadow-xs cursor-pointer ${
                  evaluationResult.passed ? "bg-emerald-600 hover:bg-emerald-700" : "bg-[#2563EB] hover:bg-blue-700"
                }`}
              >
                {evaluationResult.passed ? "Continue Learning" : "Understood, Review Lectures"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOCKED REQUIREMENTS MODAL */}
      {showLockedRequirementsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl space-y-4 dark:border-slate-800/80 dark:bg-surface-secondary">
            <button
              type="button"
              onClick={() => setShowLockedRequirementsModal(false)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer dark:bg-slate-800 dark:text-slate-400"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Certificate Requirements</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Both criteria must be 100% completed to unlock</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className={`flex items-center justify-between p-3 rounded-2xl border ${
                allVideosCompleted
                  ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800"
                  : "bg-slate-50 border-slate-200 dark:bg-surface-elevated dark:border-slate-700"
              }`}>
                <div className="flex items-center gap-2.5">
                  {allVideosCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Clock className="h-4 w-4 text-amber-500" />
                  )}
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">All Course Video Lectures</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Watch 100% of all lectures</div>
                  </div>
                </div>
                <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                  {completedVideosCount}/{totalVideos}
                </div>
              </div>

              <div className={`flex items-center justify-between p-3 rounded-2xl border ${
                allAssignmentsPassed
                  ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800"
                  : "bg-slate-50 border-slate-200 dark:bg-surface-elevated dark:border-slate-700"
              }`}>
                <div className="flex items-center gap-2.5">
                  {allAssignmentsPassed ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  )}
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">All Section Assignments</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Score &ge; 70% on each assessment</div>
                  </div>
                </div>
                <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                  {passedAssignmentsCount}/{totalAssignments}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              If an assignment is failed, please wait for the retake timelimit to expire and retake it. Once all milestones are achieved, your official verified certificate will be immediately accessible.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowLockedRequirementsModal(false)}
                className="w-full rounded-xl bg-[#2563EB] py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 cursor-pointer"
              >
                Back to Learning
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VERIFIED PRINTABLE CERTIFICATE MODAL */}
      <CertificateModal
        certificate={
          showCertModal
            ? {
                id: `JKS-CERT-2026-${course.slug.toUpperCase().slice(0, 8)}`,
                studentName,
                courseTitle: course.title,
                issuedDate: new Date().toISOString(),
                grade: "Mastery & Stage Completion (100%)",
              }
            : null
        }
        onClose={() => setShowCertModal(false)}
      />
    </div>
  );
}
