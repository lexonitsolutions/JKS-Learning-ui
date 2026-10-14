import { apiFetch, ApiError } from "@/lib/api/base-url";

export type CodeLanguageId =
  | "javascript"
  | "typescript"
  | "python"
  | "java"
  | "cpp"
  | "csharp"
  | "sql"
  | "abap";

export interface CodeLanguageInfo {
  id: CodeLanguageId;
  label: string;
  /** server = remote executor, browser = in-browser runtime, unavailable = cannot run here */
  runtime: "server" | "browser" | "unavailable";
}

export interface CodeConfig {
  executorConfigured: boolean;
  languages: CodeLanguageInfo[];
}

export interface RunResult {
  status: "ok" | "compile_error" | "runtime_error" | "timeout" | "unavailable";
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timeMs: number;
  message?: string;
}

export interface TestRow {
  index: number;
  hidden: boolean;
  passed: boolean;
  input?: string;
  expectedOutput?: string;
  actualOutput?: string;
  error?: string;
}

export interface TestSuite {
  graded: boolean;
  passed: number;
  total: number;
  results: TestRow[];
  reason?: string;
}

export type TaskRef =
  | { type: "ASSESSMENT_TASK"; taskId: string; questionId: string }
  | { type: "COURSE_TASK"; courseSlug: string; assignmentId: string; questionId: string };

export interface CodeContext {
  ref: TaskRef;
  question: {
    id: string;
    prompt: string;
    language: CodeLanguageId;
    starterCode: string;
    instructions: string | null;
    maxPoints: number | null;
    visibleTests: { input: string; expectedOutput: string }[];
    hasHiddenTests: boolean;
  };
  task: { id: string; title: string; status: string; courseTitle?: string | null; dueDate?: string | null } | null;
  course: { slug: string; title: string } | null;
  returnUrl: string;
  executionAvailable: boolean;
  canSubmit: boolean;
  attempts: number;
  latestSubmission: {
    id: string;
    status: "GRADED" | "PENDING_REVIEW";
    passed: number | null;
    total: number | null;
    attempt: number;
    submittedAt: string;
    code: string;
  } | null;
}

export interface SubmitResult {
  submissionId: string;
  attempt: number;
  status: "GRADED" | "PENDING_REVIEW";
  graded: boolean;
  passed: number | null;
  total: number | null;
  results: TestRow[];
  message: string;
  taskStatus: string | null;
  returnUrl: string;
}

export interface WorkspaceFile {
  name: string;
  content: string;
}

export interface Workspace {
  language: string;
  files: WorkspaceFile[];
  activeFile: string | null;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const res = await apiFetch(path, { ...init, headers });
  if (!res.ok) {
    let message = "";
    try {
      const body = await res.json();
      message = Array.isArray(body?.message) ? body.message.join(", ") : body?.message ?? "";
    } catch {
      /* non-JSON error body */
    }
    if (res.status === 429) message = "You are running code too quickly. Wait a few seconds and try again.";
    throw new ApiError(message || `Request failed (${res.status}).`, res.status);
  }
  // PUT /workspace and others may legitimately return an empty body
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}

const json = (body: unknown): RequestInit => ({ method: "POST", body: JSON.stringify(body) });

export const fetchCodeConfig = () => request<CodeConfig>("/code/config");

export const runCode = (language: CodeLanguageId, code: string, stdin?: string) =>
  request<RunResult>("/code/run", json({ language, code, stdin }));

export function refToQuery(ref: TaskRef): string {
  const p = new URLSearchParams({ type: ref.type, questionId: ref.questionId });
  if (ref.type === "ASSESSMENT_TASK") p.set("taskId", ref.taskId);
  else {
    p.set("courseSlug", ref.courseSlug);
    p.set("assignmentId", ref.assignmentId);
  }
  return p.toString();
}

export const fetchCodeContext = (ref: TaskRef) => request<CodeContext>(`/code/context?${refToQuery(ref)}`);

export const runVisibleTests = (ref: TaskRef, code: string) =>
  request<TestSuite>("/code/run-tests", json({ ...ref, code }));

export const submitCode = (ref: TaskRef, code: string, language?: string) =>
  request<SubmitResult>("/code/submit", json({ ...ref, code, language }));

export const fetchWorkspace = (key: string) =>
  request<Workspace | null>(`/code/workspace?key=${encodeURIComponent(key)}`);

export const saveWorkspace = (key: string, ws: { language: string; files: WorkspaceFile[]; activeFile?: string }) =>
  request<{ ok: true }>("/code/workspace", {
    method: "PUT",
    body: JSON.stringify({ contextKey: key, ...ws }),
  });

export function workspaceKey(ref: TaskRef | null): string {
  if (!ref) return "playground";
  return ref.type === "ASSESSMENT_TASK"
    ? `assessment:${ref.taskId}:${ref.questionId}`
    : `course:${ref.courseSlug}:${ref.assignmentId}:${ref.questionId}`;
}

/** Playground URL for a coding question; everything else is loaded server-side. */
export function playgroundHref(ref: TaskRef): string {
  return `/dashboard/playground?${refToQuery(ref)}`;
}

/** Reads a TaskRef back from the playground URL, or null for the free playground. */
export function refFromSearch(params: URLSearchParams): TaskRef | null {
  const type = params.get("type");
  const questionId = params.get("questionId");
  if (!questionId) return null;
  if (type === "ASSESSMENT_TASK") {
    const taskId = params.get("taskId");
    return taskId ? { type, taskId, questionId } : null;
  }
  if (type === "COURSE_TASK") {
    const courseSlug = params.get("courseSlug");
    const assignmentId = params.get("assignmentId");
    return courseSlug && assignmentId ? { type, courseSlug, assignmentId, questionId } : null;
  }
  return null;
}
