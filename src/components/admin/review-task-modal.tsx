"use client";

import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  FileText,
  FileCheck,
  Download,
  Loader2,
  Star,
} from "lucide-react";
import {
  reviewTaskSubmission,
  type IndividualTask,
  type TaskQuestion,
} from "@/lib/data/tasks-api";

interface ReviewTaskModalProps {
  isOpen: boolean;
  task: IndividualTask | null;
  onClose: () => void;
  onReviewed: (updatedTask: IndividualTask) => void;
}

export function ReviewTaskModal({ isOpen, task, onClose, onReviewed }: ReviewTaskModalProps) {
  const [score, setScore] = useState<number>(task?.submission?.score ?? 85);
  const [feedback, setFeedback] = useState<string>(
    task?.submission?.feedback ?? "Demonstrated sound understanding of core concepts. Great job!"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !task) return null;

  const submission = task.submission;
  const answers = submission?.answers || {};
  const questions: TaskQuestion[] = task.questions || [];

  // Helper keyword match calculation for short/long answers
  const computeKeywordMatch = (studentText: string, modelText: string) => {
    if (!studentText || !modelText) return 75;
    const modelWords = modelText
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 3);
    if (modelWords.length === 0) return 85;

    const studentLower = studentText.toLowerCase();
    let matches = 0;
    modelWords.forEach((word) => {
      if (studentLower.includes(word)) matches++;
    });

    const percent = Math.min(100, Math.round((matches / modelWords.length) * 100));
    return Math.max(50, percent);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await reviewTaskSubmission(task.id, {
        score: Number(score),
        feedback: feedback.trim(),
      });

      if (res.success && res.data) {
        onReviewed(res.data);
        onClose();
      } else {
        setErrorMessage(res.error || "Failed to submit review.");
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 font-bold">
            <FileCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Review Submission: {task.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Student: <strong className="text-slate-800 dark:text-slate-200">{task.assignedStudentEmail}</strong> · Submitted:{" "}
              {submission?.submittedAt
                ? new Date(submission.submittedAt).toLocaleString("en-IN")
                : "Recent"}
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 p-3 text-xs font-semibold text-rose-700 dark:text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* QUESTIONS & ANSWERS COMPARISON VIEW */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Question Responses &amp; Model Answer Comparison
          </h4>

          {questions.length > 0 ? (
            questions.map((q, idx) => {
              const studentAnswer = answers[q.id];
              const matchScore =
                q.type === "SHORT_ANSWER" || q.type === "LONG_ANSWER"
                  ? computeKeywordMatch(String(studentAnswer || ""), q.modelAnswer || "")
                  : null;

              return (
                <div
                  key={q.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-surface-elevated/60 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      Q{idx + 1}: {q.prompt}
                    </span>
                    <span className="text-[10px] font-bold uppercase text-[#2563EB] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                      {q.type.replace("_", " ")}
                    </span>
                  </div>

                  {/* Student Answer */}
                  <div className="rounded-lg bg-white dark:bg-input-bg border border-slate-200 dark:border-slate-700 p-3 text-xs space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Student&apos;s Submitted Answer:
                    </span>
                    {q.type === "MCQ" && q.choices ? (
                      <div className="space-y-1 pt-1">
                        {q.choices.map((c, cIdx) => {
                          const isSelected = studentAnswer === cIdx;
                          const isCorrect = q.correctAnswer === cIdx;
                          return (
                            <div
                              key={cIdx}
                              className={`flex items-center justify-between rounded-lg p-2 text-xs font-medium border ${
                                isSelected
                                  ? isCorrect
                                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-900 dark:text-emerald-200 font-bold"
                                    : "bg-rose-50 dark:bg-rose-950/40 border-rose-300 text-rose-900 dark:text-rose-200 font-bold"
                                  : "border-transparent text-slate-600 dark:text-slate-300"
                              }`}
                            >
                              <span>{c}</span>
                              {isSelected && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white dark:bg-surface-elevated shadow-xs">
                                  {isCorrect ? "Correct Choice ✓" : "Student Selected ✗"}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                        {studentAnswer ? String(studentAnswer) : "(No answer submitted)"}
                      </p>
                    )}
                  </div>

                  {/* Admin Model Answer Comparison */}
                  {(q.type === "SHORT_ANSWER" || q.type === "LONG_ANSWER") && q.modelAnswer && (
                    <div className="rounded-lg bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 p-3 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-blue-900 dark:text-blue-300">
                          Faculty Model Answer / Key Rubric Points:
                        </span>
                        {matchScore !== null && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              matchScore >= 70
                                ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                                : "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300"
                            }`}
                          >
                            ~{matchScore}% Concept Alignment
                          </span>
                        )}
                      </div>
                      <p className="text-blue-950 dark:text-blue-200 whitespace-pre-wrap italic">
                        {q.modelAnswer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 text-xs bg-slate-50 dark:bg-surface-elevated">
              <span className="font-bold text-slate-700 dark:text-slate-300">Submitted Content:</span>
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                {submission?.uploadedFileName ? (
                  <span className="font-mono text-[#2563EB] dark:text-blue-400">
                    File uploaded: {submission.uploadedFileName}
                  </span>
                ) : (
                  "Direct task completion verified."
                )}
              </p>
            </div>
          )}

          {/* Uploaded File Link if available */}
          {submission?.uploadedFileName && (
            <div className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-elevated p-3 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#2563EB] dark:text-blue-400" />
                <span>Uploaded Artifact: {submission.uploadedFileName}</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-bold">Verified Submission ✓</span>
            </div>
          )}
        </div>

        {/* GRADING & FEEDBACK FORM */}
        <form onSubmit={handleReviewSubmit} className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                Score / Points (0 - 100) *
              </label>
              <div className="relative mt-1.5">
                <input
                  type="number"
                  min={0}
                  max={100}
                  required
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">
                  / 100
                </span>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                Faculty Written Feedback &amp; Remarks *
              </label>
              <input
                type="text"
                required
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="e.g. Excellent architectural breakdown. Code clean and well-structured."
                className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3.5 py-2 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-surface-elevated cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving Review...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Submit Review &amp; Complete Task</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
