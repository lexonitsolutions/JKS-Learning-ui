"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Copy, Eye, Loader2, Pencil, Plus, Power, Search, Trash2, UserCog, Users, X } from "lucide-react";
import {
  createHead,
  deleteHead,
  getHeadOverview,
  listHeads,
  listInstructorsWithHead,
  setHeadInstructors,
  updateHead,
  type HeadOverview,
  type HeadSummary,
  type InstructorWithHead,
} from "@/lib/api/org-api";

const INPUT =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#2563EB] dark:border-slate-700 dark:bg-input-bg dark:text-white";
const LABEL = "block text-[11px] font-semibold text-slate-600 dark:text-slate-300";
const errMsg = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong. Please try again.");

function randomPassword(): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  const bytes = new Uint32Array(12);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

export function HeadsManager() {
  const [heads, setHeads] = useState<HeadSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<HeadSummary | null>(null);
  const [managing, setManaging] = useState<HeadSummary | null>(null);
  const [overview, setOverview] = useState<HeadOverview | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setHeads(await listHeads());
    } catch (e) {
      setHeads([]);
      setError(errMsg(e));
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (heads ?? []).filter((h) => !q || h.name.toLowerCase().includes(q) || h.email.toLowerCase().includes(q));
  }, [heads, query]);

  async function toggleActive(h: HeadSummary) {
    const deactivate = h.status !== "BLOCKED";
    const verb = deactivate ? "Deactivate" : "Reactivate";
    if (
      !window.confirm(
        deactivate
          ? `Deactivate ${h.name}? They will be signed out and unable to log in. Their instructors and batches stay assigned.`
          : `Reactivate ${h.name}?`,
      )
    ) {
      return;
    }
    try {
      await updateHead(h.id, { status: deactivate ? "BLOCKED" : "ACTIVE" });
      setNotice(`${verb}d ${h.name}.`);
      await load();
    } catch (e) {
      setError(errMsg(e));
    }
  }

  async function removeHead(h: HeadSummary) {
    if (
      !window.confirm(
        `Permanently delete ${h.name}? Their ${h.instructorCount} instructor(s) and ${h.batchCount} batch(es) are kept but left without a head. This cannot be undone.`,
      )
    ) {
      return;
    }
    try {
      await deleteHead(h.id);
      setNotice(`Deleted ${h.name}.`);
      await load();
    } catch (e) {
      setError(errMsg(e));
    }
  }

  async function openOverview(h: HeadSummary) {
    setError(null);
    try {
      setOverview(await getHeadOverview(h.id));
    } catch (e) {
      setError(errMsg(e));
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-1.5 text-sm font-bold text-slate-900 dark:text-white">
            <UserCog className="h-4 w-4 text-[#2563EB]" /> Heads / HODs
          </h3>
          <p className="text-xs text-slate-500">
            A head supervises instructors and can view their assigned batches. Heads do not get administrator access.
          </p>
        </div>
        <button type="button" onClick={() => setCreating(true)} className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700">
          <Plus className="h-3.5 w-3.5" /> New head
        </button>
      </div>

      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search heads" aria-label="Search heads" className={`${INPUT} pl-9`} />
      </div>

      {notice && (
        <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-300">
          {notice}
        </p>
      )}
      {error && (
        <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">
          {error}{" "}
          <button type="button" onClick={load} className="font-bold underline">
            Retry
          </button>
        </p>
      )}

      {heads === null ? (
        <p className="flex items-center gap-2 py-8 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading heads…
        </p>
      ) : filtered.length === 0 && !error ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{heads.length === 0 ? "No heads yet" : "No heads match your search"}</p>
          {heads.length === 0 && <p className="mt-1 text-xs text-slate-500">Create a head, then assign instructors and batches to them.</p>}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-surface-secondary">
          <table className="w-full min-w-[680px] text-left text-xs">
            <thead className="border-b border-slate-100 text-[11px] uppercase tracking-wide text-slate-500 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Head</th>
                <th className="px-4 py-3">Instructors</th>
                <th className="px-4 py-3">Batches</th>
                <th className="px-4 py-3">Students</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((h) => {
                const inactive = h.status === "BLOCKED";
                return (
                  <tr key={h.id}>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900 dark:text-white">{h.name}</div>
                      <div className="text-slate-500">{h.email}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">{h.instructorCount}</td>
                    <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">{h.batchCount}</td>
                    <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">{h.studentCount}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${inactive ? "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200"}`}>
                        {inactive ? "Deactivated" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap justify-end gap-1.5">
                        <IconBtn label={`View ${h.name}`} onClick={() => openOverview(h)}><Eye className="h-3.5 w-3.5" /></IconBtn>
                        <IconBtn label={`Manage instructors of ${h.name}`} onClick={() => setManaging(h)}><Users className="h-3.5 w-3.5" /></IconBtn>
                        <IconBtn label={`Edit ${h.name}`} onClick={() => setEditing(h)}><Pencil className="h-3.5 w-3.5" /></IconBtn>
                        <IconBtn label={inactive ? `Reactivate ${h.name}` : `Deactivate ${h.name}`} onClick={() => toggleActive(h)} danger={!inactive}>
                          <Power className="h-3.5 w-3.5" />
                        </IconBtn>
                        <IconBtn label={`Delete ${h.name}`} onClick={() => removeHead(h)} danger>
                          <Trash2 className="h-3.5 w-3.5" />
                        </IconBtn>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {creating && (
        <CreateHeadModal
          onClose={() => setCreating(false)}
          onCreated={async () => {
            await load();
          }}
        />
      )}
      {editing && (
        <EditHeadModal
          head={editing}
          onClose={() => setEditing(null)}
          onSaved={async () => {
            setEditing(null);
            setNotice("Head updated.");
            await load();
          }}
        />
      )}
      {managing && (
        <ManageInstructorsModal
          head={managing}
          onClose={() => setManaging(null)}
          onSaved={async (msg) => {
            setManaging(null);
            setNotice(msg);
            await load();
          }}
        />
      )}
      {overview && <OverviewModal data={overview} onClose={() => setOverview(null)} />}
    </div>
  );
}

function IconBtn({ label, onClick, danger, children }: { label: string; onClick: () => void; danger?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-surface-hover ${danger ? "hover:text-rose-600" : ""}`}
    >
      {children}
    </button>
  );
}

/* ── Modals ──────────────────────────────────────────────────────────── */

function CreateHeadModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void | Promise<void> }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState(() => randomPassword());
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [created, setCreated] = useState<{ email: string; password: string } | null>(null);
  const [copied, setCopied] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const res = await createHead({ name: name.trim(), email: email.trim(), password, phone: phone.trim() || undefined });
      setCreated({ email: res.email, password: res.initialPassword });
      await onCreated();
    } catch (e2) {
      setErr(errMsg(e2));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal title={created ? "Head created" : "New head"} onClose={onClose}>
      {created ? (
        <div className="space-y-3 text-xs">
          <p className="text-slate-600 dark:text-slate-300">
            Share these sign-in details with the head. The password is shown only now and is stored hashed.
          </p>
          <div className="rounded-xl border border-slate-200 p-3 font-mono dark:border-slate-700">
            <div>{created.email}</div>
            <div className="font-bold">{created.password}</div>
          </div>
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(`${created.email}\n${created.password}`);
                setCopied(true);
              } catch {
                setErr("Copy failed. Select the text and copy it manually.");
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-surface-hover"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} {copied ? "Copied" : "Copy details"}
          </button>
          {err && <p role="alert" className="text-rose-600">{err}</p>}
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="rounded-xl bg-[#2563EB] px-5 py-2 text-xs font-bold text-white hover:bg-blue-700">
              Done
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-3">
          <label className={LABEL}>
            Full name
            <input className={`${INPUT} mt-1`} value={name} onChange={(e) => setName(e.target.value)} maxLength={120} required />
          </label>
          <label className={LABEL}>
            Email
            <input type="email" className={`${INPUT} mt-1`} value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className={LABEL}>
            Phone (optional)
            <input className={`${INPUT} mt-1`} value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={30} />
          </label>
          <label className={LABEL}>
            Initial password
            <div className="mt-1 flex gap-2">
              <input className={`${INPUT} font-mono`} value={password} onChange={(e) => setPassword(e.target.value)} minLength={5} required />
              <button type="button" onClick={() => setPassword(randomPassword())} className="shrink-0 rounded-xl border border-slate-200 px-3 text-xs font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-surface-hover">
                Generate
              </button>
            </div>
          </label>
          {err && <p role="alert" className="text-xs font-semibold text-rose-600 dark:text-rose-400">{err}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} disabled={busy} className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-surface-hover">Cancel</button>
            <button type="submit" disabled={busy || name.trim().length < 2 || !email || password.length < 5} className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50">
              {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Create head
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}

function EditHeadModal({ head, onClose, onSaved }: { head: HeadSummary; onClose: () => void; onSaved: () => void | Promise<void> }) {
  const [name, setName] = useState(head.name);
  const [phone, setPhone] = useState(head.phone ?? "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      await updateHead(head.id, { name: name.trim(), phone: phone.trim() });
      await onSaved();
    } catch (e2) {
      setErr(errMsg(e2));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal title="Edit head" subtitle={head.email} onClose={onClose}>
      <form onSubmit={submit} className="space-y-3">
        <label className={LABEL}>
          Full name
          <input className={`${INPUT} mt-1`} value={name} onChange={(e) => setName(e.target.value)} maxLength={120} required />
        </label>
        <label className={LABEL}>
          Phone
          <input className={`${INPUT} mt-1`} value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={30} />
        </label>
        {err && <p role="alert" className="text-xs font-semibold text-rose-600 dark:text-rose-400">{err}</p>}
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} disabled={busy} className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-surface-hover">Cancel</button>
          <button type="submit" disabled={busy || name.trim().length < 2} className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50">
            {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Save
          </button>
        </div>
      </form>
    </Modal>
  );
}

function ManageInstructorsModal({ head, onClose, onSaved }: { head: HeadSummary; onClose: () => void; onSaved: (message: string) => void | Promise<void> }) {
  const [all, setAll] = useState<InstructorWithHead[] | null>(null);
  const [heads, setHeads] = useState<HeadSummary[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([listInstructorsWithHead(), listHeads()])
      .then(([ins, hs]) => {
        setAll(ins);
        setHeads(hs);
        setSelected(new Set(ins.filter((i) => i.headId === head.id).map((i) => i.id)));
      })
      .catch((e) => {
        setAll([]);
        setErr(errMsg(e));
      });
  }, [head.id]);

  const headName = (id: string | null) => heads.find((h) => h.id === id)?.name;
  const shown = (all ?? []).filter((i) => {
    const q = search.trim().toLowerCase();
    return !q || i.name.toLowerCase().includes(q) || i.email.toLowerCase().includes(q);
  });

  async function save() {
    setBusy(true);
    setErr(null);
    try {
      const res = await setHeadInstructors(head.id, Array.from(selected));
      await onSaved(`Updated ${head.name}: ${res.assigned} instructor(s) assigned${res.released ? `, ${res.released} released` : ""}.`);
    } catch (e) {
      setErr(errMsg(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal title={`Instructors of ${head.name}`} subtitle="Tick the instructors this head supervises. An instructor reports to one head, so ticking one that has another head moves them." onClose={onClose} wide>
      <div className="space-y-3 text-xs">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search instructors" aria-label="Search instructors" className={INPUT} />
        {all === null ? (
          <p className="flex items-center gap-2 text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</p>
        ) : shown.length === 0 ? (
          <p className="text-slate-500">No instructors found.</p>
        ) : (
          <ul className="max-h-72 divide-y divide-slate-100 overflow-y-auto rounded-xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
            {shown.map((i) => {
              const other = i.headId && i.headId !== head.id ? headName(i.headId) : null;
              return (
                <li key={i.id}>
                  <label className="flex cursor-pointer items-center gap-3 px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-surface-hover">
                    <input
                      type="checkbox"
                      checked={selected.has(i.id)}
                      onChange={() =>
                        setSelected((prev) => {
                          const n = new Set(prev);
                          if (n.has(i.id)) n.delete(i.id);
                          else n.add(i.id);
                          return n;
                        })
                      }
                      className="h-4 w-4 accent-[#2563EB]"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-slate-900 dark:text-white">{i.name}</span>
                      <span className="block truncate text-slate-500">{i.email}</span>
                    </span>
                    {other && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-400/15 dark:text-amber-200">Currently under {other}</span>}
                  </label>
                </li>
              );
            })}
          </ul>
        )}
        {err && <p role="alert" className="font-semibold text-rose-600 dark:text-rose-400">{err}</p>}
        <div className="flex items-center justify-between pt-1">
          <span className="text-slate-500">{selected.size} selected</span>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} disabled={busy} className="rounded-xl px-4 py-2 font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-surface-hover">Cancel</button>
            <button type="button" onClick={save} disabled={busy || all === null} className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2 font-bold text-white hover:bg-blue-700 disabled:opacity-50">
              {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Save assignments
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function OverviewModal({ data, onClose }: { data: HeadOverview; onClose: () => void }) {
  return (
    <Modal title={data.head.name} subtitle={data.head.email} onClose={onClose} wide>
      <div className="space-y-5 text-xs">
        <section>
          <h4 className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">Instructors ({data.instructors.length})</h4>
          {data.instructors.length === 0 ? (
            <p className="text-slate-500">No instructors yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
              {data.instructors.map((i) => (
                <li key={i.id} className="flex items-center justify-between gap-2 px-3 py-2">
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-slate-900 dark:text-white">{i.name}</span>
                    <span className="block truncate text-slate-500">{i.email}</span>
                  </span>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${i.supervised ? "bg-blue-100 text-blue-800 dark:bg-blue-400/15 dark:text-blue-200" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}>
                    {i.supervised ? "Supervised" : "Teaches a batch of this head"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section>
          <h4 className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">Batches ({data.batches.length})</h4>
          {data.batches.length === 0 ? (
            <p className="text-slate-500">No batches assigned.</p>
          ) : (
            <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
              {data.batches.map((b) => (
                <li key={b.id} className="flex items-center justify-between gap-2 px-3 py-2">
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-slate-900 dark:text-white">{b.name}</span>
                    <span className="block truncate text-slate-500">{b.courseTitle ?? "No course"}</span>
                  </span>
                  <span className="shrink-0 text-slate-500">{b.instructorCount} instr. · {b.studentCount} students</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </Modal>
  );
}

function Modal({ title, subtitle, onClose, wide, children }: { title: string; subtitle?: string; onClose: () => void; wide?: boolean; children: React.ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  if (typeof document === "undefined") return null;
  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs dark:bg-black/75" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()} className={`flex max-h-[90vh] w-full flex-col rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-surface-secondary ${wide ? "max-w-2xl" : "max-w-md"}`}>
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-5 dark:border-slate-800">
          <div className="min-w-0">
            <h3 className="truncate text-base font-black text-slate-900 dark:text-white">{title}</h3>
            {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-surface-hover">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-y-auto p-5">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
