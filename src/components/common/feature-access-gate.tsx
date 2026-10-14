"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Clock, Loader2, Lock, ShieldAlert, XCircle } from "lucide-react";
import Link from "next/link";
import {
  fetchMyFeatureAccess,
  requestFeatureAccess,
  type AiFeature,
  type FeatureAccessState,
} from "@/lib/data/ai-api";

/** Loads the student's access state for one admin-approved AI feature. */
export function useFeatureAccess(feature: AiFeature) {
  const [state, setState] = useState<FeatureAccessState | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      const all = await fetchMyFeatureAccess();
      setState(all.find((s) => s.feature === feature) ?? null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not check access.");
    }
  }, [feature]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { state, error, reload, loading: state === null && error === null };
}

const STATUS_STYLE = {
  NONE: { label: "Not requested", cls: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200", Icon: Lock },
  PENDING: { label: "Pending", cls: "bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-200", Icon: Clock },
  APPROVED: { label: "Approved", cls: "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200", Icon: CheckCircle2 },
  REJECTED: { label: "Rejected", cls: "bg-rose-100 text-rose-800 dark:bg-rose-400/15 dark:text-rose-200", Icon: XCircle },
} as const;

export function AccessStatusBadge({ status }: { status: FeatureAccessState["status"] }) {
  const { label, cls, Icon } = STATUS_STYLE[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${cls}`}>
      <Icon className="h-3 w-3" /> {label}
    </span>
  );
}

interface GateProps {
  feature: AiFeature;
  title: string;
  state: FeatureAccessState;
  onChanged: () => void | Promise<void>;
  compact?: boolean;
}

/** Explains what is needed to use a feature and lets the student request approval. */
export function FeatureAccessGate({ feature, title, state, onChanged, compact }: GateProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canRequest = state.enrolled || feature !== "AI_MOCK_INTERVIEW";
  const showRequest = canRequest && (state.status === "NONE" || state.status === "REJECTED");

  async function request() {
    setBusy(true);
    setError(null);
    try {
      await requestFeatureAccess(feature);
      await onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send your request.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className={`rounded-2xl border border-amber-200 bg-amber-50/70 dark:border-amber-900/50 dark:bg-amber-950/20 ${
        compact ? "p-4" : "p-5 sm:p-6"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title} needs administrator approval</h3>
        <AccessStatusBadge status={state.status} />
      </div>

      <p className="mt-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">{state.message}</p>
      {state.status === "REJECTED" && state.reviewNote && (
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">Administrator note: {state.reviewNote}</p>
      )}

      {feature === "AI_MOCK_INTERVIEW" && (
        <ul className="mt-3 space-y-1 text-xs text-slate-700 dark:text-slate-300">
          <li className="flex items-center gap-2">
            {state.enrolled ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <XCircle className="h-3.5 w-3.5 text-rose-500" />
            )}
            Enrolled in at least one course
          </li>
          <li className="flex items-center gap-2">
            {state.status === "APPROVED" ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <XCircle className="h-3.5 w-3.5 text-rose-500" />
            )}
            Approved by an administrator
          </li>
        </ul>
      )}

      {error && (
        <p role="alert" className="mt-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
          {error}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {showRequest && (
          <button
            type="button"
            onClick={request}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
          >
            {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {state.status === "REJECTED" ? "Request access again" : "Request access"}
          </button>
        )}
        {!state.enrolled && feature === "AI_MOCK_INTERVIEW" && (
          <Link
            href="/dashboard/courses"
            className="text-xs font-semibold text-[#2563EB] underline-offset-2 hover:underline dark:text-blue-400"
          >
            Browse courses
          </Link>
        )}
        {state.status === "PENDING" && (
          <button
            type="button"
            onClick={() => void onChanged()}
            className="text-xs font-semibold text-slate-600 underline-offset-2 hover:underline dark:text-slate-300"
          >
            Refresh status
          </button>
        )}
      </div>
    </div>
  );
}
