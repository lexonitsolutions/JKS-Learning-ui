"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ClipboardCheck, CheckCircle2, ListChecks, Plus, Trash2, HelpCircle, Code2 } from "lucide-react";
import { ADMIN_COURSES, type AdminAssessmentRow } from "@/lib/data/admin";
import { addQuestion } from "@/lib/data/questions-store";
import { fetchDbCourses } from "@/lib/data/courses-api";
import type { Course } from "@/lib/data/courses";

interface QuestionDraft {
  questionText: string;
  codeSnippet?: string;
  options: string[];
  correctOptionIndex: number;
  marks: number;
  explanation?: string;
}

interface AddAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (assignment: AdminAssessmentRow) => void;
}

const ASSIGNMENT_TYPES: AdminAssessmentRow["type"][] = ["MCQ", "Assignment", "Coding Test"];

export function AddAssignmentModal({ isOpen, onClose, onCreate }: AddAssignmentModalProps) {
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState(ADMIN_COURSES[0]?.title ?? "");
  const [availableCourses, setAvailableCourses] = useState<string[]>(ADMIN_COURSES.map((c) => c.title));
  const [type, setType] = useState<AdminAssessmentRow["type"]>("MCQ");
  const [minPassingScore, setMinPassingScore] = useState("75");
  const [questions, setQuestions] = useState<QuestionDraft[]>([
    {
      questionText: "",
      codeSnippet: "",
      options: ["", "", "", ""],
      correctOptionIndex: 0,
      marks: 5,
      explanation: "",
    },
  ]);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetchDbCourses().then((courses: Course[]) => {
      if (courses.length > 0) {
        const titles = courses.map((c) => c.title);
        setAvailableCourses(Array.from(new Set([...titles, ...ADMIN_COURSES.map((c) => c.title)])));
        if (!course) setCourse(titles[0]);
      }
    }).catch(() => {});
  }, [course]);

  if (!isOpen) return null;

  const canSubmit = title.trim().length > 0 && course.length > 0;

  const handleAddQuestionSlot = () => {
    setQuestions((prev) => [
      ...prev,
      {
        questionText: "",
        codeSnippet: "",
        options: ["", "", "", ""],
        correctOptionIndex: 0,
        marks: 5,
        explanation: "",
      },
    ]);
  };

  const handleRemoveQuestionSlot = (index: number) => {
    if (questions.length <= 1) return;
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateQuestion = (index: number, field: keyof QuestionDraft, value: any) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [field]: value } : q))
    );
  };

  const handleUpdateOption = (qIndex: number, optIndex: number, text: string) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q;
        const newOpts = [...q.options];
        newOpts[optIndex] = text;
        return { ...q, options: newOpts };
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSaved(true);

    // Persist all valid questions to the question bank
    const validQuestions = questions.filter(
      (q) => q.questionText.trim().length > 0 && q.options.some((o) => o.trim().length > 0)
    );

    for (const q of validQuestions) {
      addQuestion({
        category: course,
        difficulty: "Medium",
        type: type === "Coding Test" ? "Code Snippet" : "MCQ",
        questionText: q.questionText.trim(),
        codeSnippet: q.codeSnippet?.trim() ? q.codeSnippet.trim() : undefined,
        options: q.options.map((o) => o.trim() || "Option"),
        correctOptionIndex: q.correctOptionIndex,
        marks: q.marks || 5,
        explanation: q.explanation?.trim() || `Assessment question for ${title}`,
      });
    }

    setTimeout(() => {
      onCreate({
        title: title.trim(),
        course,
        type,
        submissions: 0,
        avgScore: 0,
        pendingReview: 0,
      });
      setIsSaved(false);
      setTitle("");
      setType("MCQ");
      setMinPassingScore("75");
      setQuestions([
        {
          questionText: "",
          codeSnippet: "",
          options: ["", "", "", ""],
          correctOptionIndex: 0,
          marks: 5,
          explanation: "",
        },
      ]);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-black/80 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative flex my-auto max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-[24px] border border-white/70 bg-white shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-surface-secondary"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4.5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB] dark:bg-blue-950/50 dark:text-blue-400">
              <ClipboardCheck className="h-5 w-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">New Assessment with Questions</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Create an assessment and author its questions directly in one step.
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

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 text-slate-800 dark:text-slate-200 space-y-5">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Assessment Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Java Spring Boot & Microservices — Stage 1 Test"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-900 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 dark:border-slate-700/80 dark:bg-input-bg dark:text-white dark:placeholder-slate-400 dark:focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Associated Course *
              </label>
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-[#2563EB] dark:border-slate-700/80 dark:bg-input-bg dark:text-white"
              >
                {availableCourses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Assessment Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as AdminAssessmentRow["type"])}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-[#2563EB] dark:border-slate-700/80 dark:bg-input-bg dark:text-white"
              >
                {ASSIGNMENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Passing score */}
          <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-surface-elevated p-3.5 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Passing Threshold Percentage
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min="0"
                max="100"
                value={minPassingScore}
                onChange={(e) => setMinPassingScore(e.target.value)}
                className="w-14 rounded-lg border border-slate-200 bg-white px-2 py-1 text-center text-xs font-bold text-slate-900 dark:border-slate-700/80 dark:bg-input-bg dark:text-white"
              />
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">%</span>
            </div>
          </div>

          {/* Assessment Questions Builder Section */}
          <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Questions Builder</span>
                  <span className="rounded-full bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 text-[10px] font-bold text-[#2563EB] dark:text-blue-400">
                    {questions.length} {questions.length === 1 ? "Question" : "Questions"}
                  </span>
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Author MCQs with 4 options and mark the correct answer.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddQuestionSlot}
                className="inline-flex items-center gap-1 rounded-xl bg-blue-50 border border-blue-200 px-3 py-1.5 text-xs font-bold text-[#2563EB] hover:bg-blue-100 dark:bg-blue-950/40 dark:border-blue-800/60 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Another Question</span>
              </button>
            </div>

            <div className="space-y-4">
              {questions.map((q, qIndex) => (
                <div
                  key={qIndex}
                  className="rounded-2xl border border-slate-200/90 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-surface-elevated/40 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                      Question #{qIndex + 1}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-slate-500 font-medium">Marks:</span>
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={q.marks}
                          onChange={(e) => handleUpdateQuestion(qIndex, "marks", Number(e.target.value))}
                          className="w-12 rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-center text-xs font-bold text-slate-900 dark:border-slate-700 dark:bg-input-bg dark:text-white"
                        />
                      </div>
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestionSlot(qIndex)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                          title="Remove this question"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Question Text */}
                  <div>
                    <input
                      type="text"
                      placeholder="e.g. What is the difference between synchronous and asynchronous processing?"
                      value={q.questionText}
                      onChange={(e) => handleUpdateQuestion(qIndex, "questionText", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-[#2563EB] dark:border-slate-700 dark:bg-input-bg dark:text-white dark:placeholder-slate-400"
                    />
                  </div>

                  {/* Optional Code Snippet */}
                  <div>
                    <textarea
                      rows={2}
                      placeholder="Optional code snippet or context (leave blank if none)..."
                      value={q.codeSnippet || ""}
                      onChange={(e) => handleUpdateQuestion(qIndex, "codeSnippet", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 font-mono text-[11px] text-slate-800 outline-none focus:border-[#2563EB] dark:border-slate-700 dark:bg-input-bg dark:text-slate-200 dark:placeholder-slate-500"
                    />
                  </div>

                  {/* 4 Options with Radio */}
                  <div className="space-y-2 pt-1">
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      Options (Select radio for correct answer):
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, optIndex) => (
                        <div
                          key={optIndex}
                          className={`flex items-center gap-2 rounded-xl border p-2 bg-white dark:bg-input-bg ${
                            q.correctOptionIndex === optIndex
                              ? "border-emerald-500 bg-emerald-50/30 dark:border-emerald-500/60"
                              : "border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`correct-opt-${qIndex}`}
                            checked={q.correctOptionIndex === optIndex}
                            onChange={() => handleUpdateQuestion(qIndex, "correctOptionIndex", optIndex)}
                            className="text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5 cursor-pointer shrink-0"
                            title="Mark as correct answer"
                          />
                          <span className="text-[11px] font-bold text-slate-400 shrink-0">
                            {String.fromCharCode(65 + optIndex)}.
                          </span>
                          <input
                            type="text"
                            placeholder={`Option ${optIndex + 1}`}
                            value={opt}
                            onChange={(e) => handleUpdateOption(qIndex, optIndex, e.target.value)}
                            className="w-full bg-transparent text-xs text-slate-900 dark:text-white outline-none placeholder-slate-400"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
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
              disabled={!canSubmit}
              className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="h-4 w-4 animate-bounce" /> Created!
                </>
              ) : (
                <>
                  <ClipboardCheck className="h-4 w-4" /> Create Assessment & Questions
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
