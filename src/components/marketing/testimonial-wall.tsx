"use client";

import { useState } from "react";
import { Quote, Play, Video, Plus, Edit2, Sparkles, Award } from "lucide-react";
import Link from "next/link";
import { Marquee } from "@/components/ui/marquee";
import { Badge } from "@/components/ui/badge";
import { useMediaQuery } from "@/lib/motion/use-media-query";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { useSuccessStories, type SuccessStoryItem } from "@/lib/data/success-stories-store";
import { VideoStoryModal } from "./video-story-modal";
import { AdminStoryEditorModal } from "./admin-story-editor-modal";
import { useMockSession } from "@/lib/auth/use-mock-auth";
import { useUser } from "@clerk/nextjs";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function TestimonialCard({
  testimonial,
  onPlayVideo,
  onEdit,
  isAdmin,
}: {
  testimonial: SuccessStoryItem;
  onPlayVideo?: (story: SuccessStoryItem) => void;
  onEdit?: (story: SuccessStoryItem) => void;
  isAdmin?: boolean;
}) {
  const hasVideo = Boolean(testimonial.videoUrl);

  return (
    <figure className="relative group w-64 shrink-0 rounded-2xl border border-border dark:border-slate-800/80 bg-white dark:bg-surface-secondary p-5 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Top Row: Quote Icon & Video Badge or Admin Edit */}
      <div className="flex items-center justify-between">
        <Quote className="h-4 w-4 text-primary-blue/40" />

        <div className="flex items-center gap-1.5">
          {hasVideo && (
            <button
              type="button"
              onClick={() => onPlayVideo?.(testimonial)}
              className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 px-2 py-0.5 text-[10px] font-bold hover:bg-rose-500/20 transition-all cursor-pointer"
              title="Watch video testimonial"
            >
              <Play className="h-2.5 w-2.5 fill-current" />
              <span>Video</span>
            </button>
          )}

          {isAdmin && onEdit && (
            <button
              type="button"
              onClick={() => onEdit(testimonial)}
              className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-500 hover:text-blue-600 dark:bg-slate-800 dark:hover:bg-blue-950/60 dark:text-slate-400 dark:hover:text-blue-300 transition-colors cursor-pointer"
              title="Admin: Edit this story"
            >
              <Edit2 className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      <blockquote className="mt-3 line-clamp-4 text-sm text-text-body">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      {/* Video prompt strip if story has video */}
      {hasVideo && (
        <div
          onClick={() => onPlayVideo?.(testimonial)}
          className="mt-3 flex items-center justify-between rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50/60 dark:from-blue-950/30 dark:to-indigo-950/20 p-2 text-[11px] font-semibold text-[#2563EB] dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 cursor-pointer hover:scale-[1.02] transition-transform"
        >
          <span className="flex items-center gap-1.5 truncate">
            <Video className="h-3.5 w-3.5 text-blue-500" />
            <span>Watch Student Story</span>
          </span>
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-white">
            <Play className="h-2.5 w-2.5 fill-white ml-0.5" />
          </span>
        </div>
      )}

      <figcaption className="mt-4 flex items-center gap-3 border-t border-border dark:border-slate-800 pt-4">
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-fill text-body-sm font-semibold text-white overflow-hidden ring-2 ring-blue-500/20 shadow-xs">
          {testimonial.avatar ? (
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : null}
          <span className={testimonial.avatar ? "sr-only" : ""}>{initials(testimonial.name)}</span>
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-text-heading">
            {testimonial.name}
          </div>
          <div className="truncate text-[11px] text-text-body font-medium">
            {testimonial.placedCompany || testimonial.role}
          </div>
        </div>
        <Badge variant="primary" className="ml-auto shrink-0 text-[10px]">
          {testimonial.track}
        </Badge>
      </figcaption>
    </figure>
  );
}

export function TestimonialWall({
  testimonials: initialTestimonials,
}: {
  testimonials?: SuccessStoryItem[];
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const reducedMotion = useReducedMotion();
  const { stories, addStory, updateStory, deleteStory } = useSuccessStories();

  const session = useMockSession();
  const { user: clerkUser } = useUser();
  const email = (
    clerkUser?.primaryEmailAddress?.emailAddress ||
    clerkUser?.emailAddresses?.[0]?.emailAddress ||
    session?.email ||
    ""
  ).toLowerCase().trim();
  const isAdmin = email === "lexonitservices@gmail.com" || session?.role === "admin";

  const [activeVideoStory, setActiveVideoStory] = useState<SuccessStoryItem | null>(null);
  const [editingStory, setEditingStory] = useState<SuccessStoryItem | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const displayList = stories.length > 0 ? stories : initialTestimonials || [];

  const handleEdit = (story: SuccessStoryItem) => {
    setEditingStory(story);
    setIsEditorOpen(true);
  };

  const handleAddNew = () => {
    setEditingStory(null);
    setIsEditorOpen(true);
  };

  const handleSaveStory = (storyData: Omit<SuccessStoryItem, "id">, id?: string) => {
    if (id) {
      updateStory(id, storyData);
    } else {
      addStory(storyData);
    }
  };

  const columns = [
    displayList,
    [...displayList].reverse(),
    displayList,
    [...displayList].reverse(),
  ];

  return (
    <div className="space-y-4">
      {/* Admin Action Bar (Only visible when Admin is logged in) */}
      {isAdmin && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 p-3 sm:px-4">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-ping" />
            <span className="text-xs font-bold text-blue-950 dark:text-blue-200">
              Admin Mode: Success Stories Editor
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddNew}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Student Story</span>
            </button>

            <Link
              href="/admin/settings"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-surface px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors"
            >
              <span>Manage in Settings</span>
            </Link>
          </div>
        </div>
      )}

      {/* Video Modal Player */}
      <VideoStoryModal
        story={activeVideoStory}
        onClose={() => setActiveVideoStory(null)}
      />

      {/* Admin Story Editor Modal */}
      <AdminStoryEditorModal
        isOpen={isEditorOpen}
        story={editingStory}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveStory}
        onDelete={(id) => deleteStory(id)}
      />

      {reducedMotion ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayList.slice(0, 6).map((t) => (
            <TestimonialCard
              key={t.id || t.name}
              testimonial={t}
              onPlayVideo={setActiveVideoStory}
              onEdit={handleEdit}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      ) : !isDesktop ? (
        <div className="relative overflow-hidden rounded-2xl border border-border dark:border-slate-800/80 bg-bg-light dark:bg-surface py-6">
          <Marquee pauseOnHover repeat={2} className="[--duration:32s]">
            {displayList.map((t) => (
              <TestimonialCard
                key={t.id || t.name}
                testimonial={t}
                onPlayVideo={setActiveVideoStory}
                onEdit={handleEdit}
                isAdmin={isAdmin}
              />
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-bg-light dark:from-surface to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-bg-light dark:from-surface to-transparent" />
        </div>
      ) : (
        <div
          aria-label="Student testimonials"
          className="relative flex h-[440px] w-full items-center justify-center overflow-hidden rounded-3xl border border-border dark:border-slate-800/80 bg-bg-light dark:bg-surface [perspective:300px]"
        >
          <div
            className="flex flex-row items-center gap-4"
            style={{
              transform:
                "translateX(-40px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)",
            }}
          >
            {columns.map((columnData, i) => (
              <Marquee
                key={i}
                vertical
                pauseOnHover
                reverse={i % 2 === 1}
                repeat={3}
                className="[--duration:40s]"
              >
                {columnData.map((t, idx) => (
                  <TestimonialCard
                    key={`${i}-${t.id || t.name}-${idx}`}
                    testimonial={t}
                    onPlayVideo={setActiveVideoStory}
                    onEdit={handleEdit}
                    isAdmin={isAdmin}
                  />
                ))}
              </Marquee>
            ))}

            <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-bg-light dark:from-surface" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-bg-light dark:from-surface" />
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-bg-light dark:from-surface" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-bg-light dark:from-surface" />
          </div>
        </div>
      )}
    </div>
  );
}
