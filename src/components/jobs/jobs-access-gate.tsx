"use client";

import { useState } from "react";
import { BadgeCheck, Clock3, Loader2, LockKeyhole, ShieldAlert, XCircle } from "lucide-react";
import type { JobsAccessView } from "@/lib/data/jobs-api";
import { formatDate } from "./job-ui";

function Shell({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center rounded-3xl border border-[#E5E7EB] bg-white px-6 py-10 text-center shadow-[0_20px_50px_-30px_rgba(11,31,58,0.35)] dark:border-slate-800 dark:bg-surface-elevated sm:px-10">
      {icon}
      <h2 className="mt-5 text-xl font-bold text-[#0B1F3A] dark:text-white">{title}</h2>
      {children}
    </div>
  );
}

const iconBox = "flex h-14 w-14 items-center justify-center rounded-2xl";

export function JobsAccessGate({
  access,
  onRequest,
}: {
  access: JobsAccessView;
  onRequest: (message: string) => Promise<void>;
}) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await onRequest(message.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send your request. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (access.status === "PENDING") {
    return (
      <Shell icon={<div className={`${iconBox} bg-amber-50 text-amber-600 dark:bg-amber-950/40`}><Clock3 className="h-7 w-7" /></div>} title="Your request is awaiting approval">
        <p className="mt-2 text-sm text-[#696969] dark:text-slate-400">
          An administrator will review it soon. You&apos;ll get a notification here as soon as there&apos;s a decision
          {access.requestedAt ? ` (requested ${formatDate(access.requestedAt)})` : ""}.
        </p>
        {access.message && (
          <p className="mt-4 w-full rounded-xl bg-slate-50 p-3 text-left text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
            <span className="font-semibold">Your message:</span> {access.message}
          </p>
        )}
      </Shell>
    );
  }

  if (access.status === "REVOKED") {
    return (
      <Shell icon={<div className={`${iconBox} bg-rose-50 text-rose-600 dark:bg-rose-950/40`}><ShieldAlert className="h-7 w-7" /></div>} title="Jobs Portal access was removed">
        <p className="mt-2 text-sm text-[#696969] dark:text-slate-400">
          Your access has been revoked{access.reviewNote ? `: ${access.reviewNote}` : "."} Please contact the JKS Learning team if you think this is a mistake.
        </p>
      </Shell>
    );
  }

  const rejected = access.status === "REJECTED";
  return (
    <Shell
      icon={
        <div className={`${iconBox} ${rejected ? "bg-rose-50 text-rose-600 dark:bg-rose-950/40" : "bg-[#1E5EFF]/10 text-[#1E5EFF]"}`}>
          {rejected ? <XCircle className="h-7 w-7" /> : <LockKeyhole className="h-7 w-7" />}
        </div>
      }
      title={rejected ? "Your request wasn't approved" : "Unlock Jobs & Internships"}
    >
      {rejected ? (
        <p className="mt-2 text-sm text-[#696969] dark:text-slate-400">
          {access.reviewNote ? `Reason: ${access.reviewNote}. ` : ""}
          {access.canRequest
            ? "You can send a new request below."
            : `You can request access again after ${formatDate(access.retryAt)}.`}
        </p>
      ) : (
        <p className="mt-2 text-sm text-[#696969] dark:text-slate-400">
          Verified openings shared with the JKS Learning community are available to approved students. Request access and an administrator will review it.
        </p>
      )}

      {access.canRequest && (
        <form onSubmit={submit} className="mt-6 w-full text-left">
          <label htmlFor="jobs-msg" className="text-xs font-semibold text-[#222222] dark:text-slate-200">
            Why are you interested? <span className="font-normal text-[#696969]">(optional)</span>
          </label>
          <textarea
            id="jobs-msg"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder="e.g. I'm completing the Java course and looking for my first role."
            className="mt-1.5 w-full resize-none rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#222222] outline-none transition focus:border-[#1E5EFF] focus:ring-2 focus:ring-[#1E5EFF]/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
          <div className="mt-1 text-right text-[11px] text-[#696969]">{message.length}/500</div>
          {error && (
            <p role="alert" className="mt-2 rounded-lg bg-rose-50 p-2.5 text-xs text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E5EFF] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1649CC] disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <BadgeCheck className="h-4 w-4" />}
            {busy ? "Sending…" : "Request Access"}
          </button>
        </form>
      )}
    </Shell>
  );
}
