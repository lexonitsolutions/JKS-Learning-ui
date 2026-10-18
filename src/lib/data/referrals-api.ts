import { apiFetch, ApiError } from "@/lib/api/base-url";

export interface ReferralCodeInfo {
  code: string;
  referralLink: string;
  totalReferrals: number;
  totalSuccessfulEnrollments: number;
  totalRewardEarnedRupees: number;
  totalRewardPaidRupees: number;
  campaign: {
    title: string;
    referrerRewardType: string;
    referrerRewardValue: number;
    refereeDiscountType: string;
    refereeDiscountValue: number;
  } | null;
}

export interface StudentReferralStats extends ReferralCodeInfo {
  pendingRewardsRupees: number;
  approvedRewardsRupees: number;
  paidOutRewardsRupees: number;
  referralHistory: {
    id: string;
    friendName: string;
    courseTitle: string;
    rewardAmount: number;
    refereeDiscount: number;
    status: string;
    payoutStatus: string;
    createdAt: string;
    approvedAt: string | null;
  }[];
}

export interface ReferralValidationResult {
  valid: boolean;
  code: string;
  referrerName: string;
  refereeDiscountType: string;
  refereeDiscountValue: number;
  message: string;
}

export interface AdminReferralCampaign {
  id: string;
  title: string;
  description: string | null;
  referrerRewardType: string;
  referrerRewardValue: number;
  refereeDiscountType: string;
  refereeDiscountValue: number;
  eligibleCourseSlugs: string[];
  minEnrollmentAmountCents: number;
  requiresAdminApproval: boolean;
  maxTotalRewards: number | null;
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  _count?: { referralCodes: number };
}

export interface AdminReferralReward {
  id: string;
  rewardAmountCents: number;
  refereeDiscountCents: number;
  status: string; // PENDING_APPROVAL, APPROVED, REJECTED, PAID_OUT
  payoutStatus: string; // UNPAID, CREDITED, PAID_OUT
  approvedAt: string | null;
  rejectionReason: string | null;
  paidOutAt: string | null;
  payoutReference: string | null;
  createdAt: string;
  referrerUser: { id: string; name: string; email: string; phone: string | null };
  refereeUser: { id: string; name: string; email: string; phone: string | null };
  course: { id: string; title: string; slug: string };
  enrollment?: { id: string; agreedFeeCents: number; paidAmountCents: number };
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
    } catch {}
    throw new ApiError(message || `Request failed (${res.status}).`, res.status);
  }
  return (await res.json()) as T;
}

// ── Student Endpoints ────────────────────────────────────────────────

export const fetchMyReferralCode = () =>
  request<ReferralCodeInfo>("/referrals/my-code");

export const fetchMyReferralStats = () =>
  request<StudentReferralStats>("/referrals/my-stats");

export const validateReferralCode = (code: string, courseSlug?: string) =>
  request<ReferralValidationResult>(
    `/referrals/validate?code=${encodeURIComponent(code)}${courseSlug ? `&courseSlug=${encodeURIComponent(courseSlug)}` : ""}`,
  );

// ── Admin Endpoints ──────────────────────────────────────────────────

export const fetchAdminReferralCampaigns = () =>
  request<AdminReferralCampaign[]>("/referrals/admin/campaigns");

export const createReferralCampaign = (data: Partial<AdminReferralCampaign>) =>
  request<AdminReferralCampaign>("/referrals/admin/campaigns", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateReferralCampaign = (id: string, data: Partial<AdminReferralCampaign>) =>
  request<AdminReferralCampaign>(`/referrals/admin/campaigns/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const fetchAdminReferralRewards = (params?: {
  status?: string;
  courseId?: string;
  search?: string;
}) => {
  const query = new URLSearchParams();
  if (params?.status) query.set("status", params.status);
  if (params?.courseId) query.set("courseId", params.courseId);
  if (params?.search) query.set("search", params.search);
  const qStr = query.toString();
  return request<AdminReferralReward[]>(`/referrals/admin/rewards${qStr ? `?${qStr}` : ""}`);
};

export const approveReferralReward = (rewardId: string) =>
  request<any>(`/referrals/admin/rewards/${rewardId}/approve`, {
    method: "POST",
  });

export const rejectReferralReward = (rewardId: string, reason: string) =>
  request<any>(`/referrals/admin/rewards/${rewardId}/reject`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });

export const recordReferralPayout = (rewardId: string, payoutReference: string) =>
  request<any>(`/referrals/admin/rewards/${rewardId}/payout`, {
    method: "POST",
    body: JSON.stringify({ payoutReference }),
  });
