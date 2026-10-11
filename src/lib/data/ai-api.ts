import { apiFetch, ApiError } from "@/lib/api/base-url";

/** AI calls can take a few seconds - give them more room than a normal read. */
const AI_TIMEOUT_MS = 90_000;

async function aiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  const res = await apiFetch(path, {
    ...init,
    headers,
    signal: init.signal ?? AbortSignal.timeout(AI_TIMEOUT_MS),
  });

  if (!res.ok) {
    let message = "";
    try {
      const body = await res.json();
      message = Array.isArray(body?.message) ? body.message.join(", ") : body?.message ?? "";
    } catch {
      /* non-JSON error body */
    }
    if (res.status === 401) message = "Your session has expired. Please sign in again.";
    if (res.status === 403) message = message || "You do not have access to this feature.";
    throw new ApiError(message || `The AI service returned an error (${res.status}).`, res.status);
  }
  return (await res.json()) as T;
}

const post = <T>(path: string, body: unknown) =>
  aiRequest<T>(path, { method: "POST", body: JSON.stringify(body) });

/* ── Mock interview ─────────────────────────────────────────────────── */

export type InterviewType = "TECHNICAL" | "SCENARIO" | "HR" | "EXPERIENCE";

export interface InterviewSessionSummary {
  id: string;
  technology: string;
  experience: string;
  type: InterviewType;
  status: "IN_PROGRESS" | "COMPLETED" | "INTERRUPTED";
  startedAt: string;
  completedAt: string | null;
  report?: { overallScore: number; readinessVerdict: string } | null;
}

export interface InterviewReport {
  overallScore: number;
  readinessVerdict: string;
  categoryScores: {
    technicalKnowledge: number;
    problemSolving: number;
    communication: number;
    answerQuality: number;
    confidence: number;
  };
  strengths: string[];
  weaknesses: string[];
  recommendedTopics: string[];
  improvementPlan: string[];
  session: {
    technology: string;
    experience: string;
    type: InterviewType;
    startedAt: string;
    completedAt: string | null;
  };
  answers: { question: string; answer: string; score: number; feedback: string; order: number }[];
}

export const startInterview = (input: { technology: string; experience: string; type: InterviewType }) =>
  post<{ sessionId: string; question: string }>("/ai-interviews", input);

export const submitInterviewAnswer = (sessionId: string, question: string, answer: string) =>
  post<{ question: string }>(`/ai-interviews/${sessionId}/answer`, { question, answer });

export const completeInterview = (sessionId: string) =>
  post<InterviewReport>(`/ai-interviews/${sessionId}/complete`, {});

export const fetchInterviewReport = (sessionId: string) =>
  aiRequest<InterviewReport>(`/ai-interviews/${sessionId}/report`);

export const fetchMyInterviews = () => aiRequest<InterviewSessionSummary[]>("/ai-interviews/me");

export const fetchStudentInterviews = (studentUserId: string) =>
  aiRequest<InterviewSessionSummary[]>(`/ai-interviews/admin/student/${studentUserId}`);

/* ── Resume ─────────────────────────────────────────────────────────── */

export interface ResumeAnalysis {
  atsScore: number;
  formattingScore: number;
  impactScore: number;
  keywordScore: number;
  jobMatchScore?: number;
  missingKeywords: string[];
  matchedKeywords: string[];
  strengths: string[];
  criticalFixes: string[];
  bulletEnhancements: {
    id: string;
    section: string;
    originalBullet: string;
    enhancedBullet: string;
    reason: string;
  }[];
}

export const analyzeResume = (resumeData: unknown, targetJobDescription?: string) =>
  post<ResumeAnalysis>("/ai/resume/analyze", { resumeData, targetJobDescription: targetJobDescription || undefined });

export const enhanceResumeBullet = (input: {
  originalBullet: string;
  roleOrProjectContext?: string;
  targetSkill?: string;
}) => post<{ enhancedBullet: string; explanation: string }>("/ai/resume/enhance-bullet", input);

/* ── Course copilot ─────────────────────────────────────────────────── */

export interface CopilotAnswer {
  answer: string;
  foundInCourseMaterial: boolean;
  citations: { title: string; sourceType: string; snippet: string }[];
}

export const askCourseCopilot = (input: {
  question: string;
  courseId: string;
  lessonId?: string;
  conversationHistory?: { role: "user" | "assistant"; content: string }[];
}) => post<CopilotAnswer>("/ai/course-copilot/ask", input);

/* ── Staff AI tools ─────────────────────────────────────────────────── */

export interface GeneratedQuestion {
  id: string;
  type: "MCQ" | "SHORT_ANSWER" | "CODING";
  question: string;
  marks: number;
  options?: string[];
  correctAnswer?: string;
  explanation: string;
  expectedConcepts?: string[];
  starterCode?: string;
}

export const generateQuizQuestions = (input: {
  courseTitle: string;
  topic: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  mcqCount: number;
  shortAnswerCount: number;
  codingCount: number;
}) =>
  post<{ questions: GeneratedQuestion[] }>("/admin/ai/quiz/generate", {
    ...input,
    totalQuestions: input.mcqCount + input.shortAnswerCount + input.codingCount,
  });

export interface GeneratedCurriculum {
  courseTitle: string;
  targetAudience: string;
  durationWeeks: number;
  modules: {
    title: string;
    description: string;
    lessons: { title: string; contentType: string; durationMinutes: number }[];
  }[];
}

export const generateCurriculum = (input: { courseTitle: string; targetAudience: string; durationWeeks: number }) =>
  post<GeneratedCurriculum>("/admin/ai/curriculum/generate", input);

export interface AiHealth {
  timestamp: string;
  overallStatus: "OPERATIONAL" | "DEGRADED";
  providers: { provider: string; status: string; latencyMs: number; model?: string; error?: string | null }[];
}

export const fetchAiHealth = () => aiRequest<AiHealth>("/admin/ai/health");

export interface AiUsage {
  requestsToday: number;
  requestsThisMonth: number;
  failedRequests: number;
  errorRatePercent: number;
  fallbackUsageCount: number;
  fallbackRatePercent: number;
  totalTokensThisMonth: number;
  averageLatencyMs: number;
  featureBreakdown: { feature: string; count: number }[];
}

export const fetchAiUsage = () => aiRequest<AiUsage>("/admin/ai/usage");
