"use client";

import { memo, useEffect, useRef, useState } from "react";
import { Play, Quote } from "lucide-react";
import type { PublicStory } from "@/lib/data/success-stories-api";
import { useMediaQuery } from "@/lib/motion/use-media-query";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { usePlayback } from "./playback";
import { InlinePlayer } from "./story-media";
import { Tilt } from "./tilt";
import { useReveal } from "./use-reveal";
import { dateLabel, initials, playLabel, roleLine } from "./story-utils";

/**
 * "More stories" card. At rest it is a profile: portrait, name, role and course.
 * A video story plays a muted preview on hover or keyboard focus (desktop), or
 * while it is centred in the swipe carousel (touch); it never preloads video.
 */
export const ProfileCard = memo(function ProfileCard({
  story,
  onOpen,
  index = 0,
}: {
  story: PublicStory;
  onOpen: (s: PublicStory) => void;
  index?: number;
}) {
  const { activeId, modalOpen, claim, release } = usePlayback();
  const reduced = useReducedMotion();
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const [revealRef, revealCls] = useReveal<HTMLElement>();
  const boxRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const [inView, setInView] = useState(false);
  const [failed, setFailed] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const hasVideo = Boolean(story.video);
  const photo = !imgFailed ? story.studentPhotoUrl || story.thumbnailUrl : null;
  const role = roleLine(story);
  const when = dateLabel(story);
  const text = story.summary || story.testimonial;

  // Touch devices have no hover: preview the card that is centred in the carousel instead.
  const wantsPlay =
    hasVideo && !reduced && !failed && !modalOpen && (canHover ? hover : story.inlineAutoplay && inView);

  useEffect(() => {
    const el = boxRef.current;
    if (!el || canHover || !hasVideo || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.intersectionRatio >= 0.7) setInView(true);
        else if (e.intersectionRatio < 0.4) setInView(false);
      },
      { threshold: [0, 0.4, 0.7] },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      setInView(false);
    };
  }, [canHover, hasVideo]);

  useEffect(() => {
    if (wantsPlay && activeId !== story.id && (canHover || activeId === null)) claim(story.id);
    if (!wantsPlay) release(story.id);
  }, [wantsPlay, activeId, canHover, claim, release, story.id]);

  useEffect(() => () => release(story.id), [release, story.id]);

  const playing = wantsPlay && activeId === story.id;

  return (
    <article
      ref={revealRef}
      aria-labelledby={`pc-${story.id}`}
      style={{ "--ss-delay": `${(index % 4) * 0.08}s` } as React.CSSProperties}
      className={`${revealCls} w-[78%] shrink-0 snap-center sm:w-auto sm:shrink`}
    >
      <Tilt max={3}>
        <div
          ref={boxRef}
          onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
          onPointerLeave={() => setHover(false)}
          onFocus={() => setHover(true)}
          onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setHover(false)}
          className="group/card relative aspect-[3/4] overflow-hidden rounded-[1.75rem] bg-[#0B1F3A] shadow-[0_18px_40px_-18px_rgba(11,31,58,0.55)] ring-1 ring-black/5 transition-shadow duration-500 hover:shadow-[0_30px_60px_-20px_rgba(11,31,58,0.7)]"
        >
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt=""
              loading="lazy"
              decoding="async"
              onError={() => setImgFailed(true)}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.06]"
            />
          ) : (
            <div
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(120%_100%_at_20%_0%,#1E5EFF66,transparent_60%),#0B1F3A]"
            >
              <span className="text-7xl font-semibold tracking-tight text-white/20">{initials(story.studentName)}</span>
            </div>
          )}

          {playing && (
            <div className="absolute inset-0 animate-[ss-rise_0.5s_ease-out_both]">
              <InlinePlayer story={story} fit="cover" onFail={() => setFailed(true)} />
            </div>
          )}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06101f]/95 via-[#06101f]/35 to-[#06101f]/10"
          />

          <div className="pointer-events-none absolute inset-x-4 top-4 flex items-start justify-between gap-2">
            {when || story.achievementCategory ? (
              <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold tracking-wide text-white backdrop-blur-sm">
                {story.achievementCategory ?? when}
              </span>
            ) : (
              <span />
            )}
            {hasVideo ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold tabular-nums text-[#0B1F3A]">
                <Play className="h-3 w-3 fill-current" aria-hidden="true" />
                {story.video?.durationLabel ?? "Video"}
              </span>
            ) : (
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm">
                <Quote className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            )}
          </div>

          {hasVideo && (
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute left-1/2 top-[38%] flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#1E5EFF] shadow-xl transition duration-300 ${
                playing ? "scale-75 opacity-0" : "scale-90 opacity-0 group-hover/card:scale-100 group-hover/card:opacity-100 [@media(hover:none)]:scale-100 [@media(hover:none)]:opacity-100"
              }`}
            >
              <Play className="ml-0.5 h-5 w-5 fill-current" />
            </span>
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 text-white">
            <h3 id={`pc-${story.id}`} className="text-xl font-semibold leading-tight tracking-tight">
              {story.studentName}
            </h3>
            {role && <p className="mt-1 text-sm text-white/85">{role}</p>}
            {story.course && (
              <p className="mt-2 inline-block rounded-full bg-[#1E5EFF] px-2.5 py-1 text-[11px] font-semibold">
                {story.course}
              </p>
            )}

            {/* Details tuck away while the preview plays; written stories reveal their quote on hover. */}
            <div
              className={`grid transition-[grid-template-rows,opacity] duration-500 ${
                hasVideo
                  ? playing
                    ? "grid-rows-[0fr] opacity-0"
                    : "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0 group-hover/card:grid-rows-[1fr] group-hover/card:opacity-100 group-focus-within/card:grid-rows-[1fr] group-focus-within/card:opacity-100 [@media(hover:none)]:grid-rows-[1fr] [@media(hover:none)]:opacity-100"
              }`}
            >
              <div className="overflow-hidden">
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/80">{hasVideo ? story.title : text}</p>
                {story.technologies.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Technologies">
                    {story.technologies.slice(0, 3).map((t) => (
                      <li key={t} className="rounded-full bg-white/12 px-2 py-0.5 text-[11px] text-white/85 ring-1 ring-white/15">
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {hasVideo && (
            <button
              type="button"
              onClick={() => onOpen(story)}
              aria-label={playLabel(story)}
              className="absolute inset-0 z-10 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-white/90"
            />
          )}
        </div>
      </Tilt>
    </article>
  );
});
