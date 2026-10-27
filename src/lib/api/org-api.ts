import { apiFetch, ApiError } from "./base-url";

/* Heads / HODs and managed batches. All permission checks happen on the server;
   these helpers only carry requests and surface its messages. */

export interface Person {
  id: string;
  name: string;
  email: string;
}

export interface HeadSummary extends Person {
  phone: string | null;
  status: string | null;
  createdAt: string;
  instructorCount: number;
  batchCount: number;
  studentCount: number;
}

export interface HeadOverview {
  head: Person & { phone: string | null; status: string | null };
  instructors: (Person & { status: string | null; supervised: boolean })[];
  batches: {
    id: string;
    name: string;
    courseTitle: string | null;
    status: string;
    instructorCount: number;
    studentCount: number;
  }[];
}

export interface InstructorWithHead extends Person {
  status: string | null;
  headId: string | null;
}

export interface ManagedBatch {
  id: string;
  name: string;
  description: string | null;
  courseId: string | null;
  courseTitle: string | null;
  schedule: string | null;
  startDate: string | null;
  endDate: string | null;
  status: "ACTIVE" | "COMPLETED" | "ARCHIVED" | string;
  head: { id: string; name: string; email?: string } | null;
  instructors: { id: string; name: string; email?: string }[];
  studentCount: number;
  instructorCount: number;
  /** Present for admin, head and instructor views; never for students. */
  students?: Person[];
}

export interface BatchInput {
  name?: string;
  description?: string;
  courseId?: string;
  schedule?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  headId?: string;
  addInstructors?: string[];
  addStudents?: string[];
}

export interface BatchAssignInput {
  headId?: string | null;
  addInstructors?: string[];
  removeInstructors?: string[];
  addStudents?: string[];
  removeStudents?: string[];
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

const body = (method: string, data: unknown): RequestInit => ({ method, body: JSON.stringify(data) });

/* Heads */
export const listHeads = () => request<HeadSummary[]>("/admin/heads");
export const createHead = (d: { name: string; email: string; password: string; phone?: string }) =>
  request<Person & { initialPassword: string }>("/admin/heads", body("POST", d));
export const updateHead = (id: string, d: { name?: string; phone?: string; status?: "ACTIVE" | "BLOCKED" }) =>
  request<Person>(`/admin/heads/${id}`, body("PATCH", d));
export const deleteHead = (id: string) => request<{ deleted: boolean }>(`/admin/heads/${id}`, { method: "DELETE" });
export const getHeadOverview = (id: string) => request<HeadOverview>(`/admin/heads/${id}`);
export const setHeadInstructors = (id: string, instructorIds: string[]) =>
  request<{ assigned: number; released: number }>(`/admin/heads/${id}/instructors`, body("PUT", { instructorIds }));
export const listInstructorsWithHead = () => request<InstructorWithHead[]>("/admin/heads/instructors");

/* Batches */
export const listBatches = () => request<ManagedBatch[]>("/batches");
export const getBatch = (id: string) => request<ManagedBatch>(`/batches/${id}`);
export const createBatch = (d: BatchInput) => request<ManagedBatch>("/batches", body("POST", d));
export const updateBatch = (id: string, d: BatchInput) => request<ManagedBatch>(`/batches/${id}`, body("PATCH", d));
export const deleteBatch = (id: string) => request<{ success: true }>(`/batches/${id}`, { method: "DELETE" });
export const assignBatch = (id: string, d: BatchAssignInput) =>
  request<{ batch: ManagedBatch; skipped: { id: string; reason: string }[] }>(`/batches/${id}/assign`, body("POST", d));
export const fetchCandidateStudents = (id: string, search?: string) =>
  request<(Person & { alreadyAssigned: boolean })[]>(
    `/batches/${id}/candidate-students${search?.trim() ? `?search=${encodeURIComponent(search.trim())}` : ""}`,
  );

/** The signed-in head's own overview (instructors they supervise and their batches). */
export const getMyHeadOverview = () => request<HeadOverview>("/batches/head/overview");
