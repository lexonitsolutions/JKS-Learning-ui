import { apiFetch, ApiError } from "@/lib/api/base-url";

/** Same shape as the resume builder's data, without the client-side item ids. */
export interface ResumeContent {
  personal: {
    fullName: string;
    headline: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    portfolio: string;
    summary: string;
  };
  skills: { languages: string; frameworks: string; databases: string; cloudDevOps: string; coreCS: string };
  experiences: { role: string; company: string; location: string; startDate: string; endDate: string; points: string[] }[];
  projects: { title: string; techStack: string; liveUrl?: string; points: string[] }[];
  educations: { degree: string; institution: string; location?: string; year: string; score: string }[];
  certifications: { title: string; issuer: string; year: string }[];
}

export type PersonalField = keyof ResumeContent["personal"];

export interface ResumeImportResult {
  file: { kind: string; characters: number; pages?: number; truncated: boolean };
  aiParsed: boolean;
  imported: ResumeContent;
  platform: { certificates: number; completedCourses: number; technologies: number };
  merged: ResumeContent;
  report: {
    added: Record<"experiences" | "projects" | "educations" | "certifications" | "skills", number>;
    duplicatesSkipped: number;
    conflicts: { field: PersonalField; current: string; imported: string }[];
    filledFromDocument: string[];
    filledFromProfile: string[];
  };
  dropped: string[];
  warnings: string[];
}

export const RESUME_ACCEPT = ".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain";
export const RESUME_MAX_BYTES = 5 * 1024 * 1024;

/** Uploads a resume file; the server reads it and returns it merged with the learner's real profile data. */
export async function importResumeFile(file: File, current: ResumeContent): Promise<ResumeImportResult> {
  const form = new FormData();
  form.append("file", file);
  form.append("current", JSON.stringify(current));
  // No Content-Type header: the browser must add the multipart boundary itself.
  const res = await apiFetch("/ai/resume/import", { method: "POST", body: form, signal: AbortSignal.timeout(120_000) });
  if (!res.ok) {
    let message = "";
    try {
      const body = await res.json();
      message = Array.isArray(body?.message) ? body.message.join(", ") : (body?.message ?? "");
    } catch {
      /* not JSON */
    }
    if (res.status === 429) message = "Too many uploads. Please wait a minute and try again.";
    throw new ApiError(message || `The upload failed (${res.status}).`, res.status);
  }
  return (await res.json()) as ResumeImportResult;
}

export interface ResumeSyncResult {
  merged: ResumeContent;
  report: ResumeImportResult["report"];
  platform: ResumeImportResult["platform"];
}

/** Fills the resume from the learner's real account data only (no file). Never overwrites saved values. */
export async function syncResumeProfile(current: ResumeContent): Promise<ResumeSyncResult> {
  const res = await apiFetch("/ai/resume/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ current }),
  });
  if (!res.ok) throw new ApiError(`Could not sync your profile (${res.status}).`, res.status);
  return (await res.json()) as ResumeSyncResult;
}
