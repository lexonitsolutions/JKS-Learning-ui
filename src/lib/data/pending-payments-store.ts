"use client";

import { recordManualPayment } from "./payments-api";
import { createInvoice } from "./invoices-store";

export interface PendingPaymentSubmission {
  id: string;
  enrollmentId: string;
  courseId?: string;
  courseSlug: string;
  courseTitle: string;
  installmentItemId?: string;
  installmentNumber?: number;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  amountRupees: number;
  paymentMode: "UPI" | "BANK_TRANSFER" | "CARD" | "CASH";
  transactionRef: string;
  notes?: string;
  status: "PENDING_APPROVAL" | "APPROVED" | "REJECTED";
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

const STORAGE_KEY = "jks_pending_installment_payments";

export function getPendingPayments(): PendingPaymentSubmission[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to parse pending installment payments:", err);
    return [];
  }
}

export function savePendingPayments(list: PendingPaymentSubmission[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error("Failed to save pending installment payments:", err);
  }
}

export function submitPendingPayment(
  data: Omit<PendingPaymentSubmission, "id" | "submittedAt" | "status">
): PendingPaymentSubmission {
  const current = getPendingPayments();
  const newSubmission: PendingPaymentSubmission = {
    ...data,
    id: `PEND-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
    status: "PENDING_APPROVAL",
    submittedAt: new Date().toISOString(),
  };

  // Add to start
  const updated = [newSubmission, ...current];
  savePendingPayments(updated);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("jks_payment_completed"));
    window.dispatchEvent(new Event("jks_enrollment_updated"));
  }

  return newSubmission;
}

export function getPendingPaymentForInstallment(installmentId: string): PendingPaymentSubmission | undefined {
  if (!installmentId) return undefined;
  const list = getPendingPayments();
  return list.find(
    (p) => p.installmentItemId === installmentId && p.status === "PENDING_APPROVAL"
  );
}

export function getPendingPaymentsForStudent(studentEmail: string): PendingPaymentSubmission[] {
  if (!studentEmail) return [];
  const normalized = studentEmail.toLowerCase().trim();
  const list = getPendingPayments();
  return list.filter((p) => p.studentEmail.toLowerCase().trim() === normalized);
}

export async function approvePendingPayment(
  paymentId: string,
  reviewedBy: string = "Admin"
): Promise<boolean> {
  const list = getPendingPayments();
  const itemIndex = list.findIndex((p) => p.id === paymentId);
  if (itemIndex === -1) return false;

  const item = list[itemIndex];

  try {
    // Attempt backend sync
    await recordManualPayment({
      enrollmentId: item.enrollmentId,
      installmentItemId: item.installmentItemId,
      amountCents: Math.round(item.amountRupees * 100),
      paymentMode: item.paymentMode === "UPI" ? "UPI" : item.paymentMode === "BANK_TRANSFER" ? "Bank Transfer" : "Card",
      transactionRef: item.transactionRef,
      notes: `Approved online student submission by ${reviewedBy} (${item.notes || "EMI Installment"})`,
    });
  } catch (err) {
    console.warn("Backend manual payment record warning, updating local invoice and state:", err);
  }

  // Create official invoice in local store
  createInvoice({
    studentName: item.studentName,
    studentEmail: item.studentEmail,
    studentPhone: item.studentPhone || "9876543210",
    courseTitle: item.courseTitle,
    courseSlug: item.courseSlug,
    price: item.amountRupees,
    discount: 0,
    paymentMode: item.paymentMode === "UPI" ? "UPI" : item.paymentMode === "BANK_TRANSFER" ? "Net Banking" : "Credit/Debit Card",
    batchTiming: item.installmentNumber ? `Installment #${item.installmentNumber}` : "Course Fee",
  });

  // Mark approved in pending list
  list[itemIndex] = {
    ...item,
    status: "APPROVED",
    reviewedAt: new Date().toISOString(),
    reviewedBy,
  };
  savePendingPayments(list);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("jks_payment_completed"));
    window.dispatchEvent(new Event("jks_enrollment_updated"));
  }

  return true;
}

export function rejectPendingPayment(
  paymentId: string,
  reason: string,
  reviewedBy: string = "Admin"
): boolean {
  const list = getPendingPayments();
  const itemIndex = list.findIndex((p) => p.id === paymentId);
  if (itemIndex === -1) return false;

  list[itemIndex] = {
    ...list[itemIndex],
    status: "REJECTED",
    rejectionReason: reason,
    reviewedAt: new Date().toISOString(),
    reviewedBy,
  };
  savePendingPayments(list);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("jks_payment_completed"));
    window.dispatchEvent(new Event("jks_enrollment_updated"));
  }

  return true;
}
