"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Quote, Play, Video } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";
import { Badge } from "@/components/ui/badge";
import { useMediaQuery } from "@/lib/motion/use-media-query";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { queryStories, type PublicStory } from "@/lib/data/success-stories-api";
import type { Testimonial } from "@/lib/data/testimonials";

interface WallItem {
  id: string;
  name: string;
  subtitle: string;
  quote: string;
  avatar?: string | null;
  tag?: string | null;
  hasVideo: boolean;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const fromTestimonial = (t: Testimonial): WallItem => ({
  id: t.id,
  name: t.name,
  subtitle: t.placedCompany || t.role,
  quote: t.quote,
  avatar: t.avatar,
  tag: t.track,
  hasVideo: false,
});

const fromStory = (s: PublicStory): WallItem => ({
  id: s.id,
  name: s.studentName,
  subtitle: [s.currentRole, s.company].filter(Boolean).join(" at ") || s.course || "",
  quote: s.summary || s.testimonial || s.title,
  avatar: s.studentPhotoUrl,
  tag: s.course,
  hasVideo: Boolean(s.video),
});

function TestimonialCard({ item }: { item: WallItem }) {
  return (
    <figure className="relative group w-64 shrink-0 rounded-2xl border border-border dark:border-slate-800/80 bg-white dark:bg-surface-secondary p-5 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <Quote className="h-4 w-4 text-primary-blue/40" aria-hidden="true" />
        {item.hasVideo && (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20 px-2 py-0.5 text-[10px] font-bold">
            <Play className="h-2.5 w-2.5 fill-current" aria-hidden="true" />
            <span>Video</span>
          </span>
        )}
      </div>

      <blockquote className="mt-3 line-clamp-4 text-sm text-text-body">&ldquo;{item.quote}&rdquo;</blockquote>

      {item.hasVideo && (
        <Link
          href="/success-stories#stories"
          className="mt-3 flex items-center justify-between rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50/60 dark:from-blue-950/30 dark:to-indigo-950/20 p-2 text-[11px] font-semibold text-[#2563EB] dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 hover:scale-[1.02] transition-transform"
        >
          <span className="flex items-center gap-1.5 truncate">
            <Video className="h-3.5 w-3.5 text-blue-500" aria-hidden="true" />
            <span>Watch {item.name}&apos;s story</span>
          </span>
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-white">
            <Play className="h-2.5 w-2.5 fill-white ml-0.5" aria-hidden="true" />
          </span>
        </Link>
      )}

      <figcaption className="mt-4 flex items-center gap-3 border-t border-border dark:border-slate-800 pt-4">
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-fill text-body-sm font-semibold text-white overflow-hidden ring-2 ring-blue-500/20 shadow-xs">
          {item.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.avatar}
              alt=""
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : null}
          <span aria-hidden="true" className={item.avatar ? "sr-only" : ""}>
            {initials(item.name)}
          </span>
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-text-heading">{item.name}</div>
          <div className="truncate text-[11px] text-text-body font-medium">{item.subtitle}</div>
        </div>
        {item.tag && (
          <Badge variant="primary" className="ml-auto shrink-0 text-[10px]">
            {item.tag}
          </Badge>
        )}
      </figcaption>
    </figure>
  );
}

/**
 * Homepage wall. Shows real published success stories from the backend; if none
 * exist yet it keeps showing the static testimonials passed in by the page.
 */
export function TestimonialWall({ testimonials: fallback = [] }: { testimonials?: Testimonial[] }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const reducedMotion = useReducedMotion();
  const [real, setReal] = useState<WallItem[]>([]);

  useEffect(() => {
    const ctrl = new AbortController();
    queryStories({ pageSize: 12 }, ctrl.signal)
      .then((page) => setReal(page.items.map(fromStory)))
      .catch(() => undefined);
    return () => ctrl.abort();
  }, []);

  const displayList = useMemo(
    () => (real.length > 0 ? real : fallback.map(fromTestimonial)),
    [real, fallback],
  );
  if (displayList.length === 0) return null;

  const columns = [displayList, [...displayList].reverse(), displayList, [...displayList].reverse()];

  return (
    <div className="space-y-4">
      {reducedMotion ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayList.slice(0, 6).map((t) => (
            <TestimonialCard key={t.id} item={t} />
          ))}
        </div>
      ) : !isDesktop ? (
        <div className="relative overflow-hidden rounded-2xl border border-border dark:border-slate-800/80 bg-bg-light dark:bg-surface py-6">
          <Marquee pauseOnHover repeat={2} className="[--duration:32s]">
            {displayList.map((t) => (
              <TestimonialCard key={t.id} item={t} />
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
              <Marquee key={i} vertical pauseOnHover reverse={i % 2 === 1} repeat={3} className="[--duration:40s]">
                {columnData.map((t, idx) => (
                  <TestimonialCard key={`${i}-${t.id}-${idx}`} item={t} />
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
