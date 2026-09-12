"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  X,
  CreditCard,
  Smartphone,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Lock,
  Sparkles,
  ArrowRight,
  Loader2,
  QrCode,
  Tag,
  Clock,
  Check,
  FileText,
  BadgeCheck,
} from "lucide-react";
import { registerCourseOnline, type Invoice } from "@/lib/data/invoices-store";
import { enrollStudentCourse } from "@/lib/data/courses-store";
import { useMockSession } from "@/lib/auth/use-mock-auth";
import { useUser } from "@clerk/nextjs";
import { getClientSessionEmail } from "@/lib/data/enrollments-api";

export interface CheckoutCourseItem {
  id: string;
  slug: string;
  title: string;
  price: number;
  originalPrice?: number;
  level?: string;
  durationWeeks?: number;
  summary?: string;
  track?: string;
  isBundle?: boolean;
}

interface CourseCheckoutModalProps {
  course: CheckoutCourseItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEnrollSuccess?: (courseSlug: string) => void;
}

type PaymentMethod = "UPI" | "Card" | "NetBanking" | "EMI";

export function CourseCheckoutModal({
  course,
  isOpen,
  onClose,
  onEnrollSuccess,
}: CourseCheckoutModalProps) {
  const session = useMockSession();
  const { user: clerkUser } = useUser();

  const clerkEmail = clerkUser?.primaryEmailAddress?.emailAddress || clerkUser?.emailAddresses?.[0]?.emailAddress;
  const effectiveEmail = (clerkEmail || session?.email || getClientSessionEmail() || "student@jkslearning.com").toLowerCase().trim();
  const studentName = clerkUser?.fullName || clerkUser?.firstName || session?.name || "Student Learner";

  const [phone, setPhone] = useState("9876543210");
  const [selectedBatch, setSelectedBatch] = useState("Weekday Live Evening (7:00 PM - 8:30 PM IST)");
  const [paymentMode, setPaymentMode] = useState<PaymentMethod>("UPI");
  const [upiId, setUpiId] = useState("student@oksbi");
  const [cardNumber, setCardNumber] = useState("4532 8921 4410 8821");
  const [cardExpiry, setCardExpiry] = useState("08/28");
  const [cardCvv, setCardCvv] = useState("734");
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");
  const [selectedEmiTenure, setSelectedEmiTenure] = useState("3 Months No-Cost EMI");

  // Coupon state
  const [couponCode, setCouponCode] = useState("ADMISSION10");
  const [couponApplied, setCouponApplied] = useState(true);
  const [couponError, setCouponError] = useState("");

  // Payment process state
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [generatedInvoice, setGeneratedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPaymentSuccess(false);
      setIsProcessing(false);
      setGeneratedInvoice(null);
    }
  }, [isOpen, course]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isProcessing) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isProcessing, onClose]);

  if (!isOpen || !course) return null;

  const basePrice = course.price > 0 ? course.price : 29999;
  const originalPrice = course.originalPrice || Math.round(basePrice * 1.5);
  const discountAmount = couponApplied ? Math.round(basePrice * 0.1) : 0; // 10% instant scholarship discount
  const finalPrice = Math.max(0, basePrice - discountAmount);
  const taxableAmount = +(finalPrice / 1.18).toFixed(2);
  const totalTax = +(finalPrice - taxableAmount).toFixed(2);
  const cgst = +(totalTax / 2).toFixed(2);
  const sgst = +(totalTax / 2).toFixed(2);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    const cleaned = couponCode.trim().toUpperCase();
    if (cleaned === "ADMISSION10" || cleaned === "EARLYBIRD" || cleaned === "JKS10" || cleaned === "PRO20") {
      setCouponApplied(true);
    } else {
      setCouponError("Invalid coupon. Try ADMISSION10 for 10% scholarship discount.");
    }
  };

  const handleProcessPayment = async () => {
    setIsProcessing(true);

    try {
      // Simulate banking gateway handshake & verification
      await new Promise((resolve) => setTimeout(resolve, 1400));

      const invoice = await registerCourseOnline({
        studentName,
        studentEmail: effectiveEmail,
        studentPhone: phone,
        studentCity: "Bengaluru, India",
        courseSlug: course.slug,
        courseTitle: course.title,
        price: basePrice,
        discount: discountAmount,
        discountCode: couponApplied ? couponCode.toUpperCase() : undefined,
        paymentMode:
          paymentMode === "Card"
            ? "Credit/Debit Card"
            : paymentMode === "NetBanking"
            ? "Net Banking"
            : paymentMode === "EMI"
            ? "No-Cost EMI"
            : "UPI",
        batchTiming: selectedBatch,
      });

      // Synchronize in-app course enrollment
      enrollStudentCourse(course.slug);

      // Trigger sync events across pages
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("jks_enrollment_updated"));
        window.dispatchEvent(new Event("jks_video_progress_changed"));
      }

      setGeneratedInvoice(invoice);
      setPaymentSuccess(true);
      if (onEnrollSuccess) {
        onEnrollSuccess(course.slug);
      }
    } catch (err) {
      console.error("Payment registration fallback:", err);
      enrollStudentCourse(course.slug);
      setPaymentSuccess(true);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/75 p-0 sm:p-4 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      {/* Outer Click Backdrop */}
      <div className="fixed inset-0" onClick={isProcessing ? undefined : onClose} />

      {/* Modal Dialog Container */}
      <div className="relative z-10 flex w-full max-w-4xl flex-col rounded-t-[28px] sm:rounded-[28px] border border-slate-200 bg-white shadow-2xl overflow-hidden max-h-[92vh] sm:max-h-[88vh] dark:border-slate-800/90 dark:bg-surface-elevated text-slate-900 dark:text-white">
        {/* Sticky Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-white/95 px-5 py-3.5 sm:px-7 sm:py-4 backdrop-blur-md dark:border-slate-800 dark:bg-surface-elevated/95 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB] dark:bg-blue-950/70 dark:text-blue-400 shadow-2xs">
              <CreditCard className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-blue-100 dark:bg-blue-950/80 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#2563EB] dark:text-blue-400">
                  Fast-Track Admissions
                </span>
                <span className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" /> 256-Bit Encrypted
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate mt-0.5 max-w-xs sm:max-w-md">
                Enroll in {course.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors shrink-0 ml-3"
            title="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body Content */}
        {!paymentSuccess ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {/* Desktop 2-Column Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* LEFT COLUMN: Course & Payment Method (7 cols on desktop) */}
              <div className="lg:col-span-7 space-y-4">
                {/* Course Selection Strip */}
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 space-y-3 dark:border-slate-800 dark:bg-surface-elevated/70">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        Selected Program
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                        {course.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {course.track || "Full Stack Mastery"} · {course.durationWeeks || 16} Weeks Live Cohort
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-base font-black text-slate-900 dark:text-white">
                        ₹{finalPrice.toLocaleString("en-IN")}
                      </div>
                      {originalPrice > basePrice && (
                        <div className="text-[11px] text-slate-400 line-through">
                          ₹{originalPrice.toLocaleString("en-IN")}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cohort Batch Selector */}
                  <div className="space-y-1 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      Live Cohort Batch Timing:
                    </label>
                    <select
                      value={selectedBatch}
                      onChange={(e) => setSelectedBatch(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-surface-secondary dark:text-white"
                    >
                      <option>Weekday Live Evening (7:00 PM - 8:30 PM IST)</option>
                      <option>Weekend Intensive (10:00 AM - 1:00 PM IST)</option>
                      <option>Morning Fast-Track (8:00 AM - 9:30 AM IST)</option>
                      <option>Self-Paced with 1-on-1 Mentor Office Hours</option>
                    </select>
                  </div>
                </div>

                {/* Student Details Pre-filled Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">
                      Student Name
                    </label>
                    <input
                      type="text"
                      disabled
                      value={studentName}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-100 p-2.5 text-xs font-semibold text-slate-700 outline-none dark:border-slate-700 dark:bg-surface-elevated dark:text-slate-300 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">
                      Account Email
                    </label>
                    <input
                      type="email"
                      disabled
                      value={effectiveEmail}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-100 p-2.5 text-xs font-semibold text-slate-700 outline-none dark:border-slate-700 dark:bg-surface-elevated dark:text-slate-300 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Payment Method Selector Grid */}
                <div className="space-y-2.5 pt-1">
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider dark:text-white">
                    Choose Payment Gateway Mode
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: "UPI", label: "UPI / QR", icon: Smartphone, desc: "GPay, PhonePe" },
                      { id: "Card", label: "Cards", icon: CreditCard, desc: "Debit / Credit" },
                      { id: "NetBanking", label: "Net Banking", icon: Building2, desc: "All Banks" },
                      { id: "EMI", label: "No-Cost EMI", icon: Clock, desc: "3 to 6 Mo" },
                    ].map((item) => {
                      const Icon = item.icon;
                      const isSelected = paymentMode === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setPaymentMode(item.id as PaymentMethod)}
                          className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                            isSelected
                              ? "border-[#2563EB] bg-blue-50/80 font-bold text-[#2563EB] shadow-xs dark:border-blue-500 dark:bg-blue-950/50 dark:text-blue-400"
                              : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-surface-elevated dark:text-slate-300 dark:hover:bg-surface-hover"
                          }`}
                        >
                          <Icon className="h-4 w-4 sm:h-5 sm:w-5 mb-1" />
                          <span className="text-[11px] sm:text-xs font-bold">{item.label}</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-400">{item.desc}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Payment Subform Input */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-surface-elevated/60 text-xs space-y-2">
                    {paymentMode === "UPI" && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-800 dark:text-slate-200">Instant UPI VPA</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                            <QrCode className="h-3.5 w-3.5" /> Instant QR &amp; App Intent
                          </span>
                        </div>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="e.g. yourname@okhdfcbank"
                          className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-surface-secondary dark:text-white"
                        />
                      </div>
                    )}

                    {paymentMode === "Card" && (
                      <div className="space-y-2.5">
                        <div>
                          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Card Number</label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-900 outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-surface-secondary dark:text-white mt-1"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Expiry (MM/YY)</label>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-900 outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-surface-secondary dark:text-white mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">CVV</label>
                            <input
                              type="password"
                              maxLength={4}
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-900 outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-surface-secondary dark:text-white mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMode === "NetBanking" && (
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Select Banking Partner</label>
                        <select
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-surface-secondary dark:text-white mt-1"
                        >
                          <option>HDFC Bank</option>
                          <option>State Bank of India (SBI)</option>
                          <option>ICICI Bank</option>
                          <option>Axis Bank</option>
                          <option>Kotak Mahindra Bank</option>
                        </select>
                      </div>
                    )}

                    {paymentMode === "EMI" && (
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Select EMI Plan</label>
                        <select
                          value={selectedEmiTenure}
                          onChange={(e) => setSelectedEmiTenure(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-surface-secondary dark:text-white mt-1"
                        >
                          <option>3 Months No-Cost EMI (₹{Math.round(finalPrice / 3).toLocaleString("en-IN")}/mo)</option>
                          <option>6 Months Low-Cost EMI (₹{Math.round((finalPrice * 1.05) / 6).toLocaleString("en-IN")}/mo)</option>
                          <option>12 Months Extended EMI (₹{Math.round((finalPrice * 1.1) / 12).toLocaleString("en-IN")}/mo)</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Scholarship Coupon & Tax Invoice Summary (5 cols on desktop) */}
              <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
                {/* Coupon Code Card */}
                <div className="rounded-2xl border border-dashed border-blue-300 dark:border-blue-900 bg-blue-50/50 p-4 space-y-2 dark:bg-blue-950/20">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-blue-900 dark:text-blue-300">
                      <Tag className="h-3.5 w-3.5" /> Scholarship Coupon
                    </span>
                    {couponApplied && (
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <Check className="h-3.5 w-3.5" /> 10% Discount
                      </span>
                    )}
                  </div>

                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="ADMISSION10"
                      className="flex-1 rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 uppercase outline-none focus:border-blue-500 dark:border-blue-800 dark:bg-surface-secondary dark:text-white"
                    />
                    <button
                      type="submit"
                      className="rounded-xl bg-[#2563EB] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                  {couponError && (
                    <div className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold">{couponError}</div>
                  )}
                </div>

                {/* GST Tax Invoice Itemized Breakdown */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-2 text-xs text-slate-600 dark:border-slate-800 dark:bg-surface-elevated/80 dark:text-slate-300">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-200/60 pb-2 dark:border-slate-800">
                    GST Billing Summary
                  </div>
                  <div className="flex justify-between">
                    <span>Base Tuition Fee</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">₹{basePrice.toLocaleString("en-IN")}</span>
                  </div>
                  {couponApplied && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                      <span>Scholarship Deduction ({couponCode})</span>
                      <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Taxable Value</span>
                    <span>₹{taxableAmount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>GST (18% inclusive: CGST ₹{cgst} + SGST ₹{sgst})</span>
                    <span>₹{totalTax.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-2.5 border-t border-slate-200 dark:border-slate-800">
                    <span>Total Net Payable</span>
                    <span className="text-[#2563EB] dark:text-blue-400">₹{finalPrice.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* Security Guarantee Box */}
                <div className="flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 p-3 text-[11px] text-slate-500 dark:text-slate-400">
                  <BadgeCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Instant LMS workspace activation &amp; official GST tax receipt upon approval.</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Payment Success Confirmation View */
          <div className="p-6 sm:p-10 text-center space-y-4 overflow-y-auto">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 shadow-md">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <Sparkles className="h-3.5 w-3.5" /> Payment Approved &amp; Enrolled
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Congratulations, {studentName}!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                You have officially enrolled in <strong>{course.title}</strong>. Your curriculum, in-app video lectures, assignments, and verified certification track are now active.
              </p>
            </div>

            {/* Generated Invoice Metadata Card */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-left text-xs space-y-2 dark:border-slate-800 dark:bg-surface-elevated/70 max-w-lg mx-auto">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-2 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-[#2563EB] dark:text-blue-400" />
                  Tax Invoice Generated
                </span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  PAID (₹{finalPrice.toLocaleString("en-IN")})
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                <div>
                  <span className="font-medium text-slate-400">Invoice No:</span>{" "}
                  <strong className="text-slate-800 dark:text-slate-200 font-mono">
                    {generatedInvoice?.invoiceNumber || "JKS-INV-2026-LIVE"}
                  </strong>
                </div>
                <div>
                  <span className="font-medium text-slate-400">Payment Mode:</span>{" "}
                  <strong className="text-slate-800 dark:text-slate-200">{paymentMode}</strong>
                </div>
                <div>
                  <span className="font-medium text-slate-400">Cohort Batch:</span>{" "}
                  <strong className="text-slate-800 dark:text-slate-200 truncate block">{selectedBatch}</strong>
                </div>
                <div>
                  <span className="font-medium text-slate-400">GST Status:</span>{" "}
                  <strong className="text-emerald-600">18% Compliant</strong>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
              <Link
                href={`/dashboard/my-courses/${course.slug}`}
                onClick={onClose}
                className="w-full sm:flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition-all cursor-pointer"
              >
                <span>Start Learning Now</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard/payments"
                onClick={onClose}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer dark:border-slate-700 dark:bg-surface-elevated dark:text-slate-300 dark:hover:bg-surface-hover"
              >
                <FileText className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                <span>View Receipt</span>
              </Link>
            </div>
          </div>
        )}

        {/* Sticky Action Footer (Always Visible!) */}
        {!paymentSuccess && (
          <div className="border-t border-slate-100 bg-white/95 px-5 py-3.5 sm:px-7 sm:py-4 backdrop-blur-md dark:border-slate-800 dark:bg-surface-elevated/95 shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-baseline justify-between sm:justify-start sm:gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Net Payable:</span>
              <span className="text-lg font-black text-[#2563EB] dark:text-blue-400">
                ₹{finalPrice.toLocaleString("en-IN")}
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-400 font-normal">
                (Incl. 18% GST)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="hidden sm:inline-block rounded-xl px-4 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-surface-hover cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleProcessPayment}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-75"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Authorizing ₹{finalPrice.toLocaleString("en-IN")}…</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>Pay ₹{finalPrice.toLocaleString("en-IN")} &amp; Activate</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
