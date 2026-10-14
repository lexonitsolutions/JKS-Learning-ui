"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Loader2, Search, UserPlus, X } from "lucide-react";

export interface PickerStudent {
  id: string;
  name: string;
  email: string;
  /** Already holds the assessment; shown disabled so it cannot be chosen twice. */
  alreadyAssigned: boolean;
}

interface Props {
  open: boolean;
  /** Changing this resets the picker (e.g. the id of the assessment being edited). */
  resetKey: string;
  title: string;
  subtitle?: string;
  note?: string;
  confirmVerb?: string;
  /** Extra controls shown above the list (e.g. a title or due date field). */
  header?: ReactNode;
  load: (search: string) => Promise<PickerStudent[]>;
  /** Throw to keep the dialog open and show the message. */
  onConfirm: (studentIds: string[]) => Promise<void>;
  onClose: () => void;
}

export function StudentPickerModal({
  open,
  resetKey,
  title,
  subtitle,
  note,
  confirmVerb = "Add",
  header,
  load,
  onConfirm,
  onClose,
}: Props) {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState<PickerStudent[] | null>(null);
  const [selected, setSelected] = useState<Map<string, PickerStudent>>(new Map());
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const seq = useRef(0);
  const loadRef = useRef(load);
  useEffect(() => {
    loadRef.current = load;
  });

  useEffect(() => {
    setSearch("");
    setSelected(new Map());
    setStudents(null);
    setSubmitError(null);
  }, [resetKey]);

  // Server-side, debounced search so only eligible accounts are ever listed.
  useEffect(() => {
    if (!open) return;
    const mine = ++seq.current;
    const timer = setTimeout(
      async () => {
        setLoadError(null);
        try {
          const list = await loadRef.current(search);
          if (mine === seq.current) setStudents(list);
        } catch (err) {
          if (mine === seq.current) {
            setStudents([]);
            setLoadError(err instanceof Error ? err.message : "Could not load students.");
          }
        }
      },
      search ? 250 : 0,
    );
    return () => clearTimeout(timer);
  }, [open, search, resetKey]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !busy && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, busy, onClose]);

  const available = useMemo(() => (students ?? []).filter((s) => !s.alreadyAssigned), [students]);

  if (!open || typeof document === "undefined") return null;

  function toggle(s: PickerStudent) {
    setSelected((prev) => {
      const next = new Map(prev);
      if (next.has(s.id)) next.delete(s.id);
      else next.set(s.id, s);
      return next;
    });
  }

  function toggleAllVisible() {
    setSelected((prev) => {
      const next = new Map(prev);
      const allOn = available.every((s) => next.has(s.id));
      for (const s of available) {
        if (allOn) next.delete(s.id);
        else next.set(s.id, s);
      }
      return next;
    });
  }

  async function confirm() {
    if (selected.size === 0) return;
    setBusy(true);
    setSubmitError(null);
    try {
      await onConfirm(Array.from(selected.keys()));
      onClose();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs dark:bg-black/75"
      onClick={() => !busy && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="student-picker-title"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-surface-secondary"
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-5 dark:border-slate-800">
          <div className="min-w-0">
            <h3 id="student-picker-title" className="flex items-center gap-2 text-base font-black text-slate-900 dark:text-white">
              <UserPlus className="h-4 w-4 text-[#2563EB]" /> {title}
            </h3>
            {subtitle && <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
            {note && <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{note}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-surface-hover"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3 overflow-y-auto p-5">
          {header}

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search students by name or email"
              aria-label="Search students"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-3 text-xs text-slate-900 outline-none focus:border-[#2563EB] focus:bg-white dark:border-slate-700 dark:bg-input-bg dark:text-white"
            />
          </div>

          {selected.size > 0 && (
            <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3 dark:border-blue-900/50 dark:bg-blue-950/20">
              <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200">Selected ({selected.size})</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {Array.from(selected.values()).map((s) => (
                  <span
                    key={s.id}
                    className="inline-flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-blue-100 dark:bg-slate-900 dark:text-slate-200 dark:ring-blue-900/50"
                  >
                    {s.name}
                    <button type="button" aria-label={`Remove ${s.name}`} onClick={() => toggle(s)}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-slate-200 dark:border-slate-800">
            {students === null ? (
              <p className="flex items-center gap-2 p-4 text-xs text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading students…
              </p>
            ) : loadError ? (
              <p role="alert" className="p-4 text-xs text-rose-600">
                {loadError}
              </p>
            ) : students.length === 0 ? (
              <p className="p-4 text-xs text-slate-500">No eligible students match your search.</p>
            ) : (
              <>
                {available.length > 1 && (
                  <button
                    type="button"
                    onClick={toggleAllVisible}
                    className="w-full border-b border-slate-100 px-3 py-2 text-left text-[11px] font-semibold text-[#2563EB] hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-surface-hover"
                  >
                    {available.every((s) => selected.has(s.id)) ? "Clear all shown" : `Select all shown (${available.length})`}
                  </button>
                )}
                <ul className="max-h-64 divide-y divide-slate-100 overflow-y-auto dark:divide-slate-800">
                  {students.map((s) => (
                    <li key={s.id}>
                      <label
                        className={`flex items-center gap-3 px-3 py-2.5 text-xs ${
                          s.alreadyAssigned
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer hover:bg-slate-50 dark:hover:bg-surface-hover"
                        }`}
                      >
                        <input
                          type="checkbox"
                          disabled={s.alreadyAssigned}
                          checked={selected.has(s.id)}
                          onChange={() => toggle(s)}
                          className="h-4 w-4 rounded border-slate-300 accent-[#2563EB]"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-semibold text-slate-900 dark:text-white">{s.name}</span>
                          <span className="block truncate text-slate-500 dark:text-slate-400">{s.email}</span>
                        </span>
                        {s.alreadyAssigned && (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            Already assigned
                          </span>
                        )}
                      </label>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          {students && students.length > 0 && available.length === 0 && (
            <p className="text-[11px] text-slate-500">Every matching student already has this assessment.</p>
          )}

          {submitError && (
            <p role="alert" className="text-xs font-semibold text-rose-600 dark:text-rose-400">
              {submitError}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-100 p-4 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-surface-hover"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirm}
            disabled={busy || selected.size === 0}
            className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700 disabled:opacity-50"
          >
            {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {confirmVerb} {selected.size > 0 ? selected.size : ""} {selected.size === 1 ? "student" : "students"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
