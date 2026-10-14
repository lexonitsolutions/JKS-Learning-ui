"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, CheckCircle2, FileUp, Loader2, ShieldCheck, X } from "lucide-react";
import {
  RESUME_ACCEPT,
  RESUME_MAX_BYTES,
  importResumeFile,
  type PersonalField,
  type ResumeContent,
  type ResumeImportResult,
} from "@/lib/data/resume-import-api";
import {
  downloadResumeSource,
  getResumeSource,
  removeResumeSource,
  saveResumeSource,
  type StoredResumeSource,
} from "@/lib/utils/resume-source-store";

interface Props {
  open: boolean;
  /** The resume currently in the builder (without item ids). */
  current: ResumeContent;
  onClose: () => void;
  /** Receives the final merged resume once the student confirms. */
  onApply: (content: ResumeContent) => void;
}

const FIELD_LABEL: Record<PersonalField, string> = {
  fullName: "Full name",
  headline: "Headline",
  email: "Email",
  phone: "Phone",
  location: "Location",
  linkedin: "LinkedIn",
  github: "GitHub",
  portfolio: "Portfolio",
  summary: "Summary",
};

type Stage = "pick" | "reading" | "review" | "done";

/** Mounts the dialog only while open, so every opening starts from a clean state. */
export function ResumeImportModal(props: Props) {
  return props.open ? <ResumeImportDialog {...props} /> : null;
}

function ResumeImportDialog({ open, current, onClose, onApply }: Props) {
  const [stage, setStage] = useState<Stage>("pick");
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState<ResumeImportResult | null>(null);
  const [useImported, setUseImported] = useState<Set<PersonalField>>(new Set());
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [keepCopy, setKeepCopy] = useState(true);
  const [copyNote, setCopyNote] = useState<string | null>(null);
  // A copy kept earlier in this browser (localStorage). Read lazily so SSR never touches storage.
  const [stored, setStored] = useState<StoredResumeSource | null>(() => (typeof window === "undefined" ? null : getResumeSource()));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && stage !== "reading" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, stage, onClose]);

  if (!open || typeof document === "undefined") return null;

  async function handleFile(file: File | undefined | null) {
    if (!file) return;
    setError(null);
    if (!/\.(pdf|docx|txt)$/i.test(file.name)) {
      setError("Please choose a PDF, DOCX or TXT file. Old .doc files are not supported.");
      return;
    }
    if (file.size > RESUME_MAX_BYTES) {
      setError("That file is larger than 5 MB.");
      return;
    }
    setFileName(file.name);
    setFile(file);
    setStage("reading");
    try {
      setResult(await importResumeFile(file, current));
      setStage("review");
    } catch (err) {
      setError(err instanceof Error ? err.message : "We could not read that file.");
      setStage("pick");
    }
  }

  async function apply() {
    if (!result) return;
    const final: ResumeContent = JSON.parse(JSON.stringify(result.merged));
    for (const c of result.report.conflicts) {
      if (useImported.has(c.field)) final.personal[c.field] = c.imported;
    }
    onApply(final);
    if (keepCopy && file) {
      const r = await saveResumeSource(file);
      if (r.saved) {
        setStored(getResumeSource());
        setCopyNote("A copy of your file is kept in this browser only. You can download or remove it from this dialog.");
      } else {
        setCopyNote(`Your resume was updated, but a copy of the file was not kept. ${r.reason}`);
      }
    } else {
      setCopyNote(null);
    }
    setStage("done");
  }

  const toggleConflict = (field: PersonalField) =>
    setUseImported((prev) => {
      const next = new Set(prev);
      if (next.has(field)) next.delete(field);
      else next.add(field);
      return next;
    });

  const added = result?.report.added;
  const totalAdded = added ? Object.values(added).reduce((a, b) => a + b, 0) : 0;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs dark:bg-black/75"
      onClick={() => stage !== "reading" && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="resume-import-title"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-xl flex-col rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-surface-secondary"
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-5 dark:border-slate-800">
          <div>
            <h3 id="resume-import-title" className="flex items-center gap-2 text-base font-black text-slate-900 dark:text-white">
              <FileUp className="h-4 w-4 text-[#2563EB]" /> Upload your existing resume
            </h3>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              We read your file, then merge it with your JKS Learning certificates and completed courses. You review everything before it is applied.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={stage === "reading"}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-surface-hover"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto p-5 text-xs">
          {error && (
            <p role="alert" className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 font-semibold text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {error}
            </p>
          )}

          {stage === "pick" && (
            <>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  void handleFile(e.dataTransfer.files?.[0]);
                }}
                className={`flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed p-8 text-center ${
                  dragging ? "border-[#2563EB] bg-blue-50 dark:bg-blue-950/20" : "border-slate-300 dark:border-slate-700"
                }`}
              >
                <FileUp className="h-8 w-8 text-slate-400" />
                <p className="font-semibold text-slate-700 dark:text-slate-200">Drag your resume here, or</p>
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
                >
                  Choose a file
                </button>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">PDF, DOCX or TXT, up to 5 MB. Scanned images are not supported.</p>
                <input
                  ref={inputRef}
                  type="file"
                  accept={RESUME_ACCEPT}
                  className="sr-only"
                  aria-label="Resume file"
                  onChange={(e) => {
                    void handleFile(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </div>
              {stored && (
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-slate-800 dark:text-slate-100">{stored.name}</span>
                    <span className="block text-[11px] text-slate-500">Kept in this browser · {Math.max(1, Math.round(stored.size / 1024))} KB</span>
                  </span>
                  <span className="flex gap-2">
                    <button type="button" onClick={() => downloadResumeSource(stored)} className="rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-surface-hover">
                      Download
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        removeResumeSource();
                        setStored(null);
                      }}
                      className="rounded-lg border border-rose-200 px-2.5 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-50 dark:border-rose-900/60 dark:text-rose-300 dark:hover:bg-rose-950/30"
                    >
                      Remove
                    </button>
                  </span>
                </div>
              )}
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Your details already in the builder are never overwritten. The server only reads the file to fill the gaps; it does not save it. If you choose, a copy stays in this browser only.
              </p>
            </>
          )}

          {stage === "reading" && (
            <p role="status" className="flex items-center gap-2 py-8 text-sm text-slate-600 dark:text-slate-300">
              <Loader2 className="h-4 w-4 animate-spin" /> Reading <strong className="truncate">{fileName}</strong> and checking it against your profile…
            </p>
          )}

          {stage === "review" && result && (
            <>
              <p className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Read {fileName} ({result.file.kind.toUpperCase()}
                {result.file.pages ? `, ${result.file.pages} page${result.file.pages === 1 ? "" : "s"}` : ""})
              </p>

              {result.warnings.map((w) => (
                <p key={w} className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-300">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {w}
                </p>
              ))}

              <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                <p className="mb-2 font-bold text-slate-800 dark:text-slate-100">Will be added to your resume</p>
                {totalAdded === 0 ? (
                  <p className="text-slate-500">Nothing new — everything in this file is already in your resume.</p>
                ) : (
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-700 dark:text-slate-300">
                    {added!.experiences > 0 && <li>Experience: +{added!.experiences}</li>}
                    {added!.educations > 0 && <li>Education: +{added!.educations}</li>}
                    {added!.projects > 0 && <li>Projects: +{added!.projects}</li>}
                    {added!.certifications > 0 && <li>Certifications: +{added!.certifications}</li>}
                    {added!.skills > 0 && <li>Skills: +{added!.skills}</li>}
                  </ul>
                )}
                {result.report.duplicatesSkipped > 0 && (
                  <p className="mt-2 text-[11px] text-slate-500">{result.report.duplicatesSkipped} duplicate item(s) skipped.</p>
                )}
              </div>

              <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-300">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>
                  From your JKS Learning account: <strong>{result.platform.certificates}</strong> verified certificate(s),{" "}
                  <strong>{result.platform.completedCourses}</strong> completed course(s) without a certificate yet,{" "}
                  <strong>{result.platform.technologies}</strong> profile technolog{result.platform.technologies === 1 ? "y" : "ies"}.
                </span>
              </div>

              {result.report.conflicts.length > 0 && (
                <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                  <p className="mb-1 font-bold text-slate-800 dark:text-slate-100">Differences</p>
                  <p className="mb-2 text-[11px] text-slate-500">Your current value is kept unless you tick the box.</p>
                  <ul className="space-y-2">
                    {result.report.conflicts.map((c) => (
                      <li key={c.field}>
                        <label className="flex cursor-pointer items-start gap-2">
                          <input
                            type="checkbox"
                            checked={useImported.has(c.field)}
                            onChange={() => toggleConflict(c.field)}
                            className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-[#2563EB]"
                          />
                          <span className="min-w-0">
                            <span className="block font-semibold text-slate-800 dark:text-slate-100">{FIELD_LABEL[c.field]}: use the value from the file</span>
                            <span className="block truncate text-slate-500">Current: {c.current}</span>
                            <span className="block truncate text-slate-500">File: {c.imported}</span>
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <label className="flex cursor-pointer items-start gap-2 rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                <input type="checkbox" checked={keepCopy} onChange={(e) => setKeepCopy(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-[#2563EB]" />
                <span className="text-slate-700 dark:text-slate-300">
                  <span className="block font-semibold">Keep a copy of this file in this browser</span>
                  <span className="block text-[11px] text-slate-500">Stored locally on this device only (not uploaded to our servers or cloud storage).</span>
                </span>
              </label>

              {result.dropped.length > 0 && (
                <details className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                  <summary className="cursor-pointer font-semibold text-slate-700 dark:text-slate-200">
                    {result.dropped.length} detail(s) left out because they were not found in your file
                  </summary>
                  <ul className="mt-2 list-disc space-y-0.5 pl-5 text-slate-500">
                    {result.dropped.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </details>
              )}
            </>
          )}
        </div>

        {stage === "done" && (
          <div className="space-y-2 px-5 pb-5 text-xs">
            <p role="status" className="flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4" /> Your resume was updated.
            </p>
            {copyNote && <p className="text-slate-600 dark:text-slate-300">{copyNote}</p>}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 border-t border-slate-100 p-4 dark:border-slate-800">
          {stage === "review" && (
            <button
              type="button"
              onClick={() => {
                setStage("pick");
                setResult(null);
              }}
              className="mr-auto rounded-xl px-3 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-surface-hover"
            >
              Choose a different file
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            disabled={stage === "reading"}
            className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-surface-hover"
          >
            {stage === "done" ? "Close" : "Cancel"}
          </button>
          {stage === "review" && (
            <button
              type="button"
              onClick={() => void apply()}
              className="rounded-xl bg-[#2563EB] px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700"
            >
              Apply to my resume
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
