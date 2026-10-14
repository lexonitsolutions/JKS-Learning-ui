"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Calendar, GraduationCap, Layers, Loader2, Pencil, Plus, Search, Trash2, UserMinus, UserPlus, Users, X } from "lucide-react";
import { apiFetch } from "@/lib/api/base-url";
import {
  assignBatch,
  createBatch,
  deleteBatch,
  fetchCandidateStudents,
  getBatch,
  listBatches,
  listHeads,
  listInstructorsWithHead,
  updateBatch,
  type HeadSummary,
  type InstructorWithHead,
  type ManagedBatch,
} from "@/lib/api/org-api";
import { StudentPickerModal } from "./student-picker-modal";

type Role = "admin" | "instructor" | "head";

const INPUT =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#2563EB] dark:border-slate-700 dark:bg-input-bg dark:text-white";
const LABEL = "block text-[11px] font-semibold text-slate-600 dark:text-slate-300";
const errMsg = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong. Please try again.");

const STATUS_STYLE: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200",
  COMPLETED: "bg-blue-100 text-blue-800 dark:bg-blue-400/15 dark:text-blue-200",
  ARCHIVED: "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
};

const fmtDate = (d: string | null) => (d ? new Date(d).toLocaleDateString() : "—");

interface CourseOption {
  id: string;
  title: string;
}

export function ManagedBatches({ role }: { role: Role }) {
  const isAdmin = role === "admin";
  const [batches, setBatches] = useState<ManagedBatch[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ACTIVE");

  const [detail, setDetail] = useState<ManagedBatch | null>(null);
  const [form, setForm] = useState<ManagedBatch | "new" | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setBatches(await listBatches());
    } catch (e) {
      setBatches([]);
      setError(errMsg(e));
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (batches ?? []).filter(
      (b) =>
        (status === "ALL" || b.status === status) &&
        (!q || [b.name, b.courseTitle, b.head?.name].some((v) => v?.toLowerCase().includes(q))),
    );
  }, [batches, query, status]);

  async function openDetail(id: string) {
    setError(null);
    try {
      setDetail(await getBatch(id));
    } catch (e) {
      setError(errMsg(e));
    }
  }

  async function remove(b: ManagedBatch) {
    if (!window.confirm(`Delete batch "${b.name}"? Students and instructors are not affected, only the batch grouping is removed.`)) return;
    try {
      await deleteBatch(b.id);
      setNotice("Batch deleted.");
      setDetail(null);
      await load();
    } catch (e) {
      setError(errMsg(e));
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-1.5 text-sm font-bold text-slate-900 dark:text-white">
            <Layers className="h-4 w-4 text-[#2563EB]" /> {isAdmin ? "Managed batches" : role === "head" ? "Your batches" : "Your assigned batches"}
          </h3>
          <p className="text-xs text-slate-500">
            {isAdmin
              ? "Create batches, then assign a head, instructors and students."
              : role === "head"
              ? "Batches assigned to you, plus batches taught by instructors you supervise."
              : "Batches you teach."}
          </p>
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={() => setForm("new")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700"
          >
            <Plus className="h-3.5 w-3.5" /> New batch
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search batches" aria-label="Search batches" className={`${INPUT} pl-9`} />
        </div>
        <div role="tablist" aria-label="Status" className="flex gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-surface-elevated">
          {["ACTIVE", "COMPLETED", "ARCHIVED", "ALL"].map((s) => (
            <button
              key={s}
              type="button"
              role="tab"
              aria-selected={status === s}
              onClick={() => setStatus(s)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold ${status === s ? "bg-[#2563EB] text-white" : "text-slate-600 dark:text-slate-300"}`}
            >
              {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
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

      {batches === null ? (
        <p className="flex items-center gap-2 py-8 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading batches…
        </p>
      ) : visible.length === 0 && !error ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {batches.length === 0 ? (isAdmin ? "No batches yet" : "No batches have been assigned to you yet") : "No batches match your filters"}
          </p>
          {isAdmin && batches.length === 0 && <p className="mt-1 text-xs text-slate-500">Create the first batch to start grouping students.</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((b) => (
            <div key={b.id} className="flex flex-col justify-between space-y-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-surface-secondary">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-[11px] font-semibold text-slate-500">{b.courseTitle || "No course linked"}</span>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${STATUS_STYLE[b.status] ?? STATUS_STYLE.ARCHIVED}`}>
                    {b.status.charAt(0) + b.status.slice(1).toLowerCase()}
                  </span>
                </div>
                <h4 className="text-sm font-bold leading-snug text-slate-900 dark:text-white">{b.name}</h4>
                <dl className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5"><GraduationCap className="h-3.5 w-3.5" /> Head: <span className="font-semibold text-slate-700 dark:text-slate-200">{b.head?.name ?? "Unassigned"}</span></div>
                  <div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {b.instructorCount} instructor(s) · {b.studentCount} student(s)</div>
                  {(b.startDate || b.schedule) && (
                    <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {b.schedule || ""} {b.startDate ? `· from ${fmtDate(b.startDate)}` : ""}</div>
                  )}
                </dl>
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-2 dark:border-slate-800">
                <button type="button" onClick={() => openDetail(b.id)} className="rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-surface-hover">
                  {isAdmin ? "Manage" : "View"}
                </button>
                {isAdmin && (
                  <div className="flex gap-1">
                    <button type="button" aria-label={`Edit ${b.name}`} onClick={() => setForm(b)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" aria-label={`Delete ${b.name}`} onClick={() => remove(b)} className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {detail && (
        <BatchDetailModal
          batch={detail}
          isAdmin={isAdmin}
          role={role}
          onClose={() => setDetail(null)}
          onChanged={async (updated, message) => {
            setDetail(updated);
            if (message) setNotice(message);
            await load();
          }}
        />
      )}

      {form && (
        <BatchFormModal
          batch={form === "new" ? null : form}
          onClose={() => setForm(null)}
          onSaved={async (b) => {
            setForm(null);
            setNotice(form === "new" ? "Batch created." : "Batch updated.");
            await load();
            if (form === "new") setDetail(b);
          }}
        />
      )}
    </div>
  );
}

/* ── Create / edit ───────────────────────────────────────────────────── */

function BatchFormModal({
  batch,
  onClose,
  onSaved,
}: {
  batch: ManagedBatch | null;
  onClose: () => void;
  onSaved: (b: ManagedBatch) => void;
}) {
  const [name, setName] = useState(batch?.name ?? "");
  const [description, setDescription] = useState(batch?.description ?? "");
  const [courseId, setCourseId] = useState(batch?.courseId ?? "");
  const [schedule, setSchedule] = useState(batch?.schedule ?? "");
  const [start, setStart] = useState(batch?.startDate?.slice(0, 10) ?? "");
  const [end, setEnd] = useState(batch?.endDate?.slice(0, 10) ?? "");
  const [status, setStatus] = useState(batch?.status ?? "ACTIVE");
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    apiFetch("/courses")
      .then((r) => (r.ok ? r.json() : []))
      .then((list: { id: string; title: string }[]) =>
        setCourses(Array.isArray(list) ? list.map((c) => ({ id: c.id, title: c.title })) : []),
      )
      .catch(() => setCourses([]));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        schedule: schedule.trim(),
        courseId,
        startDate: start,
        endDate: end,
      };
      const saved = batch
        ? await updateBatch(batch.id, { ...payload, status })
        : await createBatch({
            ...payload,
            // Empty strings are omitted for a new batch.
            description: payload.description || undefined,
            schedule: payload.schedule || undefined,
            courseId: payload.courseId || undefined,
            startDate: payload.startDate || undefined,
            endDate: payload.endDate || undefined,
          });
      onSaved(saved);
    } catch (e2) {
      setErr(errMsg(e2));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal title={batch ? "Edit batch" : "New batch"} onClose={busy ? () => undefined : onClose}>
      <form onSubmit={submit} className="space-y-3">
        <label className={LABEL}>
          Batch name
          <input className={`${INPUT} mt-1`} value={name} onChange={(e) => setName(e.target.value)} maxLength={120} required />
        </label>
        <label className={LABEL}>
          Course (optional)
          <select className={`${INPUT} mt-1`} value={courseId} onChange={(e) => setCourseId(e.target.value)}>
            <option value="">No course linked</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
          <span className="mt-0.5 block text-[10.5px] font-normal text-slate-500">When a course is linked, only students enrolled in it can be added.</span>
        </label>
        <label className={LABEL}>
          Schedule
          <input className={`${INPUT} mt-1`} value={schedule} onChange={(e) => setSchedule(e.target.value)} maxLength={120} placeholder="e.g. Mon–Fri, 8:00–10:00 AM" />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className={LABEL}>
            Start date
            <input type="date" className={`${INPUT} mt-1`} value={start} onChange={(e) => setStart(e.target.value)} />
          </label>
          <label className={LABEL}>
            End date
            <input type="date" className={`${INPUT} mt-1`} value={end} onChange={(e) => setEnd(e.target.value)} />
          </label>
        </div>
        {batch && (
          <label className={LABEL}>
            Status
            <select className={`${INPUT} mt-1`} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </label>
        )}
        <label className={LABEL}>
          Description
          <textarea className={`${INPUT} mt-1`} rows={2} value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} />
        </label>
        {err && (
          <p role="alert" className="text-xs font-semibold text-rose-600 dark:text-rose-400">
            {err}
          </p>
        )}
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} disabled={busy} className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-surface-hover">
            Cancel
          </button>
          <button type="submit" disabled={busy || name.trim().length < 2} className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50">
            {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {batch ? "Save changes" : "Create batch"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* ── Detail and assignments ──────────────────────────────────────────── */

function BatchDetailModal({
  batch,
  isAdmin,
  role,
  onClose,
  onChanged,
}: {
  batch: ManagedBatch;
  isAdmin: boolean;
  role: Role;
  onClose: () => void;
  onChanged: (b: ManagedBatch, message?: string) => void | Promise<void>;
}) {
  const [heads, setHeads] = useState<HeadSummary[]>([]);
  const [instructors, setInstructors] = useState<InstructorWithHead[]>([]);
  const [picking, setPicking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) return;
    listHeads().then(setHeads).catch(() => setHeads([]));
    listInstructorsWithHead().then(setInstructors).catch(() => setInstructors([]));
  }, [isAdmin]);

  async function apply(change: Parameters<typeof assignBatch>[1], message: string) {
    setBusy(true);
    setErr(null);
    try {
      const res = await assignBatch(batch.id, change);
      await onChanged(res.batch, res.skipped.length ? `${message} ${res.skipped.length} skipped: ${res.skipped.map((s) => s.reason).join(" ")}` : message);
    } catch (e) {
      setErr(errMsg(e));
    } finally {
      setBusy(false);
    }
  }

  const teaching = new Set(batch.instructors.map((i) => i.id));

  return (
    <Modal title={batch.name} subtitle={[batch.courseTitle, batch.schedule].filter(Boolean).join(" · ")} onClose={onClose} wide>
      <div className="space-y-5 text-xs">
        {err && (
          <p role="alert" className="font-semibold text-rose-600 dark:text-rose-400">
            {err}
          </p>
        )}
        {batch.description && <p className="text-slate-600 dark:text-slate-300">{batch.description}</p>}
        <p className="text-slate-500">
          {fmtDate(batch.startDate)} → {fmtDate(batch.endDate)} · {batch.status.charAt(0) + batch.status.slice(1).toLowerCase()}
        </p>

        {/* Head */}
        <section>
          <h4 className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">Head</h4>
          {isAdmin ? (
            <select
              aria-label="Batch head"
              value={batch.head?.id ?? ""}
              disabled={busy}
              onChange={(e) => apply({ headId: e.target.value || null }, e.target.value ? "Head assigned." : "Head removed.")}
              className={INPUT}
            >
              <option value="">No head assigned</option>
              {heads.map((h) => (
                <option key={h.id} value={h.id} disabled={h.status === "BLOCKED"}>
                  {h.name}
                  {h.status === "BLOCKED" ? " (deactivated)" : ""}
                </option>
              ))}
            </select>
          ) : (
            <p className="font-semibold text-slate-800 dark:text-slate-100">{batch.head?.name ?? "Unassigned"}</p>
          )}
        </section>

        {/* Instructors */}
        <section>
          <h4 className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">Instructors ({batch.instructorCount})</h4>
          {batch.instructors.length === 0 ? (
            <p className="text-slate-500">No instructors assigned.</p>
          ) : (
            <ul className="flex flex-wrap gap-1.5">
              {batch.instructors.map((i) => (
                <li key={i.id} className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {i.name}
                  {isAdmin && (
                    <button type="button" aria-label={`Remove ${i.name}`} disabled={busy} onClick={() => apply({ removeInstructors: [i.id] }, "Instructor removed.")}>
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
          {isAdmin && (
            <select
              aria-label="Add an instructor"
              value=""
              disabled={busy}
              onChange={(e) => e.target.value && apply({ addInstructors: [e.target.value] }, "Instructor added.")}
              className={`${INPUT} mt-2 max-w-xs`}
            >
              <option value="">Add an instructor…</option>
              {instructors
                .filter((i) => !teaching.has(i.id) && i.status !== "BLOCKED")
                .map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
            </select>
          )}
        </section>

        {/* Students */}
        <section>
          <div className="mb-1.5 flex items-center justify-between">
            <h4 className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Students ({batch.studentCount})</h4>
            {isAdmin && (
              <button type="button" onClick={() => setPicking(true)} className="inline-flex items-center gap-1 rounded-lg bg-[#2563EB] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-700">
                <UserPlus className="h-3 w-3" /> Add students
              </button>
            )}
          </div>
          {role === "head" || role === "instructor" || isAdmin ? (
            (batch.students ?? []).length === 0 ? (
              <p className="text-slate-500">No students in this batch yet.</p>
            ) : (
              <ul className="max-h-60 divide-y divide-slate-100 overflow-y-auto rounded-xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
                {(batch.students ?? []).map((s) => (
                  <li key={s.id} className="flex items-center justify-between gap-2 px-3 py-2">
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-slate-800 dark:text-slate-100">{s.name}</span>
                      <span className="block truncate text-slate-500">{s.email}</span>
                    </span>
                    {isAdmin && (
                      <button
                        type="button"
                        aria-label={`Remove ${s.name}`}
                        disabled={busy}
                        onClick={() => window.confirm(`Remove ${s.name} from this batch?`) && apply({ removeStudents: [s.id] }, "Student removed.")}
                        className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50"
                      >
                        <UserMinus className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )
          ) : null}
        </section>
      </div>

      {isAdmin && (
        <StudentPickerModal
          open={picking}
          resetKey={batch.id}
          title="Add students to batch"
          subtitle={batch.name}
          note={batch.courseId ? `Only students enrolled in ${batch.courseTitle ?? "the linked course"} are listed.` : "Students already in this batch cannot be added again."}
          confirmVerb="Add"
          load={(search) => fetchCandidateStudents(batch.id, search)}
          onConfirm={async (ids) => {
            const res = await assignBatch(batch.id, { addStudents: ids });
            await onChanged(res.batch, `Added ${ids.length - res.skipped.length} student(s).${res.skipped.length ? ` ${res.skipped.length} skipped.` : ""}`);
          }}
          onClose={() => setPicking(false)}
        />
      )}
    </Modal>
  );
}

/* ── Modal shell ─────────────────────────────────────────────────────── */

function Modal({
  title,
  subtitle,
  onClose,
  wide,
  children,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  wide?: boolean;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (typeof document === "undefined") return null;
  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs dark:bg-black/75" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className={`flex max-h-[90vh] w-full flex-col rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-surface-secondary ${wide ? "max-w-2xl" : "max-w-lg"}`}
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-5 dark:border-slate-800">
          <div className="min-w-0">
            <h3 className="truncate text-base font-black text-slate-900 dark:text-white">{title}</h3>
            {subtitle && <p className="mt-0.5 truncate text-xs text-slate-500">{subtitle}</p>}
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
