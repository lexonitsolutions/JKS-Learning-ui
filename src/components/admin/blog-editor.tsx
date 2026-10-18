"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Archive, ArrowLeft, CalendarClock, Eye, ExternalLink, Loader2, Pencil, Save, Send, Trash2, Undo2 } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { ImageUploadField } from "@/components/common/image-upload-field";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import {
  adminArticleAction,
  adminBlogAuthors,
  adminBlogCategories,
  adminDeleteArticle,
  adminGetArticle,
  adminPreviewHtml,
  adminSaveArticle,
  adminScheduleArticle,
  type AdminCategory,
  type BlogArticle,
} from "@/lib/data/blog-api";

const errMsg = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong.");
const slugify = (s: string) =>
  s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

const inputCls =
  "mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#1E5EFF] focus:ring-2 focus:ring-[#1E5EFF]/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white";

const STATUS_STYLE: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  SCHEDULED: "bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300",
  PUBLISHED: "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
  ARCHIVED: "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
};

function Field({ label, hint, children, className = "" }: { label: string; hint?: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block text-xs font-semibold text-slate-700 dark:text-slate-200 ${className}`}>
      {label}
      {hint && <span className="ml-1 font-normal text-slate-400">{hint}</span>}
      {children}
    </label>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-surface-secondary/90">
      <h2 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h2>
      {children}
    </section>
  );
}

export function BlogEditor({ articleId }: { articleId?: string }) {
  const router = useRouter();
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [loading, setLoading] = useState(!!articleId);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [authors, setAuthors] = useState<{ id: string; name: string; role: string }[]>([]);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [coverImageAlt, setCoverImageAlt] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [tags, setTags] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [scheduleAt, setScheduleAt] = useState("");

  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [preview, setPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [editorKey, setEditorKey] = useState(0);

  function hydrate(a: BlogArticle) {
    setArticle(a);
    setTitle(a.title);
    setSlug(a.slug);
    setSlugEdited(true);
    setExcerpt(a.excerpt ?? "");
    setContent(a.content);
    setCoverImageUrl(a.coverImageUrl ?? "");
    setCoverImageAlt(a.coverImageAlt ?? "");
    setCategoryId(a.categoryId ?? "");
    setAuthorId(a.authorId);
    setTags(a.tags.join(", "));
    setSeoTitle(a.seoTitle ?? "");
    setSeoDescription(a.seoDescription ?? "");
    setScheduleAt(a.scheduledAt ? a.scheduledAt.slice(0, 16) : "");
    setDirty(false);
  }

  useEffect(() => {
    adminBlogCategories().then(setCategories).catch(() => undefined);
    adminBlogAuthors().then(setAuthors).catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!articleId) return;
    adminGetArticle(articleId)
      .then((a) => {
        hydrate(a);
        setEditorKey((k) => k + 1);
      })
      .catch((e) => setError(errMsg(e)))
      .finally(() => setLoading(false));
  }, [articleId]);

  // Warn before leaving with unsaved work.
  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  const touch = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setDirty(true);
  };

  const effectiveSlug = slugEdited ? slug : slugify(title);

  const body = useMemo(
    () => ({
      title: title.trim(),
      slug: effectiveSlug || undefined,
      excerpt: excerpt.trim() || undefined,
      content,
      coverImageUrl: coverImageUrl.trim() || undefined,
      coverImageAlt: coverImageAlt.trim() || undefined,
      authorId: authorId || undefined,
      categoryId: categoryId || undefined,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      seoTitle: seoTitle.trim() || undefined,
      seoDescription: seoDescription.trim() || undefined,
    }),
    [title, effectiveSlug, excerpt, content, coverImageUrl, coverImageAlt, authorId, categoryId, tags, seoTitle, seoDescription],
  );

  async function run(label: string, fn: () => Promise<BlogArticle | { deleted: boolean }>, done?: string) {
    setBusy(label);
    setError(null);
    setNotice(null);
    try {
      const res = await fn();
      if ("deleted" in res) {
        setDirty(false);
        router.push("/admin/blog");
        return;
      }
      hydrate(res);
      if (!articleId) {
        setDirty(false);
        router.replace(`/admin/blog/${res.id}/edit`);
      }
      if (done) setNotice(done);
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setBusy(null);
    }
  }

  const save = () => {
    if (body.title.length < 3) {
      setError("Enter a title (at least 3 characters).");
      return Promise.resolve();
    }
    return run("save", () => adminSaveArticle(articleId ?? null, body), "Saved.");
  };

  async function saveThen(label: string, then: (id: string) => Promise<BlogArticle>, done: string) {
    if (body.title.length < 3) return setError("Enter a title (at least 3 characters).");
    await run(label, async () => {
      const saved = await adminSaveArticle(articleId ?? null, body);
      return then(saved.id);
    }, done);
  }

  async function togglePreview() {
    if (preview) return setPreview(false);
    setPreview(true);
    setPreviewHtml(null);
    setPreviewError(null);
    try {
      setPreviewHtml((await adminPreviewHtml(content)).html);
    } catch (e) {
      setPreviewError(errMsg(e));
    }
  }

  if (loading) {
    return (
      <>
        <DashboardTopbar title="Edit article" subtitle="" />
        <p className="flex items-center gap-2 p-8 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading article…</p>
      </>
    );
  }

  const status = article?.status;
  const live = status === "PUBLISHED" || status === "SCHEDULED";
  const btn = "inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800";
  const spin = (k: string, icon: React.ReactNode) => (busy === k ? <Loader2 className="h-4 w-4 animate-spin" /> : icon);

  return (
    <>
      <DashboardTopbar title={articleId ? "Edit article" : "New article"} subtitle="Drafts stay private until you publish." />
      <div className="flex-1 space-y-5 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4">
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/admin/blog" className="mr-auto inline-flex items-center gap-1.5 text-sm font-semibold text-[#1A52E0] hover:underline dark:text-blue-300"><ArrowLeft className="h-4 w-4" /> All articles</Link>
          {status && <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase ${STATUS_STYLE[status]}`}>{status}</span>}
          {dirty && <span className="text-xs text-amber-600">Unsaved changes</span>}
          <button type="button" onClick={togglePreview} className={btn}>{preview ? <Pencil className="h-4 w-4" /> : <Eye className="h-4 w-4" />} {preview ? "Back to editing" : "Preview"}</button>
          <button type="button" disabled={!!busy} onClick={save} className={btn}>{spin("save", <Save className="h-4 w-4" />)} Save draft</button>
          {status === "PUBLISHED" && article && (
            <Link href={`/blog/${article.slug}`} target="_blank" className={btn}><ExternalLink className="h-4 w-4" /> View live</Link>
          )}
          <button type="button" disabled={!!busy} onClick={() => saveThen("publish", (id) => adminArticleAction(id, "publish"), "Published.")} className="inline-flex items-center gap-1.5 rounded-xl bg-[#1E5EFF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1649CC] disabled:opacity-50">
            {spin("publish", <Send className="h-4 w-4" />)} {status === "PUBLISHED" ? "Update" : "Publish"}
          </button>
        </div>

        {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">{error}</div>}
        {notice && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300">{notice}</div>}

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-5">
            {preview ? (
              <article className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-surface-secondary/90 sm:p-8">
                <p className="mb-4 rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">Preview — this is the sanitised content readers will see.</p>
                <h1 className="text-3xl font-bold leading-tight text-[#0B1F3A] dark:text-white">{title || "Untitled"}</h1>
                {excerpt && <p className="mt-2 text-lg text-[#696969] dark:text-slate-400">{excerpt}</p>}
                {coverImageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={coverImageUrl} alt={coverImageAlt} className="mt-6 aspect-[16/9] w-full rounded-2xl object-cover" />
                )}
                <div className="mt-6">
                  {previewError ? <p role="alert" className="text-sm text-rose-600">{previewError}</p> : previewHtml === null ? (
                    <p className="flex items-center gap-2 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Rendering…</p>
                  ) : previewHtml ? (
                    <div className="article-prose" dangerouslySetInnerHTML={{ __html: previewHtml }} />
                  ) : (
                    <p className="text-sm text-slate-500">There&apos;s no content yet.</p>
                  )}
                </div>
              </article>
            ) : (
              <>
                <div>
                  <label htmlFor="blog-title" className="sr-only">Title</label>
                  <input
                    id="blog-title"
                    value={title}
                    onChange={(e) => touch(setTitle)(e.target.value)}
                    maxLength={160}
                    placeholder="Article title"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-2xl font-bold text-[#0B1F3A] outline-none transition placeholder:text-slate-300 focus:border-[#1E5EFF] focus:ring-2 focus:ring-[#1E5EFF]/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                  <p className="mt-1.5 truncate px-1 text-xs text-slate-500">/blog/{effectiveSlug || "…"}</p>
                </div>
                <RichTextEditor key={editorKey} value={content} onChange={touch(setContent)} />
              </>
            )}
          </div>

          <aside className="space-y-5">
            <Panel title="Publishing">
              <p className="text-xs text-slate-500">
                {article?.publishedAt && status === "PUBLISHED" && <>Published {new Date(article.publishedAt).toLocaleString()}. </>}
                {article && <>Last updated {new Date(article.updatedAt).toLocaleString()}.</>}
                {!article && "Not saved yet."}
              </p>
              <Field label="Schedule for" hint="local time">
                <input type="datetime-local" value={scheduleAt} onChange={(e) => setScheduleAt(e.target.value)} className={inputCls} />
              </Field>
              <button
                type="button"
                disabled={!!busy || !scheduleAt}
                onClick={() => saveThen("schedule", (id) => adminScheduleArticle(id, new Date(scheduleAt).toISOString()), "Scheduled. It goes live automatically at that time.")}
                className={`${btn} w-full justify-center`}
              >
                {spin("schedule", <CalendarClock className="h-4 w-4" />)} Schedule
              </button>
              {article && (
                <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                  {live && <button type="button" disabled={!!busy} onClick={() => run("unpublish", () => adminArticleAction(article.id, "unpublish"), "Moved back to draft.")} className={btn}>{spin("unpublish", <Undo2 className="h-4 w-4" />)} Unpublish</button>}
                  {status !== "ARCHIVED" && <button type="button" disabled={!!busy} onClick={() => run("archive", () => adminArticleAction(article.id, "archive"), "Archived.")} className={btn}>{spin("archive", <Archive className="h-4 w-4" />)} Archive</button>}
                  {!live && (
                    <button
                      type="button"
                      disabled={!!busy}
                      onClick={() => window.confirm(`Permanently delete "${article.title}"?`) && run("delete", () => adminDeleteArticle(article.id))}
                      className={`${btn} text-rose-600`}
                    >
                      {spin("delete", <Trash2 className="h-4 w-4" />)} Delete
                    </button>
                  )}
                </div>
              )}
            </Panel>

            <Panel title="Details">
              <Field label="Category">
                <select value={categoryId} onChange={(e) => touch(setCategoryId)(e.target.value)} className={inputCls}>
                  <option value="">Uncategorised</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Field>
              <Field label="Tags" hint="comma separated">
                <input value={tags} onChange={(e) => touch(setTags)(e.target.value)} placeholder="java, interview, freshers" className={inputCls} />
              </Field>
              <Field label="Author">
                <select value={authorId} onChange={(e) => touch(setAuthorId)(e.target.value)} className={inputCls}>
                  <option value="">Me</option>
                  {authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </Field>
              <Field label="Excerpt" hint={`${excerpt.length}/400`}>
                <textarea value={excerpt} onChange={(e) => touch(setExcerpt)(e.target.value)} rows={3} maxLength={400} placeholder="Short summary shown on cards. Leave empty to use the opening text." className={inputCls} />
              </Field>
              <Field label="URL slug">
                <input value={effectiveSlug} onChange={(e) => { setSlugEdited(true); touch(setSlug)(slugify(e.target.value)); }} className={inputCls} />
              </Field>
            </Panel>

            <Panel title="Cover image">
              <ImageUploadField
                value={coverImageUrl}
                onChange={(url) => touch(setCoverImageUrl)(url)}
                onRemove={() => touch(setCoverImageUrl)("")}
                context="other"
                previewHeight="h-40"
              />
              <Field label="Alt text" hint="describe the image">
                <input value={coverImageAlt} onChange={(e) => touch(setCoverImageAlt)(e.target.value)} maxLength={200} className={inputCls} />
              </Field>
            </Panel>

            <Panel title="SEO">
              <Field label="SEO title" hint={`${seoTitle.length}/70`}>
                <input value={seoTitle} onChange={(e) => touch(setSeoTitle)(e.target.value)} maxLength={70} placeholder={title} className={inputCls} />
              </Field>
              <Field label="Meta description" hint={`${seoDescription.length}/170`}>
                <textarea value={seoDescription} onChange={(e) => touch(setSeoDescription)(e.target.value)} rows={3} maxLength={170} placeholder={excerpt} className={inputCls} />
              </Field>
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                <div className="truncate text-sm font-medium text-[#1A52E0] dark:text-blue-300">{seoTitle || title || "Article title"} | JKS Learning</div>
                <div className="truncate text-[11px] text-emerald-700 dark:text-emerald-400">…/blog/{effectiveSlug || "slug"}</div>
                <div className="mt-0.5 line-clamp-2 text-xs text-slate-600 dark:text-slate-300">{seoDescription || excerpt || "The meta description appears here."}</div>
              </div>
            </Panel>
          </aside>
        </div>
      </div>
    </>
  );
}
