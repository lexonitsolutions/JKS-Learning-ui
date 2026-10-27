import { apiFetch, ApiError } from "./base-url";

/* Staff fee-collection workspace. Authorisation happens on the server; these
   helpers only carry requests and surface its messages. */

export type FollowUpOutcome = "PROMISED_TO_PAY" | "CALL_LATER" | "UNREACHABLE";

export interface StaffSummary {
  totalOverdueRupees: number;
  overdueStudents: number;
  todaysCallQueue: number;
  assignedLeads: number;
  monthlyCollectionsRupees: number;
}

export interface OverdueRow {
  installmentItemId: string;
  installmentNumber: number;
  enrollmentId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string | null;
  courseTitle: string;
  batch: string | null;
  overdueBalanceRupees: number;
  dueDate: string;
  daysOverdue: number;
  lastOutcome: FollowUpOutcome | null;
  lastNotes: string | null;
  lastContactedAt: string | null;
  promisedDate: string | null;
  nextFollowUpAt: string | null;
  inTodaysQueue: boolean;
}

export interface PaymentLinks {
  paymentUrl: string;
  message: string;
  phone: string | null;
  whatsappUrl: string | null;
  smsUrl: string | null;
}

export interface FollowUpInput {
  installmentItemId: string;
  outcome: FollowUpOutcome;
  promisedDate?: string;
  nextFollowUpAt?: string;
  notes?: string;
  channel?: "CALL" | "WHATSAPP" | "SMS";
}

export interface LedgerRow {
  enrollmentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string | null;
  courseTitle: string;
  academicStatus: "ACTIVE" | "COMPLETED" | "DROPPED";
  agreedFeeRupees: number;
  paidRupees: number;
  balanceRupees: number;
  installmentsPaid: number;
  installmentsTotal: number;
  hasOverdue: boolean;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const res = await apiFetch(path, { ...init, headers, cache: "no-store" });
  if (!res.ok) {
    let message = "";
    try {
      const body = await res.json();
      message = Array.isArray(body?.message) ? body.message.join(" ") : body?.message ?? "";
    } catch {
      /* non-JSON error body */
    }
    if (res.status === 403) message = message || "You do not have permission to do that.";
    throw new ApiError(message || `Request failed (${res.status}).`, res.status);
  }
  return (await res.json()) as T;
}

const qs = (params: Record<string, string | undefined>) => {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) q.set(k, v);
  const s = q.toString();
  return s ? `?${s}` : "";
};

export const getStaffSummary = () => request<StaffSummary>("/staff/summary");

export const listOverdue = (opts: { search?: string; queue?: "today" | "all" } = {}) =>
  request<OverdueRow[]>(`/staff/overdue${qs(opts)}`);

export const logFollowUp = (input: FollowUpInput) =>
  request<{ log: { id: string }; links: PaymentLinks }>("/staff/follow-ups", {
    method: "POST",
    body: JSON.stringify(input),
  });

export const getPaymentLinks = (installmentItemId: string) =>
  request<PaymentLinks>(`/staff/payment-link/${encodeURIComponent(installmentItemId)}`);

export const listLedger = (opts: { search?: string; status?: string } = {}) =>
  request<LedgerRow[]>(`/staff/students${qs(opts)}`);
