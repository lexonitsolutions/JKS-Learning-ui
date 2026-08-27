"use client";

import React, { useState } from "react";
import {
  ClipboardCheck,
  CheckCircle2,
  PlayCircle,
  Clock,
  Award,
  ChevronRight,
  Sparkles,
  ArrowRight,
  X,
  AlertCircle,
  HelpCircle,
  Layers,
  Code2,
  Server,
  FileCode,
  Check,
} from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Reveal } from "@/lib/motion/reveal";
import { TiltCard } from "@/components/interactions/tilt-card";

interface Quiz {
  id: string;
  title: string;
  category: string;
  bannerTitle: string;
  bannerSubtitle: string;
  bannerBg: string;
  questionsCount: number;
  passPercentage: number;
  durationMinutes: number;
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

const QUIZZES: Quiz[] = [
  {
    id: "react-inception",
    title: "React Inception Quiz",
    category: "React & Next.js",
    bannerTitle: "React",
    bannerSubtitle: "Inception",
    bannerBg: "from-cyan-900/90 via-slate-900 to-blue-950",
    questionsCount: 5,
    passPercentage: 60,
    durationMinutes: 10,
    questions: [
      {
        question: "What is the primary purpose of React.createElement?",
        options: [
          "Directly render HTML into the DOM",
          "Create a lightweight virtual DOM object representation",
          "Compile JSX into JavaScript bundle",
          "Manage browser history state",
        ],
        correctIndex: 1,
        explanation: "React.createElement creates and returns a new React element object representing the DOM node.",
      },
      {
        question: "Why are keys important in React lists?",
        options: [
          "To uniquely style list elements in CSS",
          "To help React identify which items have changed, added, or removed for efficient reconciliation",
          "To store list items in local storage",
          "To trigger re-renders on hover",
        ],
        correctIndex: 1,
        explanation: "Keys give elements a stable identity across renders, allowing React to optimize virtual DOM diffing.",
      },
      {
        question: "Which hook is used to handle side effects in React function components?",
        options: ["useState", "useMemo", "useEffect", "useCallback"],
        correctIndex: 2,
        explanation: "useEffect allows you to perform side effects like data fetching, subscriptions, or manually changing the DOM.",
      },
      {
        question: "What is React Reconciliation?",
        options: [
          "The algorithm React uses to diff one tree with another to determine which parts need to be changed",
          "The process of transpiling TypeScript to JavaScript",
          "Binding event handlers to DOM nodes",
          "Exporting components to static HTML",
        ],
        correctIndex: 0,
        explanation: "Reconciliation is the process through which React updates the actual DOM based on changes in virtual DOM.",
      },
      {
        question: "What does the React StrictMode component do in development?",
        options: [
          "Enforces strict TypeScript type checking",
          "Highlights potential problems by running certain lifecycles and effects twice in dev mode",
          "Disables console.log statements",
          "Prevents any state updates",
        ],
        correctIndex: 1,
        explanation: "StrictMode helps identify unintended side effects by double-invoking render functions and effects in development.",
      },
    ],
  },
  {
    id: "node-server",
    title: "Creating a Server Quiz",
    category: "Node.js & Backend",
    bannerTitle: "Node.js",
    bannerSubtitle: "Creating a Server",
    bannerBg: "from-emerald-950 via-slate-900 to-green-950",
    questionsCount: 8,
    passPercentage: 60,
    durationMinutes: 15,
    questions: [
      {
        question: "Which built-in Node.js module is used to create an HTTP server?",
        options: ["fs", "http", "path", "url"],
        correctIndex: 1,
        explanation: "The 'http' module allows Node.js to transfer data over the Hyper Text Transfer Protocol (HTTP).",
      },
      {
        question: "What does server.listen(port) do in Node.js?",
        options: [
          "Stops the server after a timeout",
          "Binds and listens for incoming TCP connections on the specified port",
          "Logs server requests to a file",
          "Clears the event loop queue",
        ],
        correctIndex: 1,
        explanation: "server.listen starts a UNIX socket or TCP server listening for connections on the given port.",
      },
      {
        question: "What is the role of the Node.js Event Loop?",
        options: [
          "Compile JavaScript code to machine instructions",
          "Execute non-blocking asynchronous callbacks on a single thread",
          "Create multi-threaded CPU clusters",
          "Manage database transactions",
        ],
        correctIndex: 1,
        explanation: "The event loop allows Node.js to perform non-blocking I/O operations despite JavaScript being single-threaded.",
      },
    ],
  },
  {
    id: "javascript-core",
    title: "Core JavaScript Fundamentals",
    category: "JavaScript Core",
    bannerTitle: "JKS",
    bannerSubtitle: "JavaScript",
    bannerBg: "from-amber-950 via-slate-900 to-orange-950",
    questionsCount: 25,
    passPercentage: 60,
    durationMinutes: 20,
    questions: [
      {
        question: "What is a Closure in JavaScript?",
        options: [
          "A function bundled together with references to its lexical environment",
          "A method to close browser tabs",
          "A syntax for terminating loops early",
          "An object frozen with Object.freeze",
        ],
        correctIndex: 0,
        explanation: "A closure gives you access to an outer function's scope from an inner function even after the outer function has executed.",
      },
      {
        question: "What is the difference between '==' and '===' in JavaScript?",
        options: [
          "There is no difference",
          "'==' performs type coercion before comparison; '===' checks both value and type strictly",
          "'===' is for numbers only",
          "'==' compares memory references",
        ],
        correctIndex: 1,
        explanation: "'===' checks strict equality without type coercion.",
      },
    ],
  },
  {
    id: "java-spring",
    title: "Java & Spring Boot Architecture",
    category: "Java Full Stack",
    bannerTitle: "Spring Boot",
    bannerSubtitle: "REST APIs & Microservices",
    bannerBg: "from-blue-950 via-slate-900 to-indigo-950",
    questionsCount: 15,
    passPercentage: 70,
    durationMinutes: 25,
    questions: [
      {
        question: "What does the @RestController annotation do in Spring Boot?",
        options: [
          "Enables security filters",
          "Combines @Controller and @ResponseBody, automatically serializing return values to JSON",
          "Configures database connections",
          "Starts an embedded Tomcat server",
        ],
        correctIndex: 1,
        explanation: "@RestController is a convenience annotation that marks the request handler and binds return values directly to web responses.",
      },
      {
        question: "What is Dependency Injection in Spring?",
        options: [
          "Importing third-party jar files",
          "A design pattern where IoC container injects dependent objects into a class instead of manual instantiations",
          "Injecting SQL queries into repositories",
          "A compiler optimization tool",
        ],
        correctIndex: 1,
        explanation: "Dependency Injection in Spring inverts control by providing dependencies at runtime via constructor or field injection.",
      },
    ],
  },
];

const CATEGORIES = [
  "My Quizzes",
  "React & Next.js",
  "JavaScript Core",
  "Java Full Stack",
  "Node.js & Backend",
  "DSA & Algorithms",
  "System Design",
];

export default function QuizzesPage() {
  const [selectedCategory, setSelectedCategory] = useState("My Quizzes");
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);

  // Active Quiz Running State
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const filteredQuizzes =
    selectedCategory === "My Quizzes"
      ? QUIZZES
      : QUIZZES.filter((q) => q.category === selectedCategory);

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  const handleSelectOption = (optIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQIndex]: optIndex,
    });
  };

  const calculateScore = () => {
    if (!activeQuiz) return { score: 0, total: 0, percent: 0, passed: false };
    let correct = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correct++;
      }
    });
    const percent = Math.round((correct / activeQuiz.questions.length) * 100);
    const passed = percent >= activeQuiz.passPercentage;
    return { score: correct, total: activeQuiz.questions.length, percent, passed };
  };

  return (
    <>
      <DashboardTopbar
        title="Quizzes & Knowledge Checks"
        subtitle="Validate your mastery with interactive, topic-focused micro quizzes."
        userInitials="JD"
      />

      <div className="flex-1 space-y-6 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4">
        {/* Category Filter Chips Bar (matching reference design) */}
        <Reveal variant="fade-up">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? "bg-emerald-50 border border-emerald-300 text-emerald-700 shadow-xs"
                      : "bg-slate-100/80 hover:bg-slate-200/80 text-slate-600 border border-transparent"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Section Header: Ready to Start */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">Ready to Start</h2>
          <span className="text-xs font-semibold text-slate-500">{filteredQuizzes.length} available quizzes</span>
        </div>

        {/* Quiz Cards Grid (matching reference image) */}
        <Reveal variant="stagger" className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredQuizzes.map((quiz) => (
            <TiltCard key={quiz.id} className="h-full">
              <div className="flex h-full flex-col justify-between overflow-hidden rounded-[24px] border border-white/70 bg-white/85 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                {/* 3D Top Header Banner */}
                <div
                  className={`relative flex h-36 w-full flex-col justify-center px-6 text-white bg-gradient-to-br ${quiz.bannerBg}`}
                >
                  {/* Subtle 3D Grid Overlay */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: "radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-white/95">
                    {quiz.bannerTitle}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
                    {quiz.bannerSubtitle}
                  </span>
                </div>

                {/* Card Content & Action Button */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-slate-900">{quiz.title}</h3>
                      <button
                        type="button"
                        onClick={() => startQuiz(quiz)}
                        className="flex items-center gap-1 rounded-xl bg-[#EA580C] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-orange-600 transition-colors cursor-pointer"
                      >
                        <span>Start</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-slate-500 font-medium">Test your understanding with a quick quiz.</p>
                  </div>

                  {/* Card Meta Footer (Matching reference image) */}
                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-semibold text-slate-600">
                    {/* Questions Count */}
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-[#2563EB]">
                        <ClipboardCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-slate-900">{quiz.questionsCount} Questions</div>
                        <div className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">
                          TOTAL QUESTIONS
                        </div>
                      </div>
                    </div>

                    {/* Pass Percentage */}
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-slate-900">Min {quiz.passPercentage}%</div>
                        <div className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">
                          PASS PERCENTAGE
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>
          ))}
        </Reveal>
      </div>

      {/* Interactive Quiz Runner Modal */}
      {activeQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveQuiz(null)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {!isSubmitted ? (
              <>
                {/* Header */}
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#2563EB] uppercase tracking-wider">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{activeQuiz.category}</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1">{activeQuiz.title}</h3>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>
                      Question {currentQIndex + 1} of {activeQuiz.questions.length}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-amber-600">
                      <Clock className="h-3.5 w-3.5" /> {activeQuiz.durationMinutes} mins
                    </span>
                  </div>
                </div>

                {/* Question & Options */}
                <div className="mt-5">
                  <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {activeQuiz.questions[currentQIndex].question}
                  </p>

                  <div className="mt-4 space-y-2.5">
                    {activeQuiz.questions[currentQIndex].options.map((opt, idx) => {
                      const isChosen = selectedAnswers[currentQIndex] === idx;
                      return (
                        <div
                          key={opt}
                          onClick={() => handleSelectOption(idx)}
                          className={`flex items-center justify-between rounded-xl border p-3.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                            isChosen
                              ? "border-[#2563EB] bg-blue-50/80 text-[#2563EB] shadow-xs"
                              : "border-slate-200/80 bg-white hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold border ${
                                isChosen
                                  ? "border-[#2563EB] bg-[#2563EB] text-white"
                                  : "border-slate-300 text-slate-500"
                              }`}
                            >
                              {String.fromCharCode(65 + idx)}
                            </div>
                            <span>{opt}</span>
                          </div>
                          {isChosen && <Check className="h-4 w-4 text-[#2563EB]" />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    disabled={currentQIndex === 0}
                    onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                    className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {currentQIndex < activeQuiz.questions.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentQIndex((prev) => prev + 1)}
                      className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
                    >
                      <span>Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsSubmitted(true)}
                      className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-6 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Submit Quiz</span>
                    </button>
                  )}
                </div>
              </>
            ) : (
              /* Quiz Score Result View */
              <div className="text-center py-4">
                {(() => {
                  const res = calculateScore();
                  return (
                    <div>
                      <div
                        className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                          res.passed ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                        }`}
                      >
                        {res.passed ? <Award className="h-8 w-8" /> : <AlertCircle className="h-8 w-8" />}
                      </div>

                      <h3 className="mt-4 text-2xl font-black text-slate-900">
                        {res.passed ? "Congratulations! 🎉" : "Keep Practicing! 💪"}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500 font-medium">
                        {res.passed
                          ? `You scored ${res.percent}% and successfully passed the quiz!`
                          : `You scored ${res.percent}%. You need ${activeQuiz.passPercentage}% to pass.`}
                      </p>

                      <div className="mx-auto mt-6 max-w-xs rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <div className="flex justify-between text-xs font-bold text-slate-700">
                          <span>Correct Answers</span>
                          <span className="text-[#2563EB]">
                            {res.score} / {res.total}
                          </span>
                        </div>
                        <div className="mt-2 h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${res.passed ? "bg-emerald-500" : "bg-amber-500"}`}
                            style={{ width: `${res.percent}%` }}
                          />
                        </div>
                      </div>

                      <div className="mt-8 flex justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => startQuiz(activeQuiz)}
                          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                        >
                          Retake Quiz
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveQuiz(null)}
                          className="rounded-xl bg-[#2563EB] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
