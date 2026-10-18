"use client";

import { memo } from "react";
import { Play, Quote } from "lucide-react";
import type { PublicStory } from "@/lib/data/success-stories-api";
import { Avatar, ExpandableText, ProfileLink, TechChips } from "./story-parts";
import { StoryMedia } from "./story-media";
import { Tilt } from "./tilt";
import { useReveal } from "./use-reveal";
import { dateLabel, roleLine } from "./story-utils";

interface Props {
  story: PublicStory;
  onOpen: (s: PublicStory) => void;
}

function Eyebrow({ story, tone }: { story: PublicStory; tone: "light" | "dark" }) {
  const parts = [story.achievementCategory, story.course, dateLabel(story)].filter(Boolean);
  if (parts.length === 0) return null;
  return (
    <p
      className={`text-xs font-semibold uppercase tracking-[0.16em] ${tone === "dark" ? "text-primary-ink dark:text-[#7CB0FF]" : "text-primary-ink"}`}
    >
      {parts.join("  ·  ")}
    </p>
  );
}

function Journey({ story, tone }: { story: PublicStory; tone: "light" | "dark" }) {
  const role = roleLine(story);
  if (!story.previousBackground && !role) return null;
  const muted = tone === "dark" ? "text-text-body dark:text-white/70" : "text-text-body";
  const strong = tone === "dark" ? "text-text-heading dark:text-white" : "text-text-heading";
  return (
    <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
      {story.previousBackground && (
        <div>
          <dt className={`text-xs font-semibold uppercase tracking-wider ${muted}`}>Before</dt>
          <dd className={`mt-0.5 text-sm font-medium ${strong}`}>{story.previousBackground}</dd>
        </div>
      )}
      {role && (
        <div>
          <dt className={`text-xs font-semibold uppercase tracking-wider ${muted}`}>Now</dt>
          <dd className={`mt-0.5 text-sm font-medium ${strong}`}>{role}</dd>
        </div>
      )}
    </dl>
  );
}

/** Wide video story on a dark "screening room" band. Alternates sides by index. */
export const CinematicStory = memo(function CinematicStory({
  story,
  onOpen,
  flip,
  first,
}: Props & { flip?: boolean; first?: boolean }) {
  const [mediaRef, mediaCls] = useReveal<HTMLDivElement>();
  const [textRef, textCls] = useReveal<HTMLDivElement>();
  return (
    <article aria-labelledby={`story-${story.id}`} className="overflow-x-clip bg-white text-text-heading dark:bg-[#0B1F3A] dark:text-white">
      <div
        className={`mx-auto grid max-w-[1320px] items-center gap-8 px-5 py-14 sm:px-8 lg:grid-cols-12 lg:gap-14 lg:px-12 lg:py-24 ${
          first ? "" : "border-t border-border dark:border-white/10"
        }`}
      >
        <div
          ref={mediaRef}
          className={`${mediaCls} lg:col-span-7 ${flip ? "lg:order-2" : ""}`}
        >
          <div className="ss-clip">
          <Tilt max={3.5}>
            <StoryMedia
              story={story}
              onOpen={onOpen}
              pulse
              className="rounded-3xl shadow-[0_40px_80px_-30px_rgba(11,31,58,0.5)] ring-1 ring-black/10 dark:ring-white/15"
            />
          </Tilt>
          </div>
        </div>

        <div
          ref={textRef}
          style={{ "--ss-delay": "0.12s" } as React.CSSProperties}
          className={`${textCls} lg:col-span-5 ${flip ? "lg:order-1" : ""}`}
        >
          <div className={`space-y-6 ${flip ? "ss-slide-l" : "ss-slide-r"}`}>
          <Eyebrow story={story} tone="dark" />
          <h3
            id={`story-${story.id}`}
            className="text-balance text-[clamp(1.6rem,3.2vw,2.6rem)] font-semibold leading-[1.1] tracking-tight"
          >
            {story.title}
          </h3>
          {story.summary && <p className="text-pretty text-base leading-relaxed text-text-body">{story.summary}</p>}

          {story.testimonial && (
            <figure className="border-l-2 border-[#1E5EFF] pl-5">
              <blockquote>
                <ExpandableText
                  text={story.testimonial}
                  className="text-pretty text-[0.95rem] italic leading-relaxed text-text-body"
                  buttonClassName="text-primary-ink"
                />
              </blockquote>
            </figure>
          )}

          <Journey story={story} tone="dark" />
          <TechChips items={story.technologies} tone="dark" />

          <div className="flex items-center gap-3 pt-1">
            <Avatar story={story} size={44} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{story.studentName}</p>
              <ProfileLink url={story.profileUrl} name={story.studentName} className="text-primary-ink" />
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpen(story)}
            className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#0B1F3A] px-5 py-2.5 sm:w-auto text-sm font-semibold text-white transition hover:bg-[#13305a] dark:bg-white dark:text-[#0B1F3A] dark:hover:bg-[#EAF1FF] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-blue/40"
          >
            <Play className="h-4 w-4 fill-current" aria-hidden="true" /> Watch Full Story
            <span className="sr-only">: {story.title}</span>
          </button>
          </div>
        </div>
      </div>
    </article>
  );
});

/** Written story as an editorial pull-quote with a portrait. */
export const QuoteStory = memo(function QuoteStory({ story, flip }: Props & { flip?: boolean }) {
  const [revealRef, revealCls] = useReveal<HTMLElement>();
  const text = story.testimonial || story.summary;
  return (
    <article
      ref={revealRef}
      aria-labelledby={`story-${story.id}`}
      className={`${revealCls} bg-bg-light`}
    >
      <div className="mx-auto grid max-w-[1180px] items-center gap-8 px-5 py-14 sm:px-8 lg:grid-cols-12 lg:gap-14 lg:px-12 lg:py-20">
        <div className={`lg:col-span-4 ${flip ? "lg:order-2" : ""}`}>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[320px] overflow-hidden rounded-[2rem] bg-[#0B1F3A] shadow-xl ring-1 ring-black/5">
            {story.studentPhotoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={story.studentPhotoUrl}
                alt={`Portrait of ${story.studentName}`}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(120%_120%_at_20%_10%,#1E5EFF66,transparent_60%),#0B1F3A]">
                <Avatar story={story} size={112} className="!bg-white/10 !text-white" />
              </div>
            )}
          </div>
        </div>

        <div className={`space-y-6 lg:col-span-8 ${flip ? "lg:order-1" : ""}`}>
          <Eyebrow story={story} tone="light" />
          <Quote className="h-9 w-9 text-primary-blue" aria-hidden="true" />
          <h3 id={`story-${story.id}`} className="sr-only">
            {story.title}
          </h3>
          {text && (
            <blockquote>
              <ExpandableText
                text={text}
                limit={420}
                className="text-pretty text-[clamp(1.2rem,2.2vw,1.75rem)] font-medium leading-snug tracking-tight text-text-heading"
                buttonClassName="text-primary-ink"
              />
            </blockquote>
          )}
          <p className="text-base font-semibold text-text-heading">{story.title}</p>
          <Journey story={story} tone="light" />
          <TechChips items={story.technologies} />
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <p className="text-sm font-semibold text-text-heading">{story.studentName}</p>
            <ProfileLink url={story.profileUrl} name={story.studentName} className="text-primary-ink" />
          </div>
        </div>
      </div>
    </article>
  );
});

/** Compact supporting card for the rest of the collection. */
export const StoryCard = memo(function StoryCard({ story, onOpen, index = 0 }: Props & { index?: number }) {
  const [revealRef, revealCls] = useReveal<HTMLElement>();
  const role = roleLine(story);
  const text = story.summary || story.testimonial;
  return (
    <article
      ref={revealRef}
      aria-labelledby={`story-${story.id}`}
      style={{ "--ss-delay": `${(index % 3) * 0.1}s` } as React.CSSProperties}
      className={`${revealCls} flex flex-col overflow-hidden rounded-3xl border border-border bg-white shadow-sm transition-[box-shadow,translate] duration-300 hover:-translate-y-1.5 hover:shadow-2xl dark:bg-surface-secondary`}
    >
      {story.video ? (
        <StoryMedia story={story} onOpen={onOpen} />
      ) : (
        <div className="flex items-center gap-3 bg-[#0B1F3A] px-5 py-6">
          <Avatar story={story} size={56} />
          <div className="min-w-0 text-white">
            <p className="truncate text-sm font-semibold">{story.studentName}</p>
            {role && <p className="truncate text-xs text-white/75">{role}</p>}
          </div>
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 id={`story-${story.id}`} className="text-lg font-semibold leading-snug tracking-tight text-text-heading">
          {story.title}
        </h3>
        {text && <p className="line-clamp-4 text-sm leading-relaxed text-text-body">{text}</p>}
        <TechChips items={story.technologies.slice(0, 4)} />
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          {story.video ? (
            <p className="min-w-0 truncate text-sm text-text-body">
              <span className="font-semibold text-text-heading">{story.studentName}</span>
              {story.course ? ` · ${story.course}` : ""}
            </p>
          ) : (
            <p className="min-w-0 truncate text-sm text-text-body">{story.course}</p>
          )}
          <ProfileLink url={story.profileUrl} name={story.studentName} className="shrink-0 text-primary-ink" />
        </div>
      </div>
    </article>
  );
});
