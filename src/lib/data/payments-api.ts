import { apiFetch, ApiError } from "@/lib/api/base-url";

export interface AdminFinancialOverview {
  totalAgreedFeesRupees: number;
  totalVerifiedPaymentsRupees: number;
  totalOutstandingRupees: number;
  fullyPaidCount: number;
  partiallyPaidCount: number;
  pendingCount: number;
  overdueInstallmentsCount: number;
  pendingReferralsCount: number;
  activeCouponsCount: number;
  totalEnrollmentsCount: number;
}

export interface StudentFinancialRecord {
  enrollmentId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  batchTiming: string;
  standardFeeRupees: number;
  agreedFeeRupees: number;
  discountRupees: number;
  paidRupees: number;
  outstandingRupees: number;
  feeStatus: "FULL_PAID" | "PARTIAL_PAID" | "PENDING" | "OVERDUE";
  hasOverdueInstallment: boolean;
  enrollmentStatus: string;
  enrolledAt: string;
  hasInstallmentPlan: boolean;
  installmentPlan: {
    id: string;
    numberOfInstallments: number;
    status: string;
    items: {
      id: string;
      number: number;
      amountRupees: number;
      paidRupees: number;
      dueDate: string;
      status: string;
    }[];
  } | null;
  recentPayments: {
    id: string;
    amountRupees: number;
    status: string;
    type: string;
    transactionRef: string;
    notes?: string;
    date: string;
  }[];
  feeAdjustments: {
    id: string;
    reason: string;
    adjustmentCents: number;
    previousAgreedCents: number;
    newAgreedCents: number;
    adjustedByUserId: string;
    adjustedAt: string;
  }[];
}

export interface StudentPersonalSummary {
  totalAgreedRupees: number;
  totalPaidRupees: number;
  outstandingBalanceRupees: number;
  courses: {
    enrollmentId: string;
    courseId: string;
    courseTitle: string;
    courseSlug: string;
    thumbnail?: string;
    standardPriceRupees: number;
    agreedFeeRupees: number;
    discountRupees: number;
    paidRupees: number;
    outstandingBalanceRupees: number;
    feeStatus: "FULL_PAID" | "PARTIAL_PAID" | "PENDING" | "OVERDUE";
    hasInstallmentPlan: boolean;
    installmentPlan: {
      id: string;
      totalRupees: number;
      status: string;
      frequency: string;
      items: {
        id: string;
        installmentNumber: number;
        amountRupees: number;
        paidRupees: number;
        dueDate: string;
        status: string;
      }[];
    } | null;
    payments: {
      id: string;
      amountRupees: number;
      status: string;
      type: string;
      date: string;
      transactionRef: string;
    }[];
  }[];
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

// ── Admin Operations ────────────────────────────────────────────────

export const fetchAdminPaymentOverview = () =>
  request<AdminFinancialOverview>("/payments/admin/overview");

export const fetchStudentsWithFinancials = (params?: {
  courseSlug?: string;
  feeStatus?: string;
  search?: string;
}) => {
  const query = new URLSearchParams();
  if (params?.courseSlug) query.set("courseSlug", params.courseSlug);
  if (params?.feeStatus) query.set("feeStatus", params.feeStatus);
  if (params?.search) query.set("search", params.search);
  const qStr = query.toString();
  return request<StudentFinancialRecord[]>(`/payments/admin/students${qStr ? `?${qStr}` : ""}`);
};

export const recordManualPayment = (data: {
  enrollmentId: string;
  amountCents: number;
  paymentMode: string;
  transactionRef?: string;
  notes?: string;
  installmentItemId?: string;
}) =>
  request<{ payment: any; enrollment: any; invoice: any }>("/payments/admin/manual-payment", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateStudentFee = (data: {
  enrollmentId: string;
  agreedFeeCents: number;
  reason: string;
}) =>
  request<{ success: boolean; enrollment: any }>("/payments/admin/update-student-fee", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const createOrUpdateInstallmentPlan = (data: {
  enrollmentId: string;
  numberOfInstallments: number;
  downPaymentCents?: number;
  frequency?: "MONTHLY" | "BIWEEKLY" | "WEEKLY" | "CUSTOM";
  customSchedule?: {
    installmentNumber: number;
    amountCents: number;
    dueDate: string | Date;
  }[];
}) =>
  request<any>("/payments/admin/installments/plan", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const fetchAllInstallmentPlans = (status?: string) =>
  request<any[]>(`/payments/admin/installments${status ? `?status=${status}` : ""}`);

// ── Student Operations ──────────────────────────────────────────────

export const fetchMyFinancialSummary = () =>
  request<StudentPersonalSummary>("/payments/my-summary");

export const fetchMyInstallmentPlans = () =>
  request<any[]>("/payments/installments/my-plans");

export const createPaymentOrder = (data: {
  courseId: string;
  enrollmentId?: string;
  installmentItemId?: string;
  amountCents?: number;
  couponCode?: string;
  referralCode?: string;
}) =>
  request<any>("/payments/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const calculateFeeBreakdown = (data: {
  courseIdOrSlug: string;
  couponCode?: string;
  referralCode?: string;
  customAgreedFeeCents?: number;
}) =>
  request<{
    standardPriceCents: number;
    customAdjustmentCents: number;
    couponDiscountCents: number;
    couponCodeApplied: string | null;
    referralDiscountCents: number;
    referralCodeApplied: string | null;
    totalDiscountCents: number;
    finalAgreedFeeCents: number;
    verifiedPaymentsReceivedCents: number;
    outstandingBalanceCents: number;
    feeStatus: string;
    notes: string[];
  }>("/payments/calculate-fee", {
    method: "POST",
    body: JSON.stringify(data),
  });
