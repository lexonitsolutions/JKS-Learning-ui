"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { AccessStatusBadge } from "@/components/common/feature-access-gate";
import {
  fetchFeatureAccessRequests,
  reviewFeatureAccessRequest,
  type AiFeature,
  type FeatureAccessRequestRow,
} from "@/lib/data/ai-api";

const FEATURE_LABEL: Record<AiFeature, string> = {
  AI_MOCK_INTERVIEW: "AI Mock Interview",
  AI_RESUME_REVIEW: "AI Resume Review",
};

const FILTERS = [
  { id: "PENDING", label: "Pending" },
  { id: "APPROVED", label: "Approved" },
  { id: "REJECTED", label: "Rejected" },
  { id: "", label: "All" },
] as const;

export default function AdminAiAccessPage() {
  const [filter, setFilter] = useState<string>("PENDING");
  const [rows, setRows] = useState<FeatureAccessRequestRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [workingId, setWorkingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setRows(await fetchFeatureAccessRequests(filter || undefined));
    } catch (err) {
      setRows([]);
      setError(err instanceof Error ? err.message : "Could not load requests.");
    }
  }, [filter]);

  useEffect(() => {
    setRows(null);
    void load();
  }, [load]);

  async function decide(row: FeatureAccessRequestRow, status: "APPROVED" | "REJECTED") {
    let note: string | undefined;
    if (status === "REJECTED") {
      const input = window.prompt("Optional note shown to the student:", "");
      if (input === null) return; // cancelled
      note = input.trim() || undefined;
    }
    setWorkingId(row.id);
    setError(null);
    try {
      await reviewFeatureAccessRequest(row.id, status, note);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update the request.");
    } finally {
      setWorkingId(null);
    }
  }

  return (
    <>
      <DashboardTopbar
        title="AI Access Requests"
        subtitle="Approve or reject student access to AI Mock Interview and AI Resume Review."
      />

      <div className="flex-1 space-y-4 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by status">
          {FILTERS.map((f) => (
            <button
              key={f.label}
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                filter === f.id
                  ? "bg-[#2563EB] text-white"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-surface-elevated dark:text-slate-300 dark:ring-slate-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {error && (
          <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-[20px] border border-white/70 bg-white/80 shadow-[0_8px_30px_rgb(20,50,100,0.06)] dark:border-slate-800/80 dark:bg-surface-secondary/90 dark:shadow-none">
          {rows === null ? (
            <p className="flex items-center gap-2 p-6 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading requests…
            </p>
          ) : rows.length === 0 ? (
            <p className="p-6 text-sm text-slate-500 dark:text-slate-400">No requests in this view.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-xs">
                <thead className="border-b border-slate-100 text-[11px] uppercase tracking-wide text-slate-500 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Feature</th>
                    <th className="px-4 py-3">Requested</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900 dark:text-white">{r.user.name}</div>
                        <div className="text-slate-500 dark:text-slate-400">{r.user.email}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{FEATURE_LABEL[r.feature]}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <AccessStatusBadge status={r.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            disabled={workingId === r.id || r.status === "APPROVED"}
                            onClick={() => decide(r, "APPROVED")}
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 font-semibold text-white hover:bg-emerald-700 disabled:opacity-40"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                          </button>
                          <button
                            type="button"
                            disabled={workingId === r.id || r.status === "REJECTED"}
                            onClick={() => decide(r, "REJECTED")}
                            className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-3 py-1.5 font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-40 dark:border-rose-900/60 dark:hover:bg-rose-950/30"
                          >
                            <XCircle className="h-3.5 w-3.5" /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
