import { apiFetch, ApiError } from "@/lib/api/base-url";

/** Explore > Quizzes: standalone practice quizzes an admin publishes for every student. */

export interface QuizDraftQuestion {
  id: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
  correctIndices?: number[];
  multipleAnswers?: boolean;
  explanation?: string;
}

export interface AdminQuizSummary {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  status: "DRAFT" | "PUBLISHED";
  passPercent: number;
  timeLimitMinutes: number | null;
  questionCount: number;
  createdAt: string;
  updatedAt: string;
  attempts: number;
  students: number;
  averagePercent: number | null;
  passRate: number | null;
}

export interface AdminQuizDetail {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  status: "DRAFT" | "PUBLISHED";
  passPercent: number;
  timeLimitMinutes: number | null;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  questions: QuizDraftQuestion[];
}

export interface QuizAttemptRow {
  id: string;
  userId: string;
  userName: string | null;
  userEmail: string | null;
  correct: number;
  total: number;
  percent: number;
  passed: boolean;
  submittedAt: string;
}

export interface StudentQuizSummary {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  passPercent: number;
  timeLimitMinutes: number | null;
  questionCount: number;
  myAttempts: number;
  myBestPercent: number | null;
  myPassed: boolean;
  myLastAttemptAt: string | null;
}

export interface TakeQuiz {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  passPercent: number;
  timeLimitMinutes: number | null;
  questions: {
    id: string;
    prompt: string;
    multipleAnswers?: boolean;
    options: { index: number; text: string }[];
  }[];
}

export interface QuizResult {
  attemptId: string;
  quizId: string;
  title: string;
  passPercent: number;
  correct: number;
  total: number;
  percent: number;
  passed: boolean;
  breakdown: {
    id: string;
    prompt: string;
    choices: string[];
    multipleAnswers?: boolean;
    chosenIndex: number | null;
    chosenIndices?: number[];
    correctIndex: number;
    correctIndices?: number[];
    correct: boolean;
    explanation: string | null;
  }[];
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const res = await apiFetch(path, { ...init, headers, cache: "no-store" });
  if (!res.ok) {
    let message = "";
    try {
      const body = await res.json();
      message = Array.isArray(body?.message) ? body.message.join(" ") : body?.message ?? "";
    } catch {
      /* non-JSON error body */
    }
    if (res.status === 401) message = message || "Please sign in again.";
    if (res.status === 403) message = message || "You do not have permission to do that.";
    throw new ApiError(message || `Request failed (${res.status}).`, res.status);
  }
  return (await res.json()) as T;
}

// Admin
export const adminListQuizzes = () => request<AdminQuizSummary[]>("/admin/explore-quizzes");
export const adminGetQuiz = (id: string) => request<AdminQuizDetail>(`/admin/explore-quizzes/${id}`);
export const adminSaveQuiz = (id: string | null, body: Omit<AdminQuizDetail, "id">) =>
  request<AdminQuizDetail>(id ? `/admin/explore-quizzes/${id}` : "/admin/explore-quizzes", {
    method: id ? "PATCH" : "POST",
    body: JSON.stringify(body),
  });
export const adminDeleteQuiz = (id: string) =>
  request<{ success: boolean }>(`/admin/explore-quizzes/${id}`, { method: "DELETE" });
export const adminQuizAttempts = (id: string) =>
  request<{ quiz: { id: string; title: string; passPercent: number }; attempts: QuizAttemptRow[] }>(
    `/admin/explore-quizzes/${id}/attempts`,
  );

// Student
export const listQuizzes = () => request<StudentQuizSummary[]>("/explore-quizzes");
export const takeQuiz = (id: string) => request<TakeQuiz>(`/explore-quizzes/${id}`);
export const submitQuiz = (id: string, answers: Record<string, number | number[]>) =>
  request<QuizResult>(`/explore-quizzes/${id}/attempts`, {
    method: "POST",
    body: JSON.stringify({ answers }),
  });
