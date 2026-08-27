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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import {
  saveCourse,
  type FullCourse,
  type Section,
  type SubSection,
  type VideoItem,
  type VideoSourceType,
} from "@/lib/data/courses-store";
import type { Track } from "@/lib/data/courses";
import { InAppVideoPlayer } from "@/components/ui/in-app-video-player";

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
  const handlePublishCourse = (status: "Published" | "Draft" = "Published") => {
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

    saveCourse(newCourse);
    setPublishedSuccess(true);

    setTimeout(() => {
      setIsPublishing(false);
      router.push("/admin/courses");
    }, 1200);
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/courses"
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Courses
            </Link>
            <span className="text-xs text-slate-400 font-medium">/</span>
            <span className="text-xs font-semibold text-slate-900">Stage Workflow Course Builder</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => handlePublishCourse("Draft")}
              disabled={isPublishing}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
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
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 rounded-[20px] border border-white/80 bg-white/80 p-2 shadow-[0_8px_30px_rgb(20,50,100,0.04)] backdrop-blur-xl">
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
                    ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100/70"
                    : "text-slate-500 hover:bg-slate-100/70 hover:text-slate-800"
                }`}
              >
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[11px] ${
                    isActive
                      ? "bg-white/20 text-white"
                      : isDone
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 text-slate-600"
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
                  className="rounded-[22px] border border-white/70 bg-white/85 p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl space-y-5"
                >
                  <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#2563EB]">
                      <Layers className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">Step 1: Course Profile & Metadata</h2>
                      <p className="text-xs text-slate-500 font-medium">Primary details shown across catalog, payments, and certificates</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Course Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. Enterprise Distributed Systems & Cloud Architecture"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        URL Slug
                      </label>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-xs font-mono text-slate-800 outline-none focus:border-[#2563EB]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Academic Track
                      </label>
                      <select
                        value={track}
                        onChange={(e) => setTrack(e.target.value as Track)}
                        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#2563EB]"
                      >
                        <option value="Full Stack">Full Stack</option>
                        <option value="Frontend">Frontend</option>
                        <option value="SAP">SAP</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Experience Level
                      </label>
                      <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value as "Beginner" | "Intermediate" | "Advanced")}
                        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#2563EB]"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Duration (Weeks)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="52"
                        value={durationWeeks}
                        onChange={(e) => setDurationWeeks(Number(e.target.value))}
                        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#2563EB]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Course Fee (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="500"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#2563EB]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Course Summary & Objectives
                    </label>
                    <textarea
                      rows={2}
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      placeholder="Overview of the course..."
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-medium text-slate-800 outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  {/* Thumbnail / Media Upload Box */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Course Media Banner & Thumbnail
                    </label>
                    <div className="mt-1.5 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 p-6 text-center transition-colors hover:bg-slate-50">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EFF6FF] text-[#2563EB]">
                        <Upload className="h-5 w-5" />
                      </div>
                      <div className="mt-2 text-xs font-bold text-slate-800">
                        Upload 16:9 Thumbnail Image
                      </div>
                      <p className="mt-0.5 text-[11px] text-slate-400">
                        PNG, JPG, WebP up to 5MB
                      </p>
                    </div>
                  </div>
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
                      <h2 className="text-base font-bold text-slate-900">Step 2: Sections, Subsections & Video Lessons</h2>
                      <p className="text-xs text-slate-500 font-medium">
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
                      className="rounded-[22px] border border-slate-200 bg-white p-5 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.04)] space-y-5 transition-all hover:border-[#2563EB]/40"
                    >
                      {/* Section Top Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-3 flex-1">
                          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-xs font-bold text-white shrink-0">
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
                            className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-bold text-slate-900 outline-none focus:border-[#2563EB]"
                          />
                        </div>

                        <div className="flex items-center gap-1.5 self-end sm:self-auto">
                          <button
                            type="button"
                            onClick={() => moveSection(secIdx, "up")}
                            disabled={secIdx === 0}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                            title="Move Up"
                          >
                            <ChevronUp className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveSection(secIdx, "down")}
                            disabled={secIdx === sections.length - 1}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                            title="Move Down"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </button>
                          {sections.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSection(section.id)}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                              title="Delete Section"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Section Description */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
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
                          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-[#2563EB]"
                        />
                      </div>

                      {/* SUBSECTIONS AREA (OPTIONAL) */}
                      <div className="space-y-3 rounded-xl bg-slate-50/70 p-4 border border-slate-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                            <FolderTree className="h-4 w-4 text-[#2563EB]" />
                            <span>Subsections ({section.subsections?.length || 0})</span>
                            <span className="text-[11px] font-normal text-slate-400">Optional nested lesson groupings</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => addSubsectionToSection(secIdx)}
                            className="flex items-center gap-1 rounded-lg border border-blue-200 bg-white px-2.5 py-1 text-[11px] font-bold text-[#2563EB] shadow-xs hover:bg-blue-50 transition-colors cursor-pointer"
                          >
                            <Plus className="h-3 w-3" /> Add Subsection
                          </button>
                        </div>

                        {section.subsections && section.subsections.length > 0 ? (
                          <div className="space-y-3 pl-2 sm:pl-3 border-l-2 border-blue-200">
                            {section.subsections.map((sub, subIdx) => (
                              <div
                                key={sub.id}
                                className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs space-y-3"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2 flex-1">
                                    <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-[#2563EB]">
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
                                      className="flex-1 rounded-md border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-800 outline-none focus:border-[#2563EB]"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeSubsection(secIdx, sub.id)}
                                    className="text-slate-400 hover:text-rose-600 transition-colors"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>

                                {/* Subsection Videos */}
                                <div className="space-y-2.5 pl-2 sm:pl-3">
                                  {sub.videos.map((vid, vidIdx) => (
                                    <div
                                      key={vid.id}
                                      className="rounded-xl border border-slate-200/90 bg-slate-50/70 p-3 space-y-2.5 text-xs shadow-2xs"
                                    >
                                      <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                          <Video className="h-3.5 w-3.5 text-[#2563EB] shrink-0" />
                                          <input
                                            type="text"
                                            value={vid.title}
                                            onChange={(e) => {
                                              const updated = [...sections];
                                              updated[secIdx].subsections![subIdx].videos[vidIdx].title = e.target.value;
                                              setSections(updated);
                                            }}
                                            placeholder="Subsection Video Title"
                                            className="flex-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-900 outline-none focus:border-[#2563EB]"
                                          />
                                        </div>

                                        <button
                                          type="button"
                                          onClick={() => removeVideoFromSubsection(secIdx, subIdx, vid.id)}
                                          className="text-slate-400 hover:text-rose-500 transition-colors"
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
                                            className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-[11px] font-medium text-slate-800 outline-none"
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
                                              className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-mono text-slate-700 outline-none"
                                            />
                                          ) : (
                                            <div className="flex items-center gap-2">
                                              <label className="flex items-center gap-1.5 cursor-pointer rounded-md border border-dashed border-blue-300 bg-blue-50/50 px-3 py-1 text-[11px] font-bold text-[#2563EB] hover:bg-blue-100 transition-colors">
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
                                              <span className="truncate text-[10px] text-slate-500 max-w-[140px]">
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
                                            className="flex w-full items-center justify-center gap-1 rounded-md bg-blue-100/70 px-2 py-1.5 text-[11px] font-bold text-[#2563EB] hover:bg-blue-200 transition-colors cursor-pointer"
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
                                    className="flex items-center gap-1 text-[11px] font-bold text-[#2563EB] hover:text-blue-800 transition-colors cursor-pointer"
                                  >
                                    <Plus className="h-3 w-3" /> Add video to subsection
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[11px] text-slate-400 italic">No subsections added yet. You can add direct videos below.</p>
                        )}
                      </div>

                      {/* DIRECT SECTION VIDEOS */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                            <Video className="h-4 w-4 text-[#2563EB]" />
                            <span>Direct Section Videos ({section.directVideos?.length || 0})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => addDirectVideo(secIdx)}
                            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            <Plus className="h-3 w-3" /> Add Video
                          </button>
                        </div>

                        {section.directVideos?.map((vid, vidIdx) => (
                          <div
                            key={vid.id}
                            className="rounded-xl border border-slate-200/90 bg-slate-50/50 p-3.5 space-y-2.5"
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
                                  className="flex-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-900 outline-none focus:border-[#2563EB]"
                                />
                              </div>

                              <button
                                type="button"
                                onClick={() => removeDirectVideo(secIdx, vid.id)}
                                className="text-slate-400 hover:text-rose-600 transition-colors"
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
                                  className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-[11px] font-medium text-slate-800 outline-none"
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
                                    className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-mono text-slate-700 outline-none"
                                  />
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <label className="flex items-center gap-1.5 cursor-pointer rounded-md border border-dashed border-blue-300 bg-blue-50/50 px-3 py-1 text-[11px] font-bold text-[#2563EB] hover:bg-blue-100 transition-colors">
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
                                    <span className="truncate text-[10px] text-slate-500 max-w-[140px]">
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
                                  className="flex w-full items-center justify-center gap-1 rounded-md bg-blue-100/70 px-2 py-1.5 text-[11px] font-bold text-[#2563EB] hover:bg-blue-200 transition-colors cursor-pointer"
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
                  className="rounded-[22px] border border-white/70 bg-white/85 p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl space-y-6"
                >
                  <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#2563EB]">
                      <Lock className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">Step 3: Anti-Skip Options & Integrity Rules</h2>
                      <p className="text-xs text-slate-500 font-medium">
                        Prevent video scrubbing and enforce sequential milestones before unlocking assignments
                      </p>
                    </div>
                  </div>

                  {/* Banner Alert */}
                  <div className="rounded-2xl border border-blue-100 bg-[#EFF6FF]/70 p-4 text-xs text-slate-700">
                    <div className="flex items-center gap-2 font-bold text-[#2563EB]">
                      <Sparkles className="h-4 w-4" />
                      Anti-Skip Video Protection Enforcement
                    </div>
                    <p className="mt-1 leading-relaxed text-slate-600">
                      When enabled, students cannot skip or fast-forward unwatched video segments. They must complete 100% of the lecture to unlock the section assignment.
                    </p>
                  </div>

                  {/* Anti-Skip Toggles */}
                  <div className="space-y-3">
                    <label className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 cursor-pointer hover:border-blue-300 transition-colors">
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-slate-900">
                          Enforce 100% Video Watch (No Fast-Forwarding)
                        </div>
                        <div className="text-[11px] text-slate-500">
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

                    <label className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 cursor-pointer hover:border-blue-300 transition-colors">
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-slate-900">
                          Lock Section Assignment Until Video Is Finished
                        </div>
                        <div className="text-[11px] text-slate-500">
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

                    <label className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 cursor-pointer hover:border-blue-300 transition-colors">
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-slate-900">
                          Enforce Sequential Stage Progression
                        </div>
                        <div className="text-[11px] text-slate-500">
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
                  <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">Maximum Allowed Playback Speed</div>
                      <div className="text-[11px] text-slate-500">Limits acceleration to ensure material retention</div>
                    </div>
                    <select
                      value={playbackSpeedCap}
                      onChange={(e) => setPlaybackSpeedCap(e.target.value)}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-800 outline-none"
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
                  <div className="rounded-2xl border border-emerald-100 bg-[#ECFDF5]/70 p-4 text-xs text-slate-700">
                    <div className="flex items-center gap-2 font-bold text-emerald-700">
                      <ClipboardCheck className="h-4 w-4" />
                      Section Milestones & Minimum Passing Thresholds
                    </div>
                    <p className="mt-1 leading-relaxed text-slate-600">
                      Specify the evaluation criteria and pass out marks for each section. Students must achieve this score to unlock subsequent sections.
                    </p>
                  </div>

                  {sections.map((section, secIdx) => (
                    <div
                      key={section.id}
                      className="rounded-[22px] border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                            {secIdx + 1}
                          </span>
                          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                            Assignment for: {section.title}
                          </h3>
                        </div>
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                          Section {secIdx + 1} Requirement
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold text-slate-700 uppercase">
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
                            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-[#2563EB]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 uppercase">
                            Assessment Type
                          </label>
                          <select
                            value={section.assignment.type}
                            onChange={(e) => {
                              const updated = [...sections];
                              updated[secIdx].assignment.type = e.target.value as "MCQ" | "Coding Challenge" | "Project Submission" | "Architectural Design";
                              setSections(updated);
                            }}
                            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-[#2563EB]"
                          >
                            <option value="MCQ">MCQ Test</option>
                            <option value="Coding Challenge">Coding Challenge</option>
                            <option value="Project Submission">Project Submission</option>
                            <option value="Architectural Design">Architectural Review</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase">
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
                          className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-800 outline-none focus:border-[#2563EB]"
                        />
                      </div>

                      {/* PASSING OUT MARK THRESHOLD */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                        <div className="flex items-center gap-2">
                          <Sliders className="h-4 w-4 text-[#2563EB]" />
                          <div>
                            <div className="text-xs font-bold text-slate-900">
                              Minimum Passing Mark to Unlock Next Stage
                            </div>
                            <div className="text-[11px] text-slate-500">
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
                            className="w-18 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-center text-xs font-bold text-slate-900"
                          />
                          <span className="text-xs font-bold text-slate-500">%</span>
                        </div>
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
                  className="rounded-[22px] border border-white/70 bg-white/85 p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl space-y-6"
                >
                  <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#2563EB]">
                      <Award className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">Step 5: Accredited Certificate & Unlock Criteria</h2>
                      <p className="text-xs text-slate-500 font-medium">
                        Configure verified credential issued upon completing all course stages
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Accredited Certificate Title
                    </label>
                    <input
                      type="text"
                      value={certificateTitle}
                      onChange={(e) => setCertificateTitle(e.target.value)}
                      placeholder="e.g. Certified Enterprise Cloud Architect"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  {/* Certificate Unlock Rules */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Automated Certificate Unlock Rules
                    </h4>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={requireAllVideosComplete}
                        onChange={(e) => setRequireAllVideosComplete(e.target.checked)}
                        className="h-4 w-4 accent-[#2563EB]"
                      />
                      <span className="text-xs font-semibold text-slate-700">
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
                      <span className="text-xs font-semibold text-slate-700">
                        All section milestone assignments submitted and scored above passing threshold
                      </span>
                    </label>
                  </div>

                  {/* Certificate Live Preview */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
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
            <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((currentStep - 1) as StepNumber)}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
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
            <div className="sticky top-20 rounded-[22px] border border-white/70 bg-white/85 p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl space-y-5">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                Course Workflow Summary
              </h3>

              {/* Quick Stat Cards */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="rounded-xl bg-blue-50 p-3">
                  <div className="text-lg font-extrabold text-[#2563EB]">{sections.length}</div>
                  <div className="text-[11px] font-semibold text-slate-600">Sections</div>
                </div>
                <div className="rounded-xl bg-purple-50 p-3">
                  <div className="text-lg font-extrabold text-purple-700">{totalSubsections}</div>
                  <div className="text-[11px] font-semibold text-slate-600">Subsections</div>
                </div>
                <div className="rounded-xl bg-emerald-50 p-3">
                  <div className="text-lg font-extrabold text-emerald-700">{totalVideos}</div>
                  <div className="text-[11px] font-semibold text-slate-600">Total Videos</div>
                </div>
                <div className="rounded-xl bg-amber-50 p-3">
                  <div className="text-lg font-extrabold text-amber-700">{sections.length}</div>
                  <div className="text-[11px] font-semibold text-slate-600">Assignments</div>
                </div>
              </div>

              {/* Anti-Skip & Certification Meta */}
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Track:</span>
                  <span className="font-bold text-slate-900">{track}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Anti-Skip:</span>
                  <span className="font-bold text-emerald-700">100% Enforced</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Avg Pass Mark:</span>
                  <span className="font-bold text-slate-900">
                    {Math.round(
                      sections.reduce((acc, s) => acc + s.assignment.minPassingScore, 0) /
                        (sections.length || 1)
                    )}
                    %
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200/80 pt-2 text-sm font-extrabold">
                  <span className="text-slate-700">Course Price:</span>
                  <span className="text-[#2563EB]">₹{price.toLocaleString("en-IN")}</span>
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
