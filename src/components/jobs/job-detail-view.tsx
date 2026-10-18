"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Banknote,
  Briefcase,
  CalendarClock,
  Check,
  ExternalLink,
  GraduationCap,
  Link2,
  MapPin,
  MessageSquare,
  Share2,
} from "lucide-react";
import type { Job } from "@/lib/data/jobs-api";
import {
  CompanyLogo,
  EMPLOYMENT_LABEL,
  EXPERIENCE_LABEL,
  ExpiredBadge,
  WORK_MODE_LABEL,
  deadlineLabel,
  formatDate,
} from "./job-ui";

const SOURCE_LABEL = { WHATSAPP: "WhatsApp group", TELEGRAM: "Telegram channel", WEBSITE: "Website", OTHER: "Other source" } as const;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5 dark:border-slate-800 dark:bg-surface-elevated sm:p-6">
      <h2 className="text-sm font-bold uppercase tracking-wide text-[#0B1F3A] dark:text-white">{title}</h2>
      <div className="mt-3 text-sm leading-relaxed text-[#222222] dark:text-slate-200">{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((t, i) => (
        <li key={i} className="flex gap-2.5">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1E5EFF]" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

function Fact({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#696969] dark:text-slate-400" />
      <div className="min-w-0">
        <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#696969] dark:text-slate-400">{label}</dt>
        <dd className="break-words text-sm font-medium text-[#222222] dark:text-white">{value}</dd>
      </div>
    </div>
  );
}

/** Used by the student job page and by the admin preview, so both show the same thing. */
export function JobDetailView({ job, preview = false }: { job: Job; preview?: boolean }) {
  const [copied, setCopied] = useState(false);
  const deadline = deadlineLabel(job);
  const external = job.applicationMode === "EXTERNAL";

  async function share() {
    const url = window.location.href;
    const text = `${job.title} at ${job.companyName}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: text, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* the user dismissed the share sheet */
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-5">
        <header className="rounded-2xl border border-[#E5E7EB] bg-white p-5 dark:border-slate-800 dark:bg-surface-elevated sm:p-6">
          <div className="flex items-start gap-4">
            <CompanyLogo name={job.companyName} url={job.companyLogoUrl} size={60} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                {job.isExpired && <ExpiredBadge />}
                {preview && job.status !== "PUBLISHED" && (
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold uppercase text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {job.status}
                  </span>
                )}
              </div>
              <h1 className="mt-1 text-xl font-bold leading-tight text-[#0B1F3A] dark:text-white sm:text-2xl">{job.title}</h1>
              <p className="mt-1 text-sm text-[#696969] dark:text-slate-400">
                {job.companyName} · {job.category}
              </p>
            </div>
          </div>
          {job.isExpired && (
            <div role="status" className="mt-4 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                This opportunity has expired{job.deadline ? ` (deadline ${formatDate(job.deadline)})` : ""} and is no longer accepting applications.
              </span>
            </div>
          )}
        </header>

        <Section title="About the role">
          <p className="whitespace-pre-line">{job.description || "No description provided."}</p>
        </Section>
        {job.responsibilities.length > 0 && (
          <Section title="Responsibilities">
            <Bullets items={job.responsibilities} />
          </Section>
        )}
        {job.skills.length > 0 && (
          <Section title="Required skills">
            <div className="flex flex-wrap gap-2">
              {job.skills.map((s) => (
                <span key={s} className="rounded-lg bg-[#1E5EFF]/10 px-2.5 py-1 text-xs font-semibold text-[#1A52E0] dark:bg-[#1E5EFF]/20 dark:text-blue-300">
                  {s}
                </span>
              ))}
            </div>
          </Section>
        )}
        {job.eligibility.length > 0 && (
          <Section title="Eligibility">
            <Bullets items={job.eligibility} />
          </Section>
        )}
        {job.qualifications.length > 0 && (
          <Section title="Qualifications">
            <Bullets items={job.qualifications} />
          </Section>
        )}
      </div>

      <aside className="space-y-5 lg:sticky lg:top-4 lg:self-start">
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 dark:border-slate-800 dark:bg-surface-elevated">
          {deadline && (
            <p
              className={`mb-4 rounded-lg px-3 py-2 text-xs font-semibold ${
                deadline.tone === "expired"
                  ? "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300"
                  : deadline.tone === "soon"
                    ? "bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300"
                    : "bg-slate-50 text-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
              }`}
            >
              {deadline.text}
            </p>
          )}

          {job.isExpired ? (
            <button type="button" disabled className="w-full cursor-not-allowed rounded-xl bg-slate-200 px-4 py-3 text-sm font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              Applications closed
            </button>
          ) : external && job.applyUrl ? (
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E5EFF] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1649CC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E5EFF]"
            >
              Apply Now <ExternalLink className="h-4 w-4" />
            </a>
          ) : external ? (
            <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
              No application link has been added for this job yet.
            </p>
          ) : null}

          {!job.isExpired && external && job.applyUrl && (
            <p className="mt-2.5 flex items-start gap-1.5 text-xs text-[#696969] dark:text-slate-400">
              <Link2 className="mt-0.5 h-3 w-3 shrink-0" />
              <span>
                Opens the employer&apos;s own site ({new URL(job.applyUrl).hostname.replace(/^www\./, "")}). The application is handled by them, not by JKS Learning.
              </span>
            </p>
          )}
          {!external && !job.isExpired && (
            <p className="rounded-xl bg-[#1E5EFF]/10 px-4 py-3 text-xs font-medium text-[#1A52E0] dark:bg-[#1E5EFF]/20 dark:text-blue-300">
              Handled directly by JKS Learning. Follow the application instructions below.
            </p>
          )}

          <button
            type="button"
            onClick={share}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm font-semibold text-[#222222] transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Share2 className="h-4 w-4" />}
            {copied ? "Link copied" : "Share"}
          </button>
        </div>

        <dl className="space-y-4 rounded-2xl border border-[#E5E7EB] bg-white p-5 dark:border-slate-800 dark:bg-surface-elevated">
          {job.location && <Fact icon={MapPin} label="Location" value={`${job.location} · ${WORK_MODE_LABEL[job.workMode]}`} />}
          {!job.location && <Fact icon={MapPin} label="Work mode" value={WORK_MODE_LABEL[job.workMode]} />}
          <Fact icon={Briefcase} label="Type" value={EMPLOYMENT_LABEL[job.employmentType]} />
          <Fact icon={GraduationCap} label="Experience" value={job.experienceText || EXPERIENCE_LABEL[job.experienceLevel]} />
          {job.salaryText && <Fact icon={Banknote} label="Salary / stipend" value={job.salaryText} />}
          {job.deadline && <Fact icon={CalendarClock} label="Application deadline" value={formatDate(job.deadline) ?? ""} />}
          {formatDate(job.postedAt ?? job.publishedAt) && (
            <Fact icon={CalendarClock} label="Posted" value={formatDate(job.postedAt ?? job.publishedAt) ?? ""} />
          )}
        </dl>

        {job.applicationInstructions && (
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 dark:border-slate-800 dark:bg-surface-elevated">
            <h2 className="text-sm font-bold uppercase tracking-wide text-[#0B1F3A] dark:text-white">How to apply</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-[#222222] dark:text-slate-200">{job.applicationInstructions}</p>
          </div>
        )}

        {(job.sourcePlatform === "WHATSAPP" || job.sourcePlatform === "TELEGRAM" || job.sourceUrl) && (
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 text-sm dark:border-slate-800 dark:bg-surface-elevated">
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#0B1F3A] dark:text-white">
              <MessageSquare className="h-4 w-4" /> Source
            </h2>
            <p className="mt-2 text-[#696969] dark:text-slate-400">Shared via {SOURCE_LABEL[job.sourcePlatform]}.</p>
            {job.sourceUrl && (
              <a href={job.sourceUrl} target="_blank" rel="noopener noreferrer nofollow" className="mt-1 inline-flex items-center gap-1 font-semibold text-[#1A52E0] hover:underline dark:text-blue-300">
                View original announcement <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}
