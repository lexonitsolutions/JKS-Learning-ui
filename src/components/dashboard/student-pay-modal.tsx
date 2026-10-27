"use client";

import React, { useState } from "react";
import {
  X,
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Lock,
  Building2,
  Copy,
  Check,
  Clock,
  Info,
} from "lucide-react";
import { formatINR } from "@/lib/utils/format-money";
import { createPaymentOrder } from "@/lib/data/payments-api";
import { createInvoice } from "@/lib/data/invoices-store";
import { submitPendingPayment } from "@/lib/data/pending-payments-store";

interface StudentPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  enrollment: {
    enrollmentId: string;
    courseId?: string;
    courseSlug: string;
    courseTitle: string;
    agreedFeeRupees: number;
    paidRupees: number;
    outstandingBalanceRupees: number;
  } | null;
  installmentItem?: {
    id: string;
    installmentNumber: number;
    amountRupees: number;
    dueDate: string;
  } | null;
  studentName?: string;
  studentEmail?: string;
}

export function StudentPayModal({
  isOpen,
  onClose,
  onSuccess,
  enrollment,
  installmentItem,
  studentName,
  studentEmail,
}: StudentPayModalProps) {
  const [paymentType, setPaymentType] = useState<"INSTALLMENT" | "FULL_BALANCE" | "CUSTOM">(
    installmentItem ? "INSTALLMENT" : "FULL_BALANCE"
  );
  const [customAmount, setCustomAmount] = useState<number>(
    enrollment ? Math.min(5000, enrollment.outstandingBalanceRupees) : 5000
  );
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "BANK_TRANSFER" | "CARD">("UPI");
  const [transactionRef, setTransactionRef] = useState<string>("");
  const [studentRemarks, setStudentRemarks] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{
    amount: number;
    reference: string;
    isPendingApproval: boolean;
    courseTitle: string;
    installmentNumber?: number;
  } | null>(null);

  if (!isOpen || !enrollment) return null;

  const maxPayable = enrollment.outstandingBalanceRupees;
  const targetAmount =
    paymentType === "INSTALLMENT" && installmentItem
      ? installmentItem.amountRupees
      : paymentType === "FULL_BALANCE"
      ? maxPayable
      : customAmount;

  const copyToClipboard = (text: string, field: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (targetAmount <= 0) {
      setError("Payment amount must be greater than ₹0.");
      return;
    }
    if (targetAmount > maxPayable) {
      setError(`Payment cannot exceed outstanding balance of ${formatINR(maxPayable)}.`);
      return;
    }

    // Require transaction reference for manual UPI / Bank Transfer payment
    if (!transactionRef.trim()) {
      setError("Please enter your 12-digit UTR, Transaction ID, or Reference Number.");
      return;
    }

    setIsProcessing(true);
    const cleanRef = transactionRef.trim();

    try {
      // 1. Submit pending payment record requiring admin approval
      submitPendingPayment({
        enrollmentId: enrollment.enrollmentId,
        courseId: enrollment.courseId,
        courseSlug: enrollment.courseSlug,
        courseTitle: enrollment.courseTitle,
        installmentItemId: installmentItem?.id,
        installmentNumber: installmentItem?.installmentNumber,
        studentName: studentName || "Student",
        studentEmail: studentEmail || "student@jkslearning.com",
        amountRupees: targetAmount,
        paymentMode: paymentMethod,
        transactionRef: cleanRef,
        notes: studentRemarks.trim() || undefined,
      });

      // 2. Also register order with backend if available
      try {
        await createPaymentOrder({
          courseId: enrollment.courseId || enrollment.courseSlug,
          enrollmentId: enrollment.enrollmentId,
          installmentItemId: installmentItem?.id,
          amountCents: Math.round(targetAmount * 100),
        });
      } catch (beErr) {
        console.warn("Backend createPaymentOrder note:", beErr);
      }

      setSuccessInfo({
        amount: targetAmount,
        reference: cleanRef,
        isPendingApproval: true,
        courseTitle: enrollment.courseTitle,
        installmentNumber: installmentItem?.installmentNumber,
      });

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("jks_payment_completed"));
        window.dispatchEvent(new Event("jks_enrollment_updated"));
      }

      setTimeout(() => {
        onSuccess();
      }, 2500);
    } catch (err: any) {
      console.error("Payment submission error:", err);
      setError(err?.message || "Failed to submit payment verification request. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={isProcessing ? undefined : onClose} />

      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-surface-elevated text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#1E5EFF] dark:bg-blue-950/60 dark:text-blue-400">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {installmentItem ? `Pay Installment #${installmentItem.installmentNumber}` : "Make Course Fee Payment"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{enrollment.courseTitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {successInfo ? (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 ring-8 ring-amber-50/50">
              <Clock className="h-8 w-8" />
            </div>
            <div className="space-y-1.5">
              <span className="rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                Submitted - Pending Admin Approval
              </span>
              <h4 className="text-xl font-black text-slate-900 dark:text-white pt-2">
                Payment Verification in Progress
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                Your payment of <strong className="text-slate-800 dark:text-slate-200">{formatINR(successInfo.amount)}</strong> has been recorded with transaction reference:
              </p>
              <div className="inline-block rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2 font-mono text-sm font-bold text-slate-900 dark:text-white mt-1 border border-slate-200 dark:border-slate-700">
                {successInfo.reference}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-md mx-auto pt-2">
                Our finance team will verify the payment against your bank/UPI transaction and approve it shortly. Once approved, your installment will show as <strong>PAID</strong> and the official invoice will be available for download.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePay} className="mt-5 space-y-5">
            {/* Payment Summary Header */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-900/40 dark:bg-blue-950/30 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Total Agreed Fee:</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono">
                  {formatINR(enrollment.agreedFeeRupees)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Already Paid:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                  {formatINR(enrollment.paidRupees)}
                </span>
              </div>
              <div className="flex justify-between border-t border-blue-200/60 dark:border-blue-800/60 pt-2 font-bold text-slate-900 dark:text-white">
                <span>Remaining Balance:</span>
                <span className="font-mono text-sm text-[#1E5EFF] dark:text-blue-400 font-extrabold">
                  {formatINR(enrollment.outstandingBalanceRupees)}
                </span>
              </div>
            </div>

            {/* Payment Type Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Payment Allocation:</label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs">
                {installmentItem && (
                  <button
                    type="button"
                    onClick={() => setPaymentType("INSTALLMENT")}
                    className={`rounded-xl border p-3 text-left transition-all cursor-pointer ${
                      paymentType === "INSTALLMENT"
                        ? "border-[#1E5EFF] bg-blue-50/50 text-[#1E5EFF] dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-400 font-bold shadow-xs ring-1 ring-blue-500/30"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-surface-secondary dark:text-slate-300"
                    }`}
                  >
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Installment #{installmentItem.installmentNumber}</div>
                    <div className="font-mono font-bold text-sm mt-0.5">{formatINR(installmentItem.amountRupees)}</div>
                    <div className="text-[10px] text-slate-400 mt-1">Due: {new Date(installmentItem.dueDate).toLocaleDateString("en-IN")}</div>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setPaymentType("FULL_BALANCE")}
                  className={`rounded-xl border p-3 text-left transition-all cursor-pointer ${
                    paymentType === "FULL_BALANCE"
                      ? "border-[#1E5EFF] bg-blue-50/50 text-[#1E5EFF] dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-400 font-bold shadow-xs ring-1 ring-blue-500/30"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-surface-secondary dark:text-slate-300"
                  }`}
                >
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Full Outstanding Balance</div>
                  <div className="font-mono font-bold text-sm mt-0.5">{formatINR(maxPayable)}</div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">Clears entire course balance</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentType("CUSTOM")}
                  className={`rounded-xl border p-3 text-left transition-all cursor-pointer ${
                    paymentType === "CUSTOM"
                      ? "border-[#1E5EFF] bg-blue-50/50 text-[#1E5EFF] dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-400 font-bold shadow-xs ring-1 ring-blue-500/30"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-surface-secondary dark:text-slate-300"
                  }`}
                >
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Custom Partial Payment</div>
                  <div className="font-mono font-bold text-sm mt-0.5">Flexible Amount</div>
                  <div className="text-[10px] text-slate-400 mt-1">Enter any partial amount</div>
                </button>
              </div>
            </div>

            {/* Custom Amount Input */}
            {paymentType === "CUSTOM" && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Enter Partial Amount (₹):</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-500">₹</span>
                  <input
                    type="number"
                    min={500}
                    max={maxPayable}
                    step={100}
                    value={customAmount}
                    onChange={(e) => setCustomAmount(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-white pl-8 pr-4 py-2.5 text-sm font-mono font-bold text-slate-900 outline-none focus:border-[#1E5EFF] dark:border-slate-700 dark:bg-input-bg dark:text-white"
                  />
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Maximum payable: {formatINR(maxPayable)}
                </div>
              </div>
            )}

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Select Payment Method:</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {(["UPI", "BANK_TRANSFER", "CARD"] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`rounded-xl border p-2.5 text-center transition-all cursor-pointer ${
                      paymentMethod === method
                        ? "border-[#1E5EFF] bg-blue-50 dark:bg-blue-950/40 text-[#1E5EFF] dark:text-blue-400 font-bold shadow-xs ring-1 ring-blue-500/20"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-surface-secondary dark:text-slate-400"
                    }`}
                  >
                    {method === "UPI" && <QrCode className="h-4 w-4 mx-auto mb-1 text-[#1E5EFF] dark:text-blue-400" />}
                    {method === "BANK_TRANSFER" && <Building2 className="h-4 w-4 mx-auto mb-1 text-[#1E5EFF] dark:text-blue-400" />}
                    {method === "CARD" && <CreditCard className="h-4 w-4 mx-auto mb-1 text-[#1E5EFF] dark:text-blue-400" />}
                    <span>{method === "UPI" ? "UPI / QR" : method === "BANK_TRANSFER" ? "Bank Transfer" : "Card / NetBanking"}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Destination Details */}
            {paymentMethod === "UPI" && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-surface-secondary space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Official UPI ID for Transfer:</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard("jkslearning@icici", "upi")}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#1E5EFF] hover:underline cursor-pointer"
                  >
                    {copiedField === "upi" ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedField === "upi" ? "Copied" : "Copy UPI"}</span>
                  </button>
                </div>
                <div className="font-mono text-sm font-black text-slate-900 dark:text-white bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                  jkslearning@icici
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Open Google Pay, PhonePe, Paytm, or BHIM, send <strong>{formatINR(targetAmount)}</strong> to the UPI ID above, then enter the 12-digit UTR below.
                </p>
              </div>
            )}

            {paymentMethod === "BANK_TRANSFER" && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-surface-secondary space-y-2 text-xs">
                <div className="font-bold text-slate-700 dark:text-slate-300 mb-1">Company Bank Account Details:</div>
                <div className="space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Account Name:</span>
                    <strong className="text-slate-800 dark:text-slate-200">JKS Learning Technologies Pvt Ltd</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Account Number:</span>
                    <strong className="text-slate-800 dark:text-slate-200">123405009876</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Bank &amp; IFSC:</span>
                    <strong className="text-slate-800 dark:text-slate-200">ICICI Bank · ICIC0001234</strong>
                  </div>
                </div>
              </div>
            )}

            {/* UTR / Transaction Reference Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Transaction Reference / 12-Digit UTR <span className="text-rose-500">*</span>:</span>
                <span className="text-[10px] text-slate-400 font-normal">Found in your payment app receipt</span>
              </label>
              <input
                type="text"
                required
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="e.g. 528394829104 or TXN-998822"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 outline-none focus:border-[#1E5EFF] dark:border-slate-700 dark:bg-input-bg dark:text-white"
              />
            </div>

            {/* Notes / Remarks */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Payment Remarks / App Used (Optional):
              </label>
              <input
                type="text"
                value={studentRemarks}
                onChange={(e) => setStudentRemarks(e.target.value)}
                placeholder="e.g. Paid via PhonePe from HDFC account"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-[#1E5EFF] dark:border-slate-700 dark:bg-input-bg dark:text-white"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing || targetAmount <= 0}
                className="flex items-center gap-2 rounded-xl bg-[#1E5EFF] px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-600 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Submitting for Approval...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    <span>Submit Payment ({formatINR(targetAmount)})</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
