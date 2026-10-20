import { apiFetch, ApiError } from "@/lib/api/base-url";

export interface SuperAdminAccount {
  id: string;
  name: string;
  email: string;
  status: string | null;
  createdAt: string;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const res = await apiFetch(path, { ...init, headers });
  if (!res.ok) {
    let message = "";
    try {
      const body = await res.json();
      message = Array.isArray(body?.message) ? body.message.join(" ") : (body?.message ?? "");
    } catch {
      /* non-JSON error body */
    }
    if (res.status === 403) message = message || "Only a super admin can manage super admins.";
    throw new ApiError(message || `Request failed (${res.status}).`, res.status);
  }
  return (await res.json()) as T;
}

export const listSuperAdmins = () => request<SuperAdminAccount[]>("/admin/super-admins");

export const createSuperAdmin = (data: { name: string; email: string; password: string }) =>
  request<SuperAdminAccount>("/admin/super-admins", { method: "POST", body: JSON.stringify(data) });

export const setSuperAdminActive = (id: string, active: boolean) =>
  request<SuperAdminAccount>(`/admin/super-admins/${id}/active`, { method: "PATCH", body: JSON.stringify({ active }) });

export const deleteSuperAdmin = (id: string) =>
  request<{ deleted: boolean }>(`/admin/super-admins/${id}`, { method: "DELETE" });

/** The signed-in user's API role (the UI's own "admin" role merges ADMIN and SUPER_ADMIN). */
export async function fetchMyApiRole(): Promise<string | null> {
  try {
    const res = await apiFetch("/auth/me");
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data?.user?.role === "string" ? data.user.role : null;
  } catch {
    return null;
  }
}
