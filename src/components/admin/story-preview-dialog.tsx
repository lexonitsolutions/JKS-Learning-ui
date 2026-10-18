"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { PublicStory } from "@/lib/data/success-stories-api";
import { PlaybackProvider } from "@/components/success-stories/playback";
import { CinematicStory, QuoteStory, StoryCard } from "@/components/success-stories/story-sections";
import { StoryVideoModal } from "@/components/success-stories/story-video-modal";
import { useIsClient } from "@/components/success-stories/use-is-client";

/**
 * Renders a story with the exact public components, so what the admin previews
 * is what visitors get. Works for unsaved drafts (the story is built from form state).
 */
export function StoryPreviewDialog({ story, onClose }: { story: PublicStory | null; onClose: () => void }) {
  const mounted = useIsClient();
  const [playing, setPlaying] = useState<PublicStory | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!story) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      html.style.overflow = prev;
    };
  }, [story]);

  if (!story || !mounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Preview of ${story.studentName}'s story`}
      data-lenis-prevent
      onKeyDown={(e) => e.key === "Escape" && !playing && onClose()}
      className="fixed inset-0 z-[90] overflow-y-auto overscroll-contain bg-slate-100 dark:bg-slate-950"
    >
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          Preview <span className="font-normal text-slate-500">· exactly as visitors will see it</span>
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <X className="h-4 w-4" aria-hidden="true" /> Close preview
        </button>
      </div>

      <PlaybackProvider>
        <div className="pb-16">
          <p className="px-5 pt-6 text-xs font-semibold uppercase tracking-wider text-slate-500">Story section</p>
          <div className="mt-3">
            {story.video ? (
              <CinematicStory story={story} onOpen={setPlaying} first />
            ) : (
              <QuoteStory story={story} onOpen={setPlaying} />
            )}
          </div>
          <p className="px-5 pt-10 text-xs font-semibold uppercase tracking-wider text-slate-500">Collection card</p>
          <div className="mx-auto mt-3 max-w-md px-5">
            <StoryCard story={story} onOpen={setPlaying} />
          </div>
        </div>
        <StoryVideoModal story={playing} onClose={() => setPlaying(null)} />
      </PlaybackProvider>
    </div>,
    document.body,
  );
}
