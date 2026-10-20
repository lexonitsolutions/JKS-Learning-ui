"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronDown, Loader2, Plus, Power, Trash2, UserPlus } from "lucide-react";
import { apiFetch, ApiError } from "@/lib/api/base-url";

const CARD = "rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-surface-secondary sm:p-5";
const INPUT =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#2563EB] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: string | null;
  createdAt: string;
  followUpsTotal: number;
  followUpsThisMonth: number;
  promisedToPay: number;
  assignedLeads: number;
  lastActiveAt: string | null;
  recentFollowUps: {
    id: string;
    studentName: string;
    outcome: string;
    notes: string | null;
    promisedDate: string | null;
    createdAt: string;
  }[];
}

const OUTCOME_LABEL: Record<string, string> = {
  PROMISED_TO_PAY: "Promised to Pay",
  CALL_LATER: "Call Later",
  UNREACHABLE: "Unreachable",
};

const day = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

async function errorMessage(res: Response, fallback: string) {
  try {
    const body = await res.json();
    const m = Array.isArray(body?.message) ? body.message.join(" ") : body?.message;
    return m || fallback;
  } catch {
    return fallback;
  }
}

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/admin/staff", { cache: "no-store" });
      if (!res.ok) throw new ApiError(await errorMessage(res, "Could not load staff."), res.status);
      setStaff(await res.json());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load staff.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const act = async (s: StaffMember, kind: "toggle" | "delete") => {
    const blocked = s.status === "BLOCKED";
    const prompt =
      kind === "delete"
        ? `Permanently delete ${s.name}? Their logged follow-ups stay on the students' records. This cannot be undone. Consider deactivating instead.`
        : blocked
          ? `Reactivate ${s.name}?`
          : `Deactivate ${s.name}? They will no longer be able to sign in.`;
    if (!window.confirm(prompt)) return;
    setBusyId(s.id);
    setError(null);
    setNotice(null);
    try {
      const res =
        kind === "delete"
          ? await apiFetch(`/admin/staff/${s.id}`, { method: "DELETE" })
          : await apiFetch(`/admin/staff/${s.id}/active`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ active: blocked }),
            });
      if (!res.ok) {
        const fallback = res.status === 403 ? "Only the super admin can do that." : "Could not update the account.";
        throw new Error(await errorMessage(res, fallback));
      }
      setNotice(kind === "delete" ? `Deleted ${s.name}.` : `${blocked ? "Reactivated" : "Deactivated"} ${s.name}.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update the account.");
    } finally {
      setBusyId(null);
    }
  };

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const res = await apiFetch("/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role: "STAFF" }),
      });
      if (!res.ok) {
        const fallback = res.status === 403 ? "Only the super admin can create staff accounts." : "Could not create the account.";
        throw new Error(await errorMessage(res, fallback));
      }
      setForm({ name: "", email: "", password: "" });
      setShowForm(false);
      await load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not create the account.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Staff</h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Fee-collection staff accounts and the follow-up work each has logged.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-3 py-2 text-xs font-bold text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" /> Add staff
        </button>
      </header>

      {showForm ? (
        <form onSubmit={create} className={`${CARD} grid gap-3 sm:grid-cols-4`}>
          <input className={INPUT} required minLength={2} placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className={INPUT} required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className={INPUT} required minLength={5} type="password" placeholder="Password (min 5)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button disabled={saving} className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-60">
            <UserPlus className="h-4 w-4" /> {saving ? "Creating…" : "Create account"}
          </button>
          {formError ? <p className="text-xs font-semibold text-rose-600 sm:col-span-4">{formError}</p> : null}
        </form>
      ) : null}

      {notice ? <p className="text-xs font-semibold text-emerald-600">{notice}</p> : null}
      {error ? <p className="text-xs font-semibold text-rose-600">{error}</p> : null}

      <section className={CARD}>
        {loading ? (
          <Loader2 className="mx-auto my-6 h-4 w-4 animate-spin text-slate-500" />
        ) : staff.length === 0 ? (
          <p className="py-6 text-center text-xs text-slate-500">No staff accounts yet. Use “Add staff”.</p>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {staff.map((s) => (
              <li key={s.id} className="py-3">
                <button type="button" onClick={() => setOpen(open === s.id ? null : s.id)} className="flex w-full flex-wrap items-center gap-x-6 gap-y-2 text-left">
                  <div className="min-w-[180px] flex-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {s.name}
                      {s.status === "BLOCKED" ? (
                        <span className="ml-2 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">Deactivated</span>
                      ) : null}
                    </p>
                    <p className="text-xs text-slate-500">{s.email}</p>
                  </div>
                  <Stat label="Follow-ups (month)" value={s.followUpsThisMonth} />
                  <Stat label="Total" value={s.followUpsTotal} />
                  <Stat label="Promised to pay" value={s.promisedToPay} />
                  <Stat label="Open leads" value={s.assignedLeads} />
                  <div className="text-xs text-slate-500">Last active {day(s.lastActiveAt)}</div>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${open === s.id ? "rotate-180" : ""}`} />
                </button>

                {open === s.id ? (
                  <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-900/60">
                    <p className="text-slate-500">
                      Phone: {s.phone ?? "—"} · Status: {s.status ?? "ACTIVE"} · Joined {day(s.createdAt)}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        disabled={busyId === s.id}
                        onClick={() => act(s, "toggle")}
                        className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-white disabled:opacity-50 dark:border-slate-700 dark:text-slate-200"
                      >
                        <Power className="h-3.5 w-3.5" /> {s.status === "BLOCKED" ? "Reactivate" : "Deactivate"}
                      </button>
                      <button
                        type="button"
                        disabled={busyId === s.id}
                        onClick={() => act(s, "delete")}
                        className="flex items-center gap-1 rounded-lg border border-rose-200 px-2.5 py-1 text-[11px] font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-50 dark:border-rose-900/60 dark:hover:bg-rose-950/30"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                    <p className="mt-3 font-bold text-slate-700 dark:text-slate-200">Recent follow-ups</p>
                    {s.recentFollowUps.length === 0 ? (
                      <p className="mt-1 text-slate-500">Nothing logged yet.</p>
                    ) : (
                      <ul className="mt-1 space-y-1.5">
                        {s.recentFollowUps.map((f) => (
                          <li key={f.id} className="text-slate-600 dark:text-slate-300">
                            <span className="font-semibold">{f.studentName}</span> — {OUTCOME_LABEL[f.outcome] ?? f.outcome}
                            {f.promisedDate ? ` (promised ${day(f.promisedDate)})` : ""}
                            {f.notes ? `: ${f.notes}` : ""} <span className="text-slate-400">· {day(f.createdAt)}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <p className="text-base font-black text-slate-900 dark:text-white">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-slate-500">{label}</p>
    </div>
  );
}
