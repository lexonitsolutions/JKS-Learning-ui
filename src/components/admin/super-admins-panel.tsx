"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Loader2, ShieldCheck, UserPlus } from "lucide-react";
import {
  createSuperAdmin,
  listSuperAdmins,
  setSuperAdminActive,
  type SuperAdminAccount,
} from "@/lib/data/super-admins-api";

const input =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-[#2563EB] dark:border-slate-700/80 dark:bg-input-bg dark:text-white dark:focus:border-blue-500";
const label = "block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300";

/** Settings section where a super admin adds or deactivates other super admins. */
export function SuperAdminsPanel({ onBack }: { onBack: () => void }) {
  const [admins, setAdmins] = useState<SuperAdminAccount[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [rowBusy, setRowBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoadError(null);
    try {
      setAdmins(await listSuperAdmins());
    } catch (err) {
      setAdmins([]);
      setLoadError(err instanceof Error ? err.message : "Could not load super admins.");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const created = await createSuperAdmin({ name, email, password });
      setNotice(`${created.email} is now a super admin. Share the password with them securely; it is not shown again.`);
      setName("");
      setEmail("");
      setPassword("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create the super admin.");
    } finally {
      setBusy(false);
    }
  }

  async function toggle(a: SuperAdminAccount) {
    const active = a.status === "BLOCKED";
    if (!active && !window.confirm(`Deactivate ${a.email}? They will no longer be able to sign in.`)) return;
    setRowBusy(a.id);
    setError(null);
    setNotice(null);
    try {
      await setSuperAdminActive(a.id, active);
      setNotice(`${a.email} was ${active ? "reactivated" : "deactivated"}.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update that account.");
    } finally {
      setRowBusy(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to all settings"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700/80 dark:bg-surface-elevated dark:text-slate-200 dark:hover:bg-surface-hover"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h2 className="truncate text-sm font-bold text-slate-900 dark:text-white sm:text-base">Super Admins</h2>
      </div>

      <div className="space-y-5 rounded-2xl border border-white/70 bg-white/85 p-4 shadow-[0_8px_30px_rgb(20,50,100,0.06)] dark:border-slate-800/80 dark:bg-surface-secondary dark:shadow-none sm:p-7">
        <div className="flex items-start gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 sm:text-xs">
            Super admins have full control of the platform, including managing other super admins. Only add people you trust. Every change here is recorded in the activity log.
          </p>
        </div>

        {notice && (
          <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-300">
            {notice}
          </p>
        )}
        {error && (
          <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">
            {error}
          </p>
        )}

        <section aria-label="Current super admins">
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Current super admins</h3>
          {admins === null ? (
            <p className="flex items-center gap-2 text-xs text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </p>
          ) : loadError ? (
            <p role="alert" className="text-xs text-rose-600">
              {loadError}
            </p>
          ) : (
            <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
              {admins.map((a) => {
                const blocked = a.status === "BLOCKED";
                return (
                  <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 text-xs">
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-slate-900 dark:text-white">{a.name}</span>
                      <span className="block truncate text-slate-500 dark:text-slate-400">{a.email}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          blocked
                            ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
                            : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                        }`}
                      >
                        {blocked ? "Deactivated" : "Active"}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggle(a)}
                        disabled={rowBusy === a.id}
                        className="rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-surface-hover"
                      >
                        {rowBusy === a.id ? "…" : blocked ? "Reactivate" : "Deactivate"}
                      </button>
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <form onSubmit={submit} className="space-y-4 border-t border-slate-100 pt-5 dark:border-slate-800">
          <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <UserPlus className="h-4 w-4 text-[#2563EB]" /> Add a super admin
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="sa-name" className={label}>
                Full name
              </label>
              <input id="sa-name" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} maxLength={120} className={input} />
            </div>
            <div>
              <label htmlFor="sa-email" className={label}>
                Email
              </label>
              <input id="sa-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={160} autoComplete="off" className={input} />
            </div>
          </div>
          <div>
            <label htmlFor="sa-password" className={label}>
              Temporary password
            </label>
            <input
              id="sa-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={10}
              maxLength={128}
              autoComplete="new-password"
              className={input}
            />
            <p className="mt-1 text-[11px] text-slate-500">At least 10 characters with a letter and a number.</p>
          </div>
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 disabled:opacity-50"
          >
            {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Create super admin
          </button>
        </form>
      </div>
    </div>
  );
}
