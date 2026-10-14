import { apiFetch, ApiError } from "@/lib/api/base-url";

export type CouponStatus = "ACTIVE" | "RESERVED" | "REDEEMED" | "EXPIRED" | "INACTIVE";

export interface AdminCoupon {
  id: string;
  code: string;
  discountPercent: number;
  singleUse: boolean;
  isGenerated: boolean;
  status: CouponStatus;
  usedCount: number;
  usageLimit: number | null;
  expiresAt: string | null;
  description: string | null;
  createdAt: string;
  redeemedAt: string | null;
  redeemedBy: { id: string; name: string; email: string } | null;
  redeemedCourseSlug: string | null;
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
    throw new ApiError(message || `Request failed (${res.status}).`, res.status);
  }
  return (await res.json()) as T;
}

export const fetchAdminCoupons = () => request<AdminCoupon[]>("/coupons/admin");

export const generateCoupon = (input: { discountPercent: number; expiresInDays?: number; description?: string }) =>
  request<{ id: string; code: string }>("/coupons/admin", { method: "POST", body: JSON.stringify(input) });

export const deactivateCoupon = (id: string) =>
  request<unknown>(`/coupons/admin/${id}/deactivate`, { method: "PATCH" });
