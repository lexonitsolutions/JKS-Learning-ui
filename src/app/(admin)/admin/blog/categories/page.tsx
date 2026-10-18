"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import {
  adminBlogCategories,
  adminBlogTags,
  adminDeleteCategory,
  adminDeleteTag,
  adminRenameTag,
  adminSaveCategory,
  type AdminCategory,
} from "@/lib/data/blog-api";

const errMsg = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong.");
const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#1E5EFF] focus:ring-2 focus:ring-[#1E5EFF]/20 dark:border-slate-700 dark:bg-slate-900";
const card = "rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-surface-secondary/90";

export default function BlogTaxonomyPage() {
  const [cats, setCats] = useState<AdminCategory[] | null>(null);
  const [tags, setTags] = useState<{ tag: string; count: number }[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameTo, setRenameTo] = useState("");

  const load = useCallback(async () => {
    try {
      const [c, t] = await Promise.all([adminBlogCategories(), adminBlogTags()]);
      setCats(c);
      setTags(t);
      setError(null);
    } catch (e) {
      setError(errMsg(e));
      setCats((c) => c ?? []);
      setTags((t) => t ?? []);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function startEdit(c: AdminCategory | null) {
    setEditingId(c ? c.id : "new");
    setName(c?.name ?? "");
    setDescription(c?.description ?? "");
  }

  async function saveCategory() {
    setSaving(true);
    setError(null);
    try {
      await adminSaveCategory(editingId === "new" ? null : editingId, { name, description: description || undefined });
      setEditingId(null);
      await load();
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setSaving(false);
    }
  }

  async function guarded(fn: () => Promise<unknown>) {
    setError(null);
    try {
      await fn();
      await load();
    } catch (e) {
      setError(errMsg(e));
    }
  }

  return (
    <>
      <DashboardTopbar title="Categories & Tags" subtitle="Manage how blog articles are organised." />
      <div className="flex-1 space-y-5 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4">
        <Link href="/admin/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1A52E0] hover:underline dark:text-blue-300"><ArrowLeft className="h-4 w-4" /> All articles</Link>
        {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">{error}</div>}

        <div className="grid gap-5 lg:grid-cols-2">
          <section className={card} aria-labelledby="cats-h">
            <div className="mb-4 flex items-center justify-between">
              <h2 id="cats-h" className="text-sm font-bold text-slate-900 dark:text-white">Categories</h2>
              <button onClick={() => startEdit(null)} className="inline-flex items-center gap-1.5 rounded-lg bg-[#1E5EFF] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1649CC]"><Plus className="h-3.5 w-3.5" /> Add</button>
            </div>

            {editingId && (
              <div className="mb-4 space-y-2 rounded-xl border border-[#1E5EFF]/30 bg-[#1E5EFF]/5 p-3">
                <input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} placeholder="Category name" aria-label="Category name" className={inputCls} />
                <input value={description} onChange={(e) => setDescription(e.target.value)} maxLength={200} placeholder="Short description (optional)" aria-label="Description" className={inputCls} />
                <div className="flex gap-2">
                  <button disabled={saving || name.trim().length < 2} onClick={saveCategory} className="inline-flex items-center gap-1.5 rounded-lg bg-[#1E5EFF] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50">{saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />} Save</button>
                  <button onClick={() => setEditingId(null)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold dark:border-slate-700">Cancel</button>
                </div>
              </div>
            )}

            {cats === null ? <p className="flex items-center gap-2 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</p> : cats.length === 0 ? <p className="text-sm text-slate-500">No categories yet.</p> : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {cats.map((c) => (
                  <li key={c.id} className="flex items-center gap-3 py-2.5">
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-slate-900 dark:text-white">{c.name}</div>
                      <div className="truncate text-xs text-slate-500">/{c.slug} · {c.articleCount} article{c.articleCount === 1 ? "" : "s"}</div>
                    </div>
                    <button onClick={() => startEdit(c)} aria-label={`Rename ${c.name}`} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"><Pencil className="h-4 w-4" /></button>
                    <button
                      onClick={() => window.confirm(`Delete the category "${c.name}"?`) && guarded(() => adminDeleteCategory(c.id))}
                      aria-label={`Delete ${c.name}`}
                      className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className={card} aria-labelledby="tags-h">
            <h2 id="tags-h" className="mb-1 text-sm font-bold text-slate-900 dark:text-white">Tags</h2>
            <p className="mb-4 text-xs text-slate-500">Tags are created when you add them to an article. Rename or remove them across all articles here.</p>
            {tags === null ? <p className="flex items-center gap-2 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</p> : tags.length === 0 ? <p className="text-sm text-slate-500">No tags yet.</p> : (
              <ul className="flex flex-wrap gap-2">
                {tags.map((t) =>
                  renaming === t.tag ? (
                    <li key={t.tag} className="flex items-center gap-1">
                      <input autoFocus value={renameTo} onChange={(e) => setRenameTo(e.target.value)} maxLength={40} aria-label={`New name for ${t.tag}`} className="w-32 rounded-lg border border-slate-200 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900" />
                      <button aria-label="Confirm rename" onClick={async () => { await guarded(() => adminRenameTag(t.tag, renameTo)); setRenaming(null); }} className="rounded-lg p-1 text-emerald-600 hover:bg-emerald-50"><Check className="h-4 w-4" /></button>
                      <button aria-label="Cancel rename" onClick={() => setRenaming(null)} className="rounded-lg p-1 text-slate-500 hover:bg-slate-100"><X className="h-4 w-4" /></button>
                    </li>
                  ) : (
                    <li key={t.tag} className="group inline-flex items-center gap-1.5 rounded-full bg-slate-100 py-1 pl-3 pr-1.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      #{t.tag} <span className="font-normal text-slate-400">{t.count}</span>
                      <button aria-label={`Rename ${t.tag}`} onClick={() => { setRenaming(t.tag); setRenameTo(t.tag); }} className="rounded-full p-1 hover:bg-white dark:hover:bg-slate-700"><Pencil className="h-3 w-3" /></button>
                      <button aria-label={`Remove ${t.tag}`} onClick={() => window.confirm(`Remove "${t.tag}" from ${t.count} article(s)?`) && guarded(() => adminDeleteTag(t.tag))} className="rounded-full p-1 text-rose-600 hover:bg-white dark:hover:bg-slate-700"><X className="h-3 w-3" /></button>
                    </li>
                  ),
                )}
              </ul>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
