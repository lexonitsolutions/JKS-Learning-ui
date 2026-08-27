"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, ClipboardCheck, CheckCircle2, ListChecks } from "lucide-react";
import { ADMIN_COURSES, type AdminAssessmentRow } from "@/lib/data/admin";

interface AddAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (assignment: AdminAssessmentRow) => void;
}

const ASSIGNMENT_TYPES: AdminAssessmentRow["type"][] = ["MCQ", "Assignment", "Coding Test"];

export function AddAssignmentModal({ isOpen, onClose, onCreate }: AddAssignmentModalProps) {
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState(ADMIN_COURSES[0]?.title ?? "");
  const [type, setType] = useState<AdminAssessmentRow["type"]>("MCQ");
  const [minPassingScore, setMinPassingScore] = useState("75");
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const canSubmit = title.trim().length > 0 && course.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSaved(true);
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
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-[24px] border border-white/70 bg-white/90 shadow-2xl backdrop-blur-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-7 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
              <ClipboardCheck className="h-5 w-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">New Assessment / Assignment</h3>
              <p className="text-xs text-slate-500 font-medium">
                Add a standalone MCQ test, assignment, or coding challenge to any course.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-7 text-slate-800">
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Assignment Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Data Structures — Module Test"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Associated Course
                </label>
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-[#2563EB]"
                >
                  {ADMIN_COURSES.map((c) => (
                    <option key={c.title} value={c.title}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Assessment Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as AdminAssessmentRow["type"])}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-[#2563EB]"
                >
                  {ASSIGNMENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-semibold text-slate-700">
                  Minimum Passing Threshold
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={minPassingScore}
                  onChange={(e) => setMinPassingScore(e.target.value)}
                  className="w-16 rounded-md border border-slate-200 bg-white px-2 py-1 text-center text-xs font-bold text-slate-900"
                />
                <span className="text-xs font-bold text-slate-500">%</span>
              </div>
            </div>

            <div className="rounded-xl border border-blue-100 bg-[#EFF6FF]/70 p-4 text-xs text-slate-600 leading-relaxed">
              This assignment will appear immediately in the Assessments table with 0 submissions,
              ready for students to attempt from their dashboard.
            </div>
          </div>

          {/* Footer */}
          <div className="mt-7 flex items-center justify-end gap-2.5 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-bold text-white shadow-[0_4px_14px_rgba(37,99,235,0.3)] transition-all hover:bg-blue-700 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="h-4 w-4 animate-bounce" /> Added!
                </>
              ) : (
                <>
                  <ClipboardCheck className="h-4 w-4" /> Create Assignment
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
