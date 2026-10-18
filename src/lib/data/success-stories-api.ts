import { API_BASE_URL, ApiError, apiFetch } from "@/lib/api/base-url";

// ── Types (mirror backend/src/modules/success-stories) ───────────────────────

export type StoryVideo =
  | { kind: "bunny"; embedUrl: string; inlineEmbedUrl: string; durationSeconds: number | null; durationLabel: string | null }
  | { kind: "file"; src: string; durationSeconds: number | null; durationLabel: string | null }
  | { kind: "embed"; embedUrl: string; durationSeconds: number | null; durationLabel: string | null };

export interface PublicStory {
  id: string;
  studentName: string;
  studentPhotoUrl: string | null;
  title: string;
  summary: string | null;
  testimonial: string | null;
  course: string | null;
  technologies: string[];
  previousBackground: string | null;
  currentRole: string | null;
  company: string | null;
  achievementCategory: string | null;
  profileUrl: string | null;
  completionYear: number | null;
  achievedAt: string | null;
  featured: boolean;
  inlineAutoplay: boolean;
  thumbnailUrl: string | null;
  video: StoryVideo | null;
  publishedAt: string | null;
}

export type StoryStatus = "DRAFT" | "PUBLISHED";

export interface AdminStory extends PublicStory {
  bunnyVideoId: string | null;
  videoUrl: string | null;
  rawThumbnailUrl: string | null;
  videoDurationSeconds: number | null;
  sortOrder: number;
  status: StoryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface StoriesPage<T = PublicStory> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface FacetOption {
  value: string;
  count: number;
}

export interface StoryFacets {
  total: number;
  courses: FacetOption[];
  technologies: FacetOption[];
  categories: FacetOption[];
  types: { video: number; written: number };
}

export interface StoryFilters {
  q?: string;
  course?: string;
  technology?: string;
  category?: string;
  type?: "video" | "written";
}

const qs = (p: Record<string, string | number | undefined>) => {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(p)) if (v !== undefined && v !== "") sp.set(k, String(v));
  const s = sp.toString();
  return s ? `?${s}` : "";
};

// ── Public reads ─────────────────────────────────────────────────────────────

/** Server-side friendly: resolves null instead of throwing so the page can render a retryable state. */
async function publicGet<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, init);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

const REVALIDATE = { next: { revalidate: 60 } } as RequestInit;

export const fetchFeaturedStory = () => publicGet<PublicStory | null>("/success-stories/featured", REVALIDATE);
export const fetchStoryFacets = () => publicGet<StoryFacets>("/success-stories/facets", REVALIDATE);
export const fetchStoriesPage = (f: StoryFilters & { page?: number; pageSize?: number }) =>
  publicGet<StoriesPage>(`/success-stories${qs({ ...f, pageSize: f.pageSize ?? 12 })}`, REVALIDATE);

/** Client-side filtering: throws so the UI can show an error + retry. */
export async function queryStories(
  f: StoryFilters & { page?: number; pageSize?: number },
  signal?: AbortSignal,
): Promise<StoriesPage> {
  const res = await fetch(`${API_BASE_URL}/success-stories${qs({ ...f, pageSize: f.pageSize ?? 12 })}`, { signal });
  if (!res.ok) throw new ApiError(`Could not load stories (${res.status}).`, res.status);
  return (await res.json()) as StoriesPage;
}

// ── Admin ────────────────────────────────────────────────────────────────────

export interface StoryInput {
  studentName: string;
  title: string;
  studentPhotoUrl?: string;
  summary?: string;
  testimonial?: string;
  course?: string;
  technologies?: string[];
  previousBackground?: string;
  currentRole?: string;
  company?: string;
  achievementCategory?: string;
  profileUrl?: string;
  completionYear?: number;
  achievedAt?: string;
  bunnyVideoId?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  videoDurationSeconds?: number;
  featured?: boolean;
  inlineAutoplay?: boolean;
  sortOrder?: number;
  status?: StoryStatus;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const res = await apiFetch(path, { ...init, headers, cache: "no-store" });
  if (!res.ok) {
    let message = "";
    try {
      const body = await res.json();
      message = Array.isArray(body?.message) ? body.message.join(" ") : (body?.message ?? "");
    } catch {
      /* non-JSON error body */
    }
    if (res.status === 401) message = message || "Please sign in again.";
    if (res.status === 403) message = message || "You do not have permission to do that.";
    throw new ApiError(message || `Request failed (${res.status}).`, res.status);
  }
  return (await res.json()) as T;
}

export const adminListStories = (p: { q?: string; status?: StoryStatus; page?: number }) =>
  request<StoriesPage<AdminStory> & { counts: { DRAFT: number; PUBLISHED: number; ALL: number } }>(
    `/admin/success-stories${qs({ ...p, pageSize: 100 })}`,
  );
export const adminGetStory = (id: string) => request<AdminStory>(`/admin/success-stories/${id}`);
export const adminSaveStory = (id: string | null, body: StoryInput) =>
  request<AdminStory>(id ? `/admin/success-stories/${id}` : "/admin/success-stories", {
    method: id ? "PUT" : "POST",
    body: JSON.stringify(body),
  });
export const adminStoryAction = (id: string, action: "publish" | "unpublish" | "feature" | "unfeature") =>
  request<AdminStory>(`/admin/success-stories/${id}/${action}`, { method: "POST" });
export const adminDeleteStory = (id: string) =>
  request<{ deleted: boolean; mediaDeleted: boolean }>(`/admin/success-stories/${id}`, { method: "DELETE" });
export const adminReorderStories = (ids: string[]) =>
  request<{ reordered: number }>("/admin/success-stories/reorder", { method: "POST", body: JSON.stringify({ ids }) });

export interface TusTicket {
  videoId: string;
  libraryId: string;
  signature: string;
  expire: number;
  tusEndpoint: string;
}
export const adminCreateUploadTicket = (title: string) =>
  request<TusTicket>("/admin/success-stories/video-upload-ticket", { method: "POST", body: JSON.stringify({ title }) });
export const adminVideoStatus = (videoId: string) =>
  request<{ videoId: string; status: string; ready: boolean; durationSeconds: number; thumbnailUrl: string }>(
    `/admin/success-stories/video-status/${encodeURIComponent(videoId)}`,
  );
