"use client";

import React, { useState, useMemo } from "react";
import {
  ArrowLeft,
  Plus,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Play,
  Video,
  Edit2,
  Trash2,
  Award,
  Building,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  X,
  ExternalLink,
} from "lucide-react";
import {
  useSuccessStories,
  type SuccessStoryItem,
} from "@/lib/data/success-stories-store";
import { VideoStoryModal } from "@/components/marketing/video-story-modal";
import { AdminStoryEditorModal } from "@/components/marketing/admin-story-editor-modal";
import type { Track } from "@/lib/data/courses";
import type { CareerCategory } from "@/lib/data/testimonials";

const TRACKS: Array<{ label: string; value: "All" | Track }> = [
  { label: "All Tracks", value: "All" },
  { label: "SAP Ecosystem", value: "SAP" },
  { label: "Java Full Stack", value: "Full Stack" },
  { label: "Frontend Engineering", value: "Frontend" },
];

const CATEGORIES: Array<{ label: string; value: "All" | CareerCategory }> = [
  { label: "All Transitions", value: "All" },
  { label: "Tier-1 Placements", value: "Tier-1 Placement" },
  { label: "Career Switchers", value: "Career Switch" },
  { label: "Fast Promotions", value: "Promotion" },
  { label: "Fresher to Pro", value: "Fresher to Pro" },
];

export function AdminSuccessStoriesPanel({ onBack }: { onBack: () => void }) {
  const { stories, addStory, updateStory, deleteStory, resetToDefaults } = useSuccessStories();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrack, setSelectedTrack] = useState<"All" | Track>("All");
  const [selectedCategory, setSelectedCategory] = useState<"All" | CareerCategory>("All");
  const [onlyWithVideo, setOnlyWithVideo] = useState(false);

  const [activeVideoStory, setActiveVideoStory] = useState<SuccessStoryItem | null>(null);
  const [editingStory, setEditingStory] = useState<SuccessStoryItem | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  const filteredStories = useMemo(() => {
    return stories.filter((story) => {
      const matchTrack = selectedTrack === "All" || story.track === selectedTrack;
      const matchCategory = selectedCategory === "All" || story.category === selectedCategory;
      const matchVideo = !onlyWithVideo || Boolean(story.videoUrl);
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        q === "" ||
        story.name.toLowerCase().includes(q) ||
        story.role.toLowerCase().includes(q) ||
        (story.placedCompany || story.company || "").toLowerCase().includes(q) ||
        story.capstone.toLowerCase().includes(q);

      return matchTrack && matchCategory && matchVideo && matchSearch;
    });
  }, [stories, selectedTrack, selectedCategory, onlyWithVideo, searchQuery]);

  const handleOpenAdd = () => {
    setEditingStory({
      id: "",
      name: "",
      role: "",
      company: "",
      placedCompany: "",
      previousRole: "",
      salaryPackage: "₹18 LPA Tier-1 Offer",
      salaryHike: "150% Hike",
      track: "Full Stack",
      category: "Tier-1 Placement",
      scoreDelta: "65 → 92",
      initialScore: 65,
      finalScore: 92,
      capstone: "",
      quote: "",
      highlightText: "",
      avatar: "",
      videoUrl: "",
      videoDuration: "2m 30s",
      verified: true,
      hiredYear: "2026",
    });
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (story: SuccessStoryItem) => {
    setEditingStory(story);
    setIsEditorOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the success story of ${name}?`)) {
      deleteStory(id);
      showNotice(`Success story for ${name} removed.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notice */}
      {notice && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-2xl border border-emerald-300 bg-emerald-50 px-5 py-3 text-xs font-bold text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/20 dark:text-emerald-200 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{notice}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700/80 dark:bg-surface-elevated dark:text-slate-200 dark:hover:bg-surface-hover transition-colors cursor-pointer"
            aria-label="Back to settings"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Success Stories & Testimonials
              </h2>
              <span className="rounded-full bg-blue-100 dark:bg-blue-950/60 px-2.5 py-0.5 text-[10px] font-extrabold text-[#2563EB] dark:text-blue-400">
                {stories.length} Published
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Manage student placements, alumni testimonials, verified salary packages, and video
              interviews shown on the homepage and student portal.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              if (
                confirm(
                  "Reset all alumni stories to platform defaults? Any custom stories created will be re-seeded."
                )
              ) {
                resetToDefaults();
                showNotice("Success stories reset to defaults.");
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700/80 dark:bg-surface-elevated dark:text-slate-300 dark:hover:bg-surface-hover transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700 hover:scale-[1.02] active:scale-98 transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Success Story</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-surface-secondary">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, company, role, capstone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2 text-xs font-medium text-slate-900 outline-none focus:border-[#2563EB] focus:bg-white dark:border-slate-700/80 dark:bg-input-bg dark:text-white transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Track Filter */}
          <select
            value={selectedTrack}
            onChange={(e) => setSelectedTrack(e.target.value as any)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none dark:border-slate-700 dark:bg-surface-elevated dark:text-slate-300 cursor-pointer"
          >
            {TRACKS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none dark:border-slate-700 dark:bg-surface-elevated dark:text-slate-300 cursor-pointer"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          {/* Video Toggle */}
          <button
            type="button"
            onClick={() => setOnlyWithVideo((v) => !v)}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
              onlyWithVideo
                ? "border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 shadow-xs"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-surface-elevated dark:text-slate-300"
            }`}
          >
            <Video className="h-3.5 w-3.5" />
            <span>Has Video Testimonial</span>
          </button>
        </div>
      </div>

      {/* Stories Grid */}
      {filteredStories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center dark:border-slate-800">
          <Award className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
          <h4 className="mt-3 font-bold text-sm text-slate-900 dark:text-white">
            No alumni stories match your filters
          </h4>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Try adjusting your search query or reset filter settings.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedTrack("All");
              setSelectedCategory("All");
              setOnlyWithVideo(false);
            }}
            className="mt-4 rounded-xl bg-primary-blue px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStories.map((story) => {
            const hasVideo = Boolean(story.videoUrl);

            return (
              <div
                key={story.id}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:border-[#2563EB]/40 hover:shadow-md transition-all dark:border-slate-800 dark:bg-surface-secondary"
              >
                <div>
                  {/* Top Meta Bar */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="rounded-md bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 text-[10px] font-extrabold text-[#2563EB] dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/40">
                        {story.track}
                      </span>
                      <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                        {story.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {hasVideo && (
                        <button
                          type="button"
                          onClick={() => setActiveVideoStory(story)}
                          className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 px-2 py-0.5 text-[10px] font-bold hover:bg-rose-500/20 transition-all cursor-pointer shadow-xs"
                          title="Watch student video testimonial"
                        >
                          <Play className="h-2.5 w-2.5 fill-rose-600 dark:fill-rose-400" />
                          <span>Video</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleOpenEdit(story)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-[#2563EB] hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 transition-colors cursor-pointer"
                        title="Edit story"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(story.id, story.name)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 transition-colors cursor-pointer"
                        title="Delete story"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Student Bio */}
                  <div className="mt-4 flex items-center gap-3">
                    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xs ring-2 ring-blue-500/20 overflow-hidden shadow-xs">
                      {story.avatar ? (
                        <img
                          src={story.avatar}
                          alt={story.name}
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ) : null}
                      <span className={story.avatar ? "sr-only" : ""}>
                        {story.name.slice(0, 2).toUpperCase()}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                          {story.name}
                        </h4>
                        {story.verified && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {story.role}
                      </p>
                    </div>
                  </div>

                  {/* Placement strip */}
                  <div className="mt-3.5 rounded-xl bg-slate-50 dark:bg-surface-elevated p-2.5 border border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                        <Building className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{story.placedCompany || story.company}</span>
                      </span>
                      {story.salaryPackage && (
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400 shrink-0">
                          {story.salaryPackage}
                        </span>
                      )}
                    </div>
                    {story.previousRole && (
                      <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <span>Prev: {story.previousRole}</span>
                        {story.salaryHike && (
                          <span className="font-semibold text-amber-700 dark:text-amber-400">
                            {story.salaryHike}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Video Testimonial prompt strip if present */}
                  {hasVideo && (
                    <div
                      onClick={() => setActiveVideoStory(story)}
                      className="mt-3 flex items-center justify-between rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/20 p-2 text-[11px] font-semibold text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/40 cursor-pointer hover:scale-[1.01] transition-transform"
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <Video className="h-3.5 w-3.5 text-rose-500" />
                        <span>Play Video Testimonial</span>
                        {story.videoDuration && (
                          <span className="text-[10px] text-rose-500">
                            ({story.videoDuration})
                          </span>
                        )}
                      </span>
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-600 text-white">
                        <Play className="h-2.5 w-2.5 fill-white ml-0.5" />
                      </span>
                    </div>
                  )}

                  {/* Student Quote */}
                  <blockquote className="mt-3 text-xs text-slate-600 dark:text-slate-300 line-clamp-3 italic leading-relaxed">
                    &ldquo;{story.quote}&rdquo;
                  </blockquote>
                </div>

                {/* Bottom Card Meta */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                    <TrendingUp className="h-3 w-3" />
                    <span>{story.scoreDelta || "AI Score +28"}</span>
                  </div>
                  <span className="text-slate-400 truncate max-w-[150px]">
                    {story.capstone || "Capstone Project"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Video Modal */}
      <VideoStoryModal
        story={activeVideoStory}
        onClose={() => setActiveVideoStory(null)}
      />

      {/* Admin Story Editor Modal */}
      <AdminStoryEditorModal
        isOpen={isEditorOpen}
        story={editingStory}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingStory(null);
        }}
        onSave={(data, id) => {
          if (id) {
            updateStory(id, data);
            showNotice("Alumni story updated successfully!");
          } else {
            addStory(data);
            showNotice("New alumni success story published!");
          }
          setIsEditorOpen(false);
          setEditingStory(null);
        }}
        onDelete={(id) => {
          deleteStory(id);
          showNotice("Story deleted.");
          setIsEditorOpen(false);
          setEditingStory(null);
        }}
      />
    </div>
  );
}
