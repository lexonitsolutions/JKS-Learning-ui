"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Trash2,
  BookOpen,
  Calendar,
  FileText,
  HelpCircle,
  Upload,
  User,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileCode,
} from "lucide-react";
import { createAdminTask, type TaskQuestion, type IndividualTask } from "@/lib/data/tasks-api";
import { fetchAdminStudents, type AdminStudentRecord } from "@/lib/data/students-api";
import { getStoredCourses } from "@/lib/data/courses-store";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (task: IndividualTask) => void;
}

export function CreateTaskModal({ isOpen, onClose, onCreated }: CreateTaskModalProps) {
  const [students, setStudents] = useState<AdminStudentRecord[]>([]);
  const [courses, setCourses] = useState<{ id: string; title: string; track: string }[]>([]);
  const [selectedStudentEmail, setSelectedStudentEmail] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [requiredFiles, setRequiredFiles] = useState(".pdf, .zip, .java, .py");
  const [questions, setQuestions] = useState<TaskQuestion[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchAdminStudents().then((data) => {
        setStudents(data);
        if (data.length > 0 && !selectedStudentEmail) {
          setSelectedStudentEmail(data[0].email);
        }
      });
      const stored = getStoredCourses().map((c) => ({
        id: c.id,
        title: c.title,
        track: c.track,
      }));
      setCourses(stored);
      if (stored.length > 0 && !courseTitle) {
        setCourseTitle(stored[0].title);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddQuestion = (type: TaskQuestion["type"]) => {
    const newQ: TaskQuestion = {
      id: `q-${Date.now()}`,
      type,
      prompt: "",
      maxPoints: type === "LONG_ANSWER" ? 20 : type === "SHORT_ANSWER" ? 10 : 5,
      modelAnswer: type === "SHORT_ANSWER" || type === "LONG_ANSWER" ? "" : undefined,
      choices: type === "MCQ" ? ["Option A", "Option B", "Option C", "Option D"] : undefined,
      correctAnswer: type === "MCQ" ? 0 : undefined,
    };
    setQuestions((prev) => [...prev, newQ]);
  };

  const handleUpdateQuestion = (index: number, patch: Partial<TaskQuestion>) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...patch };
      return copy;
    });
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChoiceChange = (qIndex: number, cIndex: number, text: string) => {
    setQuestions((prev) => {
      const copy = [...prev];
      const q = { ...copy[qIndex] };
      if (q.choices) {
        const newChoices = [...q.choices];
        newChoices[cIndex] = text;
        q.choices = newChoices;
      }
      copy[qIndex] = q;
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !selectedStudentEmail.trim()) {
      setErrorMessage("Please enter task title, description, and assign to a student.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await createAdminTask({
        title: title.trim(),
        description: description.trim(),
        instructions: instructions.trim() || undefined,
        courseTitle: courseTitle || undefined,
        assignedStudentEmail: selectedStudentEmail.trim().toLowerCase(),
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        requiredFiles: requiredFiles.trim() || undefined,
        questions: questions.length > 0 ? questions : undefined,
      });

      if (res.success && res.data) {
        onCreated(res.data);
        onClose();
      } else {
        setErrorMessage(res.error || "Failed to create individual assignment.");
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
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 font-bold">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Assign Individual Student Task</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Create a personalized assignment with custom questions, model answers, and due dates
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 p-3 text-xs font-semibold text-rose-700 dark:text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Student & Course Allocation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                Assign to Student *
              </label>
              <select
                value={selectedStudentEmail}
                onChange={(e) => setSelectedStudentEmail(e.target.value)}
                required
                className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3.5 py-2 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.email}>
                    {s.name} ({s.email}) {s.status === "BLOCKED" ? "[Blocked]" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                Associated Course / Track
              </label>
              <select
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3.5 py-2 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
              >
                <option value="">-- General / Independent Task --</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.title}>
                    {c.title} ({c.track})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Title & Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                Task Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Build Real-time Chat Microservice with WebSockets"
                className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3.5 py-2 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3.5 py-2 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* Description & Instructions */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
              Task Description *
            </label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the objective and expected outcomes of this assignment..."
              className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg p-3 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                Special Instructions
              </label>
              <textarea
                rows={2}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Specific frameworks, unit testing requirements, or rubrics..."
                className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg p-3 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                Required Files / Submission Formats
              </label>
              <input
                type="text"
                value={requiredFiles}
                onChange={(e) => setRequiredFiles(e.target.value)}
                placeholder="e.g. .pdf, .zip, .java, .sql"
                className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3.5 py-2 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
              />
              <p className="mt-1 text-[10px] text-slate-400">Accepted file extensions separated by commas</p>
            </div>
          </div>

          {/* QUESTIONS BUILDER SECTION */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                  Assignment Questions ({questions.length})
                </h4>
                <p className="text-[11px] text-slate-400">
                  Add Short/Long Answer questions with model answers, MCQs, or File Upload prompts
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleAddQuestion("SHORT_ANSWER")}
                  className="rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-[#2563EB] dark:text-blue-400 px-2.5 py-1 text-[11px] font-bold hover:bg-blue-100 cursor-pointer"
                >
                  + Short Answer
                </button>
                <button
                  type="button"
                  onClick={() => handleAddQuestion("LONG_ANSWER")}
                  className="rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 text-[11px] font-bold hover:bg-indigo-100 cursor-pointer"
                >
                  + Long Answer
                </button>
                <button
                  type="button"
                  onClick={() => handleAddQuestion("MCQ")}
                  className="rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 text-[11px] font-bold hover:bg-emerald-100 cursor-pointer"
                >
                  + MCQ Test
                </button>
                <button
                  type="button"
                  onClick={() => handleAddQuestion("FILE_UPLOAD")}
                  className="rounded-lg bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 px-2.5 py-1 text-[11px] font-bold hover:bg-purple-100 cursor-pointer"
                >
                  + File Upload
                </button>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-3">
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-surface-elevated/60 p-3.5 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                      Question {idx + 1} —{" "}
                      <span className="text-[#2563EB] dark:text-blue-400 uppercase text-[10px]">
                        {q.type.replace("_", " ")}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(idx)}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">
                      Question Prompt
                    </label>
                    <input
                      type="text"
                      required
                      value={q.prompt}
                      onChange={(e) => handleUpdateQuestion(idx, { prompt: e.target.value })}
                      placeholder="e.g. Explain the difference between optimistic and pessimistic locking in JPA"
                      className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  {/* Short & Long Answer: Admin Model Answer */}
                  {(q.type === "SHORT_ANSWER" || q.type === "LONG_ANSWER") && (
                    <div className="rounded-lg bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 p-2.5 space-y-1">
                      <label className="block text-[10px] font-bold text-blue-900 dark:text-blue-300 uppercase">
                        Admin Model Answer / Rubric (Used for Auto-Evaluation &amp; Matching)
                      </label>
                      <textarea
                        rows={2}
                        value={q.modelAnswer || ""}
                        onChange={(e) => handleUpdateQuestion(idx, { modelAnswer: e.target.value })}
                        placeholder="Enter the ideal model answer or key concepts student answers will be evaluated against..."
                        className="w-full rounded-md border border-blue-200 dark:border-blue-800 bg-white dark:bg-input-bg p-2 text-xs text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                  )}

                  {/* MCQ Options */}
                  {q.type === "MCQ" && q.choices && (
                    <div className="space-y-2 pt-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">
                        Choices (Select the radio button corresponding to the correct answer)
                      </label>
                      <div className="space-y-1.5">
                        {q.choices.map((choice, cIdx) => (
                          <div key={cIdx} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct-${q.id}`}
                              checked={q.correctAnswer === cIdx}
                              onChange={() => handleUpdateQuestion(idx, { correctAnswer: cIdx })}
                              className="accent-[#2563EB] cursor-pointer"
                            />
                            <input
                              type="text"
                              required
                              value={choice}
                              onChange={(e) => handleChoiceChange(idx, cIdx, e.target.value)}
                              placeholder={`Option ${cIdx + 1}`}
                              className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3 py-1 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
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
              className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Assigning...</span>
                </>
              ) : (
                <span>Assign Task to Student</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
