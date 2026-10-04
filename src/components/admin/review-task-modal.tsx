"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  XCircle,
  Award,
} from "lucide-react";
import {
  reviewTaskSubmission,
  type IndividualTask,
  type TaskQuestion,
} from "@/lib/data/tasks-api";
import { evaluateAssessmentSubmission } from "@/lib/data/assessment-scoring";

interface ReviewTaskModalProps {
  isOpen: boolean;
  task: IndividualTask | null;
  onClose: () => void;
  onReviewed: (updatedTask: IndividualTask) => void;
}

export function ReviewTaskModal({ isOpen, task, onClose, onReviewed }: ReviewTaskModalProps) {
  const submission = task?.submission;
  const answers = submission?.answers || {};
  const questions: TaskQuestion[] = task?.questions || [];

  // Compute accurate question-by-question correctness
  const evaluationResult = useMemo(() => {
    return evaluateAssessmentSubmission(questions, answers, submission?.uploadedFileName);
  }, [questions, answers, submission?.uploadedFileName]);

  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reviewAction, setReviewAction] = useState<"Completed" | "Failed">("Completed");

  useEffect(() => {
    if (task) {
      // Determine initial score: prioritize instructor score, else existing score (if not false 85 on failed), else auto-calculated
      let initialScore = evaluationResult.score;
      if (task.submission?.instructorScore !== undefined) {
        // If task was marked Failed but had false 85, correct it to evaluationResult.score
        if (task.status === "Failed" && task.submission.instructorScore >= 60 && evaluationResult.score < 50) {
          initialScore = evaluationResult.score;
        } else {
          initialScore = task.submission.instructorScore;
        }
      } else if (task.submission?.score !== undefined) {
        if (task.status === "Failed" && task.submission.score >= 60 && evaluationResult.score < 50) {
          initialScore = evaluationResult.score;
        } else {
          initialScore = task.submission.score;
        }
      }

      setScore(initialScore);

      const existingFeedback =
        task.submission?.instructorFeedback ?? task.submission?.feedback;

      if (existingFeedback && existingFeedback !== "Demonstrated sound understanding of core concepts. Great job!") {
        setFeedback(existingFeedback);
      } else if (initialScore < 50 || task.status === "Failed") {
        setFeedback(
          `Assessment did not meet passing criteria (${evaluationResult.correctCount}/${questions.length} correct). Please review the curriculum notes and retry.`
        );
      } else {
        setFeedback("Demonstrated sound understanding of core concepts. Great job!");
      }
    }
  }, [task, evaluationResult]);

  if (!isOpen || !task) return null;

  const handleReviewSubmit = async (targetStatus: "Completed" | "Failed") => {
    setIsSubmitting(true);
    setReviewAction(targetStatus);
    setErrorMessage(null);

    // Ensure sensible scoring based on target status
    let finalScore = Number(score);
    let finalFeedback = feedback.trim();

    if (targetStatus === "Failed") {
      // If marking as Failed, score cannot be an unearned distinction score (like 85)
      if (finalScore >= 50) {
        finalScore = evaluationResult.score < 50 ? evaluationResult.score : Math.min(finalScore, 40);
      }
      if (!finalFeedback || finalFeedback === "Demonstrated sound understanding of core concepts. Great job!") {
        finalFeedback = `Assessment did not meet passing criteria (${evaluationResult.correctCount}/${questions.length} correct). Please review instructor remarks and retry.`;
      }
    } else {
      // Completed
      if (finalScore < 50 && evaluationResult.score >= 50) {
        finalScore = evaluationResult.score;
      } else if (finalScore < 50) {
        finalScore = 60; // minimum passing mark for approved completion
      }
      if (!finalFeedback) {
        finalFeedback = "Demonstrated sound understanding of core concepts. Great job!";
      }
    }

    try {
      const res = await reviewTaskSubmission(task.id, {
        score: finalScore,
        feedback: finalFeedback,
        instructorFeedback: finalFeedback,
        status: targetStatus,
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
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 font-bold shrink-0">
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

        {/* ACCURATE SCORECARD BAR */}
        {questions.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-surface-elevated/70 p-3.5 text-xs">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-[#2563EB] dark:text-blue-400" />
              <span className="font-bold text-slate-700 dark:text-slate-200">
                Evaluation Scorecard:
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-800 dark:text-emerald-300 px-2.5 py-0.5 text-[11px] font-bold">
                <CheckCircle2 className="h-3 w-3" />
                {evaluationResult.correctCount} Correct
              </span>

              <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 dark:bg-rose-950/60 border border-rose-300 text-rose-800 dark:text-rose-300 px-2.5 py-0.5 text-[11px] font-bold">
                <XCircle className="h-3 w-3" />
                {evaluationResult.incorrectCount} Incorrect
              </span>

              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-950/60 border border-blue-300 text-blue-900 dark:text-blue-300 px-2.5 py-0.5 text-[11px] font-bold">
                Auto-Score: {evaluationResult.score}/100 ({evaluationResult.totalEarned}/{evaluationResult.totalMax} pts)
              </span>
            </div>
          </div>
        )}

        {/* QUESTIONS & ANSWERS COMPARISON VIEW */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Question Responses &amp; Answer Evaluation
          </h4>

          {evaluationResult.evaluations.length > 0 ? (
            evaluationResult.evaluations.map((ev, idx) => {
              const q = questions[idx] || ({} as TaskQuestion);

              return (
                <div
                  key={ev.id || idx}
                  className={`rounded-xl border p-4 space-y-3 transition-colors ${
                    ev.isCorrect
                      ? "border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/10"
                      : "border-rose-200 dark:border-rose-900/50 bg-rose-50/20 dark:bg-rose-950/10"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      Q{idx + 1}: {ev.prompt}
                    </span>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {ev.isCorrect ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 text-[10px] font-bold">
                          <CheckCircle2 className="h-3 w-3" />
                          Correct (+{ev.earnedPoints} pts)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 dark:bg-rose-950/60 border border-rose-300 text-rose-800 dark:text-rose-300 px-2 py-0.5 text-[10px] font-bold">
                          <XCircle className="h-3 w-3" />
                          Incorrect (0 pts)
                        </span>
                      )}

                      <span className="text-[10px] font-bold uppercase text-[#2563EB] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                        {ev.type.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  {/* Student Answer */}
                  <div className="rounded-lg bg-white dark:bg-input-bg border border-slate-200 dark:border-slate-700 p-3 text-xs space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Student&apos;s Submitted Answer:
                    </span>

                    {ev.type === "MCQ" && q.choices ? (
                      <div className="space-y-1.5 pt-1">
                        {q.choices.map((c, cIdx) => {
                          const isSelected =
                            ev.studentChoiceIdx === cIdx ||
                            ev.studentAnswerText.trim().toLowerCase() === c.trim().toLowerCase();
                          const isCorrect =
                            ev.correctChoiceIdx === cIdx ||
                            ev.correctAnswerText.trim().toLowerCase() === c.trim().toLowerCase();

                          return (
                            <div
                              key={cIdx}
                              className={`flex items-center justify-between rounded-lg p-2.5 text-xs font-medium border transition-colors ${
                                isSelected && isCorrect
                                  ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-400 text-emerald-900 dark:text-emerald-200 font-bold"
                                  : isSelected && !isCorrect
                                  ? "bg-rose-50 dark:bg-rose-950/50 border-rose-400 text-rose-900 dark:text-rose-200 font-bold"
                                  : isCorrect
                                  ? "bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 text-emerald-800 dark:text-emerald-300 font-semibold"
                                  : "border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold border border-current">
                                  {String.fromCharCode(65 + cIdx)}
                                </span>
                                <span>{c}</span>
                              </div>

                              {isSelected && isCorrect && (
                                <span className="text-[10.5px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300">
                                  Student Selected (Correct ✓)
                                </span>
                              )}

                              {isSelected && !isCorrect && (
                                <span className="text-[10.5px] font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 border border-rose-300">
                                  Student Selected (Incorrect ✗)
                                </span>
                              )}

                              {!isSelected && isCorrect && (
                                <span className="text-[10.5px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300">
                                  Correct Choice ✓
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : ev.type === "FILE_UPLOAD" ? (
                      <div className="flex items-center gap-2 pt-1 text-xs">
                        <FileText className="h-4 w-4 text-[#2563EB] dark:text-blue-400 shrink-0" />
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {ev.studentAnswerText}
                        </span>
                      </div>
                    ) : (
                      <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-medium">
                        {ev.studentAnswerText}
                      </p>
                    )}
                  </div>

                  {/* Model Answer / Rubric */}
                  {(ev.type === "SHORT_ANSWER" || ev.type === "LONG_ANSWER") && q.modelAnswer && (
                    <div className="rounded-lg bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 p-3 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-blue-900 dark:text-blue-300">
                          Faculty Model Answer / Rubric:
                        </span>
                        {ev.matchScore !== null && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              ev.isCorrect
                                ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                                : "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300"
                            }`}
                          >
                            {ev.matchScore}% Concept Alignment
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
        <form onSubmit={(e) => { e.preventDefault(); handleReviewSubmit("Completed"); }} className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between">
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                  Score / Points (0 - 100) *
                </label>
                <button
                  type="button"
                  onClick={() => setScore(evaluationResult.score)}
                  title="Reset to auto-calculated score based on student answers"
                  className="text-[10px] text-[#2563EB] dark:text-blue-400 font-bold hover:underline cursor-pointer"
                >
                  Use Auto-Score ({evaluationResult.score})
                </button>
              </div>

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

          <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-surface-elevated cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleReviewSubmit("Failed")}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-rose-500/20 hover:bg-rose-700 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting && reviewAction === "Failed" ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Marking Failed...</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4" />
                  <span>Mark as Failed (Allow Retry)</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => handleReviewSubmit("Completed")}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting && reviewAction === "Completed" ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Approving...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Approve &amp; Pass (Completed)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
