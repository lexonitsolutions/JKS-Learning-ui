"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Eye, Loader2, Pencil, Save, Send, Wand2 } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { JobDetailView } from "@/components/jobs/job-detail-view";
import { EMPLOYMENT_LABEL, EXPERIENCE_LABEL, WORK_MODE_LABEL } from "@/components/jobs/job-ui";
import { ImageUploadField } from "@/components/common/image-upload-field";
import {
  DuplicateJobError,
  adminGetJob,
  adminJobAction,
  adminParseAnnouncement,
  adminSaveJob,
  type ApplicationMode,
  type EmploymentType,
  type ExperienceLevel,
  type Job,
  type JobInput,
  type SourcePlatform,
  type WorkMode,
} from "@/lib/data/jobs-api";

interface FormState {
  title: string;
  companyName: string;
  companyLogoUrl: string;
  category: string;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  experienceText: string;
  qualifications: string;
  skills: string;
  location: string;
  workMode: WorkMode;
  salaryText: string;
  description: string;
  responsibilities: string;
  eligibility: string;
  applicationInstructions: string;
  applicationMode: ApplicationMode;
  applyUrl: string;
  sourcePlatform: SourcePlatform;
  sourceUrl: string;
  featured: boolean;
  postedAt: string;
  deadline: string;
}

const EMPTY: FormState = {
  title: "",
  companyName: "",
  companyLogoUrl: "",
  category: "",
  employmentType: "FULL_TIME",
  experienceLevel: "FRESHER",
  experienceText: "",
  qualifications: "",
  skills: "",
  location: "",
  workMode: "ONSITE",
  salaryText: "",
  description: "",
  responsibilities: "",
  eligibility: "",
  applicationInstructions: "",
  applicationMode: "EXTERNAL",
  applyUrl: "",
  sourcePlatform: "WEBSITE",
  sourceUrl: "",
  featured: false,
  postedAt: "",
  deadline: "",
};

const lines = (s: string) => s.split(/\r?\n/).map((l) => l.replace(/^[\s•\-*]+/, "").trim()).filter(Boolean);
const csv = (s: string) => s.split(",").map((l) => l.trim()).filter(Boolean);
const day = (iso: string | null | undefined) => (iso ? iso.slice(0, 10) : "");
const errMsg = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong.");
const isHttps = (v: string) => {
  try {
    const u = new URL(v);
    return u.protocol === "https:" && u.hostname.includes(".");
  } catch {
    return false;
  }
};

function fromJob(j: Job): FormState {
  return {
    title: j.title,
    companyName: j.companyName,
    companyLogoUrl: j.companyLogoUrl ?? "",
    category: j.category,
    employmentType: j.employmentType,
    experienceLevel: j.experienceLevel,
    experienceText: j.experienceText ?? "",
    qualifications: j.qualifications.join("\n"),
    skills: j.skills.join(", "),
    location: j.location ?? "",
    workMode: j.workMode,
    salaryText: j.salaryText ?? "",
    description: j.description,
    responsibilities: j.responsibilities.join("\n"),
    eligibility: j.eligibility.join("\n"),
    applicationInstructions: j.applicationInstructions ?? "",
    applicationMode: j.applicationMode,
    applyUrl: j.applyUrl ?? "",
    sourcePlatform: j.sourcePlatform,
    sourceUrl: j.sourceUrl ?? "",
    featured: j.featured,
    postedAt: day(j.postedAt),
    deadline: day(j.deadline),
  };
}

function toInput(f: FormState): JobInput {
  const iso = (d: string) => (d ? new Date(`${d}T00:00:00.000Z`).toISOString() : undefined);
  return {
    title: f.title.trim(),
    companyName: f.companyName.trim(),
    companyLogoUrl: f.companyLogoUrl.trim() || undefined,
    category: f.category.trim() || undefined,
    employmentType: f.employmentType,
    experienceLevel: f.experienceLevel,
    experienceText: f.experienceText.trim() || undefined,
    qualifications: lines(f.qualifications),
    skills: csv(f.skills),
    location: f.location.trim() || undefined,
    workMode: f.workMode,
    salaryText: f.salaryText.trim() || undefined,
    description: f.description.trim() || undefined,
    responsibilities: lines(f.responsibilities),
    eligibility: lines(f.eligibility),
    applicationInstructions: f.applicationInstructions.trim() || undefined,
    applicationMode: f.applicationMode,
    applyUrl: f.applyUrl.trim() || undefined,
    sourcePlatform: f.sourcePlatform,
    sourceUrl: f.sourceUrl.trim() || undefined,
    featured: f.featured,
    postedAt: iso(f.postedAt),
    deadline: iso(f.deadline),
  };
}

const inputCls =
  "mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#1E5EFF] focus:ring-2 focus:ring-[#1E5EFF]/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white";

function Field({ label, hint, error, children, className = "" }: { label: string; hint?: string; error?: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block text-xs font-semibold text-slate-700 dark:text-slate-200 ${className}`}>
      {label}
      {hint && <span className="ml-1 font-normal text-slate-400">{hint}</span>}
      {children}
      {error && <span role="alert" className="mt-1 block text-[11px] font-medium text-rose-600">{error}</span>}
    </label>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-surface-secondary/90">
      <h2 className="mb-4 text-sm font-bold text-slate-900 dark:text-white">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export function JobForm({ jobId }: { jobId?: string }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(!!jobId);
  const [busy, setBusy] = useState<"draft" | "publish" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [duplicate, setDuplicate] = useState<DuplicateJobError | null>(null);
  const [touched, setTouched] = useState(false);
  const [preview, setPreview] = useState(false);
  // Captured once so the preview memo stays pure.
  const [openedAt] = useState(() => Date.now());

  const [importText, setImportText] = useState("");
  const [importing, setImporting] = useState(false);
  const [importNotes, setImportNotes] = useState<{ warnings: string[]; duplicates: { id: string; title: string; companyName: string }[] } | null>(null);

  useEffect(() => {
    if (!jobId) return;
    adminGetJob(jobId)
      .then((j) => {
        setJob(j);
        setForm(fromJob(j));
      })
      .catch((e) => setError(errMsg(e)))
      .finally(() => setLoading(false));
  }, [jobId]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));

  // Field-level problems. Drafts need a title and company; publishing needs the rest.
  const problems = useMemo(() => {
    const p: Partial<Record<keyof FormState, string>> = {};
    if (form.title.trim().length < 3) p.title = "Enter a job title (at least 3 characters).";
    if (form.companyName.trim().length < 2) p.companyName = "Enter the company name.";
    if (form.applyUrl && !isHttps(form.applyUrl)) p.applyUrl = "Must be a valid https:// link to the employer's site.";
    if (form.sourceUrl && !isHttps(form.sourceUrl)) p.sourceUrl = "Must be a valid https:// link.";
    if (form.companyLogoUrl && !isHttps(form.companyLogoUrl)) p.companyLogoUrl = "Must be an https:// image URL.";
    if (form.postedAt && form.deadline && form.deadline < form.postedAt) p.deadline = "Deadline can't be before the posted date.";
    return p;
  }, [form]);

  const publishGaps = useMemo(() => {
    const g: string[] = [];
    if (form.description.trim().length < 30) g.push("a description (30+ characters)");
    if (form.applicationMode === "EXTERNAL" && !form.applyUrl.trim()) g.push("the official application URL");
    if (form.applicationMode === "JKS_DIRECT" && !form.applicationInstructions.trim()) g.push("application instructions");
    return g;
  }, [form]);

  async function save(publish: boolean, allowDuplicate = false) {
    setTouched(true);
    setError(null);
    if (Object.keys(problems).length) {
      setError("Please fix the highlighted fields.");
      return;
    }
    if (publish && publishGaps.length) {
      setError(`To publish, add ${publishGaps.join(" and ")}.`);
      return;
    }
    setBusy(publish ? "publish" : "draft");
    setDuplicate(null);
    try {
      let saved = await adminSaveJob(jobId ?? null, { ...toInput(form), allowDuplicate: allowDuplicate || undefined });
      if (publish) saved = await adminJobAction(saved.id, "publish");
      if (!jobId) router.replace(`/admin/jobs/${saved.id}/edit`);
      setJob(saved);
      setForm(fromJob(saved));
      if (publish) router.push("/admin/jobs");
    } catch (e) {
      if (e instanceof DuplicateJobError) setDuplicate(e);
      else setError(errMsg(e));
    } finally {
      setBusy(null);
    }
  }

  async function runImport() {
    setImporting(true);
    setError(null);
    try {
      const res = await adminParseAnnouncement(importText);
      const f = res.fields;
      setForm((cur) => ({
        ...cur,
        title: f.title ?? cur.title,
        companyName: f.companyName ?? cur.companyName,
        location: f.location ?? cur.location,
        employmentType: f.employmentType ?? cur.employmentType,
        experienceLevel: f.experienceLevel ?? cur.experienceLevel,
        experienceText: f.experienceText ?? cur.experienceText,
        workMode: f.workMode ?? cur.workMode,
        salaryText: f.salaryText ?? cur.salaryText,
        applyUrl: f.applyUrl ?? cur.applyUrl,
        skills: f.skills ? f.skills.join(", ") : cur.skills,
        deadline: f.deadline ? day(f.deadline) : cur.deadline,
        description: f.description || cur.description,
      }));
      setImportNotes({ warnings: res.warnings, duplicates: res.duplicates });
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setImporting(false);
    }
  }

  const previewJob: Job = useMemo(() => {
    const i = toInput(form);
    const deadline = i.deadline ?? null;
    return {
      id: job?.id ?? "preview",
      title: i.title || "Untitled job",
      companyName: i.companyName || "Company",
      companyLogoUrl: isHttps(form.companyLogoUrl) ? form.companyLogoUrl : null,
      category: i.category || "General",
      employmentType: form.employmentType,
      experienceLevel: form.experienceLevel,
      experienceText: i.experienceText ?? null,
      qualifications: i.qualifications ?? [],
      skills: i.skills ?? [],
      location: i.location ?? null,
      workMode: form.workMode,
      salaryText: i.salaryText ?? null,
      description: i.description ?? "",
      responsibilities: i.responsibilities ?? [],
      eligibility: i.eligibility ?? [],
      applicationInstructions: i.applicationInstructions ?? null,
      applicationMode: form.applicationMode,
      applyUrl: isHttps(form.applyUrl) ? form.applyUrl : null,
      sourcePlatform: form.sourcePlatform,
      sourceUrl: isHttps(form.sourceUrl) ? form.sourceUrl : null,
      status: job?.status ?? "DRAFT",
      featured: form.featured,
      postedAt: i.postedAt ?? null,
      deadline,
      publishedAt: job?.publishedAt ?? null,
      createdAt: job?.createdAt ?? new Date(openedAt).toISOString(),
      updatedAt: new Date(openedAt).toISOString(),
      isExpired: job?.status === "EXPIRED" || (!!deadline && new Date(deadline).getTime() <= openedAt),
    };
  }, [form, job, openedAt]);

  if (loading) {
    return (
      <>
        <DashboardTopbar title="Edit job" subtitle="" />
        <p className="flex items-center gap-2 p-8 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading job…</p>
      </>
    );
  }

  const err = (k: keyof FormState) => (touched ? problems[k] : undefined);

  return (
    <>
      <DashboardTopbar title={jobId ? "Edit job" : "New job"} subtitle={job ? `Status: ${job.status}` : "Saved as a draft until you publish it."} />
      <div className="flex-1 space-y-5 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4">
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/admin/jobs" className="mr-auto inline-flex items-center gap-1.5 text-sm font-semibold text-[#1A52E0] hover:underline dark:text-blue-300"><ArrowLeft className="h-4 w-4" /> All jobs</Link>
          <button type="button" onClick={() => setPreview((p) => !p)} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
            {preview ? <Pencil className="h-4 w-4" /> : <Eye className="h-4 w-4" />} {preview ? "Back to editing" : "Preview"}
          </button>
          <button type="button" disabled={!!busy} onClick={() => save(false)} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
            {busy === "draft" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save draft
          </button>
          <button type="button" disabled={!!busy} onClick={() => save(true)} className="inline-flex items-center gap-1.5 rounded-xl bg-[#1E5EFF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1649CC] disabled:opacity-50">
            {busy === "publish" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} {job?.status === "PUBLISHED" ? "Save changes" : "Publish"}
          </button>
        </div>

        {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">{error}</div>}
        {duplicate && (
          <div role="alert" className="flex flex-wrap items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span className="flex-1">{duplicate.message}</span>
            <Link href={`/admin/jobs/${duplicate.existingId}/edit`} className="font-semibold underline">Open existing</Link>
            <button type="button" onClick={() => save(false, true)} className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700">Save anyway</button>
          </div>
        )}

        {preview ? (
          <div>
            <p className="mb-3 rounded-xl bg-slate-100 px-4 py-2.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">Preview of what approved students will see. Nothing is saved or published from here.</p>
            <JobDetailView job={previewJob} preview />
          </div>
        ) : (
          <>
            {!jobId && (
              <section className="rounded-2xl border border-dashed border-[#1E5EFF]/40 bg-[#1E5EFF]/5 p-5">
                <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white"><Wand2 className="h-4 w-4 text-[#1E5EFF]" /> Import from a WhatsApp / Telegram post</h2>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Paste the announcement text. We fill in only what is actually written in it; review every field before saving.</p>
                <textarea value={importText} onChange={(e) => setImportText(e.target.value)} rows={4} maxLength={8000} placeholder="Paste the announcement here…" className={inputCls} />
                <button type="button" disabled={importing || importText.trim().length < 10} onClick={runImport} className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[#0B1F3A] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#12315a] disabled:opacity-50">
                  {importing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Wand2 className="h-3.5 w-3.5" />} Extract details
                </button>
                {importNotes && (
                  <ul className="mt-3 space-y-1 text-xs">
                    {importNotes.warnings.map((w) => <li key={w} className="text-amber-800 dark:text-amber-300">⚠ {w}</li>)}
                    {importNotes.duplicates.map((d) => <li key={d.id} className="text-rose-700 dark:text-rose-300">Possible duplicate: <Link href={`/admin/jobs/${d.id}/edit`} className="font-semibold underline">{d.title} at {d.companyName}</Link></li>)}
                    <li className="text-slate-500">Fields have been filled in. Please verify them below.</li>
                  </ul>
                )}
              </section>
            )}

            <Card title="Basics">
              <Field label="Job title" error={err("title")}><input className={inputCls} value={form.title} onChange={(e) => set("title", e.target.value)} maxLength={160} /></Field>
              <Field label="Company name" error={err("companyName")}><input className={inputCls} value={form.companyName} onChange={(e) => set("companyName", e.target.value)} maxLength={120} /></Field>
              <Field label="Category" hint="e.g. Engineering, SAP, Data"><input className={inputCls} value={form.category} onChange={(e) => set("category", e.target.value)} maxLength={80} /></Field>
              <Field label="Employment type">
                <select className={inputCls} value={form.employmentType} onChange={(e) => set("employmentType", e.target.value as EmploymentType)}>
                  {Object.entries(EMPLOYMENT_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </Field>
              <Field label="Experience level">
                <select className={inputCls} value={form.experienceLevel} onChange={(e) => set("experienceLevel", e.target.value as ExperienceLevel)}>
                  {Object.entries(EXPERIENCE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </Field>
              <Field label="Experience details" hint="optional, e.g. 0–1 years"><input className={inputCls} value={form.experienceText} onChange={(e) => set("experienceText", e.target.value)} maxLength={120} /></Field>
              <Field label="Location" hint="optional"><input className={inputCls} value={form.location} onChange={(e) => set("location", e.target.value)} maxLength={160} /></Field>
              <Field label="Work mode">
                <select className={inputCls} value={form.workMode} onChange={(e) => set("workMode", e.target.value as WorkMode)}>
                  {Object.entries(WORK_MODE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </Field>
              <Field label="Salary / stipend" hint="leave empty if not stated"><input className={inputCls} value={form.salaryText} onChange={(e) => set("salaryText", e.target.value)} maxLength={120} /></Field>
              <div className="sm:col-span-2">
                <ImageUploadField label="Company logo" value={form.companyLogoUrl} onChange={(url) => set("companyLogoUrl", url)} onRemove={() => set("companyLogoUrl", "")} context="other" />
                {err("companyLogoUrl") && <p role="alert" className="mt-1 text-[11px] font-medium text-rose-600">{err("companyLogoUrl")}</p>}
              </div>
            </Card>

            <Card title="Details">
              <Field label="Description" className="sm:col-span-2"><textarea className={inputCls} rows={6} value={form.description} onChange={(e) => set("description", e.target.value)} maxLength={8000} /></Field>
              <Field label="Responsibilities" hint="one per line"><textarea className={inputCls} rows={5} value={form.responsibilities} onChange={(e) => set("responsibilities", e.target.value)} /></Field>
              <Field label="Eligibility criteria" hint="one per line"><textarea className={inputCls} rows={5} value={form.eligibility} onChange={(e) => set("eligibility", e.target.value)} /></Field>
              <Field label="Required qualifications" hint="one per line"><textarea className={inputCls} rows={4} value={form.qualifications} onChange={(e) => set("qualifications", e.target.value)} /></Field>
              <Field label="Required skills" hint="comma separated"><textarea className={inputCls} rows={4} value={form.skills} onChange={(e) => set("skills", e.target.value)} /></Field>
            </Card>

            <Card title="Applying">
              <Field label="Application handled by">
                <select className={inputCls} value={form.applicationMode} onChange={(e) => set("applicationMode", e.target.value as ApplicationMode)}>
                  <option value="EXTERNAL">The employer (external link)</option>
                  <option value="JKS_DIRECT">JKS Learning (follow instructions)</option>
                </select>
              </Field>
              <Field label="Official application URL" hint="https:// only" error={err("applyUrl")}><input className={inputCls} value={form.applyUrl} onChange={(e) => set("applyUrl", e.target.value)} placeholder="https://company.com/careers/role" maxLength={2000} /></Field>
              <Field label="Application instructions" className="sm:col-span-2"><textarea className={inputCls} rows={3} value={form.applicationInstructions} onChange={(e) => set("applicationInstructions", e.target.value)} maxLength={2000} /></Field>
              <Field label="Posted date"><input type="date" className={inputCls} value={form.postedAt} onChange={(e) => set("postedAt", e.target.value)} /></Field>
              <Field label="Application deadline" error={err("deadline")}><input type="date" className={inputCls} value={form.deadline} onChange={(e) => set("deadline", e.target.value)} /></Field>
            </Card>

            <Card title="Source & visibility">
              <Field label="Source platform">
                <select className={inputCls} value={form.sourcePlatform} onChange={(e) => set("sourcePlatform", e.target.value as SourcePlatform)}>
                  <option value="WEBSITE">Website</option>
                  <option value="WHATSAPP">WhatsApp</option>
                  <option value="TELEGRAM">Telegram</option>
                  <option value="OTHER">Other</option>
                </select>
              </Field>
              <Field label="Source announcement URL" hint="optional" error={err("sourceUrl")}><input className={inputCls} value={form.sourceUrl} onChange={(e) => set("sourceUrl", e.target.value)} placeholder="https://t.me/channel/123" maxLength={2000} /></Field>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 sm:col-span-2">
                <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="h-4 w-4 rounded accent-[#1E5EFF]" />
                Feature this job at the top of the Jobs page
              </label>
              {job?.createdByName && <p className="text-xs text-slate-400 sm:col-span-2">Created by {job.createdByName}</p>}
            </Card>
          </>
        )}
      </div>
    </>
  );
}
