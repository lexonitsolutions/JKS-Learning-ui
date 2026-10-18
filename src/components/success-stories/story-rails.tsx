"use client";

import { useRef } from "react";
import { ArrowDown, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import type { PublicStory } from "@/lib/data/success-stories-api";
import { Marquee } from "@/components/ui/marquee";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { Avatar } from "./story-parts";
import { useReveal } from "./use-reveal";
import { dateLabel, roleLine } from "./story-utils";

/** "From → Now": every story that has both a starting point and an outcome, as a swipeable rail. */
export function TransitionRail({ stories }: { stories: PublicStory[] }) {
  const [revealRef, revealCls] = useReveal<HTMLDivElement>();
  const scroller = useRef<HTMLUListElement>(null);
  const items = stories.filter((s) => s.previousBackground && roleLine(s));
  if (items.length < 2) return null;

  const scrollBy = (dir: -1 | 1) =>
    scroller.current?.scrollBy({ left: dir * 320, behavior: "smooth" });

  return (
    <section aria-labelledby="ss-rail-title" className="bg-white py-16 dark:bg-surface lg:py-24">
      <div ref={revealRef} className={`${revealCls} mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12`}>
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="ss-bar mb-5" aria-hidden="true" />
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-ink">Career transitions</p>
            <h2
              id="ss-rail-title"
              className="mt-3 text-balance text-[clamp(1.75rem,3.6vw,2.9rem)] font-semibold leading-[1.08] tracking-tight text-text-heading"
            >
              Where they started. Where they are now.
            </h2>
          </div>
          <div className="hidden gap-2 sm:flex">
            {([-1, 1] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => scrollBy(d)}
                aria-label={d === -1 ? "Scroll transitions left" : "Scroll transitions right"}
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-border text-text-heading transition hover:bg-bg-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue"
              >
                {d === -1 ? <ChevronLeft className="h-5 w-5" aria-hidden="true" /> : <ChevronRight className="h-5 w-5" aria-hidden="true" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ul
        ref={scroller}
        tabIndex={0}
        aria-label="Career transitions, scroll horizontally"
        className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-5 pb-4 [scrollbar-width:none] sm:gap-5 sm:px-8 lg:px-[max(3rem,calc((100vw-1320px)/2+3rem))] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((s) => (
          <li
            key={s.id}
            className="group/t w-[84%] shrink-0 snap-start rounded-3xl border border-border bg-bg-light p-5 transition-[translate,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-xl sm:w-[320px] dark:bg-surface-secondary"
          >
            <div className="flex items-center gap-3">
              <Avatar story={s} size={44} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-text-heading">{s.studentName}</p>
                <p className="truncate text-xs text-text-body">{[s.course, dateLabel(s)].filter(Boolean).join(" · ")}</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-white p-4 dark:bg-surface">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-text-body">Before</p>
              <p className="mt-1 text-sm font-medium text-text-heading">{s.previousBackground}</p>
            </div>
            <div className="relative z-10 -my-3 flex justify-center" aria-hidden="true">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1E5EFF] text-white shadow-md transition-transform duration-500 group-hover/t:translate-y-1">
                <ArrowDown className="h-4 w-4" />
              </span>
            </div>
            <div className="rounded-2xl bg-[#0B1F3A] p-4 text-white">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#7CB0FF]">Now</p>
              <p className="mt-1 text-sm font-medium">{roleLine(s)}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Written words from learners, drifting in two opposing rows (static grid under reduced motion). */
export function VoicesWall({ stories }: { stories: PublicStory[] }) {
  const reduced = useReducedMotion();
  const items = stories.filter((s) => s.testimonial || s.summary).slice(0, 12);
  if (items.length < 3) return null;
  const half = Math.ceil(items.length / 2);
  const rows = [items.slice(0, half), items.slice(half).length ? items.slice(half) : items];

  const card = (s: PublicStory) => (
    <figure
      key={s.id}
      className="flex w-[300px] shrink-0 flex-col justify-between rounded-3xl border border-border bg-white p-6 text-text-heading shadow-sm sm:w-[360px] dark:border-white/10 dark:bg-white/[0.05] dark:text-white"
    >
      <Quote className="h-6 w-6 text-primary-blue" aria-hidden="true" />
      <blockquote className="mt-4 line-clamp-5 text-[0.95rem] leading-relaxed text-text-body">
        {s.testimonial || s.summary}
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <Avatar story={s} size={40} />
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold">{s.studentName}</span>
          <span className="block truncate text-xs text-text-body">{roleLine(s) ?? s.course}</span>
        </span>
      </figcaption>
    </figure>
  );

  return (
    <section aria-labelledby="ss-voices-title" className="overflow-hidden bg-bg-light py-16 dark:bg-[#0B1F3A] lg:py-24">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
        <span className="ss-bar mb-5" aria-hidden="true" />
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-ink">Voices</p>
        <h2
          id="ss-voices-title"
          className="mt-3 max-w-2xl text-balance text-[clamp(1.75rem,3.6vw,2.9rem)] font-semibold leading-[1.08] tracking-tight text-text-heading"
        >
          What learners say about the journey
        </h2>
      </div>

      {reduced ? (
        <div className="mx-auto mt-10 grid max-w-[1320px] gap-4 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-3 lg:px-12">
          {items.slice(0, 6).map(card)}
        </div>
      ) : (
        <div className="mt-10 space-y-4">
          {rows.map((row, i) => (
            <Marquee key={i} pauseOnHover reverse={i === 1} repeat={3} className="[--duration:60s]">
              {row.map(card)}
            </Marquee>
          ))}
        </div>
      )}
    </section>
  );
}
