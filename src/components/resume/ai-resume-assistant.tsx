"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Check, Loader2, Sparkles, Wand2, X } from "lucide-react";
import { analyzeResume, type ResumeAnalysis } from "@/lib/data/ai-api";
import { FeatureAccessGate, useFeatureAccess } from "@/components/common/feature-access-gate";

interface Props {
  open: boolean;
  onClose: () => void;
  resumeData: unknown;
  /** Replace a bullet in the resume. Returns true if the text was found and replaced. */
  onApplyBullet: (original: string, enhanced: string) => boolean;
}

function ScoreChip({ label, value }: { label: string; value: number }) {
  const tone =
    value >= 75
      ? "text-emerald-600 dark:text-emerald-400"
      : value >= 50
        ? "text-amber-500 dark:text-amber-400"
        : "text-rose-600 dark:text-rose-400";
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 text-center dark:border-slate-700 dark:bg-surface-elevated">
      <p className={`text-2xl font-extrabold ${tone}`}>{value}</p>
      <p className="mt-0.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}

export function AiResumeAssistant({ open, onClose, resumeData, onApplyBullet }: Props) {
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [applied, setApplied] = useState<Record<string, "done" | "missing">>({});
  const access = useFeatureAccess("AI_RESUME_REVIEW");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  async function run() {
    setLoading(true);
    setError(null);
    try {
      setAnalysis(await analyzeResume(resumeData, jobDescription.trim()));
      setApplied({});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex justify-end bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <aside
        data-lenis-prevent
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-xl flex-col overflow-y-auto bg-white shadow-2xl dark:bg-surface-secondary"
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur dark:border-slate-800 dark:bg-surface-secondary/95">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#2563EB] dark:text-blue-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">AI Resume Review</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-surface-hover"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {access.state && !access.state.canUse && (
          <div className="p-5">
            <FeatureAccessGate
              feature="AI_RESUME_REVIEW"
              title="AI Resume Review"
              state={access.state}
              onChanged={access.reload}
              compact
            />
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              You can keep creating and editing your resume as usual while you wait.
            </p>
          </div>
        )}
        {access.error && !access.state && (
          <p role="alert" className="p-5 text-xs text-rose-600 dark:text-rose-400">
            {access.error}
          </p>
        )}

        {access.state?.canUse && (
        <div className="space-y-5 p-5">
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300" htmlFor="ai-jd">
              Target job description <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              id="ai-jd"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={4}
              maxLength={6000}
              placeholder="Paste a job description to get keyword and match scoring against it…"
              className="mt-1.5 w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-surface-elevated dark:text-white"
            />
            <button
              type="button"
              onClick={run}
              disabled={loading}
              className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
              {loading ? "Analysing your resume…" : analysis ? "Analyse again" : "Analyse my resume"}
            </button>
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {analysis && (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <ScoreChip label="ATS score" value={analysis.atsScore} />
                <ScoreChip label="Formatting" value={analysis.formattingScore} />
                <ScoreChip label="Impact" value={analysis.impactScore} />
                <ScoreChip label="Keywords" value={analysis.keywordScore} />
              </div>
              {analysis.jobMatchScore !== undefined && (
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Match with target job: <span className="text-[#2563EB] dark:text-blue-400">{analysis.jobMatchScore}%</span>
                </p>
              )}

              <Section title="Critical fixes" items={analysis.criticalFixes} />
              <Section title="Strengths" items={analysis.strengths} />

              {analysis.missingKeywords.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Missing keywords</h3>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {analysis.missingKeywords.map((k) => (
                      <span
                        key={k}
                        className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {analysis.bulletEnhancements.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Suggested bullet rewrites</h3>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    Replace any <span className="font-mono">[bracketed]</span> placeholder with your real numbers. Never keep
                    figures that are not true.
                  </p>
                  <ul className="mt-3 space-y-3">
                    {analysis.bulletEnhancements.map((b) => (
                      <li key={b.id} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                        <p className="text-xs text-slate-500 line-through dark:text-slate-400">{b.originalBullet}</p>
                        <p className="mt-1.5 text-sm font-medium text-slate-900 dark:text-white">{b.enhancedBullet}</p>
                        {b.reason && <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{b.reason}</p>}
                        <button
                          type="button"
                          disabled={applied[b.id] === "done"}
                          onClick={() => {
                            const ok = onApplyBullet(b.originalBullet, b.enhancedBullet);
                            setApplied((p) => ({ ...p, [b.id]: ok ? "done" : "missing" }));
                          }}
                          className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-bold text-[#1E5EFF] hover:bg-blue-100 disabled:opacity-60 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300"
                        >
                          {applied[b.id] === "done" ? <Check className="h-3.5 w-3.5" /> : <Wand2 className="h-3.5 w-3.5" />}
                          {applied[b.id] === "done" ? "Applied" : "Apply to resume"}
                        </button>
                        {applied[b.id] === "missing" && (
                          <span className="ml-2 text-[11px] text-amber-600 dark:text-amber-400">
                            That bullet was edited - could not find it.
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
        )}
      </aside>
    </div>,
    document.body,
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-600 dark:text-slate-300">
        {items.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </div>
  );
}
