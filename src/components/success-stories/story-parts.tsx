"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { PublicStory } from "@/lib/data/success-stories-api";
import { initials } from "./story-utils";

export function Avatar({
  story,
  size = 48,
  className = "",
}: {
  story: Pick<PublicStory, "studentName" | "studentPhotoUrl">;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const style = { width: size, height: size };
  if (story.studentPhotoUrl && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={story.studentPhotoUrl}
        alt=""
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        style={style}
        className={`shrink-0 rounded-full object-cover ring-2 ring-white/60 ${className}`}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      style={{ ...style, fontSize: size * 0.36 }}
      className={`flex shrink-0 items-center justify-center rounded-full bg-[#1E5EFF]/15 font-semibold text-[#1E5EFF] ring-2 ring-white/60 ${className}`}
    >
      {initials(story.studentName)}
    </span>
  );
}

export function TechChips({ items, tone = "light" }: { items: string[]; tone?: "light" | "dark" }) {
  if (items.length === 0) return null;
  const cls =
    tone === "dark"
      ? "bg-white/10 text-white/90 ring-white/15"
      : "bg-primary-blue/10 text-primary-ink ring-primary-blue/15";
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
      {items.slice(0, 8).map((t) => (
        <li key={t} className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${cls}`}>
          {t}
        </li>
      ))}
    </ul>
  );
}

/** Long testimonials collapse to a few lines; nothing is ever cut off without a way to read it. */
export function ExpandableText({
  text,
  limit = 260,
  className = "",
  buttonClassName = "",
}: {
  text: string;
  limit?: number;
  className?: string;
  buttonClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const long = text.length > limit;
  return (
    <div>
      <p className={`${className} ${long && !open ? "line-clamp-5" : ""} whitespace-pre-line`}>{text}</p>
      {long && (
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={`mt-2 cursor-pointer text-sm font-semibold underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue ${buttonClassName}`}
        >
          {open ? "Show less" : "Read the full story"}
        </button>
      )}
    </div>
  );
}

export function ProfileLink({ url, name, className = "" }: { url: string | null; name: string; className?: string }) {
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 text-sm font-semibold underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue ${className}`}
    >
      View {name}&apos;s profile <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
