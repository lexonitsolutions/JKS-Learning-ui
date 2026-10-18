"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Banknote, Briefcase, CalendarClock, MapPin, Sparkles, Star } from "lucide-react";
import type { EmploymentType, ExperienceLevel, Job, WorkMode } from "@/lib/data/jobs-api";

export const EMPLOYMENT_LABEL: Record<EmploymentType, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  INTERNSHIP: "Internship",
  CONTRACT: "Contract",
  FREELANCE: "Freelance",
};
export const EXPERIENCE_LABEL: Record<ExperienceLevel, string> = {
  FRESHER: "Fresher",
  JUNIOR: "Junior",
  MID: "Mid-level",
  SENIOR: "Senior",
};
export const WORK_MODE_LABEL: Record<WorkMode, string> = {
  REMOTE: "Remote",
  HYBRID: "Hybrid",
  ONSITE: "On-site",
};

export function formatDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? null
    : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function timeAgo(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (Number.isNaN(days)) return null;
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  return formatDate(iso);
}

/** "Closes in 3 days" / "Closes today" / "Expired". Null when there is no deadline. */
export function deadlineLabel(job: Pick<Job, "deadline" | "isExpired">): { text: string; tone: "ok" | "soon" | "expired" } | null {
  if (job.isExpired) return { text: "Expired", tone: "expired" };
  if (!job.deadline) return null;
  const days = Math.ceil((new Date(job.deadline).getTime() - Date.now()) / 86_400_000);
  if (days <= 0) return { text: "Closes today", tone: "soon" };
  if (days <= 3) return { text: `Closes in ${days} day${days === 1 ? "" : "s"}`, tone: "soon" };
  return { text: `Apply by ${formatDate(job.deadline)}`, tone: "ok" };
}

export function CompanyLogo({ name, url, size = 48 }: { name: string; url: string | null; size?: number }) {
  const [broken, setBroken] = useState(false);
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  const box = { width: size, height: size };
  if (url && !broken) {
    return (
      // Employer logos come from arbitrary hosts, so next/image's allow-list does not apply.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={`${name} logo`}
        style={box}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setBroken(true)}
        className="shrink-0 rounded-xl border border-[#E5E7EB] bg-white object-contain p-1.5 dark:border-slate-700"
      />
    );
  }
  return (
    <div
      aria-hidden
      style={box}
      className="flex shrink-0 items-center justify-center rounded-xl bg-[#0B1F3A] text-sm font-bold tracking-wide text-white"
    >
      {initials || "?"}
    </div>
  );
}

function Chip({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "blue" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        tone === "blue"
          ? "bg-[#1E5EFF]/10 text-[#1A52E0] dark:bg-[#1E5EFF]/20 dark:text-blue-300"
          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
      }`}
    >
      {children}
    </span>
  );
}

export function ExpiredBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-rose-700 ring-1 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900/60">
      Expired
    </span>
  );
}

export function JobCard({ job, href, compact = false }: { job: Job; href: string; compact?: boolean }) {
  const deadline = deadlineLabel(job);
  const posted = timeAgo(job.postedAt ?? job.publishedAt);
  return (
    <article
      className={`group relative flex flex-col rounded-2xl border bg-white p-5 shadow-[0_1px_2px_rgba(11,31,58,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-[#1E5EFF]/40 hover:shadow-[0_12px_32px_-12px_rgba(30,94,255,0.25)] dark:bg-surface-elevated ${
        job.isExpired ? "border-[#E5E7EB] opacity-80 dark:border-slate-800" : "border-[#E5E7EB] dark:border-slate-800"
      } ${compact ? "" : "h-full"}`}
    >
      <div className="flex items-start gap-3.5">
        <CompanyLogo name={job.companyName} url={job.companyLogoUrl} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {job.featured && !job.isExpired && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900/60">
                <Star className="h-3 w-3 fill-current" /> Featured
              </span>
            )}
            {job.isExpired && <ExpiredBadge />}
          </div>
          <h3 className="mt-1 line-clamp-2 text-[15px] font-semibold leading-snug text-[#0B1F3A] dark:text-white">
            {job.title}
          </h3>
          <p className="mt-0.5 truncate text-sm text-[#696969] dark:text-slate-400">{job.companyName}</p>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-2 text-[13px] text-[#222222] dark:text-slate-200 sm:grid-cols-2">
        {job.location && (
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#696969] dark:text-slate-400" />
            <dt className="sr-only">Location</dt>
            <dd className="truncate">{job.location}</dd>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Briefcase className="h-3.5 w-3.5 shrink-0 text-[#696969] dark:text-slate-400" />
          <dt className="sr-only">Experience</dt>
          <dd className="truncate">{job.experienceText || EXPERIENCE_LABEL[job.experienceLevel]}</dd>
        </div>
        {job.salaryText && (
          <div className="flex items-center gap-2">
            <Banknote className="h-3.5 w-3.5 shrink-0 text-[#696969] dark:text-slate-400" />
            <dt className="sr-only">Salary or stipend</dt>
            <dd className="truncate">{job.salaryText}</dd>
          </div>
        )}
        {deadline && (
          <div className="flex items-center gap-2">
            <CalendarClock
              className={`h-3.5 w-3.5 shrink-0 ${
                deadline.tone === "soon" ? "text-amber-600" : deadline.tone === "expired" ? "text-rose-600" : "text-[#696969] dark:text-slate-400"
              }`}
            />
            <dt className="sr-only">Deadline</dt>
            <dd
              className={`truncate ${
                deadline.tone === "soon"
                  ? "font-semibold text-amber-700 dark:text-amber-300"
                  : deadline.tone === "expired"
                    ? "font-semibold text-rose-700 dark:text-rose-300"
                    : ""
              }`}
            >
              {deadline.text}
            </dd>
          </div>
        )}
      </dl>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <Chip tone="blue">{EMPLOYMENT_LABEL[job.employmentType]}</Chip>
        <Chip>{WORK_MODE_LABEL[job.workMode]}</Chip>
        <Chip>{job.category}</Chip>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 pt-1">
        <span className="text-xs text-[#696969] dark:text-slate-400">{posted ? `Posted ${posted}` : ""}</span>
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#1E5EFF] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1649CC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E5EFF] after:absolute after:inset-0 after:content-['']"
        >
          View Details <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}

export function JobCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-[#E5E7EB] bg-white p-5 dark:border-slate-800 dark:bg-surface-elevated" aria-hidden>
      <div className="flex gap-3.5">
        <div className="h-12 w-12 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="h-3 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-3 rounded bg-slate-200 dark:bg-slate-800" />
      </div>
      <div className="mt-4 flex gap-2">
        <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="h-6 w-14 rounded-full bg-slate-200 dark:bg-slate-800" />
      </div>
      <div className="mt-6 h-8 w-28 self-end rounded-lg bg-slate-200 dark:bg-slate-800" />
    </div>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-[#CBD5E1] bg-white/60 px-6 py-14 text-center dark:border-slate-700 dark:bg-surface-elevated/60">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1E5EFF]/10 text-[#1E5EFF]">
        <Sparkles className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-[#0B1F3A] dark:text-white">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-[#696969] dark:text-slate-400">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
