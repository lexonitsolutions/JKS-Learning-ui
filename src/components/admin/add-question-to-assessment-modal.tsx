"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Plus, HelpCircle, CheckCircle2, Code2 } from "lucide-react";
import { addQuestion } from "@/lib/data/questions-store";

interface AddQuestionToAssessmentModalProps {
  isOpen: boolean;
  assessmentTitle?: string;
  courseTitle?: string;
  onClose: () => void;
  onQuestionAdded?: () => void;
}

export function AddQuestionToAssessmentModal({
  isOpen,
  assessmentTitle,
  courseTitle,
  onClose,
  onQuestionAdded,
}: AddQuestionToAssessmentModalProps) {
  const [questionText, setQuestionText] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [type, setType] = useState<"MCQ" | "Multi-Select" | "Code Snippet">("MCQ");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correctOptionIndex, setCorrectOptionIndex] = useState(0);
  const [marks, setMarks] = useState(5);
  const [explanation, setExplanation] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleUpdateOption = (index: number, text: string) => {
    setOptions((prev) => {
      const next = [...prev];
      next[index] = text;
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    addQuestion({
      category: courseTitle || assessmentTitle || "General",
      difficulty,
      type,
      questionText: questionText.trim(),
      codeSnippet: codeSnippet.trim() ? codeSnippet.trim() : undefined,
      options: options.map((o, idx) => o.trim() || `Option ${idx + 1}`),
      correctOptionIndex,
      marks: Number(marks) || 5,
      explanation: explanation.trim() || `Associated with assessment: ${assessmentTitle || "General"}`,
    });

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setQuestionText("");
      setCodeSnippet("");
      setOptions(["", "", "", ""]);
      setExplanation("");
      if (onQuestionAdded) onQuestionAdded();
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-black/80 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative my-auto flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-[24px] border border-white/70 bg-white shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-surface-secondary"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4.5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB] dark:bg-blue-950/50 dark:text-blue-400">
              <Plus className="h-5 w-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Add Question to Assessment</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {assessmentTitle ? `For "${assessmentTitle}"` : "Add technical question to question bank"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-surface-hover dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 text-slate-800 dark:text-slate-200 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Question Statement *
            </label>
            <textarea
              required
              rows={3}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="e.g. Which garbage collection algorithm is the default in modern JVM LTS versions?"
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-medium text-slate-900 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 dark:border-slate-700 dark:bg-input-bg dark:text-white dark:placeholder-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Optional Code Snippet
            </label>
            <textarea
              rows={2}
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              placeholder="public class Example { ... } (optional)"
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 font-mono text-[11px] text-slate-800 outline-none focus:border-[#2563EB] dark:border-slate-700 dark:bg-input-bg dark:text-slate-200 dark:placeholder-slate-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 outline-none dark:border-slate-700 dark:bg-input-bg dark:text-white"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 outline-none dark:border-slate-700 dark:bg-input-bg dark:text-white"
              >
                <option value="MCQ">Single Choice MCQ</option>
                <option value="Multi-Select">Multiple Select</option>
                <option value="Code Snippet">Code Analysis</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Marks
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={marks}
                onChange={(e) => setMarks(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-900 outline-none dark:border-slate-700 dark:bg-input-bg dark:text-white"
              />
            </div>
          </div>

          {/* Options with Radio */}
          <div className="space-y-2 pt-1">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Answer Options (Check radio for correct answer)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {options.map((opt, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 rounded-xl border p-2 bg-white dark:bg-input-bg ${
                    correctOptionIndex === idx
                      ? "border-emerald-500 bg-emerald-50/30 dark:border-emerald-500/60"
                      : "border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="single-choice-correct"
                    checked={correctOptionIndex === idx}
                    onChange={() => setCorrectOptionIndex(idx)}
                    className="text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5 cursor-pointer shrink-0"
                    title="Mark as correct answer"
                  />
                  <span className="text-[11px] font-bold text-slate-400 shrink-0">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <input
                    type="text"
                    placeholder={`Option ${idx + 1}`}
                    value={opt}
                    onChange={(e) => handleUpdateOption(idx, e.target.value)}
                    className="w-full bg-transparent text-xs text-slate-900 dark:text-white outline-none placeholder-slate-400"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Explanation (Optional)
            </label>
            <input
              type="text"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Why this answer is correct (shown to students upon evaluation)..."
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none dark:border-slate-700 dark:bg-input-bg dark:text-white dark:placeholder-slate-400"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!questionText.trim()}
              className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="h-4 w-4 animate-bounce" /> Added!
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" /> Save Question
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
