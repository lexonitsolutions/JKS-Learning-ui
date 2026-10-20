"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, CalendarClock, IndianRupee, Loader2, MessageCircle, PhoneCall, Search, Smartphone, Users, X } from "lucide-react";
import {
  getStaffSummary,
  listOverdue,
  logFollowUp,
  type FollowUpOutcome,
  type OverdueRow,
  type PaymentLinks,
  type StaffSummary,
} from "@/lib/api/staff-api";

const CARD = "rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-surface-secondary sm:p-5";
const INPUT =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#2563EB] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100";

const OUTCOMES: { value: FollowUpOutcome; label: string }[] = [
  { value: "PROMISED_TO_PAY", label: "Promised to Pay" },
  { value: "CALL_LATER", label: "Call Later" },
  { value: "UNREACHABLE", label: "Unreachable" },
];

const OUTCOME_LABEL: Record<FollowUpOutcome, string> = {
  PROMISED_TO_PAY: "Promised to Pay",
  CALL_LATER: "Call Later",
  UNREACHABLE: "Unreachable",
};

const inr = (n: number) => `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
const day = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
const dateInput = (offsetDays: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
};

function Kpi({ icon: Icon, label, value, hint }: { icon: typeof Users; label: string; value: string; hint?: string }) {
  return (
    <div className={CARD}>
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        <Icon className="h-4 w-4 text-[#2563EB]" /> {label}
      </div>
      <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{value}</p>
      {hint ? <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{hint}</p> : null}
    </div>
  );
}

function FollowUpModal({ row, onClose, onSaved }: { row: OverdueRow; onClose: () => void; onSaved: () => void }) {
  const [outcome, setOutcome] = useState<FollowUpOutcome>("PROMISED_TO_PAY");
  const [promisedDate, setPromisedDate] = useState(dateInput(2));
  const [nextDate, setNextDate] = useState(dateInput(1));
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [links, setLinks] = useState<PaymentLinks | null>(null);

  const save = async (channel: "CALL" | "WHATSAPP" | "SMS") => {
    setSaving(true);
    setError(null);
    try {
      const res = await logFollowUp({
        installmentItemId: row.installmentItemId,
        outcome,
        promisedDate: outcome === "PROMISED_TO_PAY" ? promisedDate : undefined,
        nextFollowUpAt: outcome === "CALL_LATER" ? nextDate : undefined,
        notes: notes.trim() || undefined,
        channel,
      });
      setLinks(res.links);
      onSaved();
      const url = channel === "WHATSAPP" ? res.links.whatsappUrl : channel === "SMS" ? res.links.smsUrl : null;
      if (channel !== "CALL" && !url) {
        setError("Saved, but this student has no valid phone number to message.");
      } else if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
      }
      if (channel === "CALL") onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save the follow-up.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl dark:bg-surface-secondary">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white">Log follow-up</h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {row.studentName} · {row.courseTitle} · {inr(row.overdueBalanceRupees)} overdue
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-[11px] font-bold text-slate-600 dark:text-slate-300">Call result</label>
            <div className="grid grid-cols-3 gap-2">
              {OUTCOMES.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setOutcome(o.value)}
                  className={`rounded-xl border px-2 py-2 text-[11px] font-bold ${
                    outcome === o.value
                      ? "border-[#2563EB] bg-[#2563EB]/10 text-[#2563EB]"
                      : "border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {outcome === "PROMISED_TO_PAY" ? (
            <div>
              <label className="mb-1 block text-[11px] font-bold text-slate-600 dark:text-slate-300">Promised payment date</label>
              <input type="date" className={INPUT} value={promisedDate} min={dateInput(0)} onChange={(e) => setPromisedDate(e.target.value)} />
              <p className="mt-1 text-[11px] text-slate-500">The next alert is scheduled for this date.</p>
            </div>
          ) : null}
          {outcome === "CALL_LATER" ? (
            <div>
              <label className="mb-1 block text-[11px] font-bold text-slate-600 dark:text-slate-300">Call again on</label>
              <input type="date" className={INPUT} value={nextDate} min={dateInput(0)} onChange={(e) => setNextDate(e.target.value)} />
            </div>
          ) : null}
          {outcome === "UNREACHABLE" ? (
            <p className="text-[11px] text-slate-500">The student returns to your call queue tomorrow.</p>
          ) : null}

          <div>
            <label className="mb-1 block text-[11px] font-bold text-slate-600 dark:text-slate-300">Notes</label>
            <textarea rows={3} className={INPUT} value={notes} maxLength={1000} onChange={(e) => setNotes(e.target.value)} placeholder="What did the student say?" />
          </div>

          {error ? <p className="rounded-lg bg-rose-50 p-2 text-[11px] font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">{error}</p> : null}
          {links ? (
            <p className="rounded-lg bg-emerald-50 p-2 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">Follow-up saved.</p>
          ) : null}

          <div className="grid gap-2 pt-1 sm:grid-cols-3">
            <button type="button" disabled={saving} onClick={() => save("CALL")} className="rounded-xl bg-[#2563EB] px-3 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-60">
              {saving ? "Saving…" : "Save"}
            </button>
            <button type="button" disabled={saving} onClick={() => save("WHATSAPP")} className="flex items-center justify-center gap-1 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-60">
              <MessageCircle className="h-3.5 w-3.5" /> Save + WhatsApp
            </button>
            <button type="button" disabled={saving} onClick={() => save("SMS")} className="flex items-center justify-center gap-1 rounded-xl bg-slate-800 px-3 py-2 text-xs font-bold text-white hover:bg-slate-900 disabled:opacity-60">
              <Smartphone className="h-3.5 w-3.5" /> Save + SMS
            </button>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">WhatsApp and SMS open with the payment link filled in; you press send.</p>
        </div>
      </div>
    </div>
  );
}

export default function StaffDashboardPage() {
  const [summary, setSummary] = useState<StaffSummary | null>(null);
  const [rows, setRows] = useState<OverdueRow[]>([]);
  const [queue, setQueue] = useState<"all" | "today">("today");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<OverdueRow | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, r] = await Promise.all([getStaffSummary(), listOverdue({ queue, search: search.trim() || undefined })]);
      setSummary(s);
      setRows(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load the dashboard.");
    } finally {
      setLoading(false);
    }
  }, [queue, search]);

  useEffect(() => {
    const t = setTimeout(() => void load(), search ? 300 : 0);
    return () => clearTimeout(t);
  }, [load, search]);

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
      <header>
        <h1 className="text-xl font-black text-slate-900 dark:text-white">Fee follow-ups</h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Students past their installment due date, who to call today, and what was said last time.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi icon={AlertTriangle} label="Total overdue" value={summary ? inr(summary.totalOverdueRupees) : "—"} hint={summary ? `${summary.overdueStudents} student(s)` : undefined} />
        <Kpi icon={PhoneCall} label="Today's call queue" value={summary ? String(summary.todaysCallQueue) : "—"} hint="Never contacted, or follow-up due" />
        <Kpi icon={Users} label="Assigned leads" value={summary ? String(summary.assignedLeads) : "—"} hint="Open leads assigned to you" />
        <Kpi icon={IndianRupee} label="Monthly collections" value={summary ? inr(summary.monthlyCollectionsRupees) : "—"} hint="Received this month" />
      </div>

      <section className={CARD}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex rounded-xl border border-slate-200 p-0.5 text-xs font-bold dark:border-slate-700">
            {(["today", "all"] as const).map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setQueue(q)}
                className={`rounded-lg px-3 py-1.5 ${queue === q ? "bg-[#2563EB] text-white" : "text-slate-600 dark:text-slate-300"}`}
              >
                {q === "today" ? "Today's queue" : "All overdue"}
              </button>
            ))}
          </div>
          <div className="relative sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input className={`${INPUT} pl-8`} placeholder="Search name, phone, course" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {error ? <p className="mt-4 text-xs font-semibold text-rose-600">{error}</p> : null}

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wide text-slate-500 dark:border-slate-800">
                <th className="py-2 pr-3">Student</th>
                <th className="py-2 pr-3">Course / batch</th>
                <th className="py-2 pr-3 text-right">Overdue</th>
                <th className="py-2 pr-3">Due date</th>
                <th className="py-2 pr-3">Last call</th>
                <th className="py-2 pr-3">Next follow-up</th>
                <th className="py-2" />
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
                    {queue === "today" ? "Nobody is waiting for a call today." : "No overdue installments."}
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.installmentItemId} className="border-b border-slate-100 align-top dark:border-slate-800/70">
                    <td className="py-3 pr-3">
                      <p className="font-bold text-slate-900 dark:text-white">{r.studentName}</p>
                      <p className="text-slate-500">{r.studentPhone ?? r.studentEmail}</p>
                    </td>
                    <td className="py-3 pr-3">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{r.courseTitle}</p>
                      <p className="text-slate-500">{r.batch ?? "—"}</p>
                    </td>
                    <td className="py-3 pr-3 text-right">
                      <p className="font-black text-rose-600">{inr(r.overdueBalanceRupees)}</p>
                      <p className="text-slate-500">Instalment {r.installmentNumber}</p>
                    </td>
                    <td className="py-3 pr-3">
                      <p>{day(r.dueDate)}</p>
                      <p className="text-rose-600">{r.daysOverdue} day(s) late</p>
                    </td>
                    <td className="max-w-[220px] py-3 pr-3">
                      {r.lastOutcome ? (
                        <>
                          <p className="font-semibold">{OUTCOME_LABEL[r.lastOutcome]}</p>
                          <p className="truncate text-slate-500" title={r.lastNotes ?? ""}>
                            {r.lastNotes || "No notes"}
                          </p>
                          <p className="text-slate-400">{day(r.lastContactedAt)}</p>
                        </>
                      ) : (
                        <span className="text-slate-400">Not contacted yet</span>
                      )}
                    </td>
                    <td className="py-3 pr-3">
                      <span className={`inline-flex items-center gap-1 ${r.inTodaysQueue ? "font-bold text-amber-600" : ""}`}>
                        <CalendarClock className="h-3.5 w-3.5" />
                        {r.nextFollowUpAt ? day(r.nextFollowUpAt) : "Call today"}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button type="button" onClick={() => setActive(r)} className="rounded-lg bg-[#2563EB] px-3 py-1.5 text-[11px] font-bold text-white hover:bg-blue-700">
                        Log follow-up
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {active ? <FollowUpModal row={active} onClose={() => setActive(null)} onSaved={() => void load()} /> : null}
    </div>
  );
}
