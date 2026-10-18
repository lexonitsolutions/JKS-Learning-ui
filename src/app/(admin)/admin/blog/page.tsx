"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Archive, ExternalLink, FolderTree, Loader2, Pencil, Plus, Search, Send, Trash2, Undo2 } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import {
  adminArticleAction,
  adminBlogCategories,
  adminDeleteArticle,
  adminListArticles,
  type AdminCategory,
  type BlogCard,
  type BlogStatus,
} from "@/lib/data/blog-api";

const TABS: { id: "" | BlogStatus; label: string }[] = [
  { id: "", label: "All" },
  { id: "DRAFT", label: "Drafts" },
  { id: "SCHEDULED", label: "Scheduled" },
  { id: "PUBLISHED", label: "Published" },
  { id: "ARCHIVED", label: "Archived" },
];
const BADGE: Record<BlogStatus, string> = {
  DRAFT: "bg-slate-100 text-slate-700 ring-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-600",
  SCHEDULED: "bg-blue-50 text-blue-800 ring-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:ring-blue-900/60",
  PUBLISHED: "bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900/60",
  ARCHIVED: "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900/60",
};
const errMsg = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong.");
const date = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "–");
const iconBtn =
  "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800";

export default function AdminBlogPage() {
  const [tab, setTab] = useState<"" | BlogStatus>("");
  const [categoryId, setCategoryId] = useState("");
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [data, setData] = useState<Awaited<ReturnType<typeof adminListArticles>> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    adminBlogCategories().then(setCategories).catch(() => undefined);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(q.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [q]);

  const load = useCallback(async () => {
    try {
      setData(await adminListArticles({ status: tab || undefined, categoryId: categoryId || undefined, q: query || undefined, page }));
      setError(null);
    } catch (e) {
      setError(errMsg(e));
      setData((d) => d ?? { items: [], total: 0, page: 1, pageSize: 25, totalPages: 1, counts: {} });
    }
  }, [tab, categoryId, query, page]);

  useEffect(() => {
    void load();
  }, [load]);

  async function run(a: BlogCard, fn: () => Promise<unknown>) {
    setBusyId(a.id);
    setError(null);
    try {
      await fn();
      await load();
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <DashboardTopbar title="Blog Management" subtitle="Write, schedule and publish articles." />
      <div className="flex-1 space-y-4 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by status">
            {TABS.map((t) => (
              <button
                key={t.label}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => {
                  setTab(t.id);
                  setPage(1);
                }}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  tab === t.id ? "bg-[#1E5EFF] text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-surface-elevated dark:text-slate-300 dark:ring-slate-700"
                }`}
              >
                {t.label}
                {t.id && data?.counts[t.id] ? <span className="ml-1.5 opacity-80">{data.counts[t.id]}</span> : null}
              </button>
            ))}
          </div>
          <div className="ml-auto flex w-full flex-wrap gap-2 sm:w-auto">
            <select value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setPage(1); }} aria-label="Filter by category" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
              <option value="">All categories</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <div className="relative flex-1 sm:w-56">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search articles" aria-label="Search articles" className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[#1E5EFF] focus:ring-2 focus:ring-[#1E5EFF]/20 dark:border-slate-700 dark:bg-slate-900" />
            </div>
            <Link href="/admin/blog/categories" className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"><FolderTree className="h-4 w-4" /> Categories & tags</Link>
            <Link href="/admin/blog/new" className="inline-flex items-center gap-1.5 rounded-xl bg-[#1E5EFF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1649CC]"><Plus className="h-4 w-4" /> New article</Link>
          </div>
        </div>

        {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">{error}</div>}

        <div className="overflow-hidden rounded-[20px] border border-white/70 bg-white/80 shadow-[0_8px_30px_rgb(20,50,100,0.06)] dark:border-slate-800/80 dark:bg-surface-secondary/90 dark:shadow-none">
          {data === null ? (
            <p className="flex items-center gap-2 p-6 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading articles…</p>
          ) : data.items.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
              No articles here yet. <Link href="/admin/blog/new" className="font-semibold text-[#1A52E0] hover:underline dark:text-blue-300">Write the first one</Link>.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-xs">
                <thead className="border-b border-slate-100 text-[11px] uppercase tracking-wide text-slate-500 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Article</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.items.map((a) => {
                    const busy = busyId === a.id;
                    const live = a.status === "PUBLISHED" || a.status === "SCHEDULED";
                    return (
                      <tr key={a.id}>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900 dark:text-white">{a.title}</div>
                          <div className="text-slate-500 dark:text-slate-400">/{a.slug} · {a.authorName ?? "Unknown"} · {a.readingMinutes} min</div>
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{a.category?.name ?? "–"}</td>
                        <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase ring-1 ${BADGE[a.status]}`}>{a.status}</span></td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{a.status === "SCHEDULED" ? `Goes live ${date(a.scheduledAt)}` : a.status === "PUBLISHED" ? date(a.publishedAt) : `Edited ${date(a.updatedAt)}`}</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1.5">
                            <Link href={`/admin/blog/${a.id}/edit`} className={iconBtn} aria-label="Edit / preview" title="Edit / preview"><Pencil className="h-3.5 w-3.5" /></Link>
                            {a.status === "PUBLISHED" && <Link href={`/blog/${a.slug}`} target="_blank" className={iconBtn} aria-label="View live" title="View live"><ExternalLink className="h-3.5 w-3.5" /></Link>}
                            {!live && <button disabled={busy} onClick={() => run(a, () => adminArticleAction(a.id, "publish"))} className={`${iconBtn} text-emerald-700`} aria-label="Publish" title="Publish"><Send className="h-3.5 w-3.5" /></button>}
                            {live && <button disabled={busy} onClick={() => run(a, () => adminArticleAction(a.id, "unpublish"))} className={iconBtn} aria-label="Unpublish" title="Unpublish"><Undo2 className="h-3.5 w-3.5" /></button>}
                            {a.status !== "ARCHIVED" && <button disabled={busy} onClick={() => run(a, () => adminArticleAction(a.id, "archive"))} className={iconBtn} aria-label="Archive" title="Archive"><Archive className="h-3.5 w-3.5" /></button>}
                            {!live && (
                              <button disabled={busy} onClick={() => window.confirm(`Permanently delete "${a.title}"?`) && run(a, () => adminDeleteArticle(a.id))} className={`${iconBtn} text-rose-600`} aria-label="Delete" title="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                            )}
                            {busy && <Loader2 className="ml-1 h-4 w-4 animate-spin self-center text-slate-400" />}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 text-xs">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold disabled:opacity-40 dark:border-slate-700">Previous</button>
            <span className="text-slate-500">Page {page} of {data.totalPages}</span>
            <button disabled={page >= data.totalPages} onClick={() => setPage(page + 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold disabled:opacity-40 dark:border-slate-700">Next</button>
          </div>
        )}
      </div>
    </>
  );
}
