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
  ShieldCheck,
  ClipboardCheck,
  Sliders,
  Check,
  HelpCircle,
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

export default function AdminNewCoursePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<StepNumber>(1);

  // Scroll to top whenever step changes so user never encounters stuck scroll
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  // Step 1: Basic Info State
  const [title, setTitle] = useState("Enterprise Distributed Systems & Cloud Architecture");
  const [slug, setSlug] = useState("enterprise-distributed-systems");
  const [track, setTrack] = useState<Track>("Full Stack");
  const [level, setLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
  const [durationWeeks, setDurationWeeks] = useState(14);
  const [price, setPrice] = useState(26999);
  const [summary, setSummary] = useState(
    "Deep dive into cloud-native microservices, event-driven architectures with Kafka, Kubernetes orchestration, and resilient backend design."
  );
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  // Step 2 & Step 3 & Step 4: Sections Builder State
  const [sections, setSections] = useState<Section[]>([
    {
      id: "sec-1",
      title: "Section 1: Microservices Foundations & Event-Driven Patterns",
      order: 1,
      description: "Core principles of decoupled system design, event streaming, and domain-driven design.",
      subsections: [
        {
          id: "sub-1-1",
          title: "Subsection 1.1: Event Streaming & Apache Kafka Internals",
          order: 1,
          videos: [
            {
              id: "v-1",
              title: "01. Introduction to Event-Driven Topologies & Kafka Brokers",
              durationSeconds: 240,
              durationFormatted: "4:00",
              videoType: "url",
              videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
              order: 1,
              isFreeDemo: true,
            },
            {
              id: "v-2",
              title: "02. Partitioning, Consumer Groups & Offsets Management",
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
          title: "03. Idempotent Consumer & Transactional Outbox Pattern",
          durationSeconds: 280,
          durationFormatted: "4:40",
          videoType: "url",
          videoUrl: "https://www.youtube.com/watch?v=28aEWu_yV_c",
          order: 1,
        },
      ],
      assignment: {
        id: "asg-1",
        title: "Section 1 Practical Challenge: Resilient Outbox Architecture",
        description: "Implement a reliable outbox relay service that publishes domain events to Kafka with zero message loss.",
        type: "Coding Challenge",
        minPassingScore: 75,
        questions: [
          {
            prompt: "What is the primary benefit of the Transactional Outbox pattern?",
            choices: [
              "Guarantees database update and message publishing succeed atomically",
              "Increases Kafka broker throughput by bypassing TCP sockets",
              "Eliminates the need for consumer idempotency",
              "Compresses JSON payloads into Protocol Buffers automatically",
            ],
            correctIndex: 0,
          },
        ],
      },
    },
    {
      id: "sec-2",
      title: "Section 2: Kubernetes Orchestration & Production Resilience",
      order: 2,
      description: "Container deployment, Helm charts, ingress controllers, and auto-scaling policies.",
      directVideos: [
        {
          id: "v-4",
          title: "04. Multi-Cluster Kubernetes Deployment & Service Mesh",
          durationSeconds: 350,
          durationFormatted: "5:50",
          videoType: "url",
          videoUrl: "https://www.youtube.com/watch?v=9SGDpanrc8U",
          order: 1,
        },
      ],
      assignment: {
        id: "asg-2",
        title: "Section 2 Capstone: Kubernetes Production Deployment",
        description: "Deploy a multi-tier microservice workload with Horizontal Pod Autoscaling and TLS ingress.",
        type: "Project Submission",
        minPassingScore: 80,
        submissionCriteria: [
          "Deployable Helm chart with values.yaml",
          "HPA configuration based on CPU and custom metrics",
          "Ingress controller TLS configuration",
        ],
      },
    },
  ]);

  // Step 3: Anti-Skip Settings State
  const [antiSkipEnforced, setAntiSkipEnforced] = useState(true);
  const [requireFullWatchToUnlockAssignment, setRequireFullWatchToUnlockAssignment] = useState(true);
  const [preventForwardSeeking, setPreventForwardSeeking] = useState(true);
  const [playbackSpeedCap, setPlaybackSpeedCap] = useState("1.5x");

  // Step 5: Certificate Settings State
  const [certificateTitle, setCertificateTitle] = useState("Certified Distributed Cloud Architect");
  const [requireAllVideosComplete, setRequireAllVideosComplete] = useState(true);
  const [requireAllAssignmentsPassed, setRequireAllAssignmentsPassed] = useState(true);

  // Video In-App Preview modal
  const [previewVideo, setPreviewVideo] = useState<{
    title: string;
    videoUrl: string;
    videoType: VideoSourceType;
    durationFormatted: string;
  } | null>(null);

  // Success toast / redirect state
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  // Helper to generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
    );
  };

  // Section handlers
  const addSection = () => {
    const newOrder = sections.length + 1;
    const newSec: Section = {
      id: `sec-${Date.now()}`,
      title: `Section ${newOrder}: Advanced Module & Architecture`,
      order: newOrder,
      description: "Detailed curriculum objectives and implementation milestones.",
      directVideos: [
        {
          id: `v-${Date.now()}-1`,
          title: `0${newOrder}. Module Deep Dive & Implementation`,
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
        description: `Complete practical evaluation for Section ${newOrder}.`,
        type: "Coding Challenge",
        minPassingScore: 75,
        questions: [
          {
            prompt: "What is the primary architectural principle of this section?",
            choices: ["Loose coupling & High cohesion", "Shared database monolith", "Synchronous blocking RPC", "Manual deployments"],
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

  const moveSection = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === sections.length - 1) return;
    const updated = [...sections];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setSections(updated.map((s, idx) => ({ ...s, order: idx + 1 })));
  };

  // Subsection handlers
  const addSubsectionToSection = (sectionIndex: number) => {
    const updated = [...sections];
    const sec = updated[sectionIndex];
    const currentSubs = sec.subsections || [];
    const newSubOrder = currentSubs.length + 1;
    const newSub: SubSection = {
      id: `sub-${Date.now()}`,
      title: `Subsection ${sec.order}.${newSubOrder}: Specialized Sub-Topic`,
      order: newSubOrder,
      videos: [
        {
          id: `v-${Date.now()}`,
          title: `0${sec.order}.${newSubOrder}. Sub-Module Lecture`,
          durationSeconds: 180,
          durationFormatted: "3:00",
          videoType: "url",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          order: 1,
        },
      ],
    };
    sec.subsections = [...currentSubs, newSub];
    setSections(updated);
  };

  const removeSubsection = (sectionIndex: number, subsectionId: string) => {
    const updated = [...sections];
    const sec = updated[sectionIndex];
    if (sec.subsections) {
      sec.subsections = sec.subsections
        .filter((sub) => sub.id !== subsectionId)
        .map((sub, idx) => ({ ...sub, order: idx + 1 }));
    }
    setSections(updated);
  };

  // Video handlers
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

  // Assignment Question Handlers
  const addQuestionToAssignment = (sectionIndex: number) => {
    const updated = [...sections];
    const asg = updated[sectionIndex].assignment;
    const currentQuestions = asg.questions || [];
    asg.questions = [
      ...currentQuestions,
      {
        prompt: `Question ${currentQuestions.length + 1}: `,
        choices: [
          "Option A",
          "Option B",
          "Option C",
          "Option D",
        ],
        correctIndex: 0,
      },
    ];
    setSections(updated);
  };

  const removeQuestionFromAssignment = (sectionIndex: number, questionIndex: number) => {
    const updated = [...sections];
    const asg = updated[sectionIndex].assignment;
    if (asg.questions) {
      asg.questions = asg.questions.filter((_, idx) => idx !== questionIndex);
    }
    setSections(updated);
  };

  const updateQuestionPrompt = (sectionIndex: number, questionIndex: number, prompt: string) => {
    const updated = [...sections];
    const asg = updated[sectionIndex].assignment;
    if (asg.questions && asg.questions[questionIndex]) {
      asg.questions[questionIndex].prompt = prompt;
    }
    setSections(updated);
  };

  const updateQuestionChoice = (
    sectionIndex: number,
    questionIndex: number,
    choiceIndex: number,
    val: string
  ) => {
    const updated = [...sections];
    const asg = updated[sectionIndex].assignment;
    if (asg.questions && asg.questions[questionIndex]) {
      const choices = [...(asg.questions[questionIndex].choices || [])];
      choices[choiceIndex] = val;
      asg.questions[questionIndex].choices = choices;
    }
    setSections(updated);
  };

  const setQuestionCorrectIndex = (
    sectionIndex: number,
    questionIndex: number,
    correctIndex: number
  ) => {
    const updated = [...sections];
    const asg = updated[sectionIndex].assignment;
    if (asg.questions && asg.questions[questionIndex]) {
      asg.questions[questionIndex].correctIndex = correctIndex;
    }
    setSections(updated);
  };

  const addChoiceToQuestion = (sectionIndex: number, questionIndex: number) => {
    const updated = [...sections];
    const asg = updated[sectionIndex].assignment;
    if (asg.questions && asg.questions[questionIndex]) {
      const choices = [...(asg.questions[questionIndex].choices || [])];
      choices.push(`Option ${String.fromCharCode(65 + choices.length)}`);
      asg.questions[questionIndex].choices = choices;
    }
    setSections(updated);
  };

  const removeChoiceFromQuestion = (
    sectionIndex: number,
    questionIndex: number,
    choiceIndex: number
  ) => {
    const updated = [...sections];
    const asg = updated[sectionIndex].assignment;
    if (asg.questions && asg.questions[questionIndex]) {
      let choices = [...(asg.questions[questionIndex].choices || [])];
      if (choices.length <= 2) return;
      choices = choices.filter((_, idx) => idx !== choiceIndex);
      asg.questions[questionIndex].choices = choices;
      if ((asg.questions[questionIndex].correctIndex ?? 0) >= choices.length) {
        asg.questions[questionIndex].correctIndex = 0;
      }
    }
    setSections(updated);
  };

  // Video file upload handler
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onSetUrl: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      onSetUrl(objectUrl);
    }
  };

  // Save & Publish
  const handlePublishCourse = async (status: "Published" | "Draft" = "Published") => {
    setIsPublishing(true);

    const newCourse: FullCourse = {
      id: `crs-${Date.now()}`,
      slug: slug || `course-${Date.now()}`,
      title,
      track,
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
      router.push("/admin/courses");
    }, 1000);
  };

  // Total counts calculation
  const totalDirectVideos = sections.reduce((acc, s) => acc + (s.directVideos?.length || 0), 0);
  const totalSubVideos = sections.reduce(
    (acc, s) => acc + (s.subsections?.reduce((subAcc, sub) => subAcc + sub.videos.length, 0) || 0),
    0
  );
  const totalVideos = totalDirectVideos + totalSubVideos;
  const totalSubsections = sections.reduce((acc, s) => acc + (s.subsections?.length || 0), 0);

  return (
    <>
      <DashboardTopbar
        title="New Course"
        subtitle="Configure multi-section curriculum, anti-skip verification, passing marks, and certificates."
        userInitials="AD"
      />

      <div className="flex-1 space-y-6 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4 max-w-7xl mx-auto">
        {/* Top Header & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/courses"
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-elevated px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs hover:bg-slate-50 dark:hover:bg-surface-hover transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Courses
            </Link>
            <span className="text-xs text-slate-400 dark:text-slate-400 font-medium">/</span>
            <span className="text-xs font-semibold text-slate-900 dark:text-white">Stage Workflow Course Builder</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => handlePublishCourse("Draft")}
              disabled={isPublishing}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-elevated px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs hover:bg-slate-50 dark:hover:bg-surface-hover transition-colors cursor-pointer"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={() => handlePublishCourse("Published")}
              disabled={isPublishing}
              className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2 text-xs font-bold text-white shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:bg-blue-700 transition-all hover:scale-[1.02] cursor-pointer"
            >
              {publishedSuccess ? (
                <>
                  <CheckCircle2 className="h-4 w-4 animate-bounce" /> Published Successfully!
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Publish Course
                </>
              )}
            </button>
          </div>
        </div>

        {/* STEP PROGRESS BAR INDICATOR */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 rounded-[20px] border border-white/80 dark:border-slate-800/80 bg-white/80 dark:bg-surface-secondary p-2 shadow-[0_8px_30px_rgb(20,50,100,0.04)] backdrop-blur-xl">
          {STEPS.map((s) => {
            const isActive = currentStep === s.step;
            const isDone = currentStep > s.step;

            return (
              <button
                key={s.step}
                type="button"
                onClick={() => setCurrentStep(s.step)}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold transition-all text-left ${
                  isActive
                    ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                    : isDone
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/40"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-surface-hover hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[11px] ${
                    isActive
                      ? "bg-white/20 text-white"
                      : isDone
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {isDone ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : s.step}
                </div>
                <span className="truncate">{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* STEP CONTENT VIEWPORT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT 2 COLS: Active Step Content Form */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {/* STEP 1: COURSE BASICS & MEDIA */}
              {currentStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="rounded-[22px] border border-white/70 dark:border-slate-800/80 bg-white/85 dark:bg-surface-secondary p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl space-y-5"
                >
                  <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#2563EB] dark:text-blue-400">
                      <Layers className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white">Step 1: Course Profile & Metadata</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Primary details shown across catalog, payments, and certificates</p>
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
                      placeholder="e.g. Enterprise Distributed Systems & Cloud Architecture"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white dark:placeholder-slate-400 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40"
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
                        className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-surface-elevated px-3.5 py-2 text-xs font-mono text-slate-800 dark:text-slate-200 outline-none focus:border-[#2563EB]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Academic Track
                      </label>
                      <select
                        value={track}
                        onChange={(e) => setTrack(e.target.value as Track)}
                        className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:border-[#2563EB]"
                      >
                        <option value="Full Stack">Full Stack</option>
                        <option value="Frontend">Frontend</option>
                        <option value="SAP">SAP</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Experience Level
                      </label>
                      <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value as "Beginner" | "Intermediate" | "Advanced")}
                        className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:border-[#2563EB]"
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
                        className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:border-[#2563EB]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Course Fee (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="500"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:border-[#2563EB]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Course Summary & Objectives
                    </label>
                    <textarea
                      rows={2}
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      placeholder="Overview of the course..."
                      className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg p-3 text-xs font-medium text-slate-800 dark:text-slate-200 dark:placeholder-slate-400 outline-none focus:border-[#2563EB]"
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

              {/* STEP 2: CURRICULUM, SECTIONS, SUBSECTIONS & VIDEOS */}
              {currentStep === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white">Step 2: Sections, Subsections & Video Lessons</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Upload video files or paste private URLs for every section & subsection.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={addSection}
                      className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      <Plus className="h-4 w-4" /> Add Section
                    </button>
                  </div>

                  {/* SECTIONS LIST */}
                  {sections.map((section, secIdx) => (
                    <div
                      key={section.id}
                      className="rounded-[22px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary p-5 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.04)] space-y-5 transition-all hover:border-[#2563EB]/40 dark:hover:border-blue-500/40"
                    >
                      {/* Section Top Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="flex items-center gap-3 flex-1">
                          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 dark:bg-slate-800 text-xs font-bold text-white shrink-0">
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
                            className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3 py-1.5 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                          />
                        </div>

                        <div className="flex items-center gap-1.5 self-end sm:self-auto">
                          <button
                            type="button"
                            onClick={() => moveSection(secIdx, "up")}
                            disabled={secIdx === 0}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-surface-hover hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30"
                            title="Move Up"
                          >
                            <ChevronUp className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveSection(secIdx, "down")}
                            disabled={secIdx === sections.length - 1}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-surface-hover hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30"
                            title="Move Down"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </button>
                          {sections.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSection(section.id)}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                              title="Delete Section"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Section Description */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Section Description
                        </label>
                        <input
                          type="text"
                          value={section.description}
                          onChange={(e) => {
                            const updated = [...sections];
                            updated[secIdx].description = e.target.value;
                            setSections(updated);
                          }}
                          placeholder="Brief overview of concepts covered in this section..."
                          className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 dark:placeholder-slate-400 outline-none focus:border-[#2563EB]"
                        />
                      </div>

                      {/* SUBSECTIONS AREA (OPTIONAL) */}
                      <div className="space-y-3 rounded-xl bg-slate-50/70 dark:bg-surface-elevated p-4 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-white">
                            <FolderTree className="h-4 w-4 text-[#2563EB] dark:text-blue-400" />
                            <span>Subsections ({section.subsections?.length || 0})</span>
                            <span className="text-[11px] font-normal text-slate-400 dark:text-slate-400">Optional nested lesson groupings</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => addSubsectionToSection(secIdx)}
                            className="flex items-center gap-1 rounded-lg border border-blue-200 dark:border-blue-800/80 bg-white dark:bg-input-bg px-2.5 py-1 text-[11px] font-bold text-[#2563EB] dark:text-blue-400 shadow-xs hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
                          >
                            <Plus className="h-3 w-3" /> Add Subsection
                          </button>
                        </div>

                        {section.subsections && section.subsections.length > 0 ? (
                          <div className="space-y-3 pl-2 sm:pl-3 border-l-2 border-blue-200 dark:border-blue-900/60">
                            {section.subsections.map((sub, subIdx) => (
                              <div
                                key={sub.id}
                                className="rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-surface-secondary p-3.5 shadow-xs space-y-3"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2 flex-1">
                                    <span className="rounded bg-blue-100 dark:bg-blue-950/50 px-1.5 py-0.5 text-[10px] font-bold text-[#2563EB] dark:text-blue-400">
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
                                      className="flex-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-2.5 py-1 text-xs font-semibold text-slate-800 dark:text-white outline-none focus:border-[#2563EB]"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeSubsection(secIdx, sub.id)}
                                    className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>

                                {/* Subsection Videos */}
                                <div className="space-y-2.5 pl-2 sm:pl-3">
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
                                            className="flex-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-2.5 py-1 text-xs font-semibold text-slate-900 dark:text-white dark:placeholder-slate-400 outline-none focus:border-[#2563EB]"
                                          />
                                        </div>

                                        <button
                                          type="button"
                                          onClick={() => removeVideoFromSubsection(secIdx, subIdx, vid.id)}
                                          className="text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                                          title="Remove Video"
                                        >
                                          <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                      </div>

                                      {/* Subsection Video Source: Upload or Paste URL */}
                                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
                                        <div className="sm:col-span-3">
                                          <select
                                            value={vid.videoType}
                                            onChange={(e) => {
                                              const updated = [...sections];
                                              updated[secIdx].subsections![subIdx].videos[vidIdx].videoType = e.target.value as VideoSourceType;
                                              setSections(updated);
                                            }}
                                            className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-2 py-1.5 text-[11px] font-medium text-slate-800 dark:text-white outline-none"
                                          >
                                            <option value="url">Paste Private URL</option>
                                            <option value="upload">Upload Video File</option>
                                          </select>
                                        </div>

                                        <div className="sm:col-span-7">
                                          {vid.videoType === "url" ? (
                                            <input
                                              type="text"
                                              value={vid.videoUrl}
                                              onChange={(e) => {
                                                const updated = [...sections];
                                                updated[secIdx].subsections![subIdx].videos[vidIdx].videoUrl = e.target.value;
                                                setSections(updated);
                                              }}
                                              placeholder="https://www.youtube.com/watch?v=... or Vimeo / MP4 link"
                                              className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-2.5 py-1.5 text-[11px] font-mono text-slate-700 dark:text-slate-300 dark:placeholder-slate-400 outline-none"
                                            />
                                          ) : (
                                            <div className="flex items-center gap-2">
                                              <label className="flex items-center gap-1.5 cursor-pointer rounded-md border border-dashed border-blue-300 dark:border-blue-700/60 bg-blue-50/50 dark:bg-blue-950/40 px-3 py-1 text-[11px] font-bold text-[#2563EB] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                                                <Upload className="h-3 w-3" /> Select Local MP4
                                                <input
                                                  type="file"
                                                  accept="video/*"
                                                  className="hidden"
                                                  onChange={(e) =>
                                                    handleFileUpload(e, (url) => {
                                                      const updated = [...sections];
                                                      updated[secIdx].subsections![subIdx].videos[vidIdx].videoUrl = url;
                                                      setSections(updated);
                                                    })
                                                  }
                                                />
                                              </label>
                                              <span className="truncate text-[10px] text-slate-500 dark:text-slate-400 max-w-[140px]">
                                                {vid.videoUrl ? "File loaded" : "No file chosen"}
                                              </span>
                                            </div>
                                          )}
                                        </div>

                                        <div className="sm:col-span-2 flex items-center justify-end">
                                          <button
                                            type="button"
                                            onClick={() =>
                                              setPreviewVideo({
                                                title: vid.title,
                                                videoUrl: vid.videoUrl,
                                                videoType: vid.videoType,
                                                durationFormatted: vid.durationFormatted,
                                              })
                                            }
                                            className="flex w-full items-center justify-center gap-1 rounded-md bg-blue-100/70 dark:bg-blue-950/60 px-2 py-1.5 text-[11px] font-bold text-[#2563EB] dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors cursor-pointer"
                                            title="Test In-App Player"
                                          >
                                            <PlayCircle className="h-3.5 w-3.5" /> Preview
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}

                                  <button
                                    type="button"
                                    onClick={() => addVideoToSubsection(secIdx, subIdx)}
                                    className="flex items-center gap-1 text-[11px] font-bold text-[#2563EB] dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors cursor-pointer"
                                  >
                                    <Plus className="h-3 w-3" /> Add video to subsection
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[11px] text-slate-400 dark:text-slate-400 italic">No subsections added yet. You can add direct videos below.</p>
                        )}
                      </div>

                      {/* DIRECT SECTION VIDEOS */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-white">
                            <Video className="h-4 w-4 text-[#2563EB] dark:text-blue-400" />
                            <span>Direct Section Videos ({section.directVideos?.length || 0})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => addDirectVideo(secIdx)}
                            className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 shadow-xs hover:bg-slate-50 dark:hover:bg-surface-hover transition-colors cursor-pointer"
                          >
                            <Plus className="h-3 w-3" /> Add Video
                          </button>
                        </div>

                        {section.directVideos?.map((vid, vidIdx) => (
                          <div
                            key={vid.id}
                            className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-surface-elevated p-3.5 space-y-2.5"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2 flex-1">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                                  {vidIdx + 1}
                                </span>
                                <input
                                  type="text"
                                  value={vid.title}
                                  onChange={(e) => {
                                    const updated = [...sections];
                                    updated[secIdx].directVideos![vidIdx].title = e.target.value;
                                    setSections(updated);
                                  }}
                                  placeholder="Video Lecture Title"
                                  className="flex-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-2.5 py-1 text-xs font-semibold text-slate-900 dark:text-white dark:placeholder-slate-400 outline-none focus:border-[#2563EB]"
                                />
                              </div>

                              <button
                                type="button"
                                onClick={() => removeDirectVideo(secIdx, vid.id)}
                                className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            {/* Video Source Selector: Upload or Paste URL */}
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
                              <div className="sm:col-span-3">
                                <select
                                  value={vid.videoType}
                                  onChange={(e) => {
                                    const updated = [...sections];
                                    updated[secIdx].directVideos![vidIdx].videoType = e.target.value as VideoSourceType;
                                    setSections(updated);
                                  }}
                                  className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-2 py-1.5 text-[11px] font-medium text-slate-800 dark:text-white outline-none"
                                >
                                  <option value="url">Paste Private URL</option>
                                  <option value="upload">Upload Video File</option>
                                </select>
                              </div>

                              <div className="sm:col-span-7">
                                {vid.videoType === "url" ? (
                                  <input
                                    type="text"
                                    value={vid.videoUrl}
                                    onChange={(e) => {
                                      const updated = [...sections];
                                      updated[secIdx].directVideos![vidIdx].videoUrl = e.target.value;
                                      setSections(updated);
                                    }}
                                    placeholder="https://www.youtube.com/watch?v=... or Vimeo / MP4 link"
                                    className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-2.5 py-1.5 text-[11px] font-mono text-slate-700 dark:text-slate-300 dark:placeholder-slate-400 outline-none"
                                  />
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <label className="flex items-center gap-1.5 cursor-pointer rounded-md border border-dashed border-blue-300 dark:border-blue-700/60 bg-blue-50/50 dark:bg-blue-950/40 px-3 py-1 text-[11px] font-bold text-[#2563EB] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                                      <Upload className="h-3 w-3" /> Select Local MP4
                                      <input
                                        type="file"
                                        accept="video/*"
                                        className="hidden"
                                        onChange={(e) =>
                                          handleFileUpload(e, (url) => {
                                            const updated = [...sections];
                                            updated[secIdx].directVideos![vidIdx].videoUrl = url;
                                            setSections(updated);
                                          })
                                        }
                                      />
                                    </label>
                                    <span className="truncate text-[10px] text-slate-500 dark:text-slate-400 max-w-[140px]">
                                      {vid.videoUrl ? "File loaded" : "No file chosen"}
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="sm:col-span-2 flex items-center justify-end">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setPreviewVideo({
                                      title: vid.title,
                                      videoUrl: vid.videoUrl,
                                      videoType: vid.videoType,
                                      durationFormatted: vid.durationFormatted,
                                    })
                                  }
                                  className="flex w-full items-center justify-center gap-1 rounded-md bg-blue-100/70 dark:bg-blue-950/60 px-2 py-1.5 text-[11px] font-bold text-[#2563EB] dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors cursor-pointer"
                                  title="Test In-App Player"
                                >
                                  <PlayCircle className="h-3.5 w-3.5" /> Preview
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* STEP 3: ANTI-SKIP OPTIONS & STAGE PROTECTION POLICY */}
              {currentStep === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="rounded-[22px] border border-white/70 dark:border-slate-800/80 bg-white/85 dark:bg-surface-secondary p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl space-y-6"
                >
                  <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#2563EB] dark:text-blue-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white">Step 3: Anti-Skip Options & Integrity Rules</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Prevent video scrubbing and enforce sequential milestones before unlocking assignments
                      </p>
                    </div>
                  </div>

                  {/* Banner Alert */}
                  <div className="rounded-2xl border border-blue-100 dark:border-blue-900/50 bg-[#EFF6FF]/70 dark:bg-blue-950/30 p-4 text-xs text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-2 font-bold text-[#2563EB] dark:text-blue-400">
                      <Sparkles className="h-4 w-4" />
                      Anti-Skip Video Protection Enforcement
                    </div>
                    <p className="mt-1 leading-relaxed text-slate-600 dark:text-slate-400">
                      When enabled, students cannot skip or fast-forward unwatched video segments. They must complete 100% of the lecture to unlock the section assignment.
                    </p>
                  </div>

                  {/* Anti-Skip Toggles */}
                  <div className="space-y-3">
                    <label className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-surface-elevated p-4 cursor-pointer hover:border-blue-300 dark:hover:border-blue-600/50 transition-colors">
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          Enforce 100% Video Watch (No Fast-Forwarding)
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Disables seek forward bar for unwatched portions of the video.
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={antiSkipEnforced}
                        onChange={(e) => setAntiSkipEnforced(e.target.checked)}
                        className="h-4 w-4 accent-[#2563EB] cursor-pointer mt-0.5"
                      />
                    </label>

                    <label className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-surface-elevated p-4 cursor-pointer hover:border-blue-300 dark:hover:border-blue-600/50 transition-colors">
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          Lock Section Assignment Until Video Is Finished
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Students cannot submit or take the assignment without watching all section videos.
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={requireFullWatchToUnlockAssignment}
                        onChange={(e) => setRequireFullWatchToUnlockAssignment(e.target.checked)}
                        className="h-4 w-4 accent-[#2563EB] cursor-pointer mt-0.5"
                      />
                    </label>

                    <label className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-surface-elevated p-4 cursor-pointer hover:border-blue-300 dark:hover:border-blue-600/50 transition-colors">
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          Enforce Sequential Stage Progression
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Section N+1 remains locked until Section N video and assignment are both completed.
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={preventForwardSeeking}
                        onChange={(e) => setPreventForwardSeeking(e.target.checked)}
                        className="h-4 w-4 accent-[#2563EB] cursor-pointer mt-0.5"
                      />
                    </label>
                  </div>

                  {/* Playback Speed Cap */}
                  <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-surface-elevated p-4 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">Maximum Allowed Playback Speed</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Limits acceleration to ensure material retention</div>
                    </div>
                    <select
                      value={playbackSpeedCap}
                      onChange={(e) => setPlaybackSpeedCap(e.target.value)}
                      className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3 py-1 text-xs font-bold text-slate-800 dark:text-white outline-none"
                    >
                      <option value="1.0x">1.0x (Normal speed only)</option>
                      <option value="1.25x">1.25x</option>
                      <option value="1.5x">1.5x (Recommended)</option>
                      <option value="2.0x">2.0x</option>
                    </select>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: ASSIGNMENTS & PASSING MARKS */}
              {currentStep === 4 && (
                <motion.div
                  key="step-4"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-5"
                >
                  <div className="rounded-2xl border border-emerald-100 dark:border-emerald-900/50 bg-[#ECFDF5]/70 dark:bg-emerald-950/30 p-4 text-xs text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-400">
                      <ClipboardCheck className="h-4 w-4" />
                      Section Milestones & Minimum Passing Thresholds
                    </div>
                    <p className="mt-1 leading-relaxed text-slate-600 dark:text-slate-400">
                      Specify the evaluation criteria and pass out marks for each section. Students must achieve this score to unlock subsequent sections.
                    </p>
                  </div>

                  {sections.map((section, secIdx) => (
                    <div
                      key={section.id}
                      className="rounded-[22px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary p-5 sm:p-6 shadow-xs space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 dark:bg-slate-800 text-xs font-bold text-white">
                            {secIdx + 1}
                          </span>
                          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                            Assignment for: {section.title}
                          </h3>
                        </div>
                        <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                          Section {secIdx + 1} Requirement
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                            Assignment Title
                          </label>
                          <input
                            type="text"
                            value={section.assignment.title}
                            onChange={(e) => {
                              const updated = [...sections];
                              updated[secIdx].assignment.title = e.target.value;
                              setSections(updated);
                            }}
                            placeholder="e.g. Stage 1 MCQ Assessment or Coding Test"
                            className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3 py-2 text-xs font-medium text-slate-900 dark:text-white dark:placeholder-slate-400 outline-none focus:border-[#2563EB]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                            Assessment Type
                          </label>
                          <select
                            value={section.assignment.type}
                            onChange={(e) => {
                              const updated = [...sections];
                              updated[secIdx].assignment.type = e.target.value as "MCQ" | "Coding Challenge" | "Project Submission" | "Architectural Design";
                              setSections(updated);
                            }}
                            className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3 py-2 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                          >
                            <option value="MCQ">MCQ Test</option>
                            <option value="Coding Challenge">Coding Challenge</option>
                            <option value="Project Submission">Project Submission</option>
                            <option value="Architectural Design">Architectural Review</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                          Instructions & Problem Statement
                        </label>
                        <textarea
                          rows={2}
                          value={section.assignment.description}
                          onChange={(e) => {
                            const updated = [...sections];
                            updated[secIdx].assignment.description = e.target.value;
                            setSections(updated);
                          }}
                          className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg p-2.5 text-xs text-slate-800 dark:text-slate-200 dark:placeholder-slate-400 outline-none focus:border-[#2563EB]"
                        />
                      </div>

                      {/* PASSING OUT MARK THRESHOLD */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-slate-50 dark:bg-surface-elevated p-3.5 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <Sliders className="h-4 w-4 text-[#2563EB] dark:text-blue-400" />
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                              Minimum Passing Mark to Unlock Next Stage
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              Score required for the student to pass this milestone
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <input
                            type="number"
                            min="50"
                            max="100"
                            value={section.assignment.minPassingScore}
                            onChange={(e) => {
                              const updated = [...sections];
                              updated[secIdx].assignment.minPassingScore = Number(e.target.value);
                              setSections(updated);
                            }}
                            className="w-18 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-2.5 py-1 text-center text-xs font-bold text-slate-900 dark:text-white"
                          />
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">%</span>
                        </div>
                      </div>

                      {/* ASSIGNMENT QUESTIONS BUILDER */}
                      <div className="space-y-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-surface-elevated/70 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <HelpCircle className="h-4 w-4 text-[#2563EB] dark:text-blue-400" />
                            <div>
                              <div className="text-xs font-bold text-slate-900 dark:text-white">
                                Questions & Rubric Items ({section.assignment.questions?.length || 0})
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                Configure quiz questions or challenge prompts for this section milestone
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => addQuestionToAssignment(secIdx)}
                            className="flex items-center gap-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 px-2.5 py-1 text-xs font-bold text-[#2563EB] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors cursor-pointer"
                          >
                            <Plus className="h-3.5 w-3.5" /> Add Question
                          </button>
                        </div>

                        {(!section.assignment.questions || section.assignment.questions.length === 0) ? (
                          <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-4 text-center">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              No questions configured for this section milestone yet.
                            </p>
                            <button
                              type="button"
                              onClick={() => addQuestionToAssignment(secIdx)}
                              className="mt-2 text-xs font-bold text-[#2563EB] dark:text-blue-400 hover:underline cursor-pointer"
                            >
                              + Click here to add your first question
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {section.assignment.questions.map((q, qIdx) => (
                              <div
                                key={qIdx}
                                className="rounded-xl border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-surface-secondary p-3.5 space-y-3 shadow-2xs"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex items-start gap-2 flex-1">
                                    <span className="shrink-0 rounded bg-blue-100 dark:bg-blue-950/60 px-2 py-0.5 text-[10px] font-black text-[#2563EB] dark:text-blue-400 mt-1">
                                      Q{qIdx + 1}
                                    </span>
                                    <div className="flex-1">
                                      <input
                                        type="text"
                                        value={q.prompt}
                                        onChange={(e) => updateQuestionPrompt(secIdx, qIdx, e.target.value)}
                                        placeholder={`Question ${qIdx + 1} prompt or scenario...`}
                                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-input-bg px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                                      />
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeQuestionFromAssignment(secIdx, qIdx)}
                                    className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                                    title="Delete Question"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>

                                {/* CHOICES / OPTIONS LIST */}
                                <div className="space-y-2 pl-2 sm:pl-3 border-l-2 border-blue-100 dark:border-blue-900/40">
                                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                    <span>Answer Choices (Select radio button for the correct answer):</span>
                                    <button
                                      type="button"
                                      onClick={() => addChoiceToQuestion(secIdx, qIdx)}
                                      className="text-[10px] font-bold text-[#2563EB] dark:text-blue-400 hover:underline cursor-pointer"
                                    >
                                      + Add Choice
                                    </button>
                                  </div>

                                  <div className="space-y-1.5">
                                    {(q.choices || []).map((choice, cIdx) => {
                                      const isCorrect = (q.correctIndex ?? 0) === cIdx;
                                      const letter = String.fromCharCode(65 + cIdx);

                                      return (
                                        <div
                                          key={cIdx}
                                          className={`flex items-center gap-2 rounded-lg border p-1.5 transition-colors ${
                                            isCorrect
                                              ? "border-emerald-300 dark:border-emerald-700/80 bg-emerald-50/50 dark:bg-emerald-950/20"
                                              : "border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg"
                                          }`}
                                        >
                                          <input
                                            type="radio"
                                            name={`q-correct-${secIdx}-${qIdx}`}
                                            checked={isCorrect}
                                            onChange={() => setQuestionCorrectIndex(secIdx, qIdx, cIdx)}
                                            className="h-3.5 w-3.5 accent-emerald-600 cursor-pointer ml-1"
                                            title="Mark as correct answer"
                                          />
                                          <span
                                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold ${
                                              isCorrect
                                                ? "bg-emerald-600 text-white"
                                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                                            }`}
                                          >
                                            {letter}
                                          </span>
                                          <input
                                            type="text"
                                            value={choice}
                                            onChange={(e) =>
                                              updateQuestionChoice(secIdx, qIdx, cIdx, e.target.value)
                                            }
                                            placeholder={`Option ${letter}`}
                                            className="flex-1 bg-transparent px-1 py-0.5 text-xs text-slate-800 dark:text-slate-200 outline-none"
                                          />
                                          {isCorrect && (
                                            <span className="rounded bg-emerald-100 dark:bg-emerald-950/70 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 dark:text-emerald-300 mr-1">
                                              Correct
                                            </span>
                                          )}
                                          {(q.choices?.length || 0) > 2 && (
                                            <button
                                              type="button"
                                              onClick={() => removeChoiceFromQuestion(secIdx, qIdx, cIdx)}
                                              className="p-1 text-slate-400 hover:text-rose-500"
                                              title="Remove choice"
                                            >
                                              <X className="h-3 w-3" />
                                            </button>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* STEP 5: ACCREDITED CERTIFICATE & FINAL PUBLISHING */}
              {currentStep === 5 && (
                <motion.div
                  key="step-5"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="rounded-[22px] border border-white/70 dark:border-slate-800/80 bg-white/85 dark:bg-surface-secondary p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl space-y-6"
                >
                  <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#2563EB] dark:text-blue-400">
                      <Award className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white">Step 5: Accredited Certificate & Unlock Criteria</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Configure verified credential issued upon completing all course stages
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Accredited Certificate Title
                    </label>
                    <input
                      type="text"
                      value={certificateTitle}
                      onChange={(e) => setCertificateTitle(e.target.value)}
                      placeholder="e.g. Certified Enterprise Cloud Architect"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white dark:placeholder-slate-400 outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  {/* Certificate Unlock Rules */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-surface-elevated p-5 space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Automated Certificate Unlock Rules
                    </h4>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={requireAllVideosComplete}
                        onChange={(e) => setRequireAllVideosComplete(e.target.checked)}
                        className="h-4 w-4 accent-[#2563EB]"
                      />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        100% of all section video lectures completed with Anti-Skip verification
                      </span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={requireAllAssignmentsPassed}
                        onChange={(e) => setRequireAllAssignmentsPassed(e.target.checked)}
                        className="h-4 w-4 accent-[#2563EB]"
                      />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        All section milestone assignments submitted and scored above passing threshold
                      </span>
                    </label>
                  </div>

                  {/* Certificate Live Preview */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Live Certificate Preview
                    </label>
                    <div className="rounded-2xl border-4 border-double border-amber-300/80 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 text-white shadow-xl space-y-4">
                      <div className="flex items-start justify-between border-b border-white/10 pb-4">
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                            JKS Learning Institute of Technology
                          </div>
                          <div className="mt-1 text-base font-extrabold text-white">
                            {certificateTitle || title}
                          </div>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/20 text-amber-300">
                          <Award className="h-6 w-6" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-300">
                        <div>
                          <span className="text-slate-400">Recipient:</span>{" "}
                          <span className="font-bold text-white">[Student Full Name]</span>
                        </div>
                        <div className="flex items-center gap-1 font-mono text-[11px] text-emerald-400">
                          <ShieldCheck className="h-4 w-4" /> VERIFIED-ID: JKS-2026-XXXX
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Multi-Step Navigation Buttons */}
            <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-surface-secondary p-4 shadow-xs">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((currentStep - 1) as StepNumber)}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-elevated px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs hover:bg-slate-50 dark:hover:bg-surface-hover transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Previous Step
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2.5">
                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((currentStep + 1) as StepNumber)}
                    className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    Next Step <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handlePublishCourse("Published")}
                    disabled={isPublishing}
                    className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-all cursor-pointer"
                  >
                    {publishedSuccess ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 animate-bounce" /> Published Successfully!
                      </>
                    ) : (
                      <>
                        <Award className="h-4 w-4" /> Publish & Activate Course
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT 1 COL: Live Course Publishing Summary Sidebar */}
          <div className="space-y-6">
            <div className="sticky top-20 rounded-[22px] border border-white/70 dark:border-slate-800/80 bg-white/85 dark:bg-surface-secondary p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl space-y-5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Course Workflow Summary
              </h3>

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

              {/* Quick Stat Cards */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="rounded-xl bg-blue-50 dark:bg-blue-950/40 p-3">
                  <div className="text-lg font-extrabold text-[#2563EB] dark:text-blue-400">{sections.length}</div>
                  <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Sections</div>
                </div>
                <div className="rounded-xl bg-purple-50 dark:bg-purple-950/40 p-3">
                  <div className="text-lg font-extrabold text-purple-700 dark:text-purple-300">{totalSubsections}</div>
                  <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Subsections</div>
                </div>
                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 p-3">
                  <div className="text-lg font-extrabold text-emerald-700 dark:text-emerald-400">{totalVideos}</div>
                  <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Total Videos</div>
                </div>
                <div className="rounded-xl bg-amber-50 dark:bg-amber-950/40 p-3">
                  <div className="text-lg font-extrabold text-amber-700 dark:text-amber-400">{sections.length}</div>
                  <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Assignments</div>
                </div>
              </div>

              {/* Anti-Skip & Certification Meta */}
              <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-surface-elevated p-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Track:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{track}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Anti-Skip:</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">100% Enforced</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Avg Pass Mark:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {Math.round(
                      sections.reduce((acc, s) => acc + s.assignment.minPassingScore, 0) /
                        (sections.length || 1)
                    )}
                    %
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200/80 dark:border-slate-800 pt-2 text-sm font-extrabold">
                  <span className="text-slate-700 dark:text-slate-300">Course Price:</span>
                  <span className="text-[#2563EB] dark:text-blue-400">₹{price.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Primary Action Button */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => handlePublishCourse("Published")}
                  disabled={isPublishing}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] py-3 text-xs font-bold text-white shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:bg-blue-700 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  {publishedSuccess ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 animate-bounce" /> Published Successfully!
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" /> Publish & Activate Course
                    </>
                  )}
                </button>
              </div>
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
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white"
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
                className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20"
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
