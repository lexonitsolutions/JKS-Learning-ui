"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Loader2, Search, ShieldOff, X, XCircle } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import {
  adminDecideAccess,
  adminGetAccess,
  adminListAccess,
  type AccessHistoryRow,
  type AccessRow,
} from "@/lib/data/jobs-api";

type Status = AccessRow["status"];
const TABS: { id: "" | Status; label: string }[] = [
  { id: "PENDING", label: "Pending" },
  { id: "APPROVED", label: "Approved" },
  { id: "REJECTED", label: "Rejected" },
  { id: "REVOKED", label: "Revoked" },
  { id: "", label: "All" },
];

const BADGE: Record<Status, string> = {
  PENDING: "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900/60",
  APPROVED: "bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900/60",
  REJECTED: "bg-rose-50 text-rose-800 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900/60",
  REVOKED: "bg-slate-100 text-slate-700 ring-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-600",
};

const fmt = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }) : "–";
const errMsg = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong.");

function Badge({ status }: { status: Status }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ring-1 ${BADGE[status]}`}>{status}</span>;
}

export default function AdminJobsAccessPage() {
  const [tab, setTab] = useState<"" | Status>("PENDING");
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Awaited<ReturnType<typeof adminListAccess>> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(q.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [q]);

  const load = useCallback(async () => {
    try {
      setData(await adminListAccess({ status: tab || undefined, q: query || undefined, page }));
      setError(null);
    } catch (e) {
      setError(errMsg(e));
      setData((d) => d ?? { items: [], total: 0, page: 1, pageSize: 25, counts: {} });
    }
  }, [tab, query, page]);

  useEffect(() => {
    void load();
  }, [load]);

  const pages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  return (
    <>
      <DashboardTopbar title="Jobs Access Requests" subtitle="Approve, reject or revoke student access to the Jobs Portal." />
      <div className="flex-1 space-y-4 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by status">
            {TABS.map((t) => (
              <button
                key={t.label}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => {
                  setTab(t.id);
                  setPage(1);
                }}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  tab === t.id ? "bg-[#1E5EFF] text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-surface-elevated dark:text-slate-300 dark:ring-slate-700"
                }`}
              >
                {t.label}
                {t.id && data?.counts[t.id] ? <span className="ml-1.5 opacity-80">{data.counts[t.id]}</span> : null}
              </button>
            ))}
          </div>
          <div className="relative ml-auto w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name or email"
              aria-label="Search students"
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[#1E5EFF] focus:ring-2 focus:ring-[#1E5EFF]/20 dark:border-slate-700 dark:bg-slate-900"
            />
          </div>
        </div>

        {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">{error}</div>}

        <div className="overflow-hidden rounded-[20px] border border-white/70 bg-white/80 shadow-[0_8px_30px_rgb(20,50,100,0.06)] dark:border-slate-800/80 dark:bg-surface-secondary/90 dark:shadow-none">
          {data === null ? (
            <p className="flex items-center gap-2 p-6 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading requests…</p>
          ) : data.items.length === 0 ? (
            <p className="p-6 text-sm text-slate-500 dark:text-slate-400">No requests in this view.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-xs">
                <thead className="border-b border-slate-100 text-[11px] uppercase tracking-wide text-slate-500 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Requested</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Decision</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.items.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900 dark:text-white">{r.student?.name ?? "Unknown student"}</div>
                        <div className="text-slate-500 dark:text-slate-400">{r.student?.email ?? r.userId}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        {fmt(r.requestedAt)}
                        {r.requestCount > 1 && <div className="text-[11px] text-slate-400">Request #{r.requestCount}</div>}
                      </td>
                      <td className="px-4 py-3"><Badge status={r.status} /></td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        {r.decidedAt ? (<>{fmt(r.decidedAt)}<div className="text-[11px] text-slate-400">by {r.decidedByName ?? "an administrator"}</div></>) : "–"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => setOpenId(r.id)} className="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {pages > 1 && (
          <div className="flex items-center justify-center gap-3 text-xs">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold disabled:opacity-40 dark:border-slate-700">Previous</button>
            <span className="text-slate-500">Page {page} of {pages}</span>
            <button disabled={page >= pages} onClick={() => setPage(page + 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold disabled:opacity-40 dark:border-slate-700">Next</button>
          </div>
        )}
      </div>

      {openId && <RequestDrawer id={openId} onClose={() => setOpenId(null)} onChanged={load} />}
    </>
  );
}

function RequestDrawer({ id, onClose, onChanged }: { id: string; onClose: () => void; onChanged: () => void }) {
  const [row, setRow] = useState<(AccessRow & { history: AccessHistoryRow[] }) | null>(null);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminGetAccess(id).then(setRow).catch((e) => setError(errMsg(e)));
  }, [id]);

  async function act(action: "APPROVE" | "REJECT" | "REVOKE") {
    setBusy(action);
    setError(null);
    try {
      setRow(await adminDecideAccess(id, action, reason.trim() || undefined));
      setReason("");
      onChanged();
    } catch (e) {
      setError(errMsg(e));
      // A conflict means someone else changed it: show the current state.
      adminGetAccess(id).then(setRow).catch(() => undefined);
      onChanged();
    } finally {
      setBusy(null);
    }
  }

  const canApprove = row && ["PENDING", "REJECTED", "REVOKED"].includes(row.status);
  const canReject = row?.status === "PENDING";
  const canRevoke = row?.status === "APPROVED";

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-[2px]" onClick={onClose}>
      <aside role="dialog" aria-modal="true" aria-label="Access request" onClick={(e) => e.stopPropagation()} className="flex h-full w-full max-w-md flex-col overflow-y-auto bg-white p-6 shadow-2xl dark:bg-surface-secondary">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">{row?.student?.name ?? "Access request"}</h2>
            <p className="text-xs text-slate-500">{row?.student?.email}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"><X className="h-4 w-4" /></button>
        </div>

        {!row ? (
          error ? <p role="alert" className="mt-6 text-sm text-rose-600">{error}</p> : <p className="mt-6 flex items-center gap-2 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</p>
        ) : (
          <>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-xs">
              <div><dt className="text-slate-500">Status</dt><dd className="mt-1"><Badge status={row.status} /></dd></div>
              <div><dt className="text-slate-500">Requested</dt><dd className="mt-1 font-medium text-slate-800 dark:text-slate-100">{fmt(row.requestedAt)}</dd></div>
              <div><dt className="text-slate-500">Phone</dt><dd className="mt-1 font-medium text-slate-800 dark:text-slate-100">{row.student?.phone || "–"}</dd></div>
              <div><dt className="text-slate-500">Times requested</dt><dd className="mt-1 font-medium text-slate-800 dark:text-slate-100">{row.requestCount}</dd></div>
              <div className="col-span-2"><dt className="text-slate-500">Last decision</dt><dd className="mt-1 font-medium text-slate-800 dark:text-slate-100">{row.decidedAt ? `${fmt(row.decidedAt)} by ${row.decidedByName ?? "an administrator"}` : "No decision yet"}</dd></div>
            </dl>

            {row.message && (
              <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-700 dark:bg-slate-800/60 dark:text-slate-200">
                <div className="mb-1 font-semibold">Student&apos;s message</div>
                <p className="whitespace-pre-line">{row.message}</p>
              </div>
            )}
            {row.reviewNote && (
              <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-700 dark:bg-slate-800/60 dark:text-slate-200">
                <div className="mb-1 font-semibold">Reason recorded</div>
                <p className="whitespace-pre-line">{row.reviewNote}</p>
              </div>
            )}

            {error && <p role="alert" className="mt-4 rounded-lg bg-rose-50 p-2.5 text-xs text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">{error}</p>}

            {(canReject || canRevoke) && (
              <div className="mt-5">
                <label htmlFor="reason" className="text-xs font-semibold text-slate-700 dark:text-slate-200">Reason <span className="font-normal text-slate-400">(optional, shown to the student on rejection)</span></label>
                <textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} maxLength={500} rows={3} className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 bg-white p-2.5 text-sm outline-none focus:border-[#1E5EFF] focus:ring-2 focus:ring-[#1E5EFF]/20 dark:border-slate-700 dark:bg-slate-900" />
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {canApprove && (
                <button disabled={!!busy} onClick={() => act("APPROVE")} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
                  {busy === "APPROVE" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                  {row.status === "PENDING" ? "Approve" : "Approve again"}
                </button>
              )}
              {canReject && (
                <button disabled={!!busy} onClick={() => act("REJECT")} className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50 dark:border-rose-900/60 dark:text-rose-300 dark:hover:bg-rose-950/30">
                  {busy === "REJECT" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />} Reject
                </button>
              )}
              {canRevoke && (
                <button disabled={!!busy} onClick={() => act("REVOKE")} className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50 dark:border-rose-900/60 dark:text-rose-300 dark:hover:bg-rose-950/30">
                  {busy === "REVOKE" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldOff className="h-3.5 w-3.5" />} Revoke access
                </button>
              )}
            </div>

            <h3 className="mt-7 text-xs font-bold uppercase tracking-wide text-slate-500">History</h3>
            <ol className="mt-2 space-y-3 border-l border-slate-200 pl-4 dark:border-slate-700">
              {row.history.length === 0 && <li className="text-xs text-slate-400">No history recorded.</li>}
              {row.history.map((h) => (
                <li key={h.id} className="relative text-xs">
                  <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-[#1E5EFF]" />
                  <div className="font-semibold text-slate-800 dark:text-slate-100">{h.action.replace("_", " ")} <span className="font-normal text-slate-500">→ {h.toStatus}</span></div>
                  <div className="text-slate-500">{fmt(h.createdAt)} · {h.actorName ?? "System"}</div>
                  {h.reason && <div className="mt-0.5 text-slate-600 dark:text-slate-300">“{h.reason}”</div>}
                </li>
              ))}
            </ol>
          </>
        )}
      </aside>
    </div>
  );
}
