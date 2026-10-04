"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Trash2,
  Video,
  Layers,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Film,
  Sparkles,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  ClipboardCheck,
  Loader2,
} from "lucide-react";
import { FullCourse, Section, VideoItem, saveCourseAsync } from "@/lib/data/courses-store";
import type { Track } from "@/lib/data/courses";
import { fetchInstructors } from "@/lib/auth/use-mock-auth";

interface EditCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: FullCourse | null;
  onSaved?: (updatedCourse: FullCourse) => void;
}

export function EditCourseModal({ isOpen, onClose, course, onSaved }: EditCourseModalProps) {
  const [activeTab, setActiveTab] = useState<"info" | "curriculum">("info");

  // Form State
  const [title, setTitle] = useState("");
  const [track, setTrack] = useState<string>("Full Stack");
  const [subTrack, setSubTrack] = useState<string>("");
  const [customTrack, setCustomTrack] = useState("");
  const [level, setLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");
  const [price, setPrice] = useState<number>(0);
  const [status, setStatus] = useState<"Published" | "Draft">("Published");
  const [thumbnail, setThumbnail] = useState("");
  const [summary, setSummary] = useState("");
  const [sections, setSections] = useState<Section[]>([]);
  const [expandedVideoKey, setExpandedVideoKey] = useState<string | null>(null);

  const TRACK_SUBTRACKS: Record<string, string[]> = {
    SAP: [
      "SAP B1",
      "SAP Ariba",
      "SAP S/4HANA",
      "SAP ABAP",
      "SAP FICO",
      "SAP MM",
      "SAP SD",
      "SAP SuccessFactors",
      "SAP Basis",
    ],
    "Full Stack": [
      "Java Full Stack",
      "MERN / Full Stack JavaScript",
      "Python Full Stack",
      ".NET Cloud Architecture",
      "Spring Boot & Angular",
    ],
    Frontend: [
      "React 19 & Next.js",
      "Angular Enterprise Architecture",
      "Vue.js & Nuxt Architect",
      "React Native Mobile",
    ],
    DotNet: [
      ".NET 9 Web API & Microservices",
      "Azure Cloud Architecture",
      "C# Enterprise Systems",
      "Microservices & Kubernetes",
    ],
    "DevOps & Cloud": [
      "AWS Cloud Architecture",
      "Azure DevOps & CI/CD",
      "Docker & Kubernetes",
      "Terraform & GitOps",
    ],
    "Data Science": [
      "Applied Generative AI & LLMs",
      "Python Data Science & ML",
      "Data Engineering & PySpark",
    ],
  };

  const getSubTracksForTrack = (selectedTrack: string): string[] => {
    const norm = (selectedTrack || "").toLowerCase();
    if (norm.includes("sap")) return TRACK_SUBTRACKS["SAP"];
    if (norm.includes("front")) return TRACK_SUBTRACKS["Frontend"];
    if (norm.includes("dotnet") || norm.includes(".net")) return TRACK_SUBTRACKS["DotNet"];
    if (norm.includes("cloud") || norm.includes("devops")) return TRACK_SUBTRACKS["DevOps & Cloud"];
    if (norm.includes("data") || norm.includes("ai")) return TRACK_SUBTRACKS["Data Science"];
    return TRACK_SUBTRACKS["Full Stack"];
  };

  // Instructor State
  const [instructorsList, setInstructorsList] = useState<{ id: string; name: string; email: string }[]>([
    { id: "6aafc1a7d80072434f90eb89", name: "Davood Khan", email: "pattandavood123@gmail.com" },
    { id: "6aad83b294e145c985052247", name: "Jouli Srikanth", email: "joulisrikanth123@gmail.com" },
  ]);
  const [selectedInstructorId, setSelectedInstructorId] = useState<string>("6aafc1a7d80072434f90eb89");

  useEffect(() => {
    fetchInstructors()
      .then((list) => {
        if (list && list.length > 0) {
          setInstructorsList(list);
        }
      })
      .catch(() => {});
  }, []);

  // Feedback State
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Sync state when course changes
  useEffect(() => {
    if (course) {
      setTitle(course.title || "");
      setTrack(course.track || "Full Stack");
      setSubTrack(course.subTrack || "");
      setLevel(course.level || "Beginner");
      setPrice(typeof course.price === "number" ? course.price : 0);
      setStatus(course.status || "Published");
      setThumbnail(course.thumbnail || "");
      setSummary(course.summary || "");
      setSections(course.sections ? JSON.parse(JSON.stringify(course.sections)) : []);
      if (course.instructorUserIds && course.instructorUserIds.length > 0) {
        setSelectedInstructorId(course.instructorUserIds[0]);
      } else {
        setSelectedInstructorId("6aafc1a7d80072434f90eb89");
      }
      setFeedback(null);
    }
  }, [course]);

  // Auto-Save Draft State
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [showDraftBanner, setShowDraftBanner] = useState(false);
  const [draftPayload, setDraftPayload] = useState<any>(null);

  // Check for saved draft on course load
  useEffect(() => {
    if (course?.id) {
      try {
        const draftKey = `jks_course_draft_${course.id}`;
        const raw = localStorage.getItem(draftKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.savedAt) {
            setDraftPayload(parsed);
            setShowDraftBanner(true);
            setDraftSavedAt(
              new Date(parsed.savedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            );
          }
        }
      } catch {}
    }
  }, [course?.id]);

  const handleRestoreDraft = () => {
    if (!draftPayload) return;
    if (draftPayload.title !== undefined) setTitle(draftPayload.title);
    if (draftPayload.track !== undefined) setTrack(draftPayload.track);
    if (draftPayload.subTrack !== undefined) setSubTrack(draftPayload.subTrack);
    if (draftPayload.customTrack !== undefined) setCustomTrack(draftPayload.customTrack);
    if (draftPayload.level !== undefined) setLevel(draftPayload.level);
    if (draftPayload.price !== undefined) setPrice(draftPayload.price);
    if (draftPayload.status !== undefined) setStatus(draftPayload.status);
    if (draftPayload.thumbnail !== undefined) setThumbnail(draftPayload.thumbnail);
    if (draftPayload.summary !== undefined) setSummary(draftPayload.summary);
    if (draftPayload.sections !== undefined) setSections(draftPayload.sections);
    if (draftPayload.selectedInstructorId !== undefined) setSelectedInstructorId(draftPayload.selectedInstructorId);
    setShowDraftBanner(false);
  };

  const handleDiscardDraft = () => {
    if (course?.id) {
      try {
        localStorage.removeItem(`jks_course_draft_${course.id}`);
      } catch {}
    }
    setShowDraftBanner(false);
    setDraftSavedAt(null);
    setDraftPayload(null);
  };

  // Debounced auto-save draft effect
  useEffect(() => {
    if (!isOpen || !course?.id || !title.trim()) return;

    setIsDraftSaving(true);
    const timer = setTimeout(() => {
      try {
        const draftKey = `jks_course_draft_${course.id}`;
        const now = Date.now();
        const payload = {
          title,
          track,
          subTrack,
          customTrack,
          level,
          price,
          status,
          thumbnail,
          summary,
          sections,
          selectedInstructorId,
          savedAt: now,
        };
        localStorage.setItem(draftKey, JSON.stringify(payload));
        setIsDraftSaving(false);
        setDraftSavedAt(
          new Date(now).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
        );
      } catch (err) {
        console.warn("Failed to auto-save course draft:", err);
        setIsDraftSaving(false);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [
    isOpen,
    course?.id,
    title,
    track,
    subTrack,
    customTrack,
    level,
    price,
    status,
    thumbnail,
    summary,
    sections,
    selectedInstructorId,
  ]);

  if (!isOpen || !course) return null;

  const handleAddSection = () => {
    const nextOrder = sections.length + 1;
    const newSection: Section = {
      id: `sec-${Date.now()}`,
      title: `Section ${nextOrder}: New Module`,
      order: nextOrder,
      description: "Module overview and lecture materials.",
      directVideos: [
        {
          id: `vid-${Date.now()}`,
          title: "Lecture 1: Introduction",
          durationSeconds: 600,
          durationFormatted: "10:00",
          videoType: "url",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          order: 1,
        },
      ],
      assignment: {
        id: `asg-${Date.now()}`,
        title: `Milestone Assessment for Section ${nextOrder}`,
        description: "Review assignment",
        type: "Short Answer",
        minPassingScore: 70,
      },
    };
    setSections([...sections, newSection]);
  };

  const handleRemoveSection = (sectionIndex: number) => {
    setSections(sections.filter((_, idx) => idx !== sectionIndex));
  };

  const handleUpdateSectionTitle = (index: number, newTitle: string) => {
    const updated = [...sections];
    updated[index].title = newTitle;
    setSections(updated);
  };

  const handleUpdateSectionDesc = (index: number, newDesc: string) => {
    const updated = [...sections];
    updated[index].description = newDesc;
    setSections(updated);
  };

  const handleAddVideo = (sectionIndex: number) => {
    const updated = [...sections];
    const section = updated[sectionIndex];
    const currentVideos = section.directVideos || [];
    const nextOrder = currentVideos.length + 1;
    const newVideo: VideoItem = {
      id: `vid-${Date.now()}-${nextOrder}`,
      title: `Lecture ${nextOrder}: New Video`,
      durationSeconds: 480,
      durationFormatted: "08:00",
      videoType: "url",
      videoUrl: "",
      order: nextOrder,
    };
    section.directVideos = [...currentVideos, newVideo];
    setSections(updated);
  };

  const handleRemoveVideo = (sectionIndex: number, videoIndex: number) => {
    const updated = [...sections];
    const section = updated[sectionIndex];
    if (section.directVideos) {
      section.directVideos = section.directVideos.filter((_, idx) => idx !== videoIndex);
      setSections(updated);
    }
  };

  const handleUpdateVideo = (
    sectionIndex: number,
    videoIndex: number,
    field: keyof VideoItem,
    value: any
  ) => {
    const updated = [...sections];
    const section = updated[sectionIndex];
    if (section.directVideos && section.directVideos[videoIndex]) {
      section.directVideos[videoIndex] = {
        ...section.directVideos[videoIndex],
        [field]: value,
      };
      setSections(updated);
    }
  };

  const handleAddVideoInterviewQuestion = (sIdx: number, vIdx: number) => {
    const updated = [...sections];
    const video = updated[sIdx].directVideos![vIdx];
    const list = video.interviewQuestions || [];
    video.interviewQuestions = [
      ...list,
      {
        id: `iq-${Date.now()}-${list.length + 1}`,
        question: "",
        answer: "",
      },
    ];
    setSections(updated);
  };

  const handleUpdateVideoInterviewQuestion = (
    sIdx: number,
    vIdx: number,
    qIdx: number,
    field: "question" | "answer",
    val: string
  ) => {
    const updated = [...sections];
    const video = updated[sIdx].directVideos![vIdx];
    if (video.interviewQuestions && video.interviewQuestions[qIdx]) {
      video.interviewQuestions[qIdx][field] = val;
      setSections(updated);
    }
  };

  const handleRemoveVideoInterviewQuestion = (sIdx: number, vIdx: number, qIdx: number) => {
    const updated = [...sections];
    const video = updated[sIdx].directVideos![vIdx];
    if (video.interviewQuestions) {
      video.interviewQuestions = video.interviewQuestions.filter((_, i) => i !== qIdx);
      setSections(updated);
    }
  };

  const handleUpdateVideoTask = (
    sIdx: number,
    vIdx: number,
    field: "title" | "description" | "instructions" | "submissionType" | "points",
    val: any
  ) => {
    const updated = [...sections];
    const video = updated[sIdx].directVideos![vIdx];
    video.task = {
      title: video.task?.title || "",
      description: video.task?.description || "",
      instructions: video.task?.instructions || "",
      submissionType: video.task?.submissionType || "text",
      points: video.task?.points || 100,
      ...video.task,
      [field]: val,
    };
    setSections(updated);
  };

  const handleSaveCourse = async () => {
    if (!title.trim()) {
      setFeedback({ type: "error", message: "Course title cannot be empty." });
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    const effectiveTrack = track === "Custom" ? (customTrack.trim() || "Full Stack") : track;

    const selectedInstructor = instructorsList.find((i) => i.id === selectedInstructorId);

    const updatedCourse: FullCourse = {
      ...course,
      title: title.trim(),
      track: effectiveTrack as Track,
      subTrack: subTrack.trim() || undefined,
      level,
      price: typeof price === "number" && !isNaN(price) && price >= 0 ? price : 0,
      status,
      thumbnail: thumbnail.trim(),
      summary: summary.trim(),
      sections,
      instructorUserIds: selectedInstructorId ? [selectedInstructorId] : ["6aafc1a7d80072434f90eb89"],
      instructorName: selectedInstructor?.name || "Davood Khan",
    };

    try {
      const saved = await saveCourseAsync(updatedCourse);
      try {
        localStorage.removeItem(`jks_course_draft_${course.id}`);
      } catch {}
      setDraftSavedAt(null);
      setShowDraftBanner(false);
      setDraftPayload(null);
      setFeedback({
        type: "success",
        message: "Course curriculum and video lectures successfully saved! Changes are now live for all enrolled students.",
      });
      if (onSaved) {
        onSaved(saved || updatedCourse);
      }
      setTimeout(() => {
        setIsSaving(false);
      }, 800);
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err?.message || "Failed to save course changes.",
      });
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-4xl max-h-[92vh] bg-white dark:bg-surface-secondary rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-5 py-4 bg-slate-50/50 dark:bg-surface-elevated/40">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Edit Course &amp; Video Lectures
              </h2>
              <span className="rounded-md bg-blue-100 dark:bg-blue-950/60 px-2 py-0.5 text-[10px] font-bold text-[#2563EB] dark:text-blue-400">
                /{course.slug}
              </span>
              {isDraftSaving ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                  <Loader2 className="h-3 w-3 animate-spin text-amber-600" /> Auto-saving draft...
                </span>
              ) : draftSavedAt ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Auto-saved draft ({draftSavedAt})
                </span>
              ) : null}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Add new video lectures or modify curriculum. Changes immediately propagate to student dashboards.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-surface-hover hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Draft Recovery Banner */}
        {showDraftBanner && (
          <div className="flex items-center justify-between gap-3 bg-amber-50 dark:bg-amber-950/60 border-b border-amber-200 dark:border-amber-800 px-5 py-2.5 text-xs text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
              <span>
                Found an uncommitted auto-saved draft for this course{draftSavedAt ? ` from ${draftSavedAt}` : ""}.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleRestoreDraft}
                className="font-bold underline hover:no-underline text-amber-900 dark:text-amber-200 cursor-pointer"
              >
                Restore Draft
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={handleDiscardDraft}
                className="text-amber-700 dark:text-amber-400 hover:text-amber-900 cursor-pointer"
              >
                Discard
              </button>
            </div>
          </div>
        )}

        {/* Tab Selector */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-5 bg-white dark:bg-surface-secondary">
          <button
            type="button"
            onClick={() => setActiveTab("info")}
            className={`flex items-center gap-2 border-b-2 py-3 px-3 text-xs font-bold transition-colors ${
              activeTab === "info"
                ? "border-[#2563EB] text-[#2563EB] dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <Layers className="h-4 w-4" />
            1. Course Details &amp; Settings
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("curriculum")}
            className={`flex items-center gap-2 border-b-2 py-3 px-3 text-xs font-bold transition-colors ${
              activeTab === "curriculum"
                ? "border-[#2563EB] text-[#2563EB] dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <Video className="h-4 w-4" />
            2. Curriculum &amp; Video Lectures ({sections.reduce((acc, s) => acc + (s.directVideos?.length || 0), 0)} Videos)
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`mx-5 mt-4 flex items-center gap-2 rounded-xl p-3 text-xs font-semibold ${
              feedback.type === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                : "bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {activeTab === "info" ? (
            <div className="space-y-4">
              {/* Course Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Course Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Master Full Stack Next.js & NestJS"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Academic Track & Sub-Track */}
              <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/60 dark:bg-surface-elevated/40 p-4 space-y-4">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Academic Track <span className="text-slate-400 font-normal lowercase">(select preset or edit directly)</span>
                    </label>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Click preset or edit word below
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 mb-2">
                    {["SAP", "Full Stack", "Frontend", ".NET", "DevOps & Cloud", "Data Science"].map((t) => {
                      const isSelected =
                        track.toLowerCase().trim() === t.toLowerCase().trim() ||
                        (t === "SAP" && track.toLowerCase().includes("sap"));
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            setTrack(t);
                            const subList = getSubTracksForTrack(t);
                            if (subList.length > 0 && !subList.includes(subTrack)) {
                              setSubTrack(subList[0]);
                            }
                          }}
                          className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#2563EB] text-white shadow-xs scale-[1.02]"
                              : "bg-white dark:bg-surface-secondary border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400"
                          }`}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>

                  <input
                    type="text"
                    value={track}
                    onChange={(e) => setTrack(e.target.value)}
                    placeholder="e.g. SAP, Full Stack, Frontend, DotNet..."
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <span>Sub-Track / Specialization</span>
                      <span className="rounded bg-blue-100 dark:bg-blue-950/70 text-[#2563EB] dark:text-blue-300 px-1.5 py-0.5 text-[10px] font-bold">
                        {track || "Track"}
                      </span>
                    </label>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Choose specialization or enter custom
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 mb-2">
                    {getSubTracksForTrack(track).map((st) => {
                      const isSelected = subTrack.toLowerCase().trim() === st.toLowerCase().trim();
                      return (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setSubTrack(st)}
                          className={`rounded-lg px-2.5 py-1 text-[11.5px] font-bold transition-all cursor-pointer ${
                            isSelected
                              ? "bg-emerald-600 text-white shadow-xs scale-[1.02]"
                              : "bg-white dark:bg-surface-secondary border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-400"
                          }`}
                        >
                          {st}
                        </button>
                      );
                    })}
                  </div>

                  <input
                    type="text"
                    value={subTrack}
                    onChange={(e) => setSubTrack(e.target.value)}
                    placeholder="e.g. SAP B1, SAP Ariba, SAP S/4HANA, or custom specialization..."
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Difficulty Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              {/* Price & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Price (INR ₹)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Catalog Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                  >
                    <option value="Published">Published (Live for enrollment)</option>
                    <option value="Draft">Draft (Hidden from public catalog)</option>
                  </select>
                </div>
              </div>

              {/* Assigned Faculty & Instructor */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Assigned Faculty / Lead Instructor
                </label>
                <select
                  value={selectedInstructorId}
                  onChange={(e) => setSelectedInstructorId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                >
                  {instructorsList.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name} ({inst.email})
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  This faculty member will be prominently displayed on student course cards, video lessons, and certificate accreditations.
                </p>
              </div>

              {/* Thumbnail URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Thumbnail Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    placeholder="https://images.unsplash.com/... or media path"
                    className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3.5 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                  />
                  {thumbnail && (
                    <img
                      src={thumbnail}
                      alt="Preview"
                      className="h-9 w-14 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                  )}
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Course Summary &amp; Overview
                </label>
                <textarea
                  rows={3}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Provide an engaging summary for prospective students..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg p-3 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>
          ) : (
            /* Curriculum & Video Lectures Tab */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Course Modules &amp; Video Lectures
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Add new video lectures or create curriculum sections. All updates sync directly to enrolled students.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddSection}
                  className="flex items-center gap-1.5 rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-3 py-1.5 text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Section</span>
                </button>
              </div>

              {sections.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center">
                  <Film className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">No sections in this course yet</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Click &ldquo;Add Section&rdquo; above to create the first module and add video lectures.</p>
                </div>
              ) : (
                sections.map((section, sIdx) => (
                  <div
                    key={section.id || sIdx}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-surface-elevated/40 p-4 space-y-4"
                  >
                    {/* Section Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-blue-100 dark:bg-blue-950/60 px-2 py-0.5 text-[10px] font-bold text-[#2563EB] dark:text-blue-400">
                            Section {sIdx + 1}
                          </span>
                          <input
                            type="text"
                            value={section.title}
                            onChange={(e) => handleUpdateSectionTitle(sIdx, e.target.value)}
                            placeholder="Section Title"
                            className="flex-1 font-bold text-xs text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#2563EB] outline-none px-1 py-0.5"
                          />
                        </div>
                        <input
                          type="text"
                          value={section.description || ""}
                          onChange={(e) => handleUpdateSectionDesc(sIdx, e.target.value)}
                          placeholder="Brief description of this section's objectives..."
                          className="w-full text-[11px] text-slate-500 dark:text-slate-400 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#2563EB] outline-none px-1"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSection(sIdx)}
                        className="rounded-lg p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        title="Delete this section"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Videos List within this Section */}
                    <div className="space-y-2 pl-2 sm:pl-4 border-l-2 border-blue-200 dark:border-blue-900/60">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                          Video Lectures ({section.directVideos?.length || 0})
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddVideo(sIdx)}
                          className="flex items-center gap-1 text-[11px] font-bold text-[#2563EB] dark:text-blue-400 hover:underline cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                          <span>Add Video Lecture</span>
                        </button>
                      </div>

                      {(section.directVideos || []).map((video, vIdx) => {
                        const videoKey = `${sIdx}-${vIdx}`;
                        const isExpanded = expandedVideoKey === videoKey;
                        const iqCount = video.interviewQuestions?.length || 0;
                        const hasTask = Boolean(video.task?.title?.trim());

                        return (
                          <div
                            key={video.id || vIdx}
                            className="rounded-xl border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-surface-secondary p-3 shadow-2xs space-y-2.5 transition-all"
                          >
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                                  {vIdx + 1}
                                </span>
                                <input
                                  type="text"
                                  value={video.title}
                                  onChange={(e) => handleUpdateVideo(sIdx, vIdx, "title", e.target.value)}
                                  placeholder="Video Title (e.g. Setting up Next.js 15)"
                                  className="w-full text-xs font-semibold text-slate-800 dark:text-white bg-transparent border-b border-transparent focus:border-[#2563EB] outline-none"
                                />
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                {/* Duration */}
                                <input
                                  type="text"
                                  value={video.durationFormatted || "10:00"}
                                  onChange={(e) =>
                                    handleUpdateVideo(sIdx, vIdx, "durationFormatted", e.target.value)
                                  }
                                  placeholder="10:00"
                                  title="Duration (MM:SS)"
                                  className="w-16 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-input-bg px-2 py-1 text-center text-[11px] font-mono font-medium text-slate-700 dark:text-slate-300 outline-none"
                                />

                                {/* Video URL */}
                                <input
                                  type="text"
                                  value={video.videoUrl}
                                  onChange={(e) => handleUpdateVideo(sIdx, vIdx, "videoUrl", e.target.value)}
                                  placeholder="Video URL (YouTube/MP4/embed)"
                                  className="w-36 sm:w-52 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-input-bg px-2.5 py-1 text-[11px] text-slate-700 dark:text-slate-300 outline-none"
                                />

                                {/* Toggle Interview & Task Accordion */}
                                <button
                                  type="button"
                                  onClick={() => setExpandedVideoKey(isExpanded ? null : videoKey)}
                                  className={`rounded-lg px-2 py-1 text-[10.5px] font-bold flex items-center gap-1 border transition-all cursor-pointer ${
                                    isExpanded || iqCount > 0 || hasTask
                                      ? "bg-blue-50 border-blue-200 text-[#2563EB] dark:bg-blue-950/50 dark:border-blue-800/80 dark:text-blue-400"
                                      : "bg-slate-50 border-slate-200 text-slate-600 dark:bg-surface-elevated dark:border-slate-700 dark:text-slate-400"
                                  }`}
                                  title="Configure attached interview questions and practical task"
                                >
                                  <span>Q&amp;A &amp; Task</span>
                                  {iqCount > 0 && (
                                    <span className="rounded-full bg-blue-200 dark:bg-blue-900 px-1 text-[9px]">
                                      {iqCount}
                                    </span>
                                  )}
                                  {hasTask && (
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                  )}
                                  {isExpanded ? (
                                    <ChevronUp className="h-3 w-3" />
                                  ) : (
                                    <ChevronDown className="h-3 w-3" />
                                  )}
                                </button>

                                {/* Remove Video */}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveVideo(sIdx, vIdx)}
                                  className="rounded-lg p-1 text-slate-400 hover:text-red-500 transition-colors"
                                  title="Delete Video"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* EXPANDABLE VIDEO CONFIGURATION: Interview Questions & Task */}
                            {isExpanded && (
                              <div className="rounded-xl border border-blue-100 dark:border-blue-900/50 bg-blue-50/20 dark:bg-blue-950/20 p-3 space-y-4 text-xs">
                                {/* 1. Interview Questions */}
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                                      <HelpCircle className="h-3.5 w-3.5 text-[#2563EB]" />
                                      Video Interview Questions ({iqCount})
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleAddVideoInterviewQuestion(sIdx, vIdx)}
                                      className="rounded-md bg-white dark:bg-surface-elevated border border-blue-200 dark:border-blue-800 px-2 py-0.5 text-[10.5px] font-bold text-[#2563EB] dark:text-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
                                    >
                                      + Add Interview Question
                                    </button>
                                  </div>

                                  {iqCount === 0 ? (
                                    <p className="text-[11px] text-slate-400 italic">
                                      No interview questions attached to this video yet. Click &ldquo;+ Add Interview Question&rdquo; to attach technical questions for this lecture.
                                    </p>
                                  ) : (
                                    <div className="space-y-2">
                                      {(video.interviewQuestions || []).map((iq, qIdx) => (
                                        <div
                                          key={iq.id || qIdx}
                                          className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary p-2.5 space-y-1.5 shadow-2xs"
                                        >
                                          <div className="flex items-center justify-between gap-2">
                                            <span className="font-bold text-slate-700 dark:text-slate-300 text-[10.5px]">
                                              Question #{qIdx + 1}
                                            </span>
                                            <button
                                              type="button"
                                              onClick={() => handleRemoveVideoInterviewQuestion(sIdx, vIdx, qIdx)}
                                              className="text-slate-400 hover:text-red-500 cursor-pointer"
                                            >
                                              <Trash2 className="h-3 w-3" />
                                            </button>
                                          </div>
                                          <input
                                            type="text"
                                            value={iq.question}
                                            onChange={(e) =>
                                              handleUpdateVideoInterviewQuestion(sIdx, vIdx, qIdx, "question", e.target.value)
                                            }
                                            placeholder="Interview Question (e.g. What is the difference between Hot and Cold Observables?)"
                                            className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-input-bg p-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                                          />
                                          <textarea
                                            rows={2}
                                            value={iq.answer || ""}
                                            onChange={(e) =>
                                              handleUpdateVideoInterviewQuestion(sIdx, vIdx, qIdx, "answer", e.target.value)
                                            }
                                            placeholder="Expected model answer or key evaluation points..."
                                            className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-input-bg p-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* 2. Video Task / Practical Challenge */}
                                <div className="space-y-2 pt-2 border-t border-blue-100 dark:border-blue-900/50">
                                  <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                                    <ClipboardCheck className="h-3.5 w-3.5 text-[#2563EB]" />
                                    Attached Video Task / Practical Assignment
                                  </span>

                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    <div className="sm:col-span-2">
                                      <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                                        Task Title
                                      </label>
                                      <input
                                        type="text"
                                        value={video.task?.title || ""}
                                        onChange={(e) => handleUpdateVideoTask(sIdx, vIdx, "title", e.target.value)}
                                        placeholder="e.g. Mini-Project: Implement Authentication Middleware"
                                        className="mt-0.5 w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg p-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                                        Submission Type
                                      </label>
                                      <select
                                        value={video.task?.submissionType || "text"}
                                        onChange={(e) =>
                                          handleUpdateVideoTask(sIdx, vIdx, "submissionType", e.target.value)
                                        }
                                        className="mt-0.5 w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg p-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                                      >
                                        <option value="text">Text / Code Submission</option>
                                        <option value="file">File Upload (.zip, .pdf)</option>
                                        <option value="link">Project Link (GitHub / Deploy)</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                                      Task Instructions &amp; Submission Criteria
                                    </label>
                                    <textarea
                                      rows={2}
                                      value={video.task?.instructions || video.task?.description || ""}
                                      onChange={(e) => {
                                        handleUpdateVideoTask(sIdx, vIdx, "instructions", e.target.value);
                                        handleUpdateVideoTask(sIdx, vIdx, "description", e.target.value);
                                      }}
                                      placeholder="Explain the task deliverables, edge cases to handle, or upload requirements..."
                                      className="mt-0.5 w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg p-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 px-5 py-3.5 bg-slate-50/50 dark:bg-surface-elevated/40">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-surface-hover transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSaveCourse}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700 disabled:opacity-50 transition-all cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? "Saving..." : "Save Course & Videos"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
