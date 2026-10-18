"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Archive, Ban, Eye, Loader2, Pencil, Plus, Search, Send, Star, Trash2, Undo2 } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { ExpiredBadge, formatDate } from "@/components/jobs/job-ui";
import {
  adminDeleteJob,
  adminFeatureJob,
  adminJobAction,
  adminListJobs,
  type Job,
  type JobStatus,
} from "@/lib/data/jobs-api";

const TABS: { id: "" | JobStatus; label: string }[] = [
  { id: "", label: "All" },
  { id: "DRAFT", label: "Drafts" },
  { id: "PUBLISHED", label: "Published" },
  { id: "EXPIRED", label: "Expired" },
  { id: "ARCHIVED", label: "Archived" },
];
const BADGE: Record<JobStatus, string> = {
  DRAFT: "bg-slate-100 text-slate-700 ring-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-600",
  PUBLISHED: "bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900/60",
  EXPIRED: "bg-rose-50 text-rose-800 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900/60",
  ARCHIVED: "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900/60",
};
const errMsg = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong.");

const iconBtn =
  "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800";

export default function AdminJobsPage() {
  const [tab, setTab] = useState<"" | JobStatus>("");
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Awaited<ReturnType<typeof adminListJobs>> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(q.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [q]);

  const load = useCallback(async () => {
    try {
      setData(await adminListJobs({ status: tab || undefined, q: query || undefined, page }));
      setError(null);
    } catch (e) {
      setError(errMsg(e));
      setData((d) => d ?? { items: [], total: 0, page: 1, pageSize: 25, counts: {} });
    }
  }, [tab, query, page]);

  useEffect(() => {
    void load();
  }, [load]);

  async function run(job: Job, fn: () => Promise<unknown>) {
    setBusyId(job.id);
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

  const pages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  return (
    <>
      <DashboardTopbar title="Jobs Management" subtitle="Create, publish and manage job and internship listings." />
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
          <div className="ml-auto flex w-full gap-2 sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title or company" aria-label="Search jobs" className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[#1E5EFF] focus:ring-2 focus:ring-[#1E5EFF]/20 dark:border-slate-700 dark:bg-slate-900" />
            </div>
            <Link href="/admin/jobs/new" className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#1E5EFF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1649CC]">
              <Plus className="h-4 w-4" /> New job
            </Link>
          </div>
        </div>

        {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">{error}</div>}

        <div className="overflow-hidden rounded-[20px] border border-white/70 bg-white/80 shadow-[0_8px_30px_rgb(20,50,100,0.06)] dark:border-slate-800/80 dark:bg-surface-secondary/90 dark:shadow-none">
          {data === null ? (
            <p className="flex items-center gap-2 p-6 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading jobs…</p>
          ) : data.items.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
              No jobs here yet. <Link href="/admin/jobs/new" className="font-semibold text-[#1A52E0] hover:underline dark:text-blue-300">Create the first one</Link>.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-xs">
                <thead className="border-b border-slate-100 text-[11px] uppercase tracking-wide text-slate-500 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Job</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Published</th>
                    <th className="px-4 py-3">Deadline</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.items.map((j) => {
                    const busy = busyId === j.id;
                    return (
                      <tr key={j.id}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                            {j.featured && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-label="Featured" />}
                            {j.title}
                          </div>
                          <div className="text-slate-500 dark:text-slate-400">{j.companyName} · {j.category}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase ring-1 ${BADGE[j.status]}`}>{j.status}</span>
                          {j.status === "PUBLISHED" && j.isExpired && <div className="mt-1"><ExpiredBadge /></div>}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{formatDate(j.publishedAt) ?? "–"}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{formatDate(j.deadline) ?? "None"}</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1.5">
                            <Link href={`/admin/jobs/${j.id}/edit`} className={iconBtn} aria-label="Edit / preview" title="Edit / preview"><Pencil className="h-3.5 w-3.5" /></Link>
                            {(j.status === "DRAFT" || j.status === "EXPIRED" || j.status === "ARCHIVED") && (
                              <button disabled={busy} onClick={() => run(j, () => adminJobAction(j.id, "publish"))} className={`${iconBtn} text-emerald-700`} aria-label="Publish" title="Publish"><Send className="h-3.5 w-3.5" /></button>
                            )}
                            {j.status === "PUBLISHED" && (
                              <button disabled={busy} onClick={() => run(j, () => adminJobAction(j.id, "draft"))} className={iconBtn} aria-label="Unpublish to draft" title="Unpublish to draft"><Undo2 className="h-3.5 w-3.5" /></button>
                            )}
                            {j.status === "PUBLISHED" && (
                              <button disabled={busy} onClick={() => run(j, () => adminFeatureJob(j.id, !j.featured))} className={iconBtn} aria-label={j.featured ? "Unfeature" : "Feature"} title={j.featured ? "Unfeature" : "Feature"}><Star className={`h-3.5 w-3.5 ${j.featured ? "fill-amber-400 text-amber-500" : ""}`} /></button>
                            )}
                            {j.status === "PUBLISHED" && (
                              <button disabled={busy} onClick={() => run(j, () => adminJobAction(j.id, "expire"))} className={iconBtn} aria-label="Mark expired" title="Mark expired"><Ban className="h-3.5 w-3.5" /></button>
                            )}
                            {j.status !== "ARCHIVED" && (
                              <button disabled={busy} onClick={() => run(j, () => adminJobAction(j.id, "archive"))} className={iconBtn} aria-label="Archive" title="Archive"><Archive className="h-3.5 w-3.5" /></button>
                            )}
                            {j.status !== "PUBLISHED" && (
                              <button
                                disabled={busy}
                                onClick={() => {
                                  if (window.confirm(`Permanently delete "${j.title}"? This cannot be undone.`)) void run(j, () => adminDeleteJob(j.id));
                                }}
                                className={`${iconBtn} text-rose-600`}
                                aria-label="Delete"
                                title="Delete"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
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

        {pages > 1 && (
          <div className="flex items-center justify-center gap-3 text-xs">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold disabled:opacity-40 dark:border-slate-700">Previous</button>
            <span className="text-slate-500">Page {page} of {pages}</span>
            <button disabled={page >= pages} onClick={() => setPage(page + 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold disabled:opacity-40 dark:border-slate-700">Next</button>
          </div>
        )}
        <p className="flex items-center gap-1.5 text-[11px] text-slate-400"><Eye className="h-3 w-3" /> Only Published jobs are visible to approved students. Open a job to preview it exactly as they will see it.</p>
      </div>
    </>
  );
}
