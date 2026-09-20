import { apiFetch } from "@/lib/api/base-url";

export interface TaskQuestion {
  id: string;
  type: "SHORT_ANSWER" | "LONG_ANSWER" | "MCQ" | "FILE_UPLOAD";
  prompt: string;
  modelAnswer?: string;
  choices?: string[];
  correctAnswer?: number;
  maxPoints?: number;
}

export interface TaskSubmissionData {
  submittedAt: string;
  answers: Record<string, any>;
  uploadedFileName?: string;
  uploadedFileUrl?: string;
  score?: number;
  feedback?: string;
  evaluatedAt?: string;
}

export interface IndividualTask {
  id: string;
  title: string;
  description: string;
  instructions?: string;
  courseId?: string;
  courseTitle?: string;
  assignedStudentId?: string;
  assignedStudentEmail: string;
  dueDate?: string;
  requiredFiles?: string;
  questions?: TaskQuestion[];
  status: "PENDING" | "SUBMITTED" | "REVIEWED" | "COMPLETED" | "OVERDUE";
  submission?: TaskSubmissionData;
  createdById?: string;
  createdAt: string;
  updatedAt?: string;
}

export async function fetchAdminTasks(): Promise<IndividualTask[]> {
  try {
    const res = await apiFetch("/admin/tasks", {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch (err) {
    console.warn("Failed to fetch admin tasks from backend:", err);
  }
  return [];
}

export async function createAdminTask(payload: {
  title: string;
  description: string;
  instructions?: string;
  courseId?: string;
  courseTitle?: string;
  assignedStudentEmail: string;
  dueDate?: string;
  requiredFiles?: string;
  questions?: TaskQuestion[];
}): Promise<{ success: boolean; data?: IndividualTask; error?: string }> {
  try {
    const res = await apiFetch("/admin/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, data };
    }
    const errData = await res.json().catch(() => ({}));
    return { success: false, error: errData.message || "Failed to create task" };
  } catch (err: any) {
    return { success: false, error: err?.message || "Network error creating task" };
  }
}

export async function reviewTaskSubmission(
  taskId: string,
  payload: { score: number; feedback: string }
): Promise<{ success: boolean; data?: IndividualTask; error?: string }> {
  try {
    const res = await apiFetch(`/admin/tasks/${encodeURIComponent(taskId)}/review`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, data };
    }
    const errData = await res.json().catch(() => ({}));
    return { success: false, error: errData.message || "Failed to review task" };
  } catch (err: any) {
    return { success: false, error: err?.message || "Network error reviewing task" };
  }
}

export async function fetchStudentAssignedTasks(studentEmail: string): Promise<IndividualTask[]> {
  try {
    const res = await apiFetch(`/assessments/tasks/student/${encodeURIComponent(studentEmail)}`, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch (err) {
    console.warn("Failed to fetch student assigned tasks:", err);
  }
  return [];
}

export async function submitStudentTask(
  taskId: string,
  payload: {
    studentEmail: string;
    answers: Record<string, any>;
    uploadedFileName?: string;
    uploadedFileUrl?: string;
  }
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const res = await apiFetch(`/assessments/tasks/${encodeURIComponent(taskId)}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, data };
    }
    const errData = await res.json().catch(() => ({}));
    return { success: false, error: errData.message || "Failed to submit task" };
  } catch (err: any) {
    return { success: false, error: err?.message || "Network error submitting task" };
  }
}
