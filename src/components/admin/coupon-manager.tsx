"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Copy, Loader2, Ticket } from "lucide-react";
import {
  deactivateCoupon,
  fetchAdminCoupons,
  generateCoupon,
  type AdminCoupon,
  type CouponStatus,
} from "@/lib/data/coupons-api";

const STATUS_STYLE: Record<CouponStatus, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200",
  RESERVED: "bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-200",
  REDEEMED: "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
  EXPIRED: "bg-rose-100 text-rose-800 dark:bg-rose-400/15 dark:text-rose-200",
  INACTIVE: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
};

export function CouponManager() {
  const [percent, setPercent] = useState("10");
  const [days, setDays] = useState("30");
  const [note, setNote] = useState("");
  const [coupons, setCoupons] = useState<AdminCoupon[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [justCreated, setJustCreated] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setCoupons(await fetchAdminCoupons());
    } catch (err) {
      setCoupons([]);
      setError(err instanceof Error ? err.message : "Could not load coupons.");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const pct = Number(percent);
  const dayCount = Number(days);
  const percentError =
    !Number.isInteger(pct) || pct < 1 || pct > 100 ? "Enter a whole number from 1 to 100." : null;
  const daysError =
    !Number.isInteger(dayCount) || dayCount < 1 || dayCount > 365 ? "Enter 1 to 365 days." : null;

  async function onGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (percentError || daysError) return;
    setBusy(true);
    setError(null);
    try {
      const created = await generateCoupon({
        discountPercent: pct,
        expiresInDays: dayCount,
        description: note.trim() || undefined,
      });
      setJustCreated(created.code);
      setNote("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate the coupon.");
    } finally {
      setBusy(false);
    }
  }

  async function copy(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      setTimeout(() => setCopied((c) => (c === code ? null : c)), 1800);
    } catch {
      setError("Copy failed. Select the code and copy it manually.");
    }
  }

  async function onDeactivate(c: AdminCoupon) {
    if (!window.confirm(`Deactivate ${c.code}? It can no longer be redeemed.`)) return;
    setError(null);
    try {
      await deactivateCoupon(c.id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not deactivate the coupon.");
    }
  }

  const generated = (coupons ?? []).filter((c) => c.isGenerated);

  return (
    <section
      aria-labelledby="coupon-heading"
      className="rounded-[20px] border border-white/70 bg-white/80 p-4 shadow-[0_8px_30px_rgb(20,50,100,0.06)] dark:border-slate-800/80 dark:bg-surface-secondary/90 dark:shadow-none sm:p-6"
    >
      <div className="flex items-center gap-2">
        <Ticket className="h-5 w-5 text-[#2563EB] dark:text-blue-400" />
        <h2 id="coupon-heading" className="text-base font-bold text-slate-900 dark:text-white">
          Coupon generation
        </h2>
      </div>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        Each generated coupon works once. It is locked when a student applies it and redeemed only when the
        enrollment is granted; a rejected enrollment releases it.
      </p>

      <form onSubmit={onGenerate} className="mt-4 flex flex-wrap items-start gap-3">
        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
          Discount (%)
          <input
            inputMode="numeric"
            value={percent}
            onChange={(e) => setPercent(e.target.value)}
            aria-invalid={!!percentError}
            className="mt-1 block w-28 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#2563EB] dark:border-slate-700 dark:bg-input-bg dark:text-white"
          />
          {percentError && <span className="mt-1 block text-[11px] font-normal text-rose-600">{percentError}</span>}
        </label>
        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
          Valid for (days)
          <input
            inputMode="numeric"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            aria-invalid={!!daysError}
            className="mt-1 block w-28 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#2563EB] dark:border-slate-700 dark:bg-input-bg dark:text-white"
          />
          {daysError && <span className="mt-1 block text-[11px] font-normal text-rose-600">{daysError}</span>}
        </label>
        <label className="min-w-[12rem] flex-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
          Note (optional)
          <input
            value={note}
            maxLength={200}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Diwali scholarship"
            className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#2563EB] dark:border-slate-700 dark:bg-input-bg dark:text-white"
          />
        </label>
        <button
          type="submit"
          disabled={busy || !!percentError || !!daysError}
          className="mt-[1.4rem] inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />} Generate coupon
        </button>
      </form>

      {justCreated && (
        <div role="status" className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900/50 dark:bg-emerald-950/20">
          <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-200">New coupon:</span>
          <code className="rounded-lg bg-white px-3 py-1.5 font-mono text-sm font-bold tracking-wider text-slate-900 dark:bg-slate-900 dark:text-white">
            {justCreated}
          </code>
          <button
            type="button"
            onClick={() => copy(justCreated)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800 dark:text-emerald-200 dark:hover:bg-emerald-900/30"
          >
            {copied === justCreated ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied === justCreated ? "Copied" : "Copy"}
          </button>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
          {error}
        </p>
      )}

      <div className="mt-5 overflow-x-auto">
        {coupons === null ? (
          <p className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading coupons…
          </p>
        ) : generated.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">No generated coupons yet.</p>
        ) : (
          <table className="w-full min-w-[640px] text-left text-xs">
            <thead className="border-b border-slate-100 text-[11px] uppercase tracking-wide text-slate-500 dark:border-slate-800">
              <tr>
                <th className="py-2 pr-3">Code</th>
                <th className="py-2 pr-3">Discount</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3">Used by</th>
                <th className="py-2 pr-3">Expires</th>
                <th className="py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {generated.map((c) => (
                <tr key={c.id}>
                  <td className="py-2.5 pr-3">
                    <div className="flex items-center gap-2">
                      <code className="font-mono font-bold text-slate-900 dark:text-white">{c.code}</code>
                      <button
                        type="button"
                        aria-label={`Copy ${c.code}`}
                        onClick={() => copy(c.code)}
                        className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                      >
                        {copied === c.code ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                    {c.description && <div className="text-[11px] text-slate-500">{c.description}</div>}
                  </td>
                  <td className="py-2.5 pr-3 font-semibold text-slate-800 dark:text-slate-200">{c.discountPercent}%</td>
                  <td className="py-2.5 pr-3">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${STATUS_STYLE[c.status]}`}>
                      {c.status.charAt(0) + c.status.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="py-2.5 pr-3 text-slate-600 dark:text-slate-300">
                    {c.redeemedBy ? (
                      <>
                        <div>{c.redeemedBy.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {c.redeemedAt ? new Date(c.redeemedAt).toLocaleDateString() : ""}
                        </div>
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="py-2.5 pr-3 text-slate-500 dark:text-slate-400">
                    {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : "Never"}
                  </td>
                  <td className="py-2.5 text-right">
                    {c.status === "ACTIVE" || c.status === "RESERVED" ? (
                      <button
                        type="button"
                        onClick={() => onDeactivate(c)}
                        className="rounded-lg border border-rose-200 px-2.5 py-1 font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-900/60 dark:hover:bg-rose-950/30"
                      >
                        Deactivate
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
