import { apiFetch, ApiError } from "@/lib/api/base-url";

/** Jobs Portal: student access, protected listing, and admin management. */

export type JobsAccessState = "NOT_REQUESTED" | "PENDING" | "APPROVED" | "REJECTED" | "REVOKED";
export type JobStatus = "DRAFT" | "PUBLISHED" | "EXPIRED" | "ARCHIVED";
export type EmploymentType = "FULL_TIME" | "PART_TIME" | "INTERNSHIP" | "CONTRACT" | "FREELANCE";
export type ExperienceLevel = "FRESHER" | "JUNIOR" | "MID" | "SENIOR";
export type WorkMode = "REMOTE" | "HYBRID" | "ONSITE";
export type SourcePlatform = "WHATSAPP" | "TELEGRAM" | "WEBSITE" | "OTHER";
export type ApplicationMode = "EXTERNAL" | "JKS_DIRECT";

export interface JobsAccessView {
  status: JobsAccessState;
  canAccess: boolean;
  canRequest: boolean;
  retryAt: string | null;
  message: string | null;
  reviewNote: string | null;
  requestedAt: string | null;
  decidedAt: string | null;
}

export interface Job {
  id: string;
  title: string;
  companyName: string;
  companyLogoUrl: string | null;
  category: string;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  experienceText: string | null;
  qualifications: string[];
  skills: string[];
  location: string | null;
  workMode: WorkMode;
  salaryText: string | null;
  description: string;
  responsibilities: string[];
  eligibility: string[];
  applicationInstructions: string | null;
  applicationMode: ApplicationMode;
  applyUrl: string | null;
  sourcePlatform: SourcePlatform;
  sourceUrl: string | null;
  status: JobStatus;
  featured: boolean;
  postedAt: string | null;
  deadline: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  isExpired: boolean;
  /** Admin responses only. */
  createdByName?: string | null;
}

export interface JobListResponse {
  items: Job[];
  featured: Job[];
  total: number;
  totalOpen: number;
  page: number;
  pageSize: number;
  totalPages: number;
  facets: { categories: string[]; locations: string[] };
}

export interface JobFilters {
  q?: string;
  category?: string;
  employmentType?: EmploymentType;
  experienceLevel?: ExperienceLevel;
  workMode?: WorkMode;
  location?: string;
  includeExpired?: boolean;
  page?: number;
}

export interface AccessRow {
  id: string;
  userId: string;
  status: Exclude<JobsAccessState, "NOT_REQUESTED">;
  message: string | null;
  reviewNote: string | null;
  decidedByName: string | null;
  decidedAt: string | null;
  requestedAt: string;
  requestCount: number;
  student: { id: string; name: string; email: string; phone?: string | null } | null;
}

export interface AccessHistoryRow {
  id: string;
  action: string;
  fromStatus: string | null;
  toStatus: string;
  actorName: string | null;
  reason: string | null;
  createdAt: string;
}

export interface JobInput {
  title: string;
  companyName: string;
  companyLogoUrl?: string;
  category?: string;
  employmentType?: EmploymentType;
  experienceLevel?: ExperienceLevel;
  experienceText?: string;
  qualifications?: string[];
  skills?: string[];
  location?: string;
  workMode?: WorkMode;
  salaryText?: string;
  description?: string;
  responsibilities?: string[];
  eligibility?: string[];
  applicationInstructions?: string;
  applicationMode?: ApplicationMode;
  applyUrl?: string;
  sourcePlatform?: SourcePlatform;
  sourceUrl?: string;
  featured?: boolean;
  postedAt?: string;
  deadline?: string;
  allowDuplicate?: boolean;
}

export class DuplicateJobError extends ApiError {
  constructor(message: string, readonly existingId: string) {
    super(message, 409);
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const res = await apiFetch(path, { ...init, headers, cache: "no-store" });
  if (!res.ok) {
    let message = "";
    let body: { message?: string | string[]; code?: string; existingId?: string } | null = null;
    try {
      body = await res.json();
      message = Array.isArray(body?.message) ? body.message.join(" ") : (body?.message ?? "");
    } catch {
      /* non-JSON error body */
    }
    if (res.status === 409 && body?.code === "DUPLICATE_JOB" && body.existingId) {
      throw new DuplicateJobError(message, body.existingId);
    }
    if (res.status === 401) message = message || "Please sign in again.";
    if (res.status === 403) message = message || "You do not have permission to do that.";
    throw new ApiError(message || `Request failed (${res.status}).`, res.status);
  }
  return (await res.json()) as T;
}

function qs(params: Record<string, string | number | boolean | undefined>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "" && v !== false) sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

// Student
export const getMyJobsAccess = () => request<JobsAccessView>("/jobs/access/me");
export const requestJobsAccess = (message?: string) =>
  request<JobsAccessView>("/jobs/access/request", { method: "POST", body: JSON.stringify({ message }) });
export const listJobs = (f: JobFilters) => request<JobListResponse>(`/jobs${qs({ ...f, pageSize: 12 })}`);
export const getJob = (id: string) => request<Job>(`/jobs/${id}`);

// Admin: access
export const adminListAccess = (p: { status?: string; q?: string; page?: number }) =>
  request<{
    items: AccessRow[];
    total: number;
    page: number;
    pageSize: number;
    counts: Record<string, number>;
  }>(`/admin/jobs-access${qs({ ...p, pageSize: 25 })}`);
export const adminGetAccess = (id: string) =>
  request<AccessRow & { history: AccessHistoryRow[] }>(`/admin/jobs-access/${id}`);
export const adminDecideAccess = (id: string, action: "APPROVE" | "REJECT" | "REVOKE", reason?: string) =>
  request<AccessRow & { history: AccessHistoryRow[] }>(`/admin/jobs-access/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ action, reason }),
  });

// Admin: jobs
export const adminListJobs = (p: { q?: string; status?: string; page?: number }) =>
  request<{ items: Job[]; total: number; page: number; pageSize: number; counts: Record<string, number> }>(
    `/admin/jobs${qs({ ...p, pageSize: 25 })}`,
  );
export const adminGetJob = (id: string) => request<Job>(`/admin/jobs/${id}`);
export const adminSaveJob = (id: string | null, body: JobInput) =>
  request<Job>(id ? `/admin/jobs/${id}` : "/admin/jobs", { method: id ? "PUT" : "POST", body: JSON.stringify(body) });
export const adminJobAction = (id: string, action: "publish" | "draft" | "archive" | "expire") =>
  request<Job>(`/admin/jobs/${id}/${action}`, { method: "POST" });
export const adminFeatureJob = (id: string, featured: boolean) =>
  request<Job>(`/admin/jobs/${id}/feature`, { method: "POST", body: JSON.stringify({ featured }) });
export const adminDeleteJob = (id: string) => request<{ deleted: boolean }>(`/admin/jobs/${id}`, { method: "DELETE" });
export const adminParseAnnouncement = (text: string) =>
  request<{
    fields: Partial<JobInput> & { description: string };
    found: string[];
    warnings: string[];
    duplicates: { id: string; title: string; companyName: string; status: JobStatus }[];
  }>("/admin/jobs/parse", { method: "POST", body: JSON.stringify({ text }) });
