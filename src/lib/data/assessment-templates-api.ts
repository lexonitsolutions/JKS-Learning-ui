import { apiFetch, ApiError } from "@/lib/api/base-url";
import type { TaskQuestion } from "./tasks-api";

export interface TemplateSummary {
  id: string;
  title: string;
  description: string | null;
  courseId: string | null;
  courseTitle: string | null;
  topic: string | null;
  difficulty: "EASY" | "MEDIUM" | "HARD" | null;
  questionTypes: string[];
  questionCount: number;
  createdById: string | null;
  createdAt: string;
  updatedAt: string;
  canModify: boolean;
}

export interface TemplateDetail extends TemplateSummary {
  questions: TaskQuestion[];
}

export interface PickableStudent {
  id: string;
  name: string;
  email: string;
  alreadyAssigned: boolean;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const res = await apiFetch(path, { ...init, headers });
  if (!res.ok) {
    let message = "";
    try {
      const body = await res.json();
      message = Array.isArray(body?.message) ? body.message.join(" ") : body?.message ?? "";
    } catch {
      /* non-JSON error body */
    }
    if (res.status === 403) message = message || "You do not have permission to do that.";
    throw new ApiError(message || `Request failed (${res.status}).`, res.status);
  }
  return (await res.json()) as T;
}

export const createTemplate = (input: {
  title: string;
  description?: string;
  courseId?: string;
  courseTitle?: string;
  topic?: string;
  difficulty?: "EASY" | "MEDIUM" | "HARD";
  questions: TaskQuestion[];
}) => request<TemplateDetail>("/assessment-templates", { method: "POST", body: JSON.stringify(input) });

export const listTemplates = () => request<TemplateSummary[]>("/assessment-templates");

export const getTemplate = (id: string) => request<TemplateDetail>(`/assessment-templates/${id}`);

export const updateTemplate = (id: string, patch: { title?: string; description?: string }) =>
  request<TemplateSummary>(`/assessment-templates/${id}`, { method: "PATCH", body: JSON.stringify(patch) });

export const deleteTemplate = (id: string) =>
  request<{ success: true }>(`/assessment-templates/${id}`, { method: "DELETE" });

export const fetchTemplateStudents = (id: string, search?: string, title?: string) => {
  const q = new URLSearchParams();
  if (search?.trim()) q.set("search", search.trim());
  if (title?.trim()) q.set("title", title.trim());
  const qs = q.toString();
  return request<PickableStudent[]>(`/assessment-templates/${id}/eligible-students${qs ? `?${qs}` : ""}`);
};

export const assignTemplate = (id: string, input: { studentIds: string[]; title?: string; dueDate?: string }) =>
  request<{ assigned: number; skipped: { id: string; reason: string }[] }>(`/assessment-templates/${id}/assign`, {
    method: "POST",
    body: JSON.stringify(input),
  });
