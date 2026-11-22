"use client";

import { useState } from "react";
import { Download, Eye, Loader2 } from "lucide-react";
import { isOpenableFileUrl, openSubmissionFile } from "@/lib/api/submission-files";

/** Preview + Download buttons for a file a student submitted. */
export function SubmissionFileActions({
  url,
  name,
  className = "",
}: {
  url?: string | null;
  name?: string | null;
  className?: string;
}) {
  const [busy, setBusy] = useState<"preview" | "download" | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpenableFileUrl(url)) {
    return (
      <span className={`text-[11px] font-semibold text-amber-600 dark:text-amber-400 ${className}`}>
        File not available (submitted before file storage was enabled; ask the student to resubmit)
      </span>
    );
  }

  const run = async (mode: "preview" | "download") => {
    setBusy(mode);
    setError(null);
    try {
      await openSubmissionFile(url, name || "submission", mode);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not open the file.");
    } finally {
      setBusy(null);
    }
  };

  const btn =
    "inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold transition-colors disabled:opacity-60";
  return (
    <span className={`inline-flex flex-col items-end gap-1 ${className}`}>
      <span className="inline-flex gap-1.5">
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => run("preview")}
          className={`${btn} border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800`}
        >
          {busy === "preview" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Eye className="h-3.5 w-3.5" />}
          Preview
        </button>
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => run("download")}
          className={`${btn} bg-[#2563EB] text-white hover:bg-blue-700`}
        >
          {busy === "download" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
          Download
        </button>
      </span>
      {error ? <span className="max-w-xs text-right text-[10px] font-semibold text-rose-600">{error}</span> : null}
    </span>
  );
}
