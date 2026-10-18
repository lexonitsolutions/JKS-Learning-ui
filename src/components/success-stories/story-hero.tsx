"use client";

import { ArrowDown, Play, Quote } from "lucide-react";
import type { PublicStory } from "@/lib/data/success-stories-api";
import { Avatar } from "./story-parts";
import { StoryMedia } from "./story-media";
import { Tilt } from "./tilt";
import { roleLine } from "./story-utils";

const delay = (s: number) => ({ "--ss-delay": `${s}s` }) as React.CSSProperties;

/** Splits the headline into words that rise in one after another. */
function Words({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <span key={i} className="inline-block [perspective:600px]">
          <span className="ss-word" style={{ "--i": i } as React.CSSProperties}>
            {w}
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}

function FeaturedTile({ story, onOpen }: { story: PublicStory; onOpen: (s: PublicStory) => void }) {
  const meta = roleLine(story);
  return (
    <div className="ss-in relative col-span-2 lg:col-span-4" style={delay(0.2)}>
      <Tilt max={3} className="relative">
        <StoryMedia
          story={story}
          onOpen={onOpen}
          priority
          pulse
          fit="cover"
          aspect="aspect-video sm:aspect-[16/10]"
          className="rounded-2xl shadow-[0_40px_90px_-30px_rgba(11,31,58,0.5)] ring-1 ring-black/10 dark:ring-white/15 sm:rounded-[1.75rem]"
        />
        {/* Below the video on phones so it never covers the picture; floats over it from sm up. */}
        <div className="pointer-events-none mt-3 sm:absolute sm:inset-x-5 sm:bottom-5 sm:z-20 sm:mt-0">
          <div className="flex items-center gap-3 rounded-2xl bg-[#0B1F3A]/90 p-3 pr-4 text-white ring-1 ring-white/15 sm:max-w-[80%] sm:bg-[#0B1F3A]/85 sm:shadow-xl sm:backdrop-blur-sm">
            <Avatar story={story} size={44} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{story.studentName}</p>
              <p className="truncate text-xs text-white/75">{[meta, story.course].filter(Boolean).join(" · ") || story.title}</p>
            </div>
          </div>
        </div>
      </Tilt>
    </div>
  );
}

function QuoteTile({ story }: { story: PublicStory | null }) {
  return (
    <figure
      className="ss-in relative col-span-2 flex flex-col justify-between overflow-hidden rounded-[1.75rem] bg-bg-light p-7 ring-1 ring-border dark:bg-white/[0.06] dark:ring-white/15 sm:min-h-[280px] sm:p-9 lg:col-span-4"
      style={delay(0.2)}
    >
      <div aria-hidden="true" className="ss-float absolute -right-10 -top-10 h-52 w-52 rounded-full bg-[#1E5EFF]/30 blur-3xl" />
      <Quote className="relative h-8 w-8 text-primary-blue" aria-hidden="true" />
      <blockquote className="relative mt-4 text-xl font-medium leading-snug text-text-heading sm:text-2xl">
        {story ? story.summary || story.testimonial : "Our learners' stories are on their way."}
      </blockquote>
      {story && (
        <figcaption className="relative mt-6 flex items-center gap-3">
          <Avatar story={story} size={44} />
          <span className="text-sm font-semibold text-text-heading">{story.studentName}</span>
        </figcaption>
      )}
    </figure>
  );
}

export function StoryHero({
  featured,
  faces,
  total,
  onOpen,
}: {
  featured: PublicStory | null;
  /** Stories whose photos fill the avatar tile. */
  faces: PublicStory[];
  total: number;
  onOpen: (s: PublicStory) => void;
}) {
  const avatarStories = faces.filter((s) => s.studentPhotoUrl).slice(0, 6);

  return (
    <section aria-labelledby="ss-hero-title" className="relative isolate overflow-hidden bg-white text-text-heading dark:bg-[#0B1F3A] dark:text-white">
      <div aria-hidden="true" className="ss-parallax pointer-events-none absolute inset-0 -z-10">
        <div className="ss-float-slow absolute -left-32 top-0 h-[34rem] w-[34rem] rounded-full bg-[#1E5EFF]/15 blur-[120px] dark:bg-[#1E5EFF]/25" />
        <div className="ss-float absolute -right-24 bottom-0 h-[28rem] w-[28rem] rounded-full bg-[#7CB0FF]/25 blur-[120px] dark:bg-[#7CB0FF]/15" />
        <div
          className="absolute inset-0 opacity-[0.06] [filter:invert(1)] dark:opacity-[0.07] dark:[filter:none]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse at 30% 40%, black, transparent 70%)",
          }}
        />
      </div>

      <div className="mx-auto grid max-w-[1320px] items-center gap-8 px-4 pb-12 pt-24 sm:gap-10 sm:px-8 sm:pb-16 sm:pt-32 lg:min-h-[92vh] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14 lg:px-12 lg:pb-24">
        <div className="ss-hero-out">
          <p className="ss-in inline-flex items-center gap-2 rounded-full bg-primary-blue/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary-ink ring-1 ring-primary-blue/20 dark:bg-white/10 dark:text-[#BBD3FF] dark:ring-white/15">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary-blue" /> Success Stories
          </p>
          <h1
            id="ss-hero-title"
            className="mt-5 text-balance text-[clamp(2rem,5.4vw,4.4rem)] font-semibold leading-[1.04] tracking-tight"
          >
            <Words text="Real People. Real Skills. Remarkable Success." />
          </h1>
          <p className="ss-in mt-6 max-w-xl text-pretty text-base leading-relaxed text-text-body sm:text-lg" style={delay(0.16)}>
            Discover how our learners transformed their skills, built their careers, and turned their ambitions into
            achievements.
          </p>

          <div className="ss-in mt-8 flex flex-wrap items-center gap-3" style={delay(0.24)}>
            {featured?.video && (
              <button
                type="button"
                onClick={() => onOpen(featured)}
                className="inline-flex min-h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#0B1F3A] px-6 sm:flex-none py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#13305a] dark:bg-white dark:text-[#0B1F3A] dark:hover:bg-[#EAF1FF] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
              >
                <Play className="h-4 w-4 fill-current" aria-hidden="true" /> Watch Success Story
              </button>
            )}
            {total > 0 && (
              <a
                href="#stories"
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-text-heading ring-1 sm:flex-none ring-border transition hover:bg-bg-light dark:text-white dark:ring-white/30 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
              >
                Browse all stories <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
          </div>

          {avatarStories.length > 0 && (
            <div className="ss-in mt-9 flex items-center gap-4" style={delay(0.32)}>
              <ul className="flex -space-x-3" aria-hidden="true">
                {avatarStories.map((s) => (
                  <li key={s.id}>
                    <Avatar story={s} size={44} className="!ring-[3px] !ring-white dark:!ring-[#0B1F3A]" />
                  </li>
                ))}
              </ul>
              <p className="text-sm leading-snug text-text-body">
                Meet the learners
                <br />
                behind the stories
              </p>
            </div>
          )}
        </div>

        <div className="ss-hero-media grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {featured?.video ? (
            <FeaturedTile story={featured} onOpen={onOpen} />
          ) : (
            <QuoteTile story={featured && (featured.summary || featured.testimonial) ? featured : null} />
          )}

        </div>
      </div>
    </section>
  );
}
