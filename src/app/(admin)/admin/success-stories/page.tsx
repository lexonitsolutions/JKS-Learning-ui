"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  ExternalLink,
  Loader2,
  Pencil,
  Plus,
  Search,
  Send,
  Star,
  Trash2,
  Undo2,
  Video,
} from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { StoryPreviewDialog } from "@/components/admin/story-preview-dialog";
import {
  adminDeleteStory,
  adminListStories,
  adminReorderStories,
  adminStoryAction,
  type AdminStory,
  type StoryStatus,
} from "@/lib/data/success-stories-api";

const TABS: { id: "" | StoryStatus; label: string; count: "ALL" | StoryStatus }[] = [
  { id: "", label: "All", count: "ALL" },
  { id: "DRAFT", label: "Drafts", count: "DRAFT" },
  { id: "PUBLISHED", label: "Published", count: "PUBLISHED" },
];
const BADGE: Record<StoryStatus, string> = {
  DRAFT: "bg-slate-100 text-slate-700 ring-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-600",
  PUBLISHED: "bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900/60",
};
const iconBtn =
  "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800";
const errMsg = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong.");

type Data = Awaited<ReturnType<typeof adminListStories>>;

function ConfirmDelete({
  story,
  busy,
  onCancel,
  onConfirm,
}: {
  story: AdminStory;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  useEffect(() => cancelRef.current?.focus(), []);
  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="del-title"
      aria-describedby="del-desc"
      onKeyDown={(e) => e.key === "Escape" && !busy && onCancel()}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/60 p-4"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
        <h2 id="del-title" className="text-base font-bold text-slate-900 dark:text-white">
          Delete this story?
        </h2>
        <p id="del-desc" className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          <strong>{story.studentName}</strong>: &ldquo;{story.title}&rdquo; will be permanently removed.
          {story.bunnyVideoId
            ? " Its uploaded video is deleted too, unless another story or course lesson uses the same video."
            : ""}{" "}
          This cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button ref={cancelRef} type="button" disabled={busy} onClick={onCancel} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
            Cancel
          </button>
          <button type="button" disabled={busy} onClick={onConfirm} className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60">
            {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />} Delete story
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminSuccessStoriesPage() {
  const [tab, setTab] = useState<"" | StoryStatus>("");
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [preview, setPreview] = useState<AdminStory | null>(null);
  const [toDelete, setToDelete] = useState<AdminStory | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setQuery(q.trim()), 350);
    return () => clearTimeout(t);
  }, [q]);

  const [reloadKey, setReloadKey] = useState(0);
  const load = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    let alive = true;
    adminListStories({ status: tab || undefined, q: query || undefined })
      .then((d) => {
        if (!alive) return;
        setData(d);
        setError(null);
      })
      .catch((e) => {
        if (!alive) return;
        setError(errMsg(e));
        setData((d) => d ?? { items: [], total: 0, page: 1, pageSize: 100, totalPages: 1, counts: { DRAFT: 0, PUBLISHED: 0, ALL: 0 } });
      });
    return () => {
      alive = false;
    };
  }, [tab, query, reloadKey]);

  async function run(id: string, fn: () => Promise<unknown>, done?: string) {
    setBusyId(id);
    setError(null);
    setNotice(null);
    try {
      await fn();
      if (done) setNotice(done);
      load();
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setBusyId(null);
    }
  }

  const canReorder = !tab && !query && !!data && data.total <= data.pageSize;

  function move(index: number, dir: -1 | 1) {
    if (!data) return;
    const ids = data.items.map((s) => s.id);
    const j = index + dir;
    if (j < 0 || j >= ids.length) return;
    [ids[index], ids[j]] = [ids[j], ids[index]];
    void run(ids[j], () => adminReorderStories(ids), "Order updated.");
  }

  async function confirmDelete() {
    if (!toDelete) return;
    const s = toDelete;
    setBusyId(s.id);
    try {
      const r = await adminDeleteStory(s.id);
      setNotice(
        s.bunnyVideoId
          ? r.mediaDeleted
            ? "Story and its uploaded video were deleted."
            : "Story deleted. The video was kept because another story or lesson still uses it."
          : "Story deleted.",
      );
      setToDelete(null);
      load();
    } catch (e) {
      setError(errMsg(e));
      setToDelete(null);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <DashboardTopbar title="Success Stories" subtitle="Create, publish and feature student stories for the public page." />
      <div className="flex-1 space-y-4 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by status">
            {TABS.map((t) => (
              <button
                key={t.label}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  tab === t.id ? "bg-[#1E5EFF] text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-surface-elevated dark:text-slate-300 dark:ring-slate-700"
                }`}
              >
                {t.label}
                {data ? <span className="ml-1.5 opacity-80">{data.counts[t.count]}</span> : null}
              </button>
            ))}
          </div>
          <div className="ml-auto flex w-full flex-wrap gap-2 sm:w-auto">
            <div className="relative flex-1 sm:w-56">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search stories" aria-label="Search stories" className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[#1E5EFF] focus:ring-2 focus:ring-[#1E5EFF]/20 dark:border-slate-700 dark:bg-slate-900" />
            </div>
            <Link href="/success-stories" target="_blank" className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
              <ExternalLink className="h-4 w-4" aria-hidden="true" /> View page
            </Link>
            <Link href="/admin/success-stories/new" className="inline-flex items-center gap-1.5 rounded-xl bg-[#1E5EFF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1649CC]">
              <Plus className="h-4 w-4" aria-hidden="true" /> New story
            </Link>
          </div>
        </div>

        {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">{error}</div>}
        {notice && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300">{notice}</div>}

        <div className="overflow-hidden rounded-[20px] border border-white/70 bg-white/80 shadow-[0_8px_30px_rgb(20,50,100,0.06)] dark:border-slate-800/80 dark:bg-surface-secondary/90 dark:shadow-none">
          {data === null ? (
            <p className="flex items-center gap-2 p-6 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Loading stories…</p>
          ) : data.items.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
              {tab || query ? "No stories match this view." : "No success stories yet."}{" "}
              <Link href="/admin/success-stories/new" className="font-semibold text-[#1A52E0] hover:underline dark:text-blue-300">Add the first one</Link>.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-xs">
                <thead className="border-b border-slate-100 text-[11px] uppercase tracking-wide text-slate-500 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Story</th>
                    <th className="px-4 py-3">Course</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.items.map((s, i) => {
                    const busy = busyId === s.id;
                    return (
                      <tr key={s.id}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                            {s.featured && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" aria-label="Featured on the hero" />}
                            {s.studentName}
                            {s.video && <Video className="h-3.5 w-3.5 text-slate-400" aria-label="Has video" />}
                          </div>
                          <div className="text-slate-500 dark:text-slate-400">{s.title}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{s.course ?? "–"}</td>
                        <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase ring-1 ${BADGE[s.status]}`}>{s.status}</span></td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1.5">
                            {canReorder && (
                              <>
                                <button disabled={busy || i === 0} onClick={() => move(i, -1)} className={iconBtn} aria-label={`Move ${s.studentName} up`} title="Move up"><ArrowUp className="h-3.5 w-3.5" /></button>
                                <button disabled={busy || i === data.items.length - 1} onClick={() => move(i, 1)} className={iconBtn} aria-label={`Move ${s.studentName} down`} title="Move down"><ArrowDown className="h-3.5 w-3.5" /></button>
                              </>
                            )}
                            <button onClick={() => setPreview(s)} className={iconBtn} aria-label={`Preview ${s.studentName}`} title="Preview"><Eye className="h-3.5 w-3.5" /></button>
                            <Link href={`/admin/success-stories/${s.id}/edit`} className={iconBtn} aria-label={`Edit ${s.studentName}`} title="Edit"><Pencil className="h-3.5 w-3.5" /></Link>
                            {s.status === "PUBLISHED" && (
                              <button disabled={busy} onClick={() => run(s.id, () => adminStoryAction(s.id, s.featured ? "unfeature" : "feature"), s.featured ? "Removed from the hero." : `${s.studentName} is now the hero story.`)} className={`${iconBtn} ${s.featured ? "text-amber-600" : ""}`} aria-pressed={s.featured} aria-label={s.featured ? `Unfeature ${s.studentName}` : `Feature ${s.studentName} on the hero`} title={s.featured ? "Unfeature" : "Feature on hero"}><Star className={`h-3.5 w-3.5 ${s.featured ? "fill-current" : ""}`} /></button>
                            )}
                            {s.status === "DRAFT" ? (
                              <button disabled={busy} onClick={() => run(s.id, () => adminStoryAction(s.id, "publish"), `${s.studentName}'s story is live.`)} className={`${iconBtn} text-emerald-700`} aria-label={`Publish ${s.studentName}`} title="Publish"><Send className="h-3.5 w-3.5" /></button>
                            ) : (
                              <button disabled={busy} onClick={() => run(s.id, () => adminStoryAction(s.id, "unpublish"), `${s.studentName}'s story is now a draft.`)} className={iconBtn} aria-label={`Unpublish ${s.studentName}`} title="Unpublish"><Undo2 className="h-3.5 w-3.5" /></button>
                            )}
                            <button disabled={busy} onClick={() => setToDelete(s)} className={`${iconBtn} text-rose-600`} aria-label={`Delete ${s.studentName}`} title="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                            {busy && <Loader2 className="ml-1 h-4 w-4 animate-spin self-center text-slate-400" aria-label="Working" />}
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
        {!canReorder && data && data.items.length > 1 && (
          <p className="text-xs text-slate-500 dark:text-slate-400">Reordering is available in the unfiltered &ldquo;All&rdquo; view.</p>
        )}
      </div>

      {toDelete && <ConfirmDelete story={toDelete} busy={busyId === toDelete.id} onCancel={() => setToDelete(null)} onConfirm={confirmDelete} />}
      <StoryPreviewDialog story={preview} onClose={() => setPreview(null)} />
    </>
  );
}
