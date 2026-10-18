"use client";

import { memo, useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import type { PublicStory } from "@/lib/data/success-stories-api";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { usePlayback } from "./playback";
import { initials, playLabel } from "./story-utils";

/** Adds query params to an embed URL without clobbering existing ones. */
export function withParams(url: string, params: Record<string, string>) {
  try {
    const u = new URL(url);
    for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
    return u.toString();
  } catch {
    return url;
  }
}

function saveDataOn() {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return Boolean(c?.saveData);
}

export function InlinePlayer({
  story,
  onFail,
  fit = "contain",
}: {
  story: PublicStory;
  onFail: () => void;
  /** "cover" fills tall portrait boxes (cards); "contain" never crops. */
  fit?: "contain" | "cover";
}) {
  const video = story.video!;
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Autoplay can still be refused (battery saver, policy): fall back to poster + button.
    ref.current?.play()?.catch(onFail);
  }, [onFail]);

  if (video.kind === "file") {
    return (
      <video
        ref={ref}
        src={video.src}
        poster={story.thumbnailUrl ?? undefined}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        onError={onFail}
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full bg-black ${fit === "cover" ? "object-cover" : "object-contain"}`}
      />
    );
  }
  const src =
    video.kind === "bunny"
      ? video.inlineEmbedUrl
      : withParams(video.embedUrl, {
          autoplay: "1",
          mute: "1",
          muted: "1",
          controls: "0",
          rel: "0",
          playsinline: "1",
          modestbranding: "1",
          iv_load_policy: "3",
          disablekb: "1",
        });
  return (
    <iframe
      src={src}
      title={`Preview of ${story.title}`}
      allow="autoplay; encrypted-media"
      tabIndex={-1}
      aria-hidden="true"
      className={`pointer-events-none absolute border-0 bg-black ${
        fit === "cover" ? "left-1/2 top-0 aspect-video h-full -translate-x-1/2" : "inset-0 h-full w-full"
      }`}
    />
  );
}

interface StoryMediaProps {
  story: PublicStory;
  onOpen: (story: PublicStory) => void;
  className?: string;
  /** Load the poster immediately (first screen) instead of lazily. */
  priority?: boolean;
  /** Tailwind aspect utility. */
  aspect?: string;
  /** Soft expanding ring on the play button to invite the first click. */
  pulse?: boolean;
  /** How the inline preview fills the frame; "cover" removes letterbox bars. */
  fit?: "contain" | "cover";
}

/**
 * Poster + play affordance for a video story. When the admin enabled inline
 * autoplay, a muted preview starts once 60% of the tile is visible and is torn
 * down (not just paused) when it leaves, so off-screen videos cost no bandwidth.
 * Clicking anywhere opens the full player.
 */
export const StoryMedia = memo(function StoryMedia({
  story,
  onOpen,
  className = "",
  priority = false,
  aspect = "aspect-video",
  pulse = false,
  fit = "contain",
}: StoryMediaProps) {
  const { activeId, modalOpen, claim, release } = usePlayback();
  const reduced = useReducedMotion();
  const boxRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [failed, setFailed] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const canAutoplay = story.inlineAutoplay && !!story.video && !reduced && !failed && !modalOpen;

  useEffect(() => {
    const el = boxRef.current;
    if (!el || !canAutoplay || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.intersectionRatio >= 0.6) setVisible(!saveDataOn());
        else if (e.intersectionRatio < 0.3) setVisible(false);
      },
      { threshold: [0, 0.3, 0.6] },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      setVisible(false);
    };
  }, [canAutoplay]);

  // Take the slot when visible and free; give it back the moment we leave.
  useEffect(() => {
    if (!canAutoplay) return;
    if (visible && activeId === null) claim(story.id);
    if (!visible) release(story.id);
  }, [canAutoplay, visible, activeId, claim, release, story.id]);

  useEffect(() => () => release(story.id), [release, story.id]);

  useEffect(() => {
    const onHide = () => document.hidden && release(story.id);
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, [release, story.id]);

  const playing = canAutoplay && visible && activeId === story.id;
  const showImg = story.thumbnailUrl && !imgFailed;

  return (
    <div
      ref={boxRef}
      className={`group/media relative isolate overflow-hidden bg-[#0B1F3A] ${aspect} ${className}`}
    >
      {showImg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={story.thumbnailUrl!}
          alt=""
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          onError={() => setImgFailed(true)}
          className="ss-img-par absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover/media:scale-[1.04]"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(120%_120%_at_20%_10%,#1E5EFF55,transparent_55%),#0B1F3A]"
        >
          <span className="text-5xl font-semibold tracking-tight text-white/25">{initials(story.studentName)}</span>
        </div>
      )}

      {playing && <InlinePlayer story={story} fit={fit} onFail={() => setFailed(true)} />}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/80 via-[#0B1F3A]/10 to-transparent"
      />
      {/* One soft light sweep across the frame on hover. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -translate-x-full skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-[1100ms] ease-out group-hover/media:translate-x-[300%]"
      />

      <button
        type="button"
        onClick={() => onOpen(story)}
        aria-label={playLabel(story)}
        className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-white/90"
      >
        <span className="relative flex items-center justify-center">
          {pulse && !playing && (
            <span aria-hidden="true" className="ss-ring absolute h-16 w-16 rounded-full bg-white/60 sm:h-[72px] sm:w-[72px]" />
          )}
        <span
          className={`relative flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#1E5EFF] shadow-[0_10px_40px_rgba(0,0,0,0.35)] transition duration-300 group-hover/media:scale-110 sm:h-[72px] sm:w-[72px] ${
            playing ? "opacity-0 group-hover/media:opacity-100 group-focus-within/media:opacity-100" : ""
          }`}
        >
          <Play className="ml-1 h-6 w-6 fill-current sm:h-7 sm:w-7" aria-hidden="true" />
        </span>
        </span>
      </button>

      {story.video?.durationLabel && (
        <span className="pointer-events-none absolute bottom-3 right-3 z-20 rounded-md bg-black/70 px-2 py-1 text-xs font-medium tabular-nums text-white">
          {story.video.durationLabel}
        </span>
      )}
      {failed && story.inlineAutoplay && (
        <span className="sr-only">Autoplay was blocked by your browser. Use the play button to watch.</span>
      )}
    </div>
  );
});
