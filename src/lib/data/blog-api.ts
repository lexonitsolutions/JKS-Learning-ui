import { API_BASE_URL, apiFetch, ApiError } from "@/lib/api/base-url";

export type BlogStatus = "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface BlogCard {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  authorName: string | null;
  tags: string[];
  status: BlogStatus;
  readingMinutes: number;
  publishedAt: string | null;
  scheduledAt: string | null;
  createdAt: string;
  updatedAt: string;
  category: { id: string; name: string; slug: string } | null;
  seoTitle: string | null;
  seoDescription: string | null;
}

export interface BlogArticle extends BlogCard {
  content: string;
  authorId: string;
  categoryId: string | null;
}

export interface BlogPage {
  items: BlogCard[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ── Public (used by server components; revalidated, never authenticated) ──────

async function publicGet<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, { next: { revalidate: 60 } });
    if (res.status === 404) return null;
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export function fetchBlogPage(p: { q?: string; category?: string; tag?: string; page?: number }) {
  const sp = new URLSearchParams();
  if (p.q) sp.set("q", p.q);
  if (p.category) sp.set("category", p.category);
  if (p.tag) sp.set("tag", p.tag);
  if (p.page && p.page > 1) sp.set("page", String(p.page));
  sp.set("pageSize", "9");
  return publicGet<BlogPage>(`/blog/articles?${sp}`);
}

export const fetchBlogArticle = (slug: string) =>
  publicGet<BlogArticle & { related: BlogCard[] }>(`/blog/articles/${encodeURIComponent(slug)}`);

export const fetchBlogCategories = () =>
  publicGet<(BlogCategory & { count: number })[]>("/blog/categories");

export const fetchBlogSlugs = () => publicGet<{ slug: string; updatedAt: string }[]>("/blog/articles-slugs");

// ── Admin ─────────────────────────────────────────────────────────────────────

export interface ArticleInput {
  title: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverImageUrl?: string;
  coverImageAlt?: string;
  authorId?: string;
  categoryId?: string;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
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

const qs = (p: Record<string, string | number | undefined>) => {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(p)) if (v !== undefined && v !== "") sp.set(k, String(v));
  const s = sp.toString();
  return s ? `?${s}` : "";
};

export const adminListArticles = (p: { q?: string; status?: string; categoryId?: string; page?: number }) =>
  request<BlogPage & { counts: Record<string, number> }>(`/admin/blog/articles${qs({ ...p, pageSize: 25 })}`);
export const adminGetArticle = (id: string) => request<BlogArticle>(`/admin/blog/articles/${id}`);
export const adminSaveArticle = (id: string | null, body: ArticleInput) =>
  request<BlogArticle>(id ? `/admin/blog/articles/${id}` : "/admin/blog/articles", {
    method: id ? "PUT" : "POST",
    body: JSON.stringify(body),
  });
export const adminArticleAction = (id: string, action: "publish" | "unpublish" | "archive") =>
  request<BlogArticle>(`/admin/blog/articles/${id}/${action}`, { method: "POST" });
export const adminScheduleArticle = (id: string, scheduledAt: string) =>
  request<BlogArticle>(`/admin/blog/articles/${id}/schedule`, {
    method: "POST",
    body: JSON.stringify({ scheduledAt }),
  });
export const adminDeleteArticle = (id: string) =>
  request<{ deleted: boolean }>(`/admin/blog/articles/${id}`, { method: "DELETE" });
export const adminPreviewHtml = (content: string) =>
  request<{ html: string }>("/admin/blog/preview", { method: "POST", body: JSON.stringify({ content }) });
export const adminBlogAuthors = () =>
  request<{ id: string; name: string; role: string }[]>("/admin/blog/authors");

export interface AdminCategory extends BlogCategory {
  sortOrder: number;
  articleCount: number;
}
export const adminBlogCategories = () => request<AdminCategory[]>("/admin/blog/categories");
export const adminSaveCategory = (
  id: string | null,
  body: { name: string; description?: string; sortOrder?: number },
) =>
  request<BlogCategory>(id ? `/admin/blog/categories/${id}` : "/admin/blog/categories", {
    method: id ? "PUT" : "POST",
    body: JSON.stringify(body),
  });
export const adminDeleteCategory = (id: string) =>
  request<{ deleted: boolean }>(`/admin/blog/categories/${id}`, { method: "DELETE" });
export const adminBlogTags = () => request<{ tag: string; count: number }[]>("/admin/blog/tags");
export const adminRenameTag = (tag: string, to: string) =>
  request<{ updated: number }>(`/admin/blog/tags/${encodeURIComponent(tag)}`, {
    method: "PUT",
    body: JSON.stringify({ to }),
  });
export const adminDeleteTag = (tag: string) =>
  request<{ updated: number }>(`/admin/blog/tags/${encodeURIComponent(tag)}`, { method: "DELETE" });
