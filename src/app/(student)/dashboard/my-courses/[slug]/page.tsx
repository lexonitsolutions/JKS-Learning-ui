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

// Udemy Bottom Tabs
type TabType = "overview" | "curriculum" | "qa" | "notes" | "announcements" | "reviews" | "tools";

export default function CourseLearningHubPage({

  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [course, setCourse] = useState<FullCourse | null>(null);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string>("");
  const [completedVideoIds, setCompletedVideoIds] = useState<string[]>([]);
  const [completedAssignmentIds, setCompletedAssignmentIds] = useState<string[]>([]);
  const [assignmentScores, setAssignmentScores] = useState<Record<string, number>>({});

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

  // Active assignment modal & cert modal
  const [activeAssignmentSection, setActiveAssignmentSection] = useState<Section | null>(null);
  const [showCertModal, setShowCertModal] = useState(false);

  // Load course on mount or slug change
  useEffect(() => {
    const loadedCourse = getFullCourseBySlug(slug) || getStoredCourses()[0];
    if (loadedCourse) {
      setCourse(loadedCourse);

      // Find first video
      let firstVid: VideoItem | null = null;
      let firstSecId = "";
      for (const sec of loadedCourse.sections || []) {
        if (sec.subsections && sec.subsections.length > 0 && sec.subsections[0].videos.length > 0) {
          firstVid = sec.subsections[0].videos[0];
          firstSecId = sec.id;
          break;
        } else if (sec.directVideos && sec.directVideos.length > 0) {
          firstVid = sec.directVideos[0];
          firstSecId = sec.id;
          break;
        }
      }

      if (firstVid) {
        setActiveVideo(firstVid);
        setActiveSectionId(firstSecId);
        if (firstVid.completed || firstVid.isFreeDemo) {
          setCompletedVideoIds([firstVid.id]);
        }
      }
    }
  }, [slug]);

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="text-sm font-semibold text-slate-600">Loading course curriculum…</div>
      </div>
    );
  }

  // Calculate total items for overall progress
  const allVideos: VideoItem[] = [];
  const allSections = course.sections || [];
  allSections.forEach((sec) => {
    if (sec.subsections) {
      sec.subsections.forEach((sub) => {
        allVideos.push(...sub.videos);
      });
    }
    if (sec.directVideos) {
      allVideos.push(...sec.directVideos);
    }
  });

  const totalItems = allVideos.length + allSections.length;
  const completedCount = completedVideoIds.length + completedAssignmentIds.length;
  const overallPercent = totalItems > 0 ? Math.min(100, Math.round((completedCount / totalItems) * 100)) : 0;
  const isCourseComplete = overallPercent >= 100;

  const handleVideoCompleted = (vidId: string) => {
    if (!completedVideoIds.includes(vidId)) {
      setCompletedVideoIds((prev) => [...prev, vidId]);
    }
  };

  const handleSelectVideo = (vid: VideoItem, secId: string) => {
    setActiveVideo(vid);
    setActiveSectionId(secId);
  };

  const handleSubmitAssignment = (sec: Section) => {
    const asgId = sec.assignment.id;
    if (!completedAssignmentIds.includes(asgId)) {
      setCompletedAssignmentIds((prev) => [...prev, asgId]);
      setAssignmentScores((prev) => ({ ...prev, [asgId]: 94 }));
    }
    setActiveAssignmentSection(null);
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
      author: "Jordan Dsouza",
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
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] text-slate-800 overflow-x-hidden">
      {/* Top Learning Hub Navigation Bar */}
      <header className="sticky top-0 z-30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 sm:py-0 sm:px-6 sm:h-16 gap-3 backdrop-blur-md">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <Link
            href="/dashboard/courses"
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
          >
            <ArrowLeft className="h-4 w-4" /> Courses
          </Link>
          <div className="h-4 w-[1px] bg-slate-200 hidden sm:block" />
          <div className="min-w-0">
            <h1 className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-[200px] sm:max-w-md">
              {course.title}
            </h1>
            <div className="text-[10px] text-slate-400 font-medium">
              {allSections.length} Sections · {allVideos.length} Video Lessons
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <div className="text-left sm:text-right">
            <div className="text-xs font-extrabold text-slate-900">
              {overallPercent}% Completed
            </div>
            <div className="text-[10px] text-slate-500 font-medium">
              {completedCount} of {totalItems} Milestones Completed
            </div>
          </div>
          <div className="h-2 w-20 sm:w-32 rounded-full bg-slate-100 overflow-hidden shrink-0">
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                <div className="min-w-0">
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">{activeVideo.title}</h2>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <span>Duration: {activeVideo.durationFormatted}</span>
                    <span>•</span>
                    <span className="font-mono text-[11px] uppercase text-[#2563EB]">
                      {activeVideo.videoType === "upload" ? "Uploaded Lecture" : "Private Stream"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {completedVideoIds.includes(activeVideo.id) ? (
                    <span className="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-700">
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
          <div className="rounded-[24px] border border-slate-200 bg-white shadow-xs overflow-hidden">
            {/* Udemy Tabs Strip (Curriculum is first on mobile, hidden on desktop since desktop has right rail) */}
            <div className="flex items-center gap-1 border-b border-slate-200 px-4 sm:px-6 overflow-x-auto bg-slate-50/50">
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

            {/* TAB CONTENTS */}
            <div className="p-5 sm:p-8">
              {/* TAB 0: CURRICULUM & VIDEO LESSONS (Mobile only, shown directly below video) */}
              {activeTab === "curriculum" && (
                <div className="lg:hidden space-y-6 max-w-4xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900">
                        Course Curriculum &amp; Video Lessons
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {allSections.length} Sections · {allVideos.length} Video Lessons · {totalItems} Milestones
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-left sm:text-right">
                        <div className="text-xs font-bold text-[#2563EB]">{overallPercent}% Completed</div>
                        <div className="text-[10px] text-slate-400">{completedCount}/{totalItems} Done</div>
                      </div>
                      {isCourseComplete && (
                        <button
                          type="button"
                          onClick={() => setShowCertModal(true)}
                          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs cursor-pointer"
                        >
                          <Award className="h-4 w-4" /> Certificate
                        </button>
                      )}
                    </div>
                  </div>


                  {/* Sections & Video Lessons List */}
                  <div className="space-y-4">
                    {allSections.map((sec, secIdx) => (
                      <div
                        key={sec.id}
                        className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs"
                      >
                        {/* Section Header Accordion */}
                        <div className="flex items-center justify-between bg-slate-50/80 p-3.5 border-b border-slate-100">
                          <div className="flex items-center gap-2.5">
                            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#2563EB] text-[11px] font-bold text-white">
                              {secIdx + 1}
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-slate-900">
                              {sec.title}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {sec.subsections ? sec.subsections.reduce((acc: number, s: SubSection) => acc + s.videos.length, 0) : (sec.directVideos?.length || 0)} Lessons
                          </span>
                        </div>

                        {/* Subsections & Videos */}
                        {sec.subsections && sec.subsections.length > 0 && (
                          <div className="divide-y divide-slate-100">
                            {sec.subsections.map((sub: SubSection) => (
                              <div key={sub.id} className="p-3.5 space-y-2">
                                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
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
                                            ? "bg-[#EFF6FF] text-[#2563EB] font-bold shadow-xs border border-blue-200"
                                            : "text-slate-700 hover:bg-slate-50 border border-transparent"
                                        }`}
                                      >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                          {isDone ? (
                                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                                          ) : (
                                            <PlayCircle
                                              className={`h-4 w-4 shrink-0 ${
                                                isSelected ? "text-[#2563EB]" : "text-slate-400"
                                              }`}
                                            />
                                          )}
                                          <span className="truncate">{vid.title}</span>
                                        </div>
                                        <span className="text-[11px] text-slate-400 shrink-0 font-mono">
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
                                      ? "bg-[#EFF6FF] text-[#2563EB] font-bold shadow-xs border border-blue-200"
                                      : "text-slate-700 hover:bg-slate-50 border border-transparent"
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    {isDone ? (
                                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                                    ) : (
                                      <PlayCircle
                                        className={`h-4 w-4 shrink-0 ${
                                          isSelected ? "text-[#2563EB]" : "text-slate-400"
                                        }`}
                                      />
                                    )}
                                    <span className="truncate">{vid.title}</span>
                                  </div>
                                  <span className="text-[11px] text-slate-400 shrink-0 font-mono">
                                    {vid.durationFormatted}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* Section Assignment Footer */}
                        <div className="border-t border-slate-100 p-3 bg-slate-50/60 flex items-center justify-between text-xs">
                          <span className="font-semibold text-emerald-800 flex items-center gap-1.5">
                            <ClipboardCheck className="h-4 w-4" />
                            {completedAssignmentIds.includes(sec.assignment.id)
                              ? "Assignment Passed ✓"
                              : "Section Assignment"}
                          </span>
                          <button
                            type="button"
                            onClick={() => setActiveAssignmentSection(sec)}
                            className="font-bold text-[#2563EB] hover:underline cursor-pointer"
                          >
                            {completedAssignmentIds.includes(sec.assignment.id) ? "View Solution" : "Open Assignment →"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 1: OVERVIEW (Full Udemy Screenshot Layout) */}
              {activeTab === "overview" && (

                <div className="space-y-8 max-w-4xl">
                  {/* Course Header & Rating Meta */}
                  <div className="space-y-3">
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                      {course.title} — Comprehensive Project-Based Enterprise Curriculum
                    </h1>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600 font-medium">
                      <div className="flex items-center gap-1.5 text-amber-600 font-bold">
                        <span className="text-sm font-extrabold">{course.rating || 4.8}</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span className="text-slate-500 font-normal">({course.studentsEnrolled ? `${(course.studentsEnrolled * 6).toLocaleString()} ratings` : "1,240 ratings"})</span>
                      </div>

                      <span>•</span>
                      <span>{course.studentsEnrolled ? `${course.studentsEnrolled.toLocaleString()} students` : "14,845 students"}</span>
                      <span>•</span>
                      <span>{course.durationWeeks ? `${course.durationWeeks * 2} total hours` : "32 total hours"}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-400" /> Last updated 08/2026
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

                  {/* Schedule Learning Time Box (Exact Udemy Box) */}
                  {showSchedulerBanner && (
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                      <div className="flex items-start gap-3.5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-800 shadow-2xs">
                          <Calendar className="h-5 w-5 text-[#2563EB]" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                            Schedule learning time
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                            Learning a little each day adds up. Research shows that students who make learning a habit are more likely to reach their goals. Set time aside to learn and get reminders using your learning scheduler.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <button
                          type="button"
                          onClick={() => setShowSchedulerModal(true)}
                          className="rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors"
                        >
                          Get started
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowSchedulerBanner(false)}
                          className="rounded-xl px-3 py-2 text-xs font-bold text-slate-500 hover:bg-slate-200/60 transition-colors"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  )}

                  {/* By The Numbers Grid */}
                  <div className="border-t border-slate-100 pt-6">
                    <h3 className="text-sm font-extrabold text-slate-900 mb-4">By the numbers</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-xs text-slate-700">
                      <div className="space-y-2">
                        <div><span className="text-slate-500 font-medium">Skill level:</span> <span className="font-bold text-slate-900">{course.level || "All Levels"}</span></div>
                        <div><span className="text-slate-500 font-medium">Students:</span> <span className="font-bold text-slate-900">{course.studentsEnrolled || "14,845"}</span></div>
                        <div><span className="text-slate-500 font-medium">Languages:</span> <span className="font-bold text-slate-900">English, Hindi</span></div>
                        <div><span className="text-slate-500 font-medium">Captions:</span> <span className="font-bold text-slate-900">Yes</span></div>
                      </div>
                      <div className="space-y-2">
                        <div><span className="text-slate-500 font-medium">Lectures:</span> <span className="font-bold text-slate-900">{allVideos.length || 42}</span></div>
                        <div><span className="text-slate-500 font-medium">Video:</span> <span className="font-bold text-slate-900">32 total hours</span></div>
                      </div>
                    </div>
                  </div>

                  {/* Certificates Section */}
                  <div className="border-t border-slate-100 pt-6">
                    <h3 className="text-sm font-extrabold text-slate-900 mb-2">Certificates</h3>
                    <p className="text-xs text-slate-600 mb-3">
                      Get JKS Learning accredited certificate by completing the entire course and milestone assessments.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowCertModal(true)}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition-colors"
                    >
                      <Award className="h-4 w-4 text-[#2563EB]" />
                      <span>JKS Learning Certificate</span>
                    </button>
                  </div>

                  {/* Features Section */}
                  <div className="border-t border-slate-100 pt-6">
                    <h3 className="text-sm font-extrabold text-slate-900 mb-2">Features</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-700">
                      <Smartphone className="h-4 w-4 text-slate-400" />
                      <span>Available on <strong className="text-blue-600 hover:underline cursor-pointer">iOS</strong> and <strong className="text-emerald-600 hover:underline cursor-pointer">Android</strong> mobile devices</span>
                    </div>
                  </div>

                  {/* Description Section */}
                  <div className="border-t border-slate-100 pt-6 space-y-4">
                    <h3 className="text-base font-extrabold text-slate-900">Description</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {course.summary} This master series takes you step-by-step from core syntax, fundamentals, architectural design patterns to enterprise-grade cloud deployments. Each section is reinforced with coding challenges, interactive stage assessments, and real-time AI interview practice.
                    </p>

                    {/* What You'll Learn Checklist */}
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 mt-4">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                        What you&apos;ll learn
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
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
                            <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Prerequisites & Target Audience */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-900">
                          Are there any course requirements or prerequisites?
                        </h4>
                        <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                          <li>Basic knowledge of computer operations</li>
                          <li>No prior professional programming experience required</li>
                          <li>A computer with internet connection (Windows, Mac, or Linux)</li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-900">
                          Who this course is for:
                        </h4>
                        <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                          <li>Students seeking Tier-1 product company software engineering jobs</li>
                          <li>Engineers wanting to transition into Full Stack & Cloud roles</li>
                          <li>Anyone wanting a solid, project-centric coding foundation</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Instructor Section (Udemy Reference) */}
                  <div className="border-t border-slate-100 pt-6 space-y-4">
                    <h3 className="text-sm font-extrabold text-slate-900">Instructor</h3>

                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="relative h-16 w-16 shrink-0 rounded-full border-2 border-slate-200 overflow-hidden bg-slate-900">
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
                          <h4 className="text-sm font-bold text-slate-900">Shubham Saurav &amp; JKS Mentor Team</h4>
                          <p className="text-xs text-slate-500 font-medium">
                            Lead Enterprise Architect &amp; Engineering Educator (10+ Years Experience)
                          </p>
                        </div>

                        {/* Social Buttons */}
                        <div className="flex items-center gap-2">
                          <button type="button" className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                            <TwitterIcon className="h-3.5 w-3.5" />
                          </button>
                          <button type="button" className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                            <LinkedinIcon className="h-3.5 w-3.5" />
                          </button>
                          <button type="button" className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                            <YoutubeIcon className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          Shubham Saurav is a senior software engineer and architect with a deep passion for teaching. Over the past decade, he has mentored over 50,000+ engineers globally, helping them secure high-impact roles at leading tech companies.
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
                        className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs text-slate-900 outline-none focus:border-[#2563EB]"
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

                  {/* Questions Feed */}
                  <div className="space-y-3">
                    {questionsList
                      .filter((q) =>
                        qaSearch ? q.title.toLowerCase().includes(qaSearch.toLowerCase()) : true
                      )
                      .map((q) => (
                        <div
                          key={q.id}
                          className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2 hover:border-slate-300 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <div className="relative h-8 w-8 shrink-0 rounded-full overflow-hidden border border-slate-200">
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
                                <h4 className="text-xs font-bold text-slate-900">{q.title}</h4>
                                <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                                  <span>{q.author}</span>
                                  <span>•</span>
                                  <span>{q.lecture}</span>
                                  <span>•</span>
                                  <span>{q.timeAgo}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="flex items-center gap-1 text-xs text-slate-500 font-bold bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
                                <ThumbsUp className="h-3 w-3" /> {q.upvotes}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-slate-500 font-bold bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
                                <MessageSquare className="h-3 w-3" /> {q.replies}
                              </span>
                            </div>
                          </div>

                          {q.hasInstructorResponse && (
                            <div className="mt-2 rounded-xl bg-blue-50/70 border border-blue-100 p-2.5 text-[11px] text-slate-700 flex items-center gap-1.5">
                              <CheckCircle2 className="h-3.5 w-3.5 text-[#2563EB] shrink-0" />
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
                  {/* Create Note Input Box */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">
                        Take a note at <span className="text-[#2563EB] font-mono">02:15</span>
                      </span>
                      <span className="text-[11px] text-slate-400">{activeVideo?.title}</span>
                    </div>

                    <textarea
                      rows={3}
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder="Type your notes or key takeaways here..."
                      className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 outline-none focus:border-[#2563EB]"
                    />

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleAddNote}
                        className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
                      >
                        <Plus className="h-3.5 w-3.5" /> Save Note
                      </button>
                    </div>
                  </div>

                  {/* Saved Notes Feed */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Saved Notes ({notesList.length})
                    </h4>
                    {notesList.map((n) => (
                      <div
                        key={n.id}
                        className="rounded-2xl border border-slate-200 bg-white p-4 space-y-1.5 shadow-2xs"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="rounded bg-blue-100 px-2 py-0.5 font-mono text-[11px] font-bold text-[#2563EB]">
                            {n.timestamp}
                          </span>
                          <span className="text-[11px] text-slate-400">{n.lecture}</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">{n.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: ANNOUNCEMENTS */}
              {activeTab === "announcements" && (
                <div className="space-y-4 max-w-3xl">
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden border border-slate-200">
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
                        <h4 className="text-xs font-bold text-slate-900">Shubham Saurav (Instructor)</h4>
                        <span className="text-[11px] text-slate-400">Posted 3 days ago</span>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">
                      🚀 New Section on Spring Boot 3.3, Virtual Threads &amp; Microservices Capstone Added!
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      Hello learners! We have just updated this course curriculum with 4 brand-new deep dive lectures and milestone challenges focusing on Java 21 Virtual Threads, reactive resilience patterns, and cloud containerization. Make sure to check them out in Section 2 and 3!
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 5: REVIEWS */}
              {activeTab === "reviews" && (
                <div className="space-y-6 max-w-3xl">
                  <div className="flex items-center gap-6 rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
                    <div className="text-center">
                      <div className="text-4xl font-black text-slate-900">4.8</div>
                      <div className="flex items-center justify-center gap-0.5 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">Course Rating</span>
                    </div>

                    <div className="flex-1 space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <span className="w-12 text-slate-500">5 stars</span>
                        <div className="h-2 flex-1 rounded-full bg-slate-200 overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: "82%" }} />
                        </div>
                        <span className="w-8 text-right font-bold">82%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-12 text-slate-500">4 stars</span>
                        <div className="h-2 flex-1 rounded-full bg-slate-200 overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: "14%" }} />
                        </div>
                        <span className="w-8 text-right font-bold">14%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-12 text-slate-500">3 stars</span>
                        <div className="h-2 flex-1 rounded-full bg-slate-200 overflow-hidden">
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
                        text: "Best course for Full Stack engineering! The JVM architecture explanation and live microservice project helped me crack my Tier-1 interview.",
                      },
                      {
                        name: "Vikram Malhotra",
                        date: "2 weeks ago",
                        rating: 5,
                        text: "Crystal clear explanations. The combination of video lectures with anti-skip protection and realistic coding challenges made learning super effective.",
                      },
                    ].map((rev, idx) => (
                      <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{rev.name}</span>
                          <span className="text-[11px] text-slate-400">{rev.date}</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{rev.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: LEARNING TOOLS */}
              {activeTab === "tools" && (
                <div className="space-y-4 max-w-3xl">
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Downloadable Source Code &amp; Repositories
                    </h4>
                    <div className="space-y-2">
                      <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-[#2563EB] bg-slate-50/50 text-xs font-semibold text-slate-800 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Code2 className="h-4 w-4 text-[#2563EB]" />
                          <span>Course Complete GitHub Repository &amp; Starter Boilerplate</span>
                        </div>
                        <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                      </a>

                      <button
                        type="button"
                        onClick={() => alert("Downloading Cheatsheet PDF...")}
                        className="flex w-full items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-[#2563EB] bg-slate-50/50 text-xs font-semibold text-slate-800 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Download className="h-4 w-4 text-emerald-600" />
                          <span>Download Java 21 &amp; Spring Boot 3 Quick Reference PDF</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">2.4 MB</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Active Section Assignments Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Section Assignments &amp; Milestones</h3>
            {allSections.map((sec, secIdx) => {
              const isSecAssignmentDone = completedAssignmentIds.includes(sec.assignment.id);
              const score = assignmentScores[sec.assignment.id];

              return (
                <div
                  key={sec.id}
                  className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
                        {secIdx + 1}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">{sec.title}</h4>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                      Section {secIdx + 1}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/40 p-3.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <ClipboardCheck className="h-4 w-4 text-emerald-700" />
                        <span className="text-xs font-bold text-emerald-950">
                          {sec.assignment.title}
                        </span>
                      </div>
                      <div className="mt-1 text-[11px] font-semibold text-emerald-800">
                        Type: {sec.assignment.type} · Minimum Pass: {sec.assignment.minPassingScore}%
                      </div>
                    </div>

                    <div>
                      {isSecAssignmentDone ? (
                        <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs">
                          <CheckCircle2 className="h-4 w-4" /> Passed ({score || 94}/100)
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setActiveAssignmentSection(sec)}
                          className="flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-800 transition-all hover:scale-105 cursor-pointer"
                        >
                          <FileCheck className="h-4 w-4" /> Take Assignment
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
        <aside className="hidden lg:block w-full shrink-0 border-t border-slate-200 bg-white p-4 sm:p-5 lg:w-[340px] xl:w-[380px] lg:border-t-0 lg:border-l space-y-6">


          <div>
            <h3 className="text-sm font-bold text-slate-900">Curriculum &amp; Video Lessons</h3>
            <p className="text-xs text-slate-500 font-medium">
              Structured sequential progression with in-app tracking
            </p>
          </div>

          {/* SECTIONS ACCORDION LIST */}
          <div className="space-y-4">
            {allSections.map((sec, secIdx) => (
              <div
                key={sec.id}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs"
              >
                {/* Section Header Accordion */}
                <div className="flex items-center justify-between bg-slate-50/80 p-3.5 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#2563EB] text-[11px] font-bold text-white">
                      {secIdx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-900 line-clamp-1">
                      {sec.title}
                    </span>
                  </div>
                </div>

                {/* Subsections (if any) */}
                {sec.subsections && sec.subsections.length > 0 && (
                  <div className="p-3 space-y-3 bg-slate-50/30 border-b border-slate-100">
                    {sec.subsections.map((sub) => (
                      <div key={sub.id} className="space-y-2">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                          <FolderTree className="h-3.5 w-3.5 text-blue-600" />
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
                                className={`flex w-full items-center justify-between gap-2 rounded-xl p-2.5 text-left text-xs transition-all ${
                                  isSelected
                                    ? "bg-[#EFF6FF] text-[#2563EB] font-bold shadow-xs border border-blue-200"
                                    : "text-slate-700 hover:bg-slate-50 border border-transparent"
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  {isDone ? (
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                                  ) : (
                                    <PlayCircle
                                      className={`h-4 w-4 shrink-0 ${
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
                  <div className="p-3 space-y-1.5">
                    {sec.directVideos.map((vid) => {
                      const isSelected = activeVideo?.id === vid.id;
                      const isDone = completedVideoIds.includes(vid.id);

                      return (
                        <button
                          key={vid.id}
                          type="button"
                          onClick={() => handleSelectVideo(vid, sec.id)}
                          className={`flex w-full items-center justify-between gap-2 rounded-xl p-2.5 text-left text-xs transition-all ${
                            isSelected
                              ? "bg-[#EFF6FF] text-[#2563EB] font-bold shadow-xs border border-blue-200"
                              : "text-slate-700 hover:bg-slate-50 border border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {isDone ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                            ) : (
                              <PlayCircle
                                className={`h-4 w-4 shrink-0 ${
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

                {/* Section Assignment Footer in Rail */}
                <div className="border-t border-slate-100 p-2.5 bg-slate-50/50 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-emerald-800 flex items-center gap-1">
                    <ClipboardCheck className="h-3.5 w-3.5" />
                    {completedAssignmentIds.includes(sec.assignment.id)
                      ? "Assignment Passed ✓"
                      : "Section Assignment"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveAssignmentSection(sec)}
                    className="font-bold text-[#2563EB] hover:underline"
                  >
                    {completedAssignmentIds.includes(sec.assignment.id) ? "View" : "Open"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* DYNAMIC CERTIFICATE UNLOCK CARD */}
          <div
            className={`rounded-2xl border p-5 transition-all duration-300 ${
              isCourseComplete
                ? "border-amber-300 bg-gradient-to-br from-amber-50 via-white to-blue-50 shadow-md"
                : "border-slate-200 bg-slate-50/70"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  isCourseComplete
                    ? "bg-amber-400 text-slate-950 shadow-xs"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                <Award className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Accredited Certificate
                </h4>
                <p className="mt-0.5 text-xs text-slate-500">
                  {isCourseComplete
                    ? "Congratulations! All section videos and assignments are 100% completed."
                    : "Complete all section video lectures and submit all assignments to unlock your verified credential."}
                </p>
              </div>
            </div>

            <div className="mt-4">
              {isCourseComplete ? (
                <button
                  type="button"
                  onClick={() => setShowCertModal(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-2.5 text-xs font-bold text-white shadow-md hover:from-amber-600 hover:to-amber-700 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <Award className="h-4 w-4" /> Download Verified Certificate
                </button>
              ) : (
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>Progress: {overallPercent}%</span>
                  <span>{completedCount}/{totalItems} Done</span>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* SCHEDULE LEARNING TIME MODAL */}
      {showSchedulerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <button
              type="button"
              onClick={() => setShowSchedulerModal(false)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Schedule Learning Time</h3>
                <p className="text-xs text-slate-500">Build a daily routine and get automated reminders</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-700">Frequency</label>
                <select className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-800 outline-none">
                  <option>Every Day (30 mins)</option>
                  <option>Weekdays (Mon-Fri 45 mins)</option>
                  <option>Weekends (Sat-Sun 2 hours)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Preferred Time</label>
                <input
                  type="time"
                  defaultValue="19:00"
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-800 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowSchedulerModal(false)}
                className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSchedulerModal(false);
                  setShowSchedulerBanner(false);
                }}
                className="rounded-xl bg-[#2563EB] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
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
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <button
              type="button"
              onClick={() => setShowAskModal(false)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-base font-bold text-slate-900">Ask a Question</h3>
            <p className="text-xs text-slate-500">Ask the mentor or community about this lecture</p>

            <form onSubmit={handlePostQuestion} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Question Title / Summary</label>
                <input
                  value={newQuestionTitle}
                  onChange={(e) => setNewQuestionTitle(e.target.value)}
                  placeholder="e.g. Why does my Spring Boot application fail on port 8080?"
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 outline-none focus:border-[#2563EB]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Details &amp; Code Snippets</label>
                <textarea
                  rows={4}
                  value={newQuestionBody}
                  onChange={(e) => setNewQuestionBody(e.target.value)}
                  placeholder="Provide context, error stack traces or what you've tried..."
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-mono text-slate-900 outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAskModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
                >
                  <Send className="h-3.5 w-3.5" /> Post Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SECTION ASSIGNMENT MODAL */}
      {activeAssignmentSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <button
              type="button"
              onClick={() => setActiveAssignmentSection(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <ClipboardCheck className="h-5 w-5 text-[#2563EB]" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {activeAssignmentSection.assignment.title}
                </h3>
                <div className="text-[11px] text-slate-500">
                  Type: {activeAssignmentSection.assignment.type} · Minimum Pass:{" "}
                  {activeAssignmentSection.assignment.minPassingScore}%
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <p className="font-semibold text-slate-900">
                {activeAssignmentSection.assignment.description}
              </p>

              {activeAssignmentSection.assignment.questions &&
              activeAssignmentSection.assignment.questions.length > 0 ? (
                <div className="space-y-3">
                  {activeAssignmentSection.assignment.questions.map((q, qIdx) => (
                    <div key={qIdx} className="space-y-2 rounded-xl bg-slate-50 p-3">
                      <div className="font-bold text-slate-800">Question {qIdx + 1}: {q.prompt}</div>
                      <div className="space-y-1.5">
                        {q.choices?.map((choice, cIdx) => (
                          <label
                            key={cIdx}
                            className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white p-2.5 hover:bg-slate-50 cursor-pointer text-xs"
                          >
                            <input
                              type="radio"
                              name={`quiz-${qIdx}`}
                              defaultChecked={cIdx === 0}
                              className="accent-[#2563EB]"
                            />
                            <span>{choice}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-700">
                    Paste Project Git Repository URL or Solution Notes:
                  </label>
                  <textarea
                    rows={3}
                    defaultValue="https://github.com/student-workspace/jks-milestone-solution"
                    className="w-full rounded-xl border border-slate-200 p-3 text-xs font-mono text-slate-800 outline-none"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setActiveAssignmentSection(null)}
                className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSubmitAssignment(activeAssignmentSection)}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs cursor-pointer"
              >
                <FileCheck className="h-4 w-4" /> Submit &amp; Evaluate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VERIFIED CERTIFICATE MODAL */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl space-y-5">
            <button
              type="button"
              onClick={() => setShowCertModal(false)}
              className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="rounded-2xl border-4 border-double border-amber-300/80 bg-gradient-to-b from-slate-950 via-slate-900 to-blue-950 p-8 text-center text-white shadow-xl">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-400/20 text-amber-300">
                <Award className="h-8 w-8" />
              </div>
              <div className="mt-4 text-xs font-bold tracking-widest text-amber-400 uppercase">
                JKS Learning Institute of Technology
              </div>
              <h2 className="mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
                Official Certificate of Course Mastery
              </h2>
              <p className="mt-4 text-xs text-slate-300">This certifies that</p>
              <div className="mt-1 text-2xl font-extrabold text-blue-300">
                Jordan Dsouza
              </div>
              <p className="mt-4 text-xs text-slate-300">
                has successfully completed all required video sections, subsections, and passed all milestone assignments for
              </p>
              <div className="mt-1 text-base font-bold text-white">{course.title}</div>

              <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4 text-left text-xs">
                <div>
                  <div className="font-mono text-emerald-400">ID: JKS-CERT-2026-{course.slug.toUpperCase().slice(0, 8)}</div>
                  <div className="text-slate-400">Verified Authentic via JKS Ledger</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-white">Authorized Signature</div>
                  <div className="text-slate-400">Academic Director, JKS</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCertModal(false)}
                className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => setShowCertModal(false)}
                className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
              >
                <Download className="h-4 w-4" /> Download PDF Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
