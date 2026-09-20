"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  ClipboardCheck,
  FileCheck,
  AlertCircle,
  Upload,
  CheckCircle2,
  FileText,
  Loader2,
} from "lucide-react";
import { type TaskQuestion, type IndividualTask, submitStudentTask } from "@/lib/data/tasks-api";

interface MockQuestion {
  id?: string;
  prompt: string;
  options: string[];
  correctIndex: number;
}

const DEFAULT_QUESTIONS: MockQuestion[] = [
  {
    id: "default-1",
    prompt:
      "Which principle ensures a service keeps operating correctly even when a dependency fails?",
    options: [
      "Graceful degradation with circuit breakers",
      "Hard-coding a single shared database connection",
      "Disabling retries on every network call",
      "Running all services on one physical machine",
    ],
    correctIndex: 0,
  },
  {
    id: "default-2",
    prompt: "In a REST API, which HTTP method is idempotent by design?",
    options: ["POST", "PUT", "PATCH (partial update)", "CONNECT"],
    correctIndex: 1,
  },
];

interface TakeAssessmentModalProps {
  isOpen: boolean;
  title: string;
  course: string;
  task?: IndividualTask | null;
  studentEmail?: string;
  onClose: () => void;
  onSubmit: (score: number, submissionData?: any) => void;
}

export function TakeAssessmentModal({
  isOpen,
  title,
  course,
  task,
  studentEmail,
  onClose,
  onSubmit,
}: TakeAssessmentModalProps) {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const customQuestions: TaskQuestion[] = task?.questions && task.questions.length > 0 ? task.questions : [];
  const isIndividualTask = Boolean(task);

  // MCQ Validation rule: If >1 MCQ is present, student must answer ALL before submitting
  const mcqQuestions = customQuestions.filter((q) => q.type === "MCQ");
  const answeredMcqCount = mcqQuestions.filter((q) => answers[q.id] !== undefined).length;
  const allMcqsAnswered = mcqQuestions.length <= 1 || answeredMcqCount === mcqQuestions.length;

  const handleSelectOption = (qId: string, optIdx: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: optIdx }));
    setValidationError(null);
  };

  const handleTextAnswer = (qId: string, text: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: text }));
    setValidationError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setUploadedFileName(f.name);
      setAnswers((prev) => ({ ...prev, uploadedFile: f.name }));
    }
  };

  const handleSubmit = async () => {
    // Enforce all MCQs answered rule
    if (mcqQuestions.length > 1 && answeredMcqCount < mcqQuestions.length) {
      setValidationError(
        `Please answer all ${mcqQuestions.length} multiple-choice questions before submitting (${answeredMcqCount}/${mcqQuestions.length} answered).`
      );
      return;
    }

    setIsSubmitting(true);
    setValidationError(null);

    try {
      if (isIndividualTask && task) {
        // Calculate MCQ score if MCQs exist
        let totalMcqs = mcqQuestions.length;
        let correctMcqs = 0;
        mcqQuestions.forEach((q) => {
          if (answers[q.id] === q.correctAnswer) {
            correctMcqs++;
          }
        });

        const autoScore = totalMcqs > 0 ? Math.round((correctMcqs / totalMcqs) * 100) : 85;

        // Persist to backend
        const res = await submitStudentTask(task.id, {
          studentEmail: studentEmail || task.assignedStudentEmail,
          answers,
          uploadedFileName: uploadedFileName || undefined,
        });

        onSubmit(autoScore, { answers, uploadedFileName });
      } else {
        // Default course test evaluation
        const correctCount = DEFAULT_QUESTIONS.reduce(
          (acc, q, idx) => acc + (answers[`default-${idx + 1}`] === q.correctIndex ? 1 : 0),
          0
        );
        const score = Math.min(
          100,
          Math.round(70 + (correctCount / DEFAULT_QUESTIONS.length) * 25)
        );
        onSubmit(score);
      }
      onClose();
    } catch (err: any) {
      setValidationError(err?.message || "Failed to submit assignment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 p-4 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-2xl rounded-[24px] border border-white/70 bg-white/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-surface-secondary max-h-[88vh] overflow-y-auto"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 font-bold">
            <ClipboardCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>
            <p className="text-xs font-medium text-slate-400">{course}</p>
          </div>
        </div>

        {task?.instructions && (
          <div className="mt-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 p-3 text-xs text-blue-900 dark:text-blue-200">
            <strong>Instructions:</strong> {task.instructions}
          </div>
        )}

        {validationError && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 p-3 text-xs font-semibold text-rose-700 dark:text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* QUESTIONS CONTAINER */}
        <div className="mt-5 space-y-6 text-xs text-slate-700 dark:text-slate-300">
          {customQuestions.length > 0 ? (
            customQuestions.map((q, qIdx) => (
              <div
                key={q.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-surface-elevated/40 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-xs">
                    Question {qIdx + 1}: {q.prompt}
                  </span>
                  <span className="text-[10px] font-bold uppercase text-[#2563EB] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                    {q.type.replace("_", " ")}
                  </span>
                </div>

                {/* MCQ Question Rendering */}
                {q.type === "MCQ" && q.choices && (
                  <div className="space-y-2">
                    {q.choices.map((opt, optIdx) => {
                      const isSelected = answers[q.id] === optIdx;
                      return (
                        <label
                          key={optIdx}
                          className={`flex items-center gap-2.5 rounded-xl border p-3 cursor-pointer transition-colors ${
                            isSelected
                              ? "border-[#2563EB] bg-blue-50/80 dark:bg-blue-950/50 dark:border-blue-700 text-slate-900 dark:text-white font-bold"
                              : "border-slate-200 dark:border-slate-700 dark:bg-surface-elevated hover:bg-slate-100/70 text-slate-700 dark:text-slate-200"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`quiz-${q.id}`}
                            checked={isSelected}
                            onChange={() => handleSelectOption(q.id, optIdx)}
                            className="accent-[#2563EB] dark:accent-blue-500 cursor-pointer"
                          />
                          <span>{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {/* Short Answer Rendering */}
                {q.type === "SHORT_ANSWER" && (
                  <div>
                    <input
                      type="text"
                      value={answers[q.id] || ""}
                      onChange={(e) => handleTextAnswer(q.id, e.target.value)}
                      placeholder="Type your concise answer here..."
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3.5 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                    />
                  </div>
                )}

                {/* Long Answer Rendering */}
                {q.type === "LONG_ANSWER" && (
                  <div>
                    <textarea
                      rows={4}
                      value={answers[q.id] || ""}
                      onChange={(e) => handleTextAnswer(q.id, e.target.value)}
                      placeholder="Provide a comprehensive breakdown with architectural points and code rationale..."
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg p-3 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                    />
                  </div>
                )}

                {/* File Upload Prompt */}
                {q.type === "FILE_UPLOAD" && (
                  <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-4 text-center">
                    <input
                      type="file"
                      id={`file-${q.id}`}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor={`file-${q.id}`}
                      className="flex flex-col items-center justify-center gap-2 cursor-pointer"
                    >
                      <Upload className="h-6 w-6 text-[#2563EB] dark:text-blue-400" />
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {uploadedFileName ? `Attached: ${uploadedFileName}` : "Click to select and attach solution file"}
                      </span>
                      <span className="text-[10px] text-slate-400">Accepted formats: {task?.requiredFiles || ".pdf, .zip, .java, .tsx"}</span>
                    </label>
                  </div>
                )}
              </div>
            ))
          ) : (
            /* DEFAULT QUESTIONS FOR COURSE MODULE TESTS */
            DEFAULT_QUESTIONS.map((q, qIdx) => (
              <div key={q.prompt} className="space-y-2">
                <p className="font-semibold text-slate-900 dark:text-white">
                  Question {qIdx + 1} of {DEFAULT_QUESTIONS.length}: {q.prompt}
                </p>
                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    const qKey = `default-${qIdx + 1}`;
                    const isSelected = answers[qKey] === optIdx;
                    return (
                      <label
                        key={opt}
                        className={`flex items-center gap-2.5 rounded-xl border p-3 cursor-pointer transition-colors ${
                          isSelected
                            ? "border-[#2563EB] bg-blue-50/80 dark:bg-blue-950/50 text-slate-900 dark:text-white font-bold"
                            : "border-slate-200 dark:border-slate-700 dark:bg-surface-elevated hover:bg-slate-50 text-slate-700 dark:text-slate-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`quiz-${qIdx}`}
                          checked={isSelected}
                          onChange={() => handleSelectOption(qKey, optIdx)}
                          className="accent-[#2563EB] dark:accent-blue-500"
                        />
                        <span>{opt}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))
          )}

          {/* Optional File Attachment if Task specifies requiredFiles */}
          {task?.requiredFiles && !customQuestions.some((q) => q.type === "FILE_UPLOAD") && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-surface-elevated p-4 space-y-2">
              <label className="block font-bold text-slate-800 dark:text-slate-200 text-xs">
                Submit Required Project File ({task.requiredFiles})
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  id="task-file-input"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="task-file-input"
                  className="flex items-center gap-2 rounded-xl bg-white dark:bg-surface-secondary border border-slate-300 dark:border-slate-600 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 cursor-pointer shadow-xs"
                >
                  <Upload className="h-4 w-4 text-[#2563EB]" />
                  <span>Choose File</span>
                </label>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {uploadedFileName ? `Selected: ${uploadedFileName}` : "No file chosen yet"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="mt-8 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
          <div className="text-[11px] text-slate-400">
            {mcqQuestions.length > 1 && (
              <span>
                {answeredMcqCount}/{mcqQuestions.length} MCQs answered
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-surface-hover cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || (mcqQuestions.length > 1 && !allMcqsAnswered)}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-md shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting…</span>
                </>
              ) : (
                <>
                  <FileCheck className="h-4 w-4" />
                  <span>Submit Assignment</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
