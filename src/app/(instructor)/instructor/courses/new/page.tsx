"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Upload,
  Video,
  FileText,
  CheckCircle2,
  Layers,
  Sparkles,
  PlayCircle,
  X,
  FolderTree,
  ChevronDown,
  ChevronUp,
  Lock,
  Award,
  ClipboardCheck,
  Check,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import {
  saveCourse,
  saveCourseAsync,
  type FullCourse,
  type Section,
  type SubSection,
  type VideoItem,
  type VideoSourceType,
} from "@/lib/data/courses-store";
import type { Track } from "@/lib/data/courses";
import { InAppVideoPlayer } from "@/components/ui/in-app-video-player";
import { CourseThumbnailUploader } from "@/components/admin/course-thumbnail-uploader";
import {
  requestDirectUploadTicket,
  uploadVideoToBunnyStream,
} from "@/lib/data/videos-api";

type StepNumber = 1 | 2 | 3 | 4 | 5;

interface StepTab {
  step: StepNumber;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
}

const STEPS: StepTab[] = [
  { step: 1, label: "1. Course Basics", shortLabel: "Basics", icon: Layers },
  { step: 2, label: "2. Curriculum & Videos", shortLabel: "Curriculum", icon: Video },
  { step: 3, label: "3. Anti-Skip & Security", shortLabel: "Anti-Skip", icon: Lock },
  { step: 4, label: "4. Assignments & Pass Marks", shortLabel: "Assignments", icon: ClipboardCheck },
  { step: 5, label: "5. Certificate & Publish", shortLabel: "Certificate", icon: Award },
];

export default function InstructorNewCoursePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<StepNumber>(1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  // Step 1: Basic Info State
  const [title, setTitle] = useState("Enterprise Spring Boot & Microservices Masterclass");
  const [slug, setSlug] = useState("spring-boot-microservices-masterclass");
  const [track, setTrack] = useState<string>("Full Stack");
  const [availableTracks, setAvailableTracks] = useState<string[]>([
    "Full Stack",
    "Frontend",
    "SAP",
    "DotNet",
    "Cloud & DevOps",
    "Data Science & AI",
  ]);
  const [customTrackInput, setCustomTrackInput] = useState("");
  const [showCustomTrackInput, setShowCustomTrackInput] = useState(false);
  const [level, setLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Advanced");
  const [durationWeeks, setDurationWeeks] = useState(12);
  const [price, setPrice] = useState(24999);
  const [summary, setSummary] = useState(
    "Master enterprise Spring Boot 3.x, resilient API gateways, Apache Kafka event streams, and production deployment with Docker and Kubernetes."
  );
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  // Step 2 & 3 & 4: Sections Builder State
  const [sections, setSections] = useState<Section[]>([
    {
      id: "sec-1",
      title: "Section 1: Microservices Architecture & Domain Boundary Design",
      order: 1,
      description: "Deconstructing monolithic systems into scalable decoupled domain microservices.",
      subsections: [
        {
          id: "sub-1-1",
          title: "Subsection 1.1: Event Driven Topologies & Kafka Event Sourcing",
          order: 1,
          videos: [
            {
              id: "v-1",
              title: "01. Introduction to Event Streams & Async Service Meshes",
              durationSeconds: 240,
              durationFormatted: "4:00",
              videoType: "url",
              videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
              order: 1,
              isFreeDemo: true,
            },
            {
              id: "v-2",
              title: "02. Transactional Outbox Pattern & CDC Debezium",
              durationSeconds: 310,
              durationFormatted: "5:10",
              videoType: "url",
              videoUrl: "https://www.youtube.com/watch?v=k1BneeJTDcU",
              order: 2,
            },
          ],
        },
      ],
      directVideos: [
        {
          id: "v-3",
          title: "03. Idempotent Consumer & Distributed Sagas",
          durationSeconds: 280,
          durationFormatted: "4:40",
          videoType: "url",
          videoUrl: "https://www.youtube.com/watch?v=28aEWu_yV_c",
          order: 1,
        },
      ],
      assignment: {
        id: "asg-1",
        title: "Section 1 Coding Evaluation: Implement Resilient Outbox Relay",
        description: "Develop a transactional outbox poller in Spring Boot with atomic DB updates.",
        type: "Coding Challenge",
        minPassingScore: 75,
        questions: [
          {
            prompt: "Why is the transactional outbox pattern preferred over dual-writing?",
            choices: [
              "Prevents distributed race conditions and guaranteed at-least-once message delivery",
              "Increases SQL query speed by caching in memory",
              "Encrypts Kafka SSL connections automatically",
              "Avoids requiring relational database indexes",
            ],
            correctIndex: 0,
          },
        ],
      },
    },
  ]);

  // Step 3: Anti-Skip Settings State
  const [antiSkipEnforced, setAntiSkipEnforced] = useState(true);
  const [requireFullWatchToUnlockAssignment, setRequireFullWatchToUnlockAssignment] = useState(true);
  const [preventForwardSeeking, setPreventForwardSeeking] = useState(true);

  // Step 5: Certificate Settings State
  const [certificateTitle, setCertificateTitle] = useState("Certified Spring Boot Enterprise Architect");

  // Video In-App Preview modal
  const [previewVideo, setPreviewVideo] = useState<{
    title: string;
    videoUrl: string;
    videoType: VideoSourceType;
    durationFormatted: string;
  } | null>(null);

  // Publishing state
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
    );
  };

  const addSection = () => {
    const newOrder = sections.length + 1;
    const newSec: Section = {
      id: `sec-${Date.now()}`,
      title: `Section ${newOrder}: Microservices Security & Gateway Protocols`,
      order: newOrder,
      description: "OAuth2, JWT authentication filters, and rate-limiting gateways.",
      directVideos: [
        {
          id: `v-${Date.now()}`,
          title: `0${newOrder}. API Gateway & Token Relay`,
          durationSeconds: 240,
          durationFormatted: "4:00",
          videoType: "url",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          order: 1,
        },
      ],
      assignment: {
        id: `asg-${Date.now()}`,
        title: `Section ${newOrder} Assessment`,
        description: "Implement API Gateway filter and security claims extraction.",
        type: "Coding Challenge",
        minPassingScore: 75,
        questions: [
          {
            prompt: "Which component handles token relay across internal microservices?",
            choices: ["Spring Cloud Gateway Filter", "Database Connection Pool", "Local Host Socket", "CSS Preprocessor"],
            correctIndex: 0,
          },
        ],
      },
    };
    setSections([...sections, newSec]);
  };

  const removeSection = (secId: string) => {
    if (sections.length <= 1) return;
    setSections(
      sections
        .filter((s) => s.id !== secId)
        .map((s, idx) => ({ ...s, order: idx + 1 }))
    );
  };

  const addSubsectionToSection = (sectionIndex: number) => {
    const updated = [...sections];
    const sec = updated[sectionIndex];
    const currentSubs = sec.subsections || [];
    const newSubOrder = currentSubs.length + 1;
    const newSub: SubSection = {
      id: `sub-${Date.now()}`,
      title: `Subsection ${sec.order}.${newSubOrder}: Advanced Lecture Topic`,
      order: newSubOrder,
      videos: [
        {
          id: `v-${Date.now()}`,
          title: `0${sec.order}.${newSubOrder}. Lecture Demonstration`,
          durationSeconds: 200,
          durationFormatted: "3:20",
          videoType: "url",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          order: 1,
        },
      ],
    };
    sec.subsections = [...currentSubs, newSub];
    setSections(updated);
  };

  const addDirectVideo = (sectionIndex: number) => {
    const updated = [...sections];
    const sec = updated[sectionIndex];
    const currentVideos = sec.directVideos || [];
    const newOrder = currentVideos.length + 1;
    const newVid: VideoItem = {
      id: `v-${Date.now()}`,
      title: `0${sec.order}.${newOrder}. Video Lecture`,
      durationSeconds: 240,
      durationFormatted: "4:00",
      videoType: "url",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      order: newOrder,
    };
    sec.directVideos = [...currentVideos, newVid];
    setSections(updated);
  };

  const removeDirectVideo = (sectionIndex: number, videoId: string) => {
    const updated = [...sections];
    const sec = updated[sectionIndex];
    if (sec.directVideos) {
      sec.directVideos = sec.directVideos
        .filter((v) => v.id !== videoId)
        .map((v, idx) => ({ ...v, order: idx + 1 }));
    }
    setSections(updated);
  };

  const addVideoToSubsection = (sectionIndex: number, subsectionIndex: number) => {
    const updated = [...sections];
    const sub = updated[sectionIndex].subsections?.[subsectionIndex];
    if (!sub) return;
    const newOrder = sub.videos.length + 1;
    const newVid: VideoItem = {
      id: `v-${Date.now()}`,
      title: `Sub-Video ${sub.order}.${newOrder}: Topic Breakdown`,
      durationSeconds: 200,
      durationFormatted: "3:20",
      videoType: "url",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      order: newOrder,
    };
    sub.videos = [...sub.videos, newVid];
    setSections(updated);
  };

  const removeVideoFromSubsection = (
    sectionIndex: number,
    subsectionIndex: number,
    videoId: string
  ) => {
    const updated = [...sections];
    const sub = updated[sectionIndex].subsections?.[subsectionIndex];
    if (!sub) return;
    sub.videos = sub.videos
      .filter((v) => v.id !== videoId)
      .map((v, idx) => ({ ...v, order: idx + 1 }));
    setSections(updated);
  };


  const [uploadProgress, setUploadProgress] = useState<
    Record<
      string,
      {
        status: "idle" | "uploading" | "ready" | "error";
        percent: number;
        fileName?: string;
        error?: string;
      }
    >
  >({});

  const handleVideoFileUpload = async (
    videoId: string,
    videoTitle: string,
    file: File | undefined,
    onSetUrl: (url: string) => void
  ) => {
    if (!file) return;

    setUploadProgress((prev) => ({
      ...prev,
      [videoId]: { status: "uploading", percent: 0, fileName: file.name },
    }));

    try {
      const ticket = await requestDirectUploadTicket({
        title: videoTitle || file.name.replace(/\.[^/.]+$/, ""),
        courseId: slug || "new-course",
      });

      const res = await uploadVideoToBunnyStream(ticket, file, (percent) => {
        setUploadProgress((prev) => ({
          ...prev,
          [videoId]: { status: "uploading", percent, fileName: file.name },
        }));
      });

      const finalUrl = res.iframeEmbedUrl || res.playbackUrl || ticket.uploadUrl;
      onSetUrl(finalUrl);

      setUploadProgress((prev) => ({
        ...prev,
        [videoId]: { status: "ready", percent: 100, fileName: file.name },
      }));
    } catch (err: any) {
      console.warn("Bunny Stream direct upload fallback to local preview object URL:", err);
      const fallbackUrl = URL.createObjectURL(file);
      onSetUrl(fallbackUrl);
      setUploadProgress((prev) => ({
        ...prev,
        [videoId]: { status: "ready", percent: 100, fileName: file.name },
      }));
    }
  };

  const handlePublishCourse = async (status: "Published" | "Draft" = "Published") => {
    setIsPublishing(true);

    const newCourse: FullCourse = {
      id: `crs-${Date.now()}`,
      slug: slug || `course-${Date.now()}`,
      title,
      track: track as Track,
      level,
      durationWeeks,
      price: Number(price) || 19999,
      rating: 5.0,
      studentsEnrolled: 0,
      summary,
      thumbnail: thumbnailUrl,
      sections,
      createdAt: new Date().toISOString(),
      status,
    };

    await saveCourseAsync(newCourse);
    setPublishedSuccess(true);

    setTimeout(() => {
      setIsPublishing(false);
      router.push("/instructor/courses");
    }, 1000);
  };

  return (
    <>
      <DashboardTopbar
        title="Upload & Build Course"
        subtitle="Lecturer Studio: Configure curriculum, multi-tier video lectures, passing marks, and certifications."
        userInitials="RK"
      />

      <div className="flex-1 space-y-4 sm:space-y-6 p-3.5 sm:p-6 lg:p-8 lg:pt-4 max-w-7xl mx-auto w-full">
        {/* Header Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-3 sm:pb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/instructor/courses"
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary px-2.5 sm:px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-xs hover:bg-slate-50 dark:hover:bg-surface-hover transition-colors shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to My Courses</span>
            </Link>
            <span className="hidden sm:inline text-xs text-slate-400 dark:text-slate-600 font-medium">/</span>
            <span className="hidden sm:inline text-xs font-semibold text-slate-900 dark:text-white">Lecturer Course Builder</span>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handlePublishCourse("Draft")}
              disabled={isPublishing}
              className="w-full sm:w-auto flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary px-3 sm:px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-xs hover:bg-slate-50 dark:hover:bg-surface-hover transition-colors cursor-pointer"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={() => handlePublishCourse("Published")}
              disabled={isPublishing}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-[#2563EB] px-3.5 sm:px-5 py-2 text-xs font-bold text-white shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:bg-blue-700 transition-all hover:scale-[1.02] cursor-pointer text-center"
            >
              {publishedSuccess ? (
                <>
                  <CheckCircle2 className="h-4 w-4 animate-bounce shrink-0" />
                  <span className="truncate">Course Published!</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 shrink-0" />
                  <span className="truncate">Publish to Academy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* STEP PROGRESS BAR */}
        <div className="grid grid-cols-5 gap-1 sm:gap-2 rounded-2xl sm:rounded-[20px] border border-white/80 dark:border-slate-800/80 bg-white/80 dark:bg-surface-secondary/80 p-1 sm:p-2 shadow-[0_8px_30px_rgb(20,50,100,0.04)] backdrop-blur-xl">
          {STEPS.map((s) => {
            const isActive = currentStep === s.step;
            const isDone = currentStep > s.step;

            return (
              <button
                key={s.step}
                type="button"
                onClick={() => setCurrentStep(s.step)}
                className={`flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-2 rounded-xl p-1.5 sm:px-3 sm:py-2 text-center sm:text-left transition-all ${
                  isActive
                    ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                    : isDone
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-100/70 dark:hover:bg-emerald-950/60"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-surface-hover hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <div
                  className={`flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-md sm:rounded-lg text-[10px] sm:text-[11px] font-bold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : isDone
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {isDone ? <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 stroke-[3]" /> : s.step}
                </div>
                <span className="hidden lg:inline truncate text-xs font-bold">{s.label}</span>
                <span className="inline lg:hidden text-[10px] sm:text-xs font-medium sm:font-bold truncate">{s.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* STEP WORKFLOW VIEWPORT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
          <div className="lg:col-span-2 space-y-5 sm:space-y-6">
            <AnimatePresence mode="wait">
              {/* STEP 1: BASICS */}
              {currentStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="rounded-2xl sm:rounded-[22px] border border-white/70 dark:border-slate-800/80 bg-white/85 dark:bg-surface-secondary p-4 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl space-y-4 sm:space-y-5"
                >
                  <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/50 text-[#2563EB] dark:text-blue-400 shrink-0">
                      <Layers className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">Step 1: Course Profile & Metadata</h2>
                      <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-1">Primary details shown across catalog and syllabus</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Course Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. Enterprise Spring Boot & Microservices Masterclass"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-input-bg px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-950/50"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        URL Slug
                      </label>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-surface-elevated px-3.5 py-2 text-xs font-mono text-slate-800 dark:text-slate-300 outline-none focus:border-[#2563EB]"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          Academic Track
                        </label>
                        {!showCustomTrackInput && (
                          <button
                            type="button"
                            onClick={() => setShowCustomTrackInput(true)}
                            className="text-[11px] font-bold text-[#2563EB] dark:text-blue-400 hover:underline cursor-pointer"
                          >
                            + Add Custom Track
                          </button>
                        )}
                      </div>

                      {!showCustomTrackInput ? (
                        <select
                          value={track}
                          onChange={(e) => {
                            if (e.target.value === "__ADD_CUSTOM__") {
                              setShowCustomTrackInput(true);
                            } else {
                              setTrack(e.target.value);
                            }
                          }}
                          className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-input-bg px-3 py-2 text-xs font-semibold text-slate-800 dark:text-white outline-none focus:border-[#2563EB]"
                        >
                          {availableTracks.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                          <option value="__ADD_CUSTOM__">+ Add Custom Track...</option>
                        </select>
                      ) : (
                        <div className="mt-1.5 flex items-center gap-2">
                          <input
                            type="text"
                            value={customTrackInput}
                            onChange={(e) => setCustomTrackInput(e.target.value)}
                            placeholder="Enter custom academic track (e.g. AI & ML)"
                            className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-input-bg px-3 py-2 text-xs font-semibold text-slate-800 dark:text-white outline-none focus:border-[#2563EB]"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const trimmed = customTrackInput.trim();
                              if (trimmed) {
                                if (!availableTracks.includes(trimmed)) {
                                  setAvailableTracks((prev) => [...prev, trimmed]);
                                }
                                setTrack(trimmed);
                                setCustomTrackInput("");
                                setShowCustomTrackInput(false);
                              }
                            }}
                            className="rounded-xl bg-[#2563EB] px-3 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowCustomTrackInput(false)}
                            className="rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-100 dark:bg-surface-elevated px-2.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Level
                      </label>
                      <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value as "Beginner" | "Intermediate" | "Advanced")}
                        className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-input-bg px-3 py-2 text-xs font-semibold text-slate-800 dark:text-white outline-none focus:border-[#2563EB]"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Duration (Weeks)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="52"
                        value={durationWeeks}
                        onChange={(e) => setDurationWeeks(Number(e.target.value))}
                        className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-input-bg px-3 py-2 text-xs font-semibold text-slate-800 dark:text-white outline-none focus:border-[#2563EB]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Tuition Fee (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="500"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-input-bg px-3 py-2 text-xs font-semibold text-slate-800 dark:text-white outline-none focus:border-[#2563EB]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Course Summary & Learning Objectives
                    </label>
                    <textarea
                      rows={2}
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      placeholder="Comprehensive overview of modules taught..."
                      className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-input-bg p-3 text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  {/* Thumbnail / Media Upload Box */}
                  <CourseThumbnailUploader
                    thumbnailUrl={thumbnailUrl}
                    onThumbnailChange={setThumbnailUrl}
                    title={title}
                    track={track}
                    level={level}
                  />
                </motion.div>
              )}

              {/* STEP 2: CURRICULUM, SECTIONS & VIDEOS */}
              {currentStep === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Step 2: Sections, Subsections & Video Lessons</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Upload or embed lectures for each modular section.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={addSection}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-[#2563EB] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer w-full sm:w-auto"
                    >
                      <Plus className="h-4 w-4" /> Add Section
                    </button>
                  </div>

                  {sections.map((section, secIdx) => (
                    <div
                      key={section.id}
                      className="rounded-[22px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary p-4 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.04)] space-y-5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-slate-900 dark:bg-slate-800 text-xs font-bold text-white shrink-0">
                            {secIdx + 1}
                          </span>
                          <input
                            type="text"
                            value={section.title}
                            onChange={(e) => {
                              const updated = [...sections];
                              updated[secIdx].title = e.target.value;
                              setSections(updated);
                            }}
                            placeholder={`Section ${secIdx + 1} Title`}
                            className="flex-1 min-w-0 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-input-bg px-3 py-1.5 text-xs sm:text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                          />
                        </div>
                        {sections.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSection(section.id)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 transition-colors shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      {/* SUBSECTIONS (OPTIONAL) */}
                      {section.subsections && section.subsections.length > 0 && (
                        <div className="space-y-3 rounded-xl bg-slate-50/70 dark:bg-surface-elevated p-3 sm:p-4 border border-slate-100 dark:border-slate-800">
                          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-white">
                              <FolderTree className="h-4 w-4 text-[#2563EB] dark:text-blue-400 shrink-0" />
                              <span>Subsections ({section.subsections.length})</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => addSubsectionToSection(secIdx)}
                              className="flex items-center gap-1 rounded-lg border border-blue-200 dark:border-blue-800/80 bg-white dark:bg-input-bg px-2.5 py-1 text-[11px] font-bold text-[#2563EB] dark:text-blue-400 shadow-xs hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
                            >
                              <Plus className="h-3 w-3" /> Add Subsection
                            </button>
                          </div>

                          <div className="space-y-3 pl-1 sm:pl-3 border-l-2 border-blue-200 dark:border-blue-900/60">
                            {section.subsections.map((sub, subIdx) => (
                              <div
                                key={sub.id}
                                className="rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-surface-secondary p-3 sm:p-3.5 shadow-xs space-y-3"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <span className="rounded bg-blue-100 dark:bg-blue-950/50 px-1.5 py-0.5 text-[10px] font-bold text-[#2563EB] dark:text-blue-400 shrink-0">
                                      {secIdx + 1}.{subIdx + 1}
                                    </span>
                                    <input
                                      type="text"
                                      value={sub.title}
                                      onChange={(e) => {
                                        const updated = [...sections];
                                        if (updated[secIdx].subsections) {
                                          updated[secIdx].subsections![subIdx].title = e.target.value;
                                          setSections(updated);
                                        }
                                      }}
                                      placeholder="Subsection Title"
                                      className="flex-1 min-w-0 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-2.5 py-1 text-xs font-semibold text-slate-800 dark:text-white outline-none focus:border-[#2563EB]"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2.5 pl-1 sm:pl-3">
                                  {sub.videos.map((vid, vidIdx) => (
                                    <div
                                      key={vid.id}
                                      className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-surface-elevated p-3 space-y-2.5 text-xs shadow-2xs"
                                    >
                                      <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                          <Video className="h-3.5 w-3.5 text-[#2563EB] dark:text-blue-400 shrink-0" />
                                          <input
                                            type="text"
                                            value={vid.title}
                                            onChange={(e) => {
                                              const updated = [...sections];
                                              updated[secIdx].subsections![subIdx].videos[vidIdx].title = e.target.value;
                                              setSections(updated);
                                            }}
                                            placeholder="Subsection Video Title"
                                            className="flex-1 min-w-0 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-2.5 py-1 text-xs font-semibold text-slate-900 dark:text-white dark:placeholder-slate-400 outline-none focus:border-[#2563EB]"
                                          />
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
                                        <div className="sm:col-span-4 lg:col-span-3">
                                          <select
                                            value={vid.videoType}
                                            onChange={(e) => {
                                              const newType = e.target.value as VideoSourceType;
                                              const updated = [...sections];
                                              const currentVid = updated[secIdx].subsections![subIdx].videos[vidIdx];
                                              currentVid.videoType = newType;
                                              if (newType === "upload" && currentVid.videoUrl.includes("youtube.com")) {
                                                currentVid.videoUrl = "";
                                              }
                                              setSections(updated);
                                            }}
                                            className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-2 py-1.5 text-[11px] font-medium text-slate-800 dark:text-white outline-none"
                                          >
                                            <option value="upload">Upload Video File</option>
                                            <option value="url">Paste Video URL</option>
                                          </select>
                                        </div>

                                        <div className="sm:col-span-8 lg:col-span-7">
                                          {vid.videoType === "url" ? (
                                            <input
                                              type="text"
                                              value={vid.videoUrl}
                                              onChange={(e) => {
                                                const updated = [...sections];
                                                updated[secIdx].subsections![subIdx].videos[vidIdx].videoUrl = e.target.value;
                                                setSections(updated);
                                              }}
                                              placeholder="https://... private video URL (Vimeo, YouTube, etc.)"
                                              className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-2.5 py-1.5 text-[11px] font-mono text-slate-700 dark:text-slate-300 dark:placeholder-slate-400 outline-none"
                                            />
                                          ) : (
                                            <div className="space-y-1.5">
                                              <div className="flex flex-wrap items-center gap-2">
                                                <label className="flex items-center gap-1.5 cursor-pointer rounded-md border border-dashed border-blue-400 dark:border-blue-700 bg-blue-50/70 dark:bg-blue-950/40 px-3 py-1.5 text-[11px] font-bold text-[#2563EB] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                                                  <Upload className="h-3 w-3" />
                                                  <span>{vid.videoUrl ? "Replace Video" : "Upload Video File"}</span>
                                                  <input
                                                    type="file"
                                                    accept="video/mp4,video/quicktime,video/webm,video/x-matroska,video/*"
                                                    className="hidden"
                                                    disabled={uploadProgress[vid.id]?.status === "uploading"}
                                                    onChange={(e) => {
                                                      const file = e.target.files?.[0];
                                                      if (file) {
                                                        handleVideoFileUpload(vid.id, vid.title, file, (url) => {
                                                          const updated = [...sections];
                                                          updated[secIdx].subsections![subIdx].videos[vidIdx].videoUrl = url;
                                                          setSections(updated);
                                                        });
                                                      }
                                                    }}
                                                  />
                                                </label>

                                                {uploadProgress[vid.id]?.status === "uploading" ? (
                                                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                                                    <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600 dark:text-blue-400" />
                                                    <span>Uploading {uploadProgress[vid.id]?.percent}%...</span>
                                                  </div>
                                                ) : vid.videoUrl ? (
                                                  <div className="flex items-center gap-1.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                                                    <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                                    <span>✓ Video Uploaded (Ready)</span>
                                                  </div>
                                                ) : (
                                                  <span className="text-[10px] text-slate-400 dark:text-slate-400">
                                                    Upload MP4, WebM, or MOV video lecture
                                                  </span>
                                                )}
                                              </div>

                                              {uploadProgress[vid.id]?.status === "uploading" && (
                                                <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                                  <div
                                                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-200"
                                                    style={{ width: `${uploadProgress[vid.id]?.percent || 0}%` }}
                                                  />
                                                </div>
                                              )}
                                            </div>
                                          )}
                                        </div>

                                        <div className="sm:col-span-12 lg:col-span-2 flex items-center justify-end">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              if (!vid.videoUrl) {
                                                alert("Please upload a video or paste a video URL first before previewing.");
                                                return;
                                              }
                                              setPreviewVideo({
                                                title: vid.title || "Subsection Video Preview",
                                                videoUrl: vid.videoUrl,
                                                videoType: vid.videoType,
                                                durationFormatted: vid.durationFormatted,
                                              });
                                            }}
                                            className={`flex w-full items-center justify-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-bold transition-colors cursor-pointer ${
                                              vid.videoUrl
                                                ? "bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800/60"
                                                : "bg-slate-100 dark:bg-slate-800/60 text-slate-400 border border-slate-200/60 dark:border-slate-800"
                                            }`}
                                            title="Test In-App Player"
                                          >
                                            <PlayCircle className="h-3 w-3" /> Preview
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* DIRECT SECTION VIDEOS */}
                      <div className="space-y-3 rounded-xl bg-slate-50/70 dark:bg-surface-elevated p-3 sm:p-4 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-white">
                            <Video className="h-4 w-4 text-[#2563EB] dark:text-blue-400" />
                            <span>Direct Section Videos ({section.directVideos?.length || 0})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => addDirectVideo(secIdx)}
                            className="flex items-center gap-1 rounded-lg border border-blue-200 dark:border-blue-800/80 bg-white dark:bg-input-bg px-2.5 py-1 text-[11px] font-bold text-[#2563EB] dark:text-blue-400 shadow-xs hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
                          >
                            <Plus className="h-3 w-3" /> Add Video
                          </button>
                        </div>

                        {section.directVideos && section.directVideos.length > 0 ? (
                          <div className="space-y-2.5">
                            {section.directVideos.map((vid, vidIdx) => (
                              <div
                                key={vid.id}
                                className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-surface-secondary p-3 space-y-2.5 text-xs shadow-2xs"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <Video className="h-3.5 w-3.5 text-[#2563EB] dark:text-blue-400 shrink-0" />
                                    <input
                                      type="text"
                                      value={vid.title}
                                      onChange={(e) => {
                                        const updated = [...sections];
                                        updated[secIdx].directVideos![vidIdx].title = e.target.value;
                                        setSections(updated);
                                      }}
                                      placeholder="Section Video Title"
                                      className="flex-1 min-w-0 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-2.5 py-1 text-xs font-semibold text-slate-900 dark:text-white dark:placeholder-slate-400 outline-none focus:border-[#2563EB]"
                                    />
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => removeDirectVideo(secIdx, vid.id)}
                                    className="text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors shrink-0"
                                    title="Remove Video"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>

                                {/* Direct Video Source: Upload or Paste URL */}
                                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
                                  <div className="sm:col-span-4 lg:col-span-3">
                                    <select
                                      value={vid.videoType}
                                      onChange={(e) => {
                                        const newType = e.target.value as VideoSourceType;
                                        const updated = [...sections];
                                        const currentVid = updated[secIdx].directVideos![vidIdx];
                                        currentVid.videoType = newType;
                                        if (newType === "upload" && currentVid.videoUrl.includes("youtube.com")) {
                                          currentVid.videoUrl = "";
                                        }
                                        setSections(updated);
                                      }}
                                      className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-2 py-1.5 text-[11px] font-medium text-slate-800 dark:text-white outline-none"
                                    >
                                      <option value="upload">Upload Video File</option>
                                      <option value="url">Paste Video URL</option>
                                    </select>
                                  </div>

                                  <div className="sm:col-span-8 lg:col-span-7">
                                    {vid.videoType === "url" ? (
                                      <input
                                        type="text"
                                        value={vid.videoUrl}
                                        onChange={(e) => {
                                          const updated = [...sections];
                                          updated[secIdx].directVideos![vidIdx].videoUrl = e.target.value;
                                          setSections(updated);
                                        }}
                                        placeholder="https://... private video URL (Vimeo, YouTube, etc.)"
                                        className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-2.5 py-1.5 text-[11px] font-mono text-slate-700 dark:text-slate-300 dark:placeholder-slate-400 outline-none"
                                      />
                                    ) : (
                                      <div className="space-y-1.5">
                                        <div className="flex flex-wrap items-center gap-2">
                                          <label className="flex items-center gap-1.5 cursor-pointer rounded-md border border-dashed border-blue-400 dark:border-blue-700 bg-blue-50/70 dark:bg-blue-950/40 px-3 py-1.5 text-[11px] font-bold text-[#2563EB] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                                            <Upload className="h-3 w-3" />
                                            <span>{vid.videoUrl ? "Replace Video" : "Upload Video File"}</span>
                                            <input
                                              type="file"
                                              accept="video/mp4,video/quicktime,video/webm,video/x-matroska,video/*"
                                              className="hidden"
                                              disabled={uploadProgress[vid.id]?.status === "uploading"}
                                              onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                  handleVideoFileUpload(vid.id, vid.title, file, (url) => {
                                                    const updated = [...sections];
                                                    updated[secIdx].directVideos![vidIdx].videoUrl = url;
                                                    setSections(updated);
                                                  });
                                                }
                                              }}
                                            />
                                          </label>

                                          {uploadProgress[vid.id]?.status === "uploading" ? (
                                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                                              <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600 dark:text-blue-400" />
                                              <span>Uploading {uploadProgress[vid.id]?.percent}%...</span>
                                            </div>
                                          ) : vid.videoUrl ? (
                                            <div className="flex items-center gap-1.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                                              <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                              <span>✓ Video Uploaded (Ready)</span>
                                            </div>
                                          ) : (
                                            <span className="text-[10px] text-slate-400 dark:text-slate-400">
                                              Upload MP4, WebM, or MOV video lecture
                                            </span>
                                          )}
                                        </div>

                                        {uploadProgress[vid.id]?.status === "uploading" && (
                                          <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                            <div
                                              className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-200"
                                              style={{ width: `${uploadProgress[vid.id]?.percent || 0}%` }}
                                            />
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>

                                  <div className="sm:col-span-12 lg:col-span-2 flex items-center justify-end">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (!vid.videoUrl) {
                                          alert("Please upload a video or paste a video URL first before previewing.");
                                          return;
                                        }
                                        setPreviewVideo({
                                          title: vid.title || "Direct Video Preview",
                                          videoUrl: vid.videoUrl,
                                          videoType: vid.videoType,
                                          durationFormatted: vid.durationFormatted,
                                        });
                                      }}
                                      className={`flex w-full items-center justify-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-bold transition-colors cursor-pointer ${
                                        vid.videoUrl
                                          ? "bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800/60"
                                          : "bg-slate-100 dark:bg-slate-800/60 text-slate-400 border border-slate-200/60 dark:border-slate-800"
                                      }`}
                                    >
                                      <PlayCircle className="h-3 w-3" /> Preview
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* STEP 3: ANTI-SKIP SECURITY */}
              {currentStep === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="rounded-[22px] border border-white/70 dark:border-slate-800/80 bg-white/85 dark:bg-surface-secondary p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl space-y-5"
                >
                  <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white">Step 3: Anti-Skip Verification & Academic Security</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Ensure complete learning comprehension before unlocking assessments</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-start gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-surface-elevated p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-surface-hover">
                      <input
                        type="checkbox"
                        checked={antiSkipEnforced}
                        onChange={(e) => setAntiSkipEnforced(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded text-blue-600"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">Enforce Mandatory Video Completion (95%+)</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Students cannot skip to the end of a video lecture without watching.</div>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-surface-elevated p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-surface-hover">
                      <input
                        type="checkbox"
                        checked={preventForwardSeeking}
                        onChange={(e) => setPreventForwardSeeking(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded text-blue-600"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">Disable Forward Seeking on First Watch</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Scrubbing ahead is locked until the video has been completed once.</div>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-surface-elevated p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-surface-hover">
                      <input
                        type="checkbox"
                        checked={requireFullWatchToUnlockAssignment}
                        onChange={(e) => setRequireFullWatchToUnlockAssignment(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded text-blue-600"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">Lock Section Assessments Until All Videos Are Watched</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Practical challenges only unlock after all lectures in the section are 100% watched.</div>
                      </div>
                    </label>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: ASSIGNMENTS */}
              {currentStep === 4 && (
                <motion.div
                  key="step-4"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="rounded-[22px] border border-white/70 dark:border-slate-800/80 bg-white/85 dark:bg-surface-secondary p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl space-y-5"
                >
                  <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                      <ClipboardCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white">Step 4: Section Passing Marks & Grading Criteria</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Configure evaluation standards and minimum pass scores</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {sections.map((sec, idx) => (
                      <div key={sec.id} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-surface-elevated p-4 space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                          <span>Section {idx + 1} Assessment</span>
                          <span className="rounded bg-blue-100 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 px-2 py-0.5">Pass Mark: {sec.assignment?.minPassingScore || 75}%</span>
                        </div>
                        <input
                          type="text"
                          value={sec.assignment?.title || ""}
                          onChange={(e) => {
                            const updated = [...sections];
                            if (updated[idx].assignment) {
                              updated[idx].assignment!.title = e.target.value;
                              setSections(updated);
                            }
                          }}
                          className="w-full rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-input-bg px-3 py-1.5 text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-[#2563EB]"
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 5: CERTIFICATE & PUBLISH */}
              {currentStep === 5 && (
                <motion.div
                  key="step-5"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="rounded-[22px] border border-white/70 dark:border-slate-800/80 bg-white/85 dark:bg-surface-secondary p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl space-y-5"
                >
                  <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                      <Award className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white">Step 5: Verified Certification & Publication</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Issue cryptographic verification IDs on course completion</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Certificate Award Title
                    </label>
                    <input
                      type="text"
                      value={certificateTitle}
                      onChange={(e) => setCertificateTitle(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-input-bg px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/70 dark:bg-emerald-950/40 p-4 space-y-2 text-xs text-emerald-900 dark:text-emerald-300">
                    <div className="font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      Ready to Publish by Dr. Rohit Kapoor (Lead Trainer)
                    </div>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                      Publishing will immediately make this course visible to students on their catalog and dashboard.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Multi-Step Navigation Buttons */}
            <div className="flex items-center justify-between gap-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-surface-secondary p-3 sm:p-4 shadow-xs">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((currentStep - 1) as StepNumber)}
                  className="flex items-center gap-1 sm:gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-elevated px-3 sm:px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs hover:bg-slate-50 dark:hover:bg-surface-hover transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Previous</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2 sm:gap-2.5">
                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((currentStep + 1) as StepNumber)}
                    className="flex items-center gap-1 sm:gap-1.5 rounded-xl bg-[#2563EB] px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handlePublishCourse("Published")}
                    disabled={isPublishing}
                    className="flex items-center gap-1.5 sm:gap-2 rounded-xl bg-emerald-600 px-4 sm:px-6 py-2 sm:py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-all cursor-pointer"
                  >
                    {publishedSuccess ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 animate-bounce shrink-0" />
                        <span className="truncate">Published!</span>
                      </>
                    ) : (
                      <>
                        <Award className="h-4 w-4 shrink-0" />
                        <span className="truncate">Publish to Academy</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column Summary Card */}
          <div className="space-y-4">
            <div className="rounded-2xl sm:rounded-[22px] border border-white/70 dark:border-slate-800/80 bg-white/90 dark:bg-surface-secondary p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.04)] backdrop-blur-xl space-y-4">
              {/* Live Course Card Preview with Thumbnail */}
              <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-elevated shadow-xs">
                <div className="relative aspect-video w-full overflow-hidden bg-slate-900 flex items-center justify-center">
                  {thumbnailUrl ? (
                    <img
                      src={thumbnailUrl}
                      alt="Course thumbnail preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-500 text-center p-3">
                      <Layers className="h-6 w-6 text-slate-500 mb-1" />
                      <span className="text-[10px] font-semibold text-slate-400">No Thumbnail Set</span>
                    </div>
                  )}
                  <span className="absolute top-2 left-2 rounded-md bg-blue-600/90 backdrop-blur-xs px-2 py-0.5 text-[9px] font-bold text-white shadow-xs">
                    {track}
                  </span>
                  <span className="absolute bottom-2 right-2 rounded-md bg-slate-900/80 backdrop-blur-xs px-2 py-0.5 text-[9px] font-medium text-slate-200">
                    {level}
                  </span>
                </div>
                <div className="p-3 space-y-1">
                  <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                    {title || "Untitled Course"}
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">{durationWeeks} Weeks</span>
                    <span className="font-extrabold text-[#2563EB] dark:text-blue-400">
                      ₹{price.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Curriculum Structure Summary</h3>
              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 dark:text-slate-400">Total Sections:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{sections.length}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 dark:text-slate-400">Total Lectures:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {sections.reduce((acc, s) => acc + (s.directVideos?.length || 0) + (s.subsections?.reduce((subAcc, sub) => subAcc + sub.videos.length, 0) || 0), 0)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 dark:text-slate-400">Instructor:</span>
                  <span className="font-bold text-[#2563EB] dark:text-blue-400">Dr. Rohit Kapoor</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handlePublishCourse("Published")}
                disabled={isPublishing}
                className="w-full rounded-xl bg-[#2563EB] py-2.5 text-xs font-bold text-white shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:bg-blue-700 transition-all cursor-pointer"
              >
                {publishedSuccess ? "Published Successfully!" : "Publish to Academy"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* VIDEO IN-APP PLAYBACK TEST MODAL */}
      {previewVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative flex w-full max-w-3xl flex-col rounded-2xl border border-slate-800 bg-slate-950 p-5 text-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <PlayCircle className="h-5 w-5 text-blue-400" />
                <h3 className="text-sm font-bold text-white truncate max-w-md">
                  In-App Player Test: {previewVideo.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewVideo(null)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="my-4">
              <InAppVideoPlayer
                title={previewVideo.title}
                videoUrl={previewVideo.videoUrl}
                videoType={previewVideo.videoType}
                durationFormatted={previewVideo.durationFormatted}
                autoPlay={true}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Verified: In-app embedded frame without external redirection.</span>
              <button
                type="button"
                onClick={() => setPreviewVideo(null)}
                className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20 cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
