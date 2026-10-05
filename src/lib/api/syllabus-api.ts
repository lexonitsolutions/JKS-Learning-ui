import { apiFetch } from "./base-url";

export interface SyllabusModuleItem {
  id?: string;
  title: string;
  order?: number;
  description?: string;
  topics: string[];
}

export interface SyllabusTemplate {
  id: string;
  title: string;
  keyword: string;
  description?: string | null;
  track?: string | null;
  modules: SyllabusModuleItem[];
  sections?: any;
  createdById?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    courses: number;
  };
  courses?: { id: string; title: string; slug: string }[];
}

export async function fetchSyllabusTemplates(search?: string, track?: string): Promise<SyllabusTemplate[]> {
  const params = new URLSearchParams();
  if (search && search.trim()) params.set("search", search.trim());
  if (track && track.trim() && track !== "ALL") params.set("track", track.trim());

  const query = params.toString() ? `?${params.toString()}` : "";
  const res = await apiFetch(`/syllabus/templates${query}`, {
    method: "GET",
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(errorText || `Failed to fetch syllabus templates: ${res.statusText}`);
  }

  return res.json();
}

export async function fetchSyllabusTemplate(idOrKeyword: string): Promise<SyllabusTemplate> {
  const res = await apiFetch(`/syllabus/templates/${encodeURIComponent(idOrKeyword)}`, {
    method: "GET",
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(errorText || `Failed to fetch syllabus template: ${res.statusText}`);
  }

  return res.json();
}

export async function createSyllabusTemplate(data: {
  title: string;
  keyword: string;
  description?: string;
  track?: string;
  modules: SyllabusModuleItem[];
  sections?: any;
}): Promise<SyllabusTemplate> {
  const res = await apiFetch("/syllabus/templates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || `Failed to create syllabus template (${res.status})`);
  }

  return res.json();
}

export async function updateSyllabusTemplate(
  id: string,
  data: Partial<{
    title: string;
    keyword: string;
    description?: string;
    track?: string;
    modules: SyllabusModuleItem[];
    sections?: any;
  }>,
): Promise<SyllabusTemplate> {
  const res = await apiFetch(`/syllabus/templates/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || `Failed to update syllabus template (${res.status})`);
  }

  return res.json();
}

export async function deleteSyllabusTemplate(id: string): Promise<{ success: boolean }> {
  const res = await apiFetch(`/syllabus/templates/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || `Failed to delete syllabus template (${res.status})`);
  }

  return res.json();
}
