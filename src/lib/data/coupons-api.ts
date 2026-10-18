import { apiFetch, ApiError } from "@/lib/api/base-url";

export type CouponStatus = "ACTIVE" | "RESERVED" | "REDEEMED" | "EXPIRED" | "INACTIVE";

export interface AdminCoupon {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  discountPercent: number;
  minPurchaseCents?: number;
  maxDiscountCents?: number | null;
  singleUse: boolean;
  isGenerated: boolean;
  canCombineWithReferral: boolean;
  status: CouponStatus;
  isActive: boolean;
  usedCount: number;
  usageLimit: number | null;
  perStudentLimit: number;
  startDate?: string | null;
  expiresAt: string | null;
  description: string | null;
  applicableCourseSlugs: string[];
  allowedStudentEmails: string[];
  createdAt: string;
  redeemedAt: string | null;
  redeemedBy: { id: string; name: string; email: string } | null;
  redeemedCourseSlug: string | null;
}

export interface CreateCouponInput {
  code?: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minPurchaseCents?: number | null;
  maxDiscountCents?: number | null;
  startDate?: string | null;
  expiresAt?: string | null;
  expiresInDays?: number;
  usageLimit?: number | null;
  perStudentLimit?: number;
  canCombineWithReferral?: boolean;
  singleUse?: boolean;
  description?: string;
  courseSlugs?: string[];
  allowedStudentEmails?: string[];
}

export interface UpdateCouponInput {
  discountType?: "PERCENTAGE" | "FIXED";
  discountValue?: number;
  minPurchaseCents?: number | null;
  maxDiscountCents?: number | null;
  startDate?: string | null;
  expiresAt?: string | null;
  usageLimit?: number | null;
  perStudentLimit?: number;
  canCombineWithReferral?: boolean;
  isActive?: boolean;
  description?: string;
  courseSlugs?: string[];
  allowedStudentEmails?: string[];
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

export const createAdminCoupon = (input: CreateCouponInput) =>
  request<AdminCoupon>("/coupons/admin", { method: "POST", body: JSON.stringify(input) });

export const generateCoupon = (input: { discountPercent: number; expiresInDays?: number; description?: string }) =>
  request<{ id: string; code: string }>("/coupons/admin/generate", { method: "POST", body: JSON.stringify(input) });

export const updateAdminCoupon = (id: string, input: UpdateCouponInput) =>
  request<AdminCoupon>(`/coupons/admin/${id}`, { method: "PATCH", body: JSON.stringify(input) });

export const activateCoupon = (id: string) =>
  request<AdminCoupon>(`/coupons/admin/${id}/activate`, { method: "PATCH" });

export const deactivateCoupon = (id: string) =>
  request<AdminCoupon>(`/coupons/admin/${id}/deactivate`, { method: "PATCH" });

export const deleteCoupon = (id: string) =>
  request<{ success: boolean }>(`/coupons/admin/${id}`, { method: "DELETE" });
