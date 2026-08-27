"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, ClipboardCheck, FileCheck } from "lucide-react";

interface MockQuestion {
  prompt: string;
  options: string[];
  correctIndex: number;
}

const QUESTION_BANK: MockQuestion[] = [
  {
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
    prompt: "In a REST API, which HTTP method is idempotent by design?",
    options: ["POST", "PUT", "PATCH (partial update)", "CONNECT"],
    correctIndex: 1,
  },
];

interface TakeAssessmentModalProps {
  isOpen: boolean;
  title: string;
  course: string;
  onClose: () => void;
  onSubmit: (score: number) => void;
}

export function TakeAssessmentModal({
  isOpen,
  title,
  course,
  onClose,
  onSubmit,
}: TakeAssessmentModalProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSelect = (qIdx: number, optIdx: number) => {
    setAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const correctCount = QUESTION_BANK.reduce(
      (acc, q, idx) => acc + (answers[idx] === q.correctIndex ? 1 : 0),
      0
    );
    // Mock scoring: base score from correctness, nudged up so the demo
    // flow reliably "passes" and unlocks the next milestone.
    const score = Math.min(
      100,
      Math.round(70 + (correctCount / QUESTION_BANK.length) * 25)
    );

    setTimeout(() => {
      onSubmit(score);
      setIsSubmitting(false);
      setAnswers({});
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-lg rounded-[24px] border border-white/70 bg-white/95 p-6 shadow-2xl backdrop-blur-xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <ClipboardCheck className="h-5 w-5 text-[#2563EB]" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">{title}</h3>
            <p className="text-[11px] font-medium text-slate-400">{course}</p>
          </div>
        </div>

        <div className="mt-4 max-h-[50vh] space-y-5 overflow-y-auto pr-1 text-xs text-slate-700">
          {QUESTION_BANK.map((q, qIdx) => (
            <div key={q.prompt}>
              <p className="font-semibold text-slate-900">
                Question {qIdx + 1} of {QUESTION_BANK.length}: {q.prompt}
              </p>
              <div className="mt-2 space-y-2">
                {q.options.map((opt, optIdx) => (
                  <label
                    key={opt}
                    className="flex items-center gap-2.5 rounded-xl border border-slate-200 p-3 hover:bg-slate-50 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`quiz-${qIdx}`}
                      checked={answers[qIdx] === optIdx}
                      onChange={() => handleSelect(qIdx, optIdx)}
                      className="accent-[#2563EB]"
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs disabled:opacity-60"
          >
            <FileCheck className="h-4 w-4" /> {isSubmitting ? "Submitting…" : "Submit Assessment"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
