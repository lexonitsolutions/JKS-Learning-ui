"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ClipboardCheck,
  Search,
  Filter,
  Plus,
  Trash2,
  CheckCircle2,
  Code2,
  Sliders,
  Sparkles,
  BookOpen,
  Award,
  Layers,
  ArrowLeft,
  X,
  Check,
} from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import {
  getStoredQuestions,
  addQuestion,
  deleteQuestion,
  type Question,
} from "@/lib/data/questions-store";

export default function AssessmentQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [showAddModal, setShowAddModal] = useState(false);

  // Add Question Form State
  const [form, setForm] = useState({
    category: "Java Full Stack" as Question["category"],
    difficulty: "Medium" as Question["difficulty"],
    type: "MCQ" as Question["type"],
    questionText: "",
    codeSnippet: "",
    options: ["", "", "", ""],
    correctOptionIndex: 0,
    marks: 5,
    explanation: "",
  });

  useEffect(() => {
    setQuestions(getStoredQuestions());
  }, []);

  const refreshQuestions = () => {
    setQuestions(getStoredQuestions());
  };

  const handleDelete = (id: string) => {
    deleteQuestion(id);
    refreshQuestions();
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.questionText || form.options.some((o) => !o.trim())) return;

    addQuestion({
      category: form.category,
      difficulty: form.difficulty,
      type: form.type,
      questionText: form.questionText,
      codeSnippet: form.codeSnippet.trim() ? form.codeSnippet : undefined,
      options: form.options,
      correctOptionIndex: form.correctOptionIndex,
      marks: Number(form.marks),
      explanation: form.explanation || "No explanation provided.",
    });

    setShowAddModal(false);
    setForm({
      category: "Java Full Stack",
      difficulty: "Medium",
      type: "MCQ",
      questionText: "",
      codeSnippet: "",
      options: ["", "", "", ""],
      correctOptionIndex: 0,
      marks: 5,
      explanation: "",
    });
    refreshQuestions();
  };

  const filtered = questions.filter((q) => {
    const matchCat = selectedCategory === "All" || q.category === selectedCategory;
    const matchDiff = selectedDifficulty === "All" || q.difficulty === selectedDifficulty;
    const matchSearch =
      q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchDiff && matchSearch;
  });

  return (
    <>
      <DashboardTopbar
        title="Assessment Question Bank"
        subtitle={`Centralized repository of ${questions.length} technical MCQs, coding challenges, and system design problems.`}
        userInitials="AD"
      />

      <div className="flex-1 space-y-6 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4">
        {/* Navigation Breadcrumb & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/admin/assessments"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Assessment Suites
          </Link>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#2563EB] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Add Question to Bank
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-slate-800/80 dark:bg-[#111827]">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search question bank by keyword, concept, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2 text-xs text-slate-900 outline-none focus:border-[#2563EB] focus:bg-white dark:border-slate-700/80 dark:bg-[#121A2A] dark:text-white dark:placeholder-slate-500 dark:focus:border-blue-500 dark:focus:bg-[#121A2A]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none dark:border-slate-700/80 dark:bg-[#121A2A] dark:text-white"
            >
              <option value="All">All Categories</option>
              <option value="Java Full Stack">Java Full Stack</option>
              <option value="React 19 & Next.js">React 19 &amp; Next.js</option>
              <option value="Spring Boot Microservices">Spring Boot Microservices</option>
              <option value="Data Structures & Algorithms">Data Structures</option>
              <option value="System Design">System Design</option>
              <option value="SAP S/4HANA">SAP S/4HANA</option>
              <option value=".NET 9">.NET 9</option>
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none dark:border-slate-700/80 dark:bg-[#121A2A] dark:text-white"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Question Cards List */}
        <div className="space-y-4">
          {filtered.map((q) => (
            <div
              key={q.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4 hover:border-slate-300 transition-all dark:border-slate-800/80 dark:bg-[#111827] dark:hover:border-slate-700/80"
            >
              {/* Question Meta Row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-blue-50 border border-blue-200 px-2.5 py-1 text-[11px] font-mono font-bold text-blue-700 dark:bg-blue-950/50 dark:border-blue-900/60 dark:text-blue-400">
                    {q.id}
                  </span>
                  <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {q.category}
                  </span>
                  <span
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase ${
                      q.difficulty === "Easy"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900/60"
                        : q.difficulty === "Medium"
                        ? "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900/60"
                        : "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-900/60"
                    }`}
                  >
                    {q.difficulty}
                  </span>
                  <span className="rounded-lg bg-purple-50 border border-purple-200 px-2.5 py-1 text-[11px] font-bold text-purple-700 dark:bg-purple-950/50 dark:border-purple-900/60 dark:text-purple-400">
                    {q.marks} Points
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(q.id)}
                  className="rounded-xl p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors dark:hover:bg-rose-950/50 dark:hover:text-rose-400 cursor-pointer"
                  title="Delete Question"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Question Text */}
              <div className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                {q.questionText}
              </div>

              {/* Code Snippet if present */}
              {q.codeSnippet && (
                <div className="rounded-xl bg-slate-950 p-4 font-mono text-xs text-cyan-300 overflow-x-auto border border-slate-800">
                  <pre>{q.codeSnippet}</pre>
                </div>
              )}

              {/* Options Grid */}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs">
                {q.options.map((opt, idx) => {
                  const isCorrect = idx === q.correctOptionIndex;

                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-2.5 rounded-xl border p-3 ${
                        isCorrect
                          ? "border-emerald-500 bg-emerald-50/70 text-emerald-950 font-bold dark:border-emerald-500/60 dark:bg-emerald-950/40 dark:text-emerald-300"
                          : "border-slate-200 bg-slate-50/50 text-slate-700 dark:border-slate-800 dark:bg-[#151D2E] dark:text-slate-300"
                      }`}
                    >
                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                          isCorrect ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="flex-1">{opt}</span>
                      {isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                    </div>
                  );
                })}
              </div>

              {/* Explanation Box */}
              {q.explanation && (
                <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3 text-xs text-blue-900 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-300">
                  <span className="font-bold">Answer Explanation: </span>
                  <span className="text-slate-700 dark:text-slate-300">{q.explanation}</span>
                </div>
              )}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
              No questions found matching your filter criteria.
            </div>
          )}
        </div>
      </div>

      {/* Add New Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto dark:bg-black/75">
          <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-4 my-8 dark:border-slate-800 dark:bg-[#111827]">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Add Question to Question Bank</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-[#2563EB] dark:border-slate-700/80 dark:bg-[#121A2A] dark:text-white"
                  >
                    <option value="Java Full Stack">Java Full Stack</option>
                    <option value="React 19 & Next.js">React 19 &amp; Next.js</option>
                    <option value="Spring Boot Microservices">Spring Boot</option>
                    <option value="Data Structures & Algorithms">DSA</option>
                    <option value="System Design">System Design</option>
                    <option value="SAP S/4HANA">SAP S/4HANA</option>
                    <option value=".NET 9">.NET 9</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Difficulty</label>
                  <select
                    value={form.difficulty}
                    onChange={(e) => setForm({ ...form, difficulty: e.target.value as any })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-[#2563EB] dark:border-slate-700/80 dark:bg-[#121A2A] dark:text-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Marks / Points</label>
                  <input
                    type="number"
                    value={form.marks}
                    onChange={(e) => setForm({ ...form, marks: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-[#2563EB] dark:border-slate-700/80 dark:bg-[#121A2A] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Question Statement *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Enter the technical scenario or question statement..."
                  value={form.questionText}
                  onChange={(e) => setForm({ ...form, questionText: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-[#2563EB] dark:border-slate-700/80 dark:bg-[#121A2A] dark:text-white dark:placeholder-slate-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Code Snippet (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Optional code block in Java, TypeScript, SQL..."
                  value={form.codeSnippet}
                  onChange={(e) => setForm({ ...form, codeSnippet: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-mono text-xs outline-none focus:border-[#2563EB] dark:border-slate-700/80 dark:bg-[#121A2A] dark:text-white dark:placeholder-slate-500"
                />
              </div>

              {/* 4 Options & Correct Answer Radio */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700 dark:text-slate-300">Answer Options &amp; Correct Answer *</label>
                {form.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={form.correctOptionIndex === idx}
                      onChange={() => setForm({ ...form, correctOptionIndex: idx })}
                      className="h-4 w-4 text-blue-600 cursor-pointer"
                      title="Mark as correct answer"
                    />
                    <span className="font-mono font-bold text-slate-500 dark:text-slate-400 w-4">
                      {String.fromCharCode(65 + idx)}:
                    </span>
                    <input
                      type="text"
                      required
                      placeholder={`Option ${String.fromCharCode(65 + idx)} text`}
                      value={opt}
                      onChange={(e) => {
                        const next = [...form.options];
                        next[idx] = e.target.value;
                        setForm({ ...form, options: next });
                      }}
                      className="flex-1 rounded-xl border border-slate-200 p-2 text-xs outline-none focus:border-[#2563EB] dark:border-slate-700/80 dark:bg-[#121A2A] dark:text-white dark:placeholder-slate-500"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300">Answer Explanation</label>
                <textarea
                  rows={2}
                  placeholder="Explain why the chosen answer is correct..."
                  value={form.explanation}
                  onChange={(e) => setForm({ ...form, explanation: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-[#2563EB] dark:border-slate-700/80 dark:bg-[#121A2A] dark:text-white dark:placeholder-slate-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl px-4 py-2 font-bold text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#2563EB] px-5 py-2 font-bold text-white hover:bg-blue-700 shadow-md cursor-pointer"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
