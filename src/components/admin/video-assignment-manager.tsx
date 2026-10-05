"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  FileText,
  Sliders,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Code2,
  CheckCircle2,
  AlertCircle,
  X,
  Upload,
} from "lucide-react";
import {
  canonicalizeAssessmentType,
  type VideoItem,
  type VideoInterviewQuestion,
  type VideoTask,
  type SectionAssignment,
} from "@/lib/data/courses-store";

interface VideoAssignmentManagerProps {
  video: VideoItem;
  onUpdate: (updated: VideoItem) => void;
  videoIndexLabel?: string;
}

type TabType = "interview" | "task" | "quiz";

export function VideoAssignmentManager({
  video,
  onUpdate,
  videoIndexLabel,
}: VideoAssignmentManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("interview");

  const interviewCount = (video.interviewQuestions || []).length;
  const hasTask = Boolean(video.task?.title?.trim() || video.task?.description?.trim());
  const quizCount = (video.assignment?.questions || []).length;
  const hasQuiz = Boolean(quizCount > 0 || video.assignment?.title?.trim());

  const hasAnyAssignment = interviewCount > 0 || hasTask || hasQuiz;

  // Handlers for Interview Questions
  const addInterviewQuestion = () => {
    const list = video.interviewQuestions || [];
    const newIq: VideoInterviewQuestion = {
      id: `iq-${Date.now()}-${list.length + 1}`,
      question: "",
      answer: "",
      tags: "",
    };
    onUpdate({
      ...video,
      interviewQuestions: [...list, newIq],
    });
  };

  const updateInterviewQuestion = (
    index: number,
    field: keyof VideoInterviewQuestion,
    value: string
  ) => {
    const list = [...(video.interviewQuestions || [])];
    if (!list[index]) return;
    list[index] = { ...list[index], [field]: value };
    onUpdate({ ...video, interviewQuestions: list });
  };

  const removeInterviewQuestion = (index: number) => {
    const list = (video.interviewQuestions || []).filter((_, i) => i !== index);
    onUpdate({ ...video, interviewQuestions: list });
  };

  // Handlers for Video Task
  const updateTask = (updates: Partial<VideoTask>) => {
    const current = video.task || {
      title: "",
      description: "",
      instructions: "",
      submissionType: "text",
      points: 10,
    };
    onUpdate({
      ...video,
      task: { ...current, ...updates },
    });
  };

  const removeTask = () => {
    const copy = { ...video };
    delete copy.task;
    onUpdate(copy);
  };

  // Handlers for Quiz / Assessment
  const ensureAssignment = (): SectionAssignment => {
    return (
      video.assignment || {
        id: `asg-${video.id || Date.now()}`,
        title: `${video.title || "Video"} Quiz & Assessment`,
        description: `Practical questions and evaluation for ${video.title || "this lecture"}.`,
        type: "Multiple Choice (MCQ)",
        minPassingScore: 70,
        questions: [],
      }
    );
  };

  const updateAssignment = (updates: Partial<SectionAssignment>) => {
    const current = ensureAssignment();
    onUpdate({
      ...video,
      assignment: { ...current, ...updates },
    });
  };

  const removeQuiz = () => {
    const copy = { ...video };
    delete copy.assignment;
    onUpdate(copy);
  };

  const addQuizQuestion = () => {
    const asg = ensureAssignment();
    const questions = asg.questions || [];
    const newQ = {
      id: `q-${Date.now()}-${questions.length + 1}`,
      prompt: "",
      type: asg.type || "Multiple Choice (MCQ)",
      choices: ["Option A", "Option B", "Option C", "Option D"],
      correctIndex: 0,
      correctIndices: [0],
      modelAnswer: "",
      keywords: "",
      language: "JavaScript",
      starterCode: "",
      testCases: "",
      structuredTestCases: [],
      solutionCode: "",
      fileTypes: ".pdf, .zip, .png, .jpg",
      maxFileSizeMb: 25,
      checklist: "",
      rubric: "",
      minWords: 30,
      maxPoints: 10,
    };
    updateAssignment({ questions: [...questions, newQ] });
  };

  const updateQuizQuestion = (qIndex: number, updates: any) => {
    const asg = ensureAssignment();
    const questions = [...(asg.questions || [])];
    if (!questions[qIndex]) return;
    questions[qIndex] = { ...questions[qIndex], ...updates };
    updateAssignment({ questions });
  };

  const removeQuizQuestion = (qIndex: number) => {
    const asg = ensureAssignment();
    const questions = (asg.questions || []).filter((_, i) => i !== qIndex);
    updateAssignment({ questions });
  };

  // Clear all assignment data for this video
  const clearAllAssignments = () => {
    const copy = { ...video };
    delete copy.interviewQuestions;
    delete copy.task;
    delete copy.assignment;
    onUpdate(copy);
    setIsOpen(false);
  };

  return (
    <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 space-y-2">
      {/* Video Bar: Assignment Summary & Action Button */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {!hasAnyAssignment ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              No Assignment
            </span>
          ) : (
            <>
              {interviewCount > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  <HelpCircle className="h-3 w-3" /> Interview Qs ({interviewCount})
                </span>
              )}
              {hasTask && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                  <FileText className="h-3 w-3" /> Task: {video.task?.title || "Configured"}
                </span>
              )}
              {hasQuiz && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="h-3 w-3" /> Quiz ({quizCount} Qs)
                </span>
              )}
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            hasAnyAssignment
              ? "bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 hover:bg-blue-100 border border-blue-200 dark:border-blue-800"
              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300/80 dark:border-slate-700"
          }`}
        >
          {hasAnyAssignment ? (
            <>
              <Sliders className="h-3.5 w-3.5" />
              <span>Edit Assignment</span>
            </>
          ) : (
            <>
              <Plus className="h-3.5 w-3.5" />
              <span>Add Assignment</span>
            </>
          )}
          {isOpen ? <ChevronUp className="h-3.5 w-3.5 ml-0.5" /> : <ChevronDown className="h-3.5 w-3.5 ml-0.5" />}
        </button>
      </div>

      {/* Expanded Modal / Accordion Panel */}
      {isOpen && (
        <div className="rounded-xl border border-blue-200/90 dark:border-blue-900/60 bg-blue-50/20 dark:bg-blue-950/25 p-3.5 sm:p-4 space-y-4 text-xs shadow-xs animate-in fade-in slide-in-from-top-1">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-100 dark:border-blue-900/40 pb-2.5">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm flex items-center gap-2">
                <span>Video Assignment & Assessment:</span>
                <span className="text-[#2563EB] dark:text-blue-400 truncate max-w-[280px]">
                  {video.title || videoIndexLabel || "Untitled Video"}
                </span>
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Assignments are optional for this video. You can configure interview questions, a practical task, or quiz questions.
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              {hasAnyAssignment && (
                <button
                  type="button"
                  onClick={clearAllAssignments}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-700 px-2 py-1 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition-colors cursor-pointer"
                  title="Remove all assignment configs for this video"
                >
                  <Trash2 className="h-3 w-3" /> Reset to No Assignment
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("interview")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "interview"
                  ? "bg-[#2563EB] text-white shadow-xs"
                  : "bg-white dark:bg-surface-elevated text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-surface-hover border border-slate-200 dark:border-slate-700"
              }`}
            >
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Interview Questions ({interviewCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("task")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "task"
                  ? "bg-[#2563EB] text-white shadow-xs"
                  : "bg-white dark:bg-surface-elevated text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-surface-hover border border-slate-200 dark:border-slate-700"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Practical Task ({hasTask ? "Configured" : "None"})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("quiz")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "quiz"
                  ? "bg-[#2563EB] text-white shadow-xs"
                  : "bg-white dark:bg-surface-elevated text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-surface-hover border border-slate-200 dark:border-slate-700"
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Quiz & Questions ({quizCount})</span>
            </button>
          </div>

          {/* TAB 1: INTERVIEW QUESTIONS */}
          {activeTab === "interview" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">
                  Technical Screening Questions
                </span>
                <button
                  type="button"
                  onClick={addInterviewQuestion}
                  className="rounded-lg bg-white dark:bg-surface-elevated border border-blue-200 dark:border-blue-800 px-2.5 py-1 text-xs font-bold text-[#2563EB] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" /> Add Question
                </button>
              </div>

              {interviewCount === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-4 text-center text-slate-500 dark:text-slate-400">
                  <p className="font-medium text-xs">No interview questions configured for this video.</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Click &ldquo;+ Add Question&rdquo; to attach technical screening questions for students watching this lecture.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {video.interviewQuestions!.map((iq, qIdx) => (
                    <div
                      key={iq.id || qIdx}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary p-3 space-y-2 shadow-2xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/60 text-[#2563EB] text-[10px]">
                            {qIdx + 1}
                          </span>
                          Question #{qIdx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeInterviewQuestion(qIdx)}
                          className="text-slate-400 hover:text-rose-500 cursor-pointer p-1"
                          title="Delete question"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={iq.question}
                        onChange={(e) => updateInterviewQuestion(qIdx, "question", e.target.value)}
                        placeholder="e.g. What is the difference between shallow and deep copy in JavaScript?"
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-input-bg p-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                      />

                      <textarea
                        rows={2}
                        value={iq.answer || ""}
                        onChange={(e) => updateInterviewQuestion(qIdx, "answer", e.target.value)}
                        placeholder="Key interview answer notes, talking points, or reference solution..."
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-input-bg p-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                      />

                      <input
                        type="text"
                        value={iq.tags || ""}
                        onChange={(e) => updateInterviewQuestion(qIdx, "tags", e.target.value)}
                        placeholder="Tags: javascript, es6, objects, memory (comma-separated)"
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-input-bg p-1.5 text-[11px] text-slate-700 dark:text-slate-300 outline-none focus:border-[#2563EB]"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PRACTICAL TASK */}
          {activeTab === "task" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">
                  Video Practical Assignment / Task
                </span>
                {hasTask && (
                  <button
                    type="button"
                    onClick={removeTask}
                    className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" /> Remove Task
                  </button>
                )}
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary p-3.5 space-y-3 shadow-2xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Task Title
                  </label>
                  <input
                    type="text"
                    value={video.task?.title || ""}
                    onChange={(e) => updateTask({ title: e.target.value })}
                    placeholder="e.g. Build a reusable debounce custom hook"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-input-bg p-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Description & Goals
                  </label>
                  <textarea
                    rows={2}
                    value={video.task?.description || ""}
                    onChange={(e) => updateTask({ description: e.target.value })}
                    placeholder="Brief description of what the student needs to achieve..."
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-input-bg p-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Detailed Step-by-Step Instructions
                  </label>
                  <textarea
                    rows={3}
                    value={video.task?.instructions || ""}
                    onChange={(e) => updateTask({ instructions: e.target.value })}
                    placeholder="1. Create useDebounce.ts&#10;2. Implement delay timer with cleanup&#10;3. Demonstrate in a search input component..."
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-input-bg p-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Submission Mode
                    </label>
                    <select
                      value={video.task?.submissionType || "text"}
                      onChange={(e) => updateTask({ submissionType: e.target.value as any })}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-input-bg p-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                    >
                      <option value="text">Code Snippet / Text Description</option>
                      <option value="link">GitHub Repository / Live Demo URL</option>
                      <option value="file">Project File Upload (.zip, .pdf)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Max Points
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={video.task?.points ?? 10}
                      onChange={(e) => updateTask({ points: Number(e.target.value) || 10 })}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-input-bg p-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: QUIZ & QUESTIONS (STAGE 3 REUSED) */}
          {activeTab === "quiz" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">
                    Assessment Questions & Evaluation Criteria
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Supports MCQ, Multi-Select, Short Answer, Coding Challenge, and File Uploads.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {hasQuiz && (
                    <button
                      type="button"
                      onClick={removeQuiz}
                      className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" /> Remove Quiz
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={addQuizQuestion}
                    className="rounded-lg bg-[#2563EB] px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Question
                  </button>
                </div>
              </div>

              {/* Assessment Meta Config: Title & Passing Marks */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary p-3.5 grid grid-cols-1 sm:grid-cols-12 gap-3 shadow-2xs">
                <div className="sm:col-span-8">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Quiz / Assessment Title
                  </label>
                  <input
                    type="text"
                    value={video.assignment?.title || ""}
                    onChange={(e) => updateAssignment({ title: e.target.value })}
                    placeholder="e.g. Core Concepts Mastery Quiz"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-input-bg p-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Min Passing Score (%)
                  </label>
                  <input
                    type="number"
                    min={40}
                    max={100}
                    value={video.assignment?.minPassingScore ?? 70}
                    onChange={(e) => updateAssignment({ minPassingScore: Number(e.target.value) || 70 })}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-input-bg p-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              {/* Questions List */}
              {quizCount === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-5 text-center text-slate-500 dark:text-slate-400">
                  <p className="font-semibold text-xs">No questions configured for this video quiz.</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Click &ldquo;+ Add Question&rdquo; to add MCQs, code challenges, or short answers.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {(video.assignment?.questions || []).map((q, qIdx) => {
                    const qType = canonicalizeAssessmentType(q.type);

                    return (
                      <div
                        key={q.id || qIdx}
                        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary p-4 space-y-3 shadow-xs"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 dark:bg-slate-800 text-[10.5px] font-bold text-white shrink-0">
                              {qIdx + 1}
                            </span>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                              Question #{qIdx + 1}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <select
                              value={qType}
                              onChange={(e) =>
                                updateQuizQuestion(qIdx, {
                                  type: e.target.value,
                                })
                              }
                              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-input-bg px-2 py-1 text-[11px] font-semibold text-slate-800 dark:text-white outline-none"
                            >
                              <option value="Multiple Choice (MCQ)">Multiple Choice (MCQ)</option>
                              <option value="Multiple Select (Multi-Choice)">Multiple Select (Multi-Choice)</option>
                              <option value="Short Answer Question">Short Answer Question</option>
                              <option value="Long Answer / Comprehensive">Long Answer / Comprehensive</option>
                              <option value="Coding Challenge / Test">Coding Challenge / Test</option>
                              <option value="Project / File Upload">Project / File Upload</option>
                            </select>

                            <button
                              type="button"
                              onClick={() => removeQuizQuestion(qIdx)}
                              className="text-slate-400 hover:text-rose-500 cursor-pointer p-1"
                              title="Delete question"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Question Prompt */}
                        <div>
                          <label className="block text-[10.5px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                            Question Prompt
                          </label>
                          <textarea
                            rows={2}
                            value={q.prompt || ""}
                            onChange={(e) => updateQuizQuestion(qIdx, { prompt: e.target.value })}
                            placeholder="Enter the question or problem statement here..."
                            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-input-bg p-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                          />
                        </div>

                        {/* Question Type: MCQ */}
                        {qType === "Multiple Choice (MCQ)" && (
                          <div className="space-y-2">
                            <label className="block text-[10.5px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                              Options & Correct Choice
                            </label>
                            {(q.choices || ["Option A", "Option B", "Option C", "Option D"]).map(
                              (choice: string, cIdx: number) => (
                                <div key={cIdx} className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name={`correct-${q.id || qIdx}`}
                                    checked={q.correctIndex === cIdx}
                                    onChange={() =>
                                      updateQuizQuestion(qIdx, {
                                        correctIndex: cIdx,
                                        correctIndices: [cIdx],
                                      })
                                    }
                                    className="h-4 w-4 text-[#2563EB] cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={choice}
                                    onChange={(e) => {
                                      const updatedChoices = [
                                        ...(q.choices || [
                                          "Option A",
                                          "Option B",
                                          "Option C",
                                          "Option D",
                                        ]),
                                      ];
                                      updatedChoices[cIdx] = e.target.value;
                                      updateQuizQuestion(qIdx, { choices: updatedChoices });
                                    }}
                                    placeholder={`Option ${String.fromCharCode(65 + cIdx)}`}
                                    className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-input-bg p-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                                  />
                                </div>
                              )
                            )}
                          </div>
                        )}

                        {/* Question Type: Multi-Select */}
                        {qType === "Multiple Select (Multi-Choice)" && (
                          <div className="space-y-2">
                            <label className="block text-[10.5px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                              Options & All Correct Choices (Check all that apply)
                            </label>
                            {(q.choices || ["Option A", "Option B", "Option C", "Option D"]).map(
                              (choice: string, cIdx: number) => {
                                const isChecked = (q.correctIndices || []).includes(cIdx);
                                return (
                                  <div key={cIdx} className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={(e) => {
                                        const current = q.correctIndices || [];
                                        const next = e.target.checked
                                          ? [...current, cIdx]
                                          : current.filter((i: number) => i !== cIdx);
                                        updateQuizQuestion(qIdx, { correctIndices: next });
                                      }}
                                      className="h-4 w-4 text-[#2563EB] rounded cursor-pointer"
                                    />
                                    <input
                                      type="text"
                                      value={choice}
                                      onChange={(e) => {
                                        const updatedChoices = [
                                          ...(q.choices || [
                                            "Option A",
                                            "Option B",
                                            "Option C",
                                            "Option D",
                                          ]),
                                        ];
                                        updatedChoices[cIdx] = e.target.value;
                                        updateQuizQuestion(qIdx, { choices: updatedChoices });
                                      }}
                                      placeholder={`Option ${String.fromCharCode(65 + cIdx)}`}
                                      className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-input-bg p-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                                    />
                                  </div>
                                );
                              }
                            )}
                          </div>
                        )}

                        {/* Question Type: Short Answer */}
                        {qType === "Short Answer Question" && (
                          <div className="space-y-2">
                            <div>
                              <label className="block text-[10.5px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                                Expected Model Answer / Answer Key
                              </label>
                              <textarea
                                rows={2}
                                value={q.modelAnswer || ""}
                                onChange={(e) => updateQuizQuestion(qIdx, { modelAnswer: e.target.value })}
                                placeholder="Key reference answer for automated or instructor grading..."
                                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-input-bg p-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                              />
                            </div>
                            <div>
                              <label className="block text-[10.5px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                                Required Keywords (comma-separated)
                              </label>
                              <input
                                type="text"
                                value={q.keywords || ""}
                                onChange={(e) => updateQuizQuestion(qIdx, { keywords: e.target.value })}
                                placeholder="e.g. closure, lexical scope, memory, garbage collection"
                                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-input-bg p-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                              />
                            </div>
                          </div>
                        )}

                        {/* Question Type: Long Answer */}
                        {qType === "Long Answer / Comprehensive" && (
                          <div className="space-y-2">
                            <div>
                              <label className="block text-[10.5px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                                Grading Rubric & Guidance
                              </label>
                              <textarea
                                rows={2}
                                value={q.rubric || ""}
                                onChange={(e) => updateQuizQuestion(qIdx, { rubric: e.target.value })}
                                placeholder="Describe what the student must cover to achieve full marks..."
                                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-input-bg p-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10.5px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                                  Min Words
                                </label>
                                <input
                                  type="number"
                                  min={10}
                                  value={q.minWords || 50}
                                  onChange={(e) => updateQuizQuestion(qIdx, { minWords: Number(e.target.value) || 50 })}
                                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-input-bg p-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                                />
                              </div>
                              <div>
                                <label className="block text-[10.5px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                                  Max Points
                                </label>
                                <input
                                  type="number"
                                  min={1}
                                  value={q.maxPoints || 10}
                                  onChange={(e) => updateQuizQuestion(qIdx, { maxPoints: Number(e.target.value) || 10 })}
                                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-input-bg p-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Question Type: Coding Challenge */}
                        {qType === "Coding Challenge / Test" && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <label className="text-[10.5px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                Language:
                              </label>
                              <select
                                value={q.language || "JavaScript"}
                                onChange={(e) => updateQuizQuestion(qIdx, { language: e.target.value })}
                                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-input-bg px-2 py-1 text-xs font-semibold text-slate-900 dark:text-white outline-none"
                              >
                                <option value="JavaScript">JavaScript / TypeScript</option>
                                <option value="Python">Python</option>
                                <option value="Java">Java</option>
                                <option value="CSharp">C# / .NET</option>
                                <option value="SQL">SQL</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10.5px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                                Starter Code
                              </label>
                              <textarea
                                rows={3}
                                value={q.starterCode || ""}
                                onChange={(e) => updateQuizQuestion(qIdx, { starterCode: e.target.value })}
                                placeholder="function solve(input) {&#10;  // Write your code here&#10;}"
                                className="w-full font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-900 text-emerald-400 p-2 text-xs outline-none focus:border-[#2563EB]"
                              />
                            </div>
                            <div>
                              <label className="block text-[10.5px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                                Test Cases (Input -&gt; Output)
                              </label>
                              <textarea
                                rows={2}
                                value={q.testCases || ""}
                                onChange={(e) => updateQuizQuestion(qIdx, { testCases: e.target.value })}
                                placeholder="input: [1, 2, 3] -> output: 6"
                                className="w-full font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-input-bg p-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                              />
                            </div>
                          </div>
                        )}

                        {/* Question Type: Project / File Upload */}
                        {qType === "Project / File Upload" && (
                          <div className="space-y-2">
                            <div>
                              <label className="block text-[10.5px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                                Deliverables & Checklist
                              </label>
                              <textarea
                                rows={2}
                                value={q.checklist || ""}
                                onChange={(e) => updateQuizQuestion(qIdx, { checklist: e.target.value })}
                                placeholder="- Source code (.zip)&#10;- Architecture diagram (.png)&#10;- Technical documentation (.pdf)"
                                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-input-bg p-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10.5px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                                  Allowed File Extensions
                                </label>
                                <input
                                  type="text"
                                  value={q.fileTypes || ".zip, .pdf, .png, .jpg"}
                                  onChange={(e) => updateQuizQuestion(qIdx, { fileTypes: e.target.value })}
                                  placeholder=".zip, .pdf"
                                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-input-bg p-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                                />
                              </div>
                              <div>
                                <label className="block text-[10.5px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                                  Max Size (MB)
                                </label>
                                <input
                                  type="number"
                                  min={5}
                                  max={100}
                                  value={q.maxFileSizeMb || 25}
                                  onChange={(e) => updateQuizQuestion(qIdx, { maxFileSizeMb: Number(e.target.value) || 25 })}
                                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-input-bg p-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
