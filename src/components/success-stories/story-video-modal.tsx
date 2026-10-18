"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, X } from "lucide-react";
import type { PublicStory } from "@/lib/data/success-stories-api";
import { usePlayback } from "./playback";
import { useIsClient } from "./use-is-client";
import { withParams } from "./story-media";
import { roleLine } from "./story-utils";

const FOCUSABLE = 'a[href],button:not([disabled]),iframe,video[controls],[tabindex]:not([tabindex="-1"])';

function Player({ story, onError }: { story: PublicStory; onError: () => void }) {
  const video = story.video!;
  if (video.kind === "file") {
    return (
      <video
        src={video.src}
        poster={story.thumbnailUrl ?? undefined}
        controls
        autoPlay
        playsInline
        preload="metadata"
        onError={onError}
        controlsList="nodownload"
        className="mx-auto max-h-[72vh] w-auto max-w-full rounded-xl bg-black"
      >
        Your browser cannot play this video.
      </video>
    );
  }
  const src =
    video.kind === "bunny"
      ? withParams(video.embedUrl, { autoplay: "true", muted: "false" })
      : withParams(video.embedUrl, { autoplay: "1", rel: "0" });
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
      <iframe
        src={src}
        title={`${story.title}, video by ${story.studentName}`}
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
}

export function StoryVideoModal({ story, onClose }: { story: PublicStory | null; onClose: () => void }) {
  const { setModalOpen } = usePlayback();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [errorFor, setErrorFor] = useState<string | null>(null);
  const mounted = useIsClient();

  // Scroll lock, background pause, focus in and back out.
  const open = Boolean(story && mounted);
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    setModalOpen(true);
    closeRef.current?.focus();
    return () => {
      html.style.overflow = prevOverflow;
      setModalOpen(false);
      if (opener && document.contains(opener)) opener.focus();
    };
  }, [open, setModalOpen]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  if (!story || !story.video || !mounted) return null;
  const meta = roleLine(story);
  const failed = errorFor === story.id;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ss-modal-title"
      data-lenis-prevent
      onKeyDown={onKeyDown}
      className="fixed inset-0 z-[100] flex items-end justify-center overflow-y-auto overscroll-contain bg-[#050d1a]/90 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={panelRef}
        className="relative w-full max-w-4xl rounded-t-3xl bg-[#0B1F3A] p-4 text-white shadow-2xl ring-1 ring-white/10 sm:rounded-3xl sm:p-6"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close video"
          className="absolute right-3 top-3 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-4 sm:top-4"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="pt-10 sm:pt-8">
          {failed ? (
            <div
              role="alert"
              className="flex aspect-video flex-col items-center justify-center gap-3 rounded-xl bg-black/40 p-6 text-center"
            >
              <AlertTriangle className="h-8 w-8 text-amber-300" aria-hidden="true" />
              <p className="text-sm text-white/85">This video could not be played right now. Please try again later.</p>
            </div>
          ) : (
            <Player story={story} onError={() => setErrorFor(story.id)} />
          )}
        </div>

        <div className="mt-5 pr-2">
          <h2 id="ss-modal-title" className="text-xl font-semibold tracking-tight sm:text-2xl">
            {story.title}
          </h2>
          <p className="mt-1 text-sm text-white/75">
            {story.studentName}
            {meta ? ` · ${meta}` : ""}
            {story.course ? ` · ${story.course}` : ""}
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
