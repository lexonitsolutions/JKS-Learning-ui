"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
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

export default function InstructorNewCoursePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<StepNumber>(1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  // Step 1: Basic Info State
  const [title, setTitle] = useState("Enterprise Spring Boot & Microservices Masterclass");
  const [slug, setSlug] = useState("spring-boot-microservices-masterclass");
  const [track, setTrack] = useState<Track>("Full Stack");
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
      router.push("/instructor/courses");
    }, 1200);
  };

  return (
    <>
      <DashboardTopbar
        title="Upload & Build Course"
        subtitle="Lecturer Studio: Configure curriculum, multi-tier video lectures, passing marks, and certifications."
        userInitials="RK"
      />

      <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8 lg:pt-4 max-w-7xl mx-auto w-full">
        {/* Header Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/instructor/courses"
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to My Courses
            </Link>
            <span className="text-xs text-slate-400 font-medium">/</span>
            <span className="text-xs font-semibold text-slate-900">Lecturer Course Builder</span>
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
                  <CheckCircle2 className="h-4 w-4 animate-bounce" /> Course Published!
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Publish to Academy
                </>
              )}
            </button>
          </div>
        </div>

        {/* STEP PROGRESS BAR */}
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

        {/* STEP WORKFLOW VIEWPORT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {/* STEP 1: BASICS */}
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
                      <p className="text-xs text-slate-500 font-medium">Primary details shown across catalog and syllabus</p>
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
                      placeholder="e.g. Enterprise Spring Boot & Microservices Masterclass"
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
                        Level
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
                        Tuition Fee (₹)
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
                      Course Summary & Learning Objectives
                    </label>
                    <textarea
                      rows={2}
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      placeholder="Comprehensive overview of modules taught..."
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-medium text-slate-800 outline-none focus:border-[#2563EB]"
                    />
                  </div>
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
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Step 2: Sections, Subsections & Video Lessons</h2>
                      <p className="text-xs text-slate-500 font-medium">
                        Upload or embed lectures for each modular section.
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

                  {sections.map((section, secIdx) => (
                    <div
                      key={section.id}
                      className="rounded-[22px] border border-slate-200 bg-white p-5 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.04)] space-y-5"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
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
                        {sections.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSection(section.id)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      {/* Direct Videos in Section */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                          <span className="flex items-center gap-1.5">
                            <Video className="h-4 w-4 text-[#2563EB]" /> Video Lessons ({section.directVideos?.length || 0})
                          </span>
                          <button
                            type="button"
                            onClick={() => addDirectVideo(secIdx)}
                            className="text-[#2563EB] hover:underline"
                          >
                            + Add Video
                          </button>
                        </div>

                        {section.directVideos?.map((vid, vidIdx) => (
                          <div
                            key={vid.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs"
                          >
                            <div className="flex items-center gap-2 flex-1">
                              <PlayCircle className="h-4 w-4 text-blue-600 shrink-0" />
                              <input
                                type="text"
                                value={vid.title}
                                onChange={(e) => {
                                  const updated = [...sections];
                                  updated[secIdx].directVideos![vidIdx].title = e.target.value;
                                  setSections(updated);
                                }}
                                className="flex-1 rounded border border-slate-200 bg-white px-2 py-1 font-medium text-slate-800"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={vid.videoUrl}
                                onChange={(e) => {
                                  const updated = [...sections];
                                  updated[secIdx].directVideos![vidIdx].videoUrl = e.target.value;
                                  setSections(updated);
                                }}
                                placeholder="Video URL"
                                className="w-48 rounded border border-slate-200 bg-white px-2 py-1 font-mono text-[11px] text-slate-600"
                              />
                            </div>
                          </div>
                        ))}
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
                  className="rounded-[22px] border border-white/70 bg-white/85 p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl space-y-5"
                >
                  <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                      <Lock className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">Step 3: Anti-Skip Verification & Academic Security</h2>
                      <p className="text-xs text-slate-500 font-medium">Ensure complete learning comprehension before unlocking assessments</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 cursor-pointer hover:bg-slate-50">
                      <input
                        type="checkbox"
                        checked={antiSkipEnforced}
                        onChange={(e) => setAntiSkipEnforced(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded text-blue-600"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">Enforce Mandatory Video Completion (95%+)</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">Students cannot skip to the end of a video lecture without watching.</div>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 cursor-pointer hover:bg-slate-50">
                      <input
                        type="checkbox"
                        checked={preventForwardSeeking}
                        onChange={(e) => setPreventForwardSeeking(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded text-blue-600"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">Disable Forward Seeking on First Watch</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">Scrubbing ahead is locked until the video has been completed once.</div>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 cursor-pointer hover:bg-slate-50">
                      <input
                        type="checkbox"
                        checked={requireFullWatchToUnlockAssignment}
                        onChange={(e) => setRequireFullWatchToUnlockAssignment(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded text-blue-600"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">Lock Section Assessments Until All Videos Are Watched</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">Practical challenges only unlock after all lectures in the section are 100% watched.</div>
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
                  className="rounded-[22px] border border-white/70 bg-white/85 p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl space-y-5"
                >
                  <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                      <ClipboardCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">Step 4: Section Passing Marks & Grading Criteria</h2>
                      <p className="text-xs text-slate-500 font-medium">Configure evaluation standards and minimum pass scores</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {sections.map((sec, idx) => (
                      <div key={sec.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                          <span>Section {idx + 1} Assessment</span>
                          <span className="rounded bg-blue-100 text-[#2563EB] px-2 py-0.5">Pass Mark: {sec.assignment?.minPassingScore || 75}%</span>
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
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-800"
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
                  className="rounded-[22px] border border-white/70 bg-white/85 p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl space-y-5"
                >
                  <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                      <Award className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">Step 5: Verified Certification & Publication</h2>
                      <p className="text-xs text-slate-500 font-medium">Issue cryptographic verification IDs on course completion</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Certificate Award Title
                    </label>
                    <input
                      type="text"
                      value={certificateTitle}
                      onChange={(e) => setCertificateTitle(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 space-y-2 text-xs text-emerald-900">
                    <div className="font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      Ready to Publish by Dr. Rohit Kapoor (Lead Trainer)
                    </div>
                    <p className="text-[11px] text-emerald-700">
                      Publishing will immediately make this course visible to students on their catalog and dashboard.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column Summary Card */}
          <div className="space-y-4">
            <div className="rounded-[22px] border border-white/70 bg-white/90 p-5 shadow-[0_8px_30px_rgb(20,50,100,0.04)] backdrop-blur-xl space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Curriculum Structure Summary</h3>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Total Sections:</span>
                  <span className="font-bold text-slate-800">{sections.length}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Total Lectures:</span>
                  <span className="font-bold text-slate-800">
                    {sections.reduce((acc, s) => acc + (s.directVideos?.length || 0) + (s.subsections?.reduce((subAcc, sub) => subAcc + sub.videos.length, 0) || 0), 0)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Instructor:</span>
                  <span className="font-bold text-[#2563EB]">Dr. Rohit Kapoor</span>
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
    </>
  );
}
