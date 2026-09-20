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
} from "lucide-react";
import { FullCourse, Section, VideoItem, saveCourseAsync } from "@/lib/data/courses-store";
import type { Track } from "@/lib/data/courses";

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
  const [customTrack, setCustomTrack] = useState("");
  const [level, setLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");
  const [price, setPrice] = useState<number>(24999);
  const [status, setStatus] = useState<"Published" | "Draft">("Published");
  const [thumbnail, setThumbnail] = useState("");
  const [summary, setSummary] = useState("");
  const [sections, setSections] = useState<Section[]>([]);

  // Feedback State
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Sync state when course changes
  useEffect(() => {
    if (course) {
      setTitle(course.title || "");
      setTrack(course.track || "Full Stack");
      setLevel(course.level || "Beginner");
      setPrice(course.price || 0);
      setStatus(course.status || "Published");
      setThumbnail(course.thumbnail || "");
      setSummary(course.summary || "");
      setSections(course.sections ? JSON.parse(JSON.stringify(course.sections)) : []);
      setFeedback(null);
    }
  }, [course]);

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

  const handleSaveCourse = async () => {
    if (!title.trim()) {
      setFeedback({ type: "error", message: "Course title cannot be empty." });
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    const effectiveTrack = track === "Custom" ? (customTrack.trim() || "Full Stack") : track;

    const updatedCourse: FullCourse = {
      ...course,
      title: title.trim(),
      track: effectiveTrack as Track,
      level,
      price: Number(price) || 0,
      status,
      thumbnail: thumbnail.trim(),
      summary: summary.trim(),
      sections,
    };

    try {
      const saved = await saveCourseAsync(updatedCourse);
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
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Edit Course &amp; Video Lectures
              </h2>
              <span className="rounded-md bg-blue-100 dark:bg-blue-950/60 px-2 py-0.5 text-[10px] font-bold text-[#2563EB] dark:text-blue-400">
                /{course.slug}
              </span>
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

              {/* Track & Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Academic Track
                  </label>
                  <select
                    value={track}
                    onChange={(e) => setTrack(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                  >
                    <option value="Full Stack">Full Stack</option>
                    <option value="Frontend">Frontend</option>
                    <option value="SAP">SAP</option>
                    <option value=".NET">.NET</option>
                    <option value="Data Science">Data Science</option>
                    <option value="DevOps & Cloud">DevOps &amp; Cloud</option>
                    <option value="Custom">+ Custom Track</option>
                  </select>

                  {track === "Custom" && (
                    <input
                      type="text"
                      placeholder="Type custom academic track name..."
                      value={customTrack}
                      onChange={(e) => setCustomTrack(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-950/20 px-3 py-2 text-xs text-slate-900 dark:text-white outline-none"
                    />
                  )}
                </div>

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

                      {(section.directVideos || []).map((video, vIdx) => (
                        <div
                          key={video.id || vIdx}
                          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-surface-secondary p-2.5 shadow-2xs"
                        >
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
                              className="w-40 sm:w-56 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-input-bg px-2.5 py-1 text-[11px] text-slate-700 dark:text-slate-300 outline-none"
                            />

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
                      ))}
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
