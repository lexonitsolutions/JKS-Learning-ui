"use client";

import { useSyncExternalStore } from "react";
import { getClientSessionEmail } from "./enrollments-api";

export interface QAAnswer {
  id: string;
  author: string;
  authorEmail: string;
  authorRole: "student" | "instructor" | "admin";
  authorAvatar?: string;
  content: string;
  createdAt: string;
  formattedDate: string;
  isInstructorVerified?: boolean;
}

export interface QAQuestion {
  id: string;
  courseSlug: string;
  title: string;
  details?: string;
  author: string;
  authorEmail: string;
  authorAvatar?: string;
  lecture: string;
  createdAt: string;
  formattedDate: string;
  upvotes: number;
  upvotedBy: string[]; // array of emails
  answers: QAAnswer[];
  hasInstructorResponse: boolean;
}

const QA_CHANGE_EVENT = "jks-course-qa-changed";

export function getCourseQAStorageKey(slug: string): string {
  return `jks_qa_${slug.toLowerCase().trim()}`;
}

const EMPTY_QUESTIONS: QAQuestion[] = [];
const qaCache: Record<string, { raw: string | null; data: QAQuestion[] }> = {};

function safeGetQA(storageKey: string): QAQuestion[] {
  if (typeof window === "undefined") return EMPTY_QUESTIONS;
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      if (qaCache[storageKey] && qaCache[storageKey].raw === null) {
        return qaCache[storageKey].data;
      }
      qaCache[storageKey] = { raw: null, data: EMPTY_QUESTIONS };
      return EMPTY_QUESTIONS;
    }
    if (qaCache[storageKey] && qaCache[storageKey].raw === raw) {
      return qaCache[storageKey].data;
    }
    const data = JSON.parse(raw) as QAQuestion[];
    qaCache[storageKey] = { raw, data };
    return data;
  } catch {
    return EMPTY_QUESTIONS;
  }
}

function safeSetQA(storageKey: string, questions: QAQuestion[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKey, JSON.stringify(questions));
    window.dispatchEvent(new Event(QA_CHANGE_EVENT));
  } catch (err) {
    console.error("Failed to save Q&A to localStorage:", err);
  }
}

export function getCourseQuestions(courseSlug: string): QAQuestion[] {
  return safeGetQA(getCourseQAStorageKey(courseSlug));
}

export function askCourseQuestion(
  courseSlug: string,
  params: {
    title: string;
    details?: string;
    author: string;
    authorEmail?: string;
    authorAvatar?: string;
    lecture?: string;
  }
): QAQuestion {
  const key = getCourseQAStorageKey(courseSlug);
  const current = safeGetQA(key);
  const email = (params.authorEmail || getClientSessionEmail() || "student@jkslearning.dev").toLowerCase().trim();
  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const newQuestion: QAQuestion = {
    id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    courseSlug,
    title: params.title.trim(),
    details: params.details?.trim(),
    author: params.author || "Student",
    authorEmail: email,
    authorAvatar: params.authorAvatar,
    lecture: params.lecture || "General Course Question",
    createdAt: now.toISOString(),
    formattedDate,
    upvotes: 0,
    upvotedBy: [],
    answers: [],
    hasInstructorResponse: false,
  };

  const updated = [newQuestion, ...current];
  safeSetQA(key, updated);

  // Dispatch event for notifications
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("jks_qa_question_created", {
        detail: { question: newQuestion, courseSlug },
      })
    );
  }

  return newQuestion;
}

export function answerCourseQuestion(
  courseSlug: string,
  questionId: string,
  params: {
    content: string;
    author: string;
    authorEmail?: string;
    authorRole?: "student" | "instructor" | "admin";
    authorAvatar?: string;
  }
): QAAnswer | null {
  const key = getCourseQAStorageKey(courseSlug);
  const current = safeGetQA(key);
  const qIdx = current.findIndex((q) => q.id === questionId);
  if (qIdx === -1) return null;

  const email = (params.authorEmail || getClientSessionEmail() || "faculty@jkslearning.dev").toLowerCase().trim();
  const role = params.authorRole || (email.includes("admin") || email.includes("lexon") ? "admin" : "instructor");
  const isInstructorVerified = role === "admin" || role === "instructor";

  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const newAnswer: QAAnswer = {
    id: `ans-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    author: params.author || (isInstructorVerified ? "JKS Technical Faculty" : "Student"),
    authorEmail: email,
    authorRole: role,
    authorAvatar: params.authorAvatar,
    content: params.content.trim(),
    createdAt: now.toISOString(),
    formattedDate,
    isInstructorVerified,
  };

  const targetQuestion = current[qIdx];
  const updatedQuestion: QAQuestion = {
    ...targetQuestion,
    hasInstructorResponse: targetQuestion.hasInstructorResponse || isInstructorVerified,
    answers: [...targetQuestion.answers, newAnswer],
  };

  const updated = [...current];
  updated[qIdx] = updatedQuestion;
  safeSetQA(key, updated);

  // Dispatch event for student notification
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("jks_qa_answer_created", {
        detail: {
          answer: newAnswer,
          question: targetQuestion,
          courseSlug,
        },
      })
    );
  }

  return newAnswer;
}

export function toggleQuestionUpvote(courseSlug: string, questionId: string, userEmail?: string): boolean {
  const key = getCourseQAStorageKey(courseSlug);
  const current = safeGetQA(key);
  const qIdx = current.findIndex((q) => q.id === questionId);
  if (qIdx === -1) return false;

  const email = (userEmail || getClientSessionEmail() || "guest").toLowerCase().trim();
  const target = current[qIdx];
  const hasUpvoted = target.upvotedBy.includes(email);

  let updatedUpvotedBy: string[];
  let updatedCount: number;

  if (hasUpvoted) {
    updatedUpvotedBy = target.upvotedBy.filter((e) => e !== email);
    updatedCount = Math.max(0, target.upvotes - 1);
  } else {
    updatedUpvotedBy = [...target.upvotedBy, email];
    updatedCount = target.upvotes + 1;
  }

  const updatedQuestion: QAQuestion = {
    ...target,
    upvotes: updatedCount,
    upvotedBy: updatedUpvotedBy,
  };

  const updated = [...current];
  updated[qIdx] = updatedQuestion;
  safeSetQA(key, updated);

  return !hasUpvoted;
}

function subscribeQA(callback: () => void) {
  window.addEventListener(QA_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(QA_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function useCourseQA(courseSlug: string) {
  const storageKey = getCourseQAStorageKey(courseSlug);

  const questions = useSyncExternalStore(
    subscribeQA,
    () => safeGetQA(storageKey),
    () => EMPTY_QUESTIONS
  );

  return {
    questions,
    askQuestion: (params: {
      title: string;
      details?: string;
      author: string;
      authorEmail?: string;
      authorAvatar?: string;
      lecture?: string;
    }) => askCourseQuestion(courseSlug, params),
    answerQuestion: (
      questionId: string,
      params: {
        content: string;
        author: string;
        authorEmail?: string;
        authorRole?: "student" | "instructor" | "admin";
        authorAvatar?: string;
      }
    ) => answerCourseQuestion(courseSlug, questionId, params),
    toggleUpvote: (questionId: string, email?: string) =>
      toggleQuestionUpvote(courseSlug, questionId, email),
  };
}
