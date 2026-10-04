"use client";

import React, { useMemo } from "react";
import {
  X,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  RotateCcw,
  ShieldCheck,
  Award,
  HelpCircle,
  FileCheck,
  AlertTriangle,
} from "lucide-react";
import { type IndividualTask, type TaskQuestion } from "@/lib/data/tasks-api";
import { evaluateAssessmentSubmission } from "@/lib/data/assessment-scoring";

interface ViewSubmissionModalProps {
  isOpen: boolean;
  task: IndividualTask | null;
  onClose: () => void;
  onRetry?: (task: IndividualTask) => void;
}

export function ViewSubmissionModal({
  isOpen,
  task,
  onClose,
  onRetry,
}: ViewSubmissionModalProps) {
  if (!isOpen || !task) return null;

  const submission = task.submission;
  const answers = submission?.answers || {};
  const questions: TaskQuestion[] = task.questions || [];

  const evaluationResult = useMemo(() => {
    return evaluateAssessmentSubmission(questions, answers, submission?.uploadedFileName);
  }, [questions, answers, submission?.uploadedFileName]);

  const score = submission?.instructorScore ?? submission?.score ?? evaluationResult.score;
  const feedback = submission?.instructorFeedback ?? submission?.feedback;

  const isCompleted =
    task.status === "COMPLETED" ||
    (task.status === "REVIEWED" && (score ?? 0) >= 60);
  const isFailed =
    task.status === "FAILED" ||
    task.status === "Failed" ||
    (score !== undefined && score < 50 && task.status !== "SUBMITTED");
  const isSubmitted = task.status === "SUBMITTED" || task.status === "Submitted";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4 pr-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 font-bold shrink-0">
              <FileCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {task.courseTitle || "General Track"}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                {task.title}
              </h3>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Submitted:{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {submission?.submittedAt
                    ? new Date(submission.submittedAt).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Recorded"}
                </span>
              </div>
            </div>
          </div>

          {/* Status & Score Pill */}
          <div className="flex items-center gap-2.5 self-start sm:self-center">
            {isCompleted ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Completed</span>
              </span>
            ) : isFailed ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/60 px-3 py-1 text-xs font-bold text-rose-700 dark:text-rose-300">
                <XCircle className="h-3.5 w-3.5" />
                <span>Failed</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 px-3 py-1 text-xs font-bold text-[#2563EB] dark:text-blue-400">
                <Clock className="h-3.5 w-3.5" />
                <span>Submitted / Reviewing</span>
              </span>
            )}

            {score !== undefined && (
              <div
                className={`rounded-xl px-3 py-1 text-xs font-black border flex items-center gap-1 ${
                  isFailed || score < 50
                    ? "bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300"
                    : score >= 70
                    ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
                    : "bg-slate-100 dark:bg-surface-elevated border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                }`}
              >
                <Award className="h-3.5 w-3.5 text-amber-500" />
                <span>{score}/100</span>
              </div>
            )}
          </div>
        </div>

        {/* Evaluation Summary Strip */}
        {questions.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-surface-elevated/70 p-3 text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">Performance Breakdown:</span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 text-[11px] font-bold">
                <CheckCircle2 className="h-3 w-3" /> {evaluationResult.correctCount} Correct
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 dark:bg-rose-950/60 border border-rose-300 text-rose-800 dark:text-rose-300 px-2 py-0.5 text-[11px] font-bold">
                <XCircle className="h-3 w-3" /> {evaluationResult.incorrectCount} Incorrect
              </span>
              <span className="text-slate-500 font-semibold text-[11px]">
                Marks: {evaluationResult.totalEarned} / {evaluationResult.totalMax} pts
              </span>
            </div>
          </div>
        )}

        {/* Admin Feedback Banner */}
        {feedback && (
          <div
            className={`rounded-2xl border p-4 space-y-1 ${
              isFailed
                ? "border-rose-200 dark:border-rose-900/50 bg-rose-50/60 dark:bg-rose-950/20"
                : "border-blue-200 dark:border-blue-900/50 bg-blue-50/70 dark:bg-blue-950/30"
            }`}
          >
            <div
              className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide ${
                isFailed ? "text-rose-700 dark:text-rose-300" : "text-[#2563EB] dark:text-blue-400"
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Instructor Evaluation &amp; Feedback</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed pl-5.5 font-medium">
              &quot;{feedback}&quot;
            </p>
          </div>
        )}

        {/* Failed Action Banner */}
        {isFailed && (
          <div className="rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/70 dark:bg-rose-950/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-rose-900 dark:text-rose-200">
                  Assessment Did Not Pass Passing Criteria
                </div>
                <div className="text-[11px] text-rose-700 dark:text-rose-300">
                  You are eligible to review the instructor feedback and submit a new attempt.
                </div>
              </div>
            </div>
            {onRetry && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRetry(task);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-rose-500/20 hover:bg-rose-700 transition-colors cursor-pointer shrink-0"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Retry Assessment</span>
              </button>
            )}
          </div>
        )}

        {/* Question by Question Submitted Breakdown */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Submitted Responses ({questions.length > 0 ? questions.length : "Task Submission"})</span>
            <span>Total Marks: {evaluationResult.totalMax || 100} Pts</span>
          </div>

          {evaluationResult.evaluations.length > 0 ? (
            evaluationResult.evaluations.map((ev, idx) => {
              const q = questions[idx] || ({} as TaskQuestion);

              return (
                <div
                  key={ev.id || idx}
                  className={`rounded-2xl border p-4 space-y-3 transition-colors ${
                    ev.isCorrect
                      ? "border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/10"
                      : "border-rose-200 dark:border-rose-900/50 bg-rose-50/20 dark:bg-rose-950/10"
                  }`}
                >
                  {/* Question Header */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2563EB] text-white text-[10px] font-black shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Question #{idx + 1}
                      </span>
                      <span className="rounded-lg bg-slate-200 dark:bg-slate-700 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                        {ev.type.replace("_", " ")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {ev.isCorrect ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 text-[10px] font-bold">
                          <CheckCircle2 className="h-3 w-3" /> Correct (+{ev.earnedPoints} pts)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 dark:bg-rose-950/60 border border-rose-300 text-rose-800 dark:text-rose-300 px-2 py-0.5 text-[10px] font-bold">
                          <XCircle className="h-3 w-3" /> Incorrect (0 pts)
                        </span>
                      )}
                      <span className="text-xs font-semibold text-slate-500">
                        {ev.maxPoints} pts
                      </span>
                    </div>
                  </div>

                  {/* Question Prompt */}
                  <p className="text-xs font-semibold text-slate-900 dark:text-white leading-relaxed">
                    {ev.prompt}
                  </p>

                  {/* Student Answer Box */}
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-secondary p-3 space-y-1.5">
                    <div className="flex items-center justify-between text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                      <span>Your Submitted Response:</span>
                    </div>

                    {ev.type === "MCQ" && q.choices ? (
                      <div className="space-y-1.5 pt-1">
                        {q.choices.map((choice, cIdx) => {
                          const isSelected =
                            ev.studentChoiceIdx === cIdx ||
                            ev.studentAnswerText.trim().toLowerCase() === choice.trim().toLowerCase();
                          const isCorrect =
                            ev.correctChoiceIdx === cIdx ||
                            ev.correctAnswerText.trim().toLowerCase() === choice.trim().toLowerCase();

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
                                  : "border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-black border border-current">
                                  {String.fromCharCode(65 + cIdx)}
                                </span>
                                <span>{choice}</span>
                              </div>

                              {isSelected && isCorrect && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300">
                                  Your Choice (Correct ✓)
                                </span>
                              )}

                              {isSelected && !isCorrect && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 border border-rose-300">
                                  Your Choice (Incorrect ✗)
                                </span>
                              )}

                              {!isSelected && isCorrect && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300">
                                  Correct Choice ✓
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : ev.type === "FILE_UPLOAD" ? (
                      <div className="flex items-center gap-2 pt-1 text-xs font-semibold text-[#2563EB] dark:text-blue-400">
                        <FileText className="h-4 w-4" />
                        <span>{ev.studentAnswerText}</span>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed pt-1 font-medium">
                        {ev.studentAnswerText}
                      </p>
                    )}
                  </div>

                  {/* Model Reference if available */}
                  {(ev.type === "SHORT_ANSWER" || ev.type === "LONG_ANSWER") && q.modelAnswer && (
                    <div className="rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 p-2.5 text-[11px] space-y-1">
                      <span className="font-bold text-[#2563EB] dark:text-blue-400 uppercase tracking-wider text-[10px]">
                        Benchmark / Model Answer Guidelines:
                      </span>
                      <p className="text-blue-950 dark:text-blue-200 whitespace-pre-wrap leading-relaxed">
                        {q.modelAnswer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5 bg-slate-50 dark:bg-surface-elevated text-xs space-y-2">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Direct Submission Recorded:
              </span>
              <p className="text-slate-600 dark:text-slate-300">
                {submission?.uploadedFileName ? (
                  <span className="font-mono text-[#2563EB] dark:text-blue-400">
                    File Archive: {submission.uploadedFileName}
                  </span>
                ) : (
                  "Task response submitted for instructor review."
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
