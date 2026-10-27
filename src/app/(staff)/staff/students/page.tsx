"use client";

import { useEffect, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { listLedger, type LedgerRow } from "@/lib/api/staff-api";

const CARD = "rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-surface-secondary sm:p-5";
const INPUT =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#2563EB] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100";

const STATUS_STYLE: Record<LedgerRow["academicStatus"], string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  COMPLETED: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
  DROPPED: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
};

const inr = (n: number) => `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

export default function StaffLedgerPage() {
  const [rows, setRows] = useState<LedgerRow[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(
      () => {
        setLoading(true);
        listLedger({ search: search.trim() || undefined, status })
          .then((r) => {
            if (cancelled) return;
            setRows(r);
            setError(null);
          })
          .catch((e) => !cancelled && setError(e instanceof Error ? e.message : "Could not load students."))
          .finally(() => !cancelled && setLoading(false));
      },
      search ? 300 : 0,
    );
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [search, status]);

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
      <header>
        <h1 className="text-xl font-black text-slate-900 dark:text-white">Student ledger</h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Academic status next to each student&apos;s fee position.</p>
      </header>

      <section className={CARD}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative sm:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input className={`${INPUT} pl-8`} placeholder="Search name, email, phone, course" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className={`${INPUT} sm:w-44`} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="ALL">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="DROPPED">Dropped</option>
          </select>
        </div>

        {error ? <p className="mt-4 text-xs font-semibold text-rose-600">{error}</p> : null}

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wide text-slate-500 dark:border-slate-800">
                <th className="py-2 pr-3">Student</th>
                <th className="py-2 pr-3">Course</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3 text-right">Agreed</th>
                <th className="py-2 pr-3 text-right">Paid</th>
                <th className="py-2 pr-3 text-right">Balance</th>
                <th className="py-2">Instalments</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No students match.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.enrollmentId} className="border-b border-slate-100 dark:border-slate-800/70">
                    <td className="py-3 pr-3">
                      <p className="font-bold text-slate-900 dark:text-white">{r.studentName}</p>
                      <p className="text-slate-500">{r.studentPhone ?? r.studentEmail}</p>
                    </td>
                    <td className="py-3 pr-3">{r.courseTitle}</td>
                    <td className="py-3 pr-3">
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${STATUS_STYLE[r.academicStatus]}`}>
                        {r.academicStatus.charAt(0) + r.academicStatus.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="py-3 pr-3 text-right">{inr(r.agreedFeeRupees)}</td>
                    <td className="py-3 pr-3 text-right">{inr(r.paidRupees)}</td>
                    <td className={`py-3 pr-3 text-right font-bold ${r.balanceRupees > 0 ? (r.hasOverdue ? "text-rose-600" : "text-amber-600") : "text-emerald-600"}`}>
                      {inr(r.balanceRupees)}
                    </td>
                    <td className="py-3">
                      {r.installmentsTotal > 0 ? `${r.installmentsPaid} paid · ${r.installmentsTotal - r.installmentsPaid} pending` : "No plan"}
                      {r.hasOverdue ? <span className="ml-1 font-bold text-rose-600">(overdue)</span> : null}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
