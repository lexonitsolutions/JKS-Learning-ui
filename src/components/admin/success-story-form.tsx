"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, Eye, Loader2, Save, X } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { ImageUploadField } from "@/components/common/image-upload-field";
import { StoryVideoField, type VideoFieldValue } from "@/components/admin/story-video-field";
import { StoryPreviewDialog } from "@/components/admin/story-preview-dialog";
import {
  adminGetStory,
  adminSaveStory,
  type AdminStory,
  type PublicStory,
  type StoryInput,
  type StoryStatus,
  type StoryVideo,
} from "@/lib/data/success-stories-api";

interface FormState {
  studentName: string;
  title: string;
  studentPhotoUrl: string;
  summary: string;
  testimonial: string;
  course: string;
  technologies: string[];
  previousBackground: string;
  currentRole: string;
  company: string;
  achievementCategory: string;
  profileUrl: string;
  completionYear: string;
  achievedAt: string;
  video: VideoFieldValue;
  thumbnailUrl: string;
  durationText: string;
  inlineAutoplay: boolean;
  featured: boolean;
  sortOrder: string;
  status: StoryStatus;
}

const EMPTY: FormState = {
  studentName: "",
  title: "",
  studentPhotoUrl: "",
  summary: "",
  testimonial: "",
  course: "",
  technologies: [],
  previousBackground: "",
  currentRole: "",
  company: "",
  achievementCategory: "",
  profileUrl: "",
  completionYear: "",
  achievedAt: "",
  video: { mode: "none", bunnyVideoId: "", bunnyLibraryId: "", videoUrl: "" },
  thumbnailUrl: "",
  durationText: "",
  inlineAutoplay: true,
  featured: false,
  sortOrder: "",
  status: "DRAFT",
};

const input =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#1E5EFF] focus:ring-2 focus:ring-[#1E5EFF]/20 dark:border-slate-700 dark:bg-slate-900";
const card =
  "rounded-[20px] border border-white/70 bg-white/80 p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] dark:border-slate-800/80 dark:bg-surface-secondary/90 dark:shadow-none sm:p-6";

const errMsg = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong.");

function formatDuration(sec: number | null | undefined) {
  if (!sec || sec <= 0) return "";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.round(sec % 60);
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${m}:${String(s).padStart(2, "0")}`;
}

/** "2:45", "1:02:03" or plain seconds. Returns null when unreadable. */
function parseDuration(text: string): number | null {
  const t = text.trim();
  if (!t) return 0;
  const parts = t.split(":").map((p) => Number(p));
  if (parts.some((n) => !Number.isFinite(n) || n < 0) || parts.length > 3) return null;
  return parts.reduce((acc, n) => acc * 60 + n, 0);
}

function fromStory(s: AdminStory): FormState {
  return {
    studentName: s.studentName,
    title: s.title,
    studentPhotoUrl: s.studentPhotoUrl ?? "",
    summary: s.summary ?? "",
    testimonial: s.testimonial ?? "",
    course: s.course ?? "",
    technologies: s.technologies,
    previousBackground: s.previousBackground ?? "",
    currentRole: s.currentRole ?? "",
    company: s.company ?? "",
    achievementCategory: s.achievementCategory ?? "",
    profileUrl: s.profileUrl ?? "",
    completionYear: s.completionYear ? String(s.completionYear) : "",
    achievedAt: s.achievedAt ? s.achievedAt.slice(0, 10) : "",
    video: {
      mode: s.bunnyVideoId ? "upload" : s.videoUrl ? "link" : "none",
      bunnyVideoId: s.bunnyVideoId ?? "",
      bunnyLibraryId: "",
      videoUrl: s.videoUrl ?? "",
    },
    thumbnailUrl: s.rawThumbnailUrl ?? "",
    durationText: formatDuration(s.videoDurationSeconds),
    inlineAutoplay: s.inlineAutoplay,
    featured: s.featured,
    sortOrder: String(s.sortOrder),
    status: s.status,
  };
}

function toInput(f: FormState): { input?: StoryInput; error?: string } {
  const seconds = parseDuration(f.durationText);
  if (seconds === null) return { error: "Duration must look like 2:45 or 1:02:03." };
  const opt = (v: string) => (v.trim() ? v.trim() : undefined);
  const hasVideo = (f.video.mode === "upload" && f.video.bunnyVideoId) || (f.video.mode === "link" && f.video.videoUrl.trim());
  const year = f.completionYear.trim() ? Number(f.completionYear) : undefined;
  if (year !== undefined && (!Number.isInteger(year) || year < 1990 || year > 2100)) {
    return { error: "Completion year must be a four-digit year." };
  }
  const order = f.sortOrder.trim() ? Number(f.sortOrder) : undefined;
  if (order !== undefined && (!Number.isInteger(order) || order < 0)) {
    return { error: "Display order must be a whole number, 0 or higher." };
  }
  return {
    input: {
      studentName: f.studentName.trim(),
      title: f.title.trim(),
      studentPhotoUrl: opt(f.studentPhotoUrl),
      summary: opt(f.summary),
      testimonial: opt(f.testimonial),
      course: opt(f.course),
      technologies: f.technologies,
      previousBackground: opt(f.previousBackground),
      currentRole: opt(f.currentRole),
      company: opt(f.company),
      achievementCategory: opt(f.achievementCategory),
      profileUrl: opt(f.profileUrl),
      completionYear: year,
      achievedAt: opt(f.achievedAt),
      bunnyVideoId: f.video.mode === "upload" ? opt(f.video.bunnyVideoId) : undefined,
      videoUrl: f.video.mode === "link" ? opt(f.video.videoUrl) : undefined,
      thumbnailUrl: hasVideo ? opt(f.thumbnailUrl) : undefined,
      videoDurationSeconds: hasVideo && seconds ? seconds : undefined,
      inlineAutoplay: Boolean(hasVideo) && f.inlineAutoplay,
      featured: f.status === "PUBLISHED" && f.featured,
      sortOrder: order,
      status: f.status,
    },
  };
}

function previewVideo(f: FormState, existing: AdminStory | null, seconds: number): StoryVideo | null {
  const durationSeconds = seconds || null;
  const durationLabel = formatDuration(seconds) || null;
  if (f.video.mode === "upload" && f.video.bunnyVideoId) {
    if (existing?.video?.kind === "bunny" && existing.bunnyVideoId === f.video.bunnyVideoId) {
      return { ...existing.video, durationSeconds, durationLabel };
    }
    if (!f.video.bunnyLibraryId) return null;
    const base = `https://iframe.mediadelivery.net/embed/${f.video.bunnyLibraryId}/${f.video.bunnyVideoId}`;
    return {
      kind: "bunny",
      embedUrl: `${base}?autoplay=false&muted=false&loop=false&preload=false&responsive=true`,
      inlineEmbedUrl: `${base}?autoplay=true&muted=true&loop=true&preload=false&responsive=true`,
      durationSeconds,
      durationLabel,
    };
  }
  if (f.video.mode === "link" && f.video.videoUrl.trim()) {
    try {
      const u = new URL(f.video.videoUrl.trim());
      const yt = u.hostname === "youtu.be" ? u.pathname.slice(1) : u.hostname.endsWith("youtube.com") ? u.searchParams.get("v") : null;
      if (yt) return { kind: "embed", embedUrl: `https://www.youtube-nocookie.com/embed/${yt}`, durationSeconds, durationLabel };
      if (/\.(mp4|webm|m3u8)$/i.test(u.pathname)) return { kind: "file", src: u.toString(), durationSeconds, durationLabel };
      return { kind: "embed", embedUrl: u.toString(), durationSeconds, durationLabel };
    } catch {
      return null;
    }
  }
  return null;
}

function Field({
  label,
  htmlFor,
  hint,
  children,
  className = "",
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-200">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
    </div>
  );
}

function TagsInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [draft, setDraft] = useState("");
  const add = (raw: string) => {
    const items = raw.split(",").map((t) => t.trim()).filter(Boolean);
    if (items.length === 0) return;
    const next = [...value];
    for (const t of items) if (next.length < 15 && !next.some((x) => x.toLowerCase() === t.toLowerCase())) next.push(t.slice(0, 40));
    onChange(next);
    setDraft("");
  };
  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {value.map((t) => (
          <span key={t} className="inline-flex items-center gap-1 rounded-full bg-[#1E5EFF]/10 px-2.5 py-1 text-xs font-medium text-[#1A52E0] dark:text-blue-300">
            {t}
            <button type="button" onClick={() => onChange(value.filter((x) => x !== t))} aria-label={`Remove ${t}`} className="rounded-full hover:bg-[#1E5EFF]/20">
              <X className="h-3 w-3" aria-hidden="true" />
            </button>
          </span>
        ))}
      </div>
      <input
        id="ss-tech"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add(draft);
          } else if (e.key === "Backspace" && !draft && value.length) onChange(value.slice(0, -1));
        }}
        onBlur={() => add(draft)}
        placeholder="Type a technology and press Enter"
        className={`${input} mt-2`}
      />
    </div>
  );
}

export function SuccessStoryForm({ storyId }: { storyId?: string }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [existing, setExisting] = useState<AdminStory | null>(null);
  const [loading, setLoading] = useState(Boolean(storyId));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<PublicStory | null>(null);

  useEffect(() => {
    if (!storyId) return;
    let alive = true;
    adminGetStory(storyId)
      .then((s) => {
        if (!alive) return;
        setExisting(s);
        setForm(fromStory(s));
      })
      .catch((e) => alive && setError(errMsg(e)))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [storyId]);

  const set = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value })), []);
  const text = (key: keyof FormState) => ({
    value: form[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(key, e.target.value as never),
  });

  const hasVideo = (form.video.mode === "upload" && !!form.video.bunnyVideoId) || (form.video.mode === "link" && !!form.video.videoUrl.trim());
  const published = form.status === "PUBLISHED";

  const onVideoChange = useCallback((patch: Partial<VideoFieldValue>) => setForm((f) => ({ ...f, video: { ...f.video, ...patch } })), []);
  const onDuration = useCallback((sec: number) => setForm((f) => (f.durationText ? f : { ...f, durationText: formatDuration(sec) })), []);

  const previewStory = useMemo<PublicStory>(() => {
    const seconds = parseDuration(form.durationText) ?? 0;
    const video = previewVideo(form, existing, seconds);
    return {
      id: existing?.id ?? "preview",
      studentName: form.studentName || "Student name",
      studentPhotoUrl: form.studentPhotoUrl || null,
      title: form.title || "Story title",
      summary: form.summary || null,
      testimonial: form.testimonial || null,
      course: form.course || null,
      technologies: form.technologies,
      previousBackground: form.previousBackground || null,
      currentRole: form.currentRole || null,
      company: form.company || null,
      achievementCategory: form.achievementCategory || null,
      profileUrl: form.profileUrl || null,
      completionYear: form.completionYear ? Number(form.completionYear) || null : null,
      achievedAt: form.achievedAt || null,
      featured: form.featured,
      inlineAutoplay: Boolean(video) && form.inlineAutoplay,
      thumbnailUrl:
        form.thumbnailUrl ||
        (existing?.bunnyVideoId && existing.bunnyVideoId === form.video.bunnyVideoId ? existing.thumbnailUrl : null),
      video,
      publishedAt: null,
    };
  }, [form, existing]);

  async function save() {
    setError(null);
    if (form.studentName.trim().length < 2) return setError("Enter the student's name.");
    if (form.title.trim().length < 3) return setError("Enter a story title (at least 3 characters).");
    const { input: body, error: invalid } = toInput(form);
    if (!body) return setError(invalid ?? "Check the form and try again.");
    setSaving(true);
    try {
      await adminSaveStory(storyId ?? null, body);
      router.push("/admin/success-stories");
    } catch (e) {
      setError(errMsg(e));
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <>
        <DashboardTopbar title="Success story" subtitle="Loading…" />
        <p className="flex items-center gap-2 p-8 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Loading story…
        </p>
      </>
    );
  }

  return (
    <>
      <DashboardTopbar title={storyId ? "Edit success story" : "New success story"} subtitle="Shown on the public Success Stories page once published." />
      <div className="mx-auto w-full max-w-4xl flex-1 space-y-5 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/admin/success-stories" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All stories
          </Link>
          <div className="flex gap-2">
            <button type="button" onClick={() => setPreview(previewStory)} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
              <Eye className="h-4 w-4" aria-hidden="true" /> Preview
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving || uploading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#1E5EFF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1649CC] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
              {uploading ? "Upload in progress…" : saving ? "Saving…" : published ? "Save & publish" : "Save draft"}
            </button>
          </div>
        </div>

        {error && (
          <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> {error}
          </div>
        )}

        <section className={card} aria-labelledby="f-student">
          <h2 id="f-student" className="mb-4 text-sm font-bold text-slate-900 dark:text-white">Student</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Student name *" htmlFor="ss-name"><input id="ss-name" maxLength={80} className={input} {...text("studentName")} /></Field>
            <Field label="Course or learning path" htmlFor="ss-course"><input id="ss-course" maxLength={120} className={input} {...text("course")} /></Field>
            <Field label="Previous background" htmlFor="ss-prev" hint="e.g. Customer support executive"><input id="ss-prev" maxLength={200} className={input} {...text("previousBackground")} /></Field>
            <Field label="Current role" htmlFor="ss-role"><input id="ss-role" maxLength={120} className={input} {...text("currentRole")} /></Field>
            <Field label="Company" htmlFor="ss-company" hint="Only add a company the student has agreed to be named."><input id="ss-company" maxLength={120} className={input} {...text("company")} /></Field>
            <Field label="Professional profile link" htmlFor="ss-profile" hint="https:// link, e.g. LinkedIn"><input id="ss-profile" type="url" className={input} {...text("profileUrl")} /></Field>
            <Field label="Technologies learned" htmlFor="ss-tech" className="sm:col-span-2"><TagsInput value={form.technologies} onChange={(v) => set("technologies", v)} /></Field>
            <div className="sm:col-span-2">
              <ImageUploadField label="Student photo" context="other" value={form.studentPhotoUrl} onChange={(url) => set("studentPhotoUrl", url)} previewHeight="h-40" hint="Optional. Only upload a photo the student has approved." />
            </div>
          </div>
        </section>

        <section className={card} aria-labelledby="f-story">
          <h2 id="f-story" className="mb-4 text-sm font-bold text-slate-900 dark:text-white">Story</h2>
          <div className="grid gap-4">
            <Field label="Story title *" htmlFor="ss-title"><input id="ss-title" maxLength={140} className={input} {...text("title")} /></Field>
            <Field label={`Achievement statement (${form.summary.length}/280)`} htmlFor="ss-summary" hint="One or two sentences. Shown on cards and the hero.">
              <textarea id="ss-summary" rows={2} maxLength={280} className={input} {...text("summary")} />
            </Field>
            <Field label="Full testimonial" htmlFor="ss-testimonial" hint="In the student's own words. Long text collapses with a Read more link.">
              <textarea id="ss-testimonial" rows={6} maxLength={4000} className={input} {...text("testimonial")} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Achievement category" htmlFor="ss-cat" hint="e.g. Career switch, First job"><input id="ss-cat" maxLength={80} className={input} {...text("achievementCategory")} /></Field>
              <Field label="Completion year" htmlFor="ss-year"><input id="ss-year" inputMode="numeric" maxLength={4} className={input} {...text("completionYear")} /></Field>
              <Field label="Achievement date" htmlFor="ss-date"><input id="ss-date" type="date" className={input} {...text("achievedAt")} /></Field>
            </div>
          </div>
        </section>

        <section className={card} aria-labelledby="f-video">
          <h2 id="f-video" className="mb-4 text-sm font-bold text-slate-900 dark:text-white">Video</h2>
          <div className="space-y-5">
            <StoryVideoField value={form.video} title={form.title || form.studentName} onChange={onVideoChange} onDuration={onDuration} onBusyChange={setUploading} />
            {hasVideo && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Duration" htmlFor="ss-dur" hint="Filled automatically for uploads. Format 2:45."><input id="ss-dur" placeholder="2:45" className={input} {...text("durationText")} /></Field>
                </div>
                <ImageUploadField label="Thumbnail" context="other" value={form.thumbnailUrl} onChange={(url) => set("thumbnailUrl", url)} previewHeight="h-40" hint="Optional for uploaded videos (an automatic frame is used). Recommended for links." />
                <label className="flex cursor-pointer items-start gap-3">
                  <input type="checkbox" checked={form.inlineAutoplay} onChange={(e) => set("inlineAutoplay", e.target.checked)} className="mt-1 h-4 w-4 rounded border-slate-300 text-[#1E5EFF]" />
                  <span>
                    <span className="block text-sm font-semibold text-slate-900 dark:text-white">Play a muted preview automatically while scrolling (recommended)</span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400">On by default. Never plays with sound, stops when scrolled away, and only one video plays at a time. Visitors can always press play for the full video. Untick to show only the thumbnail.</span>
                  </span>
                </label>
              </>
            )}
          </div>
        </section>

        <section className={card} aria-labelledby="f-display">
          <h2 id="f-display" className="mb-4 text-sm font-bold text-slate-900 dark:text-white">Publishing &amp; display</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Status" htmlFor="ss-status" hint="Only published stories appear publicly.">
              <select id="ss-status" value={form.status} onChange={(e) => set("status", e.target.value as StoryStatus)} className={input}>
                <option value="DRAFT">Draft (hidden)</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </Field>
            <Field label="Display order" htmlFor="ss-order" hint="Lower numbers appear first. Leave blank to add at the end."><input id="ss-order" inputMode="numeric" className={input} {...text("sortOrder")} /></Field>
            <label className={`flex items-start gap-3 sm:col-span-2 ${published ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}>
              <input type="checkbox" disabled={!published} checked={published && form.featured} onChange={(e) => set("featured", e.target.checked)} className="mt-1 h-4 w-4 rounded border-slate-300 text-[#1E5EFF]" />
              <span>
                <span className="block text-sm font-semibold text-slate-900 dark:text-white">Feature on the hero</span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">Only one story is featured at a time. Featuring this one replaces the current hero story. Requires Published status.</span>
              </span>
            </label>
          </div>
        </section>
      </div>
      <StoryPreviewDialog story={preview} onClose={() => setPreview(null)} />
    </>
  );
}
